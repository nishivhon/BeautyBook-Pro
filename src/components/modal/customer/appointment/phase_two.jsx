import { useState, useEffect } from "react";
import { HairServicesModal } from "./services/haircut_service";
import { NailServicesModal } from "./services/nail_service";
import { SkincareServicesModal } from "./services/skin_care_service";
import { MassageServicesModal } from "./services/massage_service";
import { PremiumServicesModal } from "./services/premium_service";
import { ConfirmationDialog } from "../confirmation_dialog";

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
  { id: 3, title: "Skin Care Services",          desc: "Facials, treatments & body care",                      Icon: SkincareIcon },
  { id: 4, title: "Massage Services",  desc: "Relaxation & therapeutic bodywork",                    Icon: MassageIcon  },
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
const ServiceCard = ({ service, isSelected, onSelect, onOpenHairModal, onOpenNailModal, onOpenSkincareModal, onOpenMassageModal, onOpenPremiumModal, selectedHairServicesCount = 0, selectedNailServicesCount = 0, selectedSkincareServicesCount = 0, selectedMassageServicesCount = 0, selectedPremiumServicesCount = 0 }) => (
  <button
    className={`appt-svc-card${isSelected ? " selected" : ""}`}
    onClick={() => {
      if (service.id === 1) {
        // Hair Services — open the hair services modal
        onOpenHairModal();
      } else if (service.id === 2) {
        // Nail Services — open the nail services modal
        onOpenNailModal();
      } else if (service.id === 3) {
        // Skincare Services — open the skincare services modal
        onOpenSkincareModal();
      } else if (service.id === 4) {
        // Massage Services — open the massage services modal
        onOpenMassageModal();
      } else if (service.id === 5) {
        // Premium Services — open the premium services modal
        onOpenPremiumModal();
      } else {
        // For other services, toggle selection
        onSelect(service.id);
      }
    }}
    aria-pressed={isSelected}
    style={{
      transition: "all 0.3s ease",
      position: "relative",
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
    
    {/* Service count badge for Hair Services */}
    {service.id === 1 && isSelected && selectedHairServicesCount > 0 && (
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
        {selectedHairServicesCount}
      </div>
    )}
    
    {/* Service count badge for Nail Services */}
    {service.id === 2 && isSelected && selectedNailServicesCount > 0 && (
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
        {selectedNailServicesCount}
      </div>
    )}
    
    {/* Service count badge for Skincare Services */}
    {service.id === 3 && isSelected && selectedSkincareServicesCount > 0 && (
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
        {selectedSkincareServicesCount}
      </div>
    )}
    
    {/* Service count badge for Premium Services */}
    {service.id === 5 && isSelected && selectedPremiumServicesCount > 0 && (
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
        {selectedPremiumServicesCount}
      </div>
    )}

    {/* Service count badge for Massage Services */}
    {service.id === 4 && isSelected && selectedMassageServicesCount > 0 && (
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
        {selectedMassageServicesCount}
      </div>
    )}
  </button>
);

export const AppointmentFormPhase2 = ({ onBack, onContinue, onCancel, initialData }) => {
  const [selectedServices, setSelectedServices] = useState([]); // Array to allow multiple selections
  const [showHairModal, setShowHairModal] = useState(false);
  const [showNailModal, setShowNailModal] = useState(false);
  const [showSkincareModal, setShowSkincareModal] = useState(false);
  const [showMassageModal, setShowMassageModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedHairServices, setSelectedHairServices] = useState([]);
  const [selectedNailServices, setSelectedNailServices] = useState([]);
  const [selectedSkincareServices, setSelectedSkincareServices] = useState([]);
  const [selectedMassageServices, setSelectedMassageServices] = useState([]);
  const [selectedPremiumServices, setSelectedPremiumServices] = useState([]);
  const [hasVisitedHairModal, setHasVisitedHairModal] = useState(false); // Track if hair modal has been visited
  const [hasVisitedNailModal, setHasVisitedNailModal] = useState(false); // Track if nail modal has been visited
  const [hasVisitedSkincareModal, setHasVisitedSkincareModal] = useState(false); // Track if skincare modal has been visited
  const [hasVisitedMassageModal, setHasVisitedMassageModal] = useState(false); // Track if massage modal has been visited
  const [hasVisitedPremiumModal, setHasVisitedPremiumModal] = useState(false); // Track if premium modal has been visited
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);

  // Initialize state with previously selected services when component mounts or initialData changes
  useEffect(() => {
    if (initialData?.services) {
      const serviceIds = initialData.services.map(s => s.id);
      setSelectedServices(serviceIds);
    }
    if (initialData?.selectedHairServices) {
      setSelectedHairServices(initialData.selectedHairServices);
    }
    if (initialData?.selectedNailServices) {
      setSelectedNailServices(initialData.selectedNailServices);
    }
    if (initialData?.selectedSkincareServices) {
      setSelectedSkincareServices(initialData.selectedSkincareServices);
    }
    if (initialData?.selectedMassageServices) {
      setSelectedMassageServices(initialData.selectedMassageServices);
    }
    if (initialData?.selectedPremiumServices) {
      setSelectedPremiumServices(initialData.selectedPremiumServices);
    }
  }, [initialData]);


  const handleSelectService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      // Remove from selected
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      // Add to selected
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleContinue = () => {
    onContinue?.({ 
      services: SERVICES.filter((s) => selectedServices.includes(s.id)), 
      selectedHairServices, 
      selectedNailServices,
      selectedSkincareServices,
      selectedMassageServices,
      selectedPremiumServices
    });
  };

  const handleHairContinue = (data) => {
    // When user continues/saves from hair services modal
    setSelectedHairServices(data.services); // Store the selected hair services
    setHasVisitedHairModal(true); // Mark as visited
    
    // Add Hair Services ID only if there are services selected, otherwise remove it
    if (data.services.length > 0) {
      if (!selectedServices.includes(1)) {
        setSelectedServices([...selectedServices, 1]);
      }
    } else {
      // Remove Hair Services ID if all services are deselected
      setSelectedServices(selectedServices.filter((id) => id !== 1));
    }
    
    setShowHairModal(false); // Return to phase_two
  };

  const handleNailContinue = (data) => {
    // When user continues/saves from nail services modal
    setSelectedNailServices(data.services);
    setHasVisitedNailModal(true);
    
    // Add Nail Services ID only if there are services selected, otherwise remove it
    if (data.services.length > 0) {
      if (!selectedServices.includes(2)) {
        setSelectedServices([...selectedServices, 2]);
      }
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== 2));
    }
    
    setShowNailModal(false);
  };

  const handleSkincareeContinue = (data) => {
    // When user continues/saves from skincare services modal
    setSelectedSkincareServices(data.services);
    setHasVisitedSkincareModal(true);
    
    // Add Skincare Services ID only if there are services selected, otherwise remove it
    if (data.services.length > 0) {
      if (!selectedServices.includes(3)) {
        setSelectedServices([...selectedServices, 3]);
      }
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== 3));
    }
    
    setShowSkincareModal(false);
  };

  const handleMassageContinue = (data) => {
    // When user continues/saves from massage services modal
    setSelectedMassageServices(data.services);
    setHasVisitedMassageModal(true);
    
    // Add Massage Services ID only if there are services selected, otherwise remove it
    if (data.services.length > 0) {
      if (!selectedServices.includes(4)) {
        setSelectedServices([...selectedServices, 4]);
      }
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== 4));
    }
    
    setShowMassageModal(false);
  };

  const handlePremiumContinue = (data) => {
    // When user continues/saves from premium services modal
    setSelectedPremiumServices(data.services);
    setHasVisitedPremiumModal(true);
    
    // Add Premium Services ID only if there are services selected, otherwise remove it
    if (data.services.length > 0) {
      if (!selectedServices.includes(5)) {
        setSelectedServices([...selectedServices, 5]);
      }
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== 5));
    }
    
    setShowPremiumModal(false);
  };

  if (showHairModal) {
    return <HairServicesModal onBack={() => setShowHairModal(false)} onContinue={handleHairContinue} initialSelected={selectedHairServices.map((s) => s.id)} isUpdating={hasVisitedHairModal} />;
  }

  if (showNailModal) {
    return <NailServicesModal onBack={() => setShowNailModal(false)} onContinue={handleNailContinue} initialSelected={selectedNailServices.map((s) => s.id)} isUpdating={hasVisitedNailModal} />;
  }

  if (showSkincareModal) {
    return <SkincareServicesModal onBack={() => setShowSkincareModal(false)} onContinue={handleSkincareeContinue} initialSelected={selectedSkincareServices.map((s) => s.id)} isUpdating={hasVisitedSkincareModal} />;
  }

  if (showMassageModal) {
    return <MassageServicesModal onBack={() => setShowMassageModal(false)} onContinue={handleMassageContinue} initialSelected={selectedMassageServices.map((s) => s.id)} isUpdating={hasVisitedMassageModal} />;
  }

  if (showPremiumModal) {
    return <PremiumServicesModal onBack={() => setShowPremiumModal(false)} onContinue={handlePremiumContinue} initialSelected={selectedPremiumServices.map((s) => s.id)} isUpdating={hasVisitedPremiumModal} />;
  }

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
              isSelected={selectedServices.includes(svc.id)}
              onSelect={handleSelectService}
              onOpenHairModal={() => setShowHairModal(true)}
              onOpenNailModal={() => setShowNailModal(true)}
              onOpenSkincareModal={() => setShowSkincareModal(true)}
              onOpenMassageModal={() => setShowMassageModal(true)}
              onOpenPremiumModal={() => setShowPremiumModal(true)}
              selectedHairServicesCount={svc.id === 1 ? selectedHairServices.length : 0}
              selectedNailServicesCount={svc.id === 2 ? selectedNailServices.length : 0}
              selectedSkincareServicesCount={svc.id === 3 ? selectedSkincareServices.length : 0}
              selectedMassageServicesCount={svc.id === 4 ? selectedMassageServices.length : 0}
              selectedPremiumServicesCount={svc.id === 5 ? selectedPremiumServices.length : 0}
            />
          ))}
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="appt-footer">
        {selectedServices.length < 1 && (
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
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button
            onClick={() => setShowCancelConfirm(true)}
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
        isOpen={showCancelConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your booking progress will be lost."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
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