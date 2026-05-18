import { useState, useEffect, useRef } from "react";
import { DynamicServiceModal } from "./services/dynamic_service";
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

// Service grouping configuration - maps database categories to service groups
const SERVICE_GROUP_CONFIG = {
  'Hair Services': {
    keywords: ['Hair Color', 'Hair Cut', 'Highlights', 'Rebonding', 'Styling', 'Hair Treatment'],
    Icon: HairIcon,
    desc: "Haircuts, Hair Styling, Hair Color, & Hair Treatment"
  },
  'Nail Services': {
    keywords: ['Nail Care', 'Manicure', 'Pedicure', 'Nail Art'],
    Icon: NailIcon,
    desc: "Manicure, pedicure & nail art"
  },
  'Skin Care Services': {
    keywords: ['Treatment', 'Skincare', 'Skin Care', 'Facial'],
    Icon: SkincareIcon,
    desc: "Facials, treatments & body care"
  },
  'Massage Services': {
    keywords: ['Massage', 'Massage Services'],
    Icon: MassageIcon,
    desc: "Relaxation & therapeutic bodywork"
  },
  'Premium Services': {
    keywords: ['Premium Services', 'Premium', 'Other'],
    Icon: PremiumIcon,
    desc: "Exclusive packages & VIP experiences"
  },
};

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
const ServiceCard = ({ service, isSelected, onSelect, onOpenServiceModal, selectedServicesCount = 0 }) => (
  <button
    className={`appt-svc-card${isSelected ? " selected" : ""}`}
    onClick={() => onOpenServiceModal(service.id)}
    aria-pressed={isSelected}
    style={{
      transition: "all 0.3s ease",
      position: "relative",
    }}
    onMouseEnter={(e) => {
      if (!isSelected) {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
      }
    }}
    onMouseLeave={(e) => {
      if (!isSelected) {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }
    }}
  >
    <p className="appt-svc-title">{service.title}</p>
    <p className="appt-svc-desc">{service.desc}</p>
    
    {/* Service count badge */}
    {isSelected && selectedServicesCount > 0 && (
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
        {selectedServicesCount}
      </div>
    )}
  </button>
);

export const AppointmentFormPhase2 = ({ onBack, onContinue, onCancel, initialData }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  
  // Dynamic modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [currentModalCategory, setCurrentModalCategory] = useState(null);
  const [currentModalKeywords, setCurrentModalKeywords] = useState([]);
  
  // Store selected services by service card ID
  const [selectedServicesByCard, setSelectedServicesByCard] = useState({
    1: [], // Hair Services
    2: [], // Nail Services
    3: [], // Skin Care Services
    4: [], // Massage Services
    5: [], // Premium Services
  });
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [sortedServices, setSortedServices] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [dynamicCategoryKeywordsMap, setDynamicCategoryKeywordsMap] = useState({});
  const promoCodeRef = useRef(null);

  // Fetch categories dynamically and generate service cards
  useEffect(() => {
    const fetchAndGenerateServiceCards = async () => {
      try {
        console.log('[Phase2] Fetching service categories from API');
        setCategoriesLoading(true);
        
        const response = await fetch('/api/services/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[Phase2] Service categories fetched:', data.categories);
        
        if (!data.categories || data.categories.length === 0) {
          console.log('[Phase2] No categories returned');
          setSortedServices([]);
          setCategoriesLoading(false);
          return;
        }
        
        // Create a card for each unique database category
        let generatedServiceCards = data.categories.map((category, index) => ({
          id: index + 1,
          title: category.name,
          desc: category.description || `Services in ${category.name}`,
          Icon: HairIcon, // Default icon, you can customize per category later
          keywords: [category.name] // Each card filters by its own category name
        }));
        
        // Move 'Other' category to the end
        const otherIndex = generatedServiceCards.findIndex(card => card.title === 'Other');
        if (otherIndex > -1) {
          const [otherCard] = generatedServiceCards.splice(otherIndex, 1);
          generatedServiceCards.push(otherCard);
        }
        
        // Reassign IDs after reordering
        generatedServiceCards = generatedServiceCards.map((card, index) => ({
          ...card,
          id: index + 1
        }));
        
        console.log('[Phase2] Generated service cards:', generatedServiceCards.map(s => ({ id: s.id, title: s.title })));
        
        // Build dynamic categoryKeywordsMap for the modal
        const newCategoryKeywordsMap = {};
        generatedServiceCards.forEach(card => {
          newCategoryKeywordsMap[card.id] = {
            name: card.title,
            keywords: card.keywords
          };
        });
        
        setDynamicCategoryKeywordsMap(newCategoryKeywordsMap);
        setSortedServices(generatedServiceCards);
      } catch (err) {
        console.error('[Phase2] Error fetching service categories:', err);
        setSortedServices([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchAndGenerateServiceCards();
  }, []);

  // Initialize state with previously selected services when component mounts or initialData changes
  useEffect(() => {
    if (initialData?.services) {
      const serviceIds = initialData.services.map(s => s.id);
      setSelectedServices(serviceIds);
    }
    if (initialData?.selectedServicesByCard) {
      setSelectedServicesByCard(initialData.selectedServicesByCard);
    }
    if (initialData?.promoCode) {
      setPromoCode(initialData.promoCode);
    }
  }, [initialData]);

  // Scroll to promo code section when a service is selected
  useEffect(() => {
    if (selectedServices.length > 0 && promoCodeRef.current) {
      setTimeout(() => {
        promoCodeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [selectedServices]);

  const openServiceModal = (serviceCardId) => {
    const categoryInfo = dynamicCategoryKeywordsMap[serviceCardId];
    if (categoryInfo) {
      setCurrentModalCategory(categoryInfo.name);
      setCurrentModalKeywords(categoryInfo.keywords);
      setShowServiceModal(true);
    }
  };

  const handleServiceModalContinue = (serviceCardId) => (data) => {
    console.log(`[Phase2] Service modal closed for card ${serviceCardId}:`, data);
    
    // Update selected services for this card
    setSelectedServicesByCard(prev => ({
      ...prev,
      [serviceCardId]: data.services
    }));
    
    // Update overall selected services
    if (data.services.length > 0) {
      if (!selectedServices.includes(serviceCardId)) {
        setSelectedServices([...selectedServices, serviceCardId]);
      }
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceCardId));
    }
    
    setShowServiceModal(false);
  };

  const handleSelectService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleContinue = () => {
    // Collect all actual services from selectedServicesByCard
    const allSelectedServices = [];
    Object.values(selectedServicesByCard).forEach(services => {
      if (Array.isArray(services)) {
        allSelectedServices.push(...services);
      }
    });

    console.log('[Phase2] handleContinue - collected services:', allSelectedServices);
    
    onContinue?.({ 
      services: allSelectedServices, 
      selectedServicesByCard, 
      promoCode
    });
  };

  // No need for separate modal handlers anymore - just render the dynamic modal

  if (showServiceModal) {
    // Find the card ID from currentModalCategory
    const cardId = Object.keys(dynamicCategoryKeywordsMap).find(
      key => dynamicCategoryKeywordsMap[key].name === currentModalCategory
    );
    
    return (
      <DynamicServiceModal
        categoryName={currentModalCategory}
        categoryKeywords={currentModalKeywords}
        onBack={() => setShowServiceModal(false)}
        onContinue={handleServiceModalContinue(cardId)}
        initialSelected={currentModalCategory && cardId ? selectedServicesByCard[cardId]?.map(s => s.id) || [] : []}
        isUpdating={false}
      />
    );
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
          {sortedServices.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              isSelected={selectedServices.includes(svc.id)}
              onSelect={handleSelectService}
              onOpenServiceModal={openServiceModal}
              selectedServicesCount={selectedServicesByCard[svc.id]?.length || 0}
            />
          ))}
        </div>

        {/* Promo Code Section */}
        <div ref={promoCodeRef} style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e5e5e5" }}>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "8px",
            fontFamily: "Inter, sans-serif",
          }}>
            Promo/Discount Code <span style={{ color: "#999", fontWeight: "400" }}>(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1.5px solid #e5e5e5",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontFamily: "Inter, sans-serif",
              boxSizing: "border-box",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#dd901d";
              e.target.style.boxShadow = "0 0 0 3px rgba(221, 144, 29, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e5e5";
              e.target.style.boxShadow = "none";
            }}
          />
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