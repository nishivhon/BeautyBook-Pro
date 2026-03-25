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

const CalendarIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="15" r="1" fill={color} />
    <circle cx="12" cy="15" r="1" fill={color} />
    <circle cx="16" cy="15" r="1" fill={color} />
  </svg>
);

const RevenueIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PromoIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="7" r="1.5" fill={color} />
  </svg>
);

const LoyaltyIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M2 10h20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="7" cy="15" r="1" fill={color} />
    <path d="M11 15h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const EditIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DiscountIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="9" r="2" stroke={color} strokeWidth="1.8" />
    <circle cx="15" cy="15" r="2" stroke={color} strokeWidth="1.8" />
    <path d="M5 19L19 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
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
  { label: "Home",              active: false },
  { label: "Services",          active: true  },
  { label: "Queue Live Status", active: false },
  { label: "Staff Status",      active: false },
];

const STATS = [
  { Icon: CalendarIcon, badge: "+3",    badgeType: "green", value: "24",       label: "Today's Appointments" },
  { Icon: RevenueIcon,  badge: "+15%",  badgeType: "green", value: "₱12,450",  label: "Revenue Today"        },
  { Icon: ScissorsIcon, badge: null,    badgeType: null,    value: "14",        label: "Promo Bookings Today" },
  { Icon: LoyaltyIcon,  badge: "+5",    badgeType: "green", value: "12",        label: "Loyalty Cards Activated" },
];

const SERVICE_GROUPS = [
  {
    category: "Haircut Services",
    items: [
      { name: "Classic Haircut",        meta: "30 mins • Standard cut & style",    available: true,  price: "₱150" },
      { name: "Premium Haircut & Beard", meta: "60 mins • Cut, beard trim, & hot towel", available: true, price: "₱250" },
      { name: "Clipper Fade",           meta: "50 mins • Precision fade & styling", available: false, price: "₱180" },
    ],
  },
  {
    category: "Styling & Color",
    items: [
      { name: "Hair Color & Style",     meta: "90 mins • Full color service",      available: true,  price: "₱500" },
      { name: "Beard Grooming",         meta: "30 mins • Trim, shape, & oil",      available: true,  price: "₱80"  },
      { name: "Full Service Package",   meta: "120 mins • Hair, beard, & facial",  available: true,  price: "₱350" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

/* ── Navbar ── */
const AdminNavbar = ({ onLogout, onNavHome }) => (
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
          onClick={item.label === "Home" ? onNavHome : undefined}
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

/* ── Page header + stat cards ── */
const PageHeader = ({ date = "Saturday, Dec 7, 2024" }) => (
  <>
    <div className="dash-page-header">
      <div className="dash-page-title-block">
        <h1 className="dash-page-title">Services Management</h1>
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

    <div className="svc-stats-row">
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

/* ── Single service item row ── */
const ServiceItem = ({ name, meta, available, price }) => (
  <div className="svc-item-row">
    <div className="svc-item-left">
      <div className="svc-item-icon-box">
        <ScissorsIcon size={18} color="#000" />
      </div>
      <div className="svc-item-info">
        <span className="svc-item-name">{name}</span>
        <span className="svc-item-meta">{meta}</span>
      </div>
    </div>
    <div className="svc-item-right">
      <div className="svc-item-status-col">
        <span className={available ? "svc-item-status-available" : "svc-item-status-unavailable"}>
          {available ? "Available" : "Not Available"}
        </span>
        <span className="svc-item-price">{price}</span>
      </div>
      <button className="svc-item-edit-btn" aria-label="Edit service">
        <EditIcon size={14} color="currentColor" />
      </button>
    </div>
  </div>
);

/* ── Services list panel ── */
const ServicesPanel = () => (
  <div className="svc-group-panel">
    <div className="svc-group-header">
      <h2 className="svc-group-title">{SERVICE_GROUPS[0].category}</h2>
      <button className="svc-see-less-btn">See less</button>
    </div>

    <div className="svc-item-list">
      {SERVICE_GROUPS[0].items.map((svc, i) => (
        <ServiceItem key={i} {...svc} />
      ))}
    </div>

    {SERVICE_GROUPS.slice(1).map((group, gi) => (
      <div key={gi}>
        <div className="svc-category-divider" />
        <p className="svc-category-label">{group.category}</p>
        <div className="svc-item-list">
          {group.items.map((svc, i) => (
            <ServiceItem key={i} {...svc} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ── Quick Actions sidebar ── */
const QuickActionsPanel = () => (
  <div className="svc-quick-actions-panel">
    <h3 className="svc-quick-title">Quick Actions</h3>

    <button className="svc-action-btn-primary">
      <ScissorsIcon size={16} color="#000" />
      New Service
    </button>

    <button className="svc-action-btn-secondary">
      <PromoIcon size={16} color="currentColor" />
      Create Promo
    </button>

    <button className="svc-action-btn-secondary">
      <DiscountIcon size={16} color="currentColor" />
      Create Discount
    </button>
  </div>
);

/* ── Analytics sidebar panel ── */
const AnalyticsPanel = () => (
  <div className="dash-sidebar-panel svc-analytics-wrap">
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

export const AdminDashboardServices = ({ date }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  const handleNavHome = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="dash-root">
      <AdminNavbar onLogout={handleLogout} onNavHome={handleNavHome} />

      <main className="dash-main">
        <PageHeader date={date} />

        <div className="svc-page-grid">
          {/* Left — Services list */}
          <ServicesPanel />

          {/* Right — Quick actions + Analytics */}
          <div>
            <QuickActionsPanel />
            <AnalyticsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardServices;