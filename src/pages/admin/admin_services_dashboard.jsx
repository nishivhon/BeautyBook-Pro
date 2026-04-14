import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { EditServiceModal } from "../../components/modal/admin/edit_service";
import { CreatePromoModal } from "../../components/modal/admin/create_promo";
import { CreateDiscountModal } from "../../components/modal/admin/create_discount";

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
  { label: "Home",         active: false },
  { label: "Services",     active: true  },
  { label: "Live Status",  active: false },
  { label: "Staff Status", active: false },
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

/* ── Page header + stat cards ── */
const PageHeader = ({ stats }) => {
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-title-block">
          <h1 className="dash-page-title">Services Management</h1>
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
    </>
  );
};

/* ── Single service item row ── */
const ServiceItem = ({ id, name, category, meta, available, price, onEdit }) => (
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

/* ── Services list panel ── */
const ServicesPanel = ({ serviceGroups, loading, error, onEditService }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="svc-group-panel">
      <div className="svc-group-header">
        <h2 className="svc-group-title">All Services</h2>
        <button 
          className="svc-see-less-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Loading services...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
          Error loading services: {error}
        </div>
      )}

      {/* Services List */}
      {!loading && !error && (
        <div className={isExpanded ? "svc-services-scroll" : "svc-services-scroll-limited"}>
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
        </div>
      )}
    </div>
  );
};

/* ── Quick Actions sidebar ── */
const QuickActionsPanel = ({ onNewService, onCreatePromo, onCreateDiscount }) => (
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
      onClick={onCreatePromo}
    >
      <PromoIcon size={16} color="currentColor" />
      Create Promo
    </button>

    <button 
      className="svc-action-btn-secondary"
      onClick={onCreateDiscount}
    >
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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [isCreatingDiscount, setIsCreatingDiscount] = useState(false);
  const [stats, setStats] = useState([
    { Icon: CalendarIcon, badge: "+3",    badgeType: "green", value: "0",       label: "Today's Appointments" },
    { Icon: RevenueIcon,  badge: "+15%",  badgeType: "green", value: "₱0.00",   label: "Revenue Today"        },
    { Icon: ScissorsIcon, badge: null,    badgeType: null,    value: "0",       label: "Promo Bookings Today" },
    { Icon: LoyaltyIcon,  badge: "+5",    badgeType: "green", value: "0",       label: "Loyalty Cards Activated" },
  ]);
  const [appointmentData, setAppointmentData] = useState({
    current: [],
    pending: [],
    done: []
  });

  // Fetch appointments data
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

  // Calculate stats dynamically
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Total appointments for today
    const todayAppointments = [
      ...appointmentData.current.filter(apt => apt.date === today),
      ...appointmentData.pending.filter(apt => apt.date === today),
      ...appointmentData.done.filter(apt => apt.date === today)
    ];
    
    const totalToday = todayAppointments.length;

    setStats([
      { Icon: CalendarIcon, badge: "+3",    badgeType: "green", value: totalToday.toString(), label: "Today's Appointments" },
      { Icon: RevenueIcon,  badge: "+15%",  badgeType: "green", value: "₱12,450",   label: "Revenue Today"        },
      { Icon: ScissorsIcon, badge: null,    badgeType: null,    value: "0",       label: "Promo Bookings Today" },
      { Icon: LoyaltyIcon,  badge: "+5",    badgeType: "green", value: "0",       label: "Loyalty Cards Activated" },
    ]);
  }, [appointmentData]);

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
          // Handle both 'name' and 'service_name' column variants
          const serviceName = s.service_name || s.name || 'Unknown';
          
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
    logoutOperator();
    navigate("/");
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

        const res = await fetch('/api/services/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_name: serviceData.name,
            category: serviceData.category,
            description: serviceData.meta,
            price: isNaN(priceValue) ? 0 : priceValue,
            availability: serviceData.available
          })
        });

        if (!res.ok) {
          throw new Error(`Failed to create service: ${res.status}`);
        }

        const newService = await res.json();
        console.log("Service created successfully:", newService);
        
        // Add new service to list
        setServices(prev => [...prev, {
          id: newService.id,
          name: newService.service_name || newService.name,
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
            available: serviceData.available
          })
        });

        if (!res.ok) {
          throw new Error(`Failed to update service: ${res.status}`);
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

  const handleCreatePromo = () => {
    setIsCreatingPromo(true);
  };

  const handleClosePromoModal = () => {
    setIsCreatingPromo(false);
  };

  const handleSavePromo = (formData) => {
    console.log("Promo created:", formData);
    // Here you can integrate with your API to create the promo
    setIsCreatingPromo(false);
  };

  const handleCreateDiscount = () => {
    setIsCreatingDiscount(true);
  };

  const handleCloseDiscountModal = () => {
    setIsCreatingDiscount(false);
  };

  const handleSaveDiscount = (formData) => {
    console.log("Discount created:", formData);
    // Here you can integrate with your API to create the discount
    setIsCreatingDiscount(false);
  };

  return (
    <div className="dash-root">
      <AdminNavbar onLogout={handleLogout} />

      <main className="dash-main">
        <PageHeader stats={stats} />

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
              onCreatePromo={handleCreatePromo}
              onCreateDiscount={handleCreateDiscount}
            />
            <AnalyticsPanel />
          </div>
        </div>
      </main>

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
      <CreatePromoModal 
        isOpen={isCreatingPromo}
        onClose={handleClosePromoModal}
        onSave={handleSavePromo}
      />

      {/* Create Discount Modal - Rendered at page level */}
      <CreateDiscountModal 
        isOpen={isCreatingDiscount}
        onClose={handleCloseDiscountModal}
        onSave={handleSaveDiscount}
      />
    </div>
  );
};

export default AdminDashboardServices;