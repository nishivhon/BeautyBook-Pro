import { useState } from "react";
import { HairServicesModal } from "./services/haircut_service";

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

const SERVICES = [
  { id: 1, title: "Hair Services",     desc: "Haircuts, Hair Styling, Hair Color, & Hair Treatment", Icon: HairIcon     },
  { id: 2, title: "Nail Services",     desc: "Manicure, pedicure & nail art",                        Icon: NailIcon     },
  { id: 3, title: "Skincare",          desc: "Facials, treatments & body care",                      Icon: SkincareIcon },
  { id: 4, title: "Massage services",  desc: "Relaxation & therapeutic bodywork",                    Icon: MassageIcon  },
  { id: 5, title: "Premium Services",  desc: "Exclusive packages & VIP experiences",                 Icon: PremiumIcon  },
];

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

/* ── Header ── */
const BookingHeader = ({ onBack }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack}>
      <svg viewBox="0 0 16 16" fill="none" width={16} height={16}>
        <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </button>
    <h1 className="appt-header-title">Book Appointment</h1>
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress bar — phase 2 state ── */
const ProgressIndicator = ({ currentStep = 2 }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {STEPS.map((step, i) => {
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
            {i < STEPS.length - 1 && (
              <div className={`appt-step-line${isCompleted ? " done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {STEPS.map((step) => {
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
const ServiceCard = ({ service, isSelected, onSelect, onOpenHairModal }) => (
  <button
    className={`appt-svc-card${isSelected ? " selected" : ""}`}
    onClick={() => {
      if (service.id === 1) {
        // Hair Services — open the hair services modal
        onOpenHairModal();
      } else if (isSelected) {
        onSelect(null); // Deselect if already selected
      } else {
        onSelect(service.id); // Select if not selected
      }
    }}
    aria-pressed={isSelected}
    style={{
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      if (!isSelected) {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
        const iconCircle = e.currentTarget.querySelector('.appt-svc-icon-circle');
        if (iconCircle) {
          iconCircle.style.transform = "scale(1.1) rotate(5deg)";
        }
      }
    }}
    onMouseLeave={(e) => {
      if (!isSelected) {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        const iconCircle = e.currentTarget.querySelector('.appt-svc-icon-circle');
        if (iconCircle) {
          iconCircle.style.transform = "scale(1) rotate(0deg)";
        }
      }
    }}
  >
    {/* amber circle with dark icon */}
    <div className="appt-svc-icon-circle" style={{transition: "all 0.3s ease"}}>
      <service.Icon />
    </div>
    <p className="appt-svc-title">{service.title}</p>
    <p className="appt-svc-desc">{service.desc}</p>
  </button>
);

export const AppointmentFormPhase2 = ({ onBack, onContinue }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showHairModal, setShowHairModal] = useState(false);
  const [selectedHairServices, setSelectedHairServices] = useState([]);

  const handleContinue = () => {
    onContinue?.({ service: SERVICES.find((s) => s.id === selectedService), selectedHairServices });
  };

  const handleHairContinue = (data) => {
    // When user continues from hair services modal, just close and return to phase_two
    setSelectedService(1); // Hair Services ID
    setSelectedHairServices(data.services); // Store the selected hair services
    setShowHairModal(false); // Return to phase_two (don't call onContinue yet)
  };

  if (showHairModal) {
    return <HairServicesModal onBack={() => setShowHairModal(false)} onContinue={handleHairContinue} />;
  }

  return (
    <div className="appt-root">
      <BookingHeader onBack={onBack} />
      <ProgressIndicator currentStep={2} />

      {/* ── Scrollable body ── */}
      <div className="appt-body">
        <div className="appt-section-heading">
          <p className="appt-section-title" style={{ animation: "fade-up 0.5s ease forwards" }}>Choose a service</p>
          <p className="appt-section-sub" style={{ animation: "fade-up 0.6s ease 0.1s forwards", opacity: 0 }}>Select a service you&apos;d like to book</p>
        </div>

        {/* 3-col top row + 2-col bottom row */}
        <div className="appt-svc-grid">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              isSelected={selectedService === svc.id}
              onSelect={setSelectedService}
              onOpenHairModal={() => setShowHairModal(true)}
            />
          ))}
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="appt-footer">
        {!selectedService && (
          <p style={{
            color: "#ff6b6b",
            fontSize: "0.85rem",
            marginBottom: "10px",
            textAlign: "center",
            fontWeight: "500",
          }}>
            Please select a service
          </p>
        )}
        <button
          className="appt-continue-btn"
          onClick={handleContinue}
          disabled={!selectedService}
          style={{
            opacity: selectedService ? 1 : 0.5,
            cursor: selectedService ? "pointer" : "not-allowed",
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default AppointmentFormPhase2;