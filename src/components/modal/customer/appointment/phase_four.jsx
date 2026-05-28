/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   IMPORTS
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ConfirmationDialog } from "../confirmation_dialog";
import { Toast } from "../../../toast";

const BOOKING_MODAL_THEME_CLASS = "booking-modal-theme";

const BOOKING_MODAL_THEME_VARS = {
  "--bg-dark": "#070605",
  "--bg-darker": "#0b0907",
  "--bg-card": "#070605",
  "--bg-footer": "#070605",
  "--bg-secondary": "#14110e",
  "--color-amber": "#dd901d",
  "--color-amber-dark": "#b97918",
  "--color-tan": "#988f81",
  "--color-white": "#f5f1eb",
  "--color-black": "#1a0f00",
  "--color-light": "#f5f1eb",
  "--border-tan": "rgba(152, 143, 129, 0.3)",
  "--border-tan-light": "rgba(152, 143, 129, 0.35)",
  colorScheme: "dark",
};

const BOOKING_MODAL_THEME_STYLE_ID = "booking-modal-theme-phase-four-v2";

const BOOKING_MODAL_THEME_CSS = `
@media (max-width: 1024px) {
  .booking-modal-theme,
  .booking-modal-theme * {
    color-scheme: dark;
  }

  html[data-theme="light"] .booking-modal-theme .appt-root {
    display: flex !important;
    flex-direction: column !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: calc(100vw - 32px) !important;
    max-width: calc(100vw - 32px) !important;
    height: 520px !important;
    max-height: 520px !important;
    overflow: hidden !important;
  }

  @media (max-width: 480px) {
    html[data-theme="light"] .booking-modal-theme .appt-root {
      width: calc(100vw - 24px) !important;
      height: 480px !important;
      max-height: 480px !important;
    }
  }

  html[data-theme="light"] .booking-modal-theme .appt-header,
  html[data-theme="light"] .booking-modal-theme .appt-footer {
    background: #070605 !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-progress {
    background: rgba(12, 10, 9, 0.6) !important;
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-body {
    flex: 1 !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    padding: 12px 12px 10px !important;
    gap: 12px !important;
    background: #070605 !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-footer {
    padding: 10px 12px 12px !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-cancel-btn,
  html[data-theme="light"] .booking-modal-theme .appt-continue-btn,
  html[data-theme="light"] .booking-modal-theme .appt-download-receipt-btn {
    min-height: 40px !important;
  }

  .booking-modal-theme .appt-root {
    background: #070605 !important;
    border: 1px solid rgba(221, 144, 29, 0.15) !important;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65) !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-header,
  .booking-modal-theme .appt-footer {
    background: #070605 !important;
  }

  .booking-modal-theme .appt-header {
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  .booking-modal-theme .appt-footer {
    border-top: 1px solid rgba(152, 143, 129, 0.18) !important;
  }

  .booking-modal-theme .appt-progress {
    background: rgba(12, 10, 9, 0.6) !important;
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  .booking-modal-theme .appt-body {
    background: #070605 !important;
    color: #f5f1eb !important;
    padding: 0 40px 24px !important;
  }

  .booking-modal-theme .appt-back-btn,
  .booking-modal-theme .appt-header-title,
  .booking-modal-theme .appt-section-title,
  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .appt-step-label,
  .booking-modal-theme .confirm-detail-label,
  .booking-modal-theme .confirm-detail-value,
  .booking-modal-theme .confirm-svc-name,
  .booking-modal-theme .confirm-svc-duration,
  .booking-modal-theme .confirm-svc-price,
  .booking-modal-theme .confirm-ref-pill {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .confirm-detail-label,
  .booking-modal-theme .confirm-svc-duration,
  .booking-modal-theme .confirm-ref-pill {
    color: #988f81 !important;
  }

  .booking-modal-theme .appt-step-circle {
    background: #231d1a !important;
    color: #988f81 !important;
  }

  .booking-modal-theme .appt-step-circle.active,
  .booking-modal-theme .appt-step-circle.done {
    background: #dd901d !important;
    color: #1a0f00 !important;
  }

  .booking-modal-theme .appt-step-line {
    background: rgba(152, 143, 129, 0.25) !important;
  }

  .booking-modal-theme .appt-step-line.done {
    background: #dd901d !important;
  }

  .booking-modal-theme .appt-root .confirm-card {
    background: #11100d !important;
    border: 1px solid rgba(221, 144, 29, 0.12) !important;
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.22) !important;
    color: #f5f1eb !important;
    padding-bottom: 28px !important;
  }

  .booking-modal-theme .confirm-service-row,
  .booking-modal-theme .confirm-detail-row {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-root .confirm-svc-icon {
    background: #dd901d !important;
    border: 1px solid rgba(221, 144, 29, 0.42) !important;
    box-shadow: 0 10px 20px rgba(221, 144, 29, 0.2) !important;
  }

  .booking-modal-theme .appt-root .confirm-svc-icon svg,
  .booking-modal-theme .appt-root .confirm-svc-icon svg * {
    stroke: #1a0f00 !important;
    fill: transparent;
  }

  .booking-modal-theme .appt-root .confirm-services-selected {
    margin: 12px 0 16px !important;
  }

  .booking-modal-theme .appt-root .confirm-services-title {
    font-size: 0.72rem !important;
    font-weight: 600 !important;
    color: #988f81 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.03em !important;
    margin-bottom: 12px !important;
  }

  .booking-modal-theme .appt-root .confirm-services-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .booking-modal-theme .appt-root .confirm-services-item {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 16px !important;
    font-size: 0.95rem !important;
  }

  .booking-modal-theme .appt-root .confirm-services-name {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-root .confirm-services-price {
    color: #988f81 !important;
    font-weight: 600 !important;
  }

  .booking-modal-theme .confirm-bottom-row > div:last-child {
    color: #988f81 !important;
  }

  .booking-modal-theme .appt-root .confirm-ref-pill {
    background: rgba(221, 144, 29, 0.14) !important;
    border: 1px solid rgba(221, 144, 29, 0.45) !important;
    color: #f5f1eb !important;
    box-shadow: 0 0 0 1px rgba(221, 144, 29, 0.08) inset !important;
  }

  .booking-modal-theme .appt-root .confirm-bottom-row > div:last-child {
    color: #988f81 !important;
  }

  .booking-modal-theme .appt-cancel-btn {
    color: #988f81 !important;
    border-color: #988f81 !important;
    background: transparent !important;
  }

  .booking-modal-theme .appt-cancel-btn:hover {
    background: rgba(152, 143, 129, 0.1) !important;
    color: #f5f1eb !important;
    border-color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-continue-btn,
  .booking-modal-theme .appt-download-receipt-btn {
    background: #dd901d !important;
    color: #1a0f00 !important;
  }

  .booking-modal-theme .appt-continue-btn:hover:not(:disabled),
  .booking-modal-theme .appt-download-receipt-btn:hover {
    background: #b97918 !important;
  }

  .booking-modal-theme .appt-continue-btn:disabled {
    background: rgba(221, 144, 29, 0.4) !important;
    color: rgba(26, 15, 0, 0.55) !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-track {
    background: rgba(19, 19, 19, 0.4) !important;
    border-radius: 10px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb {
    background: rgba(221, 144, 29, 0.9) !important;
    border-radius: 10px !important;
    border: 2px solid transparent !important;
    background-clip: padding-box !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb:hover {
    background: rgba(221, 144, 29, 1) !important;
  }

  .booking-modal-theme .appt-body {
    scrollbar-width: thin;
    scrollbar-color: rgba(221, 144, 29, 0.9) rgba(19, 19, 19, 0.4);
  }

}

@media (min-width: 1025px) {
  html[data-theme="light"] .booking-modal-theme .appt-root {
    background: #070605 !important;
    border: 1px solid rgba(221, 144, 29, 0.15) !important;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65) !important;
    color: #f5f1eb !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-header,
  html[data-theme="light"] .booking-modal-theme .appt-footer {
    background: #070605 !important;
  }

  .booking-modal-theme .appt-root {
    background: #070605 !important;
    border: 1px solid rgba(221, 144, 29, 0.15) !important;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65) !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-root .confirm-card,
  .booking-modal-theme .appt-root .confirm-card {
    background: #11100d !important;
    color: #f5f1eb !important;
    border: 1px solid rgba(221, 144, 29, 0.12) !important;
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.22) !important;
  }

  html[data-theme="light"] .booking-modal-theme .confirm-service-row,
  html[data-theme="light"] .booking-modal-theme .confirm-detail-row,
  .booking-modal-theme .confirm-service-row,
  .booking-modal-theme .confirm-detail-row {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-body {
    background: #070605 !important;
    color: #f5f1eb !important;
    padding: 0 40px 24px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-track {
    background: rgba(19, 19, 19, 0.4) !important;
    border-radius: 10px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb {
    background: rgba(221, 144, 29, 0.9) !important;
    border-radius: 10px !important;
    border: 2px solid transparent !important;
    background-clip: padding-box !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb:hover {
    background: rgba(221, 144, 29, 1) !important;
  }

  .booking-modal-theme .appt-body {
    scrollbar-width: thin;
    scrollbar-color: rgba(221, 144, 29, 0.9) rgba(19, 19, 19, 0.4);
  }
}
`;

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   INLINE SVG ICONS
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */

/* Scissors icon for the service row */
const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    <circle cx="6" cy="7"  r="3.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    <circle cx="6" cy="17" r="3.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    <path d="M9 5.5 L22 12"  stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 18.5 L22 12" stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="6" cy="7"  r="1.4" fill="#1a0f00"/>
    <circle cx="6" cy="17" r="1.4" fill="#1a0f00"/>
  </svg>
);

/* Person / user icon */
const PersonIcon = () => (
  <svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={20} style={{ flexShrink: 0 }}>
    <circle cx="10" cy="6" r="5" stroke="#988f81" strokeWidth="1.5" fill="none"/>
    <path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke="#988f81" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Envelope icon */
const EnvelopeIcon = () => (
  <svg viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={16} style={{ flexShrink: 0 }}>
    <rect x="1" y="1" width="20" height="14" rx="2" stroke="#988f81" strokeWidth="1.5" fill="none"/>
    <path d="M1 4l10 6 10-6" stroke="#988f81" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* Phone icon */
const PhoneIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={18} style={{ flexShrink: 0 }}>
    <path
      d="M4 1h4l2 5-2.5 1.5C8.3 10 10 11.7 12.5 12.5L14 10l5 2v4c0 1.7-1.3 3-3 3C6.3 19 1 13.7 1 7c0-1.7 1.3-3 3-3z"
      stroke="#988f81" strokeWidth="1.5" fill="none" strokeLinejoin="round"
    />
  </svg>
);

/* Stylist / person with hair (comb-like) icon */
const StylistIcon = () => (
  <svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={20} style={{ flexShrink: 0 }}>
    <circle cx="10" cy="6" r="4.5" stroke="#988f81" strokeWidth="1.5" fill="none"/>
    <path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke="#988f81" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* comb tines on top of head */}
    <path d="M7 2.5 Q10 1 13 2.5" stroke="#988f81" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Back arrow */
const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Download/Print icon */
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={18} style={{ flexShrink: 0 }}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   DATA ΓÇö in real app these would be props
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const BOOKING = {
  service:   "Haircut",
  duration:  "30 mins",
  dateTime:  "12/15/2025 | 9:00AM",
  price:     "₱150",
  name:      "Jake Quaker",
  email:     "quakerjake@gmail.com",
  phone:     "09xxxxxxxxx",
  stylist:   "Any Available Stylist",
};

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   SUB-COMPONENTS
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */

/* ΓöÇΓöÇ Header ΓöÇΓöÇ */
const BookingHeader = ({ onBack, isConfirmed }) => (
  <header className="appt-header">
    <button 
      className="appt-back-btn" 
      onClick={onBack} 
      aria-label="Go back"
      disabled={isConfirmed}
      style={{ opacity: isConfirmed ? 0.5 : 1, cursor: isConfirmed ? "not-allowed" : "pointer" }}
    >
      <BackArrowIcon />
      Back
    </button>
    <h1 className="appt-header-title">Book Appointment</h1>
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ΓöÇΓöÇ Progress bar ΓÇö Phase 4 state ΓöÇΓöÇ */
/* Steps 1, 2, 3 done (Γ£ô); all connectors amber; step 4 active */
const ProgressIndicator = ({ currentStep = 4 }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {STEPS.map((step, i) => {
        const isDone   = step.number < currentStep;
        const isActive = step.number === currentStep;
        return (
          <div key={step.number} className="appt-progress-item">
            <div className={`appt-step-circle${isActive ? " active" : isDone ? " done" : ""}`}>
              {isDone
                ? <svg viewBox="0 0 12 12" fill="none" width={13} height={13}>
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                : step.number
              }
            </div>
            {/* all connectors amber in phase 4 */}
            {i < STEPS.length - 1 && (
              <div className="appt-step-line done" />
            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {STEPS.map((step) => (
        <span
          key={step.number}
          className={`appt-step-label${step.number === currentStep ? " active" : " done"}`}
        >
          {step.label}
        </span>
      ))}
    </div>
  </div>
);

/* ΓöÇΓöÇ Thin divider ΓöÇΓöÇ */
const Divider = () => (
  <div style={{ width: "100%", height: 1, background: "rgba(152,143,129,0.25)", flexShrink: 0 }} />
);

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   MAIN COMPONENT ΓÇö Phase 4
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const DARK_MODAL_VARS = {
  "--bg-card": "#070605",
  "--bg-dark": "#070605",
  "--color-white": "#f5f1eb",
  "--color-light": "#f5f1eb",
  "--color-tan": "#988f81",
  "--color-amber": "#dd901d",
  "--color-amber-dark": "#b97918",
  "--color-black": "#1a0f00",
  colorScheme: "dark",
};

export const AppointmentFormPhase4 = ({ onBack, onConfirm, onCancel, onClose, booking = BOOKING }) => {
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showReceiptReminder, setShowReceiptReminder] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showConfirmationToast, setShowConfirmationToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState('');
  const [bookingRef, setBookingRef] = useState(null);
  // Determine theme (light/dark) at render time to apply readable receipt colors
  const themeIsLight = typeof document !== 'undefined' && document.documentElement?.getAttribute('data-theme') === 'light';
  const receiptBg = themeIsLight ? '#FCF9F5' : '#11100d';
  const receiptText = themeIsLight ? '#1C1816' : '#f5f1eb';
  const receiptLabel = themeIsLight ? '#6b6b66' : '#988f81';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const existingStyle = document.getElementById(BOOKING_MODAL_THEME_STYLE_ID);
    if (existingStyle) {
      existingStyle.textContent = BOOKING_MODAL_THEME_CSS;
      return;
    }

    const style = document.createElement('style');
    style.id = BOOKING_MODAL_THEME_STYLE_ID;
    style.textContent = BOOKING_MODAL_THEME_CSS;
    document.head.appendChild(style);
  }, []);

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (showConfirmationToast) {
      const timer = setTimeout(() => {
        setShowConfirmationToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmationToast]);

  // Debug render logging
  // eslint-disable-next-line no-console
  console.log('[Phase4] render - showConfirmationToast:', showConfirmationToast, 'showReceiptReminder:', showReceiptReminder, 'isConfirmed:', isConfirmed);

  const handleExitRequest = () => {
    if (!isConfirmed) {
      setShowBackdropConfirm(true);
    } else if (!showReceiptReminder) {
      setShowReceiptReminder(true);
    }
  };

  // Escape key should trigger exit/receipt reminder
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleExitRequest();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isConfirmed, showReceiptReminder]);

  const handleBack = () => {
    onBack?.();
  };

  // Safety check: if booking is missing, return null
  if (!booking) {
    return <div style={{ padding: "20px", textAlign: "center", color: "#988f81" }}>Loading booking details...</div>;
  }

  // Handle both array (old format) and object (new format) for backward compatibility
  const isArrayFormat = Array.isArray(booking);
  const services = isArrayFormat ? booking : (booking?.services || []);
  const bookingData = isArrayFormat ? (booking[0] || booking) : booking;
  
  // Get the first service for the top display
  const mainService = services[0] || {};
  
  // Calculate total price and duration from all services
  const totalPrice = Array.isArray(services) && services.length > 0 ? services.reduce((sum, svc) => {
    const price = parseFloat(svc?.price?.toString().replace(/[^0-9.]/g, '') || 0);
    return sum + price;
  }, 0) : 0;
  
  const totalDuration = Array.isArray(services) && services.length > 0 ? services.reduce((sum, svc) => {
    const mins = parseInt(svc?.duration?.toString().match(/\d+/) || 0);
    return sum + mins;
  }, 0) : 0;

  // Coupon / discount handling (if parent passed appliedCoupon)
  const coupon = booking?.appliedCoupon || booking?.coupon || (booking?.promoCode ? { code: booking.promoCode } : null);
  const subtotal = totalPrice;
  const getCouponDiscountAmount = (couponData, baseAmount) => {
    if (!couponData) return 0;

    const rawValue = couponData.value ?? couponData.discount ?? couponData.discount_amount ?? couponData.amount;
    if (rawValue === undefined || rawValue === null || rawValue === "") return 0;

    const normalizedType = String(couponData.value_type || couponData.discount_type || "").toLowerCase();
    const valueText = String(rawValue).trim();
    const numericValue = Number.parseFloat(valueText.replace(/[^0-9.]/g, ""));

    if (Number.isNaN(numericValue)) return 0;

    if (normalizedType.includes("percent") || normalizedType.includes("percentage") || valueText.includes("%")) {
      return baseAmount * (numericValue / 100);
    }

    return numericValue;
  };

  const discountAmount = Math.max(0, Math.min(subtotal, getCouponDiscountAmount(coupon, subtotal)));
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const serviceItems = Array.isArray(booking.rawServices)
    ? booking.rawServices
    : (Array.isArray(booking.services) ? booking.services : []);
  const serviceEstTime = serviceItems.reduce((total, item) => {
    const minutes = Number(
      item?.est_time ??
      item?.estimated_time ??
      item?.duration_minutes ??
      item?.duration ??
      item?.time ??
      0
    );
    return total + (Number.isFinite(minutes) ? minutes : 0);
  }, 0);

  const formatBookingDateTime = (dateValue, timeValue) => {
    const dateText = dateValue
      ? new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          month: 'long',
          day: 'numeric',
        }).format(new Date(`${dateValue}T00:00:00`))
      : '';

    const timeText = timeValue ? String(timeValue).trim().replace(/\s+/g, '') : '';

    if (dateText && timeText) return `${dateText} | ${timeText}`;
    return dateText || timeText || '';
  };

  const displayDateTime = bookingData?.dateTime || formatBookingDateTime(bookingData?.date, bookingData?.time);

  /* Handle final confirmation */
  const handleConfirmBooking = async () => {
    try {
      console.log('[Phase4] Confirm button clicked!');
      console.log('[Phase4] Current state - isConfirmed:', isConfirmed, 'showConfirmationToast:', showConfirmationToast);
      
      // Show confirmation toast immediately
      console.log('[Phase4] Setting toast visible...');
      setShowConfirmationToast(true);
      setIsConfirmed(true);
      console.log('[Phase4] Toast and confirmed state set - about to log states');
      
      // Log state updates
      setTimeout(() => {
        console.log('[Phase4] After state update - isConfirmed:', isConfirmed, 'showConfirmationToast:', showConfirmationToast);
      }, 0);
      
      // Extract service(s) - get first one or join all
      const serviceList = Array.isArray(booking.services) && booking.services.length > 0
        ? booking.services.map(s => s.title || s.name).join(', ')
        : booking.service || 'General Service';
      
      // Determine contact (either email or phone, whichever is provided)
      const email = booking.email?.trim();
      const phone = booking.phone?.trim();
      const contact = email || phone;
      
      // Extract booking data
      const bookingData = {
        name: booking.name?.trim(),
        email: email,
        phone: phone,
        date: booking.date,
        time: booking.time,
        dateTime: booking.dateTime || formatBookingDateTime(booking.date, booking.time),
        service: serviceList,
        services: serviceItems,
        staff_assigned: booking.stylist,
        coupon: coupon || null,
        total_amount: totalAfterDiscount,
        service_est_time: serviceEstTime,
      };
      
      console.log('[Phase4] Booking data:', bookingData);
      
      // Validate required fields (email OR phone, not both required)
      if (!bookingData.name || !contact || !bookingData.date || !bookingData.time || !bookingData.service || !bookingData.staff_assigned) {
        console.error('[Phase4] Missing fields:', {
          name: !!bookingData.name,
          contact: !!contact,
          date: !!bookingData.date,
          time: !!bookingData.time,
          service: !!bookingData.service,
          staff_assigned: !!bookingData.staff_assigned
        });
        return;
      }
      
      // Call the appointment creation API
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('[Phase4] API error:', result);
        setErrorToastMessage(result?.error || result?.message || 'Unable to create booking right now.');
        setShowErrorToast(true);
        return;
      }
      
      console.log('[Phase4] Booking confirmed:', result);
      setIsConfirmed(true);
      setShowConfirmationToast(true);
      // Notify other parts of the app that appointments have changed
      try {
        window.dispatchEvent(new Event('appointmentsUpdated'));
        console.log('[Phase4] Dispatched appointmentsUpdated event');
      } catch (e) {
        console.warn('[Phase4] Failed to dispatch appointmentsUpdated event', e);
      }

      // Attempt to retrieve the created slot/ref from server by customer
      try {
        const email = booking.email?.trim();
        const phone = booking.phone?.trim()?.replace(/\D/g, "");
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (phone) params.append('phone', phone);

        const resp = await fetch(`/api/appointments/read/by-customer?${params.toString()}`);
        if (resp.ok) {
          const data = await resp.json();
          const items = data?.appointments || [];
          // Try to find exact match by date and time_24 if available
          const to24 = (t) => {
            if (!t) return null;
            const m = String(t).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
            if (!m) return null;
            let hh = Number(m[1]);
            const mm = m[2];
            const p = m[3].toUpperCase();
            if (p === 'PM' && hh !== 12) hh += 12;
            if (p === 'AM' && hh === 12) hh = 0;
            return `${String(hh).padStart(2,'0')}:${mm}`;
          };

          const wantedDate = booking.date;
          const wanted24 = to24(booking.time);

          let found = items.find((it) => {
            if (!it) return false;
            if (it.date && wantedDate && it.date === wantedDate) {
              if (wanted24 && (it.time_24 === wanted24 || String(it.time || '').includes(String(booking.time || '')))) return true;
              if (!wanted24) return true;
            }
            return false;
          });

          // Fallback: pick the most recently updated item
          if (!found && items.length > 0) {
            found = items.sort((a,b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())[0];
          }

          if (found) {
            const ref = String(found.id || found.refNo || found.id).padStart(8, '0');
            setBookingRef(ref);
            console.log('[Phase4] Retrieved booking ref:', ref, found);
          }
        }
      } catch (err) {
        console.warn('[Phase4] Failed to fetch booking ref after confirm:', err);
      }
      
    } catch (error) {
      console.error('[Phase4] Error confirming booking:', error);
    }
  };

  /* Generate printable receipt */
  const handleDownloadReceipt = () => {
    console.log('[Phase4] Download Receipt clicked');
    // Show receipt generated - now remind user to save it
    console.log('[Phase4] Setting showReceiptReminder to true');
    setShowReceiptReminder(true);
    console.log('[Phase4] Generating receipt...');
    generateReceipt();
  };

  /* Generate the receipt HTML and open print dialog */
  const generateReceipt = () => {
    // Build receipt with coupon/subtotal/total
    const receiptSubtotal = subtotal.toFixed(2);
    const receiptDiscount = discountAmount > 0 ? discountAmount.toFixed(2) : null;
    const receiptCouponDescription = coupon?.description || coupon?.discount_description || coupon?.title || coupon?.name || booking?.promoCode || null;
    const receiptTotal = totalAfterDiscount.toFixed(2);
    const receiptRef = bookingRef || bookingData?.refNo || 'N/A';
    const receiptDateTime = bookingData?.dateTime || formatBookingDateTime(bookingData?.date, bookingData?.time) || 'Not Selected';

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>BeautyBook Pro - Receipt</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #070605; 
            padding: 20px;
            color: #f5f1eb;
          }
          .receipt { 
            max-width: 480px; 
            margin: 0 auto; 
            background: #11100d; 
            padding: 32px 24px; 
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.45);
          }
          .header { 
            text-align: center; 
            margin-bottom: 32px; 
            border-bottom: 2px solid #dd901d;
            padding-bottom: 16px;
          }
          .logo { 
            font-size: 24px; 
            font-weight: 700; 
            color: #f5f1eb; 
            margin-bottom: 4px;
          }
          .subtitle { 
            font-size: 12px; 
            color: #988f81; 
          }
          .section { 
            margin-bottom: 24px; 
          }
          .section-title { 
            font-size: 11px; 
            font-weight: 600; 
            color: #dd901d; 
            text-transform: uppercase; 
            letter-spacing: 0.05em;
            margin-bottom: 12px;
          }
          .service-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #f5f1eb;
          }
          .service-name { flex: 1; }
          .service-price { 
            font-weight: 600; 
            color: #dd901d;
            margin-left: 8px;
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between;
            font-size: 13px;
            margin-bottom: 8px;
            color: #f5f1eb;
          }
          .detail-label { 
            color: #988f81; 
            font-weight: 500;
          }
          .detail-value { 
            font-weight: 600; 
          }
          .divider { 
            height: 1px; 
            background: rgba(26,15,0,0.1); 
            margin: 16px 0;
          }
          .total { 
            display: flex; 
            justify-content: space-between;
            font-size: 16px;
            font-weight: 700;
            color: #f5f1eb;
            padding: 12px 0;
            border-top: 2px solid #dd901d;
            border-bottom: 2px solid #dd901d;
            margin: 16px 0;
          }
          .ref-box { 
            background: #f9f7f4; 
            padding: 16px; 
            border-radius: 10px; 
            text-align: center;
            margin: 20px 0;
            border: 1px solid #f0ede8;
          }
          .ref-label { 
            font-size: 9px;
            font-weight: 700;
            color: #988f81; 
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 6px;
            display: block;
          }
          .ref-code { 
            font-size: 20px; 
            font-weight: 700; 
            color: #dd901d; 
            font-family: 'Courier New', 'Courier', monospace;
            letter-spacing: 0.5px;
          }
          .footer { 
            text-align: center; 
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(26,15,0,0.1);
            font-size: 11px;
            color: #988f81;
            line-height: 1.6;
          }
          @media print {
            body { padding: 0; background: #fff; }
            .receipt { box-shadow: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">BeautyBook Pro</div>
            <div class="subtitle">Booking Receipt</div>
          </div>

          <div class="section">
            <div class="section-title">Services</div>
            ${services.map(svc => `
              <div class="service-item">
                <span class="service-name">${svc.title || svc.name || 'Service'}</span>
                <span class="service-price">${svc.price || 'N/A'}</span>
              </div>
            `).join('')}
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Appointment Details</div>
            <div class="detail-row">
              <span class="detail-label">Date & Time</span>
              <span class="detail-value">${receiptDateTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration</span>
              <span class="detail-value">${totalDuration} mins</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Stylist</span>
              <span class="detail-value">${bookingData?.stylist || 'N/A'}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="detail-row">
              <span class="detail-label">Name</span>
              <span class="detail-value">${bookingData?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email</span>
              <span class="detail-value">${bookingData?.email || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone</span>
              <span class="detail-value">${bookingData?.phone || 'N/A'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Totals</div>
            <div class="detail-row">
              <span class="detail-label">Subtotal</span>
              <span class="detail-value">₱${receiptSubtotal}</span>
            </div>
            ${receiptDiscount ? `<div class="detail-row"><span class="detail-label">Coupon</span><span class="detail-value">- ₱${receiptDiscount}</span></div>` : ''}
            <div class="total">
              <span>Total Amount</span>
              <span>₱${receiptTotal}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Reference</div>
            <div class="ref-code">${receiptRef}</div>
          </div>

          <div class="footer">
            <p>Please keep this reference number for your records.</p>
            <p>You will receive a confirmation via email and SMS 15 minutes before your appointment.</p>
            <p class="footer-highlight">Thank you for choosing BeautyBook Pro!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create a blob from the HTML
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open print dialog
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  return (
    <>
      {/* ΓöÇΓöÇ Toast Notifications (Top Fixed Position) ΓöÇΓöÇ */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999999, pointerEvents: "auto", display: "flex", justifyContent: "center", padding: "20px" }}>
        <Toast 
          message="Booking Confirmed!" 
          type="success" 
          duration={2000} 
          isVisible={showConfirmationToast} 
        />
        <Toast 
          message={errorToastMessage || 'Unable to create booking right now.'}
          type="error"
          duration={3000}
          isVisible={showErrorToast}
        />
      </div>

      {createPortal(
        <div 
          className={`appt-backdrop ${BOOKING_MODAL_THEME_CLASS}`}
          data-theme="dark"
          onClick={(e) => {
            console.log('[Phase4] Backdrop click detected', { 
              target: e.target.className, 
              currentTarget: e.currentTarget.className,
              isConfirmed 
            });
            // Only trigger if clicking directly on backdrop, not on children
            if (e.target === e.currentTarget) {
              if (!isConfirmed) {
                console.log('[Phase4] Conditions met - showing cancel dialog');
                setShowBackdropConfirm(true);
              } else if (isConfirmed && !showReceiptReminder) {
                console.log('[Phase4] Booking is confirmed and user clicked outside - showing receipt reminder');
                setShowReceiptReminder(true);
              }
            }
          }}
          style={{
            ...BOOKING_MODAL_THEME_VARS,
            ...DARK_MODAL_VARS,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: !isConfirmed ? "pointer" : "default",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: 'blur(2px)',
            pointerEvents: 'auto'
          }}
        >
          <div className="appt-root" onClick={(e) => e.stopPropagation()} style={{ ...BOOKING_MODAL_THEME_VARS }}>
          <BookingHeader onBack={handleBack} isConfirmed={isConfirmed} />
          <ProgressIndicator currentStep={4} />

          {/* ΓöÇΓöÇ Scrollable body ΓöÇΓöÇ */}
          <div className="appt-body" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "0 40px" }}>
            <div className="appt-section-heading">
              <p className="appt-section-title">Confirm Booking</p>
              <p className="appt-section-sub">Review your appointment details</p>
            </div>

            {/* ΓöÇΓöÇ Confirmation summary card ΓöÇΓöÇ */}
            <div className="confirm-card" style={{ background: receiptBg, color: receiptText }}>
              {services.length > 0 && (
                <>
                  <div className="confirm-service-row">
                    <div className="confirm-service-left">
                      <div className="confirm-svc-icon">
                        <ScissorsIcon />
                      </div>
                      <div className="confirm-svc-text" style={{ color: receiptText }}>
                        <span className="confirm-svc-name" style={{ color: '#ffffff' }}>{services[0].title || services[0].name || 'Service'}</span>
                        <span className="confirm-svc-duration" style={{ color: receiptLabel }}>{totalDuration} mins</span>
                      </div>
                    </div>
                    <div className="confirm-svc-meta">
                      <span className="confirm-svc-price" style={{ color: receiptLabel }}>{services[0].price || 'N/A'}</span>
                    </div>
                  </div>
                  <Divider />
                </>
              )}

              {services.length > 0 && (
                <>
                  <div className="confirm-services-selected">
                      <div className="confirm-services-title" style={{ color: receiptLabel }}>
                      Services Selected
                    </div>
                    <div className="confirm-services-list">
                          {services.map((service, idx) => (
                        <div key={idx} className="confirm-services-item" style={{ color: receiptText }}>
                          <div className="confirm-services-name" style={{ color: '#ffffff' }}>{service.title || service.name || 'Service'}</div>
                          <div className="confirm-services-price" style={{ color: receiptLabel }}>{service.price || 'N/A'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </>
              )}

              <div className="confirm-details">
                <div className="confirm-detail-row">
                  <PersonIcon />
                  <div className="confirm-detail-text">
                        <span className="confirm-detail-label" style={{ color: '#988f81' }}>Name</span>
                        <span className="confirm-detail-value" style={{ color: '#ffffff' }}>{bookingData?.name || 'N/A'}</span>
                  </div>
                </div>
                <div className="confirm-detail-row">
                  <StylistIcon />
                  <div className="confirm-detail-text">
                        <span className="confirm-detail-label" style={{ color: '#988f81' }}>Stylist</span>
                        <span className="confirm-detail-value" style={{ color: '#ffffff' }}>{bookingData?.stylist || 'N/A'}</span>
                  </div>
                </div>
                <div className="confirm-detail-row">
                  <EnvelopeIcon />
                  <div className="confirm-detail-text">
                        <span className="confirm-detail-label" style={{ color: '#988f81' }}>Date &amp; Time</span>
                        <span className="confirm-detail-value" style={{ color: '#ffffff' }}>{displayDateTime || 'Not Selected'}</span>
                  </div>
                </div>
                <div className="confirm-detail-row">
                  <DownloadIcon />
                  <div className="confirm-detail-text">
                        <span className="confirm-detail-label" style={{ color: '#988f81' }}>Duration</span>
                        <span className="confirm-detail-value" style={{ color: '#ffffff' }}>{totalDuration} mins</span>
                  </div>
                </div>
              </div>

              <Divider />

                <div className="confirm-details">
                <div className="confirm-detail-row">
                  <span className="confirm-detail-label" style={{ color: '#988f81' }}>Subtotal</span>
                  <span className="confirm-detail-value" style={{ color: '#ffffff' }}>₱{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="confirm-detail-row">
                    <span className="confirm-detail-label" style={{ color: '#988f81' }}>Coupon</span>
                    <span className="confirm-detail-value" style={{ color: '#ffffff' }}>- ₱{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="confirm-detail-row" style={{ paddingTop: 10, paddingBottom: 10, marginTop: 8 }}>
                  <span className="confirm-detail-label" style={{ color: '#988f81', fontWeight: 700 }}>Total Amount</span>
                  <span className="confirm-detail-value" style={{ color: '#ffffff', fontWeight: 700 }}>₱{totalAfterDiscount.toFixed(2)}</span>
                </div>
              </div>

              <Divider />

              <div className="confirm-bottom-row" style={{ flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                {!isConfirmed ? (
                  <div style={{ color: '#988f81', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'visible' }}>
                    Reference number will be generated upon confirmation
                  </div>
                ) : (
                  <>
                    <div style={{ color: '#988f81', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'visible' }}>You will receive notifications 15 minutes before your appointment</div>
                    {bookingRef ? (
                      <div className="ref-box">
                        <div className="ref-label">Reference number</div>
                        <div className="ref-code">{bookingRef}</div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ΓöÇΓöÇ Footer CTA (Inside Modal) ΓöÇΓöÇ */}
          <div 
            className="appt-footer" 
            style={{ 
              display: "flex", 
              flexDirection: "row", 
              gap: "12px",
              padding: "16px 20px",
              background: "rgba(0,0,0,0.5)",
              borderTop: "1px solid rgba(152,143,129,0.2)",
              flexShrink: 0
            }}
          >
            {!isConfirmed && (
              <button 
                className="appt-continue-btn" 
                onClick={handleConfirmBooking} 
                style={{ flex: 1, cursor: "pointer", minWidth: 0, padding: "12px 16px", height: "52px", fontSize: "1.05rem", fontWeight: 700, borderRadius: "12px" }}
              >
                Confirm
              </button>
            )}
            {isConfirmed && (
              <button 
                className="appt-download-receipt-btn"
                onClick={(e) => {
                  console.log('[Phase4] Download Receipt button clicked', e);
                  handleDownloadReceipt();
                }}
                style={{ flex: 1, cursor: "pointer", minWidth: 0, padding: "12px 16px", height: "52px", fontSize: "1.05rem", fontWeight: 700, borderRadius: "12px" }}
              >
                <DownloadIcon />
                Download Receipt
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body
      )}

      {/* Backdrop Click Confirmation Dialog - Only show if booking not confirmed */}
      {!isConfirmed && (
        <ConfirmationDialog
          isOpen={showBackdropConfirm}
          title="Cancel Booking?"
          message="Are you sure you want to cancel? Your booking progress will be lost."
          confirmText="Yes, Cancel Booking"
          cancelText="Keep Booking"
          onConfirm={() => {
            console.log('[Phase4] Booking cancelled confirmed');
            setShowBackdropConfirm(false);
            onClose?.();
          }}
          onCancel={() => {
            console.log('[Phase4] Keep booking clicked');
            setShowBackdropConfirm(false);
          }}
        />
      )}

      {/* Receipt Reminder Confirmation Dialog - Only show if booking was confirmed */}
      {isConfirmed && (
        <ConfirmationDialog
          isOpen={showReceiptReminder}
          title="Save Your Booking Info"
          message={`Have you saved your receipt and reference number?\n\nReference No.: ${bookingRef || bookingData?.refNo || "N/A"}\n\nYou'll need this for check-in.`}
          confirmText="Yes, Saved"
          cancelText="Download Again"
            onConfirm={() => {
            console.log('[Phase4] Receipt saved confirmed');
            setShowReceiptReminder(false);
            setShowSuccessToast(true);
            // Close the modal after a short delay and stay on the current dashboard page
            setTimeout(() => {
              onClose?.();
            }, 2000);
          }}
          onCancel={() => {
            console.log('[Phase4] Download again clicked');
            setShowReceiptReminder(false);
            generateReceipt();
            // Reopen the dialog after a brief delay so user can download again
            setTimeout(() => {
              setShowReceiptReminder(true);
            }, 100);
          }}
        />
      )}
    </>
  );
};

export default AppointmentFormPhase4;
