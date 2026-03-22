import { useState } from "react";

/* ══════════════════════════════════════════
   INLINE SVG ICONS
══════════════════════════════════════════ */

/* Massage / hands wave icon for all massage service rows */
const MassageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    {/* person head */}
    <circle cx="18" cy="4.5" r="2.2" stroke="#1a0f00" strokeWidth="1.6" fill="none"/>
    {/* body lying on table */}
    <path
      d="M2 13.5 Q5 11 9 12 L14 11 Q17 10.5 20 12"
      stroke="#1a0f00" strokeWidth="1.7" strokeLinecap="round" fill="none"
    />
    {/* table surface */}
    <line x1="1" y1="15.5" x2="23" y2="15.5" stroke="#1a0f00" strokeWidth="1.7" strokeLinecap="round"/>
    {/* table legs */}
    <line x1="4"  y1="15.5" x2="4"  y2="19.5" stroke="#1a0f00" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="15.5" x2="20" y2="19.5" stroke="#1a0f00" strokeWidth="1.5" strokeLinecap="round"/>
    {/* relaxation waves above */}
    <path d="M5 8 Q6.5 6 8 8 Q9.5 10 11 8"  stroke="#1a0f00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M8 5.5 Q9.5 3.5 11 5.5 Q12.5 7.5 14 5.5" stroke="#1a0f00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Back arrow */
const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const MASSAGE_SERVICES = [
  { id: 1, title: "Swedish massage",      desc: "Gently stroke for relaxation",        price: "₱00.00", estTime: "est time" },
  { id: 2, title: "Deep tissue massage",  desc: "Intense pressure for muscle knots",   price: "₱00.00", estTime: "est time" },
  { id: 3, title: "Hot stone massage",    desc: "Heated stones to melt tension",       price: "₱00.00", estTime: "est time" },
  { id: 4, title: "Foot reflexology",     desc: "Pressure points for overall wellness", price: "₱00.00", estTime: "est time" },
];

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

/* ── Header ── */
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
        <MassageIcon />
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

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export const MassageServicesModal = ({ onBack, onContinue, initialSelected = [], isUpdating = false }) => {
  const [selected, setSelected] = useState(initialSelected); // Array for multiple selections, initialized with previous selections

  const handleBack = () => {
    // Auto-save when clicking back
    const selectedServices = MASSAGE_SERVICES.filter((s) => selected.includes(s.id));
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

    const selectedServices = MASSAGE_SERVICES.filter((s) => selected.includes(s.id));
    onContinue?.({ services: selectedServices });
  };

  return (
    <div className="appt-root">

      <ServiceHeader title="Massage Services" onBack={handleBack} isSaving={isUpdating} />
      <ProgressIndicator currentStep={2} />

      <div className="appt-body">
        <div className="appt-section-heading">
          <p className="appt-section-title">Choose massage services</p>
          <p className="appt-section-sub">Select one or more services you&apos;d like to book</p>
        </div>

        <div className="svc-list">
          {MASSAGE_SERVICES.map((svc) => (
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

export default MassageServicesModal;