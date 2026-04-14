import { useState } from "react";

// Icons
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 12l5 5 11-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Service categories
const serviceCategories = [
  { id: "haircut", label: "Hair Services", icon: "✂️" },
  { id: "nails", label: "Nail Services", icon: "💅" },
  { id: "skincare", label: "Skin Care Services", icon: "✨" },
  { id: "massage", label: "Massage Services", icon: "💆" },
  { id: "premium", label: "Premium Services", icon: "👑" },
];

// Available services by category
const availableServices = {
  haircut: [
    { id: 1, name: "Hair cuts" },
    { id: 2, name: "Hair color" },
    { id: 3, name: "Hair treatment" },
    { id: 4, name: "Beard trimming" },
  ],
  nails: [
    { id: 5, name: "Manicure" },
    { id: 6, name: "Pedicure" },
    { id: 7, name: "Nail enhancement" },
    { id: 8, name: "Nail art & design" },
  ],
  skincare: [
    { id: 9, name: "Facial treatment" },
    { id: 10, name: "Advance treatment" },
    { id: 11, name: "Specialized facials" },
    { id: 12, name: "Body treatment" },
  ],
  massage: [
    { id: 13, name: "Swedish massage" },
    { id: 14, name: "Deep tissue massage" },
    { id: 15, name: "Hot stone massage" },
    { id: 16, name: "Foot reflexology" },
  ],
  premium: [
    { id: 17, name: "Bridal package" },
    { id: 18, name: "Couple's Massage" },
    { id: 19, name: "Hair & glow combo" },
    { id: 20, name: "VIP experience" },
  ],
};

// Request new service modal
export default function RequestNewServiceModal({ isOpen, onClose, showToast, systemServices }) {
  const [formData, setFormData] = useState({
    category: "",
    serviceName: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.serviceName.trim()) newErrors.serviceName = "Service name is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      showToast(`Service request for "${formData.serviceName}" has been sent to admin for approval!`);
      resetForm();
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      category: "",
      serviceName: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "1000",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(221, 144, 29, 0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: "0", color: "#f5f5f5", fontSize: "18px", fontWeight: "600" }}>
            Request New Service
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "rgba(221, 144, 29, 0.1)",
              border: "1px solid rgba(221, 144, 29, 0.2)",
              color: "#f5f5f5",
              padding: "8px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: "1", overflowY: "auto", padding: "20px", color: "#f5f5f5" }}>
          <form onSubmit={handleSubmit}>
            {/* Category selection */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", fontWeight: "600", color: "#dd901d", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Service Category *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {serviceCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleChange({ target: { name: "category", value: cat.id } })}
                    style={{
                      padding: "12px",
                      backgroundColor: formData.category === cat.id ? "rgba(221, 144, 29, 0.2)" : "rgba(221, 144, 29, 0.05)",
                      border: formData.category === cat.id ? "2px solid #dd901d" : "1px solid rgba(221, 144, 29, 0.2)",
                      borderRadius: "8px",
                      color: "#f5f5f5",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = formData.category === cat.id ? "rgba(221, 144, 29, 0.2)" : "rgba(221, 144, 29, 0.05)";
                    }}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
              {errors.category && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px", margin: "0" }}>{errors.category}</p>}
            </div>

            {/* Service name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#dd901d", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Service Name *
              </label>
              <select
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                disabled={!formData.category}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: !formData.category ? "rgba(35, 29, 26, 0.3)" : "rgba(35, 29, 26, 0.5)",
                  border: errors.serviceName ? "1px solid #ef4444" : "1px solid rgba(221, 144, 29, 0.2)",
                  borderRadius: "6px",
                  color: !formData.category ? "#888" : "#f5f5f5",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                  cursor: !formData.category ? "not-allowed" : "pointer",
                }}
                onFocus={(e) => {
                  if (formData.category) {
                    e.currentTarget.style.borderColor = "#dd901d";
                    e.currentTarget.style.backgroundColor = "rgba(35, 29, 26, 0.8)";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.serviceName ? "#ef4444" : "rgba(221, 144, 29, 0.2)";
                  e.currentTarget.style.backgroundColor = !formData.category ? "rgba(35, 29, 26, 0.3)" : "rgba(35, 29, 26, 0.5)";
                }}
              >
                <option value="">
                  {!formData.category ? "Select a category first" : "Select a service"}
                </option>
                {formData.category && systemServices?.[formData.category]?.map(service => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
                {formData.category && !systemServices?.[formData.category] && availableServices[formData.category]?.map(service => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.serviceName && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px", margin: "0" }}>{errors.serviceName}</p>}
            </div>

            {/* Info text */}
            <div style={{
              backgroundColor: "rgba(221, 144, 29, 0.08)",
              border: "1px solid rgba(221, 144, 29, 0.2)",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#b0ada5",
            }}>
              Your service request will be sent to the admin for review and approval. Once approved, it will be added to your available services.
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: isSubmitting ? "rgba(221, 144, 29, 0.3)" : "#dd901d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = "#e8a823";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = "#dd901d";
                }}
              >
                <CheckmarkIcon />
                {isSubmitting ? "Sending..." : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "rgba(221, 144, 29, 0.1)",
                  color: "#f5f5f5",
                  border: "1px solid rgba(221, 144, 29, 0.3)",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
