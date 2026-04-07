import { useState, useEffect } from "react";

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

  const getPlatformIcon = (platformId) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return platform ? <platform.icon /> : null;
  };

  const isAddDisabled = !newSocialUrl.trim() || socialLinks.some(link => link.platform === newSocialPlatform);

  if (!isOpen) return null;

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
        zIndex: 1001,
        fontFamily: "Inter, sans-serif",
      }}
      onClick={onClose}
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
            onClick={onClose}
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
                  placeholder="Enter address"
                />
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
                  placeholder="Enter phone number"
                />
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
                  placeholder="Enter email address"
                />
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
                  placeholder="e.g., Mon-Fri: 8:00 AM - 5:00 PM"
                />
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                      return (
                        <div
                          key={link.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px",
                            background: "#2a2a2a",
                            border: "1px solid rgba(221, 144, 29, 0.2)",
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
            onClick={onClose}
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
            onClick={handleSave}
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
  );
}
