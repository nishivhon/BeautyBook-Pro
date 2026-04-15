import { useState, useEffect } from "react";
import { ConfirmationDialog } from "../confirmation_dialog";

const CalendarSmIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={18}>
    <rect x="1" y="2.5" width="16" height="14" rx="2" stroke="white" strokeWidth="1.4" fill="none"/>
    <path d="M5.5 1v3M12.5 1v3" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="1" y1="8" x2="17" y2="8" stroke="white" strokeWidth="1.4"/>
    <circle cx="5.5" cy="11.5" r="1" fill="white"/>
    <circle cx="9"   cy="11.5" r="1" fill="white"/>
    <circle cx="12.5" cy="11.5" r="1" fill="white"/>
    <circle cx="5.5" cy="14.5" r="1" fill="white"/>
    <circle cx="9"   cy="14.5" r="1" fill="white"/>
  </svg>
);

const ClockSmIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={18}>
    <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.4" fill="none"/>
    <path d="M9 4.5v5l3 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

// Convert 24-hour format (HH:MM) to 12-hour format (H:MM AM/PM)
const convertTo12HourFormat = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

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
const ProgressIndicator = ({ currentStep = 1 }) => (
  <div className="appt-progress">
    {/* circles + connectors row */}
    <div className="appt-progress-track">
      {STEPS.map((step, i) => (
        <div key={step.number} className="appt-progress-item">
          <div className={`appt-step-circle${step.number === currentStep ? " active" : ""}`}>
            {step.number}
          </div>
          {i < STEPS.length - 1 && <div className="appt-step-line" />}
        </div>
      ))}
    </div>
    {/* labels row */}
    <div className="appt-progress-labels">
      {STEPS.map((step) => (
        <span key={step.number} className={`appt-step-label${step.number === currentStep ? " active" : ""}`}>
          {step.label}
        </span>
      ))}
    </div>
  </div>
);

// Hardcoded times for display
const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export const AppointmentForm = ({ onBack, onContinue }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDateInput, setShowDateInput] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  
  // State for dates and availability
  const [dateOptions, setDateOptions] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // Generate dates for next 5 days
  useEffect(() => {
    const today = new Date();
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const datesData = [];

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
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
      
      fetch(`/api/appointments/available-slots?date=${selectedDateObj.date}`)
        .then(res => res.json())
        .then(data => {
          console.log(`[Phase1] Available slots for ${selectedDateObj.date}:`, data);
          if (data.success && data.slots && data.slots.length > 0) {
            // Get times that are available (availability = true)
            // Strip seconds from time_24 (convert 10:30:00 to 10:30)
            const availableTimes = data.slots.map(slot => slot.time_24.split(':').slice(0, 2).join(':'));
            console.log(`[Phase1] Available times: ${availableTimes.join(', ')}`);
            // Unavailable times are ones NOT in the available list
            const unavailable = ALL_TIME_SLOTS.filter(time => !availableTimes.includes(time));
            console.log(`[Phase1] Unavailable times: ${unavailable.join(', ')}`);
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
  }, [selectedDate, dateOptions]);

  const handleBackClick = () => {
    setShowBackdropConfirm(true);
  };

  const handleContinue = () => {
    const dateObj = selectedDate !== null ? dateOptions[selectedDate] : null;
    const time = selectedTime !== null ? ALL_TIME_SLOTS[selectedTime] : manualTime;

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

  const handleTimeInputConfirm = () => {
    if (manualTime) {
      setSelectedTime(null);
      setShowTimeInput(false);
    }
  };

  // Validation helper functions
  const isDateInPast = (dateStr) => {
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const isTimeWithinHours = (timeStr) => {
    // timeStr format: "HH:MM" (24-hour format from input)
    const [hours] = timeStr.split(':').map(Number);
    return hours >= 8 && hours < 20; // 8am to before 8pm
  };

  // Validation checks
  const isDateSelected = selectedDate !== null || manualDate;
  const isTimeSelected = selectedTime !== null || manualTime;
  const isDateValid = !manualDate || !isDateInPast(manualDate);
  const isTimeValid = !manualTime || isTimeWithinHours(manualTime);
  const isFormValid = isDateSelected && isTimeSelected && isDateValid && isTimeValid;

  // Generate validation message
  const getValidationMessage = () => {
    if (!isDateSelected || !isTimeSelected) {
      if (!isDateSelected && !isTimeSelected) return "Please select a date and time";
      if (!isDateSelected) return "Please select a date";
      return "Please select a time";
    }
    if (!isDateValid) return "Selected date has already passed";
    if (!isTimeValid) return "Operating hours are 8:00 AM to 8:00 PM";
    return "";
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
          <BookingHeader onBack={onBack} onBackClick={handleBackClick} />
          <ProgressIndicator currentStep={1} />

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
              const svgs = e.currentTarget.querySelectorAll('svg');
              svgs.forEach(svg => svg.style.stroke = "#dd901d");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "white";
              const svgs = e.currentTarget.querySelectorAll('svg');
              svgs.forEach(svg => svg.style.stroke = "white");
            }}
          >
            <CalendarSmIcon />
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
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          handleDateSelect();
                        }}
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
          <div 
            className="appt-picker-label" 
            style={{cursor: "pointer"}}
            onClick={() => setShowTimeInput(!showTimeInput)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#dd901d";
              const svgs = e.currentTarget.querySelectorAll('svg');
              svgs.forEach(svg => svg.style.stroke = "#dd901d");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "white";
              const svgs = e.currentTarget.querySelectorAll('svg');
              svgs.forEach(svg => svg.style.stroke = "white");
            }}
          >
            <ClockSmIcon />
            <span>Select Time</span>
          </div>
          {!showTimeInput ? (
            manualTime ? (
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
                  {convertTo12HourFormat(manualTime)}
                </div>
                <button
                  onClick={() => {
                    setShowTimeInput(true);
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
                    const isDisabled = unavailableTimes.includes(time);
                    const handleTimeSelect = () => !isDisabled && setSelectedTime(selectedTime === i ? null : i);
                    return (
                      <button
                        key={i}
                        onClick={handleTimeSelect}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          handleTimeSelect();
                        }}
                        className={`appt-time-chip${selectedTime === i ? " selected" : ""}${isDisabled ? " disabled" : ""}`}
                        aria-pressed={selectedTime === i}
                        style={isDisabled ? { opacity: 0.6, cursor: "not-allowed", pointerEvents: "auto" } : { pointerEvents: "auto" }}
                      >
                        {convertTo12HourFormat(time)}
                      </button>
                    );
                  })
                )}
              </div>
            )
          ) : (
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <input
                type="time"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
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
                onClick={handleTimeInputConfirm}
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
                  setShowTimeInput(false);
                  setManualTime("");
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

      </div>

      {/* ── Continue CTA ── */}
      <div className="appt-footer">
        {!isFormValid && (
          <p style={{
            color: "#ff6b6b",
            fontSize: "0.85rem",
            marginBottom: "10px",
            textAlign: "center",
            fontWeight: "500",
          }}>
            {getValidationMessage()}
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
            disabled={!isFormValid}
            style={{
              flex: 1,
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