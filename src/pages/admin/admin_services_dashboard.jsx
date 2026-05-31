import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { couponService } from "../../services/couponService";
import { EditServiceModal } from "../../components/modal/admin/edit_service";
import CouponModal from "../../components/modal/admin/coupon_modal";
import { AdminHeaderActions } from "../../components/admin/AdminHeaderActions";
import {
  AdminDashboardNavIcon,
  AdminServicesNavIcon,
  AdminLiveStatusNavIcon,
  AdminStaffStatusNavIcon,
  AdminLogOutIcon,
  AdminIconSlot,
  AdminMetricMoneyIcon,
  AdminMetricPromoIcon,
  AdminServiceRowIcon,
  AdminEditIcon,
  AdminAnalyticsIcon,
  AdminDownloadIcon,
  AdminQuickActionServiceIcon,
  AdminQuickActionPromoIcon,
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

const getManilaDateString = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

const getWalkInRevenue = (walkIn) => {
  const directTotal = Number(walkIn?.total_price || 0);
  if (Number.isFinite(directTotal) && directTotal > 0) return directTotal;

  let services = walkIn?.services;
  if (typeof services === 'string') {
    try {
      services = JSON.parse(services);
    } catch (_) {
      services = [];
    }
  }

  if (Array.isArray(services)) {
    return services.reduce((sum, service) => sum + (Number(service?.price || 0) || 0), 0);
  }

  if (services && typeof services === 'object') {
    return Number(services?.price || 0) || 0;
  }

  return 0;
};

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: AdminDashboardNavIcon },
  { id: "services", label: "Services", icon: AdminServicesNavIcon },
  { id: "live-status", label: "Live Status", icon: AdminLiveStatusNavIcon },
  { id: "staff-status", label: "Staff Status", icon: AdminStaffStatusNavIcon },
];

const sortBookingNotifications = (items) => {
  return [...items].sort((a, b) => {
    const aTime = new Date(a?.activityAt || a?.updatedAt || a?.createdAt || 0).getTime();
    const bTime = new Date(b?.activityAt || b?.updatedAt || b?.createdAt || 0).getTime();

    if (aTime !== bTime) return bTime - aTime;

    return String(b?.id || '').localeCompare(String(a?.id || ''));
  });
};

const mergeBookingNotifications = (currentItems, incomingItems) => {
  const notificationMap = new Map();

  [...currentItems, ...incomingItems].forEach((item) => {
    if (!item?.id) return;
    notificationMap.set(String(item.id), item);
  });

  return sortBookingNotifications(Array.from(notificationMap.values()));
};

const getOldestBookingNotificationCursor = (items) => {
  const sortedItems = sortBookingNotifications(items);
  const oldestItem = sortedItems[sortedItems.length - 1];

  if (!oldestItem?.createdAt || !oldestItem?.id) return null;

  return {
    createdAt: oldestItem.activityAt || oldestItem.updatedAt || oldestItem.createdAt,
    id: oldestItem.id,
  };
};

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
          <AdminIconSlot size="metric">
            <Icon />
          </AdminIconSlot>
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
const ServiceItem = ({ id, name, category, meta, available, price, estimatedTime, onEdit }) => {
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
        <AdminIconSlot size="svc-row">
          <AdminServiceRowIcon />
        </AdminIconSlot>
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
          className="svc-item-edit-btn admin-icon-btn-bare" 
          aria-label="Edit service"
          onClick={() => onEdit({ id, name, category, meta, available, price, estimatedTime })}
        >
          <AdminIconSlot size="edit-lg">
            <AdminEditIcon />
          </AdminIconSlot>
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
      <AdminIconSlot size="action-lg">
        <AdminQuickActionServiceIcon />
      </AdminIconSlot>
      New Service
    </button>

    <button 
      className="svc-action-btn-secondary"
      onClick={onManageCoupons}
    >
      <AdminIconSlot size="action-lg">
        <AdminQuickActionPromoIcon />
      </AdminIconSlot>
      Manage Coupons
    </button>
  </div>
);

/* ── Analytics sidebar panel ── */
const AnalyticsPanel = ({ onDownloadReports, isDownloading }) => (
  <div className="dash-sidebar-panel svc-analytics-wrap">
    <div className="dash-analytics-header">
      <AdminIconSlot size="analytics-lg">
        <AdminAnalyticsIcon />
      </AdminIconSlot>
      <div className="dash-analytics-text">
        <h3 className="dash-analytics-title">Analytics</h3>
        <p className="dash-analytics-sub">Service usage and revenue report</p>
      </div>
    </div>
    <button className="dash-download-btn" onClick={onDownloadReports} disabled={isDownloading}>
      {isDownloading ? 'Downloading...' : 'Download Reports'}
      <AdminIconSlot size="inline">
        <AdminDownloadIcon />
      </AdminIconSlot>
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════

export const AdminDashboardServices = ({ date }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isManagingCoupons, setIsManagingCoupons] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stats, setStats] = useState([
    { Icon: AdminMetricMoneyIcon, badge: "+15%", badgeType: "green", value: "₱0.00", label: "Revenue Today" },
    { Icon: AdminMetricPromoIcon, badge: "+8%",  badgeType: "green", value: "0",     label: "Coupons Used" },
  ]);
  const [appointmentData, setAppointmentData] = useState({
    current: [],
    pending: [],
    done: []
  });
  const [walkInLogs, setWalkInLogs] = useState([]);
  const [usedCouponsCount, setUsedCouponsCount] = useState(0);
  const [bookingNotifications, setBookingNotifications] = useState([]);
  const [bookingNotificationsHasMore, setBookingNotificationsHasMore] = useState(false);
  const [loadingMoreBookingNotifications, setLoadingMoreBookingNotifications] = useState(false);
  const [isDownloadingReports, setIsDownloadingReports] = useState(false);
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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchBookingNotifications = async ({ cursor = null } = {}) => {
      try {
        const searchParams = new URLSearchParams({ limit: '20' });

        if (cursor?.createdAt && cursor?.id) {
          searchParams.set('beforeCreatedAt', cursor.createdAt);
          searchParams.set('beforeId', String(cursor.id));
        }

        const response = await fetch(`/api/appointments/read/recent-bookings?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking notifications');
        }

        const result = await response.json();
        const nextNotifications = result.notifications || [];

        setBookingNotifications((prev) => mergeBookingNotifications(prev, nextNotifications));
        setBookingNotificationsHasMore(Boolean(result.hasMore));
      } catch (error) {
        console.error('[AdminServices] Error loading booking notifications:', error);
        setBookingNotificationsHasMore(false);
      }
    };

    fetchBookingNotifications();
  }, []);

  const handleLoadMoreBookingNotifications = async () => {
    if (loadingMoreBookingNotifications || !bookingNotificationsHasMore) return;

    const oldestNotification = getOldestBookingNotificationCursor(bookingNotifications);

    if (!oldestNotification?.createdAt || !oldestNotification?.id) return;

    try {
      setLoadingMoreBookingNotifications(true);

      const searchParams = new URLSearchParams({
        limit: '20',
        beforeCreatedAt: oldestNotification.createdAt,
        beforeId: String(oldestNotification.id),
      });

      const response = await fetch(`/api/appointments/read/recent-bookings?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load more booking notifications');
      }

      const result = await response.json();
      setBookingNotifications((prev) => mergeBookingNotifications(prev, result.notifications || []));
      setBookingNotificationsHasMore(Boolean(result.hasMore));
    } catch (error) {
      console.error('[AdminServices] Error loading more booking notifications:', error);
    } finally {
      setLoadingMoreBookingNotifications(false);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = getManilaDateString();
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

        const walkInRes = await fetch(`/api/appointments/walk-in-logs?date=${today}`);
        if (walkInRes.ok) {
          const walkInData = await walkInRes.json();
          setWalkInLogs(Array.isArray(walkInData) ? walkInData : []);
        } else {
          setWalkInLogs([]);
        }
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
        setUsedCouponsCount(usedCoupons);
      } catch (err) {
        console.error('Error loading coupon metrics:', err);
      }
    };

    fetchCouponMetrics();
  }, []);

  useEffect(() => {
    const today = getManilaDateString();

    const appointmentRevenue = (appointmentData.done || [])
      .filter((apt) => apt.date === today)
      .reduce((sum, apt) => sum + (Number(apt.price || apt.total_price || 0) || 0), 0);

    const walkInRevenue = (walkInLogs || [])
      .filter((walkIn) => {
        const walkInDate = walkIn.date || walkIn.created_at?.split('T')[0] || walkIn.createdAt?.split('T')[0];
        return walkInDate === today;
      })
      .reduce((sum, walkIn) => sum + getWalkInRevenue(walkIn), 0);

    const totalRevenue = appointmentRevenue + walkInRevenue;

    setStats([
      { Icon: AdminMetricMoneyIcon, badge: "+15%", badgeType: "green", value: `₱${Number(totalRevenue).toLocaleString('en-PH')}`, label: "Revenue Today" },
      { Icon: AdminMetricPromoIcon, badge: "+8%", badgeType: "green", value: usedCouponsCount.toString(), label: "Coupons Used" },
    ]);
  }, [appointmentData.done, walkInLogs, usedCouponsCount]);

  // Fetch services from API on component mount
  useEffect(() => {
    fetchServices();
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

        await fetchServices();

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

        // Build request body with only fields that have values (not empty)
        // This ensures unmodified fields retain their original values
        const updateBody = {
          name: serviceData.name,
          category: serviceData.category,
          description: serviceData.meta,
          available: serviceData.available
        };

        // Only include price if it's a valid number
        if (!isNaN(priceValue) && priceValue !== '') {
          updateBody.price = priceValue;
        }

        // Only include estimated_time if it's provided and not empty
        if (serviceData.estimated_time !== undefined && serviceData.estimated_time !== '') {
          updateBody.estimated_time = parseInt(serviceData.estimated_time, 10);
        }

        console.log("Update request body:", updateBody);

        const res = await fetch(`/api/services/update?id=${serviceData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateBody)
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to update service: ${res.status}`);
        }

        await fetchServices();
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

      await fetchServices();
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

  const handleDownloadReports = async () => {
    try {
      setIsDownloadingReports(true);

      const response = await fetch('/api/services/usage-export');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to download reports: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'services_usage_report.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      showToast({
        message: 'Services usage report downloaded successfully.',
        type: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('[AdminServices] Error downloading services usage report:', error);
      showToast({
        message: `Failed to download report: ${error.message}`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsDownloadingReports(false);
    }
  };

  const headerNotifications = bookingNotifications;

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
              <h1 className="dash-page-title">Services Management</h1>
              <p className="dash-page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          <AdminHeaderActions
            notifications={headerNotifications}
            onLoadMoreNotifications={handleLoadMoreBookingNotifications}
            hasMoreNotifications={bookingNotificationsHasMore}
            loadingMoreNotifications={loadingMoreBookingNotifications}
          />
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
            <AnalyticsPanel onDownloadReports={handleDownloadReports} isDownloading={isDownloadingReports} />
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