import { useState } from "react";
import { useNavigate } from "react-router-dom";

/** Logo scissors mark */
const LogoMark = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 26, height: 26 }}>
    {/* two pivot circles */}
    <circle cx="10" cy="26" r="5" stroke="black" strokeWidth="2.2" fill="none" />
    <circle cx="10" cy="14" r="5" stroke="black" strokeWidth="2.2" fill="none" />
    {/* blades crossing */}
    <path d="M14 22 L34 10" stroke="black" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M14 18 L34 30" stroke="black" strokeWidth="2.2" strokeLinecap="round" />
    {/* finger rings */}
    <circle cx="10" cy="26" r="2" fill="black" />
    <circle cx="10" cy="14" r="2" fill="black" />
  </svg>
);

/** Person / user icon for Full Name */
const PersonIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <circle cx="9" cy="5.5" r="3.5" stroke="#988f81" strokeWidth="1.4" fill="none" />
    <path d="M2 16c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#988f81" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </svg>
);

/** Envelope icon for Email */
const EnvelopeIcon = () => (
  <svg viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 13, flexShrink: 0 }}>
    <rect x="1" y="1" width="16" height="12" rx="1.5" stroke="#988f81" strokeWidth="1.4" fill="none" />
    <path d="M1 3l8 5 8-5" stroke="#988f81" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** Phone icon for Phone Number */
const PhoneIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 15, height: 15, flexShrink: 0 }}>
    <path
      d="M3.6 1h3.2l1.6 4-2 1.2C7.3 8.5 9.5 10.7 11.8 11.6L13 9.6l4 1.6v3.2C17 15.8 15.8 17 14.4 17 7.2 17 1 10.8 1 3.6 1 2.2 2.2 1 3.6 1z"
      stroke="#988f81" strokeWidth="1.4" fill="none" strokeLinejoin="round"
    />
  </svg>
);

/** Unchecked checkbox */
const CheckboxEmpty = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
    <rect x="1" y="1" width="18" height="18" rx="3" stroke="#988f81" strokeWidth="1.5" fill="none" />
  </svg>
);

/** Checked checkbox — amber fill with white tick */
const CheckboxChecked = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
    <rect x="0" y="0" width="20" height="20" rx="3.5" fill="#dd901d" />
    <path d="M4.5 10l4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

/** Dashed-border field wrapper */
const FieldBox = ({ label, children }) => (
  <div style={{
    width: "100%",
    border: "1px dashed rgba(152,143,129,0.5)",
    borderRadius: 8,
    padding: "12px 17px",
    background: "#0c0b09",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  }}>
    <span style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      fontSize: "0.72rem",
      color: "#988f81",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    }}>{label}</span>
    {children}
  </div>
);

/** Dark inner input row with left icon */
const InputRow = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div style={{ position: "relative", width: "100%", height: 40 }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "#231d1a",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      paddingLeft: 14,
      gap: 10,
    }}>
      {icon}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 200,
          fontSize: "0.95rem",
          color: "#fff",
          letterSpacing: 0,
        }}
      />
    </div>
  </div>
);

/** Toggle row: label + checkbox */
const ToggleRow = ({ label, checked, onToggle }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
  }}>
    <span style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      fontSize: "0.95rem",
      color: "#988f81",
    }}>{label}</span>
    <button
      type="button"
      onClick={onToggle}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
      aria-pressed={checked}
    >
      {checked ? <CheckboxChecked /> : <CheckboxEmpty />}
    </button>
  </div>
);

/* ─────────────────────────────────────────
   Main Register component
───────────────────────────────────────── */
export const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors]     = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Validate email if selected
    if (useEmail) {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    // Validate phone if selected
    if (usePhone) {
      if (!phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (phone.length !== 11) {
        newErrors.phone = "Phone number should be 11 digits";
      }
    }

    // Check if at least one notification method is selected
    if (!useEmail && !usePhone) {
      newErrors.notification = "Please select at least one notification method";
    }

    setErrors(newErrors);

    // If no errors, handle submit
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", { fullName, email, phone, useEmail, usePhone, rememberMe });
      // handle submit here
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #root {
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#0c0b09",
        fontFamily: "'Inter', sans-serif",
      }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: "0 0 50%",
        display: "flex",
        flexDirection: "column",
        padding: "60px 0 60px 0",
        justifyContent: "flex-start",
        alignItems: "center",
      }}>

        {/* Content wrapper */}
        <div style={{
          width: "100%",
          maxWidth: 520,
          paddingLeft: 60,
          paddingRight: 40,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}>

        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            color: "#988f81",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400, fontSize: "1rem",
            padding: 0, marginBottom: 40,
            width: "fit-content",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "#988f81"}
        >
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16 }}>
            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 46, height: 46,
            background: "#dd901d",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LogoMark />
          </div>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700, fontSize: "1.1rem",
            color: "#f5f1eb",
          }}>BeautyBook Pro</span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{
            fontFamily: "'Georgia','Times New Roman',serif",
            fontWeight: 700, fontSize: "1.9rem",
            color: "#fff", margin: "0 0 10px",
            lineHeight: 1.2,
          }}>Let's Get You Started!</h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400, fontSize: "0.95rem",
            color: "#988f81", margin: 0,
            lineHeight: 1.6, maxWidth: 380,
          }}>
            Enter your details below to book appointments and enjoy seamless, personalized service.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22, width: "100%" }}>

          {/* NAME */}
          <FieldBox label="Name">
            <InputRow
              icon={<PersonIcon />}
              placeholder="Full Name"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            {errors.fullName && <span style={{ color: "#dd901d", fontSize: "0.75rem", marginTop: "-8px" }}>{errors.fullName}</span>}
          </FieldBox>

          {/* USE EMAIL TOGGLE */}
          <ToggleRow
            label="Use Email for Notification:"
            checked={useEmail}
            onToggle={() => {
              if (useEmail) {
                setUseEmail(false);
              } else {
                setUseEmail(true);
                setUsePhone(false);
              }
            }}
          />

          {/* EMAIL ADDRESS */}
          <FieldBox label="Email Address">
            <InputRow
              icon={<EnvelopeIcon />}
              placeholder="you@gmail.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <span style={{ color: "#dd901d", fontSize: "0.75rem", marginTop: "-8px" }}>{errors.email}</span>}
          </FieldBox>

          {/* USE PHONE TOGGLE */}
          <ToggleRow
            label="Use Phone No. for Notification:"
            checked={usePhone}
            onToggle={() => {
              if (usePhone) {
                setUsePhone(false);
              } else {
                setUsePhone(true);
                setUseEmail(false);
              }
            }}
          />
          {errors.notification && <span style={{ color: "#dd901d", fontSize: "0.75rem" }}>{errors.notification}</span>}

          {/* PHONE NUMBER */}
          <FieldBox label="Phone Number">
            <InputRow
              icon={<PhoneIcon />}
              placeholder="# ### ### ####"
              type="tel"
              value={phone}
              onChange={e => {
                const numericOnly = e.target.value.replace(/[^0-9]/g, "");
                if (numericOnly.length <= 11) {
                  setPhone(numericOnly);
                }
              }}
            />
            {errors.phone && <span style={{ color: "#dd901d", fontSize: "0.75rem", marginTop: "-8px" }}>{errors.phone}</span>}
          </FieldBox>

          {/* CONFIRM BUTTON + REMEMBER ME */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            <button
              type="submit"
              style={{
                width: "100%", height: 48,
                background: "#dd901d",
                border: "none", borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700, fontSize: "0.95rem",
                color: "#000",
                transition: "background 0.18s",
              }}
              onMouseEnter={e => e.target.style.background = "#c47f18"}
              onMouseLeave={e => e.target.style.background = "#dd901d"}
            >
              Confirm
            </button>

            {/* Remember Me */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              <button
                type="button"
                onClick={() => setRememberMe(v => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                aria-pressed={rememberMe}
              >
                {rememberMe ? <CheckboxChecked /> : <CheckboxEmpty />}
              </button>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400, fontSize: "0.8rem",
                color: "#fff",
              }}>Remember Me?</span>
            </div>
          </div>

        </form>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: "0 0 50%",
        background: "rgba(221,144,29,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        padding: "40px 60px",
        textAlign: "center",
      }}>

        {/* Big amber circle with scissors */}
        <div style={{
          width: 150, height: 150,
          background: "#dd901d",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Large scissors for the panel */}
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 60 }}>
            <circle cx="14" cy="40" r="9" stroke="#1a1208" strokeWidth="3" fill="none" />
            <circle cx="14" cy="20" r="9" stroke="#1a1208" strokeWidth="3" fill="none" />
            <path d="M22 36 L54 14" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
            <path d="M22 24 L54 46" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
            <circle cx="14" cy="40" r="3.5" fill="#1a1208" />
            <circle cx="14" cy="20" r="3.5" fill="#1a1208" />
          </svg>
        </div>

        <h2 style={{
          fontFamily: "'Georgia','Times New Roman',serif",
          fontWeight: 700, fontSize: "2rem",
          color: "#fff", margin: 0,
          lineHeight: 1.2, maxWidth: 400,
        }}>Digital Appointment System</h2>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400, fontSize: "1rem",
          color: "#988f81", margin: 0,
          lineHeight: 1.6, maxWidth: 380,
        }}>
          Book appointments and enjoy a seamless salon experience—no waiting in line.
        </p>
      </div>

    </div>
    </>
  );
};

export default Register;