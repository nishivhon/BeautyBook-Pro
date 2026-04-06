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
      className="fixed top-10 left-1/2 -translate-x-1/2 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-3 font-inter font-semibold text-lg z-9999 animate-fadeInCenter max-w-xs sm:max-w-sm"
      style={{
        background: bgColor,
      }}
    >
      <span className="text-xl font-bold">{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
