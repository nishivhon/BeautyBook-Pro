import { useState } from "react";

/* ── Eye icon for show/hide password ── */
const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14.12 14.12a3 3 0 01-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width={14} height={14}>
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="otp-spinner">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ══════════════════════════════════════════
   PASSWORD RESET MODAL COMPONENT
══════════════════════════════════════════ */
export const PasswordResetModal = ({ onClose, onSubmit, email, loading = false, error = null }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!newPassword.trim()) {
      errors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit?.({
      email,
      newPassword,
      confirmPassword
    });
  };

  const isFormValid = newPassword.trim() && confirmPassword.trim() && newPassword === confirmPassword && newPassword.length >= 6;

  return (
    <>
      <div 
        className="otp-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) {
            onClose?.();
          }
        }}
        style={{ pointerEvents: "auto" }}
      >
        {/* modal card */}
        <div 
          className="otp-modal" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="reset-title"
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: "auto" }}
        >

          {/* ── Header ── */}
          <header className="otp-header">
            <h1 id="reset-title" className="otp-header-title">
              Create New Password
            </h1>
            <button
              className="otp-close-btn"
              onClick={onClose}
              disabled={loading}
              aria-label="Close password reset modal"
            >
              <CloseIcon />
            </button>
          </header>

          {/* ── Body ── */}
          <div className="otp-body">

            {/* Email display */}
            <p className="otp-instruction">
              Reset password for <strong>{email}</strong>
            </p>

            {/* Error message */}
            {error && (
              <div style={{
                padding: "10px 12px",
                marginBottom: "12px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                color: "#ef4444",
                fontSize: "0.9rem",
                textAlign: "center",
                animation: "fadeIn 0.3s ease-in"
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* New Password Field */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#9CA3AF" }}>
                  New Password
                </label>
                <div style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (validationErrors.newPassword) {
                        const errors = { ...validationErrors };
                        delete errors.newPassword;
                        setValidationErrors(errors);
                      }
                    }}
                    placeholder="Enter new password"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "10px 36px 10px 12px",
                      backgroundColor: "#1F2937",
                      border: validationErrors.newPassword ? "1.5px solid #ef4444" : "1.5px solid #374151",
                      borderRadius: "8px",
                      color: "#E5E7EB",
                      fontSize: "0.95rem",
                      fontFamily: "Inter, sans-serif",
                      transition: "all 0.2s",
                      cursor: loading ? "not-allowed" : "text"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      color: "#9CA3AF",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px"
                    }}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {validationErrors.newPassword && (
                  <span style={{ fontSize: "0.85rem", color: "#ef4444" }}>
                    {validationErrors.newPassword}
                  </span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", color: "#9CA3AF" }}>
                  Confirm Password
                </label>
                <div style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (validationErrors.confirmPassword) {
                        const errors = { ...validationErrors };
                        delete errors.confirmPassword;
                        setValidationErrors(errors);
                      }
                    }}
                    placeholder="Confirm new password"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "10px 36px 10px 12px",
                      backgroundColor: "#1F2937",
                      border: validationErrors.confirmPassword ? "1.5px solid #ef4444" : "1.5px solid #374151",
                      borderRadius: "8px",
                      color: "#E5E7EB",
                      fontSize: "0.95rem",
                      fontFamily: "Inter, sans-serif",
                      transition: "all 0.2s",
                      cursor: loading ? "not-allowed" : "text"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      color: "#9CA3AF",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px"
                    }}
                  >
                    {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <span style={{ fontSize: "0.85rem", color: "#ef4444" }}>
                    {validationErrors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="otp-actions" style={{ marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="otp-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="otp-btn-verify"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: (!isFormValid || loading) ? 0.7 : 1,
                    cursor: (!isFormValid || loading) ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>
      </div>
    </>
  );
};

export default PasswordResetModal;
