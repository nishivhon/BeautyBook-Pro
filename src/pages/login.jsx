import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateOperatorCredentials, loginOperator } from "../services/operatorAuth";
import { isMagicLinkValid, getMagicLinkInfo } from "../services/magicLink";
import { CreateAccountPanel } from "../components/modal/customer/create-account";
import { Otp } from "../components/modal/customer/otp";
import { Toast } from "../components/toast";
import ReactDOM from "react-dom";
import { PasswordResetModal } from "../components/modal/password_reset_modal";
import { usePublicTheme } from "../theme/publicThemeContext";

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

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" stroke="#988f81" strokeWidth="1.8" />
    <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13a4 4 0 010 7.75" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 21v-2a4 4 0 00-3-3.87" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getLoginInputKind = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "empty";
  if (raw.includes("@")) return "email";
  if (/^[\d\s()+-]+$/.test(raw)) return "phone";
  return "unknown";
};

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

// ── Main Component ────────────────────────────────────────────────
export const LogIn = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { themeMode } = usePublicTheme();
  const isLightMode = themeMode === "light";
  const magicToken = searchParams.get('token');
  const shouldOpenCreateAccountPanel = searchParams.get('createAccount') === '1';

  const loginTheme = {
    pageSurface: isLightMode ? "#f5f0e8" : "#0a0908",
    pagePanel: isLightMode ? "#fdf7f9" : "#0c0b09",
    cardSurface: isLightMode ? "#ffffff" : "#1a1714",
    inputSurface: isLightMode ? "#ffffff" : "#231d1a",
    inputBorder: isLightMode ? "rgba(213, 210, 211, 0.8)" : "rgba(152, 143, 129, 0.3)",
    inputText: isLightMode ? "#0c0a09" : "#fff",
    inputPlaceholder: isLightMode ? "rgba(107, 93, 82, 0.72)" : "rgba(152, 143, 129, 0.5)",
    title: isLightMode ? "#0c0a09" : "#fff",
    subtitle: isLightMode ? "#6b5d52" : "#988f81",
    bodyText: isLightMode ? "#5f5348" : "#b8a599",
    mutedText: isLightMode ? "#6b5d52" : "#b8a599",
    link: isLightMode ? "#f38ba6" : "#dd901d",
    linkHover: isLightMode ? "#d94680" : "#c47f18",
    overlay: isLightMode ? "rgba(10, 9, 8, 0.34)" : "rgba(0, 0, 0, 0.5)",
    modalSurface: isLightMode ? "#ffffff" : "#1a1714",
    modalBorder: isLightMode ? "rgba(213, 210, 211, 0.8)" : "rgba(221, 144, 29, 0.2)",
    modalTitle: isLightMode ? "#0c0a09" : "white",
    modalText: isLightMode ? "#5f5348" : "#b8a599",
    modalInputSurface: isLightMode ? "#fff" : "#231d1a",
    modalInputBorder: isLightMode ? "rgba(213, 210, 211, 0.8)" : "rgba(152, 143, 129, 0.3)",
    modalInputText: isLightMode ? "#0c0a09" : "white",
    modalInputFocus: isLightMode ? "rgba(221, 144, 29, 0.55)" : "rgba(221, 144, 29, 0.6)",
    modalButtonHover: isLightMode ? "rgba(221, 144, 29, 0.1)" : "rgba(221, 144, 29, 0.1)",
  };

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
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotResetMode, setForgotResetMode] = useState("email"); // email or phone
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: form, 2: OTP, 3: password
  const [otpSent, setOtpSent] = useState(false);
  const [activePanel, setActivePanel] = useState("login");
  // OTP modal state for account creation
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpProps, setOtpProps] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  useEffect(() => {
    if (!shouldOpenCreateAccountPanel) return;

    setActivePanel("signup");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('createAccount');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, shouldOpenCreateAccountPanel]);

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
    const inputKind = getLoginInputKind(email);
    if (!email) {
      e.email = "Email or phone number is required";
    } else if (inputKind === "email") {
      if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    } else if (inputKind === "phone") {
      const digitsOnly = email.replace(/\D/g, "");
      if (digitsOnly.length < 10) e.email = "Enter a valid phone number";
    } else {
      e.email = "Enter a valid email or phone number";
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

      // Determine whether input is email or phone and send appropriate field
      const inputKind = getLoginInputKind(email);
      const payload = inputKind === 'email'
        ? { email: String(email).trim().toLowerCase(), password }
        : { phone: String(email).replace(/\D/g, ''), password };

      // Try customer login first
      const customerResponse = await fetch(`${apiUrl}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let customerStatus = null;
      let customerError = null;

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
      } else {
        customerStatus = customerResponse.status;
        try {
          const errBody = await customerResponse.json().catch(() => ({}));
          customerError = errBody.error || null;
        } catch (e) {
          customerError = null;
        }
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
        const operatorStatus = result.status;
        const showNotFound = customerStatus === 404 && operatorStatus === 404;

        if (showNotFound) {
          setErrors({ form: customerError || 'Account not found. Please sign up.' });
        } else {
          setErrors({ form: 'Invalid email/phone or password' });
        }
        setLoading(false);
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' });
      setLoading(false);
    }
  };

  const handleForgotPassword = async (ev) => {
    ev.preventDefault();
    if (forgotResetMode === "email" && !forgotEmail) {
      setForgotMessage("Please enter your email address");
      return;
    }
    if (forgotResetMode === "phone" && !forgotPhone) {
      setForgotMessage("Please enter your phone number");
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      let endpoint, payload;
      
      if (forgotResetMode === "email") {
        endpoint = "/api/auth/forgot-password";
        payload = { email: forgotEmail.trim().toLowerCase() };
      } else {
        endpoint = "/api/auth/forgot-password-phone";
        const phoneDigits = forgotPhone.replace(/\D/g, "");
        payload = { phone: phoneDigits };
      }

      // Send OTP request to backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setForgotStep(2); // Move to OTP verification step
      } else {
        setForgotMessage(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setForgotMessage("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotOtpVerified = async (otpValue) => {
    const sanitizedOtp = (otpValue || "").replace(/\s/g, "");

    if (!sanitizedOtp) {
      setForgotMessage("Please enter the OTP code");
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      let endpoint, payload;
      
      if (forgotResetMode === "email") {
        endpoint = "/api/auth/verify-email-otp";
        payload = { email: forgotEmail, otp: sanitizedOtp };
      } else {
        endpoint = "/api/sms/verify-otp";
        const phoneDigits = forgotPhone.replace(/\D/g, "");
        payload = { phone: phoneDigits, otp: sanitizedOtp };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("[Login] OTP verified, proceeding to password reset");
        setForgotStep(3);
        setForgotMessage("");
      } else {
        setForgotMessage(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setForgotMessage("An error occurred while verifying the OTP. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    setForgotLoading(true);
    setForgotMessage("");

    try {
      let payload;
      
      if (forgotResetMode === "email") {
        payload = {
          email: forgotEmail,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        };
      } else {
        const phoneDigits = forgotPhone.replace(/\D/g, "");
        payload = {
          phone: phoneDigits,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        };
      }
      
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = await response.json();

      if (response.ok) {
        setForgotMessage("✓ Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          setActivePanel("login");
          setForgotStep(1);
          setOtpSent(false);
          setForgotEmail("");
          setForgotPhone("");
          setForgotResetMode("email");
          setForgotMessage("");
        }, 2000);
      } else {
        setForgotMessage(body.error || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setForgotMessage("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle successful account creation from the signup panel
  const handleAccountCreated = (accountData) => {
    const customerProfile = {
      name: accountData.name,
      emails: accountData.email ? [accountData.email] : [],
      phones: accountData.phone ? [accountData.phone] : [],
      notificationPreference: "email",
      profilePhoto: "",
      id: accountData.id,
    };

    localStorage.setItem('customerProfileData', JSON.stringify(customerProfile));
    loginOperator(accountData.email || accountData.phone, accountData.password, 'customer');
    setShowOtpModal(false);
    setToastMessage("✅ Account created successfully! Redirecting to dashboard...");
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      navigate('/customer/dashboard');
    }, 1500);
  };

  const headingText = {
    login: { title: 'Welcome Back', subtitle: 'Sign in to your account.' },
    forgot: { title: 'Reset Password', subtitle: 'Enter your email address and we\'ll send you a reset link.' },
  };

/* Inline OTP form used for forgot-password flow (non-portal) */
const InlineOtp = ({ onClose, onVerified, selectedPhone, selectedEmail, otpType = "phone", loading = false, error = null, onErrorClear = null, name }) => {
  const INITIAL_TIME = 600;
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [otpValue, setOtpValue] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  useEffect(() => {
    if (!error) verifiedRef.current = false;
  }, [error]);

  useEffect(() => {
    const isComplete = otpValue.replace(/\s/g, "").length === 6;
    const isExpired = timeLeft <= 0;
    if (isComplete && !isExpired) {
      const t = setTimeout(() => handleVerify(), 300);
      return () => clearTimeout(t);
    }
  }, [otpValue, timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleResend = useCallback(async () => {
    setIsResending(true);
    setOtpValue("");
    setTimeLeft(INITIAL_TIME);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      let endpoint, resendData;
      if (otpType === "email") {
        endpoint = `${apiUrl}/auth/send-email-otp`;
        resendData = { email: selectedEmail, full_name: name };
      } else {
        endpoint = `${apiUrl}/sms/resend-otp`;
        resendData = { phone: selectedPhone, name };
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resendData)
      });
      const data = await response.json();
      if (!response.ok) console.error('Resend failed', data.error);
    } catch (err) {
      console.error('Error resending OTP', err);
    } finally {
      setTimeout(() => setIsResending(false), 900);
    }
  }, [selectedPhone, selectedEmail, name, otpType]);

  const handleCancel = () => {
    setOtpValue("");
    setTimeLeft(INITIAL_TIME);
    verifiedRef.current = false;
    onClose?.();
  };

  const handleVerify = () => {
    if (verifiedRef.current) return;
    if (otpValue.replace(/\s/g, "").length < 6) return;
    verifiedRef.current = true;
    onVerified?.(otpValue);
  };

  const handleInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
    const formatted = raw.length > 3 ? `${raw.slice(0,3)} ${raw.slice(3)}` : raw;
    setOtpValue(formatted);
    if (onErrorClear) onErrorClear();
  };

  const isExpired = timeLeft <= 0;
  const isComplete = otpValue.replace(/\s/g, "").length === 6;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ background: 'transparent', borderRadius: 6, padding: 0, boxShadow: 'none' }}>
        <div style={{ marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{otpType === 'email' ? 'Email Verification' : 'Phone Verification'}</h3>
        </div>

        <p style={{ marginTop: 8, marginBottom: 8, color: 'rgba(12,10,9,0.75)' }}>Enter the 6-digit code sent to your <strong>{otpType === 'email' ? 'email' : 'phone number'}</strong></p>

        <div style={{ marginTop: 6, marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'rgba(12,10,9,0.6)', marginBottom: 6 }}>Verification sent to {otpType === 'email' ? selectedEmail : selectedPhone}</label>
          <input
            type="text"
            inputMode="numeric"
            value={otpValue}
            onChange={handleInput}
            placeholder="--- ---"
            maxLength={7}
            autoComplete="one-time-code"
            aria-label="Enter 6-digit OTP code"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(12,10,9,0.06)', fontSize: '1.05rem', letterSpacing: '0.12em', background: 'transparent' }}
          />
        </div>

        {error && <div style={{ padding: '10px 12px', marginBottom: 12, backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(12,10,9,0.6)' }}>Remaining Time</div>
            <div style={{ fontWeight: 700, color: isExpired ? 'rgba(239,67,67,0.85)' : 'var(--color-amber)' }}>{isExpired ? 'Expired' : formatTime(timeLeft)}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(12,10,9,0.6)' }}>Didn't get code?</div>
            <button onClick={handleResend} disabled={isResending || (!isExpired && timeLeft > 270)} style={{ background: 'transparent', border: 'none', color: 'var(--color-amber)', cursor: 'pointer' }}>{isResending ? 'Sending…' : 'Resend'}</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <button onClick={() => setShowConfirmDialog(true)} disabled={loading} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(12,10,9,0.06)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleVerify} disabled={!isComplete || isExpired || loading} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', background: 'var(--color-amber)', fontWeight: 700, cursor: 'pointer' }}>{loading ? 'Verifying…' : 'Verify'}</button>
        </div>
      </div>

      {showConfirmDialog && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          title="Exit Verification?"
          message="Are you sure you want to cancel? Your verification will be lost."
          confirmText="Yes, Exit"
          cancelText="Continue Verifying"
          onConfirm={() => { setShowConfirmDialog(false); handleCancel(); }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

  // If magic link is invalid or missing, show unauthorized message
  if (unauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-5" style={{ backgroundColor: loginTheme.pageSurface }}>
        <div style={{ width: '100%', maxWidth: '420px', height: '480px', padding: '48px 32px', backgroundColor: loginTheme.modalSurface, borderRadius: '16px', border: `1px solid ${loginTheme.modalBorder}`, boxShadow: isLightMode ? '0 18px 42px rgba(10, 9, 8, 0.12)' : '0 8px 32px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="text-6xl">🔒</div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px', margin: 0, color: loginTheme.modalTitle }}>
              Access Restricted
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <p style={{ margin: 0, textAlign: 'center', color: loginTheme.modalText, fontSize: '0.875rem', lineHeight: '1.6' }}>
              This page is only accessible via a magic link generated by the super admin.
              If you believe this is an error, contact your administrator.
            </p>
            <button
              onClick={() => navigate("/")}
              className="font-600 text-sm"
              style={{ padding: '12px 32px', backgroundColor: '#dd901d', color: '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(221, 144, 29, 0.25)', fontWeight: '700' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = loginTheme.linkHover; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(221, 144, 29, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dd901d'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(221, 144, 29, 0.25)'; }}
            >
              Return to Home
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ margin: 0, textAlign: 'center', color: loginTheme.mutedText, fontSize: '0.75rem' }}>
              Redirecting automatically in {redirectCountdown} {redirectCountdown === 1 ? 'second' : 'seconds'}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderLoginPanel = () => (
    <section style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: 'transparent',
          border: 'none',
          color: loginTheme.link,
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = loginTheme.linkHover; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = loginTheme.link; }}
      >
        ← Back
      </button>

      <div className="login-logo-row">
        <div className="login-logo-badge">
          <ScissorsIcon size={22} color="#000" />
        </div>
        <span className="brand-name">BeautyBook Pro</span>
      </div>

      <div className="login-heading-block">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-body">
        {errors.form && (
          <div className={`mb-4 font-inter ${shakeError ? 'login-error-shake' : ''}`} style={{ padding: '16px 18px', backgroundColor: isLightMode ? 'rgba(239, 67, 67, 0.08)' : 'rgba(239, 67, 67, 0.12)', border: '1.5px solid rgba(239, 67, 67, 0.5)', borderRadius: '12px', color: '#ef4343', boxShadow: '0 2px 8px rgba(239, 67, 67, 0.1)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {errors.form}
          </div>
        )}

        <div className="field-box">
          <span className="field-label">Email or Phone Number</span>
          <div className={`login-input-inner ${errors.email ? "has-error" : ""}`}>
            {getLoginInputKind(email) === "empty" || getLoginInputKind(email) === "unknown" ? <UsersIcon /> : getLoginInputKind(email) === "email" ? <MailIcon /> : <PhoneIcon />}
            <input
              type="text"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
              placeholder="you@example.com or 09123456789"
              aria-label="Email or phone number"
            />
          </div>
          {errors.email && <span className="login-error-msg">{errors.email}</span>}
        </div>

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
            onClick={() => setActivePanel("forgot")}
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading ? (
            <>
              <SpinnerIcon />
              Signing In…
            </>
          ) : "Sign In"}
        </button>
      </form>

      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(221, 144, 29, 0.1)', textAlign: 'center' }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: loginTheme.bodyText }}>
          Don't have an account?
        </p>
        <button
          type="button"
          onClick={() => setActivePanel("signup")}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: loginTheme.link,
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '4px 8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = loginTheme.linkHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = loginTheme.link; }}
        >
          Create Account
        </button>
      </div>
    </section>
  );

  const renderForgotPanel = () => {
    // Step 1: Email form
    if (forgotStep === 1) {
      return (
        <section style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <button
            type="button"
            onClick={() => setActivePanel("login")}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'transparent',
              border: 'none',
              color: loginTheme.link,
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = loginTheme.linkHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = loginTheme.link; }}
          >
            ← Back to Login
          </button>

          <div className="login-logo-row">
            <div className="login-logo-badge">
              <ScissorsIcon size={22} color="#000" />
            </div>
            <span className="brand-name">BeautyBook Pro</span>
          </div>

          <div className="login-heading-block">
            <h1 className="login-title">Reset Password</h1>
            <p className="login-subtitle">Enter your email or phone number to receive a verification code.</p>
          </div>

          <form onSubmit={handleForgotPassword} className="form-body">
            {/* Verification Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setForgotResetMode("email");
                  setForgotPhone("");
                }}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  backgroundColor: forgotResetMode === "email" ? loginTheme.link : 'transparent',
                  color: forgotResetMode === "email" ? (isLightMode ? '#0c0a09' : '#000') : loginTheme.link,
                  border: `1.5px solid ${loginTheme.link}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (forgotResetMode !== "email") {
                    e.currentTarget.style.backgroundColor = loginTheme.modalButtonHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (forgotResetMode !== "email") {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotResetMode("phone");
                  setForgotEmail("");
                }}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  backgroundColor: forgotResetMode === "phone" ? loginTheme.link : 'transparent',
                  color: forgotResetMode === "phone" ? (isLightMode ? '#0c0a09' : '#000') : loginTheme.link,
                  border: `1.5px solid ${loginTheme.link}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (forgotResetMode !== "phone") {
                    e.currentTarget.style.backgroundColor = loginTheme.modalButtonHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (forgotResetMode !== "phone") {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Phone
              </button>
            </div>

            {/* Email Input */}
            {forgotResetMode === "email" && (
              <div className="field-box">
                <span className="field-label">Email Address</span>
                <div className="login-input-inner">
                  <MailIcon />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address"
                  />
                </div>
              </div>
            )}

            {/* Phone Input */}
            {forgotResetMode === "phone" && (
              <div className="field-box">
                <span className="field-label">Phone Number</span>
                <div className="login-input-inner">
                  <PhoneIcon />
                  <input
                    type="tel"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="09123456789"
                    aria-label="Phone number"
                  />
                </div>
              </div>
            )}

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
                onClick={() => setActivePanel("login")}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  color: loginTheme.link,
                  border: `1.5px solid ${loginTheme.link}`,
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = loginTheme.modalButtonHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={forgotLoading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: loginTheme.link,
                  color: isLightMode ? '#0c0a09' : '#000',
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
                    e.currentTarget.style.backgroundColor = loginTheme.linkHover;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!forgotLoading) {
                    e.currentTarget.style.backgroundColor = loginTheme.link;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {forgotLoading ? (
                  <>
                    <SpinnerIcon />
                    Sending…
                  </>
                ) : (
                  'Send Code'
                )}
              </button>
            </div>
          </form>
        </section>
      );
    }

    // Step 2: OTP Verification
    if (forgotStep === 2 && otpSent) {
      return ReactDOM.createPortal(
        <Otp
          onClose={() => {
            setForgotStep(1);
            setOtpSent(false);
            setForgotMessage("");
          }}
          onVerified={handleForgotOtpVerified}
          selectedEmail={forgotResetMode === "email" ? forgotEmail : undefined}
          selectedPhone={forgotResetMode === "phone" ? forgotPhone : undefined}
          otpType={forgotResetMode === "email" ? "email" : "phone"}
          loading={forgotLoading}
          error={forgotMessage}
          onErrorClear={() => setForgotMessage("")}
          name="User"
        />,
        document.body
      );
    }

    // Step 3: Password Reset
    if (forgotStep === 3) {
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <PasswordResetModal
            onClose={() => {
              setActivePanel("login");
              setForgotStep(1);
              setOtpSent(false);
              setForgotEmail("");
              setForgotMessage("");
            }}
            onSubmit={handleResetPassword}
            email={forgotEmail}
            loading={forgotLoading}
            error={forgotMessage}
          />
        </div>
      );
    }
  };

  return (
    <div className="login-root" style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* OTP Modal Overlay (centered, always dark, via Portal) */}
      {showOtpModal && otpProps && ReactDOM.createPortal(
        <Otp {...otpProps} />,
        document.body
      )}
      <Toast isVisible={showToast} message={toastMessage} type="success" duration={2500} />
      <div className="login-left" style={{ overflow: 'hidden' }}>
        <GridTexture />

        <div className={`login-form-inner ${mounted ? "mounted" : ""}`} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '460px' }}>
          {activePanel === 'login' && renderLoginPanel()}
          {activePanel === 'signup' && (
            <CreateAccountPanel
              theme={loginTheme}
              onBackToLogin={() => setActivePanel("login")}
              onAccountCreated={handleAccountCreated}
            />
          )}
          {activePanel === 'forgot' && renderForgotPanel()}
        </div>
      </div>

      <div className="login-right">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-right-top-bar" />
        <div className="login-right-bottom-bar" />
        <div className="login-ring login-ring-lg" />
        <div className="login-ring login-ring-sm" />

        <div className={`login-right-content ${mounted ? "mounted" : ""}`}>
          <div className="login-icon-circle">
            <ScissorsIcon size={52} color="#000" />
          </div>

          <div className="login-right-heading">
            <h2 className="hero-title login-right-title">
              Customer Management{" "}
              <span className="accent">System</span>
            </h2>
            <p className="login-right-desc">
              Sign in to access your customer dashboard, view your appointments,
              and manage your profile and booking history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;