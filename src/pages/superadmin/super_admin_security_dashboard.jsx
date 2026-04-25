import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";


// ─── SVG Icons ─────────────────────────────────────────────────────────

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

const UserIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5.5" r="3.5" stroke={color} strokeWidth="1.6"/>
    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const DatabaseIcon = ({ color = "currentColor" }) => (
  <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="9" cy="4.5" rx="6" ry="2.5" stroke={color} strokeWidth="1.6"/>
    <path d="M3 4.5v9C3 15.09 5.686 17 9 17s6-1.91 6-3.5v-9" stroke={color} strokeWidth="1.6"/>
    <path d="M3 9c0 1.657 2.686 3 6 3s6-1.343 6-3" stroke={color} strokeWidth="1.6"/>
  </svg>
);

const ShieldIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 1.5L3 4v5.5C3 13.09 5.686 16.3 9 17c3.314-.7 6-3.91 6-7.5V4L9 1.5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M6.5 9l1.75 1.75L11.5 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GlobeIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.6"/>
    <path d="M9 2C9 2 7 5 7 9s2 7 2 7M9 2c0 0 2 3 2 7s-2 7-2 7M2 9h14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const LogOutIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 15H3.5A1.5 1.5 0 012 13.5v-9A1.5 1.5 0 013.5 3H7" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M12 12l4-3-4-3M16 9H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1a5 5 0 00-5 5v3l-1.5 2.5h13L13 9V6a5 5 0 00-5-5z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M6.5 15.5a1.5 1.5 0 003 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.5" cy="8.5" r="2.5" stroke="white" strokeWidth="1.6"/>
    <path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3.05 3.05l1.41 1.41M12.54 12.54l1.41 1.41M3.05 13.95l1.41-1.41M12.54 4.46l1.41-1.41" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// ─── Event Icons ─────────────────────────────────────────────────────

const WarningIcon = ({ color = "#dd901d" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L18.5 17H1.5L10 2z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="10" y1="9" x2="10" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="10" cy="15.5" r="0.8" fill={color}/>
  </svg>
);

const KeyIcon = ({ color = "#4387ef" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="7.5" cy="10" r="4.5" stroke={color} strokeWidth="1.3"/>
    <path d="M11.5 10H18M16 8v4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const UserPlusIcon = ({ color = "#4387ef" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="8" cy="7" r="3" stroke={color} strokeWidth="1.3"/>
    <path d="M2 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M15 6v6M12 9h6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const BlockIcon = ({ color = "#ef4343" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.3"/>
    <line x1="4.5" y1="4.5" x2="15.5" y2="15.5" stroke={color} strokeWidth="1.3"/>
  </svg>
);

const RoleIcon = ({ color = "#dd901d" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="7" r="3" stroke={color} strokeWidth="1.3"/>
    <path d="M4 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M14 3l1.5 1.5L18 2" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Login link generation icons
const LinkGenerationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M14 9a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const QuickAccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="#22c55e" strokeWidth="1.3"/>
    <path d="M6 8h8M6 12h5" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const MagicLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 3l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-5z" stroke="#22c55e" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

const IPIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7.5" stroke="#988f81" strokeWidth="1.3"/>
    <path d="M10 4C7 8 7 12 10 16M10 4c3 4 3 8 0 12M3 10h14" stroke="#988f81" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const SystemMaintenanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M8 3H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-4" stroke="#988f81" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M9 1a1 1 0 112 0" stroke="#988f81" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M7 11l2 2 4-4" stroke="#988f81" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Navigation Items ──────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "staff-management", label: "Staff Management", icon: UserIcon },
  { id: "database", label: "Database", icon: DatabaseIcon },
  { id: "services", label: "Services", icon: DatabaseIcon },
  { id: "logs", label: "Logs", icon: DatabaseIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
  // { id: "landing-page", label: "Landing Page", icon: GlobeIcon },
];

// ─── Data ──────────────────────────────────────────────────────────────

const statsData = [
  { value: "7", label: "Failed Logins (24h)" },
  { value: "2", label: "Blocked IPs" },
  { value: "23", label: "Active Sessions" },
  { value: "68%", label: "2FA Enabled" },
];

const securityEvents = [
  { id: 1, type: "warning", icon: WarningIcon, color: "#dd901d", title: "Failed login attempt", email: "unknown@gmail.com", time: "10 mins ago" },
  { id: 2, type: "info", icon: KeyIcon, color: "#4387ef", title: "Password changed", email: "carlosbeautybookpro@gmail.com", time: "1 hr ago" },
  { id: 3, type: "info", icon: UserPlusIcon, color: "#4387ef", title: "New account created", email: "anabeautybookpro@gmail.com", time: "2 hrs ago" },
  { id: 4, type: "danger", icon: BlockIcon, color: "#ef4343", title: "Multiple failed logins (×5)", email: "test@test.com", time: "3 hrs ago" },
  { id: 5, type: "warning", icon: RoleIcon, color: "#dd901d", title: "Role updated to staff", email: "carlosbeautybookpro@gmail.com", time: "1 day ago" },
];

const initialSecurityItems = [
  { label: "System Maintenance", status: "Disabled", enabled: false, Icon: SystemMaintenanceIcon },
];

export default function SuperAdminSecurityDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("security");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [secItems, setSecItems] = useState(initialSecurityItems);

  // Login link generation states
  const [adminAccounts] = useState([
    { id: 1, name: "Carlos Beauty", email: "carlosbeautybookpro@gmail.com", role: "Admin" },
    { id: 2, name: "Ana Super Admin", email: "anabeautybookpro@gmail.com", role: "Super Admin" },
    { id: 3, name: "John Admin", email: "john.admin@beautybookpro.com", role: "Admin" },
  ]);
  const [linkSearchInput, setLinkSearchInput] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Maintenance states
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const [activeUsers, setActiveUsers] = useState(12); // Mock data
  const [maintenanceStartTime, setMaintenanceStartTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [maintenanceWhitelist, setMaintenanceWhitelist] = useState([]);
  const [whitelistInput, setWhitelistInput] = useState("");
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [showCountdownBanner, setShowCountdownBanner] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!maintenanceStartTime) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(maintenanceStartTime).getTime();
      const diff = startTime - now;
      
      if (diff <= 0) {
        setCountdown(null);
        setShowCountdownBanner(false);
        clearInterval(interval);
      } else if (diff <= 5 * 60 * 1000) { // 5 minutes
        setShowCountdownBanner(true);
        setCountdown(Math.floor(diff / 1000));
      } else if (diff <= 24 * 60 * 60 * 1000) { // 24 hours
        setShowWarningBanner(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [maintenanceStartTime]);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const toggleSecurityItem = (idx) => {
    setSecItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const next = !item.enabled;
      
      // Handle maintenance toggle
      if (item.label === "System Maintenance") {
        if (next) {
          setShowMaintenanceConfirm(true);
        } else {
          setMaintenanceEnabled(false);
          setMaintenanceStartTime(null);
          displayToast("System maintenance disabled");
        }
        return item; // Don't update status yet
      }
      
      return { ...item, enabled: next, status: next ? "Enabled" : "Disabled" };
    }));
  };

  const handleMaintenanceConfirm = () => {
    setMaintenanceEnabled(true);
    setMaintenanceStartTime(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes from now
    setShowMaintenanceConfirm(false);
    setSecItems(prev => prev.map(item => 
      item.label === "System Maintenance" 
        ? { ...item, enabled: true, status: "Enabled" }
        : item
    ));
    displayToast("System maintenance enabled");
  };

  const handleAddToWhitelist = () => {
    if (whitelistInput && /^(\d{1,3}\.){3}\d{1,3}$/.test(whitelistInput)) {
      setMaintenanceWhitelist([...maintenanceWhitelist, whitelistInput]);
      setWhitelistInput("");
      displayToast(`IP ${whitelistInput} added to whitelist`);
    } else {
      displayToast("Invalid IP address format");
    }
  };

  const handleRemoveFromWhitelist = (ip) => {
    setMaintenanceWhitelist(maintenanceWhitelist.filter(item => item !== ip));
    displayToast(`IP ${ip} removed from whitelist`);
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadLog = () => {
    displayToast('Downloading security log…');
  };

  const handleSearchAccount = (value) => {
    setLinkSearchInput(value);
    
    if (value.trim() === "") {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setGeneratedLink("");
      setSelectedAccount(null);
      return;
    }

    const results = adminAccounts.filter(account =>
      account.name.toLowerCase().includes(value.toLowerCase()) ||
      account.email.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchDropdown(results.length > 0);
    setGeneratedLink("");
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setLinkSearchInput(account.name);
    setShowSearchDropdown(false);
    setGeneratedLink("");
  };

  const generateLoginLink = () => {
    if (!selectedAccount) {
      displayToast("Please select a valid admin or super admin account");
      return;
    }

    // Generate a mock magic link
    const timestamp = Date.now();
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `https://beautybookpro.com/auth/magic-link?token=${token}&id=${selectedAccount.id}&t=${timestamp}`;
    
    setGeneratedLink(link);
    setLinkSearchInput(link);
    displayToast(`Login link generated for ${selectedAccount.name}`);
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      displayToast("Link copied to clipboard");
    }
  };

  return (
    <div className="super-admin-container">
      {/* ─── WARNING BANNERS ─── */}
      {showWarningBanner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(221, 144, 29, 0.15)', border: '1px solid rgba(221, 144, 29, 0.3)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001, fontFamily: "'Inter', sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10 2L18.5 17H1.5L10 2z" stroke="#DD901D" strokeWidth="1.3" strokeLinejoin="round"/>
            <line x1="10" y1="9" x2="10" y2="13" stroke="#DD901D" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="10" cy="15.5" r="0.8" fill="#DD901D"/>
          </svg>
          <span style={{ color: '#DD901D', fontSize: '13px', fontWeight: 600 }}>Scheduled system maintenance in 24 hours. Users will be notified and logged out.</span>
        </div>
      )}

      {showCountdownBanner && (
        <div style={{ position: 'fixed', top: showWarningBanner ? 48 : 0, left: 0, right: 0, background: 'rgba(239, 67, 67, 0.15)', border: '1px solid rgba(239, 67, 67, 0.3)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001, fontFamily: "'Inter', sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, animation: 'pulse 1s infinite' }}>
            <circle cx="10" cy="10" r="7.5" stroke="#EF4343" strokeWidth="1.3"/>
            <path d="M10 6v4l2.5 2.5" stroke="#EF4343" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#EF4343', fontSize: '13px', fontWeight: 600 }}>CRITICAL: System maintenance starts in {formatCountdown(countdown || 0)}</span>
        </div>
      )}

      {/* ─── SIDEBAR ─── */}
      <aside className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-16px)",
        transition: "all 0.5s ease"
      }}>
        <div className="sidebar-logo-section">
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="logo-toggle-btn"
            title="Toggle sidebar"
          >
            <div className="logo-badge">
              <LogoIcon />
            </div>
            {sidebarExpanded && <span className="brand-name">BeautyBook Pro</span>}
          </button>
        </div>

        {sidebarExpanded && (
          <div className="admin-badge-pill">
            <div className="admin-badge-circle">S</div>
            <span className="admin-badge-text">Super Administrator</span>
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "security") {
                    navigate("/superadmin/security");
                  } else if (item.id === "dashboard") {
                    navigate("/superadmin/dashboard");
                  } else if (item.id === "staff-management") {
                    navigate("/superadmin/users");
                  } else if (item.id === "database") {
                    navigate("/superadmin/database");
                  } else if (item.id === "services") {
                    navigate("/superadmin/services");
                  } else if (item.id === "logs") {
                    navigate("/superadmin/logs");
                  } else if (item.id === "landing-page") {
                    navigate("/superadmin/landing-page");
                  } else {
                    setActiveNav(item.id);
                    displayToast(`${item.label} section coming soon`);
                  }
                }}
                className={`nav-button ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <item.icon color={isActive ? "#000" : "currentColor"} />
                {sidebarExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-logout-section">
          <button className="logout-button" onClick={handleLogout} title="Log out">
            <LogOutIcon color="#988f81" />
            {sidebarExpanded && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="super-admin-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title-section">
            <h1 className="header-main-title">System Security</h1>
            <p className="header-subtitle">BeautyBook Pro • Saturday, Dec 7, 2024</p>
          </div>
          <div className="header-actions">
            <button className="header-action-btn" onClick={() => displayToast('No new notifications')}>
              <BellIcon />
              <span>Notifications</span>
            </button>
            <button className="header-action-btn" onClick={() => displayToast('Settings coming soon')}>
              <SettingsIcon />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-main">
          <div className="dashboard-panel">
            {/* Panel header */}
            <div className="panel-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "16px", color: "#fff" }}>
                <ShieldIcon color="#fff" /> Security Overview
              </div>
              <button onClick={handleDownloadLog} className="btn-ghost">
                ↓ Download Log
              </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-bar">
              {statsData.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Events */}
            <div className="space-y-2 mt-6">
              {securityEvents.map((event) => {
                const IconComponent = event.icon;
                return (
                  <div key={event.id} className="db-row">
                    <div className="db-icon" style={{ background: `rgba(${event.color === "#dd901d" ? "221, 144, 29" : event.color === "#4387ef" ? "67, 135, 239" : "239, 67, 67"}, 0.1)`, borderRadius: "8px" }}>
                      <IconComponent color={event.color} />
                    </div>
                    <div className="db-name-wrap">
                      <span className="db-name">{event.title}</span>
                      <span className="db-meta">{event.email}</span>
                    </div>
                    <div className="db-updated">{event.time}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Settings Panel */}
          <div className="dashboard-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "16px", color: "#fff", marginBottom: "16px" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="8" width="14" height="9" rx="2" stroke="#fff" strokeWidth="1.3"/>
                <path d="M5 8V6a4 4 0 018 0v2" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Security Settings
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {secItems.map((item, idx) => (
                <div key={idx} className="db-row" style={{ padding: "16px", height: "auto" }}>
                  <div className="db-icon" style={{ background: item.enabled ? "rgba(34, 197, 94, 0.1)" : "rgba(152, 143, 129, 0.1)", borderRadius: "8px", width: "36px", height: "36px", marginRight: "12px" }}>
                    <item.Icon />
                  </div>
                  <div className="db-name-wrap">
                    <span className="db-name">{item.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <div style={{
                      height: "23px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "48px",
                      background: item.enabled ? "rgba(34, 197, 94, 0.15)" : "rgba(152, 143, 129, 0.15)",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: item.enabled ? "#22c55e" : "#988f81",
                      whiteSpace: "nowrap",
                    }}>
                      {item.status}
                    </div>
                    <Toggle enabled={item.enabled} onToggle={() => {
                      toggleSecurityItem(idx);
                      displayToast(`${item.label} ${item.enabled ? "disabled" : "enabled"}`);
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Link Generation Panel */}
          <div className="dashboard-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "16px", color: "#fff", marginBottom: "16px" }}>
              <LinkGenerationIcon />
              Admin & Super Admin Login Links
            </div>

            <div style={{ marginBottom: "16px", position: "relative" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#dd901d", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Search Admin Account
              </label>
              <div style={{ display: "flex", gap: "8px", position: "relative" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Type name or email..."
                    value={linkSearchInput}
                    onChange={(e) => handleSearchAccount(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowSearchDropdown(true);
                    }}
                    readOnly={generatedLink !== ""}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      backgroundColor: "rgba(26, 15, 0, 0.5)",
                      border: "1px solid rgba(221, 144, 29, 0.2)",
                      borderRadius: "8px",
                      color: "#f5f5f5",
                      fontSize: "14px",
                      fontFamily: "Inter, sans-serif",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease",
                      cursor: generatedLink ? "default" : "text"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.2)"}
                  />
                  
                  {/* Search Dropdown */}
                  {showSearchDropdown && searchResults.length > 0 && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "#1a1a1a",
                      border: "1px solid rgba(221, 144, 29, 0.3)",
                      borderRadius: "8px",
                      marginTop: "4px",
                      zIndex: 100,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                    }}>
                      {searchResults.map((account) => (
                        <button
                          key={account.id}
                          onClick={() => handleSelectAccount(account)}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            background: "none",
                            border: "none",
                            borderBottom: "1px solid rgba(221, 144, 29, 0.1)",
                            textAlign: "left",
                            cursor: "pointer",
                            color: "#f5f5f5",
                            fontSize: "13px",
                            fontFamily: "Inter, sans-serif",
                            transition: "background-color 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                          <div style={{ fontWeight: 600, marginBottom: "2px" }}>{account.name}</div>
                          <div style={{ fontSize: "12px", color: "#988f81" }}>{account.email} • {account.role}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {!generatedLink ? (
                  <button
                    onClick={generateLoginLink}
                    disabled={!selectedAccount}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: selectedAccount ? "#dd901d" : "#888",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: selectedAccount ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAccount) {
                        e.currentTarget.style.backgroundColor = "#e6a326";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAccount) {
                        e.currentTarget.style.backgroundColor = "#dd901d";
                      }
                    }}
                  >
                    Generate
                  </button>
                ) : (
                  <button
                    onClick={handleCopyLink}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#22c55e",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#22c55e"}
                  >
                    Copy Link
                  </button>
                )}
              </div>

              {selectedAccount && !generatedLink && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#988f81" }}>
                  Selected: <span style={{ color: "#dd901d", fontWeight: 600 }}>{selectedAccount.name}</span> ({selectedAccount.role})
                </div>
              )}
            </div>
          </div>

          {/* System Maintenance Panel */}
          {maintenanceEnabled && (
            <div className="dashboard-panel" style={{ borderColor: 'rgba(239, 67, 67, 0.3)', background: 'rgba(239, 67, 67, 0.05)' }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "16px", color: "#EF4343", marginBottom: "16px" }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L18.5 17H1.5L10 2z" stroke="#EF4343" strokeWidth="1.3" strokeLinejoin="round"/>
                  <line x1="10" y1="9" x2="10" y2="13" stroke="#EF4343" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="10" cy="15.5" r="0.8" fill="#EF4343"/>
                </svg>
                Maintenance Mode Active
              </div>

              <div style={{ background: 'rgba(239, 67, 67, 0.1)', border: '1px solid rgba(239, 67, 67, 0.2)', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#EF4343', fontFamily: "'Inter', sans-serif" }}>
                ⚠ {activeUsers} active users will be logged out. Non-admin users will see maintenance page.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', color: '#D4C5B9', marginBottom: '8px' }}>Admin IP Whitelist</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                    value={whitelistInput}
                    onChange={(e) => setWhitelistInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddToWhitelist()}
                    style={{ flex: 1, background: 'rgba(152, 143, 129, 0.1)', border: '1px solid rgba(152, 143, 129, 0.2)', borderRadius: '6px', padding: '8px 12px', color: '#ffffff', fontFamily: "'Inter', sans-serif", fontSize: '13px', outline: 'none' }}
                  />
                  <button 
                    onClick={handleAddToWhitelist}
                    style={{ padding: '8px 16px', background: 'rgba(221, 144, 29, 0.15)', border: '1px solid #DD901D', color: '#DD901D', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(221, 144, 29, 0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(221, 144, 29, 0.15)'}
                  >
                    Add IP
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {maintenanceWhitelist.map((ip) => (
                    <div key={ip} style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                      {ip}
                      <button 
                        onClick={() => handleRemoveFromWhitelist(ip)}
                        style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: '16px', padding: '0', display: 'flex', alignItems: 'center' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {maintenanceStartTime && (
                <div style={{ fontSize: '13px', color: '#D4C5B9', fontFamily: "'Inter', sans-serif" }}>
                  Starts at: <span style={{ color: '#DD901D', fontWeight: 600 }}>{new Date(maintenanceStartTime).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ─── TOAST ─── */}
      {showToast && (
        <div className="toast show">
          {toastMessage}
        </div>
      )}

      {/* ─── MAINTENANCE CONFIRMATION DIALOG ─── */}
      {showMaintenanceConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--bg-darker)', border: '1px solid rgba(239, 67, 67, 0.3)', borderRadius: '12px', padding: '24px', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 700, fontSize: '18px', color: '#EF4343', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L18.5 17H1.5L10 2z" stroke="#EF4343" strokeWidth="1.3" strokeLinejoin="round"/>
                <line x1="10" y1="9" x2="10" y2="13" stroke="#EF4343" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="10" cy="15.5" r="0.8" fill="#EF4343"/>
              </svg>
              Start System Maintenance?
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '13px', color: '#D4C5B9', marginBottom: '16px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>There are <span style={{ color: '#EF4343', fontWeight: 600 }}>{activeUsers} active users</span>.</div>
              <div>Starting maintenance will:</div>
              <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                <li>Log out all non-admin users</li>
                <li>Display maintenance page to visitors</li>
                <li>May cause data loss if services are interrupted</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowMaintenanceConfirm(false)} 
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(152, 143, 129, 0.3)', background: 'transparent', color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)'; e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)'; }}
              >
                Cancel
              </button>
              <button 
                onClick={handleMaintenanceConfirm} 
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #EF4343', background: 'rgba(239, 67, 67, 0.15)', color: '#EF4343', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 67, 67, 0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 67, 67, 0.15)'; }}
              >
                Start Maintenance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toggle Component ──────────────────────────────────────────────────

function Toggle({ enabled, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      position: "relative",
      width: "40px",
      height: "22px",
      borderRadius: "11px",
      background: enabled ? "rgba(34, 197, 94, 0.4)" : "rgba(152, 143, 129, 0.25)",
      border: `1px solid ${enabled ? "#22c55e" : "rgba(152, 143, 129, 0.40)"}`,
      cursor: "pointer",
      transition: "background 0.2s, border-color 0.2s",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute",
        top: "2px",
        left: enabled ? "20px" : "2px",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: enabled ? "#22c55e" : "#988f81",
        transition: "left 0.2s, background 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }}/>
    </div>
  );
}