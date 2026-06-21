import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ConfirmationDialog } from "../confirmation_dialog";
import Toast from "../../../toast";
import {
  BookingCalendarIcon,
  BookingClockIcon,
  BookingModalIconSlot,
} from "./bookingModalIcons";

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

const BOOKING_MODAL_THEME_STYLE_ID = "booking-modal-theme-phase-one";

const BOOKING_MODAL_THEME_CSS = `
@media (max-width: 1024px) {
  .booking-modal-theme,
  .booking-modal-theme * {
    color-scheme: dark;
  }

  html[data-theme="light"] .booking-modal-theme .appt-root {
    display: flex !important;
    flex-direction: column !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: calc(100vw - 32px) !important;
    max-width: calc(100vw - 32px) !important;
    height: 520px !important;
    max-height: 520px !important;
    overflow: hidden !important;
  }

  @media (max-width: 480px) {
    html[data-theme="light"] .booking-modal-theme .appt-root {
      width: calc(100vw - 24px) !important;
      height: 480px !important;
      max-height: 480px !important;
    }
  }

  html[data-theme="light"] .booking-modal-theme .appt-header,
  html[data-theme="light"] .booking-modal-theme .appt-root .appt-footer {
    background: #070605 !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-progress {
    background: rgba(12, 10, 9, 0.6) !important;
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-body {
    flex: 1 !important;
    min-height: 0 !important;
    overflow-y: auto !important;
    padding: 12px 12px 10px !important;
    gap: 12px !important;
    background: #070605 !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-root .appt-footer {
    padding: 10px 12px 12px !important;
  }

  html[data-theme="light"] .booking-modal-theme .appt-cancel-btn,
  html[data-theme="light"] .booking-modal-theme .appt-continue-btn {
    min-height: 40px !important;
  }

  .booking-modal-theme .appt-root {
    background: #070605 !important;
    border: 1px solid rgba(221, 144, 29, 0.15) !important;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65) !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-header,
  .booking-modal-theme .appt-root .appt-footer {
    background: #070605 !important;
  }

  .booking-modal-theme .appt-header {
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  .booking-modal-theme .appt-root .appt-footer {
    border-top: 1px solid rgba(152, 143, 129, 0.18) !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
  }

  .booking-modal-theme .appt-progress {
    background: rgba(12, 10, 9, 0.6) !important;
    border-bottom: 1px solid rgba(221, 144, 29, 0.12) !important;
  }

  .booking-modal-theme[data-theme="dark"] .appt-progress {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    padding: 14px 40px 12px !important;
    flex-shrink: 0 !important;
  }

  .booking-modal-theme[data-theme="dark"] .appt-progress-track {
    display: flex !important;
    align-items: center !important;
    width: fit-content !important;
  }

  .booking-modal-theme[data-theme="dark"] .appt-progress-item {
    display: flex !important;
    align-items: center !important;
  }

  .booking-modal-theme[data-theme="dark"] .appt-step-circle {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 36px !important;
    height: 36px !important;
    border-radius: 50% !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 400 !important;
    flex-shrink: 0 !important;
    transition: background 0.25s, color 0.25s !important;
  }

  .booking-modal-theme[data-theme="dark"] .appt-step-line {
    width: 52px !important;
    height: 2px !important;
    flex-shrink: 0 !important;
    transition: background 0.3s !important;
  }

  .booking-modal-theme[data-theme="dark"] .appt-progress-labels {
    display: flex !important;
    align-items: center !important;
    width: 360px !important;
    gap: 0 !important;
  }

  .booking-modal-theme[data-theme="dark"] .appt-step-label {
    width: 90px !important;
    padding: 0 !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 0.72rem !important;
    font-weight: 300 !important;
    text-align: center !important;
    flex-shrink: 0 !important;
    transition: color 0.25s !important;
  }

  .booking-modal-theme .appt-root .booking-phase-warning {
    width: 100% !important;
    text-align: center !important;
    color: #ef4343 !important;
    font-size: 0.85rem !important;
    font-weight: 500 !important;
    line-height: 1.25 !important;
    margin: 0 !important;
  }

  .booking-modal-theme .appt-root .booking-phase-footer-actions {
    width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
    gap: 12px !important;
  }

  .booking-modal-theme .appt-root .booking-phase-footer-top {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .booking-modal-theme .appt-continue-btn {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-section-sub,
  .booking-modal-theme .appt-step-label,
  .booking-modal-theme .appt-date-day,
  .booking-modal-theme .appt-date-num {
    color: #988f81 !important;
  }

  .booking-modal-theme .appt-step-circle {
    background: #231d1a !important;
    color: #988f81 !important;
  }

  .booking-modal-theme .appt-step-circle.active {
    background: #dd901d !important;
    color: #1a0f00 !important;
  }

  .booking-modal-theme .appt-step-line {
    background: rgba(152, 143, 129, 0.25) !important;
  }

  .booking-modal-theme .appt-step-line.done {
    background: #dd901d !important;
  }

  .booking-modal-theme .appt-picker-label {
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-date-card,
  .booking-modal-theme .appt-time-chip {
    background: #11100d !important;
    border: 1px solid rgba(221, 144, 29, 0.12) !important;
    color: #f5f1eb !important;
  }

  .booking-modal-theme .appt-date-card.selected,
  .booking-modal-theme .appt-time-chip.selected {
    background: rgba(221, 144, 29, 0.16) !important;
    border-color: rgba(221, 144, 29, 0.6) !important;
    color: #f5f1eb !important;
    box-shadow: 0 0 0 1px rgba(221, 144, 29, 0.12) inset !important;
  }

  .booking-modal-theme .appt-time-chip.disabled {
    background: rgba(239, 67, 67, 0.16) !important;
    border: 1px solid rgba(239, 67, 67, 0.28) !important;
    color: #ff6b6b !important;
    box-shadow: inset 0 0 0 1px rgba(239,67,67,0.04) !important;
  }
  .booking-modal-theme .appt-time-chip.disabled:hover {
    background: rgba(239, 67, 67, 0.16) !important;
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

}

@media (min-width: 1025px) {
  .booking-modal-theme .appt-root .appt-footer {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
  }

  .booking-modal-theme .appt-root .booking-phase-footer-top {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .booking-modal-theme .appt-root .booking-phase-footer-actions {
    width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
    gap: 12px !important;
    justify-content: flex-end !important;
    flex-wrap: wrap !important;
  }

  .booking-modal-theme .appt-root .booking-phase-warning {
    color: #ef4343 !important;
  }
}
`;

const STEPS = [
  { number: 1, label: "Service", order: 1 },
  { number: 2, label: "Stylist", order: 2 },
  { number: 3, label: "Schedule", order: 3 },
  { number: 4, label: "Confirm", order: 4 },
];

// Convert 24-hour format (HH:MM) to 12-hour format (H:MM AM/PM)
const convertTo12HourFormat = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/* Shake Animation Keyframes */
const shakeKeyframes = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

/* Style injection for shake animation */
if (typeof window !== 'undefined' && !document.getElementById('shake-animation')) {
  const style = document.createElement('style');
  style.id = 'shake-animation';
  style.textContent = shakeKeyframes;
  document.head.appendChild(style);
}

/* ── Header ── */
const BookingHeader = ({ onBack, onBackClick }) => (
  <header className="appt-header">
    <button className="appt-back-btn" onClick={onBackClick || onBack}>
      <svg viewBox="0 0 16 16" fill="none" width={16} height={16}>
        <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </button>
    <h1 className="appt-header-title">Book Appointment</h1>
    {/* invisible spacer to keep title centred */}
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress steps ── */
const ProgressIndicator = ({ currentStep = 3 }) => {
  const currentOrder = currentStep;

  return (
  <div className="appt-progress">
    {/* circles + connectors row */}
    <div className="appt-progress-track">
      {STEPS.map((step, i) => (
        <div key={step.number} className="appt-progress-item">
          <div className={`appt-step-circle${step.order === currentOrder ? " active" : step.order < currentOrder ? " done" : ""}`}>
            {step.order < currentOrder
              ? <svg viewBox="0 0 12 12" fill="none" width={13} height={13}>
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              : step.number
            }
          </div>
          {i < STEPS.length - 1 && <div className={`appt-step-line${step.order < currentOrder ? " done" : ""}`} />}
        </div>
      ))}
    </div>
    {/* labels row */}
    <div className="appt-progress-labels">
      {STEPS.map((step) => (
        <span key={step.number} className={`appt-step-label${step.order === currentOrder ? " active" : step.order < currentOrder ? " done" : ""}`}>
          {step.label}
        </span>
      ))}
    </div>
  </div>
  );
};

// Hardcoded times for display
const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const getManilaDateStr = (date = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(date);

const getCurrentTime24 = () => {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
};

const isPastOrCurrentSlotForDate = (dateStr, time24) => {
  if (!dateStr || !time24) return false;
  return dateStr === getManilaDateStr() && time24 <= getCurrentTime24();
};

export const AppointmentForm = ({ onBack, onContinue, initialData = {} }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDateInput, setShowDateInput] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [shakingTimeSlot, setShakingTimeSlot] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  
  // State for dates and availability
  const [dateOptions, setDateOptions] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(BOOKING_MODAL_THEME_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BOOKING_MODAL_THEME_STYLE_ID;
    style.textContent = BOOKING_MODAL_THEME_CSS;
    document.head.appendChild(style);
  }, []);

  // Auto-hide toast after it becomes visible
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  // Generate dates for next 5 days
  useEffect(() => {
    const today = new Date();
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const datesData = [];

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateStr = getManilaDateStr(currentDate);
      const dayLabel = i === 0 ? "Today" : dayLabels[currentDate.getDay()];
      const dateLabel = `${monthLabels[currentDate.getMonth()]} ${currentDate.getDate()}`;

      datesData.push({
        date: dateStr,
        day: dayLabel,
        dateLabel: dateLabel,
      });
    }

    setDateOptions(datesData);
  }, []);

  // Fetch time availability when a date is selected
  useEffect(() => {
    setSelectedTime(null); // Reset time selection when date changes
    if (selectedDate !== null && selectedDate < dateOptions.length) {
      setLoadingTimes(true);
      const selectedDateObj = dateOptions[selectedDate];

      fetch(`/api/appointments/all-slots?date=${selectedDateObj.date}`)
        .then(res => res.json())
        .then(data => {
          console.log(`[Phase1] All slots for ${selectedDateObj.date}:`, data);
          if (data.success && Array.isArray(data.slots)) {
            const slots = data.slots;

            // Build a map by time (HH:MM)
            const slotsByTime = slots.reduce((m, s) => {
              const t = String(s.time_24).slice(0,5);
              if (!m[t]) m[t] = [];
              m[t].push(s);
              return m;
            }, {});

            const stylistObj = initialData?.stylist || null;
            const selectedStylistValues = [];
            if (stylistObj) {
              if (stylistObj.id !== undefined && stylistObj.id !== null) selectedStylistValues.push(String(stylistObj.id).toLowerCase().trim());
              if (stylistObj.name) selectedStylistValues.push(String(stylistObj.name).toLowerCase().trim());
            }

            const unavailable = ALL_TIME_SLOTS.filter(time => {
              // Past or current times are unavailable
              if (isPastOrCurrentSlotForDate(selectedDateObj.date, time)) return true;

              const rows = slotsByTime[time] || [];

              // If a stylist is selected, block times where that stylist is already assigned
              if (selectedStylistValues.length > 0) {
                return rows.some(r => {
                  const assigned = r.assigned_staff === null || r.assigned_staff === undefined ? "" : String(r.assigned_staff).toLowerCase().trim();
                  return selectedStylistValues.includes(assigned);
                });
              }

              // No stylist selected: if any row is explicitly available, the time is available
              if (rows.some(r => r.available === true)) return false;

              // Otherwise treat as unavailable
              return true;
            });

            setUnavailableTimes(unavailable);
          } else {
            console.warn('[Phase1] No slots returned from API');
            setUnavailableTimes(ALL_TIME_SLOTS); // All unavailable if no data
          }
          setLoadingTimes(false);
        })
        .catch(err => {
          console.error('Error fetching time availability:', err);
          setUnavailableTimes(ALL_TIME_SLOTS); // All unavailable on error
          setLoadingTimes(false);
        });
    } else {
      setUnavailableTimes([]);
    }
  }, [selectedDate, dateOptions, initialData?.stylist?.id, initialData?.stylist?.name]);

  const handleBackClick = () => {
    // Back should navigate to the previous phase, not trigger a cancel prompt.
    onBack?.();
  };

  const handleContinue = () => {
    const dateObj = selectedDate !== null ? dateOptions[selectedDate] : null;
    const time = selectedTime !== null ? ALL_TIME_SLOTS[selectedTime] : null;

    onContinue?.({
      date: dateObj ? dateObj.dateLabel : manualDate,
      dateISO: dateObj ? dateObj.date : manualDate,
      time: time,
    });
  };

  const handleDateInputConfirm = () => {
    if (manualDate) {
      setSelectedDate(null);
      setShowDateInput(false);
    }
  };



  // Validation helper functions
  const isDateInPast = (dateStr) => {
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  // Validation checks
  const isDateSelected = selectedDate !== null || manualDate;
  const isTimeSelected = selectedTime !== null;
  const isDateValid = !manualDate || !isDateInPast(manualDate);
  const isFormValid = isDateSelected && isTimeSelected && isDateValid;

  // Generate validation message
  const getValidationMessage = () => {
    if (!isDateSelected || !isTimeSelected) {
      if (!isDateSelected && !isTimeSelected) return "Please select a date and time";
      if (!isDateSelected) return "Please select a date";
      return "Please select a time";
    }
    if (!isDateValid) return "Selected date has already passed";
    return "";
  };

  const handleBackdropClick = (e) => {
    // Only block if clicking the backdrop itself, not content inside modal
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      setShowBackdropConfirm(true);
    }
  };

  return (
    <>
      {/* Modal rendered via portal at body level to bypass z-index stacking contexts */}
      {createPortal(
        <>
          {/* Toast Notification */}
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, pointerEvents: "none", zIndex: 9999 }}>
            <Toast 
              message="This time slot is not available" 
              type="error" 
              duration={3000}
              isVisible={toastVisible}
            />
          </div>

          <div 
            className={`appt-backdrop ${BOOKING_MODAL_THEME_CLASS}`}
            data-theme="dark"
            onClick={handleBackdropClick}
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
              zIndex: 1000,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(2px)",
              pointerEvents: 'auto'
            }}
          >
            <div className="appt-root" onClick={(e) => e.stopPropagation()} style={{ ...BOOKING_MODAL_THEME_VARS, pointerEvents: 'auto' }}>
              <BookingHeader onBack={onBack} onBackClick={handleBackClick} />
              <ProgressIndicator currentStep={3} />

          {/* ── Scrollable body ── */}
          <div className="appt-body">

        {/* Section heading */}
        <div className="appt-section-heading">
          <p className="appt-section-title">Select Date &amp; Time</p>
          <p className="appt-section-sub">Pick a slot below, or tap the icons to enter your own date & time</p>
        </div>

        {/* ── Date picker ── */}
        <div className="appt-picker-group">
          <div 
            className="appt-picker-label" 
            style={{cursor: "pointer"}}
            onClick={() => setShowDateInput(!showDateInput)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#dd901d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "white";
            }}
          >
            <BookingModalIconSlot size="picker">
              <BookingCalendarIcon />
            </BookingModalIconSlot>
            <span>Select Date</span>
          </div>
          {!showDateInput ? (
            manualDate ? (
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <div style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "rgba(221,144,29,0.15)",
                  border: "1px solid rgba(221,144,29,0.4)",
                  borderRadius: "10px",
                  color: "white",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  animation: "fade-up 0.3s ease forwards",
                }}>
                  {new Date(manualDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <button
                  onClick={() => {
                    setShowDateInput(true);
                  }}
                  style={{
                    padding: "10px 18px",
                    background: "transparent",
                    color: "#dd901d",
                    border: "1px solid #dd901d",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="appt-date-row">
                {dateOptions.length === 0 ? (
                  <p style={{ color: "#988f81", textAlign: "center", padding: "20px" }}>No available dates</p>
                ) : (
                  dateOptions.map((item, i) => {
                    const handleDateSelect = () => setSelectedDate(selectedDate === i ? null : i);
                    return (
                      <button
                        key={i}
                        onClick={handleDateSelect}
                        className={`appt-date-card${selectedDate === i ? " selected" : ""}`}
                        aria-pressed={selectedDate === i}
                      >
                        <span className="appt-date-day">{item.day}</span>
                        <span className="appt-date-num">{item.dateLabel}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )
          ) : (
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                style={{
                  width: "180px",
                  padding: "10px 14px",
                  background: "#231d1a",
                  border: "1px dashed rgba(152,143,129,0.5)",
                  borderRadius: "10px",
                  color: "white",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleDateInputConfirm}
                style={{
                  padding: "10px 18px",
                  background: "#dd901d",
                  color: "black",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#c47f18";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(221,144,29,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#dd901d";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = "scale(0.99)";
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                }}
              >
                Set
              </button>
              <button
                onClick={() => {
                  setShowDateInput(false);
                  setManualDate("");
                }}
                style={{
                  padding: "10px 18px",
                  background: "transparent",
                  color: "#988f81",
                  border: "1px solid #988f81",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(152,143,129,0.1)";
                  e.target.style.borderColor = "#b8aaa0";
                  e.target.style.color = "#d4c7bb";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "#988f81";
                  e.target.style.color = "#988f81";
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Time picker ── */}
        <div className="appt-picker-group">
          <div className="appt-picker-label">
            <BookingModalIconSlot size="picker">
              <BookingClockIcon />
            </BookingModalIconSlot>
            <span>Select Time</span>
          </div>
          <div className="appt-time-grid">
            {selectedDate === null ? (
              <p style={{ color: "#988f81", textAlign: "center", padding: "20px", gridColumn: "1/-1" }}>
                Select a date first
              </p>
            ) : loadingTimes ? (
              <p style={{ color: "#988f81", textAlign: "center", padding: "20px", gridColumn: "1/-1" }}>
                Loading availability...
              </p>
            ) : (
              ALL_TIME_SLOTS.map((time, i) => {
                  const selectedDateObj = selectedDate !== null ? dateOptions[selectedDate] : null;
                  const isPastOrCurrentToday = selectedDateObj ? isPastOrCurrentSlotForDate(selectedDateObj.date, time) : false;
                  const isDisabled = unavailableTimes.includes(time) || isPastOrCurrentToday;
                const handleTimeSelect = () => {
                  if (isDisabled) {
                    // Show shake animation and toast
                    setShakingTimeSlot(i);
                    setToastVisible(true);
                    setTimeout(() => setShakingTimeSlot(null), 600);
                  } else {
                    setSelectedTime(selectedTime === i ? null : i);
                  }
                };
                return (
                  <button
                    key={i}
                    onClick={handleTimeSelect}
                    className={`appt-time-chip${selectedTime === i ? " selected" : ""}${isDisabled ? " disabled" : ""}`}
                    aria-pressed={selectedTime === i}
                    disabled={isDisabled}
                    style={{
                      ...(isDisabled ? {
                        cursor: "not-allowed",
                        pointerEvents: "none",
                        backgroundColor: 'rgba(239,67,67,0.16)',
                        border: '1px solid rgba(239,67,67,0.28)',
                        color: '#ff6b6b'
                      } : { pointerEvents: "auto" }),
                      ...(shakingTimeSlot === i ? { animation: "shake 0.6s ease-in-out" } : {}),
                    }}
                  >
                    {convertTo12HourFormat(time)}
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ── Continue CTA ── */}
      <div className="appt-footer">
        <div className="booking-phase-footer-top">
          {!isFormValid && (
            <p className="booking-phase-warning" style={{ textAlign: "center", width: "100%" }}>
              {getValidationMessage()}
            </p>
          )}
        </div>

        <div className="booking-phase-footer-actions">
          <button
            onClick={() => setShowCancelConfirm(true)}
            style={{
              flex: 1,
              minWidth: 0,
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
            disabled={!isFormValid}
            style={{
              flex: 1,
              minWidth: 0,
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
        </div>
        </>,
        document.body
      )}

      {/* Cancel Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showBackdropConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your scheduling progress will be lost."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={() => {
          setShowBackdropConfirm(false);
          onBack?.();
        }}
        onCancel={() => setShowBackdropConfirm(false)}
      />
      <ConfirmationDialog
        isOpen={showCancelConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your scheduling progress will be lost."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={() => {
          setShowCancelConfirm(false);
          onBack?.();
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
};

export default AppointmentForm;