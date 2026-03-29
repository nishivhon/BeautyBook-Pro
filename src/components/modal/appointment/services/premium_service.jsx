import { useState, useEffect } from "react";

/* Diamond / premium icon for all premium service rows */
const PremiumIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    {/* diamond outline */}
    <path
      d="M12 20.5L2.5 9.5H21.5L12 20.5Z"
      stroke="#1a0f00" strokeWidth="1.7" strokeLinejoin="round" fill="none"
    />
    {/* top facet triangle */}
    <path
      d="M2.5 9.5L7 3.5H17L21.5 9.5"
      stroke="#1a0f00" strokeWidth="1.7" strokeLinejoin="round" fill="none"
    />
    {/* centre divider line */}
    <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" stroke="#1a0f00" strokeWidth="1.3"/>
    {/* inner facet lines */}
    <path d="M7 3.5L9.5 9.5L12 20.5" stroke="#1a0f00" strokeWidth="0.9" opacity="0.5"/>
    <path d="M17 3.5L14.5 9.5L12 20.5" stroke="#1a0f00" strokeWidth="0.9" opacity="0.5"/>
  </svg>
);

/* Back arrow */
const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const formatService = (service) => ({
  id: service.id,
  title: service.service_name,
  desc: service.description,
  price: `₱${parseFloat(service.price).toFixed(2)}`,
  estTime: `${service.est_time} min`,
});

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

/* ── Header ── */
const ServiceHeader = ({ title, onBack, isSaving = false }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack} aria-label="Go back">
      <BackArrowIcon />
      Back
    </button>
    <h1 className="appt-header-title">{title}</h1>
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
        // Deselect if already selected
        onSelect(service.id, true);
      } else {
        // Select if not selected
        onSelect(service.id, false);
      }
    }}
    aria-pressed={isSelected}
  >
    <div className="svc-list-left">
      <div className="svc-list-icon-box">
        <PremiumIcon />
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

export const PremiumServicesModal = ({ onBack, onContinue, initialSelected = [], isUpdating = false }) => {
  const [selected, setSelected] = useState(initialSelected);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/services/category/Premium%20Services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.map(formatService));
        setError(null);
      } catch (err) {
        console.error('Error fetching premium services:', err);
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
    const selectedServices = services.filter((s) => selected.includes(s.id));
    onContinue?.({ services: selectedServices });
    onBack?.();
  };

  const hasValidation = selected.length === 0 && !isUpdating;

  return (
    <div className="appt-root">

      <ServiceHeader title="Premium Services" onBack={handleBack} isSaving={isUpdating} />
      <ProgressIndicator currentStep={2} />

      <div className="appt-body">
        <div className="appt-section-heading">
          <p className="appt-section-title">Choose a premium service</p>
          <p className="appt-section-sub">Select a service you&apos;d like to book</p>
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
          <>
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

            {hasValidation && (
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
          </>
        )}
      </div>

      <div className="appt-footer">
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button
            onClick={handleBack}
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
          <button className="appt-continue-btn" onClick={handleContinue} disabled={hasValidation || loading} style={{ flex: 1 }}>
            {isUpdating ? "Save" : "Continue"} →
          </button>
        </div>
      </div>

    </div>
  );
};

export default PremiumServicesModal;