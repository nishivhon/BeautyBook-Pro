import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const ConfirmationDialog = ({
  title = "Are you sure?",
  message = "Please confirm your action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isOpen = false,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        await onConfirm();
      } catch (error) {
        console.error("[ConfirmationDialog] Error in onConfirm:", error);
      }
    }
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
    onCancel?.();
  };

  const dialog = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
        backgroundColor: "rgba(0,0,0,0.5)",
        pointerEvents: "auto",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 16,
          padding: "28px 22px",
          maxWidth: 420,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          animation: "fade-up 0.25s ease forwards",
          color: "var(--color-black)",
        }}
      >
        <h2 id="confirm-title" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
          {title}
        </h2>

        <div style={{ marginTop: 12 }}>
          <p style={{ margin: 0, color: "rgba(12,10,9,0.8)", lineHeight: 1.5 }}>{message}</p>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button
              onClick={handleCancel}
              aria-label="Cancel action"
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "transparent",
                color: "var(--color-black)",
                border: "1.25px solid rgba(12,10,9,0.08)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              {cancelText}
            </button>

            <button
              onClick={handleConfirm}
              aria-label="Confirm action"
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "var(--color-amber)",
                color: "var(--color-black)",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return dialog;
  }

  return createPortal(dialog, document.body);
};

export default ConfirmationDialog;
