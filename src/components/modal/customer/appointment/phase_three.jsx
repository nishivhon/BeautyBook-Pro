import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ConfirmationDialog } from "../confirmation_dialog";
import { fetchStaffWithAnyOption } from "../../../../services/staffApi";

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

const BOOKING_MODAL_THEME_STYLE_ID = "booking-modal-theme-phase-three";

const BOOKING_MODAL_THEME_CSS = `
  .booking-modal-theme,
  .booking-modal-theme * {
    color-scheme: dark;
  }

  .booking-modal-theme .appt-root {
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

  .booking-modal-theme .appt-footer {
    border-top: 1px solid rgba(152, 143, 129, 0.18) !important;
  }

  .booking-modal-theme .appt-progress {
    background: rgba(12, 10, 9, 0.6) !important;
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  .booking-modal-theme .appt-body {
    background: #070605 !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-back-btn,
  .booking-modal-theme .appt-header-title,
  .booking-modal-theme .appt-section-title,
  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .appt-step-label,
  .booking-modal-theme .stylist-name,
  .booking-modal-theme .stylist-unavailable-tag,
  .booking-modal-theme .stylist-initial {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .stylist-unavailable-tag {
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

  .booking-modal-theme .stylist-row {
    background: #11100d !important;
    border: 1px solid rgba(221, 144, 29, 0.12) !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .stylist-row.selected {
    background: rgba(221, 144, 29, 0.14) !important;
    border-color: rgba(221, 144, 29, 0.55) !important;
    box-shadow: 0 0 0 1px rgba(221, 144, 29, 0.15) inset !important;
  }

  .booking-modal-theme .stylist-row.unavailable {
    opacity: 0.65 !important;
  }

  .booking-modal-theme .stylist-avatar {
    background: rgba(221, 144, 29, 0.16) !important;
    border: 1px solid rgba(221, 144, 29, 0.25) !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .stylist-avatar.muted {
    background: rgba(17, 16, 13, 0.75) !important;
    border-color: rgba(152, 143, 129, 0.18) !important;
  }

  .booking-modal-theme .stylist-row:hover:not(:disabled) {
    border-color: rgba(221, 144, 29, 0.35) !important;
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

  .booking-modal-theme .appt-body::-webkit-scrollbar {
    width: 12px !important;
    height: 12px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-track {
    background: rgba(19, 19, 19, 0.4) !important;
    border-radius: 10px !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb {
    background: rgba(221, 144, 29, 0.9) !important;
    border-radius: 10px !important;
    border: 2px solid transparent !important;
    background-clip: padding-box !important;
  }

  .booking-modal-theme .appt-body::-webkit-scrollbar-thumb:hover {
    background: rgba(221, 144, 29, 1) !important;
  }

  .booking-modal-theme .appt-body {
    scrollbar-width: thin;
    scrollbar-color: rgba(221, 144, 29, 0.9) rgba(19, 19, 19, 0.4);
  }
`;

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
  in_service: staff.in_service,
  unavailable: staff.unavailable, // API already calculates this
});

const normalizeSpecialties = (specialties) => {
  if (Array.isArray(specialties)) {
    return specialties
      .flatMap(item => typeof item === 'string' ? item.split(',') : [item])
      .map(item => String(item).trim())
      .filter(Boolean);
  }

  if (typeof specialties === 'string') {
    return specialties
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

const formatTimeTo12Hour = (timeValue) => {
  if (!timeValue) return "";

  const [hours, minutes] = String(timeValue).split(":");
  const hourNumber = Number.parseInt(hours, 10);

  if (!Number.isFinite(hourNumber)) return String(timeValue);

  const period = hourNumber >= 12 ? "PM" : "AM";
  const hour12 = hourNumber % 12 || 12;
  return `${hour12}:${minutes || "00"} ${period}`;
};

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
const BookingHeader = ({ onBack, title = "Book Appointment" }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBack} aria-label="Go back">
      <BackArrowIcon />
      Back
    </button>
    <h1 className="appt-header-title">{title}</h1>
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress bar — Phase 3 state ── */
/* Steps 1+2 done (✓), step 3 active, step 4 inactive */
/* Connectors 1→2 and 2→3 are amber; connector 3→4 is gray */
const ProgressIndicator = ({ currentStep = 3, steps = STEPS }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {steps.map((step, i) => {
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
            {i < steps.length - 1 && (
              <div className={`appt-step-line${lineAmber ? " done" : ""}`} />

            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {steps.map((step) => (
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
const StylistRow = ({ stylist, isSelected, onSelect, showTime = true, showNext = true }) => {
  const statusLabel = stylist.status === "no slots" ? "No Slots" : "Unavailable";
  const hasNextAppointment = Boolean(stylist.nextAppointmentTime);

  const inServiceValue = (stylist.in_service || '').toString().trim().toLowerCase();
  const isCurrentlyInService = inServiceValue === 'in-service';
  const isAvailableState = inServiceValue === 'avail' || stylist.status === 'avail';
  const acceptsWalkIn = stylist.walk_in === true;

  // Custom status messages for walk-in flows
  const walkInDisabledMessage = isAvailableState && !acceptsWalkIn ? 'Not accepting walk-in' : null;
  const inServiceMessage = isCurrentlyInService ? 'Currently in-service' : null;

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
          <div style={{ marginTop: 4, display: "inline-flex", gap: 8, flexWrap: "wrap" }}>
            {showTime && <span className="stylist-unavailable-tag">{stylist.totalSelectedTime || 0} min total</span>}
            {showTime && showNext && <span>•</span>}
            {showNext && <span className="stylist-unavailable-tag">{hasNextAppointment ? `Next: ${formatTimeTo12Hour(stylist.nextAppointmentTime)}` : "No next appointment"}</span>}
          </div>
          {/* Priority messages: in-service > not-accepting-walkin > generic unavailable */}
          {isCurrentlyInService && <span className="stylist-unavailable-tag">{inServiceMessage}</span>}
          {!isCurrentlyInService && walkInDisabledMessage && <span className="stylist-unavailable-tag">{walkInDisabledMessage}</span>}
          {!isCurrentlyInService && !walkInDisabledMessage && stylist.unavailable && <span className="stylist-unavailable-tag">{statusLabel}</span>}
        </div>
      </div>
    </button>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT — Phase 3
══════════════════════════════════════════ */
export const AppointmentFormPhase3 = ({ onBack, onContinue, onCancel, initialData, headerTitle = "Book Appointment", stepLabels = STEPS, showTime = true, showNext = true, isWalkIn = false }) => {
  const [selected, setSelected] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [stylists, setStylists] = useState([ANY_STYLIST]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(BOOKING_MODAL_THEME_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BOOKING_MODAL_THEME_STYLE_ID;
    style.textContent = BOOKING_MODAL_THEME_CSS;
    document.head.appendChild(style);
  }, []);

  // Extract ALL service categories from selected services (Phase 2)
  const selectedCategories = useMemo(() => {
    const categories = initialData?.services?.map(s => s.category).filter(Boolean) || [];
    // Get unique categories
    return [...new Set(categories)];
  }, [initialData?.services]);

  const totalSelectedTime = useMemo(() => {
    const services = initialData?.services || [];

    return services.reduce((total, service) => {
      const rawValue = service.est_time ?? service.estTime ?? service.duration ?? 0;
      const parsedValue = typeof rawValue === 'string'
        ? Number.parseInt(rawValue, 10)
        : Number(rawValue);

      return total + (Number.isFinite(parsedValue) ? parsedValue : 0);
    }, 0);
  }, [initialData?.services]);

  // Fetch staff from API on component mount and filter by category
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [staffResponse, appointmentsResponse] = await Promise.all([
          fetchStaffWithAnyOption(),
          fetch('/api/appointments/read/by-status?status=pending')
        ]);

        const response = staffResponse;
        const filteredStaff = response.staff || [];
        let pendingAppointments = [];

        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          pendingAppointments = appointmentsData.appointments || [];
        }
        
        console.log('[Phase3] Selected categories:', selectedCategories);
        console.log('[Phase3] All staff specialties:', filteredStaff.map(s => ({ 
          name: s.names, 
          specialty: s.category_specialty,
          type: typeof s.category_specialty
        })));
        
        // Filter staff: if categories selected, show only staff matching ANY of those categories
        // If no categories selected, show all staff
        const staffToShow = selectedCategories.length > 0
          ? filteredStaff.filter(staff => {
              const staffCategories = normalizeSpecialties(staff.category_specialty);
              
              // Check if any selected category is in the staff's categories (case-insensitive)
              const matches = selectedCategories.some(category => 
                staffCategories.some(staffCat => 
                  String(staffCat).toLowerCase() === String(category).toLowerCase()
                )
              );
              
              if (matches) {
                console.log(`[Phase3] ✓ ${staff.names} matches categories:`, staffCategories);
              }
              
              return matches;
            })
          : filteredStaff;

        const nextAppointmentByStaff = pendingAppointments.reduce((map, appointment) => {
          if (!appointment?.staff || !appointment?.time) {
            return map;
          }

          const key = String(appointment.staff).toLowerCase();
          const existing = map.get(key);
          const currentMinutes = appointment.time ? Number.parseInt(String(appointment.time).split(':')[0], 10) * 60 + Number.parseInt(String(appointment.time).split(':')[1] || '0', 10) : Number.MAX_SAFE_INTEGER;
          const existingMinutes = existing?.time ? Number.parseInt(String(existing.time).split(':')[0], 10) * 60 + Number.parseInt(String(existing.time).split(':')[1] || '0', 10) : Number.MAX_SAFE_INTEGER;

          if (!existing || currentMinutes < existingMinutes) {
            map.set(key, appointment);
          }

          return map;
        }, new Map());
        
        console.log('[Phase3] Filtered staff count:', staffToShow.length, '/ total:', filteredStaff.length);
        console.log('[Phase3] Staff to show:', staffToShow.map(s => s.names));
        console.log('[Phase3] Pending appointments for stylist timing:', pendingAppointments.length);
        
        // Build stylists array with "Any available" option first
        const transformedStylists = [
          response.any,
          ...staffToShow.map((staff) => {
            const stylist = transformStaffToStylist(staff);
            const nextAppointment = nextAppointmentByStaff.get(String(staff.names).toLowerCase());

            // If this is a walk-in flow and the staff doesn't accept walk-ins, or is currently in-service, mark unavailable
            const staffInServiceValue = (staff.in_service || '').toString().trim().toLowerCase();
            const staffIsInService = staffInServiceValue === 'in-service';
            const disabledForWalkIn = isWalkIn && (staff.walk_in === false || staff.walk_in === 0 || staffIsInService);

            return {
              ...stylist,
              nextAppointmentTime: nextAppointment?.time || null,
              nextAppointmentName: nextAppointment?.name || null,
              totalSelectedTime,
              walk_in: staff.walk_in === true,
              in_service: staff.in_service,
              unavailable: stylist.unavailable || disabledForWalkIn || staffIsInService,
            };
          })
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
  }, [selectedCategories, totalSelectedTime]);

  const handleContinue = () => {
    onContinue?.({ stylist: stylists.find((s) => s.id === selected) });
  };

  const handleBack = () => {
    onBack?.({ stylist: stylists.find((s) => s.id === selected) });
  };

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  const handleExitRequest = () => {
    setShowBackdropConfirm(true);
  };

  return (
    <>
      {createPortal(
        <div 
          className={`appt-backdrop ${BOOKING_MODAL_THEME_CLASS}`}
          data-theme="dark"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleExitRequest();
            }
          }}
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
        <div className="appt-root" onClick={(e) => e.stopPropagation()} style={{ ...BOOKING_MODAL_THEME_VARS, pointerEvents: 'auto' }}>
          <BookingHeader onBack={handleBack} title={headerTitle} />
          <ProgressIndicator currentStep={3} steps={stepLabels} />

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
                  showTime={showTime}
                  showNext={showNext}
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
              marginRight: "12px",
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
        </div>,
        document.body
      )}

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