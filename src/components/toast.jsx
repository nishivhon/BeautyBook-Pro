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

  if (!show) return null;

  const colorSchemes = {
    success: {
      border: "rgba(34, 197, 94, 0.45)",
      text: "#22c55e",
    },
    error: {
      border: "rgba(239, 68, 68, 0.45)",
      text: "#ef4444",
    },
    info: {
      border: "rgba(221, 144, 29, 0.35)",
      text: "#dd901d",
    }
  };

  const scheme = colorSchemes[type] || colorSchemes.info;

  const toastEl = (
    <div
      aria-live="polite"
      role="status"
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2147483647,
        pointerEvents: 'auto',
        boxSizing: 'border-box',
        animation: 'toastFadeIn 0.25s ease-out'
      }}
    >
      <div
        className="inline-flex items-center gap-4 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(35, 29, 26, 0.95)',
          border: `1px solid ${scheme.border}`,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.28)",
          borderRadius: "8px",
          maxWidth: '400px',
          color: scheme.text,
          padding: '12px 16px',
          fontFamily: "Inter, sans-serif"
        }}
      >
        <div style={{ display: 'inline-block', whiteSpace: 'pre-wrap', color: scheme.text, fontWeight: 500, fontSize: '13px', textAlign: 'center' }}>
          {message}
        </div>
      </div>

      <style>{`
        @keyframes toastFadeIn {
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
