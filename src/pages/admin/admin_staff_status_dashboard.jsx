import { useState, useEffect, useMemo } from "react";
import { StaffFeedbackPanel } from "./StaffFeedbackPanel.jsx";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import CustomerHistoryModal from "../../components/modal/admin/customer_history";
import { StatusUpdateModal } from "../../components/modal/admin/status_update";
import { ManageServiceModal } from "../../components/modal/admin/manage_service";
import { AdminHeaderActions } from "../../components/admin/AdminHeaderActions";
import {
  AdminDashboardNavIcon,
  AdminServicesNavIcon,
  AdminLiveStatusNavIcon,
  AdminStaffStatusNavIcon,
  AdminLogOutIcon,
  AdminIconSlot,
  AdminMetricAvailableIcon,
  AdminMetricInServiceIcon,
  AdminMetricOnBreakIcon,
  AdminMetricOffTodayIcon,
  AdminAnalyticsIcon,
  AdminDownloadIcon,
  AdminQuickActionHistoryIcon,
  AdminNavLogoIcon,
} from "../../components/admin/adminDashboardIcons";
import { LogoMark } from "../../components/public/publicPageIcons";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";
import { useToast } from "../../components/toast";

// ═══════════════════════════════════════════════════════════════════
// DARK MODE HELPER
// ═══════════════════════════════════════════════════════════════════
const isDarkMode = () => {
  if (typeof document === 'undefined') return true;
  const theme = document.documentElement.getAttribute('data-theme');
  return theme !== 'light';
};

const getThemeStyles = (darkStyles, lightStyles) => {
  return isDarkMode() ? darkStyles : lightStyles;
};

// Portal removed because the walk-in control now updates via a single toggle button.

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

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
// ICON COMPONENTS FOR SIDEBAR
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: AdminDashboardNavIcon },
  { id: "services", label: "Services", icon: AdminServicesNavIcon },
  { id: "live-status", label: "Live Status", icon: AdminLiveStatusNavIcon },
  { id: "staff-status", label: "Staff Status", icon: AdminStaffStatusNavIcon },
];

const STATS = [
  { Icon: AdminMetricAvailableIcon, value: "1", label: "Available Stylist", labelClass: "staff-stat-label-green" },
  { Icon: AdminMetricInServiceIcon, value: "3", label: "In Service", labelClass: "staff-stat-label-blue" },
  { Icon: AdminMetricOnBreakIcon, value: "1", label: "On Break", labelClass: "staff-stat-label-amber" },
  { Icon: AdminMetricOffTodayIcon, value: "0", label: "Off Today", labelClass: "staff-stat-label-tan" },
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
/* ── Sidebar ── */
const AdminSidebar = ({ activeNav, setActiveNav, sidebarExpanded, onLogout }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const headerNotifications = useMemo(() => {
    const statusFeed = STAFF.slice(0, 3).map((member, index) => ({
      id: `staff-${member.name || index}`,
      tone: member.statusClass === "staff-status-green" ? "green" : member.statusClass === "staff-status-blue" ? "blue" : member.statusClass === "staff-status-amber" ? "amber" : "tan",
      category: "Staff status",
      title: `${member.name || "Staff member"} is ${member.status || "Available"}`,
      description: member.subStatus || "Status updated.",
      time: member.details?.timeOfClockIn || "Today",
      unread: index === 0,
    }));

    const serviceFeed = STAFF
      .filter((member) => member.details?.availableForWalkIn)
      .slice(0, 1)
      .map((member, index) => ({
        id: `staff-walkin-${member.name || index}`,
        tone: "amber",
        category: "Walk-in ready",
        title: `${member.name || "Staff member"} can accept walk-ins`,
        description: "This stylist is currently available for a walk-in customer.",
        time: "Now",
        unread: true,
      }));

    return [...statusFeed, ...serviceFeed].slice(0, 5);
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
    onLogout?.();
  };

  return (
    <aside className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateX(0)" : "translateX(-16px)",
      transition: "all 0.5s ease"
    }}>
      {/* Admin pill */}
      <div className="admin-badge-pill">
        <div className="admin-badge-circle">A</div>
        <span className="admin-badge-text">Administrator</span>
      </div>

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
          <AdminLogOutIcon />
          {sidebarExpanded && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

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
          <AdminNavLogoIcon />
        </div>
        <span className="admin-nav-brand">BeautyBook Pro</span>
      </div>

      <nav className="admin-nav-links">
        {NAV_ITEMS.map((item) => (
          <button 
            key={item.id} 
            className={`admin-nav-link ${item.id === "staff-status" ? "active" : ""}`}
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
        <h1 className="dash-page-title">Staff Status</h1>
        <p className="dash-page-subtitle">BeautyBook Pro · {todayDate}</p>
      </div>
      <AdminHeaderActions />
    </div>
  );
};

/* ── Metric cards for hero section ── */
const PageMetrics = ({ stats = { available: 0, inService: 0, onBreak: 0, offToday: 0 }, loading = false, error = null }) => {
  // Create dynamic stats array
  const dynamicStats = [
    { Icon: AdminMetricAvailableIcon, value: `${stats.available}`, label: "Available Stylist", labelClass: "staff-stat-label-green" },
    { Icon: AdminMetricInServiceIcon, value: `${stats.inService}`, label: "In Service", labelClass: "staff-stat-label-blue" },
    { Icon: AdminMetricOnBreakIcon, value: `${stats.onBreak}`, label: "On Break", labelClass: "staff-stat-label-amber" },
    { Icon: AdminMetricOffTodayIcon, value: `${stats.offToday}`, label: "Off Today", labelClass: "staff-stat-label-tan" },
  ];

  return (
    <>
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '10px' }}>
          Error loading staff: {error}
        </div>
      )}
      <div className="staff-stats-row">
        {dynamicStats.map(({ Icon, value, label, labelClass }, i) => (
          <div key={i} className="dash-stat-card">
            <div className="dash-stat-top">
              <AdminIconSlot size="metric">
                <Icon />
              </AdminIconSlot>
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [expandedStaff, setExpandedStaff] = useState(null);
  const [staff, setStaff] = useState(Array.isArray(staffList) ? staffList : []);
  const [walkInStatus, setWalkInStatus] = useState({});
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    action: null, 
    staffName: "",
    staffId: null
  });

  // Update staff when staffList changes
  useEffect(() => {
    if (!Array.isArray(staffList)) {
      setStaff([]);
      setWalkInStatus({});
      return;
    }

    setStaff(staffList);
    // Initialize walk-in status from the actual walk_in column
    const initialWalkInStatus = {};
    staffList.forEach(member => {
      const isInService = String(member.status || member.in_service || '').trim().toLowerCase() === 'in service';
      initialWalkInStatus[member.name] = !isInService && member.walk_in ? "Accepting" : "Not Accepting";
    });
    setWalkInStatus(initialWalkInStatus);
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
    const currentStaff = staff.find(s => s.name === staffName);
    const shouldAcceptWalkIns = newStatus === "Available" || newStatus === "Open Slots"
      ? Boolean(currentStaff?.walk_in)
      : false;

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
    setWalkInStatus(prev => ({ ...prev, [staffName]: shouldAcceptWalkIns ? "Accepting" : "Not Accepting" }));
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
          {/* removed See more/See less toggle - fixed height handled by CSS */}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={getThemeStyles(
          {
            padding: '20px',
            textAlign: 'center',
            color: '#999'
          },
          {
            padding: '20px',
            textAlign: 'center',
            color: '#999'
          }
        )}>
          Loading staff data...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={getThemeStyles(
          {
            padding: '20px',
            textAlign: 'center',
            color: '#f5f1eb'
          },
          {
            padding: '20px',
            textAlign: 'center',
            color: '#ef4444'
          }
        )}>
          Error loading staff: {error}
        </div>
      )}

      {/* Staff List */}
      {!loading && !error && (
        <div className="staff-member-scroll-limited">
          {staff.length === 0 ? (
            <div className="container-empty-state">
              No staff available
            </div>
          ) : filteredStaff.length > 0 ? (
            filteredStaff.map((s, i) => (
            <div key={i}>
              <div className="staff-member-row no-hover">
                <div className="staff-member-left">
                  <div className="staff-member-avatar">{s.initial}</div>
                  <span className="staff-member-name">{s.name}</span>
                  {/* Walk-In Status Toggle */}
                      {s.status === "Available" && (
                    <div style={{ position: "relative", marginLeft: "12px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          const isAccepting = walkInStatus[s.name] === "Accepting";
                          setConfirmModal({
                            isOpen: true,
                            title: "Confirm Walk-In Status",
                            message: isAccepting
                              ? `Prevent ${s.name} from accepting walk-ins?`
                              : `Allow ${s.name} to accept walk-ins?`,
                            action: isAccepting ? "walk_in_reject" : "walk_in_accept",
                            staffName: s.name,
                            staffId: s.id
                          });
                        }}
                        className={`walkin-chip ${walkInStatus[s.name] === "Accepting" ? 'walkin-accept' : 'walkin-reject'}`}
                        aria-pressed={walkInStatus[s.name] === "Accepting"}
                        title={walkInStatus[s.name] === "Accepting"
                          ? `Click to stop accepting walk-ins for ${s.name}`
                          : `Click to allow ${s.name} to accept walk-ins`}
                      >
                        {walkInStatus[s.name] === "Accepting" ? "Accepting Walk-In" : "Not Accepting"}
                      </button>
                      
                    </div>
                  )}
                </div>
                <div className="staff-member-right">
                  <div className="staff-member-status-col">
                    <span className={s.statusClass}>{s.status}</span>
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
                <div style={getThemeStyles(
                  {
                    backgroundColor: "rgba(20, 17, 15, 0.5)",
                    borderLeft: "3px solid rgba(221, 144, 29, 0.35)",
                    padding: "16px",
                    marginTop: "8px",
                    borderRadius: "6px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px 24px"
                  },
                  {
                    backgroundColor: "rgba(230, 100, 140, 0.35)",
                    borderLeft: "3px solid rgba(213, 210, 211, 0.35)",
                    padding: "16px",
                    marginTop: "8px",
                    borderRadius: "6px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px 24px"
                  }
                )}>
                  <div>
                    <p className="dash-detail-label">Current Client</p>
                    <p className="dash-detail-value">{s.details.currentClient}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Up Next Client</p>
                    <p className="dash-detail-value">{s.details.upNextClient}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Total Clients Today</p>
                    <p className="dash-detail-value">{s.details.totalClients}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Done Clients Today</p>
                    <p className="dash-detail-value">{s.details.doneClients}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Total Walk-Ins Today</p>
                    <p className="dash-detail-value">{s.details.totalWalkIns}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Clock In</p>
                    <p className="dash-detail-value">{s.clock_in}</p>
                  </div>

                  <div>
                    <p className="dash-detail-label">Clock Out</p>
                    <p className="dash-detail-value">{s.clock_out}</p>
                  </div>

                  {/* Clock-In & Manage Service Buttons */}
                  <div style={{ gridColumn: "1 / -1", marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {(() => {
                      const isAbsent = s.status === "Absent";
                      const isInService = Boolean(s.isInService);

                      return (
                    <button
                      onClick={() => {
                        if (isInService) {
                          return;
                        }

                        const isClockIn = isAbsent;
                        setConfirmModal({
                          isOpen: true,
                          title: isClockIn ? "Confirm Clock In" : "Confirm Clock Out",
                          message: `Are you sure you want to ${isClockIn ? 'clock in' : 'clock out'} ${s.name}?`,
                          action: isClockIn ? "clock_in" : "clock_out",
                          staffName: s.name,
                          staffId: s.id
                        });
                      }}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: isInService ? "#9ca3af" : isAbsent ? "#22c55e" : "#ef4444",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: isInService ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        opacity: isInService ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isInService) {
                          e.target.style.backgroundColor = isAbsent ? "#16a34a" : "#dc2626";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isInService) {
                          e.target.style.backgroundColor = isAbsent ? "#22c55e" : "#ef4444";
                        }
                      }}
                      disabled={isInService}
                    >
                      {isInService ? "In Service" : isAbsent ? "Clock In" : "Clock Out"}
                    </button>
                      );
                    })()}
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
                      Manage Specialty
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
      
      {/* Confirmation Dialog - Using Customer Dashboard Style */}
      <ConfirmationDialog
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={async () => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          
          const isClockIn = confirmModal.action === "clock_in";
          const isClockOut = confirmModal.action === "clock_out";
          const isWalkInAccept = confirmModal.action === "walk_in_accept";
          const isWalkInReject = confirmModal.action === "walk_in_reject";
          
          try {
            if (isClockIn || isClockOut) {
              // Format time as HH:MM:SS in 24-hour format
              const now = new Date();
              const timeString = now.toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
              });
              
              // Update local state
              const updatedStaff = staff.map(staffMember => 
                staffMember.name === confirmModal.staffName 
                  ? { 
                      ...staffMember, 
                      status: isClockIn ? "Available" : "Absent",
                      statusClass: isClockIn ? "staff-status-green" : "staff-status-tan",
                      subStatus: isClockIn ? "Available" : "Not clocked in",
                      clock_in: isClockIn ? timeString : staffMember.clock_in,
                      clock_out: isClockOut ? timeString : staffMember.clock_out
                    }
                  : staffMember
              );
              setStaff(updatedStaff);
              
              // Update database
              const updatePayload = {
                id: confirmModal.staffId,
              };
              
              if (isClockIn) {
                updatePayload.clock_in = timeString;
              } else if (isClockOut) {
                updatePayload.clock_out = timeString;
              }
              
              await fetch('/api/staffs/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
              });
              
              onStaffStatusUpdate?.(confirmModal.staffName, isClockIn ? "Available" : "Absent");
            } else if (isWalkInAccept || isWalkInReject) {
              const currentStaff = staff.find(member => member.name === confirmModal.staffName);
              if (isWalkInAccept && currentStaff?.status !== "Available") {
                showToast({
                  message: `${confirmModal.staffName} can only accept walk-ins when available.`,
                  type: 'warning',
                  duration: 3000
                });
                return;
              }

              const updatedStaff = staff.map(member =>
                member.name === confirmModal.staffName
                  ? {
                      ...member,
                      walk_in: isWalkInAccept,
                      details: {
                        ...member.details,
                        availableForWalkIn: isWalkInAccept
                      }
                    }
                  : member
              );

              setStaff(updatedStaff);
              setWalkInStatus({ ...walkInStatus, [confirmModal.staffName]: isWalkInAccept ? "Accepting" : "Not Accepting" });
              
              await fetch('/api/staffs/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: confirmModal.staffId,
                  walk_in: isWalkInAccept ? true : false
                })
              });
            }
          } catch (error) {
            console.error('Error updating staff:', error);
          }
        }}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
};

/* ── Quick Actions panel ── */
const QuickActionsPanel = ({ onCustomerHistory }) => (
  <div className="staff-quick-panel">
    <h3 className="staff-quick-title">Quick Actions</h3>
    <button 
      className="staff-action-btn-primary"
      onClick={onCustomerHistory}
    >
      <AdminIconSlot size="action-lg">
        <AdminQuickActionHistoryIcon />
      </AdminIconSlot>
      Customer History
    </button>
  </div>
);

/* ── Analytics panel ── */
const AnalyticsPanel = () => (
  <div className="dash-sidebar-panel">
    <div className="dash-analytics-header">
      <AdminIconSlot size="analytics-lg">
        <AdminAnalyticsIcon />
      </AdminIconSlot>
      <div className="dash-analytics-text">
        <h3 className="dash-analytics-title">Analytics</h3>
        <p className="dash-analytics-sub">View Detailed Reports</p>
      </div>
    </div>
    <button className="dash-download-btn">
      Download Reports
      <AdminIconSlot size="inline">
        <AdminDownloadIcon />
      </AdminIconSlot>
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════

export const AdminDashboardStaffStatus = ({ date }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomerHistoryOpen, setIsCustomerHistoryOpen] = useState(false);
  const [statusUpdateModal, setStatusUpdateModal] = useState({ isOpen: false, staff: null });
  const [manageServiceModal, setManageServiceModal] = useState({ isOpen: false, staff: null });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeNav, setActiveNav] = useState("staff-status");
  const [mounted, setMounted] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme'));

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('adminSidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme');
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Fetch service categories from API dynamically
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        console.log('[AdminStaff] Fetching service categories from API');
        setCategoriesLoading(true);
        
        const response = await fetch('/api/services/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[AdminStaff] Service categories fetched:', data.categories);
        
        // Separate "Other" category and sort the rest
        const otherCategory = data.categories.find(cat => cat.name === 'Other');
        const otherCategories = data.categories.filter(cat => cat.name !== 'Other');
        
        // Build sorted categories with "Other" at the end
        const sortedCategories = [
          ...otherCategories,
          ...(otherCategory ? [otherCategory] : [])
        ];
        
        setServiceCategories(sortedCategories);
      } catch (err) {
        console.error('[AdminStaff] Error fetching service categories:', err);
        setServiceCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchServiceCategories();
  }, []);

  // Define fetchStaff outside useEffect so it can be called from multiple handlers
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch staff data and appointments in parallel
      const [resStaff, resCurrentAppts, resPendingAppts] = await Promise.all([
        fetch('/api/staffs'),
        fetch('/api/appointments/read/by-status?status=current'),
        fetch('/api/appointments/read/by-status?status=pending')
      ]);
      
      if (!resStaff.ok) {
        throw new Error(`Failed to fetch staff: ${resStaff.status}`);
      }
      
      const staffData = await resStaff.json();
      const currentAppts = resCurrentAppts.ok ? await resCurrentAppts.json() : { appointments: [] };
      const pendingAppts = resPendingAppts.ok ? await resPendingAppts.json() : { appointments: [] };
      
      // Create maps for quick lookup by staff name
      const currentApptMap = {};
      const pendingApptMap = {};
      
      (currentAppts.appointments || []).forEach(appt => {
        const staffName = appt.staff || '';
        if (staffName && !currentApptMap[staffName]) {
          currentApptMap[staffName] = appt;
        }
      });
      
      (pendingAppts.appointments || []).forEach(appt => {
        const staffName = appt.staff || '';
        if (staffName && !pendingApptMap[staffName]) {
          pendingApptMap[staffName] = appt;
        }
      });
      
      // Transform staff data to match the dashboard format
      const transformedStaff = staffData.map((s, index) => {
        // Determine status based on clock in/out first, then fallback to in_service
        let status = 'Absent';
        let statusClass = 'staff-status-tan';
        let subStatus = 'Not clocked in';

        // Normalize the in_service value (trim whitespace)
        const inServiceValue = (s.in_service || '').trim().toLowerCase();
        const statusValue = (s.status || '').trim().toLowerCase();
        
        // Get the name - handle both 'name' and 'names' column variants
        const staffName = s.names || s.name || 'Unknown';

        // Get clock in/out values
        const hasClockIn = s.clock_in && s.clock_in.trim() && s.clock_in !== '—';
        const hasClockOut = s.clock_out && s.clock_out.trim() && s.clock_out !== '—';
        const isInService = inServiceValue === 'in-service';

        console.log(`Processing staff: ${staffName} | clock_in: ${s.clock_in} | clock_out: ${s.clock_out} | in_service: ${inServiceValue}`);

        // Priority 1: Check in_service column for specific statuses
        if (isInService) {
          status = 'In Service';
          statusClass = 'staff-status-blue';
          subStatus = 'Serving: ' + (s.current_client || 'Client');
        }
        // Priority 2: Check clock in/out status
        else if (hasClockIn && !hasClockOut) {
          // Clocked in and not clocked out → Available
          status = 'Available';
          statusClass = 'staff-status-green';
          subStatus = 'Available';
        } else if (hasClockOut) {
          // Clocked out → Not available
          status = 'Clocked out';
          statusClass = 'staff-status-tan';
          subStatus = 'Clocked out';
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

        // Get current and next client from appointment data
        const currentAppt = currentApptMap[staffName];
        const pendingAppt = pendingApptMap[staffName];
        
        const currentClient = currentAppt ? currentAppt.name : 'None';
        const upNextClient = pendingAppt ? pendingAppt.name : 'None';

        return {
          id: s.id,
          initial: staffName ? staffName.charAt(0).toUpperCase() : '?',
          name: staffName,
          isInService,
          walk_in: isInService ? false : Boolean(s.walk_in),
          status: status,
          statusClass: statusClass,
          subStatus: subStatus,
          clock_in: s.clock_in || '—',
          clock_out: s.clock_out || '—',
          details: {
            currentClient: currentClient,
            startOfService: s.start_time || '—',
            serviceDone: s.current_service || '—',
            timeOfBreak: s.break_time || '—',
            timeOfClockIn: s.clock_in_time || '—',
            upNextClient: upNextClient,
            noOfClientToday: s.clients_today || 0,
            totalClients: s.total_clients || 0,
            doneClients: s.done_clients || 0,
            totalWalkIns: s.total_walk_in || 0,
            availableForWalkIn: inServiceValue === 'in-service' ? false : Boolean(s.walk_in)
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

  // Fetch staff data on component mount
  useEffect(() => {
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
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logoutOperator();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleStaffStatusUpdate = async (staffName, newStatus, attendanceData) => {
    console.log(`Updated ${staffName} status to ${newStatus}`, attendanceData);
    
    try {
      // Find staff member from the fetched staff data
      const staffMember = staff.find(s => s.name === staffName);
      if (!staffMember || !staffMember.id) {
        console.error(`Staff member ${staffName} not found or has no id`);
        return;
      }

      // When clocking in or setting available status
      // Set both status and in_service to "avail"
      const updateData = {
        id: staffMember.id,
        status: newStatus === "Available" || newStatus === "Open Slots" ? "avail" : newStatus,
        in_service: newStatus === "Available" || newStatus === "Open Slots" ? "avail" : newStatus.toLowerCase().replace(/\s+/g, '-'),
      };

      if (updateData.in_service === 'in-service') {
        updateData.walk_in = false;
      }

      // Add clock_in if provided (means staff is clocking in)
      if (attendanceData?.clockIn) {
        updateData.clock_in = attendanceData.clockIn;
      }

      // Add clock_out if provided
      if (attendanceData?.clockOut) {
        updateData.clock_out = attendanceData.clockOut;
      }

      console.log('[Admin:StaffStatus] Sending update to API:', updateData);

      // Make API call to update staff in database
      const response = await fetch('/api/staffs/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`[Admin:StaffStatus] Failed to update staff: ${error.error}`, error.details);
        return;
      }

      const result = await response.json();
      console.log(`[Admin:StaffStatus] Successfully updated staff ${staffName}:`, result.staff);
      
      // Optionally refresh staff data to reflect changes
      // fetchStaff();
    } catch (error) {
      console.error(`[Admin:StaffStatus] Error updating staff status:`, error);
    }
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

  const handleManageServiceSave = async (staffName, selectedCategories) => {
    console.log(`Saving specialties for ${staffName}:`, selectedCategories);
    
    try {
      // Find staff member from the fetched staff data
      const staffMember = staff.find(s => s.name === staffName);
      if (!staffMember || !staffMember.id) {
        console.error(`Staff member ${staffName} not found or has no id`);
        showToast({
          message: `Error: Staff member ${staffName} not found`,
          type: 'error',
          duration: 3000
        });
        return;
      }

      // Validate at least one category is selected
      if (!selectedCategories || selectedCategories.length === 0) {
        console.warn('[Admin:ManageService] No categories selected');
        showToast({
          message: 'Please select at least one specialty',
          type: 'warning',
          duration: 3000
        });
        return;
      }

      // Get category names from IDs
      const selectedCategoryNames = serviceCategories
        .filter(cat => selectedCategories.includes(cat.id))
        .map(cat => cat.name);

      console.log('[Admin:ManageService] Sending update to API:', {
        id: staffMember.id,
        category_specialty: selectedCategoryNames
      });

      // Make API call to update staff specialties in database
      const response = await fetch('/api/staffs/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: staffMember.id,
          category_specialty: selectedCategoryNames,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`[Admin:ManageService] Failed to update specialties: ${error.error}`, error.details);
        showToast({
          message: `Failed to update specialties: ${error.error}`,
          type: 'error',
          duration: 3000
        });
        return;
      }

      const result = await response.json();
      console.log(`[Admin:ManageService] Successfully updated ${staffName} specialties:`, result.staff);
      
      // Close the modal
      closeManageServiceModal();
      
      // Refresh staff data to reflect changes
      fetchStaff();
      
      // Show success message
      showToast({
        message: `Successfully updated ${staffName}'s specialties to: ${selectedCategoryNames.join(', ')}`,
        type: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error(`[Admin:ManageService] Error updating specialties:`, error);
      showToast({
        message: `Error updating specialties: ${error.message}`,
        type: 'error',
        duration: 3000
      });
    }
  };

  const headerNotifications = useMemo(() => {
    const statusFeed = staff.slice(0, 3).map((member, index) => ({
      id: `staff-${member.name || index}`,
      tone: member.statusClass === "staff-status-green" ? "green" : member.statusClass === "staff-status-blue" ? "blue" : member.statusClass === "staff-status-amber" ? "amber" : "tan",
      category: "Staff status",
      title: `${member.name || "Staff member"} is ${member.status || "Available"}`,
      description: member.subStatus || "Status updated.",
      time: member.details?.timeOfClockIn || "Today",
      unread: index === 0,
    }));

    const serviceFeed = staff
      .filter((member) => member.details?.availableForWalkIn)
      .slice(0, 1)
      .map((member, index) => ({
        id: `staff-walkin-${member.name || index}`,
        tone: "amber",
        category: "Walk-in ready",
        title: `${member.name || "Staff member"} can accept walk-ins`,
        description: "This stylist is currently available for a walk-in customer.",
        time: "Now",
        unread: true,
      }));

    return [...statusFeed, ...serviceFeed].slice(0, 5);
  }, [staff]);

  return (
    <div
      className="super-admin-container admin-dashboard-page"
      style={{ "--sidebar-width": sidebarExpanded ? "340px" : "80px" }}
    >
      {/* Sidebar */}
      <AdminSidebar 
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarExpanded={sidebarExpanded}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="super-admin-main">
        {/* Dashboard Header - Fixed Title and Actions */}
        <header className={`dashboard-header ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          <div className="dashboard-header-main">
            <button
              onClick={() => setSidebarExpanded((prev) => !prev)}
              className="logo-toggle-btn dashboard-header-logo-btn"
              title="Toggle sidebar"
            >
              <div className="logo-badge public-icon-slot public-icon-slot--logo">
                <LogoMark />
              </div>
            </button>
            <span className="dashboard-system-title">BeautyBook Pro</span>
            <div className="dashboard-page-title-wrap">
              <h1 className="dash-page-title">Staff Status</h1>
              <p className="dash-page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          <AdminHeaderActions notifications={headerNotifications} />
        </header>

        <main className="dashboard-main">
          {/* Metrics Cards - Hero Section */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <PageMetrics stats={stats} loading={loading} error={error} />
          </div>
          <div className="staff-page-grid">
            <div className="staff-page-main-column">
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

              {/* Staff Feedback Container */}
              <StaffFeedbackPanel staff={staff} loading={loading} />
            </div>

            {/* Right — Quick Actions + Analytics */}
            <div className="staff-sidebar">
            <QuickActionsPanel 
              onCustomerHistory={() => setIsCustomerHistoryOpen(true)}
            />
            <AnalyticsPanel />
          </div>
        </div>
        </main>
      </div>

      {/* Customer History Modal */}
      <CustomerHistoryModal 
        isOpen={isCustomerHistoryOpen} 
        onClose={() => setIsCustomerHistoryOpen(false)} 
      />


      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={statusUpdateModal.isOpen}
        staff={statusUpdateModal.staff}
        onClose={closeStatusModal}
        onSave={(staffName, newStatus, attendanceData) => {
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
          handleStaffStatusUpdate(staffName, newStatus, attendanceData);
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

      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title="Log Out?"
        message="Are you sure you want to log out of the admin dashboard?"
        confirmText="Yes, Log Out"
        cancelText="Stay Logged In"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
};

export default AdminDashboardStaffStatus;

