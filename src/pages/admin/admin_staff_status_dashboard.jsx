import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";

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

const FilterIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Stat card icons — coloured per status */
const AvailableIcon = ({ size = 20, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="18" cy="6" r="3" fill="#22c55e" />
    <path d="M16.5 6l1 1 2-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InServiceIcon = ({ size = 20, color = "#4387ef" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="6" cy="18" r="2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 4L8 14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 13.5L18 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 8L11 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const OnBreakIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 8h1a4 4 0 010 8h-1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 1v3M10 1v3M14 1v3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const OffTodayIcon = ({ size = 20, color = "#988f81" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 15l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Quick action icons */
const CustomerHistoryIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 6v6l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 16l-2 2 2 2M22 16l-2 2 2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="15" r="1" fill={color} />
    <circle cx="12" cy="15" r="1" fill={color} />
    <circle cx="16" cy="15" r="1" fill={color} />
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
  { label: "Live Status",  active: false },
  { label: "Staff Status", active: true  },
];

const STATS = [
  { Icon: AvailableIcon,  iconColor: "#22c55e", value: "1", label: "Available Stylist", labelClass: "staff-stat-label-green" },
  { Icon: InServiceIcon,  iconColor: "#4387ef", value: "3", label: "In Service",         labelClass: "staff-stat-label-blue"  },
  { Icon: OnBreakIcon,    iconColor: "#dd901d", value: "1", label: "On Break",           labelClass: "staff-stat-label-amber" },
  { Icon: OffTodayIcon,   iconColor: "#988f81", value: "0", label: "Off Today",          labelClass: "staff-stat-label-tan"   },
];

// statusClass maps to CSS class names defined in index.css
const STAFF = [
  { initial: "A", name: "Antonio Marquez", status: "On Break",   statusClass: "staff-status-amber", subStatus: "No Client Yet", 
    details: {
      currentClient: "None",
      startOfService: "—",
      serviceDone: "—",
      timeOfBreak: "2:30 PM - 3:00 PM",
      timeOfClockIn: "9:00 AM",
      upNextClient: "Sarah Johnson",
      noOfClientToday: 4,
      availableForWalkIn: false
    }
  },
  { initial: "C", name: "Carlos Reyes",    status: "In Service", statusClass: "staff-status-blue",  subStatus: "Serving: Maria Garcia", 
    details: {
      currentClient: "Maria Garcia",
      startOfService: "1:45 PM",
      serviceDone: "Hair Color",
      timeOfBreak: "—",
      timeOfClockIn: "8:30 AM",
      upNextClient: "Roberto Silva",
      noOfClientToday: 3,
      availableForWalkIn: false
    }
  },
  { initial: "D", name: "Daniel Smith",    status: "Available",  statusClass: "staff-status-green", subStatus: "No Client Yet", 
    details: {
      currentClient: "None",
      startOfService: "—",
      serviceDone: "—",
      timeOfBreak: "—",
      timeOfClockIn: "10:00 AM",
      upNextClient: "None",
      noOfClientToday: 2,
      availableForWalkIn: true
    }
  },
  { initial: "J", name: "John Dela Cruz",  status: "In Service", statusClass: "staff-status-blue",  subStatus: "Serving: Pedro Santos", 
    details: {
      currentClient: "Pedro Santos",
      startOfService: "2:00 PM",
      serviceDone: "Massage Service",
      timeOfBreak: "—",
      timeOfClockIn: "9:30 AM",
      upNextClient: "Angela Martinez",
      noOfClientToday: 5,
      availableForWalkIn: false
    }
  },
  { initial: "M", name: "Mike Santos",     status: "In Service", statusClass: "staff-status-blue",  subStatus: "Serving: Juan Dela Cruz", 
    details: {
      currentClient: "Juan Dela Cruz",
      startOfService: "1:30 PM",
      serviceDone: "Nail Service",
      timeOfBreak: "—",
      timeOfClockIn: "8:00 AM",
      upNextClient: "Maria Fernandez",
      noOfClientToday: 6,
      availableForWalkIn: false
    }
  },
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

    <div className="staff-stats-row">
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

/* ── Staff List panel ── */
const StaffListPanel = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [expandedStaff, setExpandedStaff] = useState(null);

  const statuses = ["Available", "In Service", "On Break", "Off Today"];

  const filteredStaff = selectedFilter 
    ? STAFF.filter(s => s.status === selectedFilter)
    : STAFF;

  const handleFilterSelect = (status) => {
    setSelectedFilter(selectedFilter === status ? null : status);
    setFilterOpen(false);
  };

  const handleStaffToggle = (staffName) => {
    setExpandedStaff(expandedStaff === staffName ? null : staffName);
  };

  return (
    <div className="staff-list-panel">
      <div className="staff-list-header">
        <h2 className="staff-list-title">Staff List</h2>
        <div className="staff-list-header-right">
          <div className="staff-filter-container">
            <button 
              className="staff-filter-btn" 
              aria-label="Filter"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FilterIcon size={15} color="currentColor" />
            </button>
            {filterOpen && (
              <div className="staff-filter-dropdown">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={`staff-filter-option ${selectedFilter === status ? "active" : ""}`}
                    onClick={() => handleFilterSelect(status)}
                  >
                    {status}
                  </button>
                ))}
                {selectedFilter && (
                  <button
                    className="staff-filter-clear"
                    onClick={() => setSelectedFilter(null)}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>
          <button 
            className="staff-see-less-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        </div>
      </div>

      <div className={isExpanded ? "staff-member-scroll" : "staff-member-scroll-limited"}>
        {filteredStaff.length > 0 ? (
          filteredStaff.map((s, i) => (
            <div key={i}>
              <div className="staff-member-row">
                <div className="staff-member-left">
                  <div className="staff-member-avatar">{s.initial}</div>
                  <span className="staff-member-name">{s.name}</span>
                </div>
                <div className="staff-member-right">
                  <div className="staff-member-status-col">
                    <span className={s.statusClass}>{s.status}</span>
                    <span className="staff-member-sub">{s.subStatus}</span>
                  </div>
                  <button 
                    className="staff-member-chevron"
                    onClick={() => handleStaffToggle(s.name)}
                    aria-label="View staff details"
                  >
                    <ChevronRightIcon size={13} color="currentColor" />
                  </button>
                </div>
              </div>

              {/* Expanded Staff Details */}
              {expandedStaff === s.name && (
                <div style={{
                  backgroundColor: "rgba(221, 144, 29, 0.05)",
                  borderLeft: "3px solid #dd901d",
                  padding: "16px",
                  marginTop: "8px",
                  borderRadius: "6px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px 24px"
                }}>
                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Current Client</p>
                    <p style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      margin: "0"
                    }}>{s.details.currentClient}</p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Start of Service</p>
                    <p style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      margin: "0"
                    }}>{s.details.startOfService}</p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Service Done</p>
                    <p style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      margin: "0"
                    }}>{s.details.serviceDone}</p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Time of Break</p>
                    <p style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      margin: "0"
                    }}>{s.details.timeOfBreak}</p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Time of Clock In</p>
                    <p style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      margin: "0"
                    }}>{s.details.timeOfClockIn}</p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Up Next Client</p>
                    <p style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      margin: "0"
                    }}>{s.details.upNextClient}</p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>No. of Client Today</p>
                    <p style={{
                      fontSize: "14px",
                      color: "#f5f5f5",
                      margin: "0"
                    }}>{s.details.noOfClientToday}</p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#dd901d",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Available for Walk-In</p>
                    <p style={{
                      fontSize: "14px",
                      color: s.details.availableForWalkIn ? "#22c55e" : "#ef4444",
                      margin: "0",
                      fontWeight: "600"
                    }}>{s.details.availableForWalkIn ? "Yes" : "No"}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="staff-no-results">
            <p>No staff found with this status</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Quick Actions panel ── */
const QuickActionsPanel = () => (
  <div className="staff-quick-panel">
    <h3 className="staff-quick-title">Quick Actions</h3>
    <button className="staff-action-btn-primary">
      <CustomerHistoryIcon size={17} color="#000" />
      Customer History
    </button>
    <button className="staff-action-btn-secondary">
      <CalendarIcon size={17} color="currentColor" />
      Calendar
    </button>
  </div>
);

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

export const AdminDashboardStaffStatus = ({ date }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  return (
    <div className="dash-root">
      <AdminNavbar onLogout={handleLogout} />

      <main className="dash-main">
        <PageHeader date={date} />

        <div className="staff-page-grid">
          {/* Left — Staff List */}
          <StaffListPanel />

          {/* Right — Quick Actions + Analytics */}
          <div className="staff-sidebar">
            <QuickActionsPanel />
            <AnalyticsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardStaffStatus;