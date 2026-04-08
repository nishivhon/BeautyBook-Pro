import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L6.5 12.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 7l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l-1-12M10 11v6M14 11v6M5 7h14M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// SERVICE EDIT MODAL
// ═══════════════════════════════════════════════════════════════════

export const ServiceEditModal = ({
  isOpen,
  serviceIndex,
  services,
  setServices,
  uploadedSvgs,
  setUploadedSvgs,
  onClose,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [localTitle, setLocalTitle] = useState("");
  const [localItems, setLocalItems] = useState([]);
  const [newItemInput, setNewItemInput] = useState("");

  useEffect(() => {
    if (isOpen && serviceIndex !== null && services && services[serviceIndex]) {
      setLocalTitle(services[serviceIndex].title || "");
      setLocalItems([...(services[serviceIndex].items || [])]);
      setNewItemInput("");
    }
  }, [isOpen, serviceIndex, services]);

  // Hide scrollbar CSS (inject once)
  useEffect(() => {
    if (!document.getElementById("service-modal-scrollbar-style")) {
      const style = document.createElement("style");
      style.id = "service-modal-scrollbar-style";
      style.textContent = ".service-modal-no-scrollbar::-webkit-scrollbar { display: none; }";
      document.head.appendChild(style);
    }
  }, []);

  if (!isOpen) return null;
  if (serviceIndex === null || !services || !services[serviceIndex]) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: "28px",
            color: "#f5f5f5",
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p>Unable to load service data. Please try again.</p>
          <button
            onClick={onClose}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              backgroundColor: "#dd901d",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#1a1a1a",
              fontWeight: "600",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const service = services[serviceIndex];

  const handleSave = () => {
    const updated = [...services];
    updated[serviceIndex].title = localTitle;
    updated[serviceIndex].items = localItems;
    setServices(updated);
    onClose();
  };

  const handleCancel = () => {
    setLocalTitle(services[serviceIndex].title || "");
    setLocalItems([...(services[serviceIndex].items || [])]);
    setNewItemInput("");
    onClose();
  };

  const handleAddItem = () => {
    if (newItemInput.trim()) {
      setLocalItems([...localItems, newItemInput.trim()]);
      setNewItemInput("");
    }
  };

  const handleRemoveItem = (index) => {
    setLocalItems(localItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, value) => {
    const updated = [...localItems];
    updated[index] = value;
    setLocalItems(updated);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const iconId = `svg_${Date.now()}`;
        setUploadedSvgs({
          ...uploadedSvgs,
          [iconId]: event.target.result,
        });
        const updated = [...services];
        updated[serviceIndex].icon = iconId;
        setServices(updated);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an SVG file");
    }
  };

  const isUploadedSvg = service && service.icon && typeof service.icon === "string" && service.icon.startsWith("svg_");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          position: "relative",
          zIndex: 1002,
        }}
        className="service-modal-no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              color: "#f5f5f5",
            }}
          >
            Edit Service
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b0ada5",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#dd901d")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#b0ada5")}
            title="Close modal"
          >
            <CloseIcon size={24} color="currentColor" />
          </button>
        </div>

        {/* Service Title Field */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Service Title
          </label>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid rgba(221, 144, 29, 0.3)",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              boxSizing: "border-box",
              backgroundColor: "rgba(221, 144, 29, 0.08)",
              color: "#f5f5f5",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
              e.target.style.backgroundColor = "rgba(221, 144, 29, 0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
              e.target.style.backgroundColor = "rgba(221, 144, 29, 0.08)";
            }}
            placeholder="Enter service title"
          />
        </div>

        {/* Icon Picker */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Icon (SVG)
          </label>

          {/* Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive
                ? "2px solid #dd901d"
                : "2px dashed rgba(221, 144, 29, 0.4)",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backgroundColor: dragActive
                ? "rgba(221, 144, 29, 0.15)"
                : "rgba(221, 144, 29, 0.05)",
            }}
          >
            <input
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              id={`svg-upload-service-${serviceIndex}`}
            />
            <label
              htmlFor={`svg-upload-service-${serviceIndex}`}
              style={{
                cursor: "pointer",
                display: "block",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "8px",
                }}
              >
                📤
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#b0ada5",
                  fontWeight: "500",
                }}
              >
                Drag and drop SVG here or{" "}
                <span style={{ color: "#dd901d", fontWeight: "600" }}>
                  click to browse
                </span>
              </div>
            </label>
          </div>

          {/* Icon Preview */}
          {isUploadedSvg && uploadedSvgs && uploadedSvgs[service.icon] && (
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#dd901d",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Current Icon Preview
              </div>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  border: "2px solid rgba(221, 144, 29, 0.5)",
                  borderRadius: "8px",
                  padding: "8px",
                  backgroundColor: "rgba(221, 144, 29, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={uploadedSvgs[service.icon]}
                  alt="Selected icon"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Service Items */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Service Items
          </label>

          {/* Items List */}
          <div style={{ marginBottom: "16px" }}>
            {localItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "8px",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "1px solid rgba(221, 144, 29, 0.3)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    backgroundColor: "rgba(221, 144, 29, 0.08)",
                    color: "#f5f5f5",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
                    e.target.style.backgroundColor = "rgba(221, 144, 29, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
                    e.target.style.backgroundColor = "rgba(221, 144, 29, 0.08)";
                  }}
                  placeholder="Service item name"
                />
                <button
                  onClick={() => handleRemoveItem(index)}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid rgba(221, 144, 29, 0.3)",
                    backgroundColor: "transparent",
                    borderRadius: "6px",
                    cursor: "pointer",
                    color: "#ff6b6b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 107, 107, 0.1)";
                    e.target.style.borderColor = "rgba(255, 107, 107, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
                  }}
                  title="Remove item"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Item */}
          {localItems.length < 4 && (
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddItem();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "1px solid rgba(221, 144, 29, 0.3)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  backgroundColor: "rgba(221, 144, 29, 0.08)",
                  color: "#f5f5f5",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
                  e.target.style.backgroundColor = "rgba(221, 144, 29, 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
                  e.target.style.backgroundColor = "rgba(221, 144, 29, 0.08)";
                }}
                placeholder="Add new service item"
              />
              <button
                onClick={handleAddItem}
                style={{
                  padding: "10px 16px",
                  border: "1px solid rgba(221, 144, 29, 0.4)",
                  backgroundColor: "transparent",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#dd901d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
                }}
              >
                <PlusIcon />
                Add
              </button>
            </div>
          )}
          {localItems.length >= 4 && (
            <div style={{ fontSize: "12px", color: "#888", fontStyle: "italic", marginTop: "8px" }}>
              Maximum 4 items allowed
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "20px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(221, 144, 29, 0.15)",
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              padding: "11px 24px",
              border: "1px solid rgba(221, 144, 29, 0.4)",
              backgroundColor: "transparent",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "11px 24px",
              border: "none",
              backgroundColor: "#dd901d",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a1a",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#c97c1c";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 16px rgba(221, 144, 29, 0.3)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#dd901d";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <CheckIcon />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
