import { useEffect, useState } from "react";
import { CustomerShell } from "./customer_shell";
import { useCustomerProfileData } from "./customer_store";
import { useToast } from "../../components/toast";
import { Otp } from "../../components/modal/customer/otp";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";

const SaveIcon = ({ color = "#22c55e" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FieldSpinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: "spin 0.85s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(34, 197, 94, 0.22)" strokeWidth="3" />
    <path d="M12 2a10 10 0 0110 10" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
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

const normalizeEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");
const normalizePhone = (value) => (typeof value === "string" ? value.replace(/\D/g, "") : "");
const getPrimaryValue = (values) => (Array.isArray(values) ? values.map((value) => String(value || "").trim()).find(Boolean) || "" : "");
const getCleanValues = (values) => (Array.isArray(values) ? values.map((value) => String(value || "").trim()).filter(Boolean) : []);
const toSingleItemArray = (value) => {
  const cleaned = String(value || "").trim();
  return cleaned ? [cleaned] : [];
};

export default function CustomerProfilePage() {
  const [profile, setProfile] = useCustomerProfileData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const { showToast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [pendingNotifPref, setPendingNotifPref] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpType, setOtpType] = useState("email");
  const [otpTarget, setOtpTarget] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [otpRequestField, setOtpRequestField] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [pendingProfileUpdate, setPendingProfileUpdate] = useState(null);
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [otpSessionKey, setOtpSessionKey] = useState(0);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const profileInitial = (profile.name || tempProfile.name || "?").trim().charAt(0).toUpperCase() || "?";
  const hasChanges = JSON.stringify(tempProfile) !== JSON.stringify(profile);
  const currentName = String(profile.name || "").trim();
  const currentEmail = normalizeEmail(getPrimaryValue(profile.emails));
  const currentPhone = normalizePhone(getPrimaryValue(profile.phones));
  const nextName = String(tempProfile.name || "").trim();
  const nextEmail = normalizeEmail(getPrimaryValue(tempProfile.emails));
  const nextPhone = normalizePhone(getPrimaryValue(tempProfile.phones));
  const isNameDirty = nextName !== currentName;
  const isEmailDirty = nextEmail !== currentEmail;
  const isPhoneDirty = nextPhone !== currentPhone;
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

    const validEmails = getCleanValues(tempProfile.emails);
    const validPhones = getCleanValues(tempProfile.phones);

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

  const getContactQueue = (currentProfile, nextProfile) => {
    const queue = [];

    const currentEmail = normalizeEmail(getPrimaryValue(currentProfile?.emails));
    const nextEmail = normalizeEmail(getPrimaryValue(nextProfile?.emails));
    if (nextEmail && nextEmail !== currentEmail) {
      queue.push({ type: "email", value: nextEmail });
    }

    const currentPhone = normalizePhone(getPrimaryValue(currentProfile?.phones));
    const nextPhone = normalizePhone(getPrimaryValue(nextProfile?.phones));
    if (nextPhone && nextPhone !== currentPhone) {
      queue.push({ type: "phone", value: nextPhone });
    }

    return queue;
  };

  const buildProfilePayload = (sourceProfile) => ({
    ...sourceProfile,
    name: String(sourceProfile?.name || "").trim(),
    emails: toSingleItemArray(getPrimaryValue(sourceProfile?.emails)),
    phones: toSingleItemArray(getPrimaryValue(sourceProfile?.phones)),
  });

  const saveProfileToDatabase = async (profileToSave) => {
    if (!profile?.id) {
      showToast({ message: "Missing customer account information.", type: "error" });
      return false;
    }

    setIsSubmittingProfile(true);
    try {
      const cleanedProfile = buildProfilePayload(profileToSave);
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/customers/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: profile.id,
          name: cleanedProfile.name,
          email: normalizeEmail(getPrimaryValue(cleanedProfile.emails)),
          phone: normalizePhone(getPrimaryValue(cleanedProfile.phones)),
          histories: cleanedProfile.histories || profile.histories || [],
          notificationPreference: cleanedProfile.notificationPreference || profile.notificationPreference || "",
        }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.error || body?.details || "Failed to save profile changes.");
      }

      const updatedCustomer = body.customer || body.data || body;
      const updatedProfile = {
        ...profile,
        ...cleanedProfile,
        name: updatedCustomer?.name || cleanedProfile.name,
        emails: updatedCustomer?.email ? [updatedCustomer.email] : cleanedProfile.emails,
        phones: updatedCustomer?.phone ? [updatedCustomer.phone] : cleanedProfile.phones,
        histories: updatedCustomer?.histories || cleanedProfile.histories || profile.histories || [],
        notificationPreference: (function() {
          const pref = updatedCustomer?.notif_pref || updatedCustomer?.notificationPreference || cleanedProfile.notificationPreference || profile.notificationPreference || "";
          if (!pref) return "";
          const val = String(pref).trim();
          if (val === 'email' || val === 'sms') return val;
          if (val.includes('@')) return 'email';
          if (/\d/.test(val)) return 'sms';
          return "";
        })(),
      };

      setProfile(updatedProfile);
      setTempProfile(updatedProfile);
      setIsEditingProfile(false);
      setPendingProfileUpdate(null);
      setVerificationQueue([]);
      setShowOtpModal(false);
      setOtpError("");
      setOtpTarget("");
      setOtpRequestField(null);
      setIsSendingOtp(false);
      showToast({ message: "Profile details saved successfully!", type: "success" });
      return true;
    } catch (error) {
      console.error("[CustomerProfile] Save failed:", error);
      showToast({ message: error.message || "Failed to save profile details.", type: "error" });
      return false;
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const sendOtpForContact = async (contact) => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const endpoint = contact.type === "email"
      ? `${apiUrl}/auth/send-email-otp`
      : `${apiUrl}/sms/send-otp`;
    const payload = contact.type === "email"
      ? { email: contact.value, full_name: tempProfile.name?.trim() || profile.name || "Customer" }
      : { phone: contact.value, name: tempProfile.name?.trim() || profile.name || "Customer" };

    setIsSubmittingProfile(true);
    setIsSendingOtp(true);
    setOtpRequestField(contact.type);
    setOtpError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.error || body?.details || `Failed to send ${contact.type} OTP.`);
      }

      setOtpType(contact.type);
      setOtpTarget(contact.value);
      setOtpSessionKey((current) => current + 1);
      setShowOtpModal(true);
      return true;
    } catch (error) {
      console.error("[CustomerProfile] OTP send failed:", error);
      showToast({ message: error.message || `Failed to send ${contact.type} OTP.`, type: "error" });
      return false;
    } finally {
      setIsSubmittingProfile(false);
      setIsSendingOtp(false);
      setOtpRequestField(null);
    }
  };

  const handleOtpVerified = async (otp) => {
    const currentContact = verificationQueue[0];
    if (!currentContact) return;

    setOtpLoading(true);
    setOtpError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const endpoint = currentContact.type === "email"
        ? `${apiUrl}/auth/verify-email-otp`
        : `${apiUrl}/sms/verify-otp`;
      const payload = currentContact.type === "email"
        ? { email: currentContact.value, otp: otp.replace(/\s/g, "") }
        : { phone: currentContact.value, otp: otp.replace(/\s/g, "") };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.error || "Invalid OTP. Please try again.");
      }

      const remaining = verificationQueue.slice(1);
      setVerificationQueue(remaining);
      setShowOtpModal(false);

      if (remaining.length > 0) {
        const nextContact = remaining[0];
        await sendOtpForContact(nextContact);
        return;
      }

      await saveProfileToDatabase(pendingProfileUpdate || tempProfile);
    } catch (error) {
      console.error("[CustomerProfile] OTP verification failed:", error);
      setOtpError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
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
    const cleanedProfile = buildProfilePayload(tempProfile);
    const queue = getContactQueue(profile, cleanedProfile);

    if (queue.length === 0) {
      saveProfileToDatabase(cleanedProfile);
      return;
    }

    setPendingProfileUpdate(cleanedProfile);
    setVerificationQueue(queue);
    sendOtpForContact(queue[0]);
  };

  const handleCancelEdit = () => {
    setConfirmationAction("cancel");
    setConfirmationMessage("Are you sure you want to cancel? Any unsaved changes will be lost.");
    setShowConfirmation(true);
  };

  const handleChangeNotifPref = (pref) => {
    // Determine actual contact value to store (email address or phone number)
    const currentEmail = normalizeEmail(getPrimaryValue(tempProfile.emails) || getPrimaryValue(profile.emails));
    const currentPhone = normalizePhone(getPrimaryValue(tempProfile.phones) || getPrimaryValue(profile.phones));
    const actual = pref === 'email' ? currentEmail : currentPhone;
    if (!actual) {
      showToast({ message: `No ${pref} available to set as notification preference.`, type: 'warning' });
      return;
    }

    setPendingNotifPref(actual);
    setConfirmationAction("notif_pref");
    setConfirmationMessage(`Set notification preference to ${pref === 'email' ? 'Email' : 'SMS'} (${actual})?`);
    setShowConfirmation(true);
  };

  const handleConfirmYes = async () => {
    // Called when user confirms the action in the confirmation modal
    if (confirmationAction === 'cancel') {
      handleConfirmCancel();
      return;
    }

    if (confirmationAction === 'notif_pref') {
      // Apply preference locally and save immediately
      const updatedTemp = { ...tempProfile, notificationPreference: pendingNotifPref };
      setTempProfile(updatedTemp);
      setShowConfirmation(false);
      setConfirmationAction(null);
      setConfirmationMessage("");
      setPendingNotifPref(null);
      await saveProfileToDatabase(updatedTemp);
      return;
    }

    // default fallback: close modal
    setShowConfirmation(false);
    setConfirmationAction(null);
    setConfirmationMessage("");
    setPendingNotifPref(null);
  };

  const handleConfirmCancel = () => {
    setIsEditingProfile(false);
    setShowConfirmation(false);
    setShowOtpModal(false);
    setOtpError("");
    setVerificationQueue([]);
    setPendingProfileUpdate(null);
    setOtpTarget("");
  };

  const handleAddEmail = () => setTempProfile((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  const handleAddPhone = () => setTempProfile((prev) => ({ ...prev, phones: [...prev.phones, ""] }));

  const renderCheckButton = (isDirty, label) => (
    otpRequestField === label && isSendingOtp ? (
      <div
        aria-label={`${label} OTP sending`}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          flexShrink: 0,
          pointerEvents: "none",
        }}
      >
        <FieldSpinner />
      </div>
    ) : (
    <button
      type="button"
      onClick={() => handleSaveProfile(label)}
      disabled={!isDirty || isSubmittingProfile}
      aria-label={`${label} changed, save updates`}
      title={isDirty ? `Save ${label} changes` : `${label} unchanged`}
      style={{
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 10,
        border: "none",
        background: "transparent",
        color: "#22c55e",
        opacity: isDirty ? 1 : 0.28,
        cursor: isDirty && !isSubmittingProfile ? "pointer" : "default",
        flexShrink: 0,
        transition: "all 0.2s ease",
      }}
    >
      <SaveIcon color="#22c55e" />
    </button>
    )
  );

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
                    {profile.emails && profile.emails.length && profile.phones && profile.phones.length ? (
                      <p className="cdb-field-value cdb-field-value-lg">
                        {typeof profile.notificationPreference === "string"
                          ? profile.notificationPreference.toUpperCase()
                          : profile.notificationPreference
                            ? "ENABLED"
                            : "DISABLED"}
                      </p>
                    ) : (
                      <p className="cdb-field-value cdb-field-value-lg"><span className="cdb-muted-text">Not available</span></p>
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
                        <label className="cdb-field-label">Notification Preference</label>
                        {profile.emails && profile.emails.length && profile.phones && profile.phones.length ? (
                          <p className="cdb-field-value cdb-field-value-lg">{profile.notificationPreference ? profile.notificationPreference.toUpperCase() : ""}</p>
                        ) : (
                          <p className="cdb-field-value cdb-field-value-lg"><span className="cdb-muted-text">Not available</span></p>
                        )}
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
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input className="cdb-input" style={{ flex: 1 }} value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} />
                      {renderCheckButton(isNameDirty, "name")}
                    </div>
                    {validationErrors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.name}</p>}
                  </div>

                  <div>
                    <label className="cdb-field-label">Email</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        className="cdb-input"
                        style={{ flex: 1 }}
                        type="email"
                        value={getPrimaryValue(tempProfile.emails)}
                        onChange={(e) => setTempProfile({ ...tempProfile, emails: toSingleItemArray(e.target.value) })}
                        placeholder="Enter email address"
                      />
                      {renderCheckButton(isEmailDirty, "email")}
                    </div>
                    {validationErrors.contact && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.contact}</p>}
                  </div>

                  <div>
                    <label className="cdb-field-label">Phone</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        className="cdb-input"
                        style={{ flex: 1 }}
                        maxLength="11"
                        value={getPrimaryValue(tempProfile.phones)}
                        onChange={(e) => setTempProfile({ ...tempProfile, phones: toSingleItemArray(e.target.value) })}
                        placeholder="Enter phone number"
                      />
                      {renderCheckButton(isPhoneDirty, "phone")}
                    </div>
                    {validationErrors.contact && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.contact}</p>}
                  </div>

                  <div>
                    <label className="cdb-field-label">Notification Preference</label>
                    {getPrimaryValue(tempProfile.emails) && getPrimaryValue(tempProfile.phones) ? (
                      <div className="cdb-pref-edit-row" style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                        <button
                          type="button"
                          className={`cdb-pref-option ${tempProfile.notificationPreference === "email" ? "active" : ""}`}
                          onClick={() => handleChangeNotifPref("email")}
                          style={{ flex: 1, width: "100%" }}
                        >
                          <EmailIcon /> Email
                        </button>
                        <button
                          type="button"
                          className={`cdb-pref-option ${tempProfile.notificationPreference === "sms" ? "active" : ""}`}
                          onClick={() => handleChangeNotifPref("sms")}
                          style={{ flex: 1, width: "100%" }}
                        >
                          <SMSIcon /> SMS
                        </button>
                      </div>
                    ) : (
                      <p className="cdb-muted-text">Add both an email and phone to set notification preferences.</p>
                    )}
                    {validationErrors.notificationPreference && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>{validationErrors.notificationPreference}</p>}
                  </div>

                  <div className="cdb-action-row" style={{ marginTop: 4 }}>
                    <button className="cdb-btn cdb-btn-danger-outline" onClick={handleCancelEdit}>Cancel</button>
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
                        <div style={{ position: "relative" }}>
                          <input className="cdb-input" style={{ width: "100%", paddingRight: "58px" }} value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} />
                          {renderCheckButton(isNameDirty, "name")}
                        </div>
                        {validationErrors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.name}</p>}
                      </div>

                      <div className="cdb-form-section">
                        <label className="cdb-field-label">Email</label>
                        <div style={{ position: "relative" }}>
                          <input
                            className="cdb-input"
                            style={{ width: "100%", paddingRight: "58px" }}
                            type="email"
                            value={getPrimaryValue(tempProfile.emails)}
                            onChange={(e) => setTempProfile({ ...tempProfile, emails: toSingleItemArray(e.target.value) })}
                            placeholder="Enter email address"
                          />
                          {renderCheckButton(isEmailDirty, "email")}
                        </div>
                        {validationErrors.contact && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.contact}</p>}
                      </div>

                      <div className="cdb-form-section">
                        <label className="cdb-field-label">Phone</label>
                        <div style={{ position: "relative" }}>
                          <input
                            className="cdb-input"
                            style={{ width: "100%", paddingRight: "58px" }}
                            maxLength="11"
                            value={getPrimaryValue(tempProfile.phones)}
                            onChange={(e) => setTempProfile({ ...tempProfile, phones: toSingleItemArray(e.target.value) })}
                            placeholder="Enter phone number"
                          />
                          {renderCheckButton(isPhoneDirty, "phone")}
                        </div>
                        {validationErrors.contact && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{validationErrors.contact}</p>}
                      </div>
                    </div>

                    <div className="cdb-profile-edit-right">
                      <div className="cdb-form-section">
                        <label className="cdb-field-label">Notification Preference</label>
                        {getPrimaryValue(tempProfile.emails) && getPrimaryValue(tempProfile.phones) ? (
                          <div className="cdb-pref-edit-row">
                            <button type="button" className={`cdb-pref-option ${tempProfile.notificationPreference === "email" ? "active" : ""}`} onClick={() => handleChangeNotifPref("email")}><EmailIcon /> Email</button>
                            <button type="button" className={`cdb-pref-option ${tempProfile.notificationPreference === "sms" ? "active" : ""}`} onClick={() => handleChangeNotifPref("sms")}><SMSIcon /> SMS</button>
                          </div>
                        ) : (
                          <p className="cdb-muted-text">Add both an email and phone to set notification preferences.</p>
                        )}
                        {validationErrors.notificationPreference && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>{validationErrors.notificationPreference}</p>}
                      </div>

                      <div className="cdb-action-row">
                        <button className="cdb-btn cdb-btn-danger-outline" onClick={handleCancelEdit}>Cancel</button>
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
        <ConfirmationDialog
          isOpen={showConfirmation}
          title={confirmationAction === 'notif_pref' ? 'Confirm Preference' : 'Confirm Action'}
          message={confirmationMessage || (confirmationAction === 'cancel' ? 'Are you sure you want to cancel? Any unsaved changes will be lost.' : 'Please confirm this action.')}
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={handleConfirmYes}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {showOtpModal && (
        <Otp
          key={otpSessionKey}
          onClose={() => {
            setShowOtpModal(false);
            setOtpError("");
            setVerificationQueue([]);
            setPendingProfileUpdate(null);
            setOtpTarget("");
          }}
          onVerified={handleOtpVerified}
          selectedEmail={otpType === "email" ? otpTarget : getPrimaryValue(tempProfile.emails)}
          selectedPhone={otpType === "phone" ? otpTarget : getPrimaryValue(tempProfile.phones)}
          name={tempProfile.name || profile.name || "Customer"}
          otpType={otpType}
          loading={otpLoading || isSubmittingProfile}
          error={otpError}
          onErrorClear={() => setOtpError("")}
        />
      )}
    </CustomerShell>
  );
}
