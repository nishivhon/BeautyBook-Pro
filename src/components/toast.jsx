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

  // Enhanced color schemes
  const colorSchemes = {
    success: {
      bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      border: "rgba(16, 185, 129, 0.4)",
      icon: "✓"
    },
    error: {
      bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      border: "rgba(239, 68, 68, 0.4)",
      icon: "✕"
    },
    info: {
      bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      border: "rgba(59, 130, 246, 0.4)",
      icon: "ℹ"
    }
  };

  const scheme = colorSchemes[type] || colorSchemes.info;

  return (
    <div
      className="fixed top-20 left-1/2 z-9999 max-w-lg"
      style={{
        transform: "translateX(-50%)",
        animation: "slideDownFade 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      <div
        className="flex items-center gap-4 px-7 py-5 rounded-2xl shadow-2xl backdrop-blur-md"
        style={{
          background: scheme.bg,
          border: `2px solid ${scheme.border}`,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          borderRadius: "20px"
        }}
      >
        {/* Icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full font-bold text-white text-xl"
          style={{
            background: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(6px)",
            borderRadius: "50%"
          }}
        >
          {scheme.icon}
        </div>

        {/* Message */}
        <span className="text-white font-semibold text-base leading-6 font-inter">
          {message}
        </span>

        {/* Close button (optional) */}
        <button
          onClick={() => {}}
          className="flex-shrink-0 ml-2 text-white hover:text-white/70 transition-colors text-lg"
          style={{ opacity: 0.75 }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
