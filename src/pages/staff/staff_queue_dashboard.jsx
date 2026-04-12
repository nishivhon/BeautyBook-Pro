import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/tailwind.css";


// ── Icons ──────────────────────────────────────────────────────────────────────
const ScissorsIcon = ({ size = 20, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M20 4L8.12 15.88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14.47 14.48L20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8.12 8.12L12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
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
const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M12 7A5 5 0 112 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M12 3v4H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = ({ size = 18, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InProgressIcon = ({ size = 18, color = "#4387ef" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PendingIcon = ({ size = 18, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CancelledIcon = ({ size = 18, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const DoneIcon = ({ size = 14, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

// ── Data ──────────────────────────────────────────────────────────────────────
const QUEUE_SECTIONS = [
  {
    label: "Current",
    items: [
      { id: 1, type: "active",    name: "Juan Dela Cruz", service: "Haircut • Mike S.",        statusTop: "Now",      statusSub: "In Progress", details: { serviceSelected: "Hair cuts", currentService: "Hair cuts", startTime: "10:15 AM", estimatedTime: "30 mins" } },
      { id: 2, type: "active",    name: "Pedro Santos",   service: "Beard Trim • John D.",    statusTop: "Now",      statusSub: "In Progress", details: { serviceSelected: "Beard trimming", currentService: "Beard trimming", startTime: "10:20 AM", estimatedTime: "25 mins" } },
      { id: 3, type: "active",    name: "Maria Garcia",   service: "Hair Color • Carlos R.",  statusTop: "Now",      statusSub: "In Progress", details: { serviceSelected: "Hair color", currentService: "Hair color", startTime: "10:00 AM", estimatedTime: "60 mins" } },
    ],
  },
  {
    label: "Up Next",
    items: [
      { id: 4, type: "waiting",   number: 1, name: "Anna Reyes",   service: "Full Service • Mike S.",     statusTop: "20 mins", statusSub: "Waiting", details: { serviceSelected: "Hair cuts, Hair color", currentService: "Pending", startTime: "10:45 AM", estimatedTime: "90 mins" } },
      { id: 5, type: "cancelled", number: 2, name: "Miguel Torres",service: "Haircut • Available Stylist", statusTop: null,      statusSub: "Cancelled", details: { serviceSelected: "Hair cuts", currentService: "Cancelled", startTime: "N/A", estimatedTime: "N/A" } },
      { id: 6, type: "waiting",   number: 3, name: "James Wilson",  service: "Beard Trim • Carlos R.",    statusTop: "35 mins", statusSub: "Waiting", details: { serviceSelected: "Beard trimming", currentService: "Pending", startTime: "11:00 AM", estimatedTime: "25 mins" } },
    ],
  },
  {
    label: "On Deck",
    items: [
      { id: 7, type: "waiting",   number: 4, name: "Sofia Rivera", service: "Full Service • Mike S.",  statusTop: "1hr 10 mins", statusSub: "Waiting", details: { serviceSelected: "Manicure, Pedicure", currentService: "Pending", startTime: "11:30 AM", estimatedTime: "120 mins" } },
      { id: 8, type: "cancelled", number: 5, name: "Leo Cruz",     service: "Haircut • John D.",       statusTop: null,          statusSub: "Cancelled", details: { serviceSelected: "Hair cuts", currentService: "Cancelled", startTime: "N/A", estimatedTime: "N/A" } },
    ],
  },
];

const scheduleData = [
  { stylist: "Carlos R.", time: "9:45 AM",  client: "Tom Lee",        service: "Beard Trim",  status: "done" },
  { stylist: "John D.",   time: "10:00 AM", client: "Paul Cordiz",    service: "Hair Color",  status: "done" },
  { stylist: "Mike S.",   time: "10:15 AM", client: "Juan Dela Cruz", service: "Haircut",     status: "active" },
  { stylist: "John D.",   time: "10:15 AM", client: "Pedro Santos",   service: "Beard Trim",  status: "active" },
  { stylist: "Carlos R.", time: "10:45 AM", client: "Maria Garcia",   service: "Hair color",  status: "active" },
  { stylist: "Mike S.",   time: "11:05 AM", client: "Anna Reyes",     service: "Full Service",status: "next" },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg:"", show:false });
  let timer;
  const show = (msg) => {
    setToast({ msg, show:true });
    clearTimeout(timer);
    timer = setTimeout(() => setToast(t => ({ ...t, show:false })), 2500);
  };
  return { toast, show };
}

// ── Live clock ────────────────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ showToast }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("Queue");

  const handleNavigation = (link) => {
    setActive(link);
    if (link === "Services") {
      navigate("/staff/services");
    } else if (link === "Home") {
      navigate("/staff/dashboard");
    } else {
      navigate("/staff/dashboard");
    }
  };

  return (
    <header className="admin-navbar">
      <div className="admin-nav-logo">
        <div className="admin-nav-logo-badge">
          <ScissorsIcon />
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
        <button className="admin-nav-logout" onClick={() => showToast("Logging out…")}>Log Out</button>
      </div>
    </header>
  );
}

// ── Queue item (with expandable details) ───────────────────────────────────────
function QueueItem({ id, type, number, name, service, statusTop, statusSub, details, showToast }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = type === "active";
  const isCancelled = type === "cancelled";
  const rowClass = isActive ? "live-queue-row-active" : isCancelled ? "live-queue-row-cancelled" : "live-queue-row-waiting";

  const handleCompleteService = () => {
    showToast(`Service completed for ${name}`);
  };

  return (
    <>
      <div 
        className={rowClass}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <div className="live-queue-left">
          {isActive ? (
            <div className="live-queue-icon-box">
              <ScissorsIcon size={17} color="#000" />
            </div>
          ) : (
            <div className="live-queue-number-box">{number}</div>
          )}
          <div className="live-queue-info">
            <span className="live-queue-name">{name}</span>
            <span className="live-queue-service">{service}</span>
          </div>
        </div>

        <div className="live-queue-right">
          <div className="live-queue-status-col">
            {statusTop && (
              <span className={isActive ? "live-status-now" : isCancelled ? "live-status-red" : "live-status-wait"}>
                {statusTop}
              </span>
            )}
            <span className={isCancelled ? "live-status-red" : "live-status-sub"}>
              {statusSub}
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="live-queue-detail-section">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <span className="dash-detail-label">Service Selected</span>
              <span className="dash-detail-value">{details.serviceSelected}</span>
            </div>
            <div>
              <span className="dash-detail-label">Current Service</span>
              <span className="dash-detail-value">{details.currentService}</span>
            </div>
            <div>
              <span className="dash-detail-label">Starting Time</span>
              <span className="dash-detail-value">{details.startTime}</span>
            </div>
            <div>
              <span className="dash-detail-label">Estimated Time</span>
              <span className="dash-detail-value">{details.estimatedTime}</span>
            </div>
            {isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteService();
                }}
                className="dash-complete-btn"
              >
                ✓ Complete Service
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label }) {
  return <div className="live-section-label">{label}</div>;
}

// ── Live Queue panel ──────────────────────────────────────────────────────────
function LiveQueuePanel({ showToast, liveTime }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="live-queue-panel">
      {/* Header */}
      <div className="dash-panel-header">
        <div className="dash-panel-title-row">
          <h2 className="dash-panel-title">Live Queue</h2>
          <span className="dash-live-badge">
            <span className="dash-live-dot" />
            Live
          </span>
        </div>
        <div className="dash-panel-buttons">
          <button 
            className="dash-panel-manage-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className={isExpanded ? "live-queue-scroll" : "live-queue-scroll-limited"}>
        {QUEUE_SECTIONS.map((section, si) => (
          <div key={si}>
            <SectionLabel label={section.label}/>
            <div className="live-queue-group">
              {section.items.map((item) => (
                <QueueItem 
                  key={item.id} 
                  {...item}
                  showToast={showToast}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label }) {
  return (
    <div className="queue-stat-card">
      <div className="queue-stat-value">{value}</div>
      <div className="queue-stat-label">{label}</div>
    </div>
  );
}

// ── Schedule card ─────────────────────────────────────────────────────────────
function ScheduleCard({ showToast }) {
  const [collapsed, setCollapsed] = useState(false);
  const visible = collapsed ? scheduleData.slice(0, 3) : scheduleData;

  return (
    <div className="queue-sidebar-panel">
      <div className="queue-schedule-header">
        <span className="queue-schedule-title">Today's Schedule</span>
        <span className="queue-schedule-date">Dec 7, 2024</span>
      </div>

      {visible.map((item, i) => {
        const isActive = item.status === "active";
        const isDone = item.status === "done";

        return (
          <div key={i} className={`queue-schedule-item ${isActive ? "active" : ""}`} onClick={() => showToast(`${item.client} — ${item.service}`)}>
            <span className="queue-schedule-dot queue-schedule-icon-span">
              {isDone ? (
                <DoneIcon />
              ) : isActive ? (
                <PlayIcon />
              ) : (
                <NextIcon color="#988f81" />
              )}
            </span>
            <span className="queue-schedule-time">{item.time}</span>
            <div className="queue-schedule-divider" />
            <div className="queue-schedule-details">
              <div className="queue-schedule-name">{item.stylist}</div>
              <div className="queue-schedule-service">{item.client} • {item.service}</div>
            </div>
          </div>
        );
      })}

      <div className="queue-schedule-footer">
        <span className="queue-schedule-footer-text">{collapsed ? "Showing partial schedule" : "Showing full schedule"}</span>
        <button onClick={() => setCollapsed(c => !c)} className="queue-schedule-toggle-btn">
          {collapsed ? "See more" : "See less"}
        </button>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <div className={`queue-toast ${toast.show ? "show" : "hidden"}`}>
      {toast.msg}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function StaffQueueDashboard() {
  const { toast, show: showToast } = useToast();
  const liveTime = useClock();

  return (
    <div className="dash-root">
      <Nav showToast={showToast} />

      <main className="queue-main">
        {/* Page header */}
        <div className="queue-page-header">
          <div className="queue-page-title-block">
            <h1 className="queue-page-title">Hi, Mike! 👋</h1>
            <p className="queue-page-subtitle">You have 6 appointments today</p>
          </div>
          <div className="queue-page-actions">
            {[
              { icon: <BreakIcon />, label: "Take Break" },
              { icon: <ClockOutIcon />, label: "Clock Out" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                onClick={() => showToast(`${label} clicked`)}
                className="dash-action-btn"
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="queue-grid">
          {/* Left — Live Queue */}
          <LiveQueuePanel showToast={showToast} liveTime={liveTime}/>

          {/* Right column */}
          <div className="queue-sidebar">
            {/* My Statistics */}
            <div className="queue-sidebar-panel">
              <div className="queue-sidebar-title">My Statistics</div>
              <div className="queue-stats-grid">
                <StatCard value="2" label="Completed" />
                <StatCard value="2" label="Remaining" />
                <StatCard value="₱680" label="Earned" />
                <StatCard value="1" label="Cancelled" />
              </div>
            </div>

            {/* Today's Schedule */}
            <ScheduleCard showToast={showToast}/>
          </div>
        </div>
      </main>

      <Toast toast={toast}/>
    </div>
  );
}