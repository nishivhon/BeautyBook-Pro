import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;
const EXIT_ANIMATION_MS = 220;
const MAX_TOASTS = 4;

const getToastStore = () => {
  if (typeof globalThis === "undefined") {
    return {
      listeners: new Set(),
      queue: [],
    };
  }

  if (!globalThis.__bbpToastStore) {
    globalThis.__bbpToastStore = {
      listeners: new Set(),
      queue: [],
    };
  }

  return globalThis.__bbpToastStore;
};

const emitToastState = () => {
  const store = getToastStore();
  store.listeners.forEach((listener) => listener(store.queue));
};

const normalizeToast = (input, fallbackType = "info", fallbackDuration = DEFAULT_DURATION) => {
  const toast = typeof input === "object" && input !== null ? input : { message: input };

  return {
    id: toast.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message: String(toast.message || ""),
    type: toast.type || fallbackType || "info",
    duration: typeof toast.duration === "number" ? toast.duration : fallbackDuration,
  };
};

const dismissToast = (toastId) => {
  const store = getToastStore();
  store.queue = store.queue.filter((toast) => toast.id !== toastId);
  emitToastState();
};

export const clearAllToasts = () => {
  const store = getToastStore();
  if (!store.queue.length) {
    return;
  }
  store.queue = [];
  emitToastState();
};

/** Clears the global toast queue whenever the route pathname changes. */
export const ToastRouteSync = () => {
  const location = useLocation();

  useEffect(() => {
    clearAllToasts();
  }, [location.pathname]);

  return null;
};

const enqueueToast = (input, fallbackType = "info", fallbackDuration = DEFAULT_DURATION) => {
  const toast = normalizeToast(input, fallbackType, fallbackDuration);
  const store = getToastStore();
  store.queue = [...store.queue.slice(-(MAX_TOASTS - 1)), toast];
  emitToastState();
  return toast.id;
};

const colorSchemes = {
  success: {
    border: "rgba(34, 197, 94, 0.42)",
    glow: "rgba(34, 197, 94, 0.16)",
    text: "#bbf7d0",
    accent: "#22c55e",
    accentSoft: "rgba(34, 197, 94, 0.12)",
  },
  error: {
    border: "rgba(239, 68, 68, 0.42)",
    glow: "rgba(239, 68, 68, 0.16)",
    text: "#fecaca",
    accent: "#ef4444",
    accentSoft: "rgba(239, 68, 68, 0.12)",
  },
  warning: {
    border: "rgba(245, 158, 11, 0.42)",
    glow: "rgba(245, 158, 11, 0.16)",
    text: "#fde68a",
    accent: "#f59e0b",
    accentSoft: "rgba(245, 158, 11, 0.12)",
  },
  info: {
    border: "rgba(221, 144, 29, 0.38)",
    glow: "rgba(221, 144, 29, 0.14)",
    text: "#f8d8a8",
    accent: "#dd901d",
    accentSoft: "rgba(221, 144, 29, 0.12)",
  },
};

const getScheme = (type) => colorSchemes[type] || colorSchemes.info;

const ToastItem = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const scheme = getScheme(toast.type);
  const backgroundByType = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  useEffect(() => {
    if (toast.duration <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), EXIT_ANIMATION_MS);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [onDismiss, toast.duration, toast.id]);

  return (
    <div
      aria-live="polite"
      role="status"
      data-toast-type={toast.type}
      style={{
        width: "fit-content",
        maxWidth: "min(400px, calc(100vw - 24px))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 18px",
        borderRadius: "8px",
        background: backgroundByType[toast.type] || backgroundByType.info,
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        color: "#fff",
        transform: exiting ? "translateY(-6px) scale(0.99)" : "translateY(0) scale(1)",
        opacity: exiting ? 0 : 1,
        transition: "transform 180ms ease, opacity 180ms ease",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        textAlign: "center",
        lineHeight: 1.35,
      }}
    >
      <div style={{ display: "inline-block", whiteSpace: "pre-wrap", color: "#fff", fontWeight: 500, fontSize: "14px", textAlign: "center" }}>
        {toast.message}
      </div>
    </div>
  );
};

export const ToastViewport = ({ toasts = [], onDismiss = dismissToast }) => {
  const [visibleToasts, setVisibleToasts] = useState(toasts);

  useEffect(() => {
    const store = getToastStore();
    const listener = (nextToasts) => setVisibleToasts(nextToasts);
    store.listeners.add(listener);
    setVisibleToasts(store.queue);

    return () => {
      store.listeners.delete(listener);
    };
  }, []);

  const currentToasts = toasts.length ? toasts : visibleToasts;

  if (!currentToasts.length) {
    return null;
  }

  const viewport = (
    <div
      style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483647,
        pointerEvents: "none",
        width: "calc(100% - 24px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {currentToasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: "auto", animation: "toastEnter 220ms ease-out" }}>
            <ToastItem toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </div>

      <style>{`\n        @keyframes toastEnter {\n          from { opacity: 0; transform: translateY(-10px) scale(0.985); }\n          to { opacity: 1; transform: translateY(0) scale(1); }\n        }\n      `}</style>
    </div>
  );

  try {
    return createPortal(viewport, document.body);
  } catch (err) {
    return viewport;
  }
};

export const useToast = () => {
  const context = useContext(ToastContext);
  const contextShowToast = context?.showToast;

  return {
    showToast: contextShowToast || ((input, type = "info", duration = DEFAULT_DURATION) => enqueueToast(input, type, duration)),
    dismissToast,
  };
};

export const Toast = ({ message = "", type = "info", duration = DEFAULT_DURATION, isVisible = false }) => {
  const [show, setShow] = useState(isVisible);
  const [toastId] = useState(() => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    setShow(isVisible);
    if (!isVisible) {
      return undefined;
    }

    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration, isVisible]);

  const handleDismiss = useCallback(() => setShow(false), []);

  const toast = useMemo(
    () => ({ id: toastId, message, type, duration }),
    [duration, message, toastId, type]
  );

  if (!show) {
    return null;
  }

  return <ToastViewport toasts={[toast]} onDismiss={handleDismiss} />;
};

export const ToastProvider = ({ children, value }) => (
  <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
);

export default Toast;
