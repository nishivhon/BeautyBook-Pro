import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const Toast = ({ message = "", type = "info", duration = 5000, isVisible = false }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  // Debug log to ensure toast mounting/visibility
  // eslint-disable-next-line no-console
  console.log('[Toast] render - isVisible:', isVisible, 'internal show:', show, 'message:', message);

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

  const toastEl = (
    <div
      aria-live="polite"
      role="status"
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000000,
        pointerEvents: 'auto',
        boxSizing: 'border-box',
        animation: 'slideDownFade 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div
        className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: scheme.bg,
          border: `2px solid ${scheme.border}`,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          borderRadius: "20px",
          maxWidth: 'min(90vw, 720px)'
        }}
      >
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

        <div style={{ display: 'inline-block', whiteSpace: 'pre-wrap', color: 'white', fontWeight: 600 }}>
          {message}
        </div>

        <button
          onClick={() => setShow(false)}
          className="flex-shrink-0 ml-2 text-white hover:text-white/70 transition-colors text-lg"
          style={{ opacity: 0.75, cursor: 'pointer' }}
          aria-label="Close toast"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );

  // Render into document.body to avoid stacking context issues
  try {
    return createPortal(toastEl, document.body);
  } catch (err) {
    // Fallback to regular render if portal fails (SSR safety)
    // eslint-disable-next-line no-console
    console.warn('[Toast] Portal mount failed, falling back to inline render', err);
    return toastEl;
  }
};

export default Toast;
