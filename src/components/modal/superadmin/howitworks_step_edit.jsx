import { useState, useEffect } from "react";
import ConfirmExitDialog from "./ConfirmExitDialog";

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

// ═══════════════════════════════════════════════════════════════════
// HOW IT WORKS STEP EDIT MODAL
// ═══════════════════════════════════════════════════════════════════

export const HowItWorksStepEditModal = ({
  isOpen,
  stepId,
  howitworksSteps,
  setHowitworksSteps,
  uploadedSvgs,
  setUploadedSvgs,
  onClose,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [localTitle, setLocalTitle] = useState("");
  const [localDesc, setLocalDesc] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && stepId !== null && howitworksSteps[stepId]) {
      setLocalTitle(howitworksSteps[stepId].title || "");
      setLocalDesc(howitworksSteps[stepId].desc || "");
    }
  }, [isOpen, stepId, howitworksSteps]);

  const step = isOpen && stepId !== null && howitworksSteps[stepId] ? howitworksSteps[stepId] : null;

  const handleSave = () => {
    if (!step || stepId === null) return;
    const updated = [...howitworksSteps];
    updated[stepId].title = localTitle;
    updated[stepId].desc = localDesc;
    setHowitworksSteps(updated);
    onClose();
  };

  const handleCloseClick = () => {
    // Always show confirmation dialog when trying to exit
    setShowConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowConfirm(false);
    onClose();
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
    if (!step || stepId === null) return;
    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const iconId = `svg_${Date.now()}`;
        setUploadedSvgs({
          ...uploadedSvgs,
          [iconId]: event.target.result,
        });
        const updated = [...howitworksSteps];
        updated[stepId].icon = iconId;
        setHowitworksSteps(updated);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an SVG file");
    }
  };

  const isUploadedSvg = step && step.icon && step.icon.startsWith("svg_");

  return (
    <>
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: isOpen && stepId !== null && step ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        fontFamily: "Inter, sans-serif",
      }}
      onClick={handleCloseClick}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "28px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {step ? (
          <>
        {/* Header with Close Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
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
            Edit Step {stepId + 1}
          </h2>
          <button
            onClick={handleCloseClick}
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

        {/* Title Field */}
        <div style={{ marginBottom: "20px" }}>
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
            Step Title
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
            placeholder="Enter step title"
          />
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: "24px" }}>
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
            Description
          </label>
          <textarea
            value={localDesc}
            onChange={(e) => setLocalDesc(e.target.value)}
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
              minHeight: "100px",
              resize: "vertical",
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
            placeholder="Enter step description"
          />
        </div>

        {/* Icon Picker */}
        <div style={{ marginBottom: "24px" }}>
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
              id={`svg-upload-${stepId}`}
            />
            <label
              htmlFor={`svg-upload-${stepId}`}
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

          {/* Default Icon Status */}
          {(step.icon === "calendar" || step.icon === "bell" || step.icon === "check") && (
            <div
              style={{
                marginTop: "12px",
                fontSize: "12px",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              ℹ️ Currently using default icon. Upload an SVG to replace it.
            </div>
          )}

          {/* Icon Preview */}
          {isUploadedSvg && (
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
                  src={uploadedSvgs[step.icon]}
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

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "28px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(221, 144, 29, 0.15)",
          }}
        >
          <button
            onClick={handleCloseClick}
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
          </>
        ) : null}
      </div>
    </div>

    <ConfirmExitDialog
      isOpen={showConfirm}
      onConfirm={handleConfirmExit}
      onCancel={() => setShowConfirm(false)}
      title="Close Editor?"
      message="Are you sure you want to close without saving?"
    />
  </>
  );
};
