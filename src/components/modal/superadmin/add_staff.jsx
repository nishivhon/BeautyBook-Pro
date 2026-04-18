import { useState } from "react";

const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const modalScrollbarStyles = `
  .add-staff-modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .add-staff-modal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .add-staff-modal-content::-webkit-scrollbar-thumb {
    background: rgba(221, 144, 29, 0.4);
    border-radius: 3px;
  }

  .add-staff-modal-content::-webkit-scrollbar-thumb:hover {
    background: rgb(221, 144, 29);
  }
`;

export default function AddStaffModal({ 
  showModal, 
  onClose, 
  formData, 
  setFormData, 
  handleAddStaff,
  isEditing = false,
  availableServices = []
}) {
  const [selectedServiceDropdown, setSelectedServiceDropdown] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  if (!showModal) return null;

  const modalTitle = isEditing ? "Edit Staff" : "Add Staff";
  const submitButtonText = isEditing ? "Update Staff" : "Add Staff";

  const specialties = ["Hair", "Nail", "Skincare", "Massage"];

  // Get services filtered by selected specialty
  const getFilteredServices = () => {
    if (!formData.specialty) return [];
    // Filter services that match the specialty category
    return availableServices.filter(service => service.category === formData.specialty);
  };

  const filteredServices = getFilteredServices();

  const handleAddService = () => {
    if (!selectedServiceDropdown) return;
    
    const serviceId = parseInt(selectedServiceDropdown, 10);
    const currentServices = formData.services || [];
    if (!currentServices.includes(serviceId)) {
      setFormData({ 
        ...formData, 
        services: [...currentServices, serviceId] 
      });
    }
    setSelectedServiceDropdown("");
  };

  const handleRemoveService = (serviceId) => {
    const currentServices = formData.services || [];
    setFormData({ 
      ...formData, 
      services: currentServices.filter(id => id !== serviceId) 
    });
  };

  const getServiceName = (serviceId) => {
    const service = availableServices.find(s => s.id === serviceId);
    return service ? service.name : `Service ${serviceId}`;
  };

  const handleCloseClick = () => {
    if (hasFormData()) {
      setShowConfirmDialog(true);
    } else {
      handleConfirmClose(true);
    }
  };

  const hasFormData = () => {
    return (
      formData.name.trim() !== "" ||
      formData.specialty.trim() !== "" ||
      formData.services.length > 0 ||
      formData.status.trim() !== ""
    );
  };

  const handleSave = () => {
    // Validate form
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push("Full name is required");
    }
    if (!formData.specialty.trim()) {
      errors.push("Specialty is required");
    }
    if (!formData.status.trim()) {
      errors.push("Status is required");
    }
    if (!formData.services || formData.services.length === 0) {
      errors.push("At least one service must be added");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // If validation passes, save and close
    setValidationErrors([]);
    setShowConfirmDialog(false);
    handleAddStaff();
  };

  const handleConfirmClose = (confirmed) => {
    setShowConfirmDialog(false);
    if (confirmed) {
      setValidationErrors([]);
      setFormData({ name: "", specialty: "", services: [], status: "" });
      setSelectedServiceDropdown("");
      onClose();
    }
  };

  return (
    <>
      <style>{modalScrollbarStyles}</style>
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
      }} onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
        <div 
          className="add-staff-modal-content"
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: "32px",
            width: "90%",
            maxWidth: "550px",
            maxHeight: "85vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(221, 144, 29, 0.2)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(221, 144, 29, 0.4) transparent"
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          
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
            }}>{modalTitle}</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCloseClick();
              }}
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
                fontSize: "24px",
                lineHeight: "1"
              }}
              onMouseOver={(e) => e.target.style.color = "#dd901d"}
              onMouseOut={(e) => e.target.style.color = "#988f81"}
            >
              ✕
            </button>
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

          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
            
            {/* Full Name */}
            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jane Reyes"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: "1px solid rgba(221, 144, 29, 0.2)",
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.2)"}
              />
            </div>

            {/* Specialty */}
            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Specialty</label>
              <select
                value={formData.specialty}
                onChange={(e) => {
                  setFormData({ ...formData, specialty: e.target.value, services: [] });
                  setSelectedServiceDropdown("");
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: "1px solid rgba(221, 144, 29, 0.2)",
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease",
                  cursor: "pointer"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.2)"}
              >
                <option value="">Select a specialty</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: "1px solid rgba(221, 144, 29, 0.2)",
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease",
                  cursor: "pointer"
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.2)"}
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Services */}
            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#dd901d",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Services</label>
              
              {formData.specialty ? (
                <>
                  {/* Service Selection Dropdown and Add Button */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginBottom: "12px" }}>
                    <select
                      value={selectedServiceDropdown}
                      onChange={(e) => setSelectedServiceDropdown(e.target.value)}
                      style={{
                        padding: "10px 12px",
                        backgroundColor: "rgba(26, 15, 0, 0.5)",
                        border: "1px solid rgba(221, 144, 29, 0.2)",
                        borderRadius: "6px",
                        color: "#f5f5f5",
                        fontSize: "13px",
                        fontFamily: "Inter, sans-serif",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.2)"}
                    >
                      <option value="">Select a service</option>
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service) => {
                          const isAlreadyAdded = (formData.services || []).includes(service.id);
                          return (
                            <option 
                              key={service.id} 
                              value={service.id}
                              disabled={isAlreadyAdded}
                              style={{ color: isAlreadyAdded ? '#999' : '#fff' }}
                            >
                              {service.name}
                            </option>
                          );
                        })
                      ) : (
                        <option disabled>No services available</option>
                      )}
                    </select>
                    <button
                      onClick={handleAddService}
                      disabled={!selectedServiceDropdown}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: selectedServiceDropdown ? "#dd901d" : "#888",
                        border: "none",
                        borderRadius: "6px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: selectedServiceDropdown ? "pointer" : "not-allowed",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        whiteSpace: "nowrap",
                        fontFamily: "Inter, sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        if (selectedServiceDropdown) {
                          e.currentTarget.style.backgroundColor = "#e6a326";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedServiceDropdown) {
                          e.currentTarget.style.backgroundColor = "#dd901d";
                        }
                      }}
                    >
                      <PlusIcon size={12} color="currentColor" />
                      Add
                    </button>
                  </div>

                  {/* Selected Services List */}
                  <div style={{
                    backgroundColor: "rgba(26, 15, 0, 0.5)",
                    border: "1px solid rgba(221, 144, 29, 0.2)",
                    borderRadius: "6px",
                    padding: "12px",
                    minHeight: "44px",
                    maxHeight: "200px",
                    overflowY: "auto"
                  }}>
                    {(formData.services || []).length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {(formData.services || []).map((serviceId) => (
                          <div
                            key={serviceId}
                            style={{
                              backgroundColor: "rgba(221, 144, 29, 0.15)",
                              border: "1px solid rgba(221, 144, 29, 0.4)",
                              borderRadius: "6px",
                              padding: "8px 12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              fontSize: "13px",
                              color: "#f5f5f5",
                            }}
                          >
                            <span style={{ flex: 1 }}>{getServiceName(serviceId)}</span>
                            <button
                              onClick={() => handleRemoveService(serviceId)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "0 4px",
                                color: "#988f81",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                lineHeight: "1",
                                transition: "color 0.2s ease",
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#dd901d";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#988f81";
                              }}
                              title="Remove service"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{
                        fontSize: "13px",
                        color: "#988f81",
                        margin: 0
                      }}>No services added</p>
                    )}
                  </div>
                </>
              ) : (
                <div style={{
                  backgroundColor: "rgba(26, 15, 0, 0.5)",
                  border: "1px solid rgba(221, 144, 29, 0.2)",
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center"
                }}>
                  <p style={{
                    fontSize: "13px",
                    color: "#988f81",
                    margin: 0
                  }}>Select a specialty first to view available services</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end"
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCloseClick();
              }}
              style={{
                padding: "12px 20px",
                backgroundColor: "transparent",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                color: "#988f81",
                borderRadius: "6px",
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
                e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "12px 20px",
                backgroundColor: "#dd901d",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "background-color 0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#e6a326"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#dd901d"}
            >
              {submitButtonText}
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
}
