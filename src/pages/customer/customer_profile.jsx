import { useEffect, useState } from "react";
import { CustomerShell } from "./customer_shell";
import { useCustomerProfileData } from "./customer_store";
import { useToast } from "../../components/toast";

const SaveIcon = ({ color = "#22c55e" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CancelIcon = ({ color = "#ef4343" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = ({ color = "#ef4343" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SMSIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 6l10 8 10-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function CustomerProfilePage() {
  const [profile, setProfile] = useCustomerProfileData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const { showToast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const profileInitial = (profile.name || tempProfile.name || "?").trim().charAt(0).toUpperCase() || "?";
  const hasChanges = JSON.stringify(tempProfile) !== JSON.stringify(profile);
  const avatarSize = isMobile ? 70 : 230;
  const avatarFontSize = isMobile ? 22 : 62;
  const avatarStyle = {
    width: avatarSize,
    height: avatarSize,
    fontSize: avatarFontSize,
  };

  const validateProfile = () => {
    const errors = {};

    if (!tempProfile.name || tempProfile.name.trim() === "") {
      errors.name = "Name is required";
    }

    const validEmails = tempProfile.emails ? tempProfile.emails.filter((email) => email.trim()) : [];
    const validPhones = tempProfile.phones ? tempProfile.phones.filter((phone) => phone.trim()) : [];

    if (validEmails.length === 0 && validPhones.length === 0) {
      errors.contact = "At least one valid email or phone number is required";
    }

    if (tempProfile.notificationPreference === "sms" && validPhones.length === 0) {
      errors.notificationPreference = "Phone number is required for SMS notifications";
    }

    if (tempProfile.notificationPreference === "email" && validEmails.length === 0) {
      errors.notificationPreference = "Email is required for email notifications";
    }

    return errors;
  };

  const handleEditProfile = () => {
    setTempProfile(profile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    const errors = validateProfile();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast({ message: Object.values(errors)[0] || "Please fix the highlighted fields.", type: "warning" });
      return;
    }

    setValidationErrors({});
    setConfirmationAction("save");
    setConfirmationMessage("Are you sure you want to save these profile details?");
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    const changesWereMade = hasChanges;
    setProfile(tempProfile);
    setIsEditingProfile(false);
    setShowConfirmation(false);

    if (changesWereMade) {
      showToast({ message: "Profile details saved successfully!", type: "success" });
    }
  };

  const handleCancelEdit = () => {
    setConfirmationAction("cancel");
    setConfirmationMessage("Are you sure you want to cancel? Any unsaved changes will be lost.");
    setShowConfirmation(true);
  };

  const handleConfirmCancel = () => {
    setIsEditingProfile(false);
    setShowConfirmation(false);
  };

  const handleAddEmail = () => setTempProfile((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  const handleAddPhone = () => setTempProfile((prev) => ({ ...prev, phones: [...prev.phones, ""] }));

  const handleEditEmail = (index, value) => {
    setTempProfile((prev) => ({
      ...prev,
      emails: prev.emails.map((email, i) => (i === index ? value : email)),
    }));
  };

  const handleEditPhone = (index, value) => {
    setTempProfile((prev) => ({
      ...prev,
      phones: prev.phones.map((phone, i) => (i === index ? value : phone)),
    }));
  };

  const handleRemoveEmail = (index) => {
    setTempProfile((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  };

  const handleRemovePhone = (index) => {
    setTempProfile((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
  };

  const profileAvatar = (
    <div className="cdb-avatar cdb-avatar-dashboard cdb-avatar-profile" style={avatarStyle} aria-label={`${profile.name || "Customer"} avatar`}>
      <div className="cdb-avatar-placeholder">
        <span className="cdb-avatar-initial">{profileInitial}</span>
      </div>
    </div>
  );

  return (
    <CustomerShell activeNav="profile" profile={profile}>
      <section className="cdb-section cdb-mounted">
        <div className="cdb-card">
          <h2 className="cdb-section-title">Full Profile Details</h2>
          {!isEditingProfile ? (
            <>
              {isMobile ? (
                <div className="cdb-profile-info-col">
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                    {profileAvatar}
                  </div>
                  <div>
                    <label className="cdb-field-label">Name</label>
                    <p className="cdb-field-value cdb-field-value-lg">{profile.name}</p>
                  </div>
                  <div>
                    <label className="cdb-field-label">Email</label>
                    <p className="cdb-field-value cdb-field-value-lg">
                      {profile.emails && profile.emails.length ? profile.emails[0] : <span style={{ color: "#a3a398" }}>No email added</span>}
                    </p>
                  </div>
                  <div>
                    <label className="cdb-field-label">Phone</label>
                    <p className="cdb-field-value cdb-field-value-lg">
                      {profile.phones && profile.phones.length ? profile.phones[0] : <span style={{ color: "#a3a398" }}>No phone added</span>}
                    </p>
                  </div>
                  <div>
                    <label className="cdb-field-label">Notification Preference</label>
                    <p className="cdb-field-value cdb-field-value-lg">
                      {typeof profile.notificationPreference === "string"
                        ? profile.notificationPreference.toUpperCase()
                        : profile.notificationPreference
                          ? "ENABLED"
                          : "DISABLED"}
                    </p>
                  </div>
                  <div style={{ width: "100%", borderTop: "1px solid rgba(221, 144, 29, 0.12)", margin: "12px 0 8px" }} />
                  <div>
                    <label className="cdb-field-label">All Emails</label>
                    {profile.emails && profile.emails.length > 0 ? (
                      profile.emails.map((email, i) => <p key={i} className="cdb-field-value">{email}</p>)
                    ) : (
                      <p className="cdb-field-value cdb-muted-text">No emails added</p>
                    )}
                  </div>
                  <div>
                    <label className="cdb-field-label">All Phone Numbers</label>
                    {profile.phones && profile.phones.length > 0 ? (
                      profile.phones.map((phone, i) => <p key={i} className="cdb-field-value">{phone}</p>)
                    ) : (
                      <p className="cdb-field-value cdb-muted-text">No phone numbers added</p>
                    )}
                  </div>
                  <div className="cdb-action-row">
                    <button className="cdb-btn cdb-btn-edit" onClick={handleEditProfile}>Edit Profile</button>
                  </div>
                </div>
              ) : (
                <div className="cdb-grid cdb-grid-profile cdb-grid-avatar">
                  <div className="cdb-profile-avatar-col">{profileAvatar}</div>
                  <div className="cdb-profile-info-split">
                    <div className="cdb-profile-info-left">
                      <div>
                        <label className="cdb-field-label">Name</label>
                        <p className="cdb-field-value cdb-field-value-lg">{profile.name}</p>
                      </div>
                      <div>
                        <label className="cdb-field-label">Email</label>
                        <p className="cdb-field-value cdb-field-value-lg">{profile.emails && profile.emails.length ? profile.emails[0] : <span className="cdb-muted-text">No email added</span>}</p>
                      </div>
                      <div>
                        <label className="cdb-field-label">Phone</label>
                        <p className="cdb-field-value cdb-field-value-lg">{profile.phones && profile.phones.length ? profile.phones[0] : <span className="cdb-muted-text">No phone added</span>}</p>
                      </div>
                      <div className="cdb-action-row">
                        <button className="cdb-btn cdb-btn-edit" onClick={handleEditProfile}>Edit Profile</button>
                      </div>
                    </div>
                    <div className="cdb-profile-info-right">
                      <div>
                        <label className="cdb-field-label">All Emails</label>
                        {profile.emails && profile.emails.length > 0 ? (
                          profile.emails.map((email, i) => <p key={i} className="cdb-field-value">{email}</p>)
                        ) : (
                          <p className="cdb-field-value cdb-muted-text">No emails added</p>
                        )}
                      </div>
                      <div>
                        <label className="cdb-field-label">All Phone Numbers</label>
                        {profile.phones && profile.phones.length > 0 ? (
                          profile.phones.map((phone, i) => <p key={i} className="cdb-field-value">{phone}</p>)
                        ) : (
                          <p className="cdb-field-value cdb-muted-text">No phone numbers added</p>
                        )}
                      </div>
                      <div>
                        <label className="cdb-field-label">Notification Preference</label>
                        <p className="cdb-field-value cdb-field-value-lg">{profile.notificationPreference ? profile.notificationPreference.toUpperCase() : ""}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isMobile ? (
                <div className="cdb-profile-info-col">
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                    <div className="cdb-avatar-edit-wrapper" style={{ width: avatarSize, height: avatarSize }}>
                      <div className="cdb-avatar cdb-avatar-dashboard cdb-avatar-profile" style={avatarStyle} aria-label={`${tempProfile.name || "Customer"} avatar`}>
                        <div className="cdb-avatar-placeholder">
                          <span className="cdb-avatar-initial">{(tempProfile.name || "?").trim().charAt(0).toUpperCase() || "?"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="cdb-field-label">Name</label>
                    <input className="cdb-input" value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} />
                    {validationErrors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.name}</p>}
                  </div>

                  <div>
                    <label className="cdb-field-label">Emails</label>
                    {tempProfile.emails.map((email, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <input className="cdb-input" value={email} onChange={(e) => handleEditEmail(i, e.target.value)} />
                        <button
                          type="button"
                          className="cdb-btn cdb-btn-icon"
                          onClick={() => handleRemoveEmail(i)}
                          aria-label="Remove email"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: "1px solid rgba(239,68,68,0.12)",
                            background: "#ef4444",
                            color: "#fff",
                            padding: 0,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          <CancelIcon color="#fff" />
                        </button>
                      </div>
                    ))}
                    {validationErrors.emails && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{validationErrors.emails}</p>}
                    <button className="cdb-btn cdb-btn-secondary" onClick={handleAddEmail}>Add Email</button>
                  </div>

                  <div>
                    <label className="cdb-field-label">Phone Numbers</label>
                    {tempProfile.phones.map((phone, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <input className="cdb-input" maxLength="11" value={phone} onChange={(e) => handleEditPhone(i, e.target.value)} />
                        <button
                          type="button"
                          className="cdb-btn cdb-btn-icon"
                          onClick={() => handleRemovePhone(i)}
                          aria-label="Remove phone"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: "1px solid rgba(239,68,68,0.12)",
                            background: "#ef4444",
                            color: "#fff",
                            padding: 0,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          <CancelIcon color="#fff" />
                        </button>
                      </div>
                    ))}
                    {validationErrors.phones && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{validationErrors.phones}</p>}
                    <button className="cdb-btn cdb-btn-secondary" onClick={handleAddPhone}>Add Phone</button>
                  </div>

                  <div>
                    <label className="cdb-field-label">Notification Preference</label>
                    <div className="cdb-pref-edit-row" style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                      <button
                        type="button"
                        className={`cdb-pref-option ${tempProfile.notificationPreference === "email" ? "active" : ""}`}
                        onClick={() => setTempProfile({ ...tempProfile, notificationPreference: "email" })}
                        style={{ flex: 1, width: "100%" }}
                      >
                        <EmailIcon /> Email
                      </button>
                      <button
                        type="button"
                        className={`cdb-pref-option ${tempProfile.notificationPreference === "sms" ? "active" : ""}`}
                        onClick={() => setTempProfile({ ...tempProfile, notificationPreference: "sms" })}
                        style={{ flex: 1, width: "100%" }}
                      >
                        <SMSIcon /> SMS
                      </button>
                    </div>
                    {validationErrors.notificationPreference && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>{validationErrors.notificationPreference}</p>}
                  </div>

                  <div className="cdb-action-row" style={{ marginTop: 4 }}>
                    <button className="cdb-btn cdb-btn-danger-outline" onClick={handleCancelEdit}>Cancel</button>
                    <button className="cdb-btn cdb-btn-success" onClick={handleSaveProfile}>Save</button>
                  </div>
                </div>
              ) : (
                <div className="cdb-grid cdb-grid-profile cdb-grid-avatar">
                  <div className="cdb-profile-avatar-col">
                    <div className="cdb-avatar-edit-wrapper" style={{ width: avatarSize, height: avatarSize }}>
                      <div className="cdb-avatar cdb-avatar-dashboard cdb-avatar-profile" style={avatarStyle} aria-label={`${tempProfile.name || "Customer"} avatar`}>
                        <div className="cdb-avatar-placeholder">
                          <span className="cdb-avatar-initial">{(tempProfile.name || "?").trim().charAt(0).toUpperCase() || "?"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cdb-profile-edit-col" style={{ height: "500px", overflowY: "auto" }}>
                    <div className="cdb-profile-edit-left">
                      <div className="cdb-form-section">
                        <label className="cdb-field-label">Name</label>
                        <input className="cdb-input" value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} />
                        {validationErrors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.name}</p>}
                      </div>

                      <div className="cdb-form-section">
                        <label className="cdb-field-label">Emails</label>
                        {tempProfile.emails.map((email, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <input className="cdb-input" value={email} onChange={(e) => handleEditEmail(i, e.target.value)} />
                            <button
                              type="button"
                              className="cdb-btn cdb-btn-icon"
                              onClick={() => handleRemoveEmail(i)}
                              aria-label="Remove email"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                border: "1px solid rgba(239,68,68,0.12)",
                                background: "#ef4444",
                                color: "#fff",
                                padding: 0,
                                cursor: "pointer",
                              }}
                            >
                              <CancelIcon color="#fff" />
                            </button>
                          </div>
                        ))}
                        {validationErrors.emails && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{validationErrors.emails}</p>}
                        <button className="cdb-btn cdb-btn-secondary" onClick={handleAddEmail}>Add Email</button>
                      </div>

                      <div className="cdb-form-section">
                        <label className="cdb-field-label">Phone Numbers</label>
                        {tempProfile.phones.map((phone, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <input className="cdb-input" maxLength="11" value={phone} onChange={(e) => handleEditPhone(i, e.target.value)} />
                            <button
                              type="button"
                              className="cdb-btn cdb-btn-icon"
                              onClick={() => handleRemovePhone(i)}
                              aria-label="Remove phone"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                border: "1px solid rgba(239,68,68,0.12)",
                                background: "#ef4444",
                                color: "#fff",
                                padding: 0,
                                cursor: "pointer",
                              }}
                            >
                              <CancelIcon color="#fff" />
                            </button>
                          </div>
                        ))}
                        {validationErrors.phones && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{validationErrors.phones}</p>}
                        <button className="cdb-btn cdb-btn-secondary" onClick={handleAddPhone}>Add Phone</button>
                      </div>
                    </div>

                    <div className="cdb-profile-edit-right">
                      <div className="cdb-form-section">
                        <label className="cdb-field-label">Notification Preference</label>
                        <div className="cdb-pref-edit-row">
                          <button type="button" className={`cdb-pref-option ${tempProfile.notificationPreference === "email" ? "active" : ""}`} onClick={() => setTempProfile({ ...tempProfile, notificationPreference: "email" })}><EmailIcon /> Email</button>
                          <button type="button" className={`cdb-pref-option ${tempProfile.notificationPreference === "sms" ? "active" : ""}`} onClick={() => setTempProfile({ ...tempProfile, notificationPreference: "sms" })}><SMSIcon /> SMS</button>
                        </div>
                        {validationErrors.notificationPreference && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>{validationErrors.notificationPreference}</p>}
                      </div>

                      <div className="cdb-action-row">
                        <button className="cdb-btn cdb-btn-danger-outline" onClick={handleCancelEdit}>Cancel</button>
                        <button className="cdb-btn cdb-btn-success" onClick={handleSaveProfile}>Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {showConfirmation && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(221, 144, 29, 0.18)",
            borderRadius: "18px",
            padding: "30px 24px",
            maxWidth: "360px",
            width: "90%",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
          }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "20px", fontWeight: "700", color: "#1a0f00", textAlign: "center" }}>
              Confirm {confirmationAction === "save" ? "Save" : "Cancel"}
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#665544", textAlign: "center", lineHeight: "1.5" }}>
              {confirmationMessage}
            </p>
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <button
                onClick={() => setShowConfirmation(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dd901d",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Keep Changes
              </button>
              <button
                onClick={confirmationAction === "save" ? handleConfirmSave : handleConfirmCancel}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1.5px solid #dd901d",
                  background: "transparent",
                  color: "#dd901d",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {confirmationAction === "save" ? "Yes, Save Changes" : "Yes, Cancel Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
}
