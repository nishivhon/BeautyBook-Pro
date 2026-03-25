import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateOperatorCredentials, loginOperator } from "../services/operatorAuth";
import { isMagicLinkValid, getMagicLinkInfo } from "../services/magicLink";

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

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    // Check if magic link is valid
    if (!magicToken || !isMagicLinkValid(magicToken)) {
      setUnauthorized(true);
      // Redirect to home after 3 seconds
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    // If magic link is valid, pre-fill email from token
    const linkInfo = getMagicLinkInfo(magicToken);
    if (linkInfo?.email) {
      setEmail(linkInfo.email);
    }

    setMounted(true);
  }, [magicToken, navigate]);

  const validate = () => {
    const e = {};
    if (!email)                            e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = "Enter a valid email";
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
      // Validate credentials against backend
      const result = await validateOperatorCredentials(email, password);
      
      if (result.success) {
        // Login successful - store user data
        loginOperator(result.data.email, password, result.data.role);
        
        // Show success feedback
        setTimeout(() => {
          // Redirect based on role
          const roleBasedRoutes = {
            'admin': '/admin/dashboard',
            'super admin': '/admin/dashboard',
            'staff': '/'  // TODO: Create staff dashboard
          };
          
          const redirectPath = roleBasedRoutes[result.data.role?.toLowerCase()] || '/';
          navigate(redirectPath);
          setLoading(false);
        }, 800);
      } else {
        // Login failed
        setErrors({ form: result.error || "Login failed. Please try again." });
        setLoading(false);
      }
    } catch (error) {
      setErrors({ form: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  // If magic link is invalid or missing, show unauthorized message
  if (unauthorized) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg-dark)",
        padding: "20px"
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "16px"
          }}>
            🔒
          </div>
          <h1 style={{
            color: "var(--color-white)",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "12px"
          }}>
            Access Restricted
          </h1>
          <p style={{
            color: "var(--color-tan)",
            fontSize: "14px",
            marginBottom: "24px",
            lineHeight: "1.6"
          }}>
            This page is only accessible via a magic link generated by the super admin. 
            If you believe this is an error, contact your administrator.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 24px",
              background: "var(--color-amber)",
              color: "var(--color-black)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px"
            }}
          >
            Return to Home
          </button>
          <p style={{
            color: "rgba(152, 143, 129, 0.6)",
            fontSize: "12px",
            marginTop: "20px"
          }}>
            Redirecting automatically in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-root">

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div className="login-left">
        <GridTexture />

        <div className={`login-form-inner ${mounted ? "mounted" : ""}`}>

          {/* Logo */}
          <div className="login-logo-row">
            <div className="login-logo-badge">
              <ScissorsIcon size={22} color="#000" />
            </div>
            <span className="brand-name">BeautyBook Pro</span>
          </div>

          {/* Heading */}
          <div className="login-heading-block">
            <div className="login-portal-badge">
              <span className="login-portal-badge-dot" />
              <span className="login-portal-badge-text">Admin Portal</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Sign in to manage your salon operations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-body">

            {/* Form-level error */}
            {errors.form && (
              <div style={{padding:"10px 12px",marginBottom:"16px",backgroundColor:"rgba(220, 53, 69, 0.1)",border:"1px solid rgba(220, 53, 69, 0.3)",borderRadius:"6px",color:"#dc3545",fontSize:"0.75rem",fontFamily:"'Inter', sans-serif"}}>
                {errors.form}
              </div>
            )}

            {/* Email */}
            <div className="field-box">
              <span className="field-label">Email Address</span>
              <div className={`login-input-inner ${errors.email ? "has-error" : ""}`}>
                <MailIcon />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
                  placeholder="admin@beautybook.pro"
                  aria-label="Email Address"
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
              <button type="button" className="login-forgot-btn">
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
    </div>
  );
};

export default LogIn;