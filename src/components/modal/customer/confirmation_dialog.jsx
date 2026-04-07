import { useState, useEffect } from "react";

export const ConfirmationDialog = ({ 
  title = "Cancel Booking?", 
  message = "Are you sure you want to cancel? Your progress will be lost.", 
  confirmText = "Yes, Cancel",
  cancelText = "Keep Booking",
  onConfirm,
  onCancel,
  isOpen = false 
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const handleConfirm = () => {
    setIsVisible(false);
    onConfirm?.();
  };

  const handleCancel = () => {
    setIsVisible(false);
    onCancel?.();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(2px)",
      backgroundColor: "rgba(0,0,0,0.5)",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px 24px",
        maxWidth: "360px",
        width: "90%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        animation: "fade-up 0.3s ease forwards",
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#1a0f00",
          marginBottom: "12px",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
        }}>
          {title}
        </h2>

        {/* Message */}
        <p style={{
          fontSize: "14px",
          color: "#665544",
          marginBottom: "24px",
          textAlign: "center",
          lineHeight: "1.5",
          fontFamily: "Inter, sans-serif",
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          flexDirection: "column",
        }}>
          {/* Keep Booking Button (Primary) */}
          <button
            onClick={handleCancel}
            style={{
              padding: "12px 16px",
              background: "#dd901d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#c17a14";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#dd901d";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {cancelText}
          </button>

          {/* Cancel Button (Secondary) */}
          <button
            onClick={handleConfirm}
            style={{
              padding: "12px 16px",
              background: "transparent",
              color: "#dd901d",
              border: "1.5px solid #dd901d",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(221, 144, 29, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
