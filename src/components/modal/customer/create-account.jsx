import { useState } from "react";
import { Otp } from "./otp";

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#988f81" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3" stroke="#988f81" strokeWidth="1.8" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14.12 14.12a3 3 0 01-4.24-4.24" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="2" y1="2" x2="22" y2="22" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
    <path d="M12 2a10 10 0 0110 10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const CreateAccountModal = ({ isOpen, onClose, onAccountCreated }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationMode, setVerificationMode] = useState("email"); // "email" or "phone"
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    
    // Validate password
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    
    // Validate based on selected verification mode
    if (verificationMode === "email") {
      if (!email) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    } else if (verificationMode === "phone") {
      if (!phone) errs.phone = "Phone number is required";
      else if (!/^\d{10,}$/.test(phone.replace(/\D/g, ""))) errs.phone = "Enter a valid phone number";
    }
    
    return errs;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      let endpoint, sendData, successMessage;

      if (verificationMode === "email" && email) {
        endpoint = `${apiUrl}/auth/send-email-otp`;
        sendData = { email: email, full_name: name, phone: "" };
        successMessage = `OTP sent to ${email}`;
      } else if (verificationMode === "phone" && phone) {
        endpoint = `${apiUrl}/sms/send-otp`;
        sendData = { phone: phone, name: name };
        successMessage = `OTP sent to ${phone}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData)
      });

      if (response.ok) {
        setStep(2); // Move to OTP step
        setToastMessage(successMessage);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2800);
      } else {
        setErrors({ form: "Failed to send OTP. Please try again." });
      }
    } catch (error) {
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = async () => {
    // After OTP is verified, create the account by calling the server API
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const endpoint = `${apiUrl}/customers/create`;

      const payload = {
        name,
        password,
        // send email or phone based on verification mode
        ...(verificationMode === 'email' ? { email } : {}),
        ...(verificationMode === 'phone' ? { phone } : {}),
      };

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        console.error('[CreateAccount] API error', resp.status, errBody);
        setErrors({ form: errBody.error || 'Failed to create account. Please try again.' });
        return;
      }

      const created = await resp.json();

      setToastMessage('✓ Account created successfully!');
      setShowToast(true);

      setTimeout(() => {
        if (onAccountCreated) onAccountCreated(created);
        handleClose();
      }, 800);
    } catch (error) {
      console.error('[CreateAccount] Unexpected error', error);
      setErrors({ form: 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setToastMessage("");
    onClose();
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
      }}>
        {step === 1 ? (
          // Step 1: Account Info Form
          <div style={{
            backgroundColor: '#1a1714',
            borderRadius: '16px',
            border: '1px solid rgba(221, 144, 29, 0.2)',
            padding: '40px 32px',
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
              Create Account
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#b8a599', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Sign up with your details and choose a password.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name field */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5d9d0', fontSize: '0.9rem', fontWeight: '600' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: null })); }}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#231d1a',
                    border: errors.name ? '1px solid rgba(239, 67, 67, 0.5)' : '1px solid rgba(152, 143, 129, 0.3)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(221, 144, 29, 0.6)';
                    e.target.style.backgroundColor = '#2a1f1a';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? 'rgba(239, 67, 67, 0.5)' : 'rgba(152, 143, 129, 0.3)';
                    e.target.style.backgroundColor = '#231d1a';
                  }}
                />
                {errors.name && <span style={{ fontSize: '0.75rem', color: '#ef4343', marginTop: '4px' }}>{errors.name}</span>}
              </div>

              {/* Email field - Only show when Email verification is selected */}
              {verificationMode === 'email' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#e5d9d0', fontSize: '0.9rem', fontWeight: '600' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#231d1a',
                      border: errors.email ? '1px solid rgba(239, 67, 67, 0.5)' : '1px solid rgba(152, 143, 129, 0.3)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontFamily: 'Inter, sans-serif',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(221, 144, 29, 0.6)';
                      e.target.style.backgroundColor = '#2a1f1a';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email ? 'rgba(239, 67, 67, 0.5)' : 'rgba(152, 143, 129, 0.3)';
                      e.target.style.backgroundColor = '#231d1a';
                    }}
                  />
                  {errors.email && <span style={{ fontSize: '0.75rem', color: '#ef4343', marginTop: '4px' }}>{errors.email}</span>}
                </div>
              )}

              {/* Phone field - Only show when Phone verification is selected */}
              {verificationMode === 'phone' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#e5d9d0', fontSize: '0.9rem', fontWeight: '600' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: null })); }}
                    placeholder="+1 (555) 123-4567"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#231d1a',
                      border: errors.phone ? '1px solid rgba(239, 67, 67, 0.5)' : '1px solid rgba(152, 143, 129, 0.3)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontFamily: 'Inter, sans-serif',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(221, 144, 29, 0.6)';
                      e.target.style.backgroundColor = '#2a1f1a';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.phone ? 'rgba(239, 67, 67, 0.5)' : 'rgba(152, 143, 129, 0.3)';
                      e.target.style.backgroundColor = '#231d1a';
                    }}
                  />
                  {errors.phone && <span style={{ fontSize: '0.75rem', color: '#ef4343', marginTop: '4px' }}>{errors.phone}</span>}
                </div>
              )}

              {/* Password field */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5d9d0', fontSize: '0.9rem', fontWeight: '600' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: null })); }}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      backgroundColor: '#231d1a',
                      border: errors.password ? '1px solid rgba(239, 67, 67, 0.5)' : '1px solid rgba(152, 143, 129, 0.3)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontFamily: 'Inter, sans-serif',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(221, 144, 29, 0.6)';
                      e.target.style.backgroundColor = '#2a1f1a';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password ? 'rgba(239, 67, 67, 0.5)' : 'rgba(152, 143, 129, 0.3)';
                      e.target.style.backgroundColor = '#231d1a';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                    }}
                  >
                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
                {errors.password && <span style={{ fontSize: '0.75rem', color: '#ef4343', marginTop: '4px' }}>{errors.password}</span>}
              </div>

              {/* Confirm Password field */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5d9d0', fontSize: '0.9rem', fontWeight: '600' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: null })); }}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      backgroundColor: '#231d1a',
                      border: errors.confirmPassword ? '1px solid rgba(239, 67, 67, 0.5)' : '1px solid rgba(152, 143, 129, 0.3)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontFamily: 'Inter, sans-serif',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(221, 144, 29, 0.6)';
                      e.target.style.backgroundColor = '#2a1f1a';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.confirmPassword ? 'rgba(239, 67, 67, 0.5)' : 'rgba(152, 143, 129, 0.3)';
                      e.target.style.backgroundColor = '#231d1a';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                    }}
                  >
                    {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={{ fontSize: '0.75rem', color: '#ef4343', marginTop: '4px' }}>{errors.confirmPassword}</span>}
              </div>

              {/* Verification mode toggle */}
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5d9d0', fontSize: '0.9rem', fontWeight: '600' }}>
                  Verify with:
                </label>
                <div style={{ display: 'flex', backgroundColor: '#231d1a', border: '1px solid rgba(152, 143, 129, 0.3)', borderRadius: '10px', padding: '4px', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setVerificationMode('email')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      backgroundColor: verificationMode === 'email' ? '#dd901d' : 'transparent',
                      color: verificationMode === 'email' ? '#000' : '#b8a599',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (verificationMode !== 'email') {
                        e.target.style.backgroundColor = 'rgba(221, 144, 29, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (verificationMode !== 'email') {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMode('phone')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      backgroundColor: verificationMode === 'phone' ? '#dd901d' : 'transparent',
                      color: verificationMode === 'phone' ? '#000' : '#b8a599',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (verificationMode !== 'phone') {
                        e.target.style.backgroundColor = 'rgba(221, 144, 29, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (verificationMode !== 'phone') {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    Phone
                  </button>
                </div>
              </div>

              {errors.form && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 67, 67, 0.12)',
                  border: '1px solid rgba(239, 67, 67, 0.4)',
                  borderRadius: '10px',
                  color: '#ef4343',
                  fontSize: '0.9rem',
                }}>
                  {errors.form}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    color: '#dd901d',
                    border: '1.5px solid #dd901d',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(221, 144, 29, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: '#dd901d',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#c47f18';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#dd901d';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Step 2: OTP Verification
          <Otp
            selectedPhone={phone}
            selectedEmail={email}
            name={name}
            otpType={verificationMode}
            onClose={handleClose}
            onVerified={handleVerified}
          />
        )}
      </div>

      {/* Toast notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '14px 20px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          zIndex: 2000,
          animation: 'slideInUp 0.3s ease-out',
        }}>
          {toastMessage}
        </div>
      )}
    </>
  );
};
