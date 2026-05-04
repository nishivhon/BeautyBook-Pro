import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateOperatorCredentials, loginOperator } from "../services/operatorAuth";
import { isMagicLinkValid, getMagicLinkInfo } from "../services/magicLink";
import { CreateAccountModal } from "../components/modal/customer/create-account";

// ── SVG Icons ─────────────────────────────────────────────────────
const ScissorsIcon = ({ size = 28, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M20 4L8.12 15.88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14.47 14.48L20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8.12 8.12L12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#988f81" strokeWidth="1.8" />
    <path d="M2 8l10 6 10-6" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2.5" stroke="#988f81" strokeWidth="1.8" />
    <path d="M8 11V7a4 4 0 018 0v4" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill="#988f81" />
  </svg>
);

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

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="login-spinner">
    <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
    <path d="M12 2a10 10 0 0110 10" stroke="#000" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke="#dd901d" strokeWidth="1.6" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke="#dd901d" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="8" cy="15" r="1" fill="#dd901d" />
    <circle cx="12" cy="15" r="1" fill="#dd901d" />
    <circle cx="16" cy="15" r="1" fill="#dd901d" />
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" stroke="#dd901d" strokeWidth="1.6" />
    <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#dd901d" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16 3.13a4 4 0 010 7.75" stroke="#dd901d" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M22 21v-2a4 4 0 00-3-3.87" stroke="#dd901d" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 3v18h18" stroke="#dd901d" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 16l4-5 4 3 4-6" stroke="#dd901d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke="#dd901d" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// ── Grid texture (decorative) ─────────────────────────────────────
const GridTexture = () => (
  <svg className="login-grid-texture" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#988f81" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#login-grid)" />
  </svg>
);

// ── Feature list data ─────────────────────────────────────────────
const FEATURES = [
  { Icon: CalendarIcon, label: "Appointment Management" },
  { Icon: UsersIcon,    label: "Staff & Customer Records" },
  { Icon: ChartIcon,    label: "Revenue Analytics" },
  { Icon: StarIcon,     label: "Service Catalog" },
];

// ── Main Component ────────────────────────────────────────────────
export const LogIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const magicToken = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [email,    setEmail]    = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [unauthorized, setUnauthorized] = useState(false);
  const [userRole, setUserRole] = useState("admin");
  const [shakeError, setShakeError] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  // Create account modal state
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

  useEffect(() => {
    // Only check magic link if a token is provided
    if (magicToken) {
      // Validate the magic link if one is provided
      if (!isMagicLinkValid(magicToken)) {
        setUnauthorized(true);
        // Start countdown
        const interval = setInterval(() => {
          setRedirectCountdown(prev => Math.max(prev - 1, 0));
        }, 1000);
        // Redirect to home after 3 seconds
        const timer = setTimeout(() => {
          navigate("/");
        }, 3000);
        return () => {
          clearTimeout(timer);
          clearInterval(interval);
        };
      }

      // If magic link is valid, pre-fill email from token
      const linkInfo = getMagicLinkInfo(magicToken);
      if (linkInfo?.email) {
        setEmail(linkInfo.email);
      }
      if (linkInfo?.role) {
        setUserRole(linkInfo.role);
      }
    }

    // Allow normal form-based login (no magic token required)
    setMounted(true);
  }, [magicToken, navigate]);

  // Trigger shake animation when form error appears
  useEffect(() => {
    if (errors.form) {
      setShakeError(true);
      const timer = setTimeout(() => {
        setShakeError(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [errors.form]);

  const validate = () => {
    const e = {};
    if (!email) {
      e.email = "Email or phone number is required";
    } else if (email.includes("@")) {
      if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    } else {
      const digitsOnly = email.replace(/\D/g, "");
      if (digitsOnly.length < 10) e.email = "Enter a valid phone number";
    }
    if (!password)                         e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setErrors({});
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';

      // Try customer login first
      const customerResponse = await fetch(`${apiUrl}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone: email, password }),
      });

      if (customerResponse.ok) {
        const customerResult = await customerResponse.json();
        const customer = customerResult.data;

        localStorage.setItem('customerProfileData', JSON.stringify({
          name: customer.name,
          emails: customer.email ? [customer.email] : [],
          phones: customer.phone ? [customer.phone] : [],
          notificationPreference: 'email',
          profilePhoto: '',
          id: customer.id,
        }));

        loginOperator(customer.email || customer.phone, password, 'customer');

        setTimeout(() => {
          navigate('/customer/dashboard');
          setLoading(false);
        }, 800);
        return;
      }

      // Fallback to operator login
      const result = await validateOperatorCredentials(email, password);

      if (result.success) {
        loginOperator(result.data.email, password, result.data.role);

        setTimeout(() => {
          const roleBasedRoutes = {
            'admin': '/admin/dashboard',
            'super admin': '/superadmin/dashboard',
            'staff': '/staff/dashboard',
            'customer': '/customer/dashboard'
          };

          const redirectPath = roleBasedRoutes[result.data.role?.toLowerCase()] || '/';
          navigate(redirectPath);
          setLoading(false);
        }, 800);
      } else {
        setErrors({ form: result.error || "Login failed. Please try again." });
        setLoading(false);
      }
    } catch (error) {
      setErrors({ form: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  const handleForgotPassword = async (ev) => {
    ev.preventDefault();
    if (!forgotEmail) {
      setForgotMessage("Please enter your email address");
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      // Send password reset request to backend
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (data.success) {
        setForgotMessage("✓ Password reset link sent to your email. Check your inbox.");
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotEmail("");
          setForgotMessage("");
        }, 2000);
      } else {
        setForgotMessage(data.error || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      setForgotMessage("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle account creation from modal
  const handleAccountCreated = (accountData) => {
    // Store the new customer profile to localStorage
    const customerProfile = {
      name: accountData.name,
      emails: accountData.email ? [accountData.email] : [],
      phones: accountData.phone ? [accountData.phone] : [],
      notificationPreference: "email",
      profilePhoto: "",
      id: accountData.id,
    };
    
    localStorage.setItem('customerProfileData', JSON.stringify(customerProfile));
    
    // Log in the new customer account
    loginOperator(accountData.email || accountData.phone, accountData.password, 'customer');
    
    // Redirect to customer dashboard
    setTimeout(() => {
      navigate('/customer/dashboard');
    }, 1500);
  };

  // If magic link is invalid or missing, show unauthorized message
  if (unauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mid p-5">
        <div style={{ width: '100%', maxWidth: '420px', height: '480px', padding: '48px 32px', backgroundColor: '#1a1714', borderRadius: '16px', border: '1px solid rgba(221, 144, 29, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Top Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="text-6xl">
              🔒
            </div>
            <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px', margin: 0 }}>
              Access Restricted
            </h1>
          </div>

          {/* Middle Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <p style={{ margin: 0, textAlign: 'center', color: '#e5d9d0', fontSize: '0.875rem', lineHeight: '1.6' }}>
              This page is only accessible via a magic link generated by the super admin. 
              If you believe this is an error, contact your administrator.
            </p>
            <button
              onClick={() => navigate("/")}
              className="font-600 text-sm"
              style={{ padding: '12px 32px', backgroundColor: '#dd901d', color: '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(221, 144, 29, 0.25)', fontWeight: '700' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#c47f18'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 28px rgba(221, 144, 29, 0.4)'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#dd901d'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(221, 144, 29, 0.25)'; }}
            >
              Return to Home
            </button>
          </div>

          {/* Bottom Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ margin: 0, textAlign: 'center', color: '#b8a599', fontSize: '0.75rem' }}>
              Redirecting automatically in {redirectCountdown} {redirectCountdown === 1 ? 'second' : 'seconds'}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-root" style={{ height: '100vh', overflow: 'hidden' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div className="login-left" style={{ overflow: 'hidden' }}>
        <GridTexture />

        <div className={`login-form-inner ${mounted ? "mounted" : ""}`} style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#dd901d',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '4px 8px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#e6a326';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#dd901d';
            }}
          >
            ← Back
          </button>

          {/* Logo */}
          <div className="login-logo-row">
            <div className="login-logo-badge">
              <ScissorsIcon size={22} color="#000" />
            </div>
            <span className="brand-name">BeautyBook Pro</span>
          </div>

          {/* Heading */}
          <div className="login-heading-block">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-body">

            {/* Form-level error */}
            {errors.form && (
              <div className={`mb-4 font-inter ${shakeError ? 'login-error-shake' : ''}`} style={{ padding: '16px 18px', backgroundColor: 'rgba(239, 67, 67, 0.12)', border: '1.5px solid rgba(239, 67, 67, 0.5)', borderRadius: '12px', color: '#ef4343', boxShadow: '0 2px 8px rgba(239, 67, 67, 0.1)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {errors.form}
              </div>
            )}

            {/* Email */}
            <div className="field-box">
              <span className="field-label">Email or Phone Number</span>
              <div className={`login-input-inner ${errors.email ? "has-error" : ""}`}>
                <MailIcon />
                <input
                  type="text"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
                  placeholder="admin@beautybook.pro or +15551234567"
                  aria-label="Email or phone number"
                />
              </div>
              {errors.email && <span className="login-error-msg">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="field-box">
              <span className="field-label">Password</span>
              <div className={`login-input-inner ${errors.password ? "has-error" : ""}`}>
                <LockIcon />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: null })); }}
                  placeholder="••••••••"
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              {errors.password && <span className="login-error-msg">{errors.password}</span>}
            </div>

            {/* Remember me + Forgot */}
            <div className="login-meta-row">
              <label className="login-remember-label">
                <div
                  className={`login-checkbox ${remember ? "checked" : ""}`}
                  onClick={() => setRemember(p => !p)}
                  role="checkbox"
                  aria-checked={remember}
                >
                  {remember && <CheckIcon />}
                </div>
                <span className="login-remember-text">Remember me</span>
              </label>
              <button 
                type="button" 
                className="login-forgot-btn"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <SpinnerIcon />
                  Signing In…
                </>
              ) : "Sign In"}
            </button>
          </form>

          {/* Restricted note */}
          <p className="login-access-note">
            Access restricted to authorized salon operators only.
          </p>

          {/* Sign up link */}
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(221, 144, 29, 0.1)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#b8a599' }}>
              Don't have an account?
            </p>
            <button
              type="button"
              onClick={() => setShowCreateAccountModal(true)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#dd901d',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '4px 8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#e6a326';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#dd901d';
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      <div className="login-right">

        {/* Decorative layers */}
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-right-top-bar" />
        <div className="login-right-bottom-bar" />
        <div className="login-ring login-ring-lg" />
        <div className="login-ring login-ring-sm" />

        {/* Content */}
        <div className={`login-right-content ${mounted ? "mounted" : ""}`}>

          {/* Brand icon */}
          <div className="login-icon-circle">
            <ScissorsIcon size={52} color="#000" />
          </div>

          {/* Heading */}
          <div className="login-right-heading">
            <h2 className="login-right-title">
              Customer Management{" "}
              <span className="accent">System</span>
            </h2>
            <p className="login-right-desc">
              Sign in to access your dashboard and manage appointments,
              staff, and customer records.
            </p>
          </div>

          {/* Feature pills — staggered via CSS transitionDelay only */}
          <div className="login-features-list">
            {FEATURES.map(({ Icon, label }, i) => (
              <div
                key={i}
                className={`login-feature-pill ${mounted ? "mounted" : ""}`}
                style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
              >
                <Icon />
                <span className="login-feature-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Status badge */}
          <div className="login-status-badge">
            <span className="login-status-dot" />
            <span className="login-status-text">
              System Online · Secure Connection
            </span>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ────────────────────────── */}
      {showForgotModal && (
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
          <div style={{
            backgroundColor: '#1a1714',
            borderRadius: '16px',
            border: '1px solid rgba(221, 144, 29, 0.2)',
            padding: '40px 32px',
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}>
            <h2 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
              Reset Password
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#b8a599', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5d9d0', fontSize: '0.9rem', fontWeight: '600' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@beautybook.pro"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#231d1a',
                    border: '1px solid rgba(152, 143, 129, 0.3)',
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
                    e.target.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                    e.target.style.backgroundColor = '#231d1a';
                  }}
                />
              </div>

              {forgotMessage && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: forgotMessage.includes('✓') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 67, 67, 0.12)',
                  border: `1px solid ${forgotMessage.includes('✓') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 67, 67, 0.4)'}`,
                  borderRadius: '10px',
                  color: forgotMessage.includes('✓') ? '#10b981' : '#ef4343',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                }}>
                  {forgotMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
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
                  disabled={forgotLoading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: '#dd901d',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: forgotLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    opacity: forgotLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    if (!forgotLoading) {
                      e.target.style.backgroundColor = '#c47f18';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!forgotLoading) {
                      e.target.style.backgroundColor = '#dd901d';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {forgotLoading ? (
                    <>
                      <SpinnerIcon />
                      Sending…
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE ACCOUNT MODAL ────────────────────────── */}
      <CreateAccountModal 
        isOpen={showCreateAccountModal}
        onClose={() => setShowCreateAccountModal(false)}
        onAccountCreated={handleAccountCreated}
      />
    </div>
  );
};

export default LogIn;