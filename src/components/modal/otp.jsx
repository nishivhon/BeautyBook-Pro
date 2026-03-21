import { useCallback, useEffect, useState } from "react";

/* ── Lock icon for the OTP input field ── */
const LockIcon = () => (
  <svg
    viewBox="0 0 20 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    style={{ flexShrink: 0 }}
  >
    <rect
      x="2" y="10" width="16" height="11" rx="2.5"
      stroke="#988f81" strokeWidth="1.6" fill="none"
    />
    <path
      d="M6 10V7a4 4 0 0 1 8 0v3"
      stroke="#988f81" strokeWidth="1.6" strokeLinecap="round"
    />
    <circle cx="10" cy="15.5" r="1.5" fill="#988f81" />
    <line
      x1="10" y1="17" x2="10" y2="19"
      stroke="#988f81" strokeWidth="1.5" strokeLinecap="round"
    />
  </svg>
);

/* ── Close × icon ── */
const CloseIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width={14} height={14}>
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ══════════════════════════════════════════
   OTP MODAL COMPONENT
══════════════════════════════════════════ */
export const Otp = ({ onClose, onVerified }) => {
  const INITIAL_TIME = 300; // 5 minutes
  const [timeLeft,   setTimeLeft]   = useState(INITIAL_TIME);
  const [otpValue,   setOtpValue]   = useState("");
  const [isResending, setIsResending] = useState(false);

  /* countdown ticker */
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  /* mm:ss formatter */
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleResend = useCallback(() => {
    setIsResending(true);
    setOtpValue("");
    setTimeLeft(INITIAL_TIME);
    setTimeout(() => setIsResending(false), 1200);
  }, []);

  const handleCancel = () => {
    setOtpValue("");
    setTimeLeft(INITIAL_TIME);
    onClose?.();
  };

  const handleVerify = () => {
    if (otpValue.replace(/\s/g, "").length < 6) return;
    onVerified?.(otpValue);
  };

  /* format input as "### ###" as user types */
  const handleInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
    const formatted = raw.length > 3 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw;
    setOtpValue(formatted);
  };

  const isExpired  = timeLeft <= 0;
  const isComplete = otpValue.replace(/\s/g, "").length === 6;

  return (
    /* backdrop */
    <div className="otp-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>

      {/* modal card */}
      <div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">

        {/* ── Header ── */}
        <header className="otp-header">
          <h1 id="otp-title" className="otp-header-title">
            Verification Step
          </h1>
          <button
            className="otp-close-btn"
            onClick={handleCancel}
            aria-label="Close verification modal"
          >
            <CloseIcon />
          </button>
        </header>

        {/* ── Body ── */}
        <div className="otp-body">

          {/* Instruction */}
          <p className="otp-instruction">
            Enter the 6-digit code sent to your{" "}
            <strong>email / phone number</strong>
          </p>

          {/* OTP field */}
          <div className="otp-field-box">
            <label htmlFor="otp-input" className="otp-field-label">
              Verify your Email / Phone
            </label>
            <div className="otp-input-wrap">
              <div className="otp-input-inner">
                <LockIcon />
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  value={otpValue}
                  onChange={handleInput}
                  placeholder="--- ---"
                  maxLength={7}
                  autoComplete="one-time-code"
                  aria-label="Enter 6-digit OTP code"
                  className="otp-input"
                />
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="otp-meta-row">
            {/* timer */}
            <div className="otp-meta-left">
              <span className="otp-meta-label">Remaining Time:</span>
              <span
                className={`otp-timer${isExpired ? " otp-timer--expired" : ""}`}
                aria-live="polite"
                aria-label={`Remaining time: ${formatTime(timeLeft)}`}
              >
                {isExpired ? "Expired" : formatTime(timeLeft)}
              </span>
            </div>

            {/* resend */}
            <div className="otp-meta-right">
              <span className="otp-meta-label">Didn&apos;t get code?</span>
              <button
                className="otp-resend-btn"
                onClick={handleResend}
                disabled={isResending || (!isExpired && timeLeft > 270)}
                aria-label="Resend OTP code"
              >
                {isResending ? "Sending…" : "Resend"}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="otp-actions">
            <button
              className="otp-btn-cancel"
              onClick={handleCancel}
              aria-label="Cancel verification"
            >
              Cancel
            </button>
            <button
              className="otp-btn-verify"
              onClick={handleVerify}
              disabled={!isComplete || isExpired}
              aria-label="Verify OTP code"
            >
              Verify
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Otp;