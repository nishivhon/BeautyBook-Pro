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

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { label: "Home",         active: true  },
  { label: "Services",     active: false },
  { label: "Live Status",  active: false },
  { label: "Staff Status", active: false },
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
  { Icon: CheckCircleIcon, color: "#22c55e", label: "Completed",   value: 16 },
  { Icon: InProgressIcon,  color: "#4387ef", label: "In Progress", value: 3  },
  { Icon: PendingIcon,     color: "#dd901d", label: "Pending",     value: 5  },
  { Icon: CancelledIcon,   color: "#ef4444", label: "Cancelled",   value: 2  },
];

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

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
            onClick={() => handleNavigation(item.label)}
            className={`admin-nav-link ${item.active ? "active" : ""}`}
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
        <button className="admin-nav-logout" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </header>
  );
};

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

    <div className="dash-stats-row">
      {STATS.map(({ Icon, badge, badgeType, value, label }, i) => (
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
  </>
);

const LiveQueue = ({ onOpenWalkInModal }) => {
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
    
    // Only refresh if component is still mounted
    let isMounted = true;
    const interval = setInterval(() => {
      if (isMounted) {
        fetchAppointments();
      }
    }, 60000); // 60 seconds
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCompleteService = (itemId, customerName, service) => {
    console.log(`Service completed for ${customerName}: ${service}`);
    // Here you can integrate with your API to mark the service as complete
    // For now, just logging the data
    // You could also remove the item from the queue or update its status
  };

  // Transform appointments to queue item format
  const formatQueueItems = (appointments, type) => {
    return appointments.map((apt, index) => ({
      id: apt.id,
      type: type,
      number: index + 1,
      name: apt.name,
      service: `${apt.service} • ${apt.staff}`,
      statusTop: type === 'active' ? 'Now' : `${Math.random() * 40 | 0} mins`,
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

  const QueueItem = ({ id, type, number, name, service, statusTop, statusSub, details, onCompleteService }) => {
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
                    <QueueItem key={ii} {...item} onCompleteService={handleCompleteService} />
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

const StaffStatus = () => {
  const navigate = useNavigate();

  const handleManageClick = () => {
    navigate("/admin/dashboard/staff-status");
  };

  return (
    <div className="dash-sidebar-panel">
      <div className="dash-sidebar-header">
        <h3 className="dash-sidebar-title">Staff Status</h3>
        <button className="dash-panel-manage-btn" onClick={handleManageClick}>Manage</button>
      </div>
    <div className="dash-staff-list">
      {STAFF.map((s, i) => (
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
  </div>
  );
};

const SummaryPanel = () => (
  <div className="dash-sidebar-panel">
    <h3 className="dash-sidebar-title">Summary</h3>
    <div className="dash-summary-list">
      {SUMMARY.map(({ Icon, color, label, value }, i) => (
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

  return (
    <div className="dash-root">
      <AdminNavbar onLogout={handleLogout} />

      <main className="dash-main">
        <PageHeader date={date} />

        <div className="dash-content-grid">
          <LiveQueue 
            onOpenWalkInModal={() => setShowWalkInModal(true)}
          />

          <div className="dash-sidebar">
            <StaffStatus />
            <SummaryPanel />
            <AnalyticsPanel />
          </div>
        </div>
      </main>

      <AddWalkInModal 
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSubmit={handleAddWalkIn}
      />
    </div>
  );
};

export default AdminDashboard;