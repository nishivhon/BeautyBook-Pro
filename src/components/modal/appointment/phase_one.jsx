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

  const handleContinue = () => {
    onContinue?.({
      date: selectedDate !== null ? DATE_OPTIONS[selectedDate] : null,
      time: selectedTime !== null ? TIME_OPTIONS[selectedTime] : null,
    });
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
          <div className="appt-picker-label">
            <CalendarSmIcon />
            <span>Select Date</span>
          </div>
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
        </div>

        {/* ── Time picker ── */}
        <div className="appt-picker-group">
          <div className="appt-picker-label">
            <ClockSmIcon />
            <span>Select Time</span>
          </div>
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
        </div>

      </div>

      {/* ── Continue CTA ── */}
      <div className="appt-footer">
        <button className="appt-continue-btn" onClick={handleContinue}>
          Continue →
        </button>
      </div>

    </div>
  );
};

export default AppointmentForm;