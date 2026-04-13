import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import CustomerHistoryModal from "../../components/modal/admin/customer_history";
import CalendarAppointmentsModal from "../../components/modal/admin/calendar_appointments";

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
const PageHeader = ({ date = "Saturday, Dec 7, 2024", stats = { available: 0, inService: 0, onBreak: 0, offToday: 0 }, loading = false, error = null }) => {
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

/* ── Status Update Modal ── */
const StatusUpdateModal = ({ isOpen, staff, onClose, onSave }) => {
  const [selectedStatus, setSelectedStatus] = useState(staff?.status || "Available");
  
  if (!isOpen || !staff) return null;

  const statusOptions = [
    { label: "Available", color: "#22c55e", class: "staff-status-green" },
    { label: "In Service", color: "#4387ef", class: "staff-status-blue" },
    { label: "On Break", color: "#dd901d", class: "staff-status-amber" },
  ];

  const handleSave = () => {
    onSave(staff.name, selectedStatus);
    setSelectedStatus("Available");
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "Inter, sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "450px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f5f5f5", margin: 0 }}>
            Update Status
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#988f81",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#dd901d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#988f81"; }}
          >
            <CloseIcon size={20} color="currentColor" />
          </button>
        </div>

        {/* Staff Name Display */}
        <div style={{
          backgroundColor: "rgba(26, 15, 0, 0.5)",
          borderLeft: "3px solid #dd901d",
          padding: "12px 14px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <p style={{ fontSize: "12px", color: "#988f81", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Staff Member
          </p>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#f5f5f5", margin: 0 }}>
            {staff.name}
          </p>
        </div>

        {/* Current Status Display */}
        <p style={{ fontSize: "12px", color: "#988f81", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Current Status
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
          padding: "10px 14px",
          backgroundColor: "rgba(26, 15, 0, 0.5)",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          borderRadius: "8px",
        }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: staff.status === "Available" ? "#22c55e" : staff.status === "In Service" ? "#4387ef" : "#dd901d",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#f5f5f5" }}>
            {staff.status}
          </span>
        </div>

        {/* Status Options */}
        <p style={{ fontSize: "12px", color: "#988f81", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Select New Status
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
          {statusOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => setSelectedStatus(option.label)}
              style={{
                padding: "12px 16px",
                border: selectedStatus === option.label ? "2px solid #dd901d" : "1px solid rgba(221, 144, 29, 0.2)",
                backgroundColor: selectedStatus === option.label ? "rgba(221, 144, 29, 0.15)" : "rgba(26, 15, 0, 0.5)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#f5f5f5",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                if (selectedStatus !== option.label) {
                  e.currentTarget.style.backgroundColor = "rgba(26, 15, 0, 0.7)";
                  e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStatus !== option.label) {
                  e.currentTarget.style.backgroundColor = "rgba(26, 15, 0, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.2)";
                }
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: option.color,
                  flexShrink: 0,
                }}
              />
              {option.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "1px solid rgba(221, 144, 29, 0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              color: "#988f81",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.6)";
              e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.3)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: "#dd901d",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              color: "#fff",
              transition: "all 0.2s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e89f2d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#dd901d";
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Staff List panel ── */
const StaffListPanel = ({ staff: staffList, loading, error, onStaffStatusUpdate, statusUpdateModal, onOpenStatusModal, onCloseStatusModal }) => {
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

                  {/* Update Status Button */}
                  <button
                    onClick={() => onOpenStatusModal(s)}
                    style={{
                      gridColumn: "1 / -1",
                      marginTop: "12px",
                      padding: "10px 16px",
                      backgroundColor: "#dd901d",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
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
    </div>
  );
};

export default AdminDashboardStaffStatus;