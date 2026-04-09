import React, { useState, useEffect } from "react";
import ConfirmExitDialog from "./ConfirmExitDialog";

export default function AddTitleModal({
  isOpen,
  onClose,
  sections,
  onAddTitle,
}) {
  const [selectedSection, setSelectedSection] = useState("");
  const [titleText, setTitleText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0].id);
    }
  }, [isOpen, sections, selectedSection]);

  const hasChanges = titleText.trim() !== "";

  const handleCloseClick = () => {
    // Always show confirmation dialog when trying to exit
    setShowConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowConfirm(false);
    setTitleText("");
    setSelectedSection("");
    onClose();
  };

  const handleDone = () => {
    // Validation: Ensure section is selected
    if (!selectedSection) {
      alert("Please select a section.");
      return;
    }
    // Validation: Ensure title is not empty
    if (!titleText.trim()) {
      alert("Please enter a title.");
      return;
    }
    onAddTitle(selectedSection, titleText);
    setTitleText("");
    setSelectedSection("");
    onClose();
  };

  const handleCancel = () => {
    setTitleText("");
    setSelectedSection("");
    onClose();
  };

  return (
    <>
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: isOpen ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={handleCloseClick}
    >
      <div
        style={{
          background: "#1a1a1a",
          border: "1.5px solid #dd901d",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          minWidth: "420px",
          maxWidth: "500px",
          color: "white",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ marginTop: 0, marginBottom: 0, color: "#dd901d" }}>Add Title</h2>
          <button
            onClick={handleCloseClick}
            style={{
              background: "transparent",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "24px",
              padding: "0",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.color = "#dd901d"}
            onMouseLeave={(e) => e.target.style.color = "#888"}
            title="Close modal"
          >
            ×
          </button>
        </div>

        {/* Section Selector */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#ccc",
            }}
          >
            Select Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#0a0908",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "white",
              fontSize: "13px",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <option value="">-- Choose a section --</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#ccc",
            }}
          >
            Title Text
          </label>
          <textarea
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            placeholder="Enter title text..."
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#0a0908",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "white",
              fontSize: "13px",
              boxSizing: "border-box",
              minHeight: "80px",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: "1.5px solid #666",
              borderRadius: "6px",
              color: "#ccc",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#999";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#666";
              e.target.style.color = "#ccc";
            }}
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDone();
            }}
            disabled={!selectedSection || !titleText.trim()}
            style={{
              padding: "10px 20px",
              background: (!selectedSection || !titleText.trim()) ? "#666" : "#dd901d",
              border: "none",
              borderRadius: "6px",
              color: (!selectedSection || !titleText.trim()) ? "#999" : "#1a1a1a",
              cursor: (!selectedSection || !titleText.trim()) ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              opacity: (!selectedSection || !titleText.trim()) ? 0.6 : 1,
              pointerEvents: (!selectedSection || !titleText.trim()) ? "none" : "auto",
            }}
            onMouseEnter={(e) => {
              if (!selectedSection || !titleText.trim()) return;
              e.target.style.background = "#c97c1c";
            }}
            onMouseLeave={(e) => {
              if (!selectedSection || !titleText.trim()) return;
              e.target.style.background = "#dd901d";
            }}
            title={
              !selectedSection ? "Please select a section" :
              !titleText.trim() ? "Please enter a title" :
              ""
            }
          >
            Done
          </button>
        </div>
      </div>
    </div>

    <ConfirmExitDialog
      isOpen={showConfirm}
      onConfirm={handleConfirmExit}
      onCancel={() => setShowConfirm(false)}
      title="Discard Changes?"
      message="You have unsaved changes. Are you sure you want to exit without saving?"
    />
    </>
  );
}
