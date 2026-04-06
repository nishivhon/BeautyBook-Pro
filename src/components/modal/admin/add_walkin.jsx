import { useState } from "react";
import { ConfirmationDialog } from "../customer/confirmation_dialog";

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

/* Icon mapping based on category ID */
const getIconForCategory = (categoryId) => {
  const iconMap = {
    hair: HairIcon,
    nail: NailIcon,
    skincare: SkincareIcon,
    massage: MassageIcon,
    premium: PremiumIcon,
  };
  return iconMap[categoryId] || null;
};

const STEPS = [
  { number: 1, label: "Name" },
  { number: 2, label: "Service" },
  { number: 3, label: "Stylist" },
  { number: 4, label: "Receipt" },
];

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
const ProgressIndicator = ({ currentStep }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {STEPS.map((step, i) => {
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
            {i < STEPS.length - 1 && (
              <div className={`appt-step-line${isDone ? " done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {STEPS.map((step) => (
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

/* ── Category Card ── */
const CategoryCard = ({ category, selectedCount = 0, onSelect }) => {
  const IconComponent = getIconForCategory(category.id);
  
  return (
    <button
      className={`appt-svc-card${selectedCount > 0 ? " selected" : ""}`}
      onClick={() => onSelect(category.id)}
      aria-pressed={selectedCount > 0}
      style={{
        transition: "all 0.3s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (selectedCount === 0) {
          e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
          const iconCircle = e.currentTarget.querySelector('.appt-svc-icon-circle');
          if (iconCircle) {
            iconCircle.style.transform = "scale(1.1) rotate(5deg)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (selectedCount === 0) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          const iconCircle = e.currentTarget.querySelector('.appt-svc-icon-circle');
          if (iconCircle) {
            iconCircle.style.transform = "scale(1) rotate(0deg)";
          }
        }
      }}
    >
      {IconComponent && (
        <div className="appt-svc-icon-circle" style={{transition: "all 0.3s ease"}}>
          <IconComponent />
        </div>
      )}
      <p className="appt-svc-title">{category.label}</p>
      
      {selectedCount > 0 && (
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
          {selectedCount}
        </div>
      )}
    </button>
  );
};

/* ── Service Selection Modal (nested) ── */
const ServiceSelectionModal = ({ isOpen, categoryId, categoryLabel, services, selectedServices, onSelect, onClose, isUpdating = false, onCloseWholeModal }) => {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  if (!isOpen) return null;

  const categoryServices = services.filter(s => s.category === categoryId);
  const categoryServiceIds = categoryServices.map(s => s.id);
  const selectedInCategory = selectedServices.filter(id => categoryServiceIds.includes(id));

  const ServiceRow = ({ service, isSelected }) => (
    <button
      className={`svc-list-row${isSelected ? " selected" : ""}`}
      onClick={() => onSelect(service.id)}
      aria-pressed={isSelected}
    >
      <div className="svc-list-left">
        <div className="svc-list-icon-box">
          <ScissorsIcon />
        </div>
        <div className="svc-list-text">
          <span className="svc-list-title">{service.title}</span>
          <span className="svc-list-desc">{service.desc}</span>
        </div>
      </div>

      <div className="svc-list-right">
        <span className="svc-list-price">{service.price}</span>
        <span className="svc-list-est">{service.estTime}</span>
      </div>
    </button>
  );

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    onCloseWholeModal();
  };

  return (
    <>
      <div 
        className="appt-overlay" 
        style={{ zIndex: 1100 }}
        onClick={(e) => {
          // Only trigger if clicking directly on the overlay, not on child elements
          if (e.target === e.currentTarget) {
            handleCancelClick();
          }
        }}
      >
        <div className="appt-root" style={{ maxHeight: "80vh" }}>
          <header className="appt-header">
            <button className="appt-back-btn" onClick={onClose} aria-label="Go back">
              <BackArrowIcon />
              Back
            </button>
            <h1 className="appt-header-title">{categoryLabel}</h1>
            <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
          </header>

          <div className="appt-body">
            <div className="appt-section-heading">
              <h2 className="appt-section-title">Choose a service</h2>
              <p className="appt-section-sub">Select a service you'd like to book</p>
              <div className="svc-list">
                {categoryServices.length > 0 ? (
                  categoryServices.map((service) => (
                    <ServiceRow
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.includes(service.id)}
                    />
                  ))
                ) : (
                  <p style={{ textAlign: "center", color: "var(--color-tan)", padding: "20px" }}>
                    No services available
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="appt-footer">
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedInCategory.length === 0 && !isUpdating && (
                <p className="service-error"> Please select at least one service</p>
              )}
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="appt-cancel-btn" onClick={handleCancelClick}>
                  Cancel
                </button>
                <button 
                  className="appt-continue-btn"
                  onClick={onClose}
                  disabled={selectedInCategory.length === 0 && !isUpdating}
                  style={{
                    opacity: selectedInCategory.length > 0 || isUpdating ? 1 : 0.5,
                    cursor: selectedInCategory.length > 0 || isUpdating ? "pointer" : "not-allowed",
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog for Service Modal */}
      <ConfirmationDialog
        isOpen={showConfirmCancel}
        title="Cancel Walk-in?"
        message="Are you sure you want to cancel? Your progress will be lost."
        confirmText="Yes, Cancel Walk-in"
        cancelText="Keep Going"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirmCancel(false)}
      />
    </>
  );
};

/* ── "Any available" row ── */
const AnyRow = ({ isSelected, onSelect }) => (
  <button
    className={`stylist-row${isSelected ? " selected" : ""}`}
    onClick={() => onSelect(isSelected ? null : "any")}
    aria-pressed={isSelected}
  >
    <div className="stylist-row-left">
      {/* amber circle with person icon */}
      <div className="stylist-avatar">
        <PersonIcon />
      </div>
      <div className="stylist-text">
        <span className="stylist-name">Any available stylist</span>
        <span className="stylist-specialty">First available stylist will be assigned</span>
      </div>
    </div>
    {/* no rating column for "any" row */}
  </button>
);

/* ── Named stylist row ── */
const StylistRow = ({ stylist, isSelected, onSelect }) => (
  <button
    className={`stylist-row${isSelected ? " selected" : ""}${stylist.unavailable ? " unavailable" : ""}`}
    onClick={() => !stylist.unavailable && onSelect(isSelected ? null : stylist.id)}
    disabled={stylist.unavailable}
    aria-pressed={isSelected}
    aria-disabled={stylist.unavailable}
  >
    <div className="stylist-row-left">
      {/* initial avatar circle */}
      <div className={`stylist-avatar${stylist.unavailable ? " muted" : ""}`}>
        <span className="stylist-initial">{stylist.initial}</span>
      </div>
      <div className="stylist-text">
        <span className={`stylist-name${stylist.unavailable ? " muted" : ""}`}>{stylist.name}</span>
        <span className={`stylist-specialty${stylist.unavailable ? " muted" : ""}`}>{stylist.specialty}</span>
      </div>
    </div>

    {/* right: rating + reviews + unavailable badge */}
    <div className="stylist-rating-col">
      <div className="stylist-rating-row">
        <StarIcon muted={stylist.unavailable} />
        <span className={`stylist-rating${stylist.unavailable ? " muted" : ""}`}>{stylist.rating}</span>
      </div>
      <span className={`stylist-reviews${stylist.unavailable ? " muted" : ""}`}>{stylist.reviews}</span>
      {stylist.unavailable && <span className="stylist-unavailable-tag">Unavailable</span>}
    </div>
  </button>
);

/* ── Thin divider ── */
const Divider = () => (
  <div style={{ width: "100%", height: 1, background: "rgba(152,143,129,0.25)", flexShrink: 0 }} />
);

export const AddWalkInModal = ({ isOpen, onClose, onSubmit, servicesList: propsServicesList, serviceCategories: propsServiceCategories, stylistsList: propsStylistsList }) => {
  // Default service data if not provided via props
  const SERVICES_LIST = propsServicesList || [
    // Hair Services (4)
    { id: 1, title: "Hair cuts",      desc: "Classic Haircut with Styling", category: "hair", price: "₱00.00", estTime: "est time" },
    { id: 2, title: "Hair color",     desc: "Full hair color service", category: "hair", price: "₱00.00", estTime: "est time" },
    { id: 3, title: "Hair treatment", desc: "Full hair color service", category: "hair", price: "₱00.00", estTime: "est time" },
    { id: 4, title: "Beard trimming", desc: "Trim and beard shaping", category: "hair", price: "₱00.00", estTime: "est time" },
    // Nail Services (4)
    { id: 5, title: "Manicure",          desc: "Care & beautification for fingernails", category: "nail", price: "₱00.00", estTime: "est time" },
    { id: 6, title: "Pedicure",          desc: "Care & beautification for toenails",    category: "nail", price: "₱00.00", estTime: "est time" },
    { id: 7, title: "Nail enhancement",  desc: "Artificial nail application",           category: "nail", price: "₱00.00", estTime: "est time" },
    { id: 8, title: "Nail art & design", desc: "Arts & Design for nails",               category: "nail", price: "₱00.00", estTime: "est time" },
    // Skincare Services (4)
    { id: 9, title: "Facial treatment",   desc: "Care & beautification for face & skin", category: "skincare", price: "₱00.00", estTime: "est time" },
    { id: 10, title: "Advance treatment",  desc: "High-tech solutions for skin concerns", category: "skincare", price: "₱00.00", estTime: "est time" },
    { id: 11, title: "Specialized facials", desc: "Targeted care for specific skin needs", category: "skincare", price: "₱00.00", estTime: "est time" },
    { id: 12, title: "Body treatment",     desc: "Full-body skincare services", category: "skincare", price: "₱00.00", estTime: "est time" },
    // Massage Services (4)
    { id: 13, title: "Swedish massage",      desc: "Gently stroke for relaxation", category: "massage", price: "₱00.00", estTime: "est time" },
    { id: 14, title: "Deep tissue massage",  desc: "Intense pressure for muscle knots", category: "massage", price: "₱00.00", estTime: "est time" },
    { id: 15, title: "Hot stone massage",    desc: "Heated stones to melt tension", category: "massage", price: "₱00.00", estTime: "est time" },
    { id: 16, title: "Foot reflexology",     desc: "Pressure points for overall wellness", category: "massage", price: "₱00.00", estTime: "est time" },
    // Premium Services (4)
    { id: 17, title: "Bridal package",    desc: "Full wedding day beauty", category: "premium", price: "₱00.00", estTime: "est time" },
    { id: 18, title: "Couple's Massage",  desc: "Relaxation for 2", category: "premium", price: "₱00.00", estTime: "est time" },
    { id: 19, title: "Hair & glow combo", desc: "Scalp treatment + facial", category: "premium", price: "₱00.00", estTime: "est time" },
    { id: 20, title: "VIP experience",    desc: "Private room + drinks", category: "premium", price: "₱00.00", estTime: "est time" },
  ];

  const SERVICE_CATEGORIES = propsServiceCategories || [
    { id: "hair", label: "Hair Service", icon: "✂️" },
    { id: "nail", label: "Nail Service", icon: "💅" },
    { id: "skincare", label: "Skin Care Service", icon: "✨" },
    { id: "massage", label: "Massage Service", icon: "🧘" },
    { id: "premium", label: "Premium Service", icon: "👑" },
  ];

  const STYLISTS_LIST = propsStylistsList || [
    {
      id: "any",
      isAny: true,
      initial: null,
      name: "Any available stylist",
      specialty: "First available stylist will be assigned",
      rating: null,
      reviews: null,
      unavailable: false,
    },
    {
      id: "mike",
      isAny: false,
      initial: "M",
      name: "Mike Santos",
      specialty: "Fades & Modern cuts",
      rating: "4.9",
      reviews: "124 reviews",
      unavailable: false,
    },
    {
      id: "john",
      isAny: false,
      initial: "J",
      name: "John Dela Cruz",
      specialty: "Classic styles",
      rating: "4.7",
      reviews: "89 reviews",
      unavailable: false,
    },
    {
      id: "carlos",
      isAny: false,
      initial: "C",
      name: "Carlos Reyes",
      specialty: "Beard Expert",
      rating: "4.8",
      reviews: "156 reviews",
      unavailable: true,
    },
  ];

  const [step, setStep] = useState(1);
  const [walkInName, setWalkInName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceError, setServiceError] = useState("");
  const [serviceTouched, setServiceTouched] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [stylistError, setStylistError] = useState("");
  const [stylistTouched, setStylistTouched] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [visitedCategories, setVisitedCategories] = useState(new Set());
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

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

  const validateServices = (services) => {
    if (!services || services.length === 0) {
      setServiceError("Please select at least one service");
      return false;
    }
    setServiceError("");
    return true;
  };

  const validateStylist = (stylistId) => {
    if (!stylistId) {
      setStylistError("Please select a stylist");
      return false;
    }
    setStylistError("");
    return true;
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      const updated = prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      if (serviceTouched) {
        validateServices(updated);
      }
      return updated;
    });
  };

  const handleOpenCategoryModal = (categoryId) => {
    setActiveCategory(categoryId);
    setShowServiceModal(true);
  };

  const handleServiceModalClose = (categoryId) => {
    // Mark category as visited after closing the modal
    setVisitedCategories(prev => new Set([...prev, categoryId]));
    setShowServiceModal(false);
  };

  const handleClose = () => {
    setStep(1);
    setWalkInName("");
    setNameError("");
    setNameTouched(false);
    setSelectedServices([]);
    setServiceError("");
    setServiceTouched(false);
    setSelectedStylist(null);
    setStylistError("");
    setStylistTouched(false);
    setReceiptData(null);
    setShowServiceModal(false);
    setActiveCategory(null);
    setVisitedCategories(new Set());
    setShowConfirmCancel(false);
    onClose();
  };

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // Step 1, show confirmation dialog
      setShowConfirmCancel(true);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!validateName(walkInName)) {
        setNameTouched(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setServiceTouched(true);
      if (!validateServices(selectedServices)) {
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStylistTouched(true);
      if (!validateStylist(selectedStylist)) {
        return;
      }
      generateReceipt();
    }
  };

  // Calculate service count per category
  const getServiceCountForCategory = (categoryId) => {
    return SERVICES_LIST.filter(s => 
      s.category === categoryId && selectedServices.includes(s.id)
    ).length;
  };

  const generateReceipt = () => {
    const services = SERVICES_LIST.filter(s => selectedServices.includes(s.id));
    const stylist = STYLISTS_LIST.find(s => s.id === selectedStylist);
    const totalDuration = services.reduce((acc, s) => {
      const mins = parseInt(s.estTime);
      return acc + mins;
    }, 0);

    const receipt = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: walkInName,
      services: services,
      totalDuration: totalDuration,
      price: "₱00.00",
      stylist: stylist.name,
      timestamp: new Date().toLocaleString(),
    };

    setReceiptData(receipt);
    setStep(4);
  };

  const handleDownloadReceipt = () => {
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
                <span class="service-price">${svc.price || '₱0.00'}</span>
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
              <span class="detail-label">Time</span>
              <span class="detail-value">${receiptData.timestamp || 'N/A'}</span>
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
    onSubmit({ ...receiptData, selectedServices });
    handleClose();
  };

  if (!isOpen) return null;

  const activeCategoryData = SERVICE_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <>
      <div 
        className="appt-overlay"
        onClick={(e) => {
          // Only trigger if clicking directly on the overlay, not on child elements
          if (e.target === e.currentTarget) {
            setShowConfirmCancel(true);
          }
        }}
      >
        <div className="appt-root">
          <ModalHeader onBack={handleBack} />
          <ProgressIndicator currentStep={step} />

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

            {/* Step 2: Service Categories */}
            {step === 2 && (
              <div className="appt-section-heading">
                <h2 className="appt-section-title">Select Services</h2>
                <p className="appt-section-sub">Choose service categories to browse</p>
                <div className="appt-svc-grid">
                  {SERVICE_CATEGORIES.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      selectedCount={getServiceCountForCategory(category.id)}
                      onSelect={handleOpenCategoryModal}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Stylist Selection */}
            {step === 3 && (
              <div className="appt-section-heading">
                <h2 className="appt-section-title">Choose a stylist</h2>
                <p className="appt-section-sub">Pick your preferred stylist or choose "Any Available"</p>
                <div className="stylist-list">
                  <AnyRow isSelected={selectedStylist === "any"} onSelect={setSelectedStylist} />
                  {STYLISTS_LIST.filter((s) => !s.isAny).map((stylist) => (
                    <StylistRow
                      key={stylist.id}
                      stylist={stylist}
                      isSelected={selectedStylist === stylist.id}
                      onSelect={setSelectedStylist}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Receipt */}
            {step === 4 && receiptData && (
              <div className="appt-section-heading">
                <p className="appt-section-title">Confirm Walk-in</p>
                <p className="appt-section-sub">Review appointment details</p>
                
                <div className="confirm-card">
                  {/* Service Summary Section */}
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

                  {/* Services List Section */}
                  {receiptData.services.length > 0 && (
                    <>
                      <div style={{ marginBottom: "16px", marginTop: "12px" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--color-tan)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "12px" }}>
                          Services Selected
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {receiptData.services.map((service, idx) => (
                            <div key={idx} style={{ fontSize: "0.85rem", color: "var(--color-white)", paddingLeft: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>• {service.title}</span>
                              <span style={{ color: "var(--color-tan)" }}>{service.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Divider />
                    </>
                  )}

                  {/* Contact details */}
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

          <div className="appt-footer" style={{ display: "flex", flexDirection: "column", gap: step === 2 && selectedServices.length === 0 ? "6px" : "12px" }}>
            {step === 2 && selectedServices.length === 0 && (
              <p className="service-error"> Please select one service</p>
            )}
            <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
              {step === 4 && (
                <button 
                  className="appt-download-receipt-btn"
                  onClick={handleDownloadReceipt}
                  title="Download receipt as PDF"
                >
                  <DownloadIcon />
                  Download Receipt
                </button>
              )}
              {step !== 4 && (
                <button 
                  className="appt-cancel-btn"
                  onClick={handleCancelClick}
                  title="Cancel and close"
                >
                  Cancel
                </button>
              )}
              <button 
                className="appt-continue-btn" 
                onClick={step === 4 ? handleConfirm : handleContinue}
                disabled={(step === 1 && (!!nameError || !walkInName.trim())) || (step === 2 && selectedServices.length === 0) || (step === 3 && !selectedStylist)}
                style={((step === 2 && selectedServices.length === 0) || (step === 3 && !selectedStylist)) ? { opacity: 0.5, cursor: "not-allowed" } : { opacity: 1 }}
                title={step === 4 ? "Confirm walk-in appointment" : step === 1 && !!nameError ? nameError : step === 2 && selectedServices.length === 0 ? "Please select at least one service" : step === 3 && !selectedStylist ? "Please select a stylist" : "Continue to next step"}
              >
                {step === 4 ? "Confirm" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection Modal (nested) */}
      {activeCategoryData && (
        <ServiceSelectionModal
          isOpen={showServiceModal}
          categoryId={activeCategory}
          categoryLabel={activeCategoryData.label}
          services={SERVICES_LIST}
          selectedServices={selectedServices}
          onSelect={handleServiceToggle}
          onClose={() => handleServiceModalClose(activeCategory)}
          isUpdating={visitedCategories.has(activeCategory)}
          onCloseWholeModal={handleClose}
        />
      )}

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
    </>
  );
};
