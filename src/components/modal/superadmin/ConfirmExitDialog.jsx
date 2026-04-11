export default function ConfirmExitDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Discard Changes?",
  message = "Are you sure you want to exit? Any unsaved changes will be lost.",
  confirmButtonLabel = "Discard Changes",
  cancelButtonLabel = "Continue Editing",
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: isOpen ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#1a1a1a",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1.5px solid #dd901d",
          maxWidth: "400px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#dd901d", fontSize: "18px", fontWeight: "bold", marginTop: 0, marginBottom: "12px" }}>
          {title}
        </h2>
        <p style={{ color: "#ccc", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
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
            {cancelButtonLabel}
          </button>
          <button
            onClick={onConfirm}
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
            onMouseEnter={(e) => {
              e.target.style.background = "#c97c1c";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#dd901d";
            }}
          >
            {confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
