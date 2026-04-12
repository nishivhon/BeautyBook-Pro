import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
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
const PlayIcon = ({ color = "#dd901d" }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M3.5 2.5l7 4-7 4V2.5z" fill={color}/>
  </svg>
);
const NextIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M3 2.5l5 4-5 4V2.5z" fill="rgba(152,143,129,0.6)"/>
    <line x1="9" y1="2.5" x2="9" y2="10.5" stroke="rgba(152,143,129,0.6)" strokeWidth="1.4" strokeLinecap="round"/>
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

const scheduleData = [
  { time:"9:00 AM",  name:"Mark L.",  svc:"Haircut",      status:"done" },
  { time:"9:30 AM",  name:"John D.",  svc:"Beard Trim",   status:"done" },
  { time:"10:15 AM", name:"Juan D.",  svc:"Haircut",      status:"active" },
  { time:"11:05 AM", name:"Anna R.",  svc:"Full Service", status:"next" },
  { time:"11:45 AM", name:"Sofia R.", svc:"Full Service", status:"next" },
];

const queueData = [
  { num:2, name:"Anna Reyes",   svc:"Full Service", time:"11:05 AM", dur:"45 mins" },
  { num:3, name:"Sofia Rivera", svc:"Full Service", time:"11:45 AM", dur:"45 mins" },
];

function StaffNav({ onLogout }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("Home");

  const handleNavigation = (link) => {
    setActive(link);
    if (link === "Services") {
      navigate("/staff/services");
    } else if (link === "Queue") {
      // Navigate to queue page if it exists
      navigate("/staff/dashboard");
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
          <span style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>Current Service</span>
        </div>
        <div style={{ fontSize: "12px", color: "#988f81" }}>Started 10:15 AM</div>
      </div>
      <div style={{ background: "#231d1a", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", border: "1px solid rgba(152, 143, 129, 0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "36px", height: "36px", background: "#dd901d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "bold", fontSize: "14px" }}>1</div>
          <div>
            <div style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>Juan Dela Cruz</div>
            <div style={{ fontSize: "12px", color: "#988f81", marginTop: "4px" }}>Haircut</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: "#988f81", marginBottom: "6px" }}>Elapsed Time</div>
          <div style={{ color: "#dd901d", fontSize: "14px", fontWeight: "bold" }}>{elapsed}</div>
        </div>
      </div>
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
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "#231d1a", border: "1px solid rgba(152, 143, 129, 0.2)", borderRadius: "12px", cursor: "pointer" }}>
          →
        </button>
      </div>
    </div>
  );
}

function QueueCard({ showToast }) {
  return (
    <div style={{ background: "rgba(221, 144, 29, 0.06)", border: "1px solid rgba(152, 143, 129, 0.3)", borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>Your Queue</span>
        <span style={{ fontSize: "12px", color: "#988f81", background: "rgba(35, 29, 26, 0.6)", padding: "6px 10px", borderRadius: "12px", border: "1px solid rgba(152, 143, 129, 0.2)" }}>2 Waiting</span>
      </div>
      {queueData.map(q => (
        <div key={q.num} onClick={()=>showToast(`Viewing ${q.name}'s appointment`)}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "12px", background: "rgba(35, 29, 26, 0.6)", marginBottom: "8px", border: "1px solid rgba(152, 143, 129, 0.2)", cursor: "pointer" }}>
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
            <span style={{ fontSize: "12px", color: "rgba(152, 143, 129, 0.5)" }}>›</span>
          </div>
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

function ScheduleCard({ showToast }) {
  const [collapsed, setCollapsed] = useState(false);
  const visible = collapsed ? scheduleData.slice(0,3) : scheduleData;
  return (
    <div style={{ background: "rgba(221, 144, 29, 0.06)", border: "1px solid rgba(152, 143, 129, 0.3)", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>Today's Schedule</span>
        <span style={{ fontSize: "12px", color: "#988f81" }}>Dec 7, 2024</span>
      </div>
      {visible.map((item, i) => {
        const isActive = item.status === "active";
        const isDone = item.status === "done";
        const dotColor = isDone ? "#22c55e" : isActive ? "#dd901d" : "#988f81";
        return (
          <div key={i} onClick={()=>showToast(`${item.name} — ${item.svc}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "6px",
              cursor: "pointer",
              background: isActive ? "rgba(221, 144, 29, 0.1)" : "transparent",
              border: isActive ? "1px solid rgba(221, 144, 29, 0.25)" : "none"
            }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: dotColor, flexShrink: 0, animation: isActive ? "pulse 2s ease-in-out infinite" : "none" }}/>
            <span style={{ fontSize: "12px", color: "#988f81", minWidth: "60px" }}>{item.time}</span>
            <div style={{ width: "2px", height: "28px", background: "rgba(152, 143, 129, 0.2)", flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: "#fff" }}>{item.name}</div>
              <div style={{ fontSize: "12px", color: "#988f81", marginTop: "4px" }}>{item.svc}</div>
            </div>
            <span style={{ fontSize: "12px", color: isDone ? "#22c55e" : isActive ? "#dd901d" : "#988f81" }}>
              {isDone ? "✓" : isActive ? "▶" : "⊳"}
            </span>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(152, 143, 129, 0.2)" }}>
        <span style={{ fontSize: "12px", color: "#988f81" }}>{collapsed ? "Showing partial schedule" : "Showing full schedule"}</span>
        <button onClick={()=>setCollapsed(c=>!c)} style={{ fontSize: "12px", fontWeight: "bold", color: "#fff", background: "none", border: "none", cursor: "pointer" }}>{collapsed ? "See more" : "See less"}</button>
      </div>
    </div>
  );
}

function QuickActionsCard({ showToast }) {
  return (
    <div style={{ background: "rgba(221, 144, 29, 0.06)", border: "1px solid rgba(152, 143, 129, 0.3)", borderRadius: "16px", padding: "24px" }}>
      <div style={{ fontSize: "16px", color: "#fff", fontWeight: "500", marginBottom: "16px" }}>Quick Actions</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={()=>showToast("Opening customer history…")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", background: "#dd901d", color: "#000", border: "none", cursor: "pointer" }}>
          📋 My Customer History
        </button>
        <button onClick={()=>showToast("Opening calendar…")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", borderRadius: "12px", fontWeight: "500", fontSize: "14px", background: "transparent", color: "#fff", border: "1px solid rgba(152, 143, 129, 0.3)", cursor: "pointer" }}>
          📅 My Calendar
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
            <StatsCard/>
            <ScheduleCard showToast={showToast}/>
            <QuickActionsCard showToast={showToast}/>
          </div>
        </div>
      </main>
      <Toast toast={toast}/>
    </div>
  );
}
