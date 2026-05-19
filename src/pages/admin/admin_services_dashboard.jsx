import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { couponService } from "../../services/couponService";
import { EditServiceModal } from "../../components/modal/admin/edit_service";
import CouponModal from "../../components/modal/admin/coupon_modal";
import { AdminHeaderActions } from "../../components/admin/AdminHeaderActions";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";

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

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════

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

const RevenueIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GiftIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M10 1v7M10 1H6a1 1 0 0 0-1 1v4h10V2a1 1 0 0 0-1-1h-4z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 1h4a1 1 0 0 1 1 1v4H6V2a1 1 0 0 1 1-1h3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6h16v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 8v9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PromoIcon = ({ size = 20, color = "#dd901d" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="7" r="1.5" fill={color} />
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
// ICON COMPONENTS FOR SIDEBAR
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

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: DashboardIcon },
  { id: "services", label: "Services", icon: GridIcon },
  { id: "live-status", label: "Live Status", icon: ActivityIcon },
  { id: "staff-status", label: "Staff Status", icon: UserGroupIcon },
];

const SERVICE_GROUPS = [
  {
    category: "Hair Services",
    items: [
      { name: "Hair cuts",          meta: "Classic Haircut with Styling",  available: true,  price: "₱00.00" },
      { name: "Hair color",         meta: "Full hair color service",       available: true,  price: "₱00.00" },
      { name: "Hair treatment",     meta: "Full hair color service",       available: true,  price: "₱00.00" },
      { name: "Beard trimming",     meta: "Trim and beard shaping",        available: true,  price: "₱00.00" },
    ],
  },
  {
    category: "Massage Services",
    items: [
      { name: "Swedish massage",     meta: "Gently stroke for relaxation",        available: true,  price: "₱00.00" },
      { name: "Deep tissue massage", meta: "Intense pressure for muscle knots",   available: true,  price: "₱00.00" },
      { name: "Hot stone massage",   meta: "Heated stones to melt tension",       available: false, price: "₱00.00" },
      { name: "Foot reflexology",    meta: "Pressure points for overall wellness", available: true,  price: "₱00.00" },
    ],
  },
  {
    category: "Nail Services",
    items: [
      { name: "Manicure",           meta: "Care & beautification for fingernails", available: true,  price: "₱00.00" },
      { name: "Pedicure",           meta: "Care & beautification for toenails",    available: true,  price: "₱00.00" },
      { name: "Nail enhancement",   meta: "Artificial nail application",           available: true,  price: "₱00.00" },
      { name: "Nail art & design",  meta: "Arts & Design for nails",               available: false, price: "₱00.00" },
    ],
  },
  {
    category: "Skincare Services",
    items: [
      { name: "Facial treatment",    meta: "Care & beautification for face & skin", available: true,  price: "₱00.00" },
      { name: "Advance treatment",   meta: "High-tech solutions for skin concerns",  available: true,  price: "₱00.00" },
      { name: "Specialized facials", meta: "Targeted care for specific skin needs",  available: true,  price: "₱00.00" },
      { name: "Body treatment",      meta: "Full-body skincare services",           available: false, price: "₱00.00" },
    ],
  },
  {
    category: "Premium Services",
    items: [
      { name: "Bridal package",    meta: "Full wedding day beauty",    available: true,  price: "₱00.00" },
      { name: "Couple's Massage",  meta: "Relaxation for 2",           available: true,  price: "₱00.00" },
      { name: "Hair & glow combo", meta: "Scalp treatment + facial",   available: true,  price: "₱00.00" },
      { name: "VIP experience",    meta: "Private room + drinks",      available: true,  price: "₱00.00" },
    ],
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
          <LogOutIcon />
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
          <ScissorsIcon size={20} color="#000" />
        </div>
        <span className="admin-nav-brand">BeautyBook Pro</span>
      </div>

      <nav className="admin-nav-links">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.label)}
            className={`admin-nav-link ${item.id === "services" ? "active" : ""}`}
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
        <h1 className="dash-page-title">Services Management</h1>
        <p className="dash-page-subtitle">BeautyBook Pro · {todayDate}</p>
      </div>
      <AdminHeaderActions />
    </div>
  );
};

/* ── Metric cards for hero section ── */
const PageMetrics = ({ stats }) => (
  <div className="svc-stats-row">
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

/* ── Single service item row ── */
const ServiceItem = ({ id, name, category, meta, available, price, onEdit }) => {
  const rowStyles = getThemeStyles(
    {
      backgroundColor: 'rgba(20, 17, 15, 0.35)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px'
    },
    {
      backgroundColor: '#ffffff',
      border: '1px solid rgba(213, 210, 211, 0.35)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px'
    }
  );

  const titleColor = isDarkMode() ? '#f5f1eb' : '#0c0a09';
  const metaColor = isDarkMode() ? '#988f81' : '#666';
  const priceColor = isDarkMode() ? '#f5f1eb' : '#0c0a09';

  return (
    <div className="svc-item-row" style={rowStyles}>
      <div className="svc-item-left">
        <div className="svc-item-icon-box">
          <ScissorsIcon size={18} color={titleColor} />
        </div>
        <div className="svc-item-info">
          <span className="svc-item-name" style={{ color: titleColor }}>{name}</span>
          <span className="svc-item-meta" style={{ color: metaColor }}>{meta}</span>
        </div>
      </div>
      <div className="svc-item-right">
        <div className="svc-item-status-col">
          <span className={available ? "svc-item-status-available" : "svc-item-status-unavailable"}>
            {available ? "Available" : "Not Available"}
          </span>
          <span className="svc-item-price" style={{ color: priceColor }}>{price}</span>
        </div>
        <button 
          className="svc-item-edit-btn" 
          aria-label="Edit service"
          onClick={() => onEdit({ id, name, category, meta, available, price })}
        >
          <EditIcon size={14} color="currentColor" />
        </button>
      </div>
    </div>
  );
};

/* ── Services list panel ── */
const ServicesPanel = ({ serviceGroups, loading, error, onEditService }) => {
  return (
    <div className="svc-group-panel">
      <div className="svc-group-header">
        <h2 className="svc-group-title">All Services</h2>
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
          Loading services...
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
          Error loading services: {error}
        </div>
      )}

      {/* Services List */}
      {!loading && !error && (
        <div className="svc-services-scroll-limited">
          {serviceGroups.length === 0 ? (
            <div className="container-empty-state">
              No services found
            </div>
          ) : (
            <>
              {/* Show all services grouped by category (both expanded and collapsed) */}
              {serviceGroups.map((group, gi) => (
                <div key={gi}>
                  <p className="svc-category-label">{group.category}</p>
                  <div className="svc-item-list">
                    {group.items.map((svc, i) => (
                      <ServiceItem 
                        key={i} 
                        {...svc} 
                        onEdit={onEditService}
                      />
                    ))}
                  </div>
                  {gi < serviceGroups.length - 1 && (
                    <div className="svc-category-divider" />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Quick Actions sidebar ── */
const QuickActionsPanel = ({ onNewService, onManageCoupons }) => (
  <div className="svc-quick-actions-panel">
    <h3 className="svc-quick-title">Quick Actions</h3>

    <button 
      className="svc-action-btn-primary"
      onClick={onNewService}
    >
      <ScissorsIcon size={16} color="#000" />
      New Service
    </button>

    <button 
      className="svc-action-btn-secondary"
      onClick={onManageCoupons}
    >
      <PromoIcon size={16} color="currentColor" />
      Manage Coupons
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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isManagingCoupons, setIsManagingCoupons] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stats, setStats] = useState([
    { Icon: RevenueIcon,  badge: "+15%",  badgeType: "green", value: "₱0.00", label: "Revenue Today" },
    { Icon: GiftIcon,     badge: "+8%",   badgeType: "green", value: "0",       label: "Coupons Used"   },
  ]);
  const [appointmentData, setAppointmentData] = useState({
    current: [],
    pending: [],
    done: []
  });
  const [activeNav, setActiveNav] = useState("services");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('adminSidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const [currentRes, pendingRes, doneRes] = await Promise.all([
          fetch('/api/appointments/read/by-status?status=current'),
          fetch('/api/appointments/read/by-status?status=pending'),
          fetch('/api/appointments/read/by-status?status=done')
        ]);

        const [currentData, pendingData, doneData] = await Promise.all([
          currentRes.json(),
          pendingRes.json(),
          doneRes.json()
        ]);

        setAppointmentData({
          current: currentData.appointments || [],
          pending: pendingData.appointments || [],
          done: doneData.appointments || []
        });
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch coupon metrics for the admin services dashboard
  useEffect(() => {
    const fetchCouponMetrics = async () => {
      try {
        const coupons = await couponService.getCoupons();
        const usedCoupons = coupons.reduce((sum, coupon) => sum + (Number(coupon.number_of_uses) || 0), 0);

        setStats([
          { Icon: RevenueIcon, badge: "+15%", badgeType: "green", value: "₱12,450", label: "Revenue Today" },
          { Icon: GiftIcon,    badge: "+8%",  badgeType: "green", value: usedCoupons.toString(), label: "Coupons Used"   },
        ]);
      } catch (err) {
        console.error('Error loading coupon metrics:', err);
      }
    };

    fetchCouponMetrics();
  }, []);

  // Fetch services from API on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/services');
        if (!res.ok) {
          throw new Error(`Failed to fetch services: ${res.status}`);
        }

        const servicesData = await res.json();
        
        // Transform services data to include formatted price and availability
        const transformedServices = servicesData.map(s => {
          // Try both 'name' and 'service_name' columns (handle both DB schemas)
          const serviceName = s.name || s.service_name || 'Unknown';
          
          console.log('Service data:', { id: s.id, name: s.name, service_name: s.service_name, serviceName });
          
          return {
            id: s.id,
            name: serviceName,
            category: s.category || 'Other',
            description: s.description || s.meta || '',
            price: s.price ? `₱${parseFloat(s.price).toFixed(2)}` : '₱0.00',
            estimatedTime: s.estimated_time || s.est_time || '30 mins',
            available: s.availability !== false,
            meta: s.description || s.meta || ''
          };
        });

        setServices(transformedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    
    return () => {};
  }, []);

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const existing = acc.find(group => group.category === service.category);
    if (existing) {
      existing.items.push(service);
    } else {
      acc.push({
        category: service.category,
        items: [service]
      });
    }
    return acc;
  }, []);

  // Use grouped services if available, otherwise use SERVICE_GROUPS as fallback
  const serviceGroups = services.length > 0 ? groupedServices : SERVICE_GROUPS;
  
  // Extract category names
  const categories = serviceGroups.map(group => group.category);

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

  const handleEditService = (service) => {
    setEditingService({ ...service, _isNew: false });
  };

  const handleNewService = () => {
    setEditingService({ 
      name: "", 
      meta: "", 
      available: true, 
      price: "",
      category: "",
      _isNew: true 
    });
  };

  const handleSaveService = async (formData) => {
    const { _isNew, ...serviceData } = formData;
    
    try {
      setError(null);

      if (_isNew) {
        // Create new service via POST to /api/services/create
        console.log("Creating new service:", serviceData);
        
        // Strip currency symbol from price (e.g., "₱6767.67" -> 6767.67)
        const priceValue = typeof serviceData.price === 'string'
          ? parseFloat(serviceData.price.replace(/[₱\s]/g, ''))
          : parseFloat(serviceData.price);

        const requestBody = {
          name: serviceData.name,
          service_name: serviceData.name,
          category: serviceData.category,
          description: serviceData.meta,
          price: isNaN(priceValue) ? 0 : priceValue,
          availability: serviceData.available,
          estimated_time: serviceData.estimated_time ? parseInt(serviceData.estimated_time, 10) : 0
        };
        
        console.log("Request body being sent:", requestBody);

        const res = await fetch('/api/services/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        console.log("Response status:", res.status);
        console.log("Response headers:", Object.fromEntries(res.headers));
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error response body:", errorData);
          const errorMsg = errorData.error || 'Unknown error';
          const details = errorData.details || '';
          const insertData = errorData.insertData ? JSON.stringify(errorData.insertData) : '';
          throw new Error(`Failed to create service: ${errorMsg}. Details: ${details}. Data sent: ${insertData}`);
        }

        const newService = await res.json();
        console.log("Service created successfully:", newService);
        
        // Add new service to list
        setServices(prev => [...prev, {
          id: newService.id,
          name: newService.name,
          category: newService.category,
          description: newService.description,
          price: `₱${parseFloat(newService.price).toFixed(2)}`,
          available: newService.availability !== false,
          meta: newService.description
        }]);

      } else {
        // Update existing service via PUT to /api/services/update
        console.log("Updating service:", serviceData);
        
        if (!serviceData.id) {
          throw new Error("Service ID is required for update");
        }

        // Strip currency symbol from price (e.g., "₱6767.67" -> 6767.67)
        const priceValue = typeof serviceData.price === 'string' 
          ? parseFloat(serviceData.price.replace(/[₱\s]/g, '')) 
          : parseFloat(serviceData.price);

        const res = await fetch(`/api/services/update?id=${serviceData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: serviceData.name,
            category: serviceData.category,
            description: serviceData.meta,
            price: isNaN(priceValue) ? 0 : priceValue,
            available: serviceData.available,
            estimated_time: serviceData.estimated_time ? parseInt(serviceData.estimated_time, 10) : 0
          })
        });

        if (!res.ok) {
          const errorData = await res.json();
          const errorMsg = errorData.error || 'Unknown error';
          const details = errorData.details || errorData.received || '';
          const insertData = errorData.insertData ? JSON.stringify(errorData.insertData) : '';
          throw new Error(`Failed to update service: ${errorMsg}. Details: ${details}. Data sent: ${insertData}`);
        }

        const updatedService = await res.json();
        console.log("Service updated successfully:", updatedService);
        
        // Update service in list
        setServices(prev => prev.map(svc => 
          svc.id === serviceData.id 
            ? {
                ...svc,
                name: serviceData.name,
                category: serviceData.category,
                description: serviceData.meta,
                price: `₱${parseFloat(serviceData.price).toFixed(2)}`,
                available: serviceData.available,
                meta: serviceData.meta
              }
            : svc
        ));
      }

      setEditingService(null);
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.message);
    }
  };

  const handleRemoveService = async (service) => {
    if (!service.id) {
      console.error("Cannot delete service: no ID");
      setError("Service ID is required for deletion");
      return;
    }

    try {
      setError(null);
      console.log("Deleting service:", service.id);

      const res = await fetch(`/api/services/delete?id=${service.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`Failed to delete service: ${res.status}`);
      }

      console.log("Service deleted successfully");
      
      // Remove service from list
      setServices(prev => prev.filter(svc => svc.id !== service.id));
      setEditingService(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setEditingService(null);
  };

  const handleOpenCoupons = () => setIsManagingCoupons(true);
  const handleCloseCoupons = () => setIsManagingCoupons(false);

  // Generate header notifications from appointment and service data
  const headerNotifications = useMemo(() => {
    const pendingFeed = appointmentData.pending.slice(0, 2).map((appointment, index) => ({
      id: `services-pending-${appointment.id || index}`,
      tone: "amber",
      category: "New booking",
      title: `${appointment.name || "Customer"} booked ${appointment.service || "a service"}`,
      description: `${appointment.time || "TBA"} • ${appointment.staff || "Any available stylist"}`,
      time: "Today",
      unread: index === 0,
    }));

    const completedFeed = appointmentData.done.slice(0, 1).map((appointment, index) => ({
      id: `services-done-${appointment.id || index}`,
      tone: "green",
      category: "Completed",
      title: `${appointment.name || "Customer"} appointment finished`,
      description: `${appointment.service || "Service"} marked done successfully.`,
      time: "Today",
      unread: false,
    }));

    const serviceFeed = services.slice(0, 1).map((service, index) => ({
      id: `services-item-${service.id || index}`,
      tone: service.available ? "green" : "red",
      category: "Service catalog",
      title: `${service.name || "Service"} is ${service.available ? "available" : "hidden"}`,
      description: service.meta || service.description || "Service record updated.",
      time: "Now",
      unread: false,
    }));

    return [...pendingFeed, ...completedFeed, ...serviceFeed].slice(0, 5);
  }, [appointmentData, services]);

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
              <div className="logo-badge">
                <LogoIcon />
              </div>
            </button>
            <span className="dashboard-system-title">BeautyBook Pro</span>
            <div className="dashboard-page-title-wrap">
              <h1 className="dash-page-title">Services Management</h1>
              <p className="dash-page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          <AdminHeaderActions notifications={headerNotifications} />
        </header>

        <main className="dashboard-main">
          {/* Metrics Cards - Hero Section */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <PageMetrics stats={stats} />
          </div>

          <div className="svc-page-grid">
          {/* Left — Services list */}
          <ServicesPanel 
            serviceGroups={serviceGroups}
            loading={loading}
            error={error}
            onEditService={handleEditService} 
          />

          {/* Right — Quick actions + Analytics */}
          <div>
                    <QuickActionsPanel 
                      onNewService={handleNewService} 
                      onManageCoupons={handleOpenCoupons}
                    />
            <AnalyticsPanel />
          </div>
        </div>
      </main>
        </div>

      {/* Edit Service Modal - Rendered at page level */}
      <EditServiceModal 
        isOpen={editingService !== null}
        service={editingService}
        categories={categories}
        onClose={handleCloseModal}
        onSave={handleSaveService}
        onRemove={handleRemoveService}
      />

      {/* Create Promo Modal - Rendered at page level */}
      <CouponModal
        isOpen={isManagingCoupons}
        onClose={handleCloseCoupons}
        services={services}
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

export default AdminDashboardServices;