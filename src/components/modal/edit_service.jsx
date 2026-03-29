import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export const EditServiceModal = ({ isOpen, service, onClose, onSave, onRemove, categories = [] }) => {
  const [formData, setFormData] = useState({ name: "", meta: "", available: true, price: "", category: "" });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Sync form data when service changes
  useEffect(() => {
    if (service) {
      setFormData(service);
      setIsNewCategory(false);
      setNewCategoryName("");
    }
  }, [service, isOpen]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value) => {
    if (value === "new") {
      setIsNewCategory(true);
      setFormData(prev => ({ ...prev, category: "" }));
    } else {
      setIsNewCategory(false);
      setNewCategoryName("");
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleNewCategoryChange = (value) => {
    setNewCategoryName(value);
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setFormData({ name: "", meta: "", available: true, price: "", category: "" });
    setIsNewCategory(false);
    setNewCategoryName("");
  };

  const handleCancel = () => {
    setFormData({ name: "", meta: "", available: true, price: "", category: "" });
    setIsNewCategory(false);
    setNewCategoryName("");
    onClose();
  };

  const handleRemove = () => {
    if (onRemove && service) {
      onRemove(service);
      setFormData({ name: "", meta: "", available: true, price: "", category: "" });
      setIsNewCategory(false);
      setNewCategoryName("");
    }
  };

  const isCreating = service?._isNew === true;
  const modalTitle = isCreating ? "Add New Service" : "Edit Service";

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(221, 144, 29, 0.2)"
      }}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#f5f5f5",
            margin: 0
          }}>{modalTitle}</h2>
          <button
            onClick={handleCancel}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#988f81",
              transition: "color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.color = "#dd901d"}
            onMouseOut={(e) => e.target.style.color = "#988f81"}
          >
            <CloseIcon size={20} color="currentColor" />
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          {/* Service Name */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Category</label>
            <select
              value={isNewCategory ? "new" : formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
                cursor: "pointer"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="new">+ Create New Category</option>
            </select>
          </div>

          {/* New Category Input (shown when creating new category) */}
          {isNewCategory && (
            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px"
              }}>New Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => handleNewCategoryChange(e.target.value)}
                placeholder="Enter new category name"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: "1px solid rgba(221, 144, 29, 0.3)",
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Description</label>
            <textarea
              value={formData.meta}
              onChange={(e) => handleFormChange("meta", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                minHeight: "100px",
                resize: "vertical",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>

          {/* Price */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Price</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleFormChange("price", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>

          {/* Availability Toggle */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            justifyContent: "space-between"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <label style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#dd901d"
              }}>Status</label>
              <button
                onClick={() => handleFormChange("available", !formData.available)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: formData.available ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  border: `1px solid ${formData.available ? "#22c55e" : "#ef4444"}`,
                  borderRadius: "6px",
                  color: formData.available ? "#22c55e" : "#ef4444",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "0.8";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "1";
                }}
              >
                {formData.available ? "Available" : "Not Available"}
              </button>
            </div>

            {/* Remove button - only shown when editing */}
            {!isCreating && (
              <button
                onClick={handleRemove}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(239, 68, 68, 0.3)";
                  e.target.style.borderColor = "#dc2626";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                  e.target.style.borderColor = "#ef4444";
                }}
              >
                Remove Service
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              border: "1px solid rgba(221, 144, 29, 0.4)",
              color: "#dd901d",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease"
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
              padding: "12px 24px",
              backgroundColor: "#dd901d",
              color: "#1a1a1a",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#e6a326"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#dd901d"}
          >
            {isCreating ? "Add Service" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
