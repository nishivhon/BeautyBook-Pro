// ─── Arrow Icons ─────────────────────────────────────────────────────────────

import { useState } from "react";
import ConfirmExitDialog from "./ConfirmExitDialog";

const UpArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M5 15l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16" width="20" height="20">
    <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function NavigateSectionsModal({
  isOpen,
  onClose,
  sectionOrder,
  setSectionOrder,
  hiddenSections,
  setHiddenSections,
  customSections,
  setCustomSections,
  onClearSection,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseClick = () => {
    // Always show confirmation dialog when trying to exit
    setShowConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowConfirm(false);
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
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#dd901d transparent",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: 0 }}>Navigate Sections</h2>
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
        
        <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>Reorder, toggle visibility, and manage section contents</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sectionOrder.map((sectionId, index) => {
            const sectionLabels = {
              hero: "Hero Section",
              howitworks: "How It Works",
              services: "Services",
              footer: "Footer",
            };
            
            if (sectionId.startsWith('custom-')) {
              const customSection = customSections.find(s => s.id === sectionId);
              if (customSection) sectionLabels[sectionId] = customSection.title;
            }
            
            const isHidden = hiddenSections[sectionId];

            return (
              <div key={sectionId} style={{
                background: "#2a2a2a",
                border: "1.5px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s ease",
              }}>
                {/* Section number and label */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
                    {sectionLabels[sectionId]}
                    {sectionId === "footer" && <span style={{ color: "#dd901d", fontSize: "11px" }}> (Locked)</span>}
                  </div>
                  <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>
                    {sectionId === "footer" ? "Always at bottom" : (isHidden ? "Hidden" : "Visible")}
                  </div>
                </div>

                {/* Move Up Button */}
                <button
                  onClick={() => {
                    if (index > 0 && sectionId !== "footer") {
                      const newOrder = [...sectionOrder];
                      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                      setSectionOrder(newOrder);
                    }
                  }}
                  disabled={index === 0 || sectionId === "footer"}
                  style={{
                    background: (index === 0 || sectionId === "footer") ? "#3a3a3a" : "#dd901d",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px",
                    cursor: (index === 0 || sectionId === "footer") ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: (index === 0 || sectionId === "footer") ? 0.5 : 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (index !== 0 && sectionId !== "footer") e.target.style.background = "#c97c1c";
                  }}
                  onMouseLeave={(e) => {
                    if (index !== 0 && sectionId !== "footer") e.target.style.background = "#dd901d";
                  }}
                  title={sectionId === "footer" ? "Footer is locked at bottom" : "Move up"}
                >
                  <UpArrowIcon />
                </button>

                {/* Move Down Button */}
                <button
                  onClick={() => {
                    if (index < sectionOrder.length - 1 && sectionId !== "footer") {
                      const newOrder = [...sectionOrder];
                      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                      setSectionOrder(newOrder);
                    }
                  }}
                  disabled={index === sectionOrder.length - 1 || sectionId === "footer"}
                  style={{
                    background: (index === sectionOrder.length - 1 || sectionId === "footer") ? "#3a3a3a" : "#dd901d",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px",
                    cursor: (index === sectionOrder.length - 1 || sectionId === "footer") ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: (index === sectionOrder.length - 1 || sectionId === "footer") ? 0.5 : 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (index !== sectionOrder.length - 1 && sectionId !== "footer") e.target.style.background = "#c97c1c";
                  }}
                  onMouseLeave={(e) => {
                    if (index !== sectionOrder.length - 1 && sectionId !== "footer") e.target.style.background = "#dd901d";
                  }}
                  title={sectionId === "footer" ? "Footer is locked at bottom" : "Move down"}
                >
                  <DownArrowIcon />
                </button>

                {/* Toggle Visibility Button */}
                <button
                  onClick={() => {
                    setHiddenSections({
                      ...hiddenSections,
                      [sectionId]: !isHidden,
                    });
                  }}
                  style={{
                    background: isHidden ? "rgba(221, 144, 29, 0.3)" : "#dd901d",
                    border: "1.5px solid " + (isHidden ? "#dd901d" : "transparent"),
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    color: isHidden ? "#dd901d" : "#1a1a1a",
                    fontSize: "12px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                  }}
                  title="Toggle visibility"
                >
                  {isHidden ? "Show" : "Hide"}
                </button>

                {/* Delete/Clear Button */}
                {sectionId !== "footer" && (
                  <button
                    onClick={() => {
                      const actionType = sectionId.startsWith('custom-') ? "Delete this section" : `Clear all contents in ${sectionLabels[sectionId]}`;
                      if (window.confirm(`${actionType}?`)) {
                        if (sectionId.startsWith('custom-')) {
                          // Remove custom section from array
                          setCustomSections(customSections.filter(s => s.id !== sectionId));
                          // Remove from sectionOrder
                          setSectionOrder(sectionOrder.filter(id => id !== sectionId));
                          // Remove from hidden sections
                          const newHiddenSections = { ...hiddenSections };
                          delete newHiddenSections[sectionId];
                          setHiddenSections(newHiddenSections);
                        } else {
                          onClearSection(sectionId);
                        }
                      }
                    }}
                    style={{
                      background: "#dd1a1a",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#b81a1a";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#dd1a1a";
                    }}
                    title={sectionId.startsWith('custom-') ? "Delete section" : "Clear contents"}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={handleCloseClick}
            style={{
              flex: 1,
              padding: "12px",
              background: "#dd901d",
              border: "none",
              borderRadius: "6px",
              color: "#1a1a1a",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.background = "#c97c1c"}
            onMouseLeave={(e) => e.target.style.background = "#dd901d"}
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
      title="Close Navigator?"
      message="Are you sure you want to close the section navigator?"
    />
  </>
  );
}
