import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import CustomerHistoryModal from "../../components/modal/admin/customer_history";
import CalendarAppointmentsModal from "../../components/modal/admin/calendar_appointments";
import { StatusUpdateModal } from "../../components/modal/admin/status_update";
import { ManageServiceModal } from "../../components/modal/admin/manage_service";

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

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ServiceIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
    <rect x="13" y="3" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
    <rect x="3" y="13" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
    <rect x="13" y="13" width="8" height="8" rx="1" stroke={color} strokeWidth="1.8" />
  </svg>
);

const TrashIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
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
const PageHeader = ({ stats = { available: 0, inService: 0, onBreak: 0, offToday: 0 }, loading = false, error = null }) => {
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Create dynamic stats array
  const dynamicStats = [
    { Icon: AvailableIcon,  iconColor: "#22c55e", value: `${stats.available}`, label: "Available Stylist", labelClass: "staff-stat-label-green" },
    { Icon: InServiceIcon,  iconColor: "#4387ef", value: `${stats.inService}`, label: "In Service",         labelClass: "staff-stat-label-blue"  },
    { Icon: OnBreakIcon,    iconColor: "#dd901d", value: `${stats.onBreak}`, label: "On Break",           labelClass: "staff-stat-label-amber" },
    { Icon: OffTodayIcon,   iconColor: "#988f81", value: `${stats.offToday}`, label: "Off Today",          labelClass: "staff-stat-label-tan"   },
  ];

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-title-block">
          <h1 className="dash-page-title">Admin Dashboard</h1>
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

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '10px' }}>
          Error loading staff: {error}
        </div>
      )}

      <div className="staff-stats-row">
        {dynamicStats.map(({ Icon, iconColor, value, label, labelClass }, i) => (
          <div key={i} className="dash-stat-card">
            <div className="dash-stat-top">
              <div className="dash-stat-icon-box">
                <Icon size={20} color={iconColor} />
              </div>
            </div>
            <div className="dash-stat-bottom">
              <p className="dash-stat-value">{loading ? '—' : value}</p>
              <p className={labelClass}>{label}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/* ── Staff List panel ── */
const StaffListPanel = ({ staff: staffList, loading, error, onStaffStatusUpdate, statusUpdateModal, onOpenStatusModal, onCloseStatusModal, onOpenManageServiceModal }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [expandedStaff, setExpandedStaff] = useState(null);
  const [staff, setStaff] = useState(staffList);

  // Update staff when staffList changes
  useEffect(() => {
    setStaff(staffList);
  }, [staffList]);

  const statuses = ["Available", "In Service", "On Break", "Off Today"];

  const filteredStaff = selectedFilter 
    ? staff.filter(s => s.status === selectedFilter)
    : staff;

  const handleFilterSelect = (status) => {
    setSelectedFilter(selectedFilter === status ? null : status);
    setFilterOpen(false);
  };

  const handleStaffToggle = (staffName) => {
    setExpandedStaff(expandedStaff === staffName ? null : staffName);
  };

  const handleStatusUpdate = (staffName, newStatus) => {
    const updatedStaff = staff.map(s => 
      s.name === staffName 
        ? { 
            ...s, 
            status: newStatus,
            statusClass: newStatus === "Available" ? "staff-status-green" 
                       : newStatus === "In Service" ? "staff-status-blue"
                       : newStatus === "On Break" ? "staff-status-amber"
                       : "staff-status-tan"
          }
        : s
    );
    setStaff(updatedStaff);
    onCloseStatusModal();
    onStaffStatusUpdate?.(staffName, newStatus);
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

      {/* Loading State */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Loading staff data...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
          Error loading staff: {error}
        </div>
      )}

      {/* Staff List */}
      {!loading && !error && (
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
                    style={{
                      transform: expandedStaff === s.name ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease"
                    }}
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
                    <p className="dash-detail-label">Current Client</p>
                    <p className="dash-detail-value">{s.details.currentClient}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Start of Service</p>
                    <p className="dash-detail-value">{s.details.startOfService}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Service Done</p>
                    <p className="dash-detail-value">{s.details.serviceDone}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Time of Break</p>
                    <p className="dash-detail-value">{s.details.timeOfBreak}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Time of Clock In</p>
                    <p className="dash-detail-value">{s.details.timeOfClockIn}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Up Next Client</p>
                    <p className="dash-detail-value">{s.details.upNextClient}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">No. of Client Today</p>
                    <p className="dash-detail-value">{s.details.noOfClientToday}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Available for Walk-In</p>
                    <p className={s.details.availableForWalkIn ? "dash-detail-value-green" : "dash-detail-value-red"}>
                      {s.details.availableForWalkIn ? "Yes" : "No"}
                    </p>
                  </div>

                  {/* Update Status & Manage Service Buttons */}
                  <div style={{ gridColumn: "1 / -1", marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <button
                      onClick={() => onOpenStatusModal(s)}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#dd901d",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#c97a15";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#dd901d";
                      }}
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => onOpenManageServiceModal(s)}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#4387ef",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#3a72d6";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#4387ef";
                      }}
                    >
                      <ServiceIcon size={13} color="currentColor" />
                      Manage Service
                    </button>
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
      )}
    </div>
  );
};

/* ── Quick Actions panel ── */
const QuickActionsPanel = ({ onCustomerHistory, onCalendar }) => (
  <div className="staff-quick-panel">
    <h3 className="staff-quick-title">Quick Actions</h3>
    <button 
      className="staff-action-btn-primary"
      onClick={onCustomerHistory}
    >
      <CustomerHistoryIcon size={17} color="#000" />
      Customer History
    </button>
    <button 
      className="staff-action-btn-secondary"
      onClick={onCalendar}
    >
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
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomerHistoryOpen, setIsCustomerHistoryOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [statusUpdateModal, setStatusUpdateModal] = useState({ isOpen: false, staff: null });
  const [manageServiceModal, setManageServiceModal] = useState({ isOpen: false, staff: null });

  // Sample service categories and services data
  // TODO: Replace with actual API call to fetch categories and services
  const serviceCategories = [
    {
      id: 'hair',
      name: 'Hair Services',
      services: [
        { id: 'haircut', name: 'Haircut' },
        { id: 'hair-color', name: 'Hair Color' },
        { id: 'hair-treatment', name: 'Hair Treatment' },
        { id: 'styling', name: 'Styling' }
      ]
    },
    {
      id: 'nails',
      name: 'Nail Services',
      services: [
        { id: 'manicure', name: 'Manicure' },
        { id: 'pedicure', name: 'Pedicure' },
        { id: 'nail-art', name: 'Nail Art' }
      ]
    },
    {
      id: 'massage',
      name: 'Massage Services',
      services: [
        { id: 'body-massage', name: 'Body Massage' },
        { id: 'foot-massage', name: 'Foot Massage' },
        { id: 'facial-massage', name: 'Facial Massage' }
      ]
    },
    {
      id: 'skincare',
      name: 'Skincare',
      services: [
        { id: 'facial', name: 'Facial' },
        { id: 'skin-treatment', name: 'Skin Treatment' },
        { id: 'waxing', name: 'Waxing' }
      ]
    }
  ];

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/staffs');
        if (!res.ok) {
          throw new Error(`Failed to fetch staff: ${res.status}`);
        }
        
        const staffData = await res.json();
        
        // Transform staff data to match the dashboard format
        const transformedStaff = staffData.map((s, index) => {
          // Determine status based on in_service column
          // Priority: check in_service first, then fallback to status
          let status = 'Available';
          let statusClass = 'staff-status-green';
          let subStatus = 'Available';

          // Normalize the in_service value (trim whitespace)
          const inServiceValue = (s.in_service || '').trim().toLowerCase();
          const statusValue = (s.status || '').trim().toLowerCase();
          
          // Get the name - handle both 'name' and 'names' column variants
          const staffName = s.names || s.name || 'Unknown';

          console.log(`Processing staff: ${staffName} | status: ${statusValue} | in_service: ${inServiceValue}`);

          // Check in_service column first for specific statuses
          if (inServiceValue === 'in-service') {
            status = 'In Service';
            statusClass = 'staff-status-blue';
            subStatus = 'Serving: ' + (s.current_client || 'Client');
          } else if (inServiceValue === 'on-break') {
            status = 'On Break';
            statusClass = 'staff-status-amber';
            subStatus = 'On Break';
          } else if (inServiceValue === 'off') {
            status = 'Off Today';
            statusClass = 'staff-status-tan';
            subStatus = 'Off Today';
          } else if (statusValue === 'avail' || inServiceValue === 'avail') {
            // If no specific in_service status, check status column for 'avail'
            status = 'Available';
            statusClass = 'staff-status-green';
            subStatus = 'Available';
          }

          return {
            initial: staffName ? staffName.charAt(0).toUpperCase() : '?',
            name: staffName,
            status: status,
            statusClass: statusClass,
            subStatus: subStatus,
            details: {
              currentClient: s.current_client || 'None',
              startOfService: s.start_time || '—',
              serviceDone: s.current_service || '—',
              timeOfBreak: s.break_time || '—',
              timeOfClockIn: s.clock_in_time || '—',
              upNextClient: s.next_client || 'None',
              noOfClientToday: s.clients_today || 0,
              availableForWalkIn: statusValue === 'avail' || inServiceValue === 'avail'
            }
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
    
    return () => {};
  }, []);

  // Calculate stats based on staff data
  const stats = {
    available: staff.filter(s => s.statusClass === 'staff-status-green').length,
    inService: staff.filter(s => s.statusClass === 'staff-status-blue').length,
    onBreak: staff.filter(s => s.statusClass === 'staff-status-amber').length,
    offToday: staff.filter(s => s.statusClass === 'staff-status-tan').length
  };

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  const handleStaffStatusUpdate = (staffName, newStatus) => {
    console.log(`Updated ${staffName} status to ${newStatus}`);
    // Here you would typically make an API call to update the staff status in your backend
    // Example: await updateStaffStatus(staffName, newStatus);
  };

  const openStatusModal = (staffMember) => {
    setStatusUpdateModal({ isOpen: true, staff: staffMember });
  };

  const closeStatusModal = () => {
    setStatusUpdateModal({ isOpen: false, staff: null });
  };

  const openManageServiceModal = (staffMember) => {
    setManageServiceModal({ isOpen: true, staff: staffMember });
  };

  const closeManageServiceModal = () => {
    setManageServiceModal({ isOpen: false, staff: null });
  };

  const handleManageServiceSave = (staffName, categoryServicePairs) => {
    console.log(`Updated ${staffName} services:`, categoryServicePairs);
    // Here you would typically make an API call to update the staff services in your backend
    // Example: await updateStaffServices(staffName, categoryServicePairs);
  };

  return (
    <div className="dash-root">
      <AdminNavbar onLogout={handleLogout} />

      <main className="dash-main">
        <PageHeader date={date} stats={stats} loading={loading} error={error} />

        <div className="staff-page-grid">
          {/* Left — Staff List */}
          <StaffListPanel 
            staff={staff}
            loading={loading}
            error={error}
            onStaffStatusUpdate={handleStaffStatusUpdate}
            statusUpdateModal={statusUpdateModal}
            onOpenStatusModal={openStatusModal}
            onCloseStatusModal={closeStatusModal}
            onOpenManageServiceModal={openManageServiceModal}
          />

          {/* Right — Quick Actions + Analytics */}
          <div className="staff-sidebar">
            <QuickActionsPanel 
              onCustomerHistory={() => setIsCustomerHistoryOpen(true)}
              onCalendar={() => setIsCalendarOpen(true)}
            />
            <AnalyticsPanel />
          </div>
        </div>
      </main>

      {/* Customer History Modal */}
      <CustomerHistoryModal 
        isOpen={isCustomerHistoryOpen} 
        onClose={() => setIsCustomerHistoryOpen(false)} 
      />

      {/* Calendar Appointments Modal */}
      <CalendarAppointmentsModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={statusUpdateModal.isOpen}
        staff={statusUpdateModal.staff}
        onClose={closeStatusModal}
        onSave={(staffName, newStatus) => {
          const updatedStaff = STAFF.map(s => 
            s.name === staffName 
              ? { 
                  ...s, 
                  status: newStatus,
                  statusClass: newStatus === "Available" ? "staff-status-green" 
                             : newStatus === "In Service" ? "staff-status-blue"
                             : newStatus === "On Break" ? "staff-status-amber"
                             : "staff-status-tan"
                }
              : s
          );
          handleStaffStatusUpdate(staffName, newStatus);
          closeStatusModal();
        }}
      />

      {/* Manage Service Modal */}
      <ManageServiceModal
        isOpen={manageServiceModal.isOpen}
        staff={manageServiceModal.staff}
        onClose={closeManageServiceModal}
        onSave={handleManageServiceSave}
        serviceCategories={serviceCategories}
        services={serviceCategories.reduce((acc, cat) => {
          acc[cat.id] = cat.services;
          return acc;
        }, {})}
      />
    </div>
  );
};

export default AdminDashboardStaffStatus;