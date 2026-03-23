import { useState } from "react";

/* ══════════════════════════════════════════
   INLINE SVG ICONS
══════════════════════════════════════════ */

/* Person silhouette — used in "Any available" row */
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    <circle cx="12" cy="8" r="4" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Back arrow */
const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const STYLISTS = [
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
const BookingHeader = ({ onBack }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack} aria-label="Go back">
      <BackArrowIcon />
      Back
    </button>
    <h1 className="appt-header-title">Book Appointment</h1>
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress bar — Phase 3 state ── */
/* Steps 1+2 done (✓), step 3 active, step 4 inactive */
/* Connectors 1→2 and 2→3 are amber; connector 3→4 is gray */
const ProgressIndicator = ({ currentStep = 3 }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {STEPS.map((step, i) => {
        const isDone   = step.number < currentStep;
        const isActive = step.number === currentStep;
        /* connector after this step is amber if this step is done */
        const lineAmber = step.number < currentStep;
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
              <div className={`appt-step-line${lineAmber ? " done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {STEPS.map((step) => (
        <span
          key={step.number}
          className={`appt-step-label${
            step.number === currentStep ? " active"
            : step.number < currentStep ? " done"
            : ""
          }`}
        >
          {step.label}
        </span>
      ))}
    </div>
  </div>
);

/* ── "Any available" row ── */
const AnyRow = ({ isSelected, onSelect }) => (
  <button
    className={`stylist-row${isSelected ? " selected" : ""}`}
    onClick={() => onSelect("any")}
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
    onClick={() => !stylist.unavailable && onSelect(stylist.id)}
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

/* ══════════════════════════════════════════
   MAIN COMPONENT — Phase 3
══════════════════════════════════════════ */
export const AppointmentFormPhase3 = ({ onBack, onContinue }) => {
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    onContinue?.({ stylist: STYLISTS.find((s) => s.id === selected) });
  };

  return (
    <div className="appt-root">

      <BookingHeader onBack={onBack} />
      <ProgressIndicator currentStep={3} />

      {/* ── Scrollable body ── */}
      <div className="appt-body">
        <div className="appt-section-heading">
          <p className="appt-section-title">Choose a stylist</p>
          <p className="appt-section-sub">Pick your preferred stylist or choose &quot;Any Available&quot;</p>
        </div>

        {/* stylist list */}
        <div className="stylist-list">
          <AnyRow isSelected={selected === "any"} onSelect={setSelected} />
          {STYLISTS.filter((s) => !s.isAny).map((stylist) => (
            <StylistRow
              key={stylist.id}
              stylist={stylist}
              isSelected={selected === stylist.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="appt-footer">
        <button className="appt-continue-btn" onClick={handleContinue}>
          Continue →
        </button>
      </div>

    </div>
  );
};

export default AppointmentFormPhase3;