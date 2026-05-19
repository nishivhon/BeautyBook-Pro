import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ConfirmationDialog } from "../customer/confirmation_dialog";
import { Toast } from "../../toast";
import { AppointmentFormPhase2 } from "./appointment/phase_two";
import { AppointmentFormPhase3 } from "./appointment/phase_three";

const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Person silhouette — used in "Any available" row */
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    <circle cx="12" cy="8" r="4" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Star — used inline for ratings */
const StarIcon = ({ muted = false }) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" width={11} height={11} style={{ flexShrink: 0 }}>
    <path
      d="M6 1l1.2 3.6H11L8.1 6.8l1.1 3.4L6 8.2l-3.2 2 1.1-3.4L1 4.6h3.8z"
      fill={muted ? "rgba(221,144,29,0.5)" : "#dd901d"}
    />
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

/* Stylist / person with hair icon */
const StylistIcon = () => (
  <svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={20} style={{ flexShrink: 0 }}>
    <circle cx="10" cy="6" r="4.5" stroke="#988f81" strokeWidth="1.5" fill="none"/>
    <path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke="#988f81" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M7 2.5 Q10 1 13 2.5" stroke="#988f81" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
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

/* Scissors icon used for service rows */
const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    {/* pivot ring top */}
    <circle cx="6" cy="7"  r="3.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    {/* pivot ring bottom */}
    <circle cx="6" cy="17" r="3.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    {/* blade 1 */}
    <path d="M9 5.5 L22 12"  stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round"/>
    {/* blade 2 */}
    <path d="M9 18.5 L22 12" stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round"/>
    {/* inner pivot dots */}
    <circle cx="6" cy="7"  r="1.4" fill="#1a0f00"/>
    <circle cx="6" cy="17" r="1.4" fill="#1a0f00"/>
  </svg>
);

/* Hair Services — broom/brush icon */
const HairIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
    <path d="M6 3c0 0 1 4 1 8s-1 6-1 6" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M10 3c0 0 1 4 1 8s-1 6-1 6" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M14 3c0 0 1 4 1 8s-1 6-1 6" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M5 11h11" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <rect x="5" y="17" width="10" height="4" rx="1" fill="#1a0f00"/>
  </svg>
);

/* Nail Services — polish bottle */
const NailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
    <rect x="8" y="10" width="8" height="11" rx="2" stroke="#1a0f00" strokeWidth="1.7" fill="none"/>
    <rect x="10" y="6"  width="4" height="4" rx="0.5" stroke="#1a0f00" strokeWidth="1.5" fill="none"/>
    <rect x="9"  y="3"  width="6" height="3.5" rx="1.5" fill="#1a0f00" fillOpacity="0.6"/>
    <line x1="11" y1="12.5" x2="11" y2="18.5" stroke="#1a0f00" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

/* Skincare — face with sparkles */
const SkincareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
    <circle cx="12" cy="13" r="7.5" stroke="#1a0f00" strokeWidth="1.6" fill="none"/>
    <circle cx="9.5"  cy="11.5" r="1" fill="#1a0f00"/>
    <circle cx="14.5" cy="11.5" r="1" fill="#1a0f00"/>
    <path d="M9.5 16 Q12 18 14.5 16" stroke="#1a0f00" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M12 3v2M10.5 4.5l1 1M13.5 4.5l-1 1" stroke="#1a0f00" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

/* Massage — hands / wave */
const MassageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
    <path d="M4 14 Q7 10 12 12 Q17 14 20 10" stroke="#1a0f00" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    <path d="M4 18 Q7 14 12 16 Q17 18 20 14" stroke="#1a0f00" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    <path d="M6 8 Q8 5 10 8 Q12 11 14 8 Q16 5 18 8" stroke="#1a0f00" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Premium Services — diamond */
const PremiumIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
    <path d="M12 20L3 9h18L12 20z" stroke="#1a0f00" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
    <path d="M3 9l3-5h12l3 5" stroke="#1a0f00" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
    <path d="M9 4L7 9l5 11M15 4l2 5-5 11" stroke="#1a0f00" strokeWidth="1" opacity="0.5"/>
    <line x1="3" y1="9" x2="21" y2="9" stroke="#1a0f00" strokeWidth="1.3"/>
  </svg>
);

const STEPS = [
  { number: 1, label: "Name" },
  { number: 2, label: "Service" },
  { number: 3, label: "Stylist" },
  { number: 4, label: "Receipt" },
];

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

/* ── Header ── */
const ModalHeader = ({ onBack }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack} aria-label="Go back">
      <BackArrowIcon />
      Back
    </button>
    <h1 className="appt-header-title">Add Walk-in</h1>
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress Indicator ── */
const ProgressIndicator = ({ currentStep, steps = STEPS }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {steps.map((step, i) => {
        const isDone = step.number < currentStep;
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
            {i < steps.length - 1 && (
              <div className={`appt-step-line${isDone ? " done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {steps.map((step) => (
        <span
          key={step.number}
          className={`appt-step-label${step.number === currentStep ? " active" : step.number < currentStep ? " done" : ""}`}
        >
          {step.label}
        </span>
      ))}
    </div>
  </div>
);

/* ── Thin divider ── */
const Divider = () => (
  <div style={{ width: "100%", height: 1, background: "rgba(152,143,129,0.25)", flexShrink: 0 }} />
);

export const AddWalkInModal = ({ isOpen, onClose, onSubmit }) => {
  // Phase data state
  const [phase2Data, setPhase2Data] = useState(null);
  const [phase3Data, setPhase3Data] = useState(null);

  const [step, setStep] = useState(1);
  const [walkInName, setWalkInName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showReceiptReminder, setShowReceiptReminder] = useState(false);
  const [showConfirmationToast, setShowConfirmationToast] = useState(false);

  const WALK_IN_STEPS = [
    { number: 1, label: "Name" },
    { number: 2, label: "Service" },
    { number: 3, label: "Stylist" },
    { number: 4, label: "Receipt" },
  ];

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;
    return `₱${amount.toFixed(2)}`;
  };

  const getSelectedServices = () => phase2Data?.services || [];

  const buildWalkInReceipt = (stylistData) => {
    const services = getSelectedServices();
    const subtotal = services.reduce((acc, service) => {
      const rawPrice = typeof service.price === "string"
        ? parseFloat(service.price.replace(/[^0-9.]/g, ""))
        : Number(service.price);
      return acc + (Number.isFinite(rawPrice) ? rawPrice : 0);
    }, 0);

    const totalDuration = services.reduce((acc, service) => {
      const mins = parseInt(service.estTime, 10) || parseInt(service.est_time, 10) || 0;
      return acc + mins;
    }, 0);

    return {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: walkInName,
      services,
      subtotal,
      totalAmount: subtotal,
      totalDuration,
      stylist: stylistData?.stylist?.name || "Any available",
      timestamp: new Date().toLocaleString(),
    };
  };

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (showConfirmationToast) {
      const timer = setTimeout(() => {
        setShowConfirmationToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmationToast]);

  // Validation for customer name
  const validateName = (value) => {
    if (!value || !value.trim()) {
      setNameError("Full name is required");
      return false;
    }
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    if (value.trim().length > 50) {
      setNameError("Name must be 50 characters or less");
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      setNameError("Name can only contain letters, spaces, hyphens, and apostrophes");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setWalkInName(value);
    if (nameTouched) {
      validateName(value);
    }
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    validateName(walkInName);
  };

  const handlePhase2Continue = (data) => {
    console.log('[AddWalkIn] Phase 2 data:', data);
    setPhase2Data(data);
    setStep(3);
  };

  const handlePhase3Continue = async (data) => {
    console.log('[AddWalkIn] Phase 3 data:', data);
    setPhase3Data(data);
    
    if (!phase2Data || !data) return;
    const receipt = buildWalkInReceipt(data);
    receipt.price = formatCurrency(receipt.totalAmount);

    setReceiptData(receipt);
    setStep(4);
    
    // Log to database immediately
    await logWalkInToDatabase(receipt);
    
    // Submit the walk-in to admin dashboard
    onSubmit({ ...receipt, services: receipt.services });
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!validateName(walkInName)) {
        setNameTouched(true);
        return;
      }
      setStep(2);
    }
  };

  const handleClose = () => {
    setStep(1);
    setWalkInName("");
    setNameError("");
    setNameTouched(false);
    setReceiptData(null);
    setPhase2Data(null);
    setPhase3Data(null);
    setShowConfirmCancel(false);
    setIsConfirmed(false);
    setShowReceiptReminder(false);
    setShowConfirmationToast(false);
    onClose();
  };

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 4) {
        // Going back from Phase 4 (Receipt) to Phase 3 (Stylist)
        // Keep phase2Data intact so Phase 3 can render
        setReceiptData(null);
        setIsConfirmed(false);
        setStep(3);
      } else if (step === 3) {
        // Going back from Phase 3 to Phase 2
        setPhase3Data(null);
        setStep(2);
      } else {
        // Going back from Phase 2 to step 1
        setPhase2Data(null);
        setStep(step - 1);
      }
    } else {
      // Step 1, show confirmation dialog
      setShowConfirmCancel(true);
    }
  };

  const generateReceipt = () => {
    if (!phase2Data || !phase3Data) return;

    const receipt = buildWalkInReceipt(phase3Data);
    receipt.price = formatCurrency(receipt.totalAmount);

    setReceiptData(receipt);
    setStep(4);
  };

  /* Log walk-in to database */
  const logWalkInToDatabase = async (receipt) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Format services from the structured phase-two payload
      const formattedServices = (phase2Data?.services || []).map(s => ({
        id: s.id,
        title: s.title || s.service_name,
        price: typeof s.price === 'string' ? parseFloat(s.price.replace('₱', '')) : s.price,
        duration: s.est_time || s.estTime,
        category: s.category,
      }));

      const walkInPayload = {
        name: receipt.name,
        contact: null,
        stylist: receipt.stylist,
        services: formattedServices,
        refNo: receipt.id,
      };

      console.log("[AddWalkIn] Logging walk-in to database:", walkInPayload);

      const response = await fetch(`${apiUrl}/appointments/create-walk-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(walkInPayload),
      });

      const responseText = await response.text();
      console.log("[AddWalkIn] DB response status:", response.status);

      if (!response.ok) {
        console.error("[AddWalkIn] Failed to log walk-in. Status:", response.status, "Details:", responseText);
      } else {
        console.log("[AddWalkIn] Walk-in successfully logged to database");
      }
    } catch (err) {
      console.error("[AddWalkIn] Error logging walk-in:", err);
    }
  };

  /* Handle final confirmation */
  const handleConfirmWalkin = () => {
    // Show confirmation toast immediately
    setShowConfirmationToast(true);
    setIsConfirmed(true);
  };

  /* Generate printable receipt */
  const handleDownloadReceipt = () => {
    // Show receipt reminder dialog
    setShowReceiptReminder(true);
    generateReceiptHTML();
  };

  /* Generate the receipt HTML and open print dialog */
  const generateReceiptHTML = () => {
    if (!receiptData) return;
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BeautyBook Pro - Walk-in Receipt</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { height: 100%; width: 100%; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5; 
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }
          .receipt { 
            max-width: 480px; 
            width: 100%;
            background: #ffffff; 
            padding: 32px 24px; 
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 32px; 
            border-bottom: 2px solid #dd901d;
            padding-bottom: 16px;
          }
          .logo { 
            font-size: 28px; 
            font-weight: 700; 
            color: #1a0f00; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .subtitle { 
            font-size: 12px; 
            color: #988f81;
            font-weight: 500;
          }
          .section { 
            margin-bottom: 24px; 
          }
          .section-title { 
            font-size: 10px; 
            font-weight: 700; 
            color: #dd901d; 
            text-transform: uppercase; 
            letter-spacing: 0.08em;
            margin-bottom: 12px;
          }
          .service-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            margin-bottom: 10px;
            font-size: 13px;
            color: #1a0f00;
            line-height: 1.4;
          }
          .service-name { 
            flex: 1; 
            margin-right: 8px;
          }
          .service-price { 
            font-weight: 600; 
            color: #dd901d;
            white-space: nowrap;
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            margin-bottom: 10px;
            color: #1a0f00;
            padding: 0;
          }
          .detail-label { 
            color: #988f81; 
            font-weight: 500;
            font-size: 12px;
          }
          .detail-value { 
            font-weight: 600;
            text-align: right;
            font-size: 13px;
          }
          .divider { 
            height: 1px; 
            background: rgba(26,15,0,0.15); 
            margin: 16px 0;
          }
          .total { 
            display: flex; 
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            font-weight: 700;
            color: #1a0f00;
            padding: 14px 0;
            border-top: 2px solid #dd901d;
            border-bottom: 2px solid #dd901d;
            margin: 16px 0;
          }
          .total-label { font-size: 15px; }
          .total-value { font-size: 18px; }
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
            margin-top: 28px;
            padding-top: 16px;
            border-top: 1px solid rgba(26,15,0,0.1);
            font-size: 11px;
            color: #988f81;
            line-height: 1.7;
          }
          .footer p { margin-bottom: 8px; }
          .footer-highlight { 
            color: #dd901d; 
            font-weight: 600;
            margin-top: 12px;
          }
          @media print {
            body { padding: 0; background: #fff; }
            .receipt { box-shadow: none; border-radius: 0; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">BeautyBook Pro</div>
            <div class="subtitle">Walk-in Receipt</div>
          </div>

          <div class="section">
            <div class="section-title">Services</div>
            ${receiptData.services.map(svc => `
              <div class="service-item">
                <span class="service-name">${svc.title || 'Service'}</span>
                <span class="service-price">${typeof svc.price === 'number' ? formatCurrency(svc.price) : (svc.price || '₱0.00')}</span>
              </div>
            `).join('')}
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Appointment Details</div>
            <div class="detail-row">
              <span class="detail-label">Duration</span>
              <span class="detail-value">${receiptData.totalDuration} mins</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Stylist</span>
              <span class="detail-value">${receiptData.stylist || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date & Time</span>
              <span class="detail-value">${receiptData.timestamp || 'N/A'}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Totals</div>
            <div class="detail-row">
              <span class="detail-label">Subtotal</span>
              <span class="detail-value">${formatCurrency(receiptData.subtotal)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount</span>
              <span class="detail-value">${receiptData.price || formatCurrency(receiptData.totalAmount)}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="detail-row">
              <span class="detail-label">Name</span>
              <span class="detail-value">${receiptData.name || 'N/A'}</span>
            </div>
          </div>

          <div class="total">
            <span class="total-label">Total Amount</span>
            <span class="total-value">${receiptData.price || '₱0.00'}</span>
          </div>

          <div class="ref-box">
            <span class="ref-label">Reference Number</span>
            <div class="ref-code">${receiptData.id || 'N/A'}</div>
          </div>

          <div class="footer">
            <p>Please keep this reference number for your records.</p>
            <p class="footer-highlight">Thank you for choosing BeautyBook Pro!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const handleConfirm = () => {
    handleConfirmWalkin();
    // After confirmation, the modal stays open for download
  };

  // Manage body class for modal open state - must be before conditional return
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return undefined;

    document.body.classList.add("walkin-modal-open");
    return () => {
      document.body.classList.remove("walkin-modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* ── Toast Notifications (Top Fixed Position) ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999999, pointerEvents: "auto", display: "flex", justifyContent: "center", padding: "20px" }}>
        <Toast 
          message="Walk-in Confirmed!" 
          type="success" 
          duration={2000} 
          isVisible={showConfirmationToast} 
        />
      </div>
      <div 
        className="appt-overlay walkin-force-dark"
        style={{
          ...DARK_MODAL_VARS,
          zIndex: 10000001,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        }}
        onClick={(e) => {
          // Only trigger if clicking directly on the overlay, not on child elements
          if (e.target === e.currentTarget) {
            if (!isConfirmed) {
              setShowConfirmCancel(true);
            } else if (isConfirmed && !showReceiptReminder) {
              setShowReceiptReminder(true);
            }
          }
        }}
      >
        <div className="appt-root">
          <ModalHeader onBack={handleBack} />
          <ProgressIndicator currentStep={step} steps={WALK_IN_STEPS} />

          <div className="appt-body">
            {/* Step 1: Customer Name */}
            {step === 1 && (
              <div className="appt-section-heading">
                <h2 className="appt-section-title">Customer Information</h2>
                <p className="appt-section-sub">Enter the walk-in customer name</p>
                <div className="walkin-name-group">
                  <label className="walkin-label">Full Name</label>
                  <input
                    type="text"
                    className={`walkin-input${nameError && nameTouched ? " error" : ""}`}
                    placeholder="Enter customer name"
                    value={walkInName}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    autoFocus
                    aria-invalid={!!(nameError && nameTouched)}
                    aria-describedby={nameError && nameTouched ? "name-error" : undefined}
                  />
                  {nameError && nameTouched && (
                    <p id="name-error" className="walkin-error">
                      ⚠️ {nameError}
                    </p>
                  )}
                  {!nameError && nameTouched && (
                    <p style={{ fontSize: "0.8rem", color: "#22c55e", margin: "4px 0 0 0", fontWeight: "500" }}>
                      ✓ Name is valid
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Service Selection (Using Phase 2 Component) */}
            {step === 2 && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column" }}>
                <AppointmentFormPhase2
                  onBack={handleBack}
                  onContinue={handlePhase2Continue}
                  onCancel={handleCancelClick}
                  initialData={null}
                  headerTitle="Add Walk-in"
                  stepLabels={WALK_IN_STEPS}
                  showPromoCode={false}
                />
              </div>
            )}

            {/* Step 3: Stylist Selection (Using Phase 3 Component) */}
            {step === 3 && phase2Data && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column" }}>
                <AppointmentFormPhase3
                  onBack={handleBack}
                  onContinue={handlePhase3Continue}
                  onCancel={handleCancelClick}
                  initialData={{ services: phase2Data?.services || [] }}
                  headerTitle="Add Walk-in"
                  stepLabels={WALK_IN_STEPS}
                />
              </div>
            )}

            {/* Step 4: Receipt */}
            {step === 4 && receiptData && (
              <div className="appt-section-heading">
                <p className="appt-section-title">Confirm Walk-in</p>
                <p className="appt-section-sub">Review appointment details</p>
                
                <div className="confirm-card">
                  {receiptData.services.length > 0 && (
                    <>
                      <div className="confirm-service-row">
                        <div className="confirm-service-left">
                          <div className="confirm-svc-icon">
                            <ScissorsIcon />
                          </div>
                          <div className="confirm-svc-text">
                            <span className="confirm-svc-name">{receiptData.services[0].title}</span>
                            <span className="confirm-svc-duration">{receiptData.totalDuration} mins</span>
                          </div>
                        </div>
                        <div className="confirm-svc-meta">
                          <span className="confirm-svc-price">{receiptData.price}</span>
                        </div>
                      </div>
                      <Divider />
                    </>
                  )}

                  {receiptData.services.length > 0 && (
                    <>
                      <div style={{ marginBottom: "16px", marginTop: "12px" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--color-tan)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "12px" }}>
                          Services Selected
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {receiptData.services.map((service, idx) => {
                            const servicePrice = typeof service.price === "number"
                              ? formatCurrency(service.price)
                              : (service.price || "₱0.00");
                            return (
                              <div key={idx} style={{ fontSize: "0.85rem", color: "var(--color-white)", paddingLeft: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>• {service.title}</span>
                                <span style={{ color: "var(--color-tan)" }}>{servicePrice}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <Divider />
                    </>
                  )}

                  <div className="confirm-details">
                    <div className="confirm-detail-row">
                      <PersonIcon />
                      <div className="confirm-detail-text">
                        <span className="confirm-detail-label">Name</span>
                        <span className="confirm-detail-value">{receiptData.name}</span>
                      </div>
                    </div>
                    <div className="confirm-detail-row">
                      <StylistIcon />
                      <div className="confirm-detail-text">
                        <span className="confirm-detail-label">Stylist</span>
                        <span className="confirm-detail-value">{receiptData.stylist}</span>
                      </div>
                    </div>
                    <div className="confirm-detail-row">
                      <EnvelopeIcon />
                      <div className="confirm-detail-text">
                        <span className="confirm-detail-label">Date & Time</span>
                        <span className="confirm-detail-value">{receiptData.timestamp}</span>
                      </div>
                    </div>
                    <div className="confirm-detail-row">
                      <DownloadIcon />
                      <div className="confirm-detail-text">
                        <span className="confirm-detail-label">Duration</span>
                        <span className="confirm-detail-value">{receiptData.totalDuration} mins</span>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div className="confirm-details">
                    <div className="confirm-detail-row">
                      <span className="confirm-detail-label">Subtotal</span>
                      <span className="confirm-detail-value">{formatCurrency(receiptData.subtotal)}</span>
                    </div>
                    <div className="confirm-detail-row">
                      <span className="confirm-detail-label">Total Amount</span>
                      <span className="confirm-detail-value">{receiptData.price}</span>
                    </div>
                  </div>

                  <Divider />

                  {/* Bottom: ref no. + reminder */}
                  <div className="confirm-bottom-row">
                    <div className="confirm-ref-pill">
                      Ref. No.: {receiptData.id}
                    </div>
  
                  </div>
                </div>
              </div>
            )}
          </div>

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
            {/* Only show footer buttons for Step 1 and Step 4 */}
            {step === 1 && (
              <>
                <button 
                  className="appt-cancel-btn"
                  onClick={handleCancelClick}
                  title="Cancel and close"
                  style={{flex: 1}}
                >
                  Cancel
                </button>
                <button 
                  className="appt-continue-btn" 
                  onClick={handleContinue}
                  disabled={!!nameError || !walkInName.trim()}
                  style={(!!nameError || !walkInName.trim()) ? { opacity: 0.5, cursor: "not-allowed", flex: 1 } : { opacity: 1, flex: 1 }}
                  title={nameError || "Continue to service selection"}
                >
                  Continue
                </button>
              </>
            )}
            {step === 4 && !isConfirmed && (
              <button 
                className="appt-continue-btn" 
                onClick={handleConfirm}
                style={{flex: 1, cursor: "pointer"}}
              >
                Confirm
              </button>
            )}
            {step === 4 && isConfirmed && (
              <button 
                className="appt-download-receipt-btn"
                onClick={handleDownloadReceipt}
                style={{flex: 1, cursor: "pointer", padding: "12px", fontSize: "16px", fontWeight: "600"}}
              >
                <DownloadIcon />
                Download Receipt
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmCancel}
        title="Cancel Walk-in?"
        message="Are you sure you want to cancel? Your progress will be lost."
        confirmText="Yes, Cancel Walk-in"
        cancelText="Keep Going"
        onConfirm={() => {
          setShowConfirmCancel(false);
          handleClose();
        }}
        onCancel={() => setShowConfirmCancel(false)}
      />

      {/* Receipt Reminder Confirmation Dialog - Only show if walk-in was confirmed */}
      {isConfirmed && (
        <ConfirmationDialog
          isOpen={showReceiptReminder}
          title="Save Your Walk-in Info"
          message={`Have you saved your receipt and reference number?\n\nReference No.: ${receiptData?.id || "N/A"}\n\nYou'll need this for check-in.`}
          confirmText="Yes, Saved"
          cancelText="Download Again"
          onConfirm={() => {
            setShowReceiptReminder(false);
            handleClose();
          }}
          onCancel={() => {
            setShowReceiptReminder(false);
            generateReceiptHTML();
            // Reopen the dialog after a brief delay so user can download again
            setTimeout(() => {
              setShowReceiptReminder(true);
            }, 100);
          }}
        />
      )}
    </>,
    document.body
  );
};
