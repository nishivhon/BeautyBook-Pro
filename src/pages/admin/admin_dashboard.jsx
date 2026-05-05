import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import PasswordReminderBanner from "../../components/PasswordReminderBanner";
import { AddWalkInModal } from "../../components/modal/customer/add_walkin";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";
import { AdminHeaderActions } from "../../components/admin/AdminHeaderActions";

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

const ChevronRightIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="15" r="1" fill={color} />
    <circle cx="12" cy="15" r="1" fill={color} />
    <circle cx="16" cy="15" r="1" fill={color} />
  </svg>
);

const QueueIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="5" r="2" stroke={color} strokeWidth="1.8" />
    <circle cx="9" cy="12" r="2" stroke={color} strokeWidth="1.8" />
    <circle cx="9" cy="19" r="2" stroke={color} strokeWidth="1.8" />
    <path d="M13 5h8M13 12h8M13 19h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const RevenueIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

const ProceedIcon = ({ size = 14, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M10 8l6 4-6 4V8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
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
  { Icon: CalendarIcon, badge: "+3",      badgeType: "green", value: "24",      label: "Today's Appointments" },
  { Icon: QueueIcon,    badge: null,      badgeType: null,    value: "8",       label: "In Queue Now"         },
  { Icon: RevenueIcon,  badge: "+15%",    badgeType: "green", value: "₱12,450", label: "Revenue Today"        },
  { Icon: ClockIcon,    badge: "-5 mins", badgeType: "blue",  value: "18 mins", label: "Avg. Waiting Time"    },
];

const CURRENT_QUEUE = [
  { name: "Juan Dela Cruz", service: "Haircut • Mike S.",      status: "Now", sub: "In Progress" },
  { name: "Pedro Santos",   service: "Beard Trim • John D.",   status: "Now", sub: "In Progress" },
  { name: "Maria Garcia",   service: "Hair Color • Carlos R.", status: "Now", sub: "In Progress" },
];

const NEXT_QUEUE = [
  { number: 1, name: "Anna Reyes", service: "Full Service • Mike S.", wait: "20 mins", sub: "Waiting" },
];

const STAFF = [
  { initial: "M", name: "Mike Santos",     subStatus: "Serving: Juan D.", dotClass: "dash-staff-status-dot-green", nextTime: "10:30 AM" },
  { initial: "J", name: "Daniel Smith",    subStatus: "Available",        dotClass: "dash-staff-status-dot-amber", nextTime: "1:00 PM"  },
  { initial: "C", name: "Antonio Marquez", subStatus: "On Break",         dotClass: "dash-staff-status-dot-gray",  nextTime: "1:30 PM"  },
];

const SUMMARY = [
  { Icon: CheckCircleIcon, color: "#22c55e", label: "Completed",   value: 0 },
  { Icon: InProgressIcon,  color: "#4387ef", label: "In Progress", value: 0  },
  { Icon: PendingIcon,     color: "#dd901d", label: "Pending",     value: 0  },
  { Icon: CancelledIcon,   color: "#ef4444", label: "Cancelled",   value: 0  },
];

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

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

/* ── Page title + actions ── */
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
        <h1 className="dash-page-title">Admin Dashboard</h1>
        <p className="dash-page-subtitle">BeautyBook Pro · {todayDate}</p>
      </div>
      <AdminHeaderActions />
    </div>
  );
};

/* ── Metric cards for hero section ── */
const PageMetrics = ({ stats }) => (
  <div className="dash-stats-row">
    {stats.map(({ Icon, badge, badgeType, value, label }, i) => (
      <div key={i} className="dash-stat-card">
        <div className="dash-stat-top">
          <div className="dash-stat-icon-box">
            <Icon size={20} color="#dd901d" />
          </div>
          {badge && (
            <span className={`dash-stat-badge ${badgeType === "green" ? "dash-stat-badge-green" : "dash-stat-badge-blue"}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="dash-stat-bottom">
          <p className="dash-stat-value">{value}</p>
          <p className="dash-stat-label">{label}</p>
        </div>
      </div>
    ))}
  </div>
);

const LiveQueue = ({ onOpenWalkInModal, onProceedClick }) => {
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
        if (!currentRes.ok) {
          throw new Error(`Current appointments fetch failed: ${currentRes.status}`);
        }
        const currentData = await currentRes.json();
        
        // Fetch pending appointments
        const pendingRes = await fetch('/api/appointments/read/by-status?status=pending');
        if (!pendingRes.ok) {
          throw new Error(`Pending appointments fetch failed: ${pendingRes.status}`);
        }
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

  const handleCompleteService = async (itemId, customerName, service) => {
    try {
      console.log(`Service completed for ${customerName}: ${service}`);
      console.log(`Updating appointment ${itemId} status to 'done'`);
      
      const response = await fetch('/api/appointments/update/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          status: 'done'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to complete service: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Service completion result:`, result);
      
      // Remove from current appointments silently
      setCurrentAppointments(prev => prev.filter(apt => apt.id !== itemId));
      
      alert(`✓ Service marked as done!`);
    } catch (error) {
      console.error(`Error completing service:`, error);
      alert('Failed to complete service: ' + error.message);
    }
  };

  // Transform appointments to queue item format
  const formatQueueItems = (appointments, type) => {
    const formatTimeToAmPm = (time24) => {
      if (!time24) return '';
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes}${ampm}`;
    };

    return appointments.map((apt, index) => {
      // Extract service name - should come from API now
      const serviceName = apt.service || 'Service';
      
      return {
        id: apt.id,
        type: type,
        number: index + 1,
        name: apt.name,
        staff: apt.staff,
        service: `${serviceName} • ${apt.staff}`,
        statusTop: type === 'active' ? 'Now' : formatTimeToAmPm(apt.time),
        statusSub: type === 'active' ? 'In Progress' : 'Waiting',
        details: {
          serviceSelected: serviceName,
          currentService: type === 'active' ? 'In Progress' : 'Pending',
          startTime: apt.time,
          estimatedTime: '45 mins'
        }
      };
    });
  };

  const currentItems = formatQueueItems(currentAppointments, 'active');
  
  // Filter pending items to only show today's appointments with actual bookings (not empty slots)
  const today = new Date().toISOString().split('T')[0];
  const todayPendingAppointments = pendingAppointments.filter(apt => 
    apt.date === today && apt.name && apt.name !== 'Unknown'
  );
  const pendingItems = formatQueueItems(todayPendingAppointments, 'waiting');

  // Create queue sections - only include sections with items
  const queueSections = [
    {
      label: "Current",
      items: currentItems
    },
    {
      label: "Up Next",
      items: pendingItems
    }
  ].filter(section => section.items.length > 0); // Only show sections with items

  const QueueItem = ({ id, type, number, name, staff, service, statusTop, statusSub, details, onCompleteService, showProceedButton = false, onProceed, isProceedEnabled = true, onProceedClick }) => {
    const isActive = type === "active";
    const isCancelled = type === "cancelled";
    const rowClass = isActive ? "live-queue-row-active"
                   : isCancelled ? "live-queue-row-cancelled"
                   : "live-queue-row-waiting";
    const isItemExpanded = expandedItemId === id;

    const handleChevronClick = () => {
      setExpandedItemId(isItemExpanded ? null : id);
    };

    const handleCompleteService = () => {
      if (onCompleteService) {
        onCompleteService(id, name, service);
      }
    };

    const handleProceed = () => {
      if (isProceedEnabled && onProceedClick) {
        onProceedClick(id, name, service, staff);
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
                transform: isItemExpanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease"
              }}
            >
              <ChevronRightIcon size={13} color="currentColor" />
            </button>
          </div>
        </div>

        {isItemExpanded && (
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

              {showProceedButton && !isActive && (
                <button
                  onClick={handleProceed}
                  disabled={!isProceedEnabled}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: isProceedEnabled ? "#dd901d" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: isProceedEnabled ? "pointer" : "not-allowed",
                    fontFamily: "Inter, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    opacity: isProceedEnabled ? 1 : 0.6,
                  }}
                  onMouseOver={(e) => {
                    if (isProceedEnabled) {
                      e.target.style.backgroundColor = "#c47a14";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (isProceedEnabled) {
                      e.target.style.backgroundColor = "#dd901d";
                    }
                  }}
                >
                  <ProceedIcon size={14} color="#fff" />
                  Proceed
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
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
          >
            <PlusIcon size={10} color="#000" />
            Add Walk-in
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
        <div className="live-queue-scroll-limited">
          {queueSections.map((section, si) => (
            <div key={si}>
              <p className="live-section-label">{section.label}</p>
              <div className="live-queue-group">
                {section.items.length === 0 ? (
                  <p style={{ padding: '10px', color: '#999', fontSize: '14px' }}>No appointments</p>
                ) : (
                  section.items.map((item, ii) => {
                    const isUpNext = section.label === "Up Next";
                    return (
                      <QueueItem 
                        key={ii} 
                        {...item} 
                        onCompleteService={handleCompleteService}
                        showProceedButton={isUpNext}
                        isProceedEnabled={ii < 3}
                        onProceedClick={onProceedClick}
                      />
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StaffStatus = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [resStaff, resSlots] = await Promise.all([
          fetch('/api/staffs'),
          fetch('/api/appointments/read/slots')
        ]);
        
        if (!resStaff.ok) {
          throw new Error(`Failed to fetch staff: ${resStaff.status}`);
        }
        
        const staffData = await resStaff.json();
        
        // Handle slots response - ensure it's an array
        const slotsData = resSlots.ok ? await resSlots.json() : null;
        const allSlots = Array.isArray(slotsData) ? slotsData : [];

        // Format time helper
        const formatTimeToAmPm = (time24) => {
          if (!time24) return 'N/A';
          const [hours, minutes] = time24.split(':');
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour % 12 || 12;
          return `${hour12}:${minutes}${ampm}`;
        };

        // Transform staff data to match the dashboard format
        const transformedStaff = staffData.map((s) => {
          // Get the name - handle both 'name' and 'names' column variants
          const staffName = s.names || s.name || 'Unknown';
          
          // Determine status based on in_service column
          let dotClass = 'dash-staff-status-dot-gray';
          let subStatus = 'Available';
          
          const inServiceValue = (s.in_service || '').trim().toLowerCase();
          
          if (inServiceValue === 'in-service') {
            dotClass = 'dash-staff-status-dot-green';
            subStatus = `Serving: ${s.current_client || 'Client'}`;
          } else if (inServiceValue === 'on-break') {
            dotClass = 'dash-staff-status-dot-amber';
            subStatus = 'On Break';
          } else if (inServiceValue === 'off') {
            dotClass = 'dash-staff-status-dot-red';
            subStatus = 'Off Today';
          } else {
            dotClass = 'dash-staff-status-dot-green';
            subStatus = 'Available';
          }

          // Find next slot for this staff from available_slots table
          const nextSlot = allSlots.find(slot => slot.assigned_staff === staffName);
          const nextTime = nextSlot ? formatTimeToAmPm(nextSlot.time_slot) : 'N/A';

          return {
            initial: staffName ? staffName.charAt(0).toUpperCase() : '?',
            name: staffName,
            subStatus: subStatus,
            dotClass: dotClass,
            nextTime: nextTime
          };
        });

        setStaff(transformedStaff);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleManageClick = () => {
    navigate("/admin/dashboard/staff-status");
  };

  return (
    <div className="dash-sidebar-panel">
      <div className="dash-sidebar-header">
        <h3 className="dash-sidebar-title">Staff Status</h3>
        <button className="dash-panel-manage-btn" onClick={handleManageClick} style={{ color: "#fff" }}>Manage</button>
      </div>
      
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Loading staff...
        </div>
      )}
      
      {error && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
          Error loading staff
        </div>
      )}
      
      {!loading && !error && (
        <div className="dash-staff-list live-queue-scroll-limited" style={{ maxHeight: "200px", paddingRight: "16px", padding: "12px 0" }}>
          {staff.map((s, i) => (
            <div key={i} className="dash-staff-row">
              <div className="dash-staff-left">
                <div className="dash-staff-avatar-wrap">
                  <div className="dash-staff-avatar">{s.initial}</div>
                  <span className={`dash-staff-status-dot ${s.dotClass}`} />
                </div>
                <div className="dash-staff-info">
                  <span className="dash-staff-name">{s.name}</span>
                  <span className="dash-staff-substatus">{s.subStatus}</span>
                </div>
              </div>
              <div className="dash-staff-right">
                <span className="dash-staff-next-label">Next:</span>
                <span className="dash-staff-next-time">{s.nextTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SummaryPanel = () => {
  const [summary, setSummary] = useState([
    { Icon: CheckCircleIcon, color: "#22c55e", label: "Completed",   value: 0 },
    { Icon: InProgressIcon,  color: "#4387ef", label: "In Progress", value: 0  },
    { Icon: PendingIcon,     color: "#dd901d", label: "Pending",     value: 0  },
    { Icon: CancelledIcon,   color: "#ef4444", label: "Cancelled",   value: 0  },
  ]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [resCompleted, resInProgress, resPending, resCancelled] = await Promise.all([
          fetch('/api/appointments/read/by-status?status=done'),
          fetch('/api/appointments/read/by-status?status=current'),
          fetch('/api/appointments/read/by-status?status=pending'),
          fetch('/api/appointments/read/by-status?status=cancelled')
        ]);

        const completedData = resCompleted.ok ? await resCompleted.json() : {};
        const inProgressData = resInProgress.ok ? await resInProgress.json() : {};
        const pendingData = resPending.ok ? await resPending.json() : {};
        const cancelledData = resCancelled.ok ? await resCancelled.json() : {};

        // Extract counts from the API response structure (has count property and appointments array)
        const completedCount = completedData.count || (Array.isArray(completedData.appointments) ? completedData.appointments.length : 0);
        const inProgressCount = inProgressData.count || (Array.isArray(inProgressData.appointments) ? inProgressData.appointments.length : 0);
        const pendingCount = pendingData.count || (Array.isArray(pendingData.appointments) ? pendingData.appointments.length : 0);
        const cancelledCount = cancelledData.count || (Array.isArray(cancelledData.appointments) ? cancelledData.appointments.length : 0);

        setSummary([
          { Icon: CheckCircleIcon, color: "#22c55e", label: "Completed",   value: completedCount },
          { Icon: InProgressIcon,  color: "#4387ef", label: "In Progress", value: inProgressCount  },
          { Icon: PendingIcon,     color: "#dd901d", label: "Pending",     value: pendingCount  },
          { Icon: CancelledIcon,   color: "#ef4444", label: "Cancelled",   value: cancelledCount  },
        ]);
      } catch (error) {
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="dash-sidebar-panel">
      <h3 className="dash-sidebar-title">Summary</h3>
      <div className="dash-summary-list">
        {summary.map(({ Icon, color, label, value }, i) => (
          <div key={i} className="dash-summary-row">
            <div className="dash-summary-left">
              <Icon size={18} color={color} />
              <span className="dash-summary-label">{label}</span>
            </div>
            <span className="dash-summary-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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

export const AdminDashboard = ({ date }) => {
  const navigate = useNavigate();
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [proceedConfirmId, setProceedConfirmId] = useState(null);
  const [proceedConfirmData, setProceedConfirmData] = useState(null);
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [doneAppointments, setDoneAppointments] = useState([]);
  const [stats, setStats] = useState([
    { Icon: CalendarIcon, badge: "+3",      badgeType: "green", value: "0",      label: "Today's Appointments" },
    { Icon: QueueIcon,    badge: null,      badgeType: null,    value: "0",       label: "In Queue Now"         },
    { Icon: RevenueIcon,  badge: "+15%",    badgeType: "green", value: "₱12,450", label: "Revenue Today"        },
    { Icon: ClockIcon,    badge: "-5 mins", badgeType: "blue",  value: "18 mins", label: "Avg. Waiting Time"    },
  ]);
  const [activeNav, setActiveNav] = useState("home");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('adminSidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch current appointments
        const currentRes = await fetch('/api/appointments/read/by-status?status=current');
        if (currentRes.ok) {
          const currentData = await currentRes.json();
          const current = currentData.appointments || [];
          setCurrentAppointments(current);
        }
        
        // Fetch pending appointments
        const pendingRes = await fetch('/api/appointments/read/by-status?status=pending');
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          const pending = pendingData.appointments || [];
          setPendingAppointments(pending);
        }

        // Fetch done appointments
        const doneRes = await fetch('/api/appointments/read/by-status?status=done');
        if (doneRes.ok) {
          const doneData = await doneRes.json();
          const done = doneData.appointments || [];
          setDoneAppointments(done);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  // Calculate stats dynamically
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('[AdminDash] Today:', today);
    console.log('[AdminDash] Current appointments:', currentAppointments.map(a => ({ name: a.name, date: a.date })));
    console.log('[AdminDash] Pending appointments:', pendingAppointments.map(a => ({ name: a.name, date: a.date })));
    console.log('[AdminDash] Done appointments:', doneAppointments.map(a => ({ name: a.name, date: a.date })));
    
    // Total appointments for today (current + pending + done)
    const todayAppointments = [
      ...currentAppointments.filter(apt => apt.date === today),
      ...pendingAppointments.filter(apt => apt.date === today),
      ...doneAppointments.filter(apt => apt.date === today)
    ];
    
    const totalToday = todayAppointments.length;
    
    // Pending/In Queue count for today (only pending status)
    const inQueueCount = pendingAppointments.filter(apt => apt.date === today).length;

    console.log('[AdminDash] Total today:', totalToday, 'In queue:', inQueueCount);

    setStats([
      { Icon: CalendarIcon, badge: "+3",      badgeType: "green", value: totalToday.toString(),      label: "Today's Appointments" },
      { Icon: QueueIcon,    badge: null,      badgeType: null,    value: inQueueCount.toString(),       label: "In Queue Now"         },
      { Icon: RevenueIcon,  badge: "+15%",    badgeType: "green", value: "₱12,450", label: "Revenue Today"        },
      { Icon: ClockIcon,    badge: "-5 mins", badgeType: "blue",  value: "18 mins", label: "Avg. Waiting Time"    },
    ]);
  }, [currentAppointments, pendingAppointments, doneAppointments]);

  const headerNotifications = useMemo(() => {
    const recentPending = pendingAppointments.slice(0, 2).map((appointment, index) => ({
      id: `pending-${appointment.id || index}`,
      tone: "amber",
      category: "New booking",
      title: `${appointment.name || "Customer"} booked ${appointment.service || "a service"}`,
      description: `${appointment.time || "TBA"} • ${appointment.staff || "Any available stylist"}`,
      time: "Just now",
      unread: true,
    }));

    const recentCurrent = currentAppointments.slice(0, 2).map((appointment, index) => ({
      id: `current-${appointment.id || index}`,
      tone: "blue",
      category: "Live queue",
      title: `${appointment.name || "Customer"} is now being served`,
      description: `${appointment.service || "Service"} • ${appointment.staff || "Assigned staff"}`,
      time: appointment.time || "Today",
      unread: index === 0,
    }));

    const recentDone = doneAppointments.slice(0, 1).map((appointment, index) => ({
      id: `done-${appointment.id || index}`,
      tone: "green",
      category: "Completed",
      title: `${appointment.name || "Customer"} appointment completed`,
      description: `${appointment.service || "Service"} finished successfully.`,
      time: "Today",
      unread: false,
    }));

    return [...recentPending, ...recentCurrent, ...recentDone].slice(0, 5);
  }, [currentAppointments, pendingAppointments, doneAppointments]);

  const handleLogout = () => {
    // Clear operator session
    logoutOperator();
    // Redirect to home
    navigate("/");
  };

  const handleAddWalkIn = (walkInData) => {
    console.log("Walk-in added:", walkInData);
    // Here you can integrate with your API or state management
    // For now, just logging the data
  };

  const handleCompleteServiceFromDialog = async (itemId, customerName, service) => {
    try {
      console.log(`[AdminDashboard] Moving appointment ${itemId} to current for ${customerName}`);
      console.log(`[AdminDashboard] Request payload:`, { id: itemId, status: 'current' });
      
      const response = await fetch('/api/appointments/update/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          status: 'current'
        })
      });

      console.log(`[AdminDashboard] Response status:`, response.status, response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[AdminDashboard] Error response:', errorData);
        alert(`API Error: ${errorData.error || response.statusText}\n${errorData.details || ''}`);
        throw new Error(`Failed to move appointment to current: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log(`[AdminDashboard] Appointment moved to current:`, result);
      console.log(`[AdminDashboard] History synced:`, result.historyUpdated, result.historyUpdateReason);
      alert(`✓ Status updated! History sync: ${result.historyUpdated ? 'YES' : 'NO'}`);

      // Refresh the page to see updates
      window.location.reload();
    } catch (error) {
      console.error('[AdminDashboard] Error moving appointment:', error);
      console.error('[AdminDashboard] Full error:', error.toString());
      alert('Failed to move appointment. Please try again.');
    }
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
            <h1 className="dash-page-title">Admin Dashboard</h1>
            <p className="dash-page-subtitle">BeautyBook Pro · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <AdminHeaderActions notifications={headerNotifications} />
        </header>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Password Reminder Banner */}
          <PasswordReminderBanner />
          
          {/* Metrics Cards - Hero Section */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <PageMetrics stats={stats} />
          </div>
          <div className="dash-content-grid">
            <LiveQueue 
              onOpenWalkInModal={() => setShowWalkInModal(true)}
              onProceedClick={(id, name, service, staff) => {
                setProceedConfirmId(id);
                setProceedConfirmData({ name, service, staff });
              }}
            />

            <div className="dash-sidebar">
              <StaffStatus />
              <SummaryPanel />
              <AnalyticsPanel />
            </div>
          </div>
        </main>
      </div>

      <AddWalkInModal 
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSubmit={handleAddWalkIn}
      />

      {proceedConfirmId && (
        <ConfirmationDialog
          isOpen={true}
          title="Move to Serving?"
          message={`Confirm that a stylist is available and ready to serve ${proceedConfirmData?.name} for ${proceedConfirmData?.service}.`}
          confirmText="Yes, Proceed"
          cancelText="Cancel"
          onConfirm={() => handleCompleteServiceFromDialog(proceedConfirmId, proceedConfirmData.name, proceedConfirmData.service)}
          onCancel={() => setProceedConfirmId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;