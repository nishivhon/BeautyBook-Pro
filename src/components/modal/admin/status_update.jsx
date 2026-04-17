import { useState } from "react";

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StatusUpdateModal = ({ isOpen, staff, onClose, onSave }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  if (!isOpen || !staff) return null;

  const statusOptions = [
    { label: "Available", color: "#22c55e", class: "staff-status-green" },
    { label: "In Service", color: "#4387ef", class: "staff-status-blue" },
    { label: "On Break", color: "#dd901d", class: "staff-status-amber" },
  ];

  const handleSave = () => {
    // Validate that a status is selected
    if (!selectedStatus) {
      setValidationErrors(["Please select a status before saving"]);
      return;
    }

    onSave(staff.name, selectedStatus);
    setSelectedStatus("");
    setValidationErrors([]);
  };

  const handleStatusClick = (statusLabel) => {
    // Toggle deselect: if clicking the already selected status, deselect it
    if (selectedStatus === statusLabel) {
      setSelectedStatus("");
    } else {
      setSelectedStatus(statusLabel);
    }
  };

  const handleCloseClick = () => {
    setShowConfirmDialog(true);
  };

  const handleCancelClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = (confirmed) => {
    setShowConfirmDialog(false);
    if (confirmed) {
      setValidationErrors([]);
      setSelectedStatus("");
      onClose();
    }
  };

  return (
    <div 
      style={{
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
        fontFamily: "Inter, sans-serif",
      }}
      onClick={handleCloseClick}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "450px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f5f5f5", margin: 0 }}>
            Update Status
          </h2>
          <button
            onClick={handleCloseClick}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#988f81",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#dd901d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#988f81"; }}
          >
            <CloseIcon size={20} color="currentColor" />
          </button>
        </div>

        {/* Staff Name Display */}
        <div style={{
          backgroundColor: "rgba(26, 15, 0, 0.5)",
          borderLeft: "3px solid #dd901d",
          padding: "12px 14px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <p style={{ fontSize: "12px", color: "#988f81", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Staff Member
          </p>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#f5f5f5", margin: 0 }}>
            {staff.name}
          </p>
        </div>

        {/* Current Status Display */}
        <p style={{ fontSize: "12px", color: "#988f81", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Current Status
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
          padding: "10px 14px",
          backgroundColor: "rgba(26, 15, 0, 0.5)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          borderRadius: "8px",
        }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: staff.status === "Available" ? "#22c55e" : staff.status === "In Service" ? "#4387ef" : "#dd901d",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#f5f5f5" }}>
            {staff.status}
          </span>
        </div>

        {/* Validation Errors Display */}
        {validationErrors.length > 0 && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "24px",
          }}>
            {validationErrors.map((error, idx) => (
              <p key={idx} style={{ fontSize: "13px", color: "#ef4444", margin: idx === validationErrors.length - 1 ? 0 : "0 0 8px 0" }}>
                • {error}
              </p>
            ))}
          </div>
        )}

        {/* Status Options */}
        <p style={{ fontSize: "12px", color: "#988f81", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Select New Status
        </p>
        <p style={{ fontSize: "11px", color: "#666", margin: "0 0 12px 0", fontStyle: "italic" }}>
          Click a status to select. Click again to deselect.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
          {statusOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleStatusClick(option.label)}
              style={{
                padding: "12px 16px",
                border: selectedStatus === option.label ? "2px solid #dd901d" : "1px solid rgba(221, 144, 29, 0.2)",
                backgroundColor: selectedStatus === option.label ? "rgba(221, 144, 29, 0.15)" : "rgba(26, 15, 0, 0.5)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#f5f5f5",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                if (selectedStatus !== option.label) {
                  e.currentTarget.style.backgroundColor = "rgba(26, 15, 0, 0.7)";
                  e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStatus !== option.label) {
                  e.currentTarget.style.backgroundColor = "rgba(26, 15, 0, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.2)";
                }
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: option.color,
                  flexShrink: 0,
                }}
              />
              {option.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleCancelClick}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "1px solid rgba(221, 144, 29, 0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              color: "#988f81",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.6)";
              e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.3)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: "#dd901d",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              color: "#fff",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e89f2d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#dd901d";
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            fontFamily: "Inter, sans-serif",
          }}
          onClick={() => handleConfirmClose(false)}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.9)",
              border: "1px solid rgba(221, 144, 29, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confirmation Title */}
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f5f5f5", margin: "0 0 12px 0" }}>
              Discard Changes?
            </h3>
            
            {/* Confirmation Message */}
            <p style={{ fontSize: "14px", color: "#988f81", margin: "0 0 24px 0", lineHeight: "1.5" }}>
              Are you sure you want to close this modal? Any unsaved changes will be discarded.
            </p>

            {/* Confirmation Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => handleConfirmClose(false)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(221, 144, 29, 0.3)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#988f81",
                  transition: "all 0.2s ease",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.6)";
                  e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.3)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Keep Editing
              </button>
              <button
                onClick={() => handleConfirmClose(true)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  backgroundColor: "#ef4444",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#fff",
                  transition: "all 0.2s ease",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef4444";
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
