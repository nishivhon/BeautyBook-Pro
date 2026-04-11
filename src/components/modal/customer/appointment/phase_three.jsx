import { useState, useEffect } from "react";
import { ConfirmationDialog } from "../confirmation_dialog";
import { fetchStaffWithAnyOption } from "../../../../services/staffApi";

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

/* ══════════════════════════════════════════
   DATA & CONSTANTS
══════════════════════════════════════════ */
const ANY_STYLIST = {
  id: "any",
  isAny: true,
  initial: null,
  name: "Any available stylist",
  unavailable: false,
};

// Transform API staff record to component format
const transformStaffToStylist = (staff) => ({
  id: staff.id,
  isAny: false,
  initial: staff.names?.charAt(0)?.toUpperCase() || "?",
  name: staff.names,
  status: staff.status,
  unavailable: staff.unavailable, // API already calculates this
});

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
      </div>
    </div>
  </button>
);

/* ── Named stylist row ── */
const StylistRow = ({ stylist, isSelected, onSelect }) => {
  const statusLabel = stylist.status === "no slots" ? "No Slots" : "Unavailable";
  
  return (
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
          {stylist.unavailable && <span className="stylist-unavailable-tag">{statusLabel}</span>}
        </div>
      </div>
    </button>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT — Phase 3
══════════════════════════════════════════ */
export const AppointmentFormPhase3 = ({ onBack, onContinue, onCancel }) => {
  const [selected, setSelected] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [stylists, setStylists] = useState([ANY_STYLIST]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff from API on component mount
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchStaffWithAnyOption();
        
        // Build stylists array with "Any available" option first
        const transformedStylists = [
          response.any,
          ...(response.staff || []).map(transformStaffToStylist)
        ];
        
        setStylists(transformedStylists);
      } catch (err) {
        console.error('Error fetching stylists:', err);
        setError(err.message);
        // Fallback to just "Any available" if fetch fails
        setStylists([ANY_STYLIST]);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, []);

  const handleContinue = () => {
    onContinue?.({ stylist: stylists.find((s) => s.id === selected) });
  };

  const handleBack = () => {
    onBack?.({ stylist: stylists.find((s) => s.id === selected) });
  };

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  return (
    <>
      <div 
        className="appt-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowBackdropConfirm(true);
          }
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="appt-root">
          <BookingHeader onBack={handleBack} />
          <ProgressIndicator currentStep={3} />

          {/* ── Scrollable body ── */}
          <div className="appt-body">
            <div className="appt-section-heading">
              <p className="appt-section-title">Choose a stylist</p>
              <p className="appt-section-sub">Pick your preferred stylist or choose &quot;Any Available&quot;</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading stylists...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center p-5 text-red-600 bg-red-50 rounded-lg mx-5">
            Error loading stylists. Please try again.
          </div>
        )}

        {/* stylist list */}
        {!loading && (
          <div className="stylist-list">
            <AnyRow isSelected={selected === "any"} onSelect={setSelected} />
            {stylists
              .filter((s) => !s.isAny)
              .sort((a, b) => a.unavailable - b.unavailable)
              .map((stylist) => (
                <StylistRow
                  key={stylist.id}
                  stylist={stylist}
                  isSelected={selected === stylist.id}
                  onSelect={setSelected}
                />
              ))}
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="appt-footer">
        <div className="flex gap-3 w-full">
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
            disabled={selected === null}
            style={{
              flex: 1,
              opacity: selected !== null ? 1 : 0.5,
              cursor: selected !== null ? "pointer" : "not-allowed",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  </div>

      {/* Cancel Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showBackdropConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your booking progress will be lost."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={() => {
          setShowBackdropConfirm(false);
          onCancel?.();
        }}
        onCancel={() => setShowBackdropConfirm(false)}
      />
      <ConfirmationDialog
        isOpen={showConfirmCancel}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your booking progress will be lost."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={() => {
          setShowConfirmCancel(false);
          onCancel?.();
        }}
        onCancel={() => setShowConfirmCancel(false)}
      />
    </>
  );
};

export default AppointmentFormPhase3;