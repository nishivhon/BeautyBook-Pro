import { useState } from "react";
import { Otp } from "../components/modal/customer/otp";
import { PasswordResetModal } from "../components/modal/password_reset_modal";
import { useNavigate } from "react-router-dom";

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#988f81" strokeWidth="1.8" />
    <path d="M2 8l10 6 10-6" stroke="#988f81" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const normalizeEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");
const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    
    const normalizedEmail = normalizeEmail(email);
    
    if (!normalizedEmail) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail })
      });

      const body = await response.json();

      if (!response.ok) {
        setErrors({ form: body.error || "Failed to send OTP" });
        return;
      }

      console.log("[ResetPassword] OTP sent successfully");
      setOtpSent(true);
      setStep(2);
    } catch (error) {
      console.error("[ResetPassword] Error requesting OTP:", error);
      setErrors({ form: "Failed to send OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpVerified = (otp) => {
    console.log("[ResetPassword] OTP verified, proceeding to password reset");
    setStep(3);
  };

  // Step 3: Reset password
  const handleResetPassword = async (data) => {
    setLoading(true);
    setErrors({});

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(email),
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        })
      });

      const body = await response.json();

      if (!response.ok) {
        setErrors({ form: body.error || "Failed to reset password" });
        return;
      }

      console.log("[ResetPassword] Password reset successfully");
      
      // Show success message and redirect to login
      setTimeout(() => {
        navigate("/operators/login", { 
          state: { message: "Password reset successful! Please login with your new password." }
        });
      }, 1500);

    } catch (error) {
      console.error("[ResetPassword] Error resetting password:", error);
      setErrors({ form: "Failed to reset password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Email form
  if (step === 1) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F1419",
        padding: "20px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1F2937",
          borderRadius: "12px",
          padding: "32px",
          border: "1px solid #374151"
        }}>
          
          <h1 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#E5E7EB",
            marginBottom: "8px",
            textAlign: "center"
          }}>
            Reset Password
          </h1>

          <p style={{
            fontSize: "14px",
            color: "#9CA3AF",
            textAlign: "center",
            marginBottom: "24px"
          }}>
            Enter your email address and we'll send you a verification code
          </p>

          {errors.form && (
            <div style={{
              padding: "12px",
              marginBottom: "16px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              color: "#ef4444",
              fontSize: "0.9rem",
              textAlign: "center"
            }}>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleRequestOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Email Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#9CA3AF"
              }}>
                Email Address
              </label>
              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center"
              }}>
                <MailIcon />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                  placeholder="your@email.com"
                  disabled={loading}
                  style={{
                    flex: 1,
                    marginLeft: "12px",
                    padding: "10px 0",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: errors.email ? "1.5px solid #ef4444" : "1.5px solid #4B5563",
                    color: "#E5E7EB",
                    fontSize: "0.95rem",
                    fontFamily: "Inter, sans-serif",
                    transition: "all 0.2s",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = "#dd901d";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = errors.email ? "#ef4444" : "#4B5563";
                  }}
                />
              </div>
              {errors.email && (
                <span style={{ fontSize: "0.85rem", color: "#ef4444" }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "44px",
                backgroundColor: loading ? "#d97706" : "#dd901d",
                color: "#0F1419",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "600",
                fontFamily: "Inter, sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: loading ? 0.7 : 1,
                marginTop: "8px"
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = "#f59e0b";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = "#dd901d";
              }}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>

          </form>

          {/* Back to Login */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => navigate("/operators/login")}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#dd901d",
                fontSize: "0.9rem",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Back to Login
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Step 2: OTP Verification
  if (step === 2 && otpSent) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F1419",
        padding: "20px"
      }}>
        <Otp
          onClose={() => {
            setStep(1);
            setOtpSent(false);
            setErrors({});
          }}
          onVerified={handleOtpVerified}
          otpType="email"
          loading={loading}
          error={errors.form}
          onErrorClear={() => setErrors({})}
          selectedEmail={email}
          selectedPhone=""
          name="User"
        />
      </div>
    );
  }

  // Step 3: Password Reset
  if (step === 3) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F1419",
        padding: "20px"
      }}>
        <PasswordResetModal
          onClose={() => navigate("/operators/login")}
          onSubmit={handleResetPassword}
          email={email}
          loading={loading}
          error={errors.form}
        />
      </div>
    );
  }
}
