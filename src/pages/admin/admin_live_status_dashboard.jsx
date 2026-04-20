import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { AddWalkInModal } from "../../components/modal/admin/add_walkin";

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

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="3.5" stroke="#000" strokeWidth="2"/>
    <circle cx="7" cy="15" r="3.5" stroke="#000" strokeWidth="2"/>
    <path d="M9.8 8.8l7 7M9.8 13.2L17 6.2" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DashboardIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
    <rect x="10" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
  </svg>
);

const GridIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2h5v5H2zM11 2h5v5h-5zM2 11h5v5H2zM11 11h5v5h-5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

const ActivityIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 9h16M1 1h16v14H1z" stroke={color} strokeWidth="1.6"/>
    <circle cx="9" cy="6" r="2" fill={color}/>
  </svg>
);

const UserGroupIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="5" r="3" stroke={color} strokeWidth="1.6"/>
    <circle cx="12" cy="7" r="2.5" stroke={color} strokeWidth="1.5"/>
    <path d="M1 16c0-2.5 1.8-4 5-4s5 1.5 5 4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M10 14c0-1.5 1-2.5 3-2.5s3 1 3 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LogOutIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 15H3.5A1.5 1.5 0 012 13.5v-9A1.5 1.5 0 013.5 3H7" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M12 12l4-3-4-3M16 9H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: DashboardIcon },
  { id: "services", label: "Services", icon: GridIcon },
  { id: "live-status", label: "Live Status", icon: ActivityIcon },
  { id: "staff-status", label: "Staff Status", icon: UserGroupIcon },
];

const STATS = [
  { Icon: CheckCircleIcon, iconColor: "#22c55e", value: "16", label: "Completed",   labelClass: "live-stat-label-green" },
  { Icon: InProgressIcon,  iconColor: "#4387ef", value: "3",  label: "In Progress", labelClass: "live-stat-label-blue"  },
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

/* ── Sidebar ── */
const AdminSidebar = ({ activeNav, setActiveNav, sidebarExpanded, setSidebarExpanded, onLogout }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleNavClick = (itemId) => {
    setActiveNav(itemId);
    if (itemId === "home") {
      navigate("/admin/dashboard");
    } else if (itemId === "services") {
      navigate("/admin/dashboard/services");
    } else if (itemId === "live-status") {
      navigate("/admin/dashboard/live-status");
    } else if (itemId === "staff-status") {
      navigate("/admin/dashboard/staff-status");
    }
  };

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  return (
    <aside className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateX(0)" : "translateX(-16px)",
      transition: "all 0.5s ease"
    }}>
      {/* Logo + Toggle */}
      <div className="sidebar-logo-section">
        <button 
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="logo-toggle-btn"
          title="Toggle sidebar"
        >
          <div className="logo-badge">
            <LogoIcon />
          </div>
        </button>
        {sidebarExpanded && <span className="brand-name">BeautyBook Pro</span>}
      </div>

      {/* Admin pill */}
      {sidebarExpanded && (
        <div className="admin-badge-pill">
          <div className="admin-badge-circle">A</div>
          <span className="admin-badge-text">Administrator</span>
        </div>
      )}

      {/* Nav items */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-button ${isActive ? "active" : ""}`}
              title={item.label}
            >
              <item.icon color={isActive ? "#000" : "currentColor"} />
              {sidebarExpanded && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Log Out */}
      <div className="sidebar-logout-section">
        <button onClick={handleLogout} className="logout-button" title="Log out">
          <LogOutIcon />
          {sidebarExpanded && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

/* ── Page header + stat cards ── */
const PageTitle = () => {
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="dash-page-header">
      <div className="dash-page-title-block">
        <h1 className="dash-page-title">Live Status</h1>
        <p className="dash-page-subtitle">BeautyBook Pro · {todayDate}</p>
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
  );
};

/* ── Metric cards for hero section ── */
const PageMetrics = () => (
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
);

/* ── Single queue item ── */
const QueueItem = ({ id, type, number, name, service, statusTop, statusSub, details, isExpanded, onExpandToggle, onCompleteService }) => {
  const isActive    = type === "active";
  const isCancelled = type === "cancelled";
  const rowClass    = isActive ? "live-queue-row-active"
                    : isCancelled ? "live-queue-row-cancelled"
                    : "live-queue-row-waiting";

  const handleChevronClick = () => {
    onExpandToggle(id);
  };

  const handleCompleteService = () => {
    if (onCompleteService) {
      onCompleteService(id, name, service);
    }
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
                onClick={handleCompleteService}
                className="dash-complete-btn"
                onMouseOver={(e) => e.target.style.backgroundColor = "#16a34a"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#22c55e"}
              >
                <CheckCircleIcon size={16} color="#fff" />
                Complete Service
              </button>
            )}
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
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments data on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current appointments
        const currentRes = await fetch('/api/appointments/read/by-status?status=current');
        const currentData = await currentRes.json();
        
        // Fetch pending appointments
        const pendingRes = await fetch('/api/appointments/read/by-status?status=pending');
        const pendingData = await pendingRes.json();

        if (currentData.success) {
          setCurrentAppointments(currentData.appointments || []);
        }
        if (pendingData.success) {
          setPendingAppointments(pendingData.appointments || []);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    
    return () => {};
  }, []);

  const handleExpandToggle = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const handleCompleteService = async (itemId, customerName, service) => {
    try {
      console.log(`[LiveQueue] Completing service for ${customerName}: ${service}`);
      
      const response = await fetch('/api/appointments/update/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          status: 'done'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to mark service as complete: ${response.status}`);
      }

      const result = await response.json();
      console.log(`[LiveQueue] Service marked as complete:`, result);
      
      // Remove from current appointments locally without reloading
      setCurrentAppointments(prev => prev.filter(apt => apt.id !== itemId));
      setExpandedItemId(null);
    } catch (error) {
      console.error(`[LiveQueue] Error completing service:`, error);
      alert('Failed to mark service as complete: ' + error.message);
    }
  };

  // Transform appointments to queue item format
  const formatQueueItems = (appointments, type) => {
    return appointments.map((apt, index) => ({
      id: apt.id,
      type: type,
      number: index + 1,
      name: apt.name,
      service: `${apt.service} • ${apt.staff}`,
      statusTop: type === 'active' ? 'Now' : convertTo12HourFormat(apt.time),
      statusSub: type === 'active' ? 'In Progress' : 'Waiting',
      details: {
        serviceSelected: apt.service,
        currentService: type === 'active' ? 'In Progress' : 'Pending',
        startTime: apt.time,
        estimatedTime: '45 mins'
      }
    }));
  };

  const currentItems = formatQueueItems(currentAppointments, 'active');
  const pendingItems = formatQueueItems(pendingAppointments, 'waiting');

  // Create queue sections - only Current and Up Next, no On Deck
  const queueSections = [
    {
      label: "Current",
      items: currentItems
    },
    {
      label: "Up Next",
      items: pendingItems
    }
  ];

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

      {/* Loading State */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Loading appointments...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
          Error loading appointments: {error}
        </div>
      )}

      {/* Sections */}
      {!loading && !error && (
        <div className={isExpanded ? "live-queue-scroll" : "live-queue-scroll-limited"}>
          {queueSections.map((section, si) => (
            <div key={si}>
              <p className="live-section-label">{section.label}</p>
              <div className="live-queue-group">
                {section.items.length === 0 ? (
                  <p style={{ padding: '10px', color: '#999', fontSize: '14px' }}>No appointments</p>
                ) : (
                  section.items.map((item, ii) => (
                    <QueueItem 
                      key={ii} 
                      {...item}
                      isExpanded={expandedItemId === item.id}
                      onExpandToggle={handleExpandToggle}
                      onCompleteService={handleCompleteService}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);

        // Fetch staff data
        const staffRes = await fetch('/api/staffs');
        const staff = await staffRes.json();
        console.log('[SchedulePanel] Fetched staff:', staff);

        // Fetch current and pending appointments
        const currentRes = await fetch('/api/appointments/read/by-status?status=current');
        const currentData = await currentRes.json();
        const currentAppointments = currentData.appointments || [];

        const pendingRes = await fetch('/api/appointments/read/by-status?status=pending');
        const pendingData = await pendingRes.json();
        const pendingAppointments = pendingData.appointments || [];

        // Combine and sort by time
        const allAppointments = [...currentAppointments, ...pendingAppointments].sort((a, b) => {
          if (!a.time) return 1;
          if (!b.time) return -1;
          return a.time.localeCompare(b.time);
        });
        console.log('[SchedulePanel] Fetched appointments:', allAppointments);

        // Build schedule by matching staff with appointments
        const scheduleData = staff.map((s, index) => {
          // Find appointment for this staff member (prefer current over pending)
          const appointment = currentAppointments.find(apt => 
            apt.staff === s.names || apt.staff === s.id
          ) || pendingAppointments.find(apt => 
            apt.staff === s.names || apt.staff === s.id
          );

          return {
            stylist: s.names || `Staff ${index + 1}`,
            time: appointment?.time ? convertTo12HourFormat(appointment.time) : '—',
            client: appointment?.name || 'No appointment',
            service: appointment?.service || 'N/A',
            status: appointment ? (currentAppointments.includes(appointment) ? 'active' : 'next') : 'next',
            dotClass: currentAppointments.includes(appointment) ? 'live-sched-dot-green' : 'live-sched-dot-amber'
          };
        });

        setSchedule(scheduleData);
      } catch (error) {
        console.error('[SchedulePanel] Error fetching schedule:', error);
        // Fall back to hardcoded data
        setSchedule(SCHEDULE);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  const scheduleToDisplay = schedule.length > 0 ? schedule : SCHEDULE;

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
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Loading schedule...</div>
        ) : (
          scheduleToDisplay.map((item, i) => (
            <ScheduleRow key={i} {...item} />
          ))
        )}
      </div>
    </div>
  );
};

// Helper function to convert 24-hour time to 12-hour format
function convertTo12HourFormat(time24) {
  if (!time24) return '—';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

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
  const [activeNav, setActiveNav] = useState("live-status");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('adminSidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  const handleAddWalkIn = (walkInData) => {
    console.log("Walk-in added:", walkInData);
    // Here you can integrate with your API or state management
    // For now, just logging the data
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="super-admin-container">
      {/* Sidebar */}
      <AdminSidebar 
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="super-admin-main">
        {/* Dashboard Header - Fixed Title and Actions */}
        <header className={`dashboard-header ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          <div>
            <h1 className="dash-page-title">Live Status</h1>
            <p className="dash-page-subtitle">BeautyBook Pro · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
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
        </header>

        <main className="dashboard-main">
          {/* Metrics Cards - Hero Section */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <PageMetrics />
          </div>

        <div className="live-page-grid">
          {/* Left — Live Queue */}
          <LiveQueuePanel onOpenWalkInModal={() => setShowWalkInModal(true)} />

          {/* Right — Schedule + Analytics */}
          <div className="live-sidebar">
            <SchedulePanel date={new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
            <AnalyticsPanel />
          </div>
        </div>
      </main>
        </div>

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
