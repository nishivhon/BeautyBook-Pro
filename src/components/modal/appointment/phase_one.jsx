import { useState } from "react";

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

const DATE_OPTIONS = [
  { day: "Today", date: "Dec 8",  slots: 3 },
  { day: "Tue",   date: "Dec 9",  slots: 8 },
  { day: "Wed",   date: "Dec 10", slots: 5 },
  { day: "Thur",  date: "Dec 11", slots: 6 },
  { day: "Fri",   date: "Dec 12", slots: 4 },
];

const TIME_OPTIONS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "2:00 PM", "2:30 PM", "3:00 PM",  "3:30 PM",  "4:00 PM",
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

export const AppointmentForm = ({ onBack, onContinue }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDateInput, setShowDateInput] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");

  const handleContinue = () => {
    onContinue?.({
      date: selectedDate !== null ? DATE_OPTIONS[selectedDate] : { date: manualDate },
      time: selectedTime !== null ? TIME_OPTIONS[selectedTime] : manualTime,
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
    <div className="appt-root">

      <BookingHeader onBack={onBack} />
      <ProgressIndicator currentStep={1} />

      {/* ── Scrollable body ── */}
      <div className="appt-body">

        {/* Section heading */}
        <div className="appt-section-heading">
          <p className="appt-section-title">Select Date &amp; Time</p>
          <p className="appt-section-sub">Choose your preferred schedule</p>
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
                {DATE_OPTIONS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(selectedDate === i ? null : i)}
                    className={`appt-date-card${selectedDate === i ? " selected" : ""}`}
                    aria-pressed={selectedDate === i}
                  >
                    <span className="appt-date-day">{item.day}</span>
                    <span className="appt-date-num">{item.date}</span>
                    <span className="appt-date-slots">{item.slots} slots</span>
                  </button>
                ))}
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
                }}>
                  {manualTime}
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
                {TIME_OPTIONS.map((time, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(selectedTime === i ? null : i)}
                    className={`appt-time-chip${selectedTime === i ? " selected" : ""}`}
                    aria-pressed={selectedTime === i}
                  >
                    {time}
                  </button>
                ))}
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
        <button 
          className="appt-continue-btn" 
          onClick={handleContinue}
          disabled={!isFormValid}
          style={{
            opacity: isFormValid ? 1 : 0.5,
            cursor: isFormValid ? "pointer" : "not-allowed",
          }}
        >
          Continue →
        </button>
      </div>

    </div>
  );
};

export default AppointmentForm;