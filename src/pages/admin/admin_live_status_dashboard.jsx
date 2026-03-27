import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { AddWalkInModal } from "../../components/modal/add_walkin";

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

const ScissorsIcon = ({ size = 20, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M20 4L8.12 15.88" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14.47 14.48L20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8.12 8.12L12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BellIcon = ({ size = 15, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = ({ size = 15, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth="1.8" />
  </svg>
);

const ChevronRightIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
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

// Schedule action icons
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

const AnalyticsIcon = ({ size = 20, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 3v18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 9l-5 5-4-4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 10 12 15 17 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { label: "Home",         active: false },
  { label: "Services",     active: false },
  { label: "Live Status",  active: true  },
  { label: "Staff Status", active: false },
];

const STATS = [
  { Icon: CheckCircleIcon, iconColor: "#22c55e", value: "16", label: "Completed",   labelClass: "live-stat-label-green" },
  { Icon: InProgressIcon,  iconColor: "#4387ef", value: "3",  label: "In Progress", labelClass: "live-stat-label-blue"  },
  { Icon: PendingIcon,     iconColor: "#dd901d", value: "5",  label: "Pending",     labelClass: "live-stat-label-amber" },
  { Icon: CancelledIcon,   iconColor: "#ef4444", value: "2",  label: "Cancelled",   labelClass: "live-stat-label-red"   },
];

// Queue sections: type = "active" | "waiting" | "cancelled"
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

// Schedule: status = "done" | "active" | "next"
const SCHEDULE = [
  { stylist: "Carlos R.", time: "9:45 AM",  client: "Tom Lee",        service: "Beard Trim",  status: "done",   dotClass: "live-sched-dot-green" },
  { stylist: "John D.",   time: "10:00 AM", client: "Paul Cordiz",    service: "Hair Color",  status: "done",   dotClass: "live-sched-dot-green" },
  { stylist: "Mike S.",   time: "10:15 AM", client: "Juan Dela Cruz", service: "Haircut",     status: "active", dotClass: "live-sched-dot-green" },
  { stylist: "John D.",   time: "10:15 AM", client: "Pedro Santos",   service: "Beard Trim",  status: "active", dotClass: "live-sched-dot-green" },
  { stylist: "Carlos R.", time: "10:45 AM", client: "Maria Garcia",   service: "Hair color",  status: "active", dotClass: "live-sched-dot-green" },
  { stylist: "Mike S.",   time: "11:05 AM", client: "Anna Reyes",     service: "Full Service",status: "next",   dotClass: "live-sched-dot-amber" },
];

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

/* ── Navbar ── */
const AdminNavbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleNavigation = (label) => {
    if (label === "Home") {
      navigate("/admin/dashboard");
    } else if (label === "Services") {
      navigate("/admin/dashboard/services");
    } else if (label === "Live Status") {
      navigate("/admin/dashboard/live-status");
    } else if (label === "Staff Status") {
      navigate("/admin/dashboard/staff-status");
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
        {NAV_ITEMS.map((item) => (
          <button 
            key={item.label} 
            className={`admin-nav-link ${item.active ? "active" : ""}`}
            onClick={() => handleNavigation(item.label)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="admin-nav-right">
        <div className="admin-nav-user">
          <div className="admin-nav-avatar">A</div>
          <span className="admin-nav-username">Administrator</span>
        </div>
        <div className="admin-nav-divider" />
        <button className="admin-nav-logout" onClick={onLogout}>Log Out</button>
      </div>
    </header>
  );
};

/* ── Page header + stat cards ── */
const PageHeader = ({ date = "Saturday, Dec 7, 2024" }) => (
  <>
    <div className="dash-page-header">
      <div className="dash-page-title-block">
        <h1 className="dash-page-title">Admin Dashboard</h1>
        <p className="dash-page-subtitle">BeautyBook Pro · {date}</p>
      </div>
      <div className="dash-page-actions">
        <button className="dash-action-btn">
          <BellIcon size={14} color="#fff" />
          Notifications
        </button>
        <button className="dash-action-btn">
          <SettingsIcon size={14} color="#fff" />
          Settings
        </button>
      </div>
    </div>

    <div className="live-stats-row">
      {STATS.map(({ Icon, iconColor, value, label, labelClass }, i) => (
        <div key={i} className="dash-stat-card">
          <div className="dash-stat-top">
            <div className="dash-stat-icon-box">
              <Icon size={20} color={iconColor} />
            </div>
          </div>
          <div className="dash-stat-bottom">
            <p className="dash-stat-value">{value}</p>
            <p className={labelClass}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  </>
);

/* ── Single queue item ── */
const QueueItem = ({ id, type, number, name, service, statusTop, statusSub, details, isExpanded, onExpandToggle }) => {
  const isActive    = type === "active";
  const isCancelled = type === "cancelled";
  const rowClass    = isActive ? "live-queue-row-active"
                    : isCancelled ? "live-queue-row-cancelled"
                    : "live-queue-row-waiting";

  const handleChevronClick = () => {
    onExpandToggle(id);
  };

  return (
    <>
      <div className={rowClass}>
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
            <span className={isActive ? "live-status-now" : isCancelled ? "live-status-red" : "live-status-wait"}>{statusTop}</span>
            <span className={isCancelled ? "live-status-red" : "live-status-sub"}>{statusSub}</span>
          </div>
          <button 
            className="live-queue-chevron"
            onClick={handleChevronClick}
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
        <div style={{
          padding: "12px 16px",
          backgroundColor: "rgba(26, 15, 0, 0.15)",
          borderLeft: "3px solid #dd901d",
          marginBottom: "8px",
          borderRadius: "0 8px 8px 0"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#dd901d", fontWeight: "600", display: "block", marginBottom: "4px", fontFamily: "Inter, sans-serif" }}>Service Selected</span>
              <span style={{ fontSize: "14px", color: "#f5f5f5", fontWeight: "500", fontFamily: "Inter, sans-serif" }}>{details.serviceSelected}</span>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "#dd901d", fontWeight: "600", display: "block", marginBottom: "4px", fontFamily: "Inter, sans-serif" }}>Current Service</span>
              <span style={{ fontSize: "14px", color: "#f5f5f5", fontWeight: "500", fontFamily: "Inter, sans-serif" }}>{details.currentService}</span>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "#dd901d", fontWeight: "600", display: "block", marginBottom: "4px", fontFamily: "Inter, sans-serif" }}>Starting Time</span>
              <span style={{ fontSize: "14px", color: "#f5f5f5", fontWeight: "500", fontFamily: "Inter, sans-serif" }}>{details.startTime}</span>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "#dd901d", fontWeight: "600", display: "block", marginBottom: "4px", fontFamily: "Inter, sans-serif" }}>Estimated Time</span>
              <span style={{ fontSize: "14px", color: "#f5f5f5", fontWeight: "500", fontFamily: "Inter, sans-serif" }}>{details.estimatedTime}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};



/* ── Live Queue panel ── */
const LiveQueuePanel = ({ onOpenWalkInModal }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItemId, setExpandedItemId] = useState(null);

  const handleExpandToggle = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

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
            className="live-add-walkin-btn-small"
            onClick={onOpenWalkInModal}
            title="Add a walk-in customer"
          >
            <PlusIcon size={10} color="#000" />
            Add Walk-in
          </button>
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
            <p className="live-section-label">{section.label}</p>
            <div className="live-queue-group">
              {section.items.map((item, ii) => (
                <QueueItem 
                  key={ii} 
                  {...item}
                  isExpanded={expandedItemId === item.id}
                  onExpandToggle={handleExpandToggle}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Single schedule row ── */
const ScheduleRow = ({ stylist, time, client, service, status, dotClass }) => {
  const isActive = status === "active";
  const isDone   = status === "done";
  const isNext   = status === "next";

  const StatusIcon = isDone   ? () => <DoneIcon size={14} color="#22c55e" />
                   : isActive ? () => <PlayIcon size={14} color="#dd901d" />
                   :            () => <NextIcon size={14} color="#988f81" />;

  return (
    <div className={`live-schedule-row ${isActive ? "live-schedule-row-active" : ""}`}>
      <div className="live-schedule-left">
        <div className="live-schedule-stylist">
          <div className="live-sched-name-row">
            <span className={`live-sched-dot ${dotClass}`} />
            <span className="live-schedule-stylist-name">{stylist}</span>
          </div>
          <span className="live-schedule-time">{time}</span>
        </div>
        <div className="live-schedule-divider-v" />
        <div className="live-schedule-client">
          <span className="live-schedule-client-name">{client}</span>
          <span className="live-schedule-service">{service}</span>
        </div>
      </div>
      <button className="live-schedule-icon-btn" aria-label={status}>
        <StatusIcon />
      </button>
    </div>
  );
};

/* ── Today's Schedule panel ── */
const SchedulePanel = ({ date = "Dec 7, 2024" }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="live-schedule-panel">
      <div className="live-schedule-header">
        <div>
          <h3 className="live-schedule-title">Today's Schedule</h3>
          <span className="live-schedule-date">{date}</span>
        </div>
        <button 
          className="live-schedule-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      </div>

      <div className={isExpanded ? "live-schedule-scroll" : "live-schedule-scroll-limited"}>
        {SCHEDULE.map((item, i) => (
          <ScheduleRow key={i} {...item} />
        ))}
      </div>
    </div>
  );
};

/* ── Analytics panel ── */
const AnalyticsPanel = () => (
  <div className="dash-sidebar-panel">
    <div className="dash-analytics-header">
      <div className="dash-analytics-icon-box">
        <AnalyticsIcon size={20} color="#000" />
      </div>
      <div className="dash-analytics-text">
        <h3 className="dash-analytics-title">Analytics</h3>
        <p className="dash-analytics-sub">View Detailed Reports</p>
      </div>
    </div>
    <button className="dash-download-btn">
      Download Reports
      <DownloadIcon size={13} color="currentColor" />
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════

export const AdminDashboardLiveStatus = ({ date }) => {
  const navigate = useNavigate();
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  const handleAddWalkIn = (walkInData) => {
    console.log("Walk-in added:", walkInData);
    // Here you can integrate with your API or state management
    // For now, just logging the data
  };

  return (
    <div className="dash-root">
      <AdminNavbar onLogout={handleLogout} />

      <main className="dash-main">
        <PageHeader date={date} />

        <div className="live-page-grid">
          {/* Left — Live Queue */}
          <LiveQueuePanel onOpenWalkInModal={() => setShowWalkInModal(true)} />

          {/* Right — Schedule + Analytics */}
          <div className="live-sidebar">
            <SchedulePanel date="Dec 7, 2024" />
            <AnalyticsPanel />
          </div>
        </div>
      </main>

      {/* Walk-in Modal - Rendered at page level for proper positioning */}
      <AddWalkInModal 
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSubmit={handleAddWalkIn}
      />
    </div>
  );
};

export default AdminDashboardLiveStatus;
