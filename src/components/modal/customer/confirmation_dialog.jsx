import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

  // Debug logging for visibility changes
  // eslint-disable-next-line no-console
  useEffect(() => {
    console.log('[ConfirmationDialog] isOpen prop:', isOpen, 'internal isVisible:', isVisible, 'title:', title);
  }, [isOpen, isVisible, title]);

  if (!isVisible) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        await onConfirm();
        // Close dialog after async operation completes
        setIsVisible(false);
      } catch (err) {
        console.error('[ConfirmationDialog] Error in onConfirm:', err);
        setIsVisible(false);
      }
    } else {
      setIsVisible(false);
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    onCancel?.();
  };

  const dialog = (
    <div
      className="otp-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
        <header className="otp-header">
          <h2 id="confirm-title" className="otp-header-title">{title}</h2>
        </header>

        <div className="otp-body">
          <p className="otp-instruction" style={{ marginBottom: 18 }}>{message}</p>

          <div className="otp-actions" style={{ marginTop: 8 }}>
            <button className="otp-btn-cancel" onClick={handleCancel} aria-label="Cancel action">{cancelText}</button>
            <button className="otp-btn-verify" onClick={handleConfirm} aria-label="Confirm action">{confirmText}</button>
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
