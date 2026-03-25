import { useState } from "react";

/* Skincare / face icon for all skincare service rows */
const SkincareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    {/* face circle */}
    <circle cx="12" cy="13.5" r="7.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    {/* eyes */}
    <circle cx="9.5"  cy="12" r="1.1" fill="#1a0f00"/>
    <circle cx="14.5" cy="12" r="1.1" fill="#1a0f00"/>
    {/* smile */}
    <path d="M9.5 16.5 Q12 18.5 14.5 16.5" stroke="#1a0f00" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    {/* sparkles above — represents skincare glow */}
    <path d="M12 3.5v2" stroke="#1a0f00" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M10.3 4.8l.9.9" stroke="#1a0f00" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M13.7 4.8l-.9.9" stroke="#1a0f00" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* Back arrow */
const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SKINCARE_SERVICES = [
  { id: 1, title: "Facial treatment",   desc: "Care & beautification for face & skin",  price: "₱00.00", estTime: "est time" },
  { id: 2, title: "Advance treatment",  desc: "High-tech solutions for skin concerns",  price: "₱00.00", estTime: "est time" },
  { id: 3, title: "Specialized facials", desc: "Targeted care for specific skin needs", price: "₱00.00", estTime: "est time" },
  { id: 4, title: "Body treatment",     desc: "Full-body skincare services",            price: "₱00.00", estTime: "est time" },
];

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

/* ── Header \u2014 "Skin Care Services" title ── */
const ServiceHeader = ({ title, onBack, isSaving = false }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack} aria-label="Go back">
      <BackArrowIcon />
      {isSaving ? "Back" : "Back"}
    </button>
    <h1 className="appt-header-title">{title}</h1>
    {/* invisible mirror keeps title centred */}
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress bar — Phase 2 state ── */
const ProgressIndicator = ({ currentStep = 2 }) => (
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

/* ── Single service list row ── */
const ServiceRow = ({ service, isSelected, onSelect }) => (
  <button
    className={`svc-list-row${isSelected ? " selected" : ""}`}
    onClick={() => {
      if (isSelected) {
        onSelect(service.id, true); // true = deselect
      } else {
        onSelect(service.id, false); // false = select
      }
    }}
    aria-pressed={isSelected}
  >
    {/* left: icon + text */}
    <div className="svc-list-left">
      <div className="svc-list-icon-box">
        <SkincareIcon />
      </div>
      <div className="svc-list-text">
        <span className="svc-list-title">{service.title}</span>
        <span className="svc-list-desc">{service.desc}</span>
      </div>
    </div>

    {/* right: price + est time */}
    <div className="svc-list-right">
      <span className="svc-list-price">{service.price}</span>
      <span className="svc-list-est">{service.estTime}</span>
    </div>
  </button>
);

export const SkincareServicesModal = ({ onBack, onContinue, initialSelected = [], isUpdating = false }) => {
  const [selected, setSelected] = useState(initialSelected); // Array for multiple selections, initialized with previous selections

  const handleBack = () => {
    // Auto-save when clicking back
    const selectedServices = SKINCARE_SERVICES.filter((s) => selected.includes(s.id));
    onContinue?.({ services: selectedServices });
    onBack?.();
  };

  const handleSelectService = (serviceId, isDeselect) => {
    if (isDeselect) {
      // Remove from selected
      setSelected(selected.filter((id) => id !== serviceId));
    } else {
      // Add to selected
      setSelected([...selected, serviceId]);
    }
  };

  const handleContinue = () => {
    // Allow save on subsequent visits even with no selections
    // Only validate on first visit (when isUpdating is false)
    if (selected.length === 0 && !isUpdating) {
      return; // Prevent continue if nothing selected on first visit
    }

    const selectedServices = SKINCARE_SERVICES.filter((s) => selected.includes(s.id));
    onContinue?.({ services: selectedServices });
  };

  return (
    <div className="appt-root">

      <ServiceHeader title="Skin Care Services" onBack={handleBack} isSaving={isUpdating} />
      <ProgressIndicator currentStep={2} />

      <div className="appt-body">
        <div className="appt-section-heading">
          <p className="appt-section-title">Choose skin care services</p>
          <p className="appt-section-sub">Select one or more services you&apos;d like to book</p>
        </div>

        <div className="svc-list">
          {SKINCARE_SERVICES.map((svc) => (
            <ServiceRow
              key={svc.id}
              service={svc}
              isSelected={selected.includes(svc.id)}
              onSelect={handleSelectService}
            />
          ))}
        </div>
      </div>

      <div className="appt-footer">
        {selected.length === 0 && !isUpdating && (
          <p style={{
            color: "#ff6b6b",
            fontSize: "0.85rem",
            marginBottom: "10px",
            textAlign: "center",
            fontWeight: "500",
          }}>
            Please select at least one service
          </p>
        )}
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button
            onClick={onBack}
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
            disabled={selected.length === 0 && !isUpdating}
            style={{
              flex: 1,
              opacity: selected.length > 0 || isUpdating ? 1 : 0.5,
              cursor: selected.length > 0 || isUpdating ? "pointer" : "not-allowed",
            }}
          >
            {isUpdating ? "Save" : "Continue"} →
          </button>
        </div>
      </div>

    </div>
  );
};

export default SkincareServicesModal;