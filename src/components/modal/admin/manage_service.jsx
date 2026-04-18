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
  const [categoryServicePairs, setCategoryServicePairs] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'close' or 'save'

  // Hardcoded default service ID (represents the service staff registered when hired)
  const DEFAULT_SERVICE_ID = 'haircut';
  const DEFAULT_CATEGORY_ID = 'hair';

  // Initialize on mount or when staff changes
  useEffect(() => {
    if (isOpen && staff) {
      // Initialize with current staff service or default service assigned at hiring
      const initialPairs = staff.details?.services 
        ? staff.details.services
        : [{ 
            category: DEFAULT_CATEGORY_ID, 
            services: [DEFAULT_SERVICE_ID]
          }];
      setCategoryServicePairs(initialPairs);
      
      // Initialize selected service dropdowns
      const selServices = {};
      initialPairs.forEach((_, idx) => {
        selServices[idx] = '';
      });
      setSelectedServices(selServices);
    }
  }, [isOpen, staff, serviceCategories]);

  if (!isOpen || !staff) return null;

  const handleCategoryChange = (index, newCategory) => {
    const updated = [...categoryServicePairs];
    updated[index] = { category: newCategory, services: [] };
    setCategoryServicePairs(updated);
  };

  const handleServiceDropdownChange = (index, serviceId) => {
    const updated = { ...selectedServices };
    updated[index] = serviceId;
    setSelectedServices(updated);
  };

  const handleAddService = (index) => {
    const serviceId = selectedServices[index];
    if (!serviceId) return;

    const updated = [...categoryServicePairs];
    const currentServices = updated[index].services || [];
    
    // Check if service is already added
    if (!currentServices.includes(serviceId)) {
      updated[index].services = [...currentServices, serviceId];
      setCategoryServicePairs(updated);
    }

    // Reset dropdown
    const updatedSelected = { ...selectedServices };
    updatedSelected[index] = '';
    setSelectedServices(updatedSelected);
  };

  const handleRemoveService = (pairIndex, serviceId) => {
    const updated = [...categoryServicePairs];
    updated[pairIndex].services = updated[pairIndex].services.filter(s => s !== serviceId);
    setCategoryServicePairs(updated);
  };

  const handleAddCategory = () => {
    const newIndex = categoryServicePairs.length;
    setCategoryServicePairs([
      ...categoryServicePairs,
      { category: serviceCategories[0]?.id || '', services: [] }
    ]);
    
    const updated = { ...selectedServices };
    updated[newIndex] = '';
    setSelectedServices(updated);
  };

  const handleRemoveCategory = (index) => {
    const updated = categoryServicePairs.filter((_, i) => i !== index);
    setCategoryServicePairs(updated);
    
    const updatedSelected = { ...selectedServices };
    delete updatedSelected[index];
    setSelectedServices(updatedSelected);
  };

  const handleSave = () => {
    // Validate all category-service pairs
    const errors = [];
    
    categoryServicePairs.forEach((pair, index) => {
      if (!pair.category) {
        errors.push(`Category ${index > 0 ? index + 1 : ''} is required`.trim());
      }
      if (!pair.services || pair.services.length === 0) {
        errors.push(`Category ${index > 0 ? index + 1 : ''} must have at least one service`.trim());
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // If validation passes, close confirmation and save
    setShowConfirmDialog(false);
    setValidationErrors([]);
    onSave(staff.name, categoryServicePairs);
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

  const getServiceName = (serviceId, categoryId) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    if (!category) return '';
    const service = category.services.find(s => s.id === serviceId);
    return service ? service.name : '';
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

          {/* Category and Service Pairs */}
          <div style={{ marginBottom: "24px" }}>
            {categoryServicePairs.map((pair, index) => (
              <div key={index} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: index < categoryServicePairs.length - 1 ? "1px solid rgba(221, 144, 29, 0.1)" : "none" }}>
                {/* Category Dropdown */}
                <label style={{ display: "block", fontSize: "12px", color: "#988f81", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Category {index > 0 ? `${index + 1}` : ''}
                </label>
                <select
                  value={pair.category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    backgroundColor: "rgba(26, 15, 0, 0.5)",
                    border: "1px solid rgba(221, 144, 29, 0.2)",
                    borderRadius: "8px",
                    color: "#f5f5f5",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    cursor: "pointer",
                    marginBottom: "16px",
                  }}
                >
                  <option value="">Select a category</option>
                  {serviceCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Service Selection and List */}
                {pair.category && (
                  <>
                    <label style={{ display: "block", fontSize: "12px", color: "#988f81", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Services
                    </label>
                    
                    {/* Service Dropdown and Add Button */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginBottom: "12px" }}>
                      <select
                        value={selectedServices[index] || ''}
                        onChange={(e) => handleServiceDropdownChange(index, e.target.value)}
                        style={{
                          padding: "10px 12px",
                          backgroundColor: "rgba(26, 15, 0, 0.5)",
                          border: "1px solid rgba(221, 144, 29, 0.2)",
                          borderRadius: "6px",
                          color: "#f5f5f5",
                          fontSize: "13px",
                          fontFamily: "Inter, sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Select a service</option>
                        {serviceCategories.find(cat => cat.id === pair.category)?.services?.map((service) => {
                          const isAlreadyAdded = pair.services?.includes(service.id);
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
                        })}
                      </select>
                      <button
                        onClick={() => handleAddService(index)}
                        disabled={!selectedServices[index]}
                        style={{
                          padding: "10px 16px",
                          backgroundColor: selectedServices[index] ? "#22c55e" : "#888",
                          border: "none",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: selectedServices[index] ? "pointer" : "not-allowed",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedServices[index]) {
                            e.currentTarget.style.backgroundColor = "#16a34a";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedServices[index]) {
                            e.currentTarget.style.backgroundColor = "#22c55e";
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
                      minHeight: "40px",
                    }}>
                      {pair.services && pair.services.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {pair.services.map((serviceId) => (
                            <div
                              key={serviceId}
                              style={{
                                backgroundColor: "rgba(34, 197, 94, 0.15)",
                                border: "1px solid rgba(34, 197, 94, 0.4)",
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
                              <span>{getServiceName(serviceId, pair.category)}</span>
                              <button
                                onClick={() => handleRemoveService(index, serviceId)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: "0 4px",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "18px",
                                  lineHeight: "1",
                                  transition: "color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#dc2626";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "#ef4444";
                                }}
                                title="Remove service"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "#988f81", fontSize: "13px", margin: "0" }}>No services added</p>
                      )}
                    </div>
                  </>
                )}

                {/* Remove Category Button */}
                {categoryServicePairs.length > 1 && (
                  <button
                    onClick={() => handleRemoveCategory(index)}
                    style={{
                      marginTop: "12px",
                      padding: "8px 12px",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "6px",
                      color: "#ef4444",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                    }}
                  >
                    <TrashIcon size={13} color="currentColor" />
                    Remove Category
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Category Button */}
          <button
            onClick={handleAddCategory}
            style={{
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "8px",
              color: "#22c55e",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "24px",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
            }}
          >
            <PlusIcon size={14} color="currentColor" />
            Add Category
          </button>

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
