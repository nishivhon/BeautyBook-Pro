import React, { useState } from "react";
import ConfirmExitDialog from "./ConfirmExitDialog";

export default function AddSectionModal({
  isOpen,
  onClose,
  draftSection,
  setDraftSection,
  onAddSection,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("exit"); // "exit" or "save"

  const hasChanges = draftSection.title.trim() !== "" || draftSection.subtitle.trim() !== "";

  const handleAddSection = () => {
    if (!draftSection.title || !draftSection.title.trim()) {
      alert("Please enter a section title.");
      return;
    }
    setConfirmType("save");
    setShowConfirm(true);
  };

  const handleConfirmAdd = () => {
    onAddSection();
    setShowConfirm(false);
    setConfirmType("exit");
    setDraftSection({ title: "", subtitle: "" });
    onClose();
  };

  const handleCloseClick = () => {
    setConfirmType("exit");
    setShowConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowConfirm(false);
    setConfirmType("exit");
    setDraftSection({ title: "", subtitle: "" });
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
        background: "rgba(0, 0, 0, 0.6)",
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
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1.5px solid #dd901d",
          maxWidth: "450px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: 0 }}>Add Draft Section</h2>
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
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#dd901d", display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Section Title</label>
          <input
            type="text"
            value={draftSection.title}
            onChange={(e) => setDraftSection({ ...draftSection, title: e.target.value })}
            placeholder="Enter section title"
            style={{
              width: "100%",
              padding: "10px",
              background: "#2a2a2a",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#dd901d", display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Section Subtitle</label>
          <textarea
            value={draftSection.subtitle}
            onChange={(e) => setDraftSection({ ...draftSection, subtitle: e.target.value })}
            placeholder="Enter section subtitle (optional)"
            style={{
              width: "100%",
              padding: "10px",
              background: "#2a2a2a",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              minHeight: "80px",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleAddSection}
            disabled={!draftSection.title || !draftSection.title.trim()}
            style={{
              flex: 1,
              padding: "12px",
              background: !draftSection.title || !draftSection.title.trim() ? "#666" : "#dd901d",
              border: "none",
              borderRadius: "6px",
              color: !draftSection.title || !draftSection.title.trim() ? "#999" : "#1a1a1a",
              fontWeight: "600",
              cursor: !draftSection.title || !draftSection.title.trim() ? "not-allowed" : "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
              opacity: !draftSection.title || !draftSection.title.trim() ? 0.6 : 1,
              pointerEvents: !draftSection.title || !draftSection.title.trim() ? "none" : "auto",
            }}
            onMouseEnter={(e) => {
              if (draftSection.title && draftSection.title.trim()) {
                e.target.style.background = "#c97c1c";
              }
            }}
            onMouseLeave={(e) => {
              if (draftSection.title && draftSection.title.trim()) {
                e.target.style.background = "#dd901d";
              }
            }}
            title={!draftSection.title || !draftSection.title.trim() ? "Please enter a section title" : ""}
          >
            Done
          </button>
          <button
            onClick={handleCloseClick}
            style={{
              flex: 1,
              padding: "12px",
              background: "transparent",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "#dd901d",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(221, 144, 29, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <ConfirmExitDialog
      isOpen={showConfirm}
      onConfirm={confirmType === "save" ? handleConfirmAdd : handleConfirmExit}
      onCancel={() => {
        setShowConfirm(false);
        setConfirmType("exit");
      }}
      title={confirmType === "save" ? "Add Section?" : "Discard Changes?"}
      message={
        confirmType === "save"
          ? "Are you sure you want to add this section? This action cannot be undone."
          : "You have unsaved changes. Are you sure you want to exit without saving?"
      }
      confirmButtonLabel={confirmType === "save" ? "Add Section" : "Discard Changes"}
      cancelButtonLabel={confirmType === "save" ? "Cancel" : "Continue Editing"}
    />
    </>
  );
}
