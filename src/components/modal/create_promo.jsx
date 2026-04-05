import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// CONFIRMATION DIALOG COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Discard", cancelText = "Keep Editing" }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1001,
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "24px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(221, 144, 29, 0.2)"
      }}>
        <h3 style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#f5f5f5",
          margin: "0 0 12px 0"
        }}>{title}</h3>
        <p style={{
          fontSize: "14px",
          color: "#b0ada5",
          margin: "0 0 24px 0",
          lineHeight: "1.5"
        }}>{message}</p>
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              border: "1px solid rgba(221, 144, 29, 0.4)",
              color: "#dd901d",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ef4444",
              color: "#f5f5f5",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export const CreatePromoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    description: "",
    startDate: "",
    endDate: "",
    maxUses: ""
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [errors, setErrors] = useState({});

  // Sync form data when modal opens
  useEffect(() => {
    if (isOpen) {
      const emptyForm = {
        code: "",
        discountType: "percentage",
        discountValue: "",
        description: "",
        startDate: "",
        endDate: "",
        maxUses: ""
      };
      setFormData(JSON.parse(JSON.stringify(emptyForm)));
      setInitialFormData(JSON.parse(JSON.stringify(emptyForm)));
    }
  }, [isOpen]);

  const hasUnsavedChanges = () => {
    if (!initialFormData) return false;
    return Object.keys(formData).some(key => 
      JSON.stringify(formData[key]) !== JSON.stringify(initialFormData[key])
    );
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code?.trim()) newErrors.code = "Promo code is required";
    if (!formData.discountValue?.toString().trim()) newErrors.discountValue = "Discount value is required";
    if (!formData.startDate?.trim()) newErrors.startDate = "Start date is required";
    if (!formData.endDate?.trim()) newErrors.endDate = "End date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
    const emptyForm = {
      code: "",
      discountType: "percentage",
      discountValue: "",
      description: "",
      startDate: "",
      endDate: "",
      maxUses: ""
    };
    setFormData(emptyForm);
    setInitialFormData(emptyForm);
    setErrors({});
  };

  const handleConfirmDiscard = () => {
    setShowConfirmation(false);
    const emptyForm = {
      code: "",
      discountType: "percentage",
      discountValue: "",
      description: "",
      startDate: "",
      endDate: "",
      maxUses: ""
    };
    setFormData(emptyForm);
    setInitialFormData(emptyForm);
    setErrors({});
    
    if (pendingAction === "close") {
      onClose();
    }
    setPendingAction(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const handleCloseAttempt = () => {
    setPendingAction("close");
    setShowConfirmation(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelConfirm}
        confirmText="Discard"
        cancelText="Keep Editing"
      />
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "Inter, sans-serif"
      }}
      onClick={handleCloseAttempt}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(221, 144, 29, 0.2)"
      }}
      onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#f5f5f5",
            margin: 0
          }}>Create Promo</h2>
          <button
            onClick={handleCloseAttempt}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#988f81",
              transition: "color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.color = "#dd901d"}
            onMouseOut={(e) => e.target.style.color = "#988f81"}
          >
            <CloseIcon size={20} color="currentColor" />
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          {/* Promo Code */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Promo Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => {
                handleFormChange("code", e.target.value);
                if (errors.code) setErrors(prev => ({ ...prev, code: "" }));
              }}
              placeholder="e.g., SUMMER20"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: `1px solid ${errors.code ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}`,
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = errors.code ? "#ef4444" : "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = errors.code ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}
            />
            {errors.code && <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.code}</p>}
          </div>

          {/* Discount Type & Value */}
          <div style={{
            display: "flex",
            gap: "12px"
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px"
              }}>Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => handleFormChange("discountType", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: "1px solid rgba(221, 144, 29, 0.3)",
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₱)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px"
              }}>Value</label>
              <input
                type="text"
                value={formData.discountValue}
                onChange={(e) => {
                  handleFormChange("discountValue", e.target.value);
                  if (errors.discountValue) setErrors(prev => ({ ...prev, discountValue: "" }));
                }}
                placeholder={formData.discountType === "percentage" ? "e.g., 20" : "e.g., 500"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: `1px solid ${errors.discountValue ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = errors.discountValue ? "#ef4444" : "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = errors.discountValue ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}
              />
              {errors.discountValue && <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.discountValue}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="e.g., Summer discount for all hair services"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                minHeight: "80px",
                resize: "vertical",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>

          {/* Start Date & End Date */}
          <div style={{
            display: "flex",
            gap: "12px"
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px"
              }}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  handleFormChange("startDate", e.target.value);
                  if (errors.startDate) setErrors(prev => ({ ...prev, startDate: "" }));
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: `1px solid ${errors.startDate ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = errors.startDate ? "#ef4444" : "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = errors.startDate ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}
              />
              {errors.startDate && <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.startDate}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px"
              }}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => {
                  handleFormChange("endDate", e.target.value);
                  if (errors.endDate) setErrors(prev => ({ ...prev, endDate: "" }));
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: `1px solid ${errors.endDate ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}`,
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = errors.endDate ? "#ef4444" : "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = errors.endDate ? "#ef4444" : "rgba(221, 144, 29, 0.3)"}
              />
              {errors.endDate && <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.endDate}</p>}
            </div>
          </div>

          {/* Max Uses */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Max Uses (Optional)</label>
            <input
              type="text"
              value={formData.maxUses}
              onChange={(e) => handleFormChange("maxUses", e.target.value)}
              placeholder="Unlimited if left empty"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={handleCloseAttempt}
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              border: "1px solid rgba(221, 144, 29, 0.4)",
              color: "#dd901d",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "12px 24px",
              backgroundColor: "#dd901d",
              color: "#1a1a1a",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#e6a326"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#dd901d"}
          >
            Create Promo
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default CreatePromoModal;
