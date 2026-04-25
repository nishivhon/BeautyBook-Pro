import { useState, useEffect } from "react";
import { ConfirmationDialog } from "../../confirmation_dialog";

/* Nail polish bottle icon for all nail service rows */
const NailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    {/* bottle body */}
    <rect x="7.5" y="10" width="9" height="11" rx="2.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    {/* neck */}
    <rect x="9.5" y="6" width="5" height="4.5" rx="0.8" stroke="#1a0f00" strokeWidth="1.6" fill="none"/>
    {/* cap */}
    <rect x="8.5" y="3" width="7" height="3.5" rx="1.8" stroke="#1a0f00" strokeWidth="1.5" fill="none" />
    <rect x="8.5" y="3" width="7" height="3.5" rx="1.8" fill="#1a0f00" fillOpacity="0.25"/>
    {/* shine line on body */}
    <line x1="10.5" y1="12" x2="10.5" y2="19.5" stroke="#1a0f00" strokeWidth="1.1" strokeLinecap="round" opacity="0.45"/>
  </svg>
);

/* Back arrow */
const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

// Format service data for display
const formatService = (service) => ({
  id: service.id,
  title: service.service_name,
  desc: service.description,
  price: `₱${parseFloat(service.price).toFixed(2)}`,
  estTime: `${service.est_time} min`,
});

/* ── Header — "Nail Services" title ── */
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

/* ── Progress bar — Phase 2 state (step 1 done ✓, step 2 active) ── */
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
        <NailIcon />
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

export const NailServicesModal = ({ onBack, onContinue, initialSelected = [], isUpdating = false }) => {
  const [selected, setSelected] = useState(initialSelected);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Fetch all services and filter for "Nail Services" category
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const allServices = await response.json();
        // Filter for Nail Services category
        const nailServices = allServices.filter(
          (service) => service.category === 'Nail Services'
        );
        setServices(nailServices.map(formatService));
        setError(null);
      } catch (err) {
        console.error('Error fetching nail services:', err);
        setError(err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBack = () => {
    const selectedServices = services.filter((s) => selected.includes(s.id));
    onContinue?.({ services: selectedServices });
    onBack?.();
  };

  const handleSelectService = (serviceId, isDeselect) => {
    if (isDeselect) {
      setSelected(selected.filter((id) => id !== serviceId));
    } else {
      setSelected([...selected, serviceId]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0 && !isUpdating) {
      return;
    }

    const selectedServices = services.filter((s) => selected.includes(s.id));
    onContinue?.({ services: selectedServices });
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

      <ServiceHeader title="Nail Services" onBack={handleBack} isSaving={isUpdating} />
      <ProgressIndicator currentStep={2} />

      {/* ── Scrollable body ── */}
      <div className="appt-body">
        <div className="appt-section-heading">
          <p className="appt-section-title">Choose nail services</p>
          <p className="appt-section-sub">Select one or more services you&apos;d like to book</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Loading services...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
            Error loading services: {error}
          </div>
        )}

        {/* service list */}
        {!loading && !error && (
          <div className="svc-list">
            {services.map((svc) => (
              <ServiceRow
                key={svc.id}
                service={svc}
                isSelected={selected.includes(svc.id)}
                onSelect={handleSelectService}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
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
            disabled={selected.length === 0 && !isUpdating || loading}
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
    </div>

      <ConfirmationDialog
        isOpen={showBackdropConfirm}
        title="Cancel Service Selection?"
        message="Are you sure you want to exit? Your service selection will be saved."
        confirmText="Yes, Exit"
        cancelText="Keep Selecting"
        onConfirm={() => {
          setShowBackdropConfirm(false);
          onBack?.();
        }}
        onCancel={() => setShowBackdropConfirm(false)}
      />
    </>
  );
};

export default NailServicesModal;