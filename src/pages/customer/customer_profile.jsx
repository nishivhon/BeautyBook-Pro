import { useState } from "react";
import { CustomerShell } from "./customer_shell";
import { useCustomerProfileData } from "./customer_store";
import { Toast } from "../../components/toast";

const EditIcon = ({ color = "#dd901d" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

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

const SMSIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#dd901d" strokeWidth="1.5" />
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#dd901d" strokeWidth="1.5" />
    <path d="M2 6l10 8 10-8" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function CustomerProfilePage() {
  const [profile, setProfile] = useCustomerProfileData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  
  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  
  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  const profileImage = profile.profilePhoto || "/default-avatar.svg";

  // Check if profile has been modified
  const hasChanges = JSON.stringify(tempProfile) !== JSON.stringify(profile);

  // Validation function
  const validateProfile = () => {
    const errors = {};
    
    if (!tempProfile.name || tempProfile.name.trim() === "") {
      errors.name = "Name is required";
    }
    
    if (!tempProfile.emails || tempProfile.emails.length === 0 || tempProfile.emails.some(email => !email.trim())) {
      errors.emails = "At least one valid email is required";
    }
    
    if (!tempProfile.phones || tempProfile.phones.length === 0 || tempProfile.phones.some(phone => !phone.trim())) {
      errors.phones = "At least one valid phone number is required";
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
      setToastMessage("Profile details saved successfully!");
      setToastType("success");
      setShowToast(true);
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

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setTempProfile((prev) => ({ ...prev, profilePhoto: url }));
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

  return (
    <CustomerShell activeNav="profile" profile={profile}>
      <section className="cdb-section cdb-mounted">
        <div className="cdb-card">
          <h2 className="cdb-section-title">Full Profile Details</h2>
          {!isEditingProfile ? (
            <>
              <div className="cdb-grid cdb-grid-profile cdb-grid-avatar">
                <div className="cdb-profile-avatar-col">
                  <div className="cdb-avatar cdb-avatar-dashboard">
                    <img src={profileImage} alt={profile.name + " avatar"} />
                  </div>
                </div>
                <div className="cdb-profile-info-split">
                  <div className="cdb-profile-info-left">
                    <div>
                      <label className="cdb-field-label">Name</label>
                      <p className="cdb-field-value cdb-field-value-lg">{profile.name}</p>
                    </div>
                    <div>
                      <label className="cdb-field-label">Email</label>
                      <p className="cdb-field-value cdb-field-value-lg">{profile.emails && profile.emails.length ? profile.emails[0] : ""}</p>
                    </div>
                    <div>
                      <label className="cdb-field-label">Phone</label>
                      <p className="cdb-field-value cdb-field-value-lg">{profile.phones && profile.phones.length ? profile.phones[0] : ""}</p>
                    </div>
                    <div className="cdb-action-row">
                      <button className="cdb-btn cdb-btn-edit" onClick={handleEditProfile}><EditIcon /> Edit Profile</button>
                    </div>
                  </div>
                  <div className="cdb-profile-info-right">
                    <div>
                      <label className="cdb-field-label">All Emails</label>
                      {profile.emails.map((email, i) => (
                        <p key={i} className="cdb-field-value">{email}</p>
                      ))}
                    </div>
                    <div>
                      <label className="cdb-field-label">All Phone Numbers</label>
                      {profile.phones.map((phone, i) => (
                        <p key={i} className="cdb-field-value">{phone}</p>
                      ))}
                    </div>
                    <div>
                      <label className="cdb-field-label">Notification Preference</label>
                      <p className="cdb-field-value cdb-field-value-lg">{profile.notificationPreference ? profile.notificationPreference.toUpperCase() : ""}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="cdb-grid cdb-grid-profile cdb-grid-avatar">
                <div className="cdb-profile-avatar-col">
                  <div className="cdb-avatar-edit-wrapper">
                    <div className="cdb-avatar cdb-avatar-dashboard">
                      <img src={tempProfile.profilePhoto || "/default-avatar.svg"} alt={tempProfile.name + " avatar"} />
                    </div>
                    <button 
                      type="button"
                      className="cdb-avatar-edit-btn"
                      onClick={() => document.getElementById("profilePhotoInput").click()}
                      title="Edit profile picture"
                    >
                      <EditIcon color="#fff" />
                    </button>
                    <input 
                      id="profilePhotoInput"
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePhotoUpload} 
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
                <div className="cdb-profile-edit-col">
                  <div className="cdb-profile-edit-left">
                    <div className="cdb-form-section">
                      <label className="cdb-field-label">Name</label>
                      <input className="cdb-input" value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} />
                      {validationErrors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.name}</p>}
                    </div>

                    <div className="cdb-form-section">
                      <label className="cdb-field-label">Emails</label>
                      {tempProfile.emails.map((email, i) => (
                        <input key={i} className="cdb-input cdb-spacing-bottom" value={email} onChange={(e) => handleEditEmail(i, e.target.value)} />
                      ))}
                      {validationErrors.emails && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{validationErrors.emails}</p>}
                      <button className="cdb-btn cdb-btn-secondary" onClick={handleAddEmail}>Add Email</button>
                    </div>

                    <div className="cdb-form-section">
                      <label className="cdb-field-label">Phone Numbers</label>
                      {tempProfile.phones.map((phone, i) => (
                        <input key={i} className="cdb-input cdb-spacing-bottom" value={phone} onChange={(e) => handleEditPhone(i, e.target.value)} />
                      ))}
                      {validationErrors.phones && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{validationErrors.phones}</p>}
                      <button className="cdb-btn cdb-btn-secondary" onClick={handleAddPhone}>Add Phone</button>
                    </div>
                  </div>

                  <div className="cdb-profile-edit-right">
                    <div className="cdb-form-section">
                      <label className="cdb-field-label">Notification Preference</label>
                      <div className="cdb-pref-edit-row">
                        <button className={`cdb-pref-option ${tempProfile.notificationPreference === "email" ? "active" : ""}`} onClick={() => setTempProfile({ ...tempProfile, notificationPreference: "email" })}><EmailIcon /> Email</button>
                        <button className={`cdb-pref-option ${tempProfile.notificationPreference === "sms" ? "active" : ""}`} onClick={() => setTempProfile({ ...tempProfile, notificationPreference: "sms" })}><SMSIcon /> SMS</button>
                      </div>
                    </div>

                    <div className="cdb-action-row">
                      <button className="cdb-btn cdb-btn-danger-outline" onClick={handleCancelEdit}>Cancel</button>
                      <button className="cdb-btn cdb-btn-success" onClick={handleSaveProfile}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#0c0b09",
            border: "1px solid rgba(221, 144, 29, 0.2)",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "400px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: "#dd901d" }}>
              Confirm {confirmationAction === "save" ? "Save" : "Cancel"}
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#f5f1eb" }}>
              {confirmationMessage}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowConfirmation(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid rgba(221, 144, 29, 0.3)",
                  background: "rgba(221, 144, 29, 0.15)",
                  color: "#dd901d",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                No
              </button>
              <button
                onClick={confirmationAction === "save" ? handleConfirmSave : handleConfirmCancel}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: confirmationAction === "save" ? "#22c55e" : "#ef4444",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        duration={4000}
      />
    </CustomerShell>
  );
}
