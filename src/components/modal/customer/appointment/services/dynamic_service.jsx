import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ConfirmationDialog } from "../../confirmation_dialog";

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

const BOOKING_MODAL_THEME_STYLE_ID = "booking-modal-theme-dynamic-service";

const BOOKING_MODAL_THEME_CSS = `
  .booking-modal-theme,
  .booking-modal-theme * {
    color-scheme: dark;
  }

  .booking-modal-theme .appt-root {
    display: flex !important;
    flex-direction: column !important;
    min-height: 0 !important;
    max-height: calc(100vh - 80px) !important;
    width: min(960px, calc(100vw - 32px)) !important;
    overflow: hidden !important;
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

  .booking-modal-theme .appt-footer,
  .booking-modal-theme .booking-service-footer {
    border-top: 1px solid rgba(152, 143, 129, 0.18) !important;
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    gap: 12px !important;
    flex-shrink: 0 !important;
  }

  .booking-modal-theme .appt-root .appt-footer > button,
  .booking-modal-theme .booking-service-footer > button {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    width: auto !important;
  }

  .booking-modal-theme .appt-root .appt-footer .appt-cancel-btn,
  .booking-modal-theme .appt-root .appt-footer .appt-continue-btn,
  .booking-modal-theme .booking-service-footer .appt-cancel-btn,
  .booking-modal-theme .booking-service-footer .appt-continue-btn {
    width: auto !important;
  }

  .booking-modal-theme .appt-progress {
    background: rgba(12, 10, 9, 0.6) !important;
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  .booking-modal-theme .appt-body {
    flex: 1 !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    padding: 28px 40px 20px !important;
    background: #070605 !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-back-btn,
  .booking-modal-theme .appt-header-title,
  .booking-modal-theme .appt-section-title,
  .booking-modal-theme .appt-step-label,
  .booking-modal-theme .svc-list-title,
  .booking-modal-theme .svc-list-desc,
  .booking-modal-theme .svc-list-price,
  .booking-modal-theme .svc-list-est {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .svc-list-desc,
  .booking-modal-theme .svc-list-est {
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

  .booking-modal-theme .svc-list-row {
    background: #11100d !important;
    border: 1px solid rgba(221, 144, 29, 0.12) !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .svc-list-row.selected {
    background: rgba(221, 144, 29, 0.12) !important;
    border-color: rgba(221, 144, 29, 0.55) !important;
    box-shadow: 0 0 0 1px rgba(221, 144, 29, 0.15) inset !important;
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

  .booking-modal-theme .appt-body::-webkit-scrollbar,
  .booking-modal-theme .svc-list::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-track,
  .booking-modal-theme .svc-list::-webkit-scrollbar-track {
    background: rgba(19, 19, 19, 0.4) !important;
    border-radius: 10px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb,
  .booking-modal-theme .svc-list::-webkit-scrollbar-thumb {
    background: rgba(221, 144, 29, 0.9) !important;
    border-radius: 10px !important;
    border: 2px solid transparent !important;
    background-clip: padding-box !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb:hover,
  .booking-modal-theme .svc-list::-webkit-scrollbar-thumb:hover {
    background: rgba(221, 144, 29, 1) !important;
  }

  .booking-modal-theme .appt-body,
  .booking-modal-theme .svc-list {
    scrollbar-width: thin;
    scrollbar-color: rgba(221, 144, 29, 0.9) rgba(19, 19, 19, 0.4);
  }
`;

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
  price: parseFloat(service.price), // Keep as number for API
  est_time: parseInt(service.est_time), // Keep as number for API
  displayPrice: `₱${parseFloat(service.price).toFixed(2)}`, // For display only
  displayTime: `${service.est_time} min`, // For display only
  category: service.category,
});

/* ── Header — shows the service category name ── */
const ServiceHeader = ({ title, onBack, isSaving = false }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack} aria-label="Go back">
      <BackArrowIcon />
      {isSaving ? "Back" : "Back"}
    </button>
    <h1 className="appt-header-title">{title}</h1>
    {/* invisible mirror to keep title centred */}
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

/* ── Single service list row (no icon) ── */
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
    {/* left: text only (no icon) */}
    <div className="svc-list-left">
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

export const DynamicServiceModal = ({ 
  onBack, 
  onContinue, 
  categoryName, 
  categoryKeywords = [],
  initialSelected = [], 
  isUpdating = false 
}) => {
  const [selected, setSelected] = useState(initialSelected);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(BOOKING_MODAL_THEME_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BOOKING_MODAL_THEME_STYLE_ID;
    style.textContent = BOOKING_MODAL_THEME_CSS;
    document.head.appendChild(style);
  }, []);

  // Inject scoped scrollbar styling once
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('dynamic-service-scrollbar-style')) return;
    const style = document.createElement('style');
    style.id = 'dynamic-service-scrollbar-style';
    style.textContent = `
      /* WebKit-based browsers (Chrome, Edge, Safari) */
      .appt-backdrop .appt-body::-webkit-scrollbar,
      .appt-backdrop .appt-root .appt-body::-webkit-scrollbar,
      .appt-body::-webkit-scrollbar { width: 12px !important; height: 12px !important; }

      .appt-backdrop .appt-body::-webkit-scrollbar-track,
      .appt-backdrop .appt-root .appt-body::-webkit-scrollbar-track,
      .appt-body::-webkit-scrollbar-track { background: rgba(19, 19, 19, 0.4) !important; border-radius: 10px !important; }

      .appt-backdrop .appt-body::-webkit-scrollbar-thumb,
      .appt-backdrop .appt-root .appt-body::-webkit-scrollbar-thumb,
      .appt-body::-webkit-scrollbar-thumb {
        background: rgba(221, 144, 29, 0.9) !important;
        border-radius: 10px !important;
        border: 2px solid transparent !important;
        background-clip: padding-box !important;
      }

      .appt-backdrop .appt-body::-webkit-scrollbar-thumb:hover,
      .appt-backdrop .appt-root .appt-body::-webkit-scrollbar-thumb:hover,
      .appt-body::-webkit-scrollbar-thumb:hover { background: rgba(221, 144, 29, 1) !important; }

      /* Firefox */
      .appt-backdrop .appt-body,
      .appt-backdrop .appt-root .appt-body,
      .appt-body {
        scrollbar-width: thin;
        scrollbar-color: rgba(221, 144, 29, 0.9) rgba(19, 19, 19, 0.4);
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log(`[DynamicService] Fetching services for category: ${categoryName}`, categoryKeywords);
        
        // Fetch all services
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const allServices = await response.json();
        
        // Filter services by category keywords
        const filteredServices = allServices.filter(
          (service) => categoryKeywords.includes(service.category)
        );
        
        console.log(`[DynamicService] Filtered ${filteredServices.length} services for ${categoryName}`);
        setServices(filteredServices.map(formatService));
        setError(null);
      } catch (err) {
        console.error(`[DynamicService] Error fetching services:`, err);
        setError(err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryName, categoryKeywords]);

  const handleBack = () => {
    const selectedServices = services.filter((s) => selected.includes(s.id));
    onContinue?.({ services: selectedServices });
    onBack?.();
  };

  const handleExitRequest = () => {
    setShowBackdropConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowBackdropConfirm(false);
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

  const handleBackgroundClick = (e) => {
    // Only block if clicking the backdrop itself, not content inside modal
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      handleExitRequest();
    }
  };

  const modalContent = (
    <div
      className={`appt-backdrop ${BOOKING_MODAL_THEME_CLASS}`}
      data-theme="dark"
      onClick={handleBackgroundClick}
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
      <div
        className="appt-root"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...BOOKING_MODAL_THEME_VARS,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          maxHeight: 'calc(100vh - 80px)',
          width: 'min(960px, calc(100vw - 32px))',
          overflow: 'hidden',
        }}
      >
        <ServiceHeader title={categoryName} onBack={handleBack} isSaving={isUpdating} />
        <ProgressIndicator currentStep={2} />

        {/* ── Scrollable body ── */}
        <div className="appt-body" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '28px 40px 20px' }}>
          <div className="appt-section-heading">
            <p className="appt-section-title">Choose {categoryName.toLowerCase()}</p>
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

          {/* Empty state */}
          {!loading && !error && services.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              No services available in this category
            </div>
          )}

          {/* service list */}
          {!loading && !error && services.length > 0 && (
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

        {/* ── Buttons footer ── */}
        <div
          className="appt-footer booking-service-footer"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: 12,
            width: "100%",
            padding: "16px 20px",
            background: "rgba(0,0,0,0.5)",
            borderTop: "1px solid rgba(152,143,129,0.2)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <button className="appt-cancel-btn" onClick={handleBack} style={{ flex: '1 1 0', minWidth: 0, width: 'auto' }}>
              Back
            </button>
            <button
              className="appt-continue-btn"
              onClick={handleContinue}
              disabled={selected.length === 0 && !isUpdating}
              style={{ flex: '1 1 0', minWidth: 0, width: 'auto' }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}

      {/* Backdrop confirmation */}
      <ConfirmationDialog
        isOpen={showBackdropConfirm}
        title="Cancel Service Selection?"
        message="Are you sure? Your service selections will be lost."
        confirmText="Yes, Cancel"
        cancelText="Keep Selecting"
        onConfirm={() => {
          handleConfirmExit();
        }}
        onCancel={() => setShowBackdropConfirm(false)}
      />
    </>
  );
}
