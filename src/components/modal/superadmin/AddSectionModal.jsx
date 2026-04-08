export default function AddSectionModal({
  isOpen,
  onClose,
  draftSection,
  setDraftSection,
  onAddSection,
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    }}>
      <div style={{
        background: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1.5px solid #dd901d",
        maxWidth: "450px",
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
      }}>
        <h2 style={{ color: "white", marginBottom: "24px", fontSize: "20px", fontWeight: "bold" }}>Add Draft Section</h2>
        
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
            onClick={onAddSection}
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
          <button
            onClick={onClose}
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
  );
}
