 import { useState, useEffect } from "react";

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ServiceIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
    <rect x="13" y="3" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
    <rect x="3" y="13" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
    <rect x="13" y="13" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
  </svg>
);

const TrashIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const modalScrollbarStyles = `
  .manage-service-modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .manage-service-modal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .manage-service-modal-content::-webkit-scrollbar-thumb {
    background: rgba(221, 144, 29, 0.4);
    border-radius: 3px;
  }

  .manage-service-modal-content::-webkit-scrollbar-thumb:hover {
    background: rgb(221, 144, 29);
  }
`;

export const ManageServiceModal = ({ isOpen, staff, onClose, onSave, serviceCategories = [], services = {} }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'close' or 'save'

  // Initialize on mount or when staff changes
  useEffect(() => {
    if (isOpen && staff) {
      // Initialize with current staff categories or empty array
      const initialCategories = staff.details?.categories || [];
      setSelectedCategories(initialCategories);
    }
  }, [isOpen, staff, serviceCategories]);

  if (!isOpen || !staff) return null;

  const handleCategoryToggle = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSave = () => {
    // Validate that at least one category is selected
    if (selectedCategories.length === 0) {
      setValidationErrors(['Please select at least one category specialty']);
      return;
    }

    // If validation passes, close confirmation and save
    setShowConfirmDialog(false);
    setValidationErrors([]);
    onSave(staff.name, selectedCategories);
    onClose();
  };

  const handleCloseClick = () => {
    setConfirmAction('close');
    setShowConfirmDialog(true);
  };

  const handleCancelClick = () => {
    setConfirmAction('close');
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = (confirmed) => {
    setShowConfirmDialog(false);
    if (confirmed) {
      setValidationErrors([]);
      onClose();
    }
    setConfirmAction(null);
  };

  return (
    <>
      <style>{modalScrollbarStyles}</style>
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
          className="manage-service-modal-content"
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "550px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(221, 144, 29, 0.2)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(221, 144, 29, 0.4) transparent",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f5f5f5", margin: 0 }}>
              Manage Service
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

          {/* Category Specialty Multiple Selection */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f5f5f5", margin: "0 0 16px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Category Specialty
            </h3>

            {/* Selected Categories Display Box */}
            {selectedCategories.length > 0 && (
              <div
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "12px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "13px", color: "#22c55e", margin: 0, wordWrap: "break-word" }}>
                  {serviceCategories
                    .filter(cat => selectedCategories.includes(cat.id))
                    .map(cat => cat.name)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Scrollable Category List */}
            <div
              style={{
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.2)",
                borderRadius: "8px",
                padding: "12px",
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {serviceCategories.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {serviceCategories.map((category) => (
                    <label
                      key={category.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: selectedCategories.includes(category.id)
                          ? "rgba(34, 197, 94, 0.15)"
                          : "transparent",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedCategories.includes(category.id)) {
                          e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedCategories.includes(category.id)) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          accentColor: "#22c55e",
                        }}
                      />
                      <span style={{ fontSize: "13px", color: "#f5f5f5", fontWeight: selectedCategories.includes(category.id) ? "500" : "400" }}>
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#988f81", fontSize: "13px", margin: "0" }}>No categories available</p>
              )}
            </div>
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
    </>
  );
};
