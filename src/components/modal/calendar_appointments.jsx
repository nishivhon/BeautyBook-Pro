import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeftIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// SAMPLE APPOINTMENT DATA
// ═══════════════════════════════════════════════════════════════════

const APPOINTMENTS_DATA = {
  "2024-12-01": 3,
  "2024-12-02": 5,
  "2024-12-03": 2,
  "2024-12-04": 4,
  "2024-12-05": 6,
  "2024-12-06": 3,
  "2024-12-07": 7,
  "2024-12-08": 2,
  "2024-12-09": 4,
  "2024-12-10": 5,
  "2024-12-11": 3,
  "2024-12-12": 8,
  "2024-12-13": 4,
  "2024-12-14": 6,
  "2024-12-15": 5,
  "2024-12-16": 2,
  "2024-12-17": 7,
  "2024-12-18": 3,
  "2024-12-19": 4,
  "2024-12-20": 6,
  "2024-12-21": 5,
  "2024-12-22": 3,
  "2024-12-23": 2,
  "2024-12-24": 1,
  "2024-12-25": 0,
  "2024-12-26": 4,
  "2024-12-27": 5,
  "2024-12-28": 6,
  "2024-12-29": 3,
  "2024-12-30": 4,
  "2024-12-31": 2,
};

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// SAMPLE DETAILED APPOINTMENTS DATA
// ═══════════════════════════════════════════════════════════════════

const DETAILED_APPOINTMENTS = {
  "2024-12-01": [
    { time: "09:00 AM", customer: "Sarah Johnson", service: "Haircut", stylist: "Maria" },
    { time: "11:30 AM", customer: "Emma Wilson", service: "Hair Coloring", stylist: "Linda" },
    { time: "02:00 PM", customer: "Jessica Brown", service: "Styling", stylist: "Maria" }
  ],
  "2024-12-02": [
    { time: "08:30 AM", customer: "David Miller", service: "Haircut", stylist: "John" },
    { time: "10:15 AM", customer: "Rachel Green", service: "Massage", stylist: "Alex" },
    { time: "01:00 PM", customer: "Anna Lopez", service: "Nail Care", stylist: "Sophie" },
    { time: "03:45 PM", customer: "Michelle Davis", service: "Skin Care", stylist: "Lisa" },
    { time: "05:00 PM", customer: "Lisa Anderson", service: "Haircut", stylist: "John" }
  ],
  "2024-12-07": [
    { time: "09:30 AM", customer: "Amanda Harris", service: "Hair Coloring", stylist: "Linda" },
    { time: "11:00 AM", customer: "Nicole Taylor", service: "Massage", stylist: "Alex" },
    { time: "01:30 PM", customer: "Karen Martin", service: "Styling", stylist: "Maria" },
    { time: "03:00 PM", customer: "Patricia Lee", service: "Nail Care", stylist: "Sophie" },
    { time: "04:30 PM", customer: "Barbara White", service: "Skin Care", stylist: "Lisa" },
    { time: "06:00 PM", customer: "Jennifer Hayes", service: "Haircut", stylist: "John" },
    { time: "07:15 PM", customer: "Deborah Clark", service: "Massage", stylist: "Alex" }
  ]
};

export const CalendarAppointmentsModal = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Helper to get appointment count
  const getAppointmentCount = (day) => {
    if (!day) return 0;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return APPOINTMENTS_DATA[dateStr] || 0;
  };

  // Check if it's today
  const today = new Date();
  const isToday = (day) => {
    return day &&
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        width: "450px",
        height: "650px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(221, 144, 29, 0.2)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#f5f5f5",
            margin: 0
          }}>Appointments Calendar</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#988f81",
              transition: "color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.color = "#dd901d"}
            onMouseOut={(e) => e.target.style.color = "#988f81"}
          >
            <CloseIcon size={20} color="currentColor" />
          </button>
        </div>

        {/* Calendar Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "12px"
        }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dd901d",
              transition: "color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.color = "#f5d590"}
            onMouseOut={(e) => e.target.style.color = "#dd901d"}
          >
            <ChevronLeftIcon size={20} color="currentColor" />
          </button>

          <div style={{
            flex: 1,
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#f5f5f5",
              margin: "0 0 4px 0"
            }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dd901d",
              transition: "color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.color = "#f5d590"}
            onMouseOut={(e) => e.target.style.color = "#dd901d"}
          >
            <ChevronRightIcon size={20} color="currentColor" />
          </button>
        </div>

        {/* Today Button */}
        <button
          onClick={handleToday}
          style={{
            padding: "8px 16px",
            backgroundColor: "rgba(221, 144, 29, 0.2)",
            border: "1px solid rgba(221, 144, 29, 0.4)",
            borderRadius: "6px",
            color: "#dd901d",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "16px",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s ease",
            textAlign: "center"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "rgba(221, 144, 29, 0.3)";
            e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "rgba(221, 144, 29, 0.2)";
            e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
          }}
        >
          Today
        </button>

        {/* Calendar Content Container */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0
        }}>
          {/* Day Names */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            marginBottom: "12px"
          }}>
            {dayNames.map((day) => (
              <div key={day} style={{
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "700",
                color: "#988f81",
                padding: "8px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            gridAutoRows: "1fr"
          }}>
            {days.map((day, index) => {
              const appointmentCount = getAppointmentCount(day);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (day) {
                      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      setSelectedDate(dateStr);
                    }
                  }}
                  style={{
                    minHeight: "50px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    borderRadius: "6px",
                    backgroundColor: isTodayDate ? "rgba(221, 144, 29, 0.2)" : day ? "rgba(26, 15, 0, 0.5)" : "transparent",
                    border: isTodayDate ? "2px solid #dd901d" : day ? "1px solid rgba(221, 144, 29, 0.2)" : "none",
                    cursor: day ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    fontFamily: "Inter, sans-serif"
                  }}
                  onMouseOver={(e) => {
                    if (day) {
                      e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.15)";
                      e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.6)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (day) {
                      e.currentTarget.style.backgroundColor = isTodayDate ? "rgba(221, 144, 29, 0.2)" : "rgba(26, 15, 0, 0.5)";
                      e.currentTarget.style.borderColor = isTodayDate ? "2px solid #dd901d" : "1px solid rgba(221, 144, 29, 0.2)";
                    }
                  }}
                >
                  {day && (
                    <>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: isTodayDate ? "#dd901d" : "#f5f5f5",
                        margin: "0",
                        marginBottom: "2px"
                      }}>
                        {day}
                      </p>
                      <p style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: appointmentCount > 0 ? "#dd901d" : "#988f81",
                        margin: "0"
                      }}>
                        {appointmentCount} {appointmentCount === 1 ? "apt" : "apts"}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointment Count Legend - Fixed at Bottom */}
        <div style={{
          padding: "16px",
          backgroundColor: "rgba(221, 144, 29, 0.05)",
          borderLeft: "3px solid #dd901d",
          borderRadius: "6px",
          marginTop: "16px",
          flexShrink: 0,
          maxHeight: "150px",
          overflowY: "auto"
        }}>
          {selectedDate ? (
            <>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}>
                <p style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#dd901d",
                  margin: "0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Appointments for {selectedDate}
                </p>
                <button
                  onClick={() => setSelectedDate(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 8px",
                    color: "#988f81",
                    fontSize: "12px",
                    transition: "color 0.2s ease"
                  }}
                  onMouseOver={(e) => e.target.style.color = "#dd901d"}
                  onMouseOut={(e) => e.target.style.color = "#988f81"}
                >
                  Close
                </button>
              </div>
              
              {DETAILED_APPOINTMENTS[selectedDate] && DETAILED_APPOINTMENTS[selectedDate].length > 0 ? (
                <div>
                  {DETAILED_APPOINTMENTS[selectedDate].map((apt, idx) => (
                    <div key={idx} style={{
                      marginBottom: "12px",
                      paddingBottom: "12px",
                      borderBottom: idx < DETAILED_APPOINTMENTS[selectedDate].length - 1 ? "1px solid rgba(221, 144, 29, 0.1)" : "none"
                    }}>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        margin: "0 0 4px 0"
                      }}>
                        {apt.time}
                      </p>
                      <p style={{
                        fontSize: "11px",
                        color: "#f5f5f5",
                        margin: "0 0 2px 0",
                        fontWeight: "500"
                      }}>
                        {apt.customer}
                      </p>
                      <p style={{
                        fontSize: "11px",
                        color: "#988f81",
                        margin: "0 0 2px 0"
                      }}>
                        {apt.service}
                      </p>
                      <p style={{
                        fontSize: "10px",
                        color: "#988f81",
                        margin: "0"
                      }}>
                        Stylist: {apt.stylist}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  fontSize: "12px",
                  color: "#988f81",
                  margin: "0"
                }}>
                  No appointments scheduled for this date
                </p>
              )}
            </>
          ) : (
            <>
              <p style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#dd901d",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Appointment Summary</p>
              <p style={{
                fontSize: "13px",
                color: "#f5f5f5",
                margin: "0 0 4px 0"
              }}>
                Click on any date to view appointment details
              </p>
              <p style={{
                fontSize: "12px",
                color: "#988f81",
                margin: "0"
              }}>
                This month has <span style={{ color: "#dd901d", fontWeight: "600" }}>{Object.values(APPOINTMENTS_DATA).reduce((a, b) => a + b, 0)}</span> total appointments
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarAppointmentsModal;
