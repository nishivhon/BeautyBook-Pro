import { useState, useEffect } from "react";
import ConfirmExitDialog from "./ConfirmExitDialog";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h12zM10 11v6M14 11v6" 
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Social media icons
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.45 7-7 7-7s-3 1-5-1V7a4.5 4.5 0 018.23-1"
      stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M9 12a4 4 0 1 0 4.18-4M9 12a4 4 0 1 0 4.18-4" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    <path d="M15.5 3.5v8M18 5.5a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
  </svg>
);

const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: FacebookIcon },
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "twitter", label: "Twitter", icon: TwitterIcon },
  { id: "tiktok", label: "TikTok", icon: TikTokIcon },
];

export function FooterEditModal({ isOpen, footer, setFooter, onClose }) {
  const [activeTab, setActiveTab] = useState("contact");
  const [contactData, setContactData] = useState({
    address: "",
    phone: "",
    email: "",
    hours: "",
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [newSocialPlatform, setNewSocialPlatform] = useState("facebook");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("exit"); // "exit" or "save"
  const [validationErrors, setValidationErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // Validation Rules
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone) => {
    // Phone should contain at least some digits, can have formatting characters
    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 7;
  };

  const validate = () => {
    const errors = {};

    // Validate Contact Info fields
    if (!contactData.address.trim()) {
      errors.address = "Address is required";
    } else if (contactData.address.trim().length > 200) {
      errors.address = "Address must be 200 characters or less";
    }

    if (!contactData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (contactData.phone.trim().length > 20) {
      errors.phone = "Phone must be 20 characters or less";
    } else if (!isValidPhone(contactData.phone)) {
      errors.phone = "Phone must contain at least 7 digits and valid formatting";
    }

    if (!contactData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(contactData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!contactData.hours.trim()) {
      errors.hours = "Business hours are required";
    } else if (contactData.hours.trim().length > 200) {
      errors.hours = "Business hours must be 200 characters or less";
    }

    // Validate Social Links
    if (socialLinks.length === 0) {
      errors.socialLinks = "Please add at least one social media link";
    } else {
      socialLinks.forEach((link, index) => {
        if (!link.url.trim()) {
          errors[`social_${index}`] = "Social media URL cannot be empty";
        } else if (!isValidUrl(link.url)) {
          errors[`social_${index}`] = "Invalid URL format. Must start with https:// or http://";
        } else if (link.url.length > 500) {
          errors[`social_${index}`] = "URL is too long (max 500 characters)";
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (isOpen) {
      setContactData({
        address: footer.address || "",
        phone: footer.phone || "",
        email: footer.email || "",
        hours: footer.hours || "",
      });
      
      setSocialLinks(footer.socialLinks || []);
      setNewSocialUrl("");
      setNewSocialPlatform("facebook");
      setActiveTab("contact");
      setValidationErrors({});
      setShowErrors(false);
    }
  }, [isOpen, footer]);

  const handleContactChange = (field, value) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSocial = () => {
    if (newSocialUrl.trim() && newSocialPlatform) {
      const newLink = {
        id: Date.now(),
        platform: newSocialPlatform,
        url: newSocialUrl
      };
      setSocialLinks(prev => [...prev, newLink]);
      setNewSocialUrl("");
      setNewSocialPlatform("facebook");
    }
  };

  const handleRemoveSocial = (id) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleSave = () => {
    setFooter({
      ...footer,
      ...contactData,
      socialLinks: socialLinks
    });
    onClose();
  };

  const handleCloseClick = () => {
    // Always show confirmation dialog when trying to exit
    setShowConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowConfirm(false);
    onClose();
  };

  const handleConfirmSave = () => {
    setShowConfirm(false);
    handleSave();
  };

  const handleSaveClick = () => {
    if (validate()) {
      setConfirmType("save");
      setShowConfirm(true);
      setShowErrors(false);
    } else {
      setShowErrors(true);
      // Switch to contact tab if error is there
      if (validationErrors.address || validationErrors.phone || validationErrors.email || validationErrors.hours) {
        setActiveTab("contact");
      }
    }
  };

  const getPlatformIcon = (platformId) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return platform ? <platform.icon /> : null;
  };

  const isAddDisabled = !newSocialUrl.trim() || socialLinks.some(link => link.platform === newSocialPlatform);

  return (
    <>
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: isOpen ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        fontFamily: "Inter, sans-serif",
      }}
      onClick={handleCloseClick}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "28px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              color: "#f5f5f5",
            }}
          >
            Edit Footer Content
          </h2>
          <button
            onClick={handleCloseClick}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b0ada5",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#dd901d")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#b0ada5")}
            title="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "2px solid rgba(221, 144, 29, 0.2)",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveTab("contact")}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "transparent",
              border: "none",
              color: activeTab === "contact" ? "#dd901d" : "#888",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
              borderBottomWidth: activeTab === "contact" ? "2px" : "0",
              borderBottomColor: "#dd901d",
              borderBottomStyle: "solid",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab("social")}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "transparent",
              border: "none",
              color: activeTab === "social" ? "#dd901d" : "#888",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
              borderBottomWidth: activeTab === "social" ? "2px" : "0",
              borderBottomColor: "#dd901d",
              borderBottomStyle: "solid",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Social Links
          </button>
        </div>

        {/* Content */}
        <div>
          {/* Validation Error Summary */}
          {showErrors && Object.keys(validationErrors).length > 0 && (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "20px",
                display: "flex",
                gap: "12px",
              }}
            >
              <div style={{ fontSize: "18px", flexShrink: 0 }}>⚠️</div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#ef4444",
                    marginBottom: "6px",
                  }}
                >
                  Validation Error
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#dc2626",
                    lineHeight: "1.4",
                  }}
                >
                  {Object.keys(validationErrors).length === 1
                    ? "Please fix the error below and try again."
                    : `Please fix ${Object.keys(validationErrors).length} error(s) below and try again.`}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Address */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#dd901d",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Address
                </label>
                <input
                  type="text"
                  value={contactData.address}
                  onChange={(e) => handleContactChange("address", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: validationErrors.address ? "1px solid #ef4444" : "1px solid rgba(221, 144, 29, 0.3)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    backgroundColor: validationErrors.address ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)",
                    color: "#f5f5f5",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = validationErrors.address ? "#ef4444" : "rgba(221, 144, 29, 0.6)";
                    e.target.style.backgroundColor = validationErrors.address ? "rgba(239, 68, 68, 0.12)" : "rgba(221, 144, 29, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.address ? "#ef4444" : "rgba(221, 144, 29, 0.3)";
                    e.target.style.backgroundColor = validationErrors.address ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)";
                  }}
                  placeholder="Enter address"
                />
                {validationErrors.address && (
                  <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: "500" }}>
                    {validationErrors.address}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#dd901d",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Phone
                </label>
                <input
                  type="text"
                  value={contactData.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: validationErrors.phone ? "1px solid #ef4444" : "1px solid rgba(221, 144, 29, 0.3)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    backgroundColor: validationErrors.phone ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)",
                    color: "#f5f5f5",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = validationErrors.phone ? "#ef4444" : "rgba(221, 144, 29, 0.6)";
                    e.target.style.backgroundColor = validationErrors.phone ? "rgba(239, 68, 68, 0.12)" : "rgba(221, 144, 29, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.phone ? "#ef4444" : "rgba(221, 144, 29, 0.3)";
                    e.target.style.backgroundColor = validationErrors.phone ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)";
                  }}
                  placeholder="Enter phone number"
                />
                {validationErrors.phone && (
                  <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: "500" }}>
                    {validationErrors.phone}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#dd901d",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: validationErrors.email ? "1px solid #ef4444" : "1px solid rgba(221, 144, 29, 0.3)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    backgroundColor: validationErrors.email ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)",
                    color: "#f5f5f5",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = validationErrors.email ? "#ef4444" : "rgba(221, 144, 29, 0.6)";
                    e.target.style.backgroundColor = validationErrors.email ? "rgba(239, 68, 68, 0.12)" : "rgba(221, 144, 29, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.email ? "#ef4444" : "rgba(221, 144, 29, 0.3)";
                    e.target.style.backgroundColor = validationErrors.email ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)";
                  }}
                  placeholder="Enter email address"
                />
                {validationErrors.email && (
                  <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: "500" }}>
                    {validationErrors.email}
                  </div>
                )}
              </div>

              {/* Hours */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#dd901d",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Business Hours
                </label>
                <input
                  type="text"
                  value={contactData.hours}
                  onChange={(e) => handleContactChange("hours", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: validationErrors.hours ? "1px solid #ef4444" : "1px solid rgba(221, 144, 29, 0.3)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    backgroundColor: validationErrors.hours ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)",
                    color: "#f5f5f5",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = validationErrors.hours ? "#ef4444" : "rgba(221, 144, 29, 0.6)";
                    e.target.style.backgroundColor = validationErrors.hours ? "rgba(239, 68, 68, 0.12)" : "rgba(221, 144, 29, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.hours ? "#ef4444" : "rgba(221, 144, 29, 0.3)";
                    e.target.style.backgroundColor = validationErrors.hours ? "rgba(239, 68, 68, 0.08)" : "rgba(221, 144, 29, 0.08)";
                  }}
                  placeholder="e.g., Mon-Fri: 8:00 AM - 5:00 PM"
                />
                {validationErrors.hours && (
                  <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: "500" }}>
                    {validationErrors.hours}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {validationErrors.socialLinks && (
                <div
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.5)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    color: "#ef4444",
                    fontWeight: "500",
                  }}
                >
                  {validationErrors.socialLinks}
                </div>
              )}
              {/* Add New Social Link */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(221, 144, 29, 0.2)" }}>
                {/* Platform Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#dd901d",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Social Media Platform
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                    {SOCIAL_PLATFORMS.map(platform => {
                      const isExisting = socialLinks.some(link => link.platform === platform.id);
                      return (
                        <button
                          key={platform.id}
                          onClick={() => {
                            if (!isExisting) {
                              setNewSocialPlatform(platform.id);
                            }
                          }}
                          disabled={isExisting}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "10px 12px",
                            background: newSocialPlatform === platform.id && !isExisting ? "#dd901d" : "#2a2a2a",
                            border: `2px solid ${newSocialPlatform === platform.id && !isExisting ? "#dd901d" : "rgba(221, 144, 29, 0.3)"}`,
                            borderRadius: "8px",
                            color: newSocialPlatform === platform.id && !isExisting ? "#000" : "#999",
                            cursor: isExisting ? "not-allowed" : "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            transition: "all 0.3s ease",
                            fontFamily: "Inter, sans-serif",
                            opacity: isExisting ? 0.4 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isExisting && newSocialPlatform !== platform.id) {
                              e.target.style.borderColor = "#dd901d";
                              e.target.style.color = "#dd901d";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isExisting && newSocialPlatform !== platform.id) {
                              e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
                              e.target.style.color = "#999";
                            }
                          }}
                          title={isExisting ? "Already added" : `Select ${platform.label}`}
                        >
                          <platform.icon />
                          <span>{platform.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* URL Input */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#dd901d",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    URL
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        border: "1px solid rgba(221, 144, 29, 0.3)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "Inter, sans-serif",
                        boxSizing: "border-box",
                        backgroundColor: "rgba(221, 144, 29, 0.08)",
                        color: "#f5f5f5",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
                        e.target.style.backgroundColor = "rgba(221, 144, 29, 0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
                        e.target.style.backgroundColor = "rgba(221, 144, 29, 0.08)";
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !isAddDisabled) {
                          handleAddSocial();
                        }
                      }}
                      placeholder="https://..."
                    />
                    <button
                      onClick={handleAddSocial}
                      disabled={isAddDisabled}
                      style={{
                        padding: "10px 16px",
                        background: isAddDisabled ? "#999" : "#dd901d",
                        border: "none",
                        borderRadius: "8px",
                        color: "#000",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: isAddDisabled ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (!isAddDisabled) {
                          e.target.style.background = "#c97c1c";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isAddDisabled) {
                          e.target.style.background = "#dd901d";
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Social Links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#dd901d",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Added Links
                </label>
                {socialLinks.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "14px", textAlign: "center", padding: "16px 0" }}>
                    No social links added yet
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {socialLinks.map(link => {
                      const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform);
                      const linkIndex = socialLinks.findIndex(l => l.id === link.id);
                      const linkError = validationErrors[`social_${linkIndex}`];
                      return (
                        <div key={link.id}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px",
                              background: "#2a2a2a",
                              border: linkError ? "1px solid #ef4444" : "1px solid rgba(221, 144, 29, 0.2)",
                              borderRadius: "8px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "32px",
                                  height: "32px",
                                  background: "#dd901d",
                                  borderRadius: "6px",
                                  color: "#000",
                                }}
                              >
                                <platform.icon />
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#dd901d",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  {platform.label}
                                </span>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: "12px",
                                    color: "#999",
                                    textDecoration: "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {link.url.length > 40 ? link.url.substring(0, 40) + "..." : link.url}
                                </a>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveSocial(link.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "32px",
                                height: "32px",
                                background: "transparent",
                                border: "1px solid #555",
                                borderRadius: "6px",
                                color: "#ef4444",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#ef4444";
                                e.target.style.color = "#fff";
                                e.target.style.borderColor = "#ef4444";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "transparent";
                                e.target.style.color = "#ef4444";
                                e.target.style.borderColor = "#555";
                              }}
                              title="Delete"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                          {linkError && (
                            <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: "500" }}>
                              {linkError}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "28px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(221, 144, 29, 0.2)",
          }}
        >
          <button
            onClick={handleCloseClick}
            style={{
              padding: "12px 24px",
              background: "transparent",
              border: "1px solid rgba(221, 144, 29, 0.3)",
              borderRadius: "8px",
              color: "#dd901d",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#dd901d";
              e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            style={{
              padding: "12px 24px",
              background: "#dd901d",
              border: "none",
              borderRadius: "8px",
              color: "#000",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#c97c1c";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#dd901d";
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <ConfirmExitDialog
      isOpen={showConfirm}
      onConfirm={confirmType === "save" ? handleConfirmSave : handleConfirmExit}
      onCancel={() => {
        setShowConfirm(false);
        setConfirmType("exit");
      }}
      title={confirmType === "save" ? "Save Changes?" : "Close Editor?"}
      message={
        confirmType === "save"
          ? "Are you sure you want to save these changes? This action cannot be undone."
          : "Are you sure you want to close without saving?"
      }
      confirmButtonLabel={confirmType === "save" ? "Save Changes" : "Discard Changes"}
      cancelButtonLabel={confirmType === "save" ? "Cancel" : "Continue Editing"}
    />
  </>
  );
}
