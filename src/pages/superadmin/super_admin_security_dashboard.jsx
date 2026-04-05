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

// Security toggle icons
const TwoFAIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="5" width="14" height="12" rx="2" stroke="#22c55e" strokeWidth="1.3"/>
    <path d="M7 5V4a3 3 0 016 0v1" stroke="#22c55e" strokeWidth="1.3"/>
    <circle cx="10" cy="11" r="1.5" fill="#22c55e"/>
    <line x1="10" y1="12.5" x2="10" y2="14.5" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const RateLimitIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7.5" stroke="#22c55e" strokeWidth="1.3"/>
    <path d="M10 6v4l2.5 2.5" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SessionIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="#22c55e" strokeWidth="1.3"/>
    <path d="M6 8h8M6 12h5" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IPIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7.5" stroke="#988f81" strokeWidth="1.3"/>
    <path d="M10 4C7 8 7 12 10 16M10 4c3 4 3 8 0 12M3 10h14" stroke="#988f81" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ─── Navigation Items ──────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "user-accounts", label: "User Accounts", icon: UserIcon },
  { id: "database", label: "Database", icon: DatabaseIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
  { id: "landing-page", label: "Landing Page", icon: GlobeIcon },
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
  { label: "Two-Factor Authentication", status: "Enabled", enabled: true, Icon: TwoFAIcon },
  { label: "Login Rate Limiting", status: "Enabled", enabled: true, Icon: RateLimitIcon },
  { label: "Session Timeout (30 min)", status: "Enabled", enabled: true, Icon: SessionIcon },
  { label: "IP Whitelisting", status: "Disabled", enabled: false, Icon: IPIcon },
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
      return { ...item, enabled: next, status: next ? "Enabled" : "Disabled" };
    }));
  };

  const handleDownloadLog = () => {
    displayToast('Downloading security log…');
  };

  return (
    <div className="super-admin-container">
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
                  } else if (item.id === "user-accounts") {
                    navigate("/superadmin/users");
                  } else if (item.id === "database") {
                    navigate("/superadmin/database");
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
        </main>
      </div>

      {/* ─── TOAST ─── */}
      {showToast && (
        <div className="toast show">
          {toastMessage}
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