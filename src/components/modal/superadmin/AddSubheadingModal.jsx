import React, { useState, useEffect } from "react";

export default function AddSubheadingModal({
  isOpen,
  onClose,
  sections,
  onAddSubheading,
}) {
  const [selectedSection, setSelectedSection] = useState("");
  const [subheadingText, setSubheadingText] = useState("");

  useEffect(() => {
    if (isOpen && sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0].id);
    }
  }, [isOpen, sections, selectedSection]);

  const handleDone = () => {
    if (selectedSection && subheadingText.trim()) {
      onAddSubheading(selectedSection, subheadingText);
      setSubheadingText("");
      setSelectedSection("");
      onClose();
    } else {
      alert("Please select a section and enter a subheading.");
    }
  };

  const handleCancel = () => {
    setSubheadingText("");
    setSelectedSection("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
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
        <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#dd901d" }}>
          Add Subheading
        </h2>

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

        {/* Subheading Input */}
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
            Subheading Text
          </label>
          <textarea
            value={subheadingText}
            onChange={(e) => setSubheadingText(e.target.value)}
            placeholder="Enter subheading text..."
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
            onClick={handleDone}
            style={{
              padding: "10px 20px",
              background: "#dd901d",
              border: "none",
              borderRadius: "6px",
              color: "#1a1a1a",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#c97c1c")}
            onMouseLeave={(e) => (e.target.style.background = "#dd901d")}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
