import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Toast } from "../../../toast";
import { DynamicServiceModal } from "./services/dynamic_service";
import { ConfirmationDialog } from "../confirmation_dialog";
import { couponService } from "../../../../services/couponService";

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

const BOOKING_MODAL_THEME_STYLE_ID = "booking-modal-theme-phase-two";

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
  html[data-theme="light"] .booking-modal-theme .appt-continue-btn {
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
  }

  .booking-modal-theme .appt-back-btn,
  .booking-modal-theme .appt-header-title,
  .booking-modal-theme .appt-section-title,
  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .appt-step-label,
  .booking-modal-theme .appt-svc-title,
  .booking-modal-theme .appt-svc-desc,
  .booking-modal-theme .appt-svc-card,
  .booking-modal-theme .cdb-label,
  .booking-modal-theme label {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .appt-svc-desc {
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

  .booking-modal-theme .appt-svc-card {
    background: #11100d !important;
    border: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  .booking-modal-theme .appt-svc-card.selected {
    background: rgba(221, 144, 29, 0.14) !important;
    border-color: rgba(221, 144, 29, 0.55) !important;
    box-shadow: 0 0 0 1px rgba(221, 144, 29, 0.15) inset !important;
  }

  .booking-modal-theme .appt-svc-card:hover:not(.selected) {
    border-color: rgba(221, 144, 29, 0.35) !important;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.24) !important;
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

  .booking-modal-theme .appt-continue-btn {
    background: #dd901d !important;
    color: #1a0f00 !important;
  }

  .booking-modal-theme .appt-continue-btn:hover:not(:disabled) {
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

  .booking-modal-theme [role="listbox"] {
    background: #14110e !important;
    border-color: rgba(221, 144, 29, 0.6) !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme [role="option"] {
    color: #f5f1eb !important;
  }

  .booking-modal-theme [role="option"]:hover {
    background: rgba(221, 144, 29, 0.12) !important;
  }

}
`;

/* Hair Services — broom/brush icon */
const HairIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    <path d="M6 3c0 0 1 4 1 8s-1 6-1 6" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M10 3c0 0 1 4 1 8s-1 6-1 6" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M14 3c0 0 1 4 1 8s-1 6-1 6" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M5 11h11" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round"/>
    <rect x="5" y="17" width="10" height="4" rx="1" fill="#1a0f00"/>
  </svg>
);

/* Nail Services — polish bottle */
const NailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    <rect x="8" y="10" width="8" height="11" rx="2" stroke="#1a0f00" strokeWidth="1.7" fill="none"/>
    <rect x="10" y="6"  width="4" height="4" rx="0.5" stroke="#1a0f00" strokeWidth="1.5" fill="none"/>
    <rect x="9"  y="3"  width="6" height="3.5" rx="1.5" fill="#1a0f00" fillOpacity="0.6"/>
    <line x1="11" y1="12.5" x2="11" y2="18.5" stroke="#1a0f00" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

/* Skincare — face with sparkles */
const SkincareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    <circle cx="12" cy="13" r="7.5" stroke="#1a0f00" strokeWidth="1.6" fill="none"/>
    <circle cx="9.5"  cy="11.5" r="1" fill="#1a0f00"/>
    <circle cx="14.5" cy="11.5" r="1" fill="#1a0f00"/>
    <path d="M9.5 16 Q12 18 14.5 16" stroke="#1a0f00" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* sparkles top */}
    <path d="M12 3v2M10.5 4.5l1 1M13.5 4.5l-1 1" stroke="#1a0f00" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

/* Massage — hands / wave */
const MassageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    <path d="M4 14 Q7 10 12 12 Q17 14 20 10" stroke="#1a0f00" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    <path d="M4 18 Q7 14 12 16 Q17 18 20 14" stroke="#1a0f00" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    <path d="M6 8 Q8 5 10 8 Q12 11 14 8 Q16 5 18 8" stroke="#1a0f00" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Premium Services — diamond */
const PremiumIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    <path d="M12 20L3 9h18L12 20z" stroke="#1a0f00" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
    <path d="M3 9l3-5h12l3 5" stroke="#1a0f00" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
    <path d="M9 4L7 9l5 11M15 4l2 5-5 11" stroke="#1a0f00" strokeWidth="1" opacity="0.5"/>
    <line x1="3" y1="9" x2="21" y2="9" stroke="#1a0f00" strokeWidth="1.3"/>
  </svg>
);

// Service grouping configuration - maps database categories to service groups
const SERVICE_GROUP_CONFIG = {
  'Hair Services': {
    keywords: ['Hair Color', 'Hair Cut', 'Highlights', 'Rebonding', 'Styling', 'Hair Treatment'],
    Icon: HairIcon,
    desc: "Haircuts, Hair Styling, Hair Color, & Hair Treatment"
  },
  'Nail Services': {
    keywords: ['Nail Care', 'Manicure', 'Pedicure', 'Nail Art'],
    Icon: NailIcon,
    desc: "Manicure, pedicure & nail art"
  },
  'Skin Care Services': {
    keywords: ['Treatment', 'Skincare', 'Skin Care', 'Facial'],
    Icon: SkincareIcon,
    desc: "Facials, treatments & body care"
  },
  'Massage Services': {
    keywords: ['Massage', 'Massage Services'],
    Icon: MassageIcon,
    desc: "Relaxation & therapeutic bodywork"
  },
  'Premium Services': {
    keywords: ['Premium Services', 'Premium', 'Other'],
    Icon: PremiumIcon,
    desc: "Exclusive packages & VIP experiences"
  },
};

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

/* ── Header ── */
const BookingHeader = ({ onBack, title = "Book Appointment" }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack}>
      <svg viewBox="0 0 16 16" fill="none" width={16} height={16}>
        <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </button>
    <h1 className="appt-header-title">{title}</h1>
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress bar — phase 2 state ── */
const ProgressIndicator = ({ currentStep = 2, steps = STEPS }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {steps.map((step, i) => {
        const isCompleted = step.number < currentStep;
        const isActive    = step.number === currentStep;
        return (
          <div key={step.number} className="appt-progress-item">
            <div className={`appt-step-circle${isActive ? " active" : isCompleted ? " done" : ""}`}>
              {isCompleted
                ? <svg viewBox="0 0 12 12" fill="none" width={13} height={13}>
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                : step.number
              }
            </div>
            {i < steps.length - 1 && (
              <div className={`appt-step-line${isCompleted ? " done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {steps.map((step) => {
        const isCompleted = step.number < currentStep;
        const isActive    = step.number === currentStep;
        return (
          <span
            key={step.number}
            className={`appt-step-label${isActive ? " active" : isCompleted ? " done" : ""}`}
          >
            {step.label}
          </span>
        );
      })}
    </div>
  </div>
);

/* ── Service card ── */
const ServiceCard = ({ service, isSelected, onSelect, onOpenServiceModal, selectedServicesCount = 0 }) => (
  <button
    className={`appt-svc-card${isSelected ? " selected" : ""}`}
    onClick={() => onOpenServiceModal(service.id)}
    aria-pressed={isSelected}
    style={{
      transition: "all 0.3s ease",
      position: "relative",
    }}
    onMouseEnter={(e) => {
      if (!isSelected) {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
      }
    }}
    onMouseLeave={(e) => {
      if (!isSelected) {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }
    }}
  >
    <p className="appt-svc-title">{service.title}</p>
    <p className="appt-svc-desc">{service.desc}</p>
    
    {/* Service count badge */}
    {isSelected && selectedServicesCount > 0 && (
      <div style={{
        position: "absolute",
        top: "8px",
        right: "8px",
        background: "var(--color-amber)",
        color: "var(--color-black)",
        borderRadius: "50%",
        width: "28px",
        height: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.85rem",
        fontWeight: "700",
        fontFamily: "Inter, sans-serif",
      }}>
        {selectedServicesCount}
      </div>
    )}
  </button>
);

export const AppointmentFormPhase2 = ({ onBack, onContinue, onCancel, initialData, headerTitle = "Book Appointment", stepLabels = STEPS, showPromoCode = true, isWalkIn = false }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  
  // Dynamic modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [currentModalCategory, setCurrentModalCategory] = useState(null);
  const [currentModalKeywords, setCurrentModalKeywords] = useState([]);
  
  // Store selected services by service card ID
  const [selectedServicesByCard, setSelectedServicesByCard] = useState({
    1: [], // Hair Services
    2: [], // Nail Services
    3: [], // Skin Care Services
    4: [], // Massage Services
    5: [], // Premium Services
  });
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const cancelDialogConfig = isWalkIn
    ? {
        title: "Cancel Walk-in?",
        message: "Are you sure you want to cancel? Your walk-in progress will be lost.",
        confirmText: "Yes, Cancel Walk-in",
        cancelText: "Keep Going",
      }
    : {
        title: "Cancel Booking?",
        message: "Are you sure you want to cancel? Your booking progress will be lost.",
        confirmText: "Yes, Cancel Booking",
        cancelText: "Keep Booking",
      };
  const [sortedServices, setSortedServices] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [dynamicCategoryKeywordsMap, setDynamicCategoryKeywordsMap] = useState({});
  const promoCodeRef = useRef(null);
  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(BOOKING_MODAL_THEME_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BOOKING_MODAL_THEME_STYLE_ID;
    style.textContent = BOOKING_MODAL_THEME_CSS;
    document.head.appendChild(style);
  }, []);

  // Coupon state
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponsLoading, setCouponsLoading] = useState(false);

  const getCouponValue = (coupon) => String(coupon?.code || coupon?.id || '');
  const findCouponByValue = (value) => {
    if (!value) return null;
    const normalizedValue = String(value);
    return coupons.find((coupon) => {
      const couponCode = String(coupon?.code || '');
      const couponId = String(coupon?.id || '');
      return couponCode === normalizedValue || couponId === normalizedValue;
    }) || null;
  };

  // Inject scoped scrollbar styling once
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('booking-scrollbar-style')) return;
    const style = document.createElement('style');
    style.id = 'booking-scrollbar-style';
    style.textContent = `
      .appt-backdrop .appt-body::-webkit-scrollbar { width: 10px !important; }
      .appt-backdrop .appt-body::-webkit-scrollbar-thumb { background: rgba(221, 144, 29, 0.8) !important; border-radius: 10px !important; }
      .appt-backdrop .appt-body::-webkit-scrollbar-thumb:hover { background: rgba(221, 144, 29, 1) !important; }
      .appt-backdrop .appt-body::-webkit-scrollbar-track { background: rgba(19, 19, 19, 0.4) !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const getCustomerIdFromStorage = () => {
    try {
      const raw = localStorage.getItem('customerProfileData') || localStorage.getItem('operator_user') || localStorage.getItem('customer') || null;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.id || parsed?.customerId || null;
    } catch (err) {
      return null;
    }
  };

  // Fetch claimed (customer) coupons
  useEffect(() => {
    if (!showPromoCode) return;
    const fetchCoupons = async () => {
      const customerId = getCustomerIdFromStorage();
      if (!customerId) return;
      setCouponsLoading(true);
      try {
        let data = await couponService.getAllCouponsWithStatus(customerId);
        // If service returned empty, fallback to customer-scoped endpoint
        if ((!data || data.length === 0)) {
          try {
            data = await couponService.getCustomerCoupons();
          } catch (e) {
            // ignore fallback error
          }
        }
        const now = new Date();
        const claimed = (data || []).filter(c => (c.claimed || c.isClaimed || c.is_claimed || c.status === 'claimed') && (!c.expiration && !c.end_date || new Date(c.expiration || c.end_date) > now));
        setCoupons(claimed);
      } catch (err) {
        console.error('Failed to load customer coupons', err);
        setCoupons([]);
      } finally {
        setCouponsLoading(false);
      }
    };
    fetchCoupons();
  }, [showPromoCode]);

  const formatCouponDisplay = (c) => {
    if (!c) return '';
    const code = c.code || c.id || '';
    const desc = c.description || '';
    const rawValue = c.value ?? c.discount ?? c.discount_amount ?? c.amount ?? '';
    const rawType = String(c.value_type || c.discount_type || '').toLowerCase();
    const numericValue = String(rawValue).replace(/[^0-9.]/g, '');
    const isPercent = rawType.includes('percent') || rawType.includes('percentage') || String(rawValue).includes('%');
    const discountText = numericValue
      ? isPercent
        ? `${numericValue}% off`
        : `₱${Number(numericValue).toFixed(2)} off`
      : '';
    const expDateValue = c.expiration || c.end_date;
    const exp = expDateValue ? new Date(expDateValue).toLocaleDateString() : 'No expiry';
    const parts = [code, desc, discountText ? `(${discountText})` : null, `Expires ${exp}`].filter(Boolean);
    return parts.join(' - ');
  };

  const CouponDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const onDocClick = (e) => {
        if (!containerRef.current) return;
        if (!containerRef.current.contains(e.target)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const restorePromoPadding = () => {
      try {
        if (promoCodeRef?.current) {
          promoCodeRef.current.style.paddingBottom = '8px';
        }
      } catch (e) { /* ignore */ }
    };

    const handleSelect = (val, couponObj) => {
      onChange?.(val || '', couponObj || null);
      setOpen(false);
      restorePromoPadding();
    };

    const selectedObj = findCouponByValue(value);
    const displayLabel = selectedObj ? formatCouponDisplay(selectedObj) : (value || 'No coupon');

    return (
      <div style={{ position: 'relative' }} ref={containerRef}>
        <button
          type="button"
          onClick={() => {
            const next = !open;
            setOpen(next);
            try {
              if (promoCodeRef?.current) {
                // When opening, add extra bottom padding so dropdown has room above footer
                promoCodeRef.current.style.paddingBottom = next ? '200px' : '8px';
                if (next) {
                  setTimeout(() => {
                    try {
                      promoCodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    } catch (e) {}
                  }, 80);
                }
              }
            } catch (e) {}
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '12px 14px',
            border: '1.5px solid #dd901d',
            borderRadius: 10,
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#f5f1eb',
            backgroundColor: '#14110e',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), 0 6px 18px rgba(0,0,0,0.18)',
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%' }}>{displayLabel}</span>
          <span style={{ float: 'right', opacity: 0.9 }}>{open ? '▴' : '▾'}</span>
        </button>

        {open && (
          <div
            role="listbox"
            tabIndex={-1}
            style={{
              position: 'absolute',
              zIndex: 10002,
              marginTop: 8,
              width: '100%',
              maxHeight: 160,
              overflowY: 'auto',
              background: '#14110e',
              border: '1.5px solid #dd901d',
              borderRadius: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}
          >
            <div
              role="option"
              onClick={() => handleSelect('', null)}
              style={{ padding: '10px 12px', cursor: 'pointer', color: '#f5f1eb', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
            >
              No coupon
            </div>
            {couponsLoading && (
              <div style={{ padding: '10px 12px', color: '#cfcfcf' }}>Loading...</div>
            )}
            {coupons.map((c) => {
              const isUsed = Boolean(c?.used || c?.customerCoupon?.used);
              return (
                <div
                  key={c.id}
                  role="option"
                  onClick={() => { if (!isUsed) handleSelect(getCouponValue(c), c); }}
                  style={{
                    padding: '10px 12px',
                    cursor: isUsed ? 'not-allowed' : 'pointer',
                    color: isUsed ? '#777' : '#f5f1eb',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{formatCouponDisplay(c)}</span>
                  {isUsed && <span style={{ fontSize: '0.8rem', color: '#cfcfcf' }}>(used)</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Fetch categories dynamically and generate service cards
  useEffect(() => {
    const fetchAndGenerateServiceCards = async () => {
      try {
        console.log('[Phase2] Fetching service categories from API');
        setCategoriesLoading(true);
        
        const response = await fetch('/api/services/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[Phase2] Service categories fetched:', data.categories);
        
        if (!data.categories || data.categories.length === 0) {
          console.log('[Phase2] No categories returned');
          setSortedServices([]);
          setCategoriesLoading(false);
          return;
        }
        
        // Create a card for each unique database category
        let generatedServiceCards = data.categories.map((category, index) => ({
          id: index + 1,
          title: category.name,
          desc: category.description || `Services in ${category.name}`,
          Icon: HairIcon, // Default icon, you can customize per category later
          keywords: [category.name] // Each card filters by its own category name
        }));
        
        // Move 'Other' category to the end
        const otherIndex = generatedServiceCards.findIndex(card => card.title === 'Other');
        if (otherIndex > -1) {
          const [otherCard] = generatedServiceCards.splice(otherIndex, 1);
          generatedServiceCards.push(otherCard);
        }
        
        // Reassign IDs after reordering
        generatedServiceCards = generatedServiceCards.map((card, index) => ({
          ...card,
          id: index + 1
        }));
        
        console.log('[Phase2] Generated service cards:', generatedServiceCards.map(s => ({ id: s.id, title: s.title })));
        
        // Build dynamic categoryKeywordsMap for the modal
        const newCategoryKeywordsMap = {};
        generatedServiceCards.forEach(card => {
          newCategoryKeywordsMap[card.id] = {
            name: card.title,
            keywords: card.keywords
          };
        });
        
        setDynamicCategoryKeywordsMap(newCategoryKeywordsMap);
        setSortedServices(generatedServiceCards);
      } catch (err) {
        console.error('[Phase2] Error fetching service categories:', err);
        setSortedServices([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchAndGenerateServiceCards();
  }, []);

  // Initialize state with previously selected services when component mounts or initialData changes
  useEffect(() => {
    if (initialData?.services) {
      const serviceIds = initialData.services.map(s => s.id);
      setSelectedServices(serviceIds);
    }
    if (initialData?.selectedServicesByCard) {
      setSelectedServicesByCard(initialData.selectedServicesByCard);
    }
    if (initialData?.promoCode) {
      setPromoCode(initialData.promoCode);
    }
    if (initialData?.appliedCoupon) {
      setSelectedCoupon(initialData.appliedCoupon);
      setPromoCode(getCouponValue(initialData.appliedCoupon));
    }
  }, [initialData]);

  useEffect(() => {
    if (!promoCode) {
      setSelectedCoupon(null);
      return;
    }

    const couponObj = findCouponByValue(promoCode);
    if (couponObj) {
      setSelectedCoupon(couponObj);
    }
  }, [promoCode, coupons]);

  // Scroll to promo code section when a service is selected
  useEffect(() => {
    if (selectedServices.length > 0 && promoCodeRef.current) {
      setTimeout(() => {
        promoCodeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [selectedServices]);

  const handleExitRequest = () => {
    if (isWalkIn) {
      onCancel?.();
      return;
    }

    setShowBackdropConfirm(true);
  };

  const handleBack = () => {
    onBack?.();
  };

  const handleCancelClick = () => {
    if (isWalkIn) {
      onCancel?.();
      return;
    }

    setShowCancelConfirm(true);
  };

  const openServiceModal = (serviceCardId) => {
    const categoryInfo = dynamicCategoryKeywordsMap[serviceCardId];
    if (categoryInfo) {
      setCurrentModalCategory(categoryInfo.name);
      setCurrentModalKeywords(categoryInfo.keywords);
      setShowServiceModal(true);
    }
  };

  const handleServiceModalContinue = (serviceCardId) => (data) => {
    console.log(`[Phase2] Service modal closed for card ${serviceCardId}:`, data);
    
    // Update selected services for this card
    setSelectedServicesByCard(prev => ({
      ...prev,
      [serviceCardId]: data.services
    }));
    
    // Update overall selected services
    const cardIdNum = Number(serviceCardId);
    if (data.services.length > 0) {
      if (!selectedServices.includes(cardIdNum)) {
        setSelectedServices([...selectedServices, cardIdNum]);
      }
    } else {
      setSelectedServices(selectedServices.filter(id => id !== cardIdNum));
    }
    
    setShowServiceModal(false);
  };

  const handleSelectService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleContinue = () => {
    // Collect all actual services from selectedServicesByCard
    const allSelectedServices = [];
    Object.values(selectedServicesByCard).forEach(services => {
      if (Array.isArray(services)) {
        allSelectedServices.push(...services);
      }
    });

    console.log('[Phase2] handleContinue - collected services:', allSelectedServices);
    // Show confirmation toast
    setToastState({ message: `${allSelectedServices.length} service(s) selected`, type: 'success', isVisible: true });

    onContinue?.({ 
      services: allSelectedServices, 
      selectedServicesByCard, 
      promoCode,
      appliedCoupon: selectedCoupon || null,
    });
  };

  // Toast state
  const [toastState, setToastState] = useState({ message: '', type: 'info', isVisible: false, duration: 3000 });

  // No need for separate modal handlers anymore - just render the dynamic modal

  if (showServiceModal) {
    // Find the card ID from currentModalCategory
    const cardId = Object.keys(dynamicCategoryKeywordsMap).find(
      key => dynamicCategoryKeywordsMap[key].name === currentModalCategory
    );
    
    return (
      <DynamicServiceModal
        categoryName={currentModalCategory}
        categoryKeywords={currentModalKeywords}
        onBack={() => setShowServiceModal(false)}
        onContinue={handleServiceModalContinue(cardId)}
        initialSelected={currentModalCategory && cardId ? selectedServicesByCard[cardId]?.map(s => s.id) || [] : []}
        isUpdating={false}
      />
    );
  }

  return (
    <>
      <Toast message={toastState.message} type={toastState.type} isVisible={toastState.isVisible} duration={toastState.duration} />
      {createPortal(
        <div 
          className={`appt-backdrop ${BOOKING_MODAL_THEME_CLASS} booking-phase-two-modal`}
          data-theme="dark"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleExitRequest();
            }
          }}
          style={{
            ...BOOKING_MODAL_THEME_VARS,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000010,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            pointerEvents: 'auto'
          }}
        >
        <div className="appt-root" onClick={(e) => e.stopPropagation()} style={{ ...BOOKING_MODAL_THEME_VARS, pointerEvents: 'auto' }}>
          <BookingHeader onBack={handleBack} title={headerTitle} />
          <ProgressIndicator currentStep={2} steps={stepLabels} />

      {/* ── Scrollable body ── */}
      <div className="appt-body">
        <div className="appt-section-heading">
          <p className="appt-section-title" style={{ animation: "fade-up 0.5s ease forwards" }}>Choose a service</p>
          <p className="appt-section-sub" style={{ animation: "fade-up 0.6s ease 0.1s forwards", opacity: 0 }}>Select a service you&apos;d like to book</p>
        </div>

        {/* 3-col top row + 2-col bottom row */}
        <div className="appt-svc-grid">
          {sortedServices.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              isSelected={selectedServices.includes(svc.id)}
              onSelect={handleSelectService}
              onOpenServiceModal={openServiceModal}
              selectedServicesCount={selectedServicesByCard[svc.id]?.length || 0}
            />
          ))}
        </div>

        {showPromoCode && (
          <div ref={promoCodeRef} style={{ marginTop: "24px", paddingTop: "20px", paddingBottom: "18px", borderTop: "1px solid #e5e5e5" }}>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px",
              fontFamily: "Inter, sans-serif",
            }}>
              Coupon <span style={{ color: "#999", fontWeight: "400" }}>(Optional)</span>
            </label>
            <CouponDropdown
              value={selectedCoupon ? getCouponValue(selectedCoupon) : promoCode}
              onChange={(id, couponObj) => {
                setPromoCode(id || '');
                // store selected coupon object for later phases
                setSelectedCoupon(couponObj || null);
              }}
            />
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="appt-footer">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          {selectedServices.length < 1 && (
            <p style={{
              color: "#ff6b6b",
              fontSize: "0.85rem",
              margin: 0,
              textAlign: "center",
              fontWeight: "500",
            }}>
              Please select a service
            </p>
          )}

          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <button
              onClick={handleCancelClick}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "transparent",
                color: "#dd901d",
                border: "1.5px solid #dd901d",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(221,144,29,0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              Cancel
            </button>
            <button
              className="appt-continue-btn"
              onClick={handleContinue}
              disabled={selectedServices.length < 1}
              style={{
                flex: 1,
                opacity: selectedServices.length >= 1 ? 1 : 0.5,
                cursor: selectedServices.length >= 1 ? "pointer" : "not-allowed",
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
      </div>,
      document.body
    )}

      {/* Cancel Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showBackdropConfirm}
        title={cancelDialogConfig.title}
        message={cancelDialogConfig.message}
        confirmText={cancelDialogConfig.confirmText}
        cancelText={cancelDialogConfig.cancelText}
        onConfirm={() => {
          setShowBackdropConfirm(false);
          onCancel?.();
        }}
        onCancel={() => setShowBackdropConfirm(false)}
      />
      <ConfirmationDialog
        isOpen={showCancelConfirm}
        title={cancelDialogConfig.title}
        message={cancelDialogConfig.message}
        confirmText={cancelDialogConfig.confirmText}
        cancelText={cancelDialogConfig.cancelText}
        onConfirm={() => {
          setShowCancelConfirm(false);
          onCancel?.();
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
};

export default AppointmentFormPhase2;