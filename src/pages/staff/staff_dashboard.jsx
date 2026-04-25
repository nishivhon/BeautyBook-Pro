import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import CustomerHistoryModal from "../../components/modal/admin/customer_history";
import CalendarAppointmentsModal from "../../components/modal/admin/calendar_appointments";
import "../../styles/tailwind.css";

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const ScissorsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle cx="8" cy="8" r="3.5" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
    <circle cx="8" cy="20" r="3.5" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
    <line x1="10.5" y1="9.5" x2="22" y2="21" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="10.5" y1="18.5" x2="22" y2="7" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const ClockIcon = ({ color = "currentColor", size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2"/>
    <path d="M8 5v3.5l2 2" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CheckCircleIcon = ({ color = "#22c55e" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2"/>
    <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PlayIcon = ({ size = 14, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M10 8l6 4-6 4V8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NextIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M10 8l4 4-4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="8" x2="16" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const ChevronRightIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DoneIcon = ({ size = 14, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const BreakIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 5h10v5a4 4 0 01-4 4H7a4 4 0 01-4-4V5z" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M13 7c2 0 2 3 0 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="6" y1="2" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="10" y1="2" x2="10" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const ClockOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 3H3.5A1.5 1.5 0 002 4.5v7A1.5 1.5 0 003.5 13H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M10 11l3-3-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.5 8A6.5 6.5 0 108 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M1.5 3.5v4.5H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="3" width="13" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="5.5" cy="10" r="0.8" fill="currentColor"/>
    <circle cx="8" cy="10" r="0.8" fill="currentColor"/>
    <circle cx="10.5" cy="10" r="0.8" fill="currentColor"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 3l4 4-4 4" stroke="rgba(152,143,129,0.5)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const BellIcon = () => (
  <svg width="15" height="18" viewBox="0 0 15 18" fill="none">
    <path d="M7.5 1a5 5 0 00-5 5v4l-1.5 2.5h13L12.5 10V6a5 5 0 00-5-5z" stroke="#988f81" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M6 14.5a1.5 1.5 0 003 0" stroke="#988f81" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const SkipForwardIcon = ({ size = 20, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 4v16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 5l-8 6 8 6V5z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomerHistoryIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 6v6l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 16l-2 2 2 2M22 16l-2 2 2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuickActionCalendarIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="15" r="1" fill={color} />
    <circle cx="12" cy="15" r="1" fill={color} />
    <circle cx="16" cy="15" r="1" fill={color} />
  </svg>
);

function useElapsed(startMins = 22, startSecs = 39) {
  const [secs, setSecs] = useState(startMins * 60 + startSecs);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2,"0")}s`;
}

function useToast() {
  const [toast, setToast] = useState({ msg:"", show:false });
  let timer;
  const show = (msg) => {
    setToast({ msg, show:true });
    clearTimeout(timer);
    timer = setTimeout(() => setToast(t => ({ ...t, show:false })), 2600);
  };
  return { toast, show };
}

function useToday() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

const scheduleData = [
  { time:"9:00 AM",  name:"Mark L.",  svc:"Haircut",      status:"done", details: { serviceSelected: "Hair cuts", currentService: "Hair cuts", startTime: "9:00 AM", estimatedTime: "30 mins" } },
  { time:"9:30 AM",  name:"John D.",  svc:"Beard Trim",   status:"done", details: { serviceSelected: "Beard trimming", currentService: "Beard trimming", startTime: "9:30 AM", estimatedTime: "25 mins" } },
  { time:"10:15 AM", name:"Juan D.",  svc:"Haircut",      status:"active", details: { serviceSelected: "Hair cuts", currentService: "Hair cuts", startTime: "10:15 AM", estimatedTime: "30 mins" } },
  { time:"11:05 AM", name:"Anna R.",  svc:"Full Service", status:"next", details: { serviceSelected: "Hair cuts, Hair color", currentService: "Pending", startTime: "11:05 AM", estimatedTime: "90 mins" } },
  { time:"11:45 AM", name:"Sofia R.", svc:"Full Service", status:"next", details: { serviceSelected: "Manicure, Pedicure", currentService: "Pending", startTime: "11:45 AM", estimatedTime: "120 mins" } },
];

const queueData = [
  { num:2, name:"Anna Reyes",   svc:"Full Service", time:"11:05 AM", dur:"45 mins", details: { serviceSelected: "Hair cuts, Hair color", currentService: "Pending", startTime: "11:05 AM", estimatedTime: "90 mins" } },
  { num:3, name:"Sofia Rivera", svc:"Full Service", time:"11:45 AM", dur:"45 mins", details: { serviceSelected: "Manicure, Pedicure", currentService: "Pending", startTime: "11:45 AM", estimatedTime: "120 mins" } },
];

function StaffNav({ onLogout }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("Home");

  const handleNavigation = (link) => {
    setActive(link);
    if (link === "Services") {
      navigate("/staff/services");
    } else if (link === "Queue") {
      navigate("/staff/queue");
    } else {
      navigate("/staff/dashboard");
    }
  };
  
  return (
    <header className="admin-navbar">
      <div className="admin-nav-logo">
        <div className="admin-nav-logo-badge">
          <ScissorsIcon size={20} color="#000" />
        </div>
        <span className="admin-nav-brand">BeautyBook Pro</span>
      </div>
      <nav className="admin-nav-links">
        <button 
          className={`admin-nav-link ${active === "Home" ? "active" : ""}`}
          onClick={() => handleNavigation("Home")}
        >
          Home
        </button>
        <button 
          className={`admin-nav-link ${active === "Services" ? "active" : ""}`}
          onClick={() => handleNavigation("Services")}
        >
          Services
        </button>
        <button 
          className={`admin-nav-link ${active === "Queue" ? "active" : ""}`}
          onClick={() => handleNavigation("Queue")}
        >
          Queue
        </button>
      </nav>
      <div className="admin-nav-right">
        <div className="admin-nav-user">
          <div className="admin-nav-avatar">M</div>
          <span className="admin-nav-username">Staff</span>
        </div>
        <div className="admin-nav-divider" />
        <button className="admin-nav-logout" onClick={onLogout}>Log Out</button>
      </div>
    </header>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div style={{ background: "rgba(35, 29, 26, 0.6)", border: "1px solid rgba(152, 143, 129, 0.2)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", color }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#988f81" }}>{label}</div>
    </div>
  );
}

function CurrentServiceCard({ elapsed, completed, setCompleted, showToast }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentServiceDetails = {
    serviceSelected: "Hair cuts",
    currentService: "Hair cuts",
    startTime: "10:15 AM",
    estimatedTime: "30 mins"
  };

  return (
    <div style={{ 
      background: "rgba(221, 144, 29, 0.06)", 
      border: "1px solid rgba(221, 144, 29, 0.15)", 
      borderRadius: "16px", 
      padding: "24px", 
      marginBottom: "16px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "100%", background: "#dd901d" }}></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <div>
          <span style={{ display: "inline-block", background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", border: "1px solid rgba(34, 197, 94, 0.3)", fontSize: "11px", fontWeight: "bold", padding: "6px 10px", borderRadius: "20px", textTransform: "uppercase", marginRight: "12px" }}>In Progress</span>
          <span style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>Current Client</span>
        </div>
        <div style={{ fontSize: "12px", color: "#988f81" }}>Started 10:15 AM</div>
      </div>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ background: "#231d1a", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", border: "1px solid rgba(152, 143, 129, 0.2)", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "36px", height: "36px", background: "#dd901d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "bold", fontSize: "14px" }}>1</div>
          <div>
            <div style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>Juan Dela Cruz</div>
            <div style={{ fontSize: "12px", color: "#988f81", marginTop: "4px" }}>Haircut</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#988f81", marginBottom: "6px" }}>Elapsed Time</div>
            <div style={{ color: "#dd901d", fontSize: "14px", fontWeight: "bold" }}>{elapsed}</div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="live-queue-chevron"
            style={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease"
            }}
          >
            <ChevronRightIcon size={13} color="currentColor" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="live-queue-detail-section">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <span className="dash-detail-label">Service Selected</span>
              <span className="dash-detail-value">{currentServiceDetails.serviceSelected}</span>
            </div>
            <div>
              <span className="dash-detail-label">Current Service</span>
              <span className="dash-detail-value">{currentServiceDetails.currentService}</span>
            </div>
            <div>
              <span className="dash-detail-label">Starting Time</span>
              <span className="dash-detail-value">{currentServiceDetails.startTime}</span>
            </div>
            <div>
              <span className="dash-detail-label">Estimated Time</span>
              <span className="dash-detail-value">{currentServiceDetails.estimatedTime}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => { setCompleted(true); showToast("Service marked as complete!"); }}
          style={{
            flex: 1,
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            background: completed ? "rgba(34, 197, 94, 0.25)" : "#dd901d",
            color: completed ? "#22c55e" : "#000",
            borderColor: completed ? "rgba(34, 197, 94, 0.5)" : "#dd901d",
            borderWidth: completed ? "1px" : "0"
          }}>
          {completed ? "✓ Service Completed" : "✓ Complete Service"}
        </button>
        <button onClick={()=>showToast("Moved to next client")} 
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "#dd901d", border: "2px solid #dd901d", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(221, 144, 29, 0.3)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(221, 144, 29, 0.5)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(221, 144, 29, 0.3)";
            e.currentTarget.style.transform = "scale(1)";
          }}>
          <div style={{ transform: "rotate(180deg)", display: "flex", alignItems: "center", justifyContent: "center", transformOrigin: "center center" }}>
            <SkipForwardIcon size={20} color="#000" />
          </div>
        </button>
      </div>
    </div>
  );
}

function QueueCard({ showToast }) {
  const [expandedQueues, setExpandedQueues] = useState({});

  const toggleQueueExpanded = (num) => {
    setExpandedQueues(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  return (
    <div style={{ background: "rgba(221, 144, 29, 0.06)", border: "1px solid rgba(152, 143, 129, 0.3)", borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>Your Queue</span>
        <span style={{ fontSize: "12px", color: "#988f81", background: "rgba(35, 29, 26, 0.6)", padding: "6px 10px", borderRadius: "12px", border: "1px solid rgba(152, 143, 129, 0.2)" }}>2 Waiting</span>
      </div>
      {queueData.map(q => (
        <div key={q.num}>
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "12px", background: "rgba(35, 29, 26, 0.6)", marginBottom: "8px", border: "1px solid rgba(152, 143, 129, 0.2)", cursor: "pointer" }}
            onClick={() => toggleQueueExpanded(q.num)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#060605", border: "1px solid rgba(152, 143, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", color: "#988f81" }}>{q.num}</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#fff" }}>{q.name}</div>
                <div style={{ fontSize: "12px", color: "#988f81", marginTop: "4px" }}>{q.svc}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#fff" }}>{q.time}</div>
                <div style={{ fontSize: "12px", color: "#988f81", marginTop: "4px" }}>{q.dur}</div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleQueueExpanded(q.num);
                }}
                className="live-queue-chevron"
                style={{
                  transform: expandedQueues[q.num] ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease"
                }}
              >
                <ChevronRightIcon size={13} color="currentColor" />
              </button>
            </div>
          </div>
          
          {expandedQueues[q.num] && q.details && (
            <div className="live-queue-detail-section">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <span className="dash-detail-label">Service Selected</span>
                  <span className="dash-detail-value">{q.details.serviceSelected}</span>
                </div>
                <div>
                  <span className="dash-detail-label">Current Service</span>
                  <span className="dash-detail-value">{q.details.currentService}</span>
                </div>
                <div>
                  <span className="dash-detail-label">Starting Time</span>
                  <span className="dash-detail-value">{q.details.startTime}</span>
                </div>
                <div>
                  <span className="dash-detail-label">Estimated Time</span>
                  <span className="dash-detail-value">{q.details.estimatedTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatsCard() {
  return (
    <div style={{ background: "rgba(221, 144, 29, 0.06)", border: "1px solid rgba(152, 143, 129, 0.3)", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
      <div style={{ fontSize: "16px", color: "#fff", fontWeight: "500", marginBottom: "16px" }}>My Statistics</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <StatCard value="2" label="Completed" color="#22c55e"/>
        <StatCard value="2" label="Remaining" color="#fff"/>
        <StatCard value="₱680" label="Earned" color="#dd901d"/>
        <StatCard value="1" label="Cancelled" color="#ef4343"/>
      </div>
    </div>
  );
}

function ScheduleRow({ time, name, svc, status }) {
  const isActive = status === "active";
  const isDone = status === "done";

  const StatusIcon = isDone ? () => <DoneIcon size={14} color="#22c55e" />
                   : isActive ? () => <PlayIcon size={14} color="#dd901d" />
                   : () => <NextIcon size={14} color="#988f81" />;

  return (
    <div className={`live-schedule-row ${isActive ? "live-schedule-row-active" : ""}`}>
      <div className="live-schedule-left">
        <div className="live-schedule-stylist">
          <div className="live-sched-name-row">
            <span className="live-sched-dot" />
            <span className="live-schedule-stylist-name">{time}</span>
          </div>
        </div>
        <div className="live-schedule-divider-v" />
        <div className="live-schedule-client">
          <span className="live-schedule-client-name">{name}</span>
          <span className="live-schedule-service">{svc}</span>
        </div>
      </div>
      <button className="live-schedule-icon-btn" aria-label={status}>
        <StatusIcon />
      </button>
    </div>
  );
}

function ScheduleCard({ showToast }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const today = useToday();
  const activeRowRef = useRef(null);

  useEffect(() => {
    if (!isExpanded && activeRowRef.current) {
      setTimeout(() => {
        const scrollContainer = activeRowRef.current?.closest(".live-schedule-scroll") 
                             || activeRowRef.current?.closest(".live-schedule-scroll-limited");
        if (scrollContainer && activeRowRef.current) {
          const rowPosition = activeRowRef.current.offsetTop;
          scrollContainer.scrollTop = Math.max(0, rowPosition - 70);
        }
      }, 50);
    }
  }, [isExpanded]);

  return (
    <div className="live-schedule-panel">
      <div className="live-schedule-header">
        <div className="live-schedule-header-title-row">
          <h3 className="live-schedule-title">Today's Schedule</h3>
          <span className="live-schedule-date">{today}</span>
        </div>
        <button 
          className="live-schedule-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      </div>

      <div className={isExpanded ? "live-schedule-scroll" : "live-schedule-scroll-limited"}>
        {scheduleData.map((item, i) => {
          const isFirstActive = scheduleData.slice(0, i).every(d => d.status !== "active") && item.status === "active";
          return (
            <div key={i} ref={isFirstActive ? activeRowRef : null}>
              <ScheduleRow {...item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickActionsCard({ showToast, onOpenCustomerHistory, onOpenCalendar }) {
  return (
    <div style={{ background: "rgba(221, 144, 29, 0.06)", border: "1px solid rgba(152, 143, 129, 0.3)", borderRadius: "16px", padding: "24px" }}>
      <div style={{ fontSize: "16px", color: "#fff", fontWeight: "500", marginBottom: "16px" }}>Quick Actions</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={onOpenCustomerHistory} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", background: "#dd901d", color: "#000", border: "none", cursor: "pointer" }}>
          <CustomerHistoryIcon size={17} color="#000" /> My Customer History
        </button>
        <button onClick={onOpenCalendar} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", borderRadius: "12px", fontWeight: "500", fontSize: "14px", background: "transparent", color: "#fff", border: "1px solid rgba(152, 143, 129, 0.3)", cursor: "pointer" }}>
          <QuickActionCalendarIcon size={17} color="#fff" /> My Calendar
        </button>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "28px",
      right: "28px",
      background: "#231d1a",
      border: "1px solid #dd901d",
      borderRadius: "12px",
      padding: "20px 14px",
      fontSize: "14px",
      color: "#dd901d",
      transition: "all 0.25s",
      zIndex: 999,
      pointerEvents: "none",
      opacity: toast.show ? 1 : 0,
      transform: toast.show ? "translateY(0)" : "translateY(10px)"
    }}>
      {toast.msg}
    </div>
  );
}

export default function StaffDashboard() {
  const elapsed = useElapsed(22, 39);
  const [completed, setCompleted] = useState(false);
  const { toast, show: showToast } = useToast();
  const [isCustomerHistoryOpen, setIsCustomerHistoryOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  return (
    <div className="dash-root">
      <StaffNav onLogout={handleLogout} />
      <main className="dash-main">
        <div className="dash-page-header">
          <div className="dash-page-title-block">
            <h1 className="dash-page-title">Hi, Mike! 👋</h1>
            <p className="dash-page-subtitle">Staff Dashboard · Saturday, Dec 7, 2024</p>
          </div>
        </div>

        <div className="dash-stats-row">
          <div className="dash-stat-card">
            <p className="dash-stat-value">2</p>
            <p className="dash-stat-label">Completed</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-value">2</p>
            <p className="dash-stat-label">Remaining</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-value">₱680</p>
            <p className="dash-stat-label">Earned</p>
          </div>
          <div className="dash-stat-card">
            <p className="dash-stat-value">1</p>
            <p className="dash-stat-label">Cancelled</p>
          </div>
        </div>

        <div className="dash-content-grid">
          <div>
            <CurrentServiceCard elapsed={elapsed} completed={completed} setCompleted={setCompleted} showToast={showToast}/>
            <QueueCard showToast={showToast}/>
          </div>
          <div className="dash-sidebar">
            <QuickActionsCard showToast={showToast} onOpenCustomerHistory={() => setIsCustomerHistoryOpen(true)} onOpenCalendar={() => setIsCalendarOpen(true)}/>
            <ScheduleCard showToast={showToast}/>
            <StatsCard/>
          </div>
        </div>
      </main>
      <Toast toast={toast}/>
      <CustomerHistoryModal 
        isOpen={isCustomerHistoryOpen} 
        onClose={() => setIsCustomerHistoryOpen(false)} 
        staffName="Mike Santos"
      />
      <CalendarAppointmentsModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        staffName="Mike Santos"
      />
    </div>
  );
}
