import { useState, useEffect } from "react";

export const Toast = ({ message = "", type = "info", duration = 5000, isVisible = false }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!show) return null;

  const bgColor = type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6";
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <div
      style={{
        position: "fixed",
        top: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        background: bgColor,
        color: "white",
        padding: "20px 32px",
        borderRadius: "14px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        fontFamily: "Inter, sans-serif",
        fontSize: "1.05rem",
        fontWeight: "600",
        zIndex: 9999,
        animation: "fadeInCenter 0.5s ease forwards",
        maxWidth: "85%",
        minWidth: "320px",
      }}
    >
      <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
