import { useState } from "react";

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

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
    <path d="M12 2a10 10 0 0110 10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#988f81" strokeWidth="1.8" />
    <path d="M2 8l10 6 10-6" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 4h4l2 5-3 2c1.4 2.8 3.6 5 6.4 6.4l2-3 5 2v4c0 1.1-.9 2-2 2C10.4 22 2 13.6 2 6c0-1.1.9-2 2-2z" stroke="#988f81" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2.5" stroke="#988f81" strokeWidth="1.8" />
    <path d="M8 11V7a4 4 0 018 0v4" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill="#988f81" />
  </svg>
);

const normalizeEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");
const normalizePhone = (value) => (typeof value === "string" ? value.replace(/\D/g, "") : "");
const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const validateForm = ({ name, email, phone, password, confirmPassword, verificationMode }) => {
  const errs = {};

  if (!name.trim()) errs.name = "Full name is required";

  const normalizedEmail = email.trim();
  const normalizedPhone = normalizePhone(phone);

  if (verificationMode === "email") {
    if (!normalizedEmail) errs.email = "Email is required";
    else if (!validateEmail(normalizedEmail)) errs.email = "Enter a valid email";
  } else if (normalizedEmail && !validateEmail(normalizedEmail)) {
    errs.email = "Enter a valid email";
  }

  if (verificationMode === "phone") {
    if (!normalizedPhone) errs.phone = "Phone number is required";
    else if (normalizedPhone.length < 10) errs.phone = "Enter a valid phone number";
  } else if (normalizedPhone && normalizedPhone.length < 10) {
    errs.phone = "Enter a valid phone number";
  }

  if (!password) errs.password = "Password is required";
  else if (password.length < 8) errs.password = "Password must be at least 8 characters";

  if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
  else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";

  return errs;
};

const defaultTheme = {
  cardSurface: "#1a1714",
  modalBorder: "rgba(221, 144, 29, 0.2)",
  modalTitle: "#fff",
  modalText: "#b8a599",
  modalInputSurface: "#231d1a",
  modalInputBorder: "rgba(152, 143, 129, 0.3)",
  modalInputText: "#fff",
  modalInputFocus: "rgba(221, 144, 29, 0.6)",
  link: "#dd901d",
  linkHover: "#c47f18",
  mutedText: "#b8a599",
};

export const CreateAccountPanel = ({ theme = defaultTheme, onBackToLogin, onAccountCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationMode, setVerificationMode] = useState("email");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleModeChange = (mode) => {
    setVerificationMode(mode);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm({ name, email, phone, password, confirmPassword, verificationMode });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/customers/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizeEmail(email),
          phone: normalizePhone(phone),
          password,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors({ form: body.error || body.details || "Failed to create account. Please try again." });
        return;
      }

      onAccountCreated?.({
        ...body.data,
        password,
      });
    } catch (error) {
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const panelStyle = {
    width: "100%",
    maxWidth: "460px",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: theme.modalTitle,
    fontSize: "0.9rem",
    fontWeight: 600,
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: theme.modalInputSurface,
    border: `1px solid ${theme.modalInputBorder}`,
    borderRadius: "10px",
    color: theme.modalInputText,
    fontSize: "0.95rem",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const toggleButtonStyle = (active) => ({
    flex: 1,
    padding: "10px 12px",
    backgroundColor: active ? theme.link : "transparent",
    color: active ? "#000" : theme.mutedText,
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  return (
    <section style={panelStyle}>
      <button
        type="button"
        onClick={onBackToLogin}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: "none",
          color: theme.link,
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: "pointer",
          padding: "4px 0",
          marginBottom: "2px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        onMouseEnter={(event) => { event.currentTarget.style.color = theme.linkHover; }}
        onMouseLeave={(event) => { event.currentTarget.style.color = theme.link; }}
      >
        ← Back to Login
      </button>

      <div>
        <h2 style={{ margin: "0 0 10px 0", color: theme.modalTitle, fontSize: "2rem", fontWeight: 700, fontFamily: "Georgia, serif" }}>
          Create Account
        </h2>
        <p style={{ margin: 0, color: theme.modalText, fontSize: "0.95rem", lineHeight: 1.5 }}>
          Sign up with your details and choose how you want to verify your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => { setName(event.target.value); setErrors((prev) => ({ ...prev, name: null })); }}
            placeholder="John Doe"
            style={{ ...inputStyle, borderColor: errors.name ? "rgba(239, 67, 67, 0.5)" : theme.modalInputBorder }}
            onFocus={(event) => {
              event.currentTarget.style.borderColor = theme.modalInputFocus;
              event.currentTarget.style.backgroundColor = theme.modalInputSurface === "#231d1a" ? "#2a1f1a" : theme.modalInputSurface;
            }}
            onBlur={(event) => {
              event.currentTarget.style.borderColor = errors.name ? "rgba(239, 67, 67, 0.5)" : theme.modalInputBorder;
              event.currentTarget.style.backgroundColor = theme.modalInputSurface;
            }}
          />
          {errors.name && <span style={{ fontSize: "0.75rem", color: "#ef4343", marginTop: "4px" }}>{errors.name}</span>}
        </div>

        {verificationMode === "email" ? (
          <div>
            <label style={labelStyle}>Email Address</label>
            <div className="login-input-inner" style={{ borderColor: errors.email ? "rgba(239, 67, 67, 0.5)" : undefined }}>
              <MailIcon />
              <input
                type="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setErrors((prev) => ({ ...prev, email: null })); }}
                placeholder="you@example.com"
                aria-label="Email address"
              />
            </div>
            {errors.email && <span className="login-error-msg">{errors.email}</span>}
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Phone Number</label>
            <div className="login-input-inner" style={{ borderColor: errors.phone ? "rgba(239, 67, 67, 0.5)" : undefined }}>
              <PhoneIcon />
              <input
                type="tel"
                value={phone}
                onChange={(event) => { setPhone(event.target.value); setErrors((prev) => ({ ...prev, phone: null })); }}
                placeholder="+1 (555) 123-4567"
                aria-label="Phone number"
              />
            </div>
            <span style={{ display: "block", marginTop: "4px", color: theme.modalText, fontSize: "0.74rem" }}>
              Phone is required for this verification mode.
            </span>
            {errors.phone && <span className="login-error-msg">{errors.phone}</span>}
          </div>
        )}

        <div>
          <label style={labelStyle}>Password</label>
          <div className="login-input-inner" style={{ borderColor: errors.password ? "rgba(239, 67, 67, 0.5)" : undefined }}>
            <LockIcon />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => { setPassword(event.target.value); setErrors((prev) => ({ ...prev, password: null })); }}
              placeholder="••••••••"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#988f81", display: "flex", alignItems: "center" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          {errors.password && <span className="login-error-msg">{errors.password}</span>}
        </div>

        <div>
          <label style={labelStyle}>Confirm Password</label>
          <div className="login-input-inner" style={{ borderColor: errors.confirmPassword ? "rgba(239, 67, 67, 0.5)" : undefined }}>
            <LockIcon />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => { setConfirmPassword(event.target.value); setErrors((prev) => ({ ...prev, confirmPassword: null })); }}
              placeholder="••••••••"
              aria-label="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#988f81", display: "flex", alignItems: "center" }}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          {errors.confirmPassword && <span className="login-error-msg">{errors.confirmPassword}</span>}
        </div>

        <div style={{ marginTop: 4 }}>
          <label style={labelStyle}>Verify with</label>
          <div style={{ display: "flex", backgroundColor: theme.modalInputSurface, border: `1px solid ${theme.modalInputBorder}`, borderRadius: 10, padding: 4, gap: 4 }}>
            <button type="button" onClick={() => handleModeChange("email")} style={toggleButtonStyle(verificationMode === "email")}>Email</button>
            <button type="button" onClick={() => handleModeChange("phone")} style={toggleButtonStyle(verificationMode === "phone")}>Phone</button>
          </div>
          <p style={{ margin: "8px 0 0", color: theme.modalText, fontSize: "0.78rem", lineHeight: 1.5 }}>
            {verificationMode === "email" ? "Email is shown for verification." : "Phone is shown for verification."}
          </p>
        </div>

        {errors.form && (
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(239, 67, 67, 0.12)", border: "1px solid rgba(239, 67, 67, 0.4)", borderRadius: 10, color: "#ef4343", fontSize: "0.9rem", lineHeight: 1.5 }}>
            {errors.form}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4,
            width: "100%",
            height: 48,
            borderRadius: 10,
            backgroundColor: theme.link,
            color: "#000",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s ease",
            boxShadow: "0 4px 20px rgba(221, 144, 29, 0.25)",
          }}
          onMouseEnter={(event) => {
            if (!loading) {
              event.currentTarget.style.backgroundColor = theme.linkHover;
              event.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(event) => {
            if (!loading) {
              event.currentTarget.style.backgroundColor = theme.link;
              event.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? (
            <>
              <SpinnerIcon />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            background: "none",
            border: "none",
            color: theme.link,
            padding: 0,
            fontSize: "0.92rem",
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
            alignSelf: "center",
          }}
          onMouseEnter={(event) => { event.currentTarget.style.color = theme.linkHover; }}
          onMouseLeave={(event) => { event.currentTarget.style.color = theme.link; }}
        >
          Already have an account? Back to Login
        </button>
      </form>
    </section>
  );
};

export default CreateAccountPanel;
