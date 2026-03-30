import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const ScissorsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8.46 7.54l10.08 10.08M8.46 16.46L18 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

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
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const CalendarIcon = () => (
  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="18" height="17" rx="2" stroke="#DD901D" strokeWidth="1.7"/>
    <path d="M1 8h18" stroke="#DD901D" strokeWidth="1.7"/>
    <path d="M6 1v4M14 1v4" stroke="#DD901D" strokeWidth="1.7" strokeLinecap="round"/>
    <rect x="5" y="11" width="3" height="3" rx="0.5" fill="#DD901D"/>
    <rect x="9" y="11" width="3" height="3" rx="0.5" fill="#DD901D"/>
  </svg>
);

const QueueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="5" r="3" stroke="#DD901D" strokeWidth="1.7"/>
    <circle cx="3" cy="7" r="2.2" stroke="#DD901D" strokeWidth="1.5"/>
    <circle cx="17" cy="7" r="2.2" stroke="#DD901D" strokeWidth="1.5"/>
    <path d="M1 17c0-3 1.8-5 4-5" stroke="#DD901D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 12c2.2 0 4 2 4 5" stroke="#DD901D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#DD901D" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const RevenueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8.5" stroke="#DD901D" strokeWidth="1.7"/>
    <path d="M10 5v10M7.5 7.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5S11.38 10 10 10s-2.5 1.12-2.5 2.5S8.62 15 10 15s2.5-1.12 2.5-2.5" stroke="#DD901D" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8.5" stroke="#DD901D" strokeWidth="1.7"/>
    <path d="M10 5.5V10l3 3" stroke="#DD901D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="20" height="20" rx="4" fill="#DD901D"/>
    <path d="M5 15l4-5 3 3 5-7" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17" cy="6" r="2" fill="#000"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 1v9M4.5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 11v1a2 2 0 002 2h9a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// ─── Chart Component (SVG Line Chart) ────────────────────────────────────────

const AppointmentLineChart = () => {
  const data = [
    { day: "Mon", value: 24 },
    { day: "Tue", value: 29 },
    { day: "Wed", value: 31 },
    { day: "Thur", value: 35 },
    { day: "Fri", value: 42 },
  ];

  const width = 520;
  const height = 300;
  const paddingLeft = 48;
  const paddingRight = 20;
  const paddingTop = 16;
  const paddingBottom = 44;

  const minVal = 20;
  const maxVal = 45;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const toX = (i) => paddingLeft + (i / (data.length - 1)) * chartW;
  const toY = (v) => paddingTop + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const yLines = [20, 25, 30, 35, 40, 45];

  const pointsStr = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(" ");

  // Build area path
  const areaPath = `M ${toX(0)},${toY(data[0].value)} ` +
    data.slice(1).map((d, i) => `L ${toX(i + 1)},${toY(d.value)}`).join(" ") +
    ` L ${toX(data.length - 1)},${paddingTop + chartH} L ${toX(0)},${paddingTop + chartH} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DD901D" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#DD901D" stopOpacity="0.03" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {yLines.map((v) => (
        <g key={v}>
          <line
            x1={paddingLeft}
            y1={toY(v)}
            x2={width - paddingRight}
            y2={toY(v)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <text
            x={paddingLeft - 8}
            y={toY(v) + 4}
            textAnchor="end"
            fill="rgba(152,143,129,0.9)"
            fontSize="11"
            fontFamily="Inter, sans-serif"
          >
            {v}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline
        points={pointsStr}
        fill="none"
        stroke="#DD901D"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Data points */}
      {data.map((d, i) => (
        <g key={d.day}>
          <circle cx={toX(i)} cy={toY(d.value)} r="5" fill="#0a0908" stroke="#DD901D" strokeWidth="2.5" />
          <circle cx={toX(i)} cy={toY(d.value)} r="2" fill="#DD901D" />
        </g>
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={d.day}
          x={toX(i)}
          y={paddingTop + chartH + 22}
          textAnchor="middle"
          fill="rgba(152,143,129,0.9)"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          {d.day}
        </text>
      ))}
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "user-accounts", label: "User Accounts", icon: UserIcon },
  { id: "database", label: "Database", icon: DatabaseIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
  { id: "landing-page", label: "Landing Page", icon: GlobeIcon },
];

// ─── Metrics Carousel Data ────────────────────────────────────────────────

const METRICS_SETS = [
  {
    id: "page1",
    name: "Metrics",
    cards: [
      {
        icon: <CalendarIcon />,
        value: "24",
        label: "Today's Appointments",
        badge: { text: "+3", type: "green" },
      },
      {
        icon: <QueueIcon />,
        value: "8",
        label: "In Queue Now",
        badge: null,
      },
      {
        icon: <RevenueIcon />,
        value: "₱12,450",
        label: "Revenue Today",
        badge: { text: "+15%", type: "green" },
      },
      {
        icon: <ClockIcon />,
        value: "18 mins",
        label: "Avg. Waiting Time",
        badge: { text: "-5mins", type: "blue" },
      },
    ],
  },
  {
    id: "page2",
    name: "Metrics",
    cards: [
      {
        icon: <ScissorsIcon />,
        value: "14",
        label: "Promo Bookings Today",
        badge: null,
      },
      {
        icon: <CalendarIcon />,
        value: "12",
        label: "Loyalty Cards Activated",
        badge: { text: "+5", type: "green" },
      },
      {
        icon: <CalendarIcon />,
        value: "16",
        label: "Completed",
        badge: null,
      },
      {
        icon: <QueueIcon />,
        value: "3",
        label: "In Progress",
        badge: null,
      },
    ],
  },
  {
    id: "page3",
    name: "Metrics",
    cards: [
      {
        icon: <ClockIcon />,
        value: "5",
        label: "Pending",
        badge: null,
      },
      {
        icon: <RevenueIcon />,
        value: "2",
        label: "Cancelled",
        badge: null,
      },
      {
        icon: <CalendarIcon />,
        value: "24",
        label: "Today's Appointments",
        badge: { text: "+3", type: "green" },
      },
      {
        icon: <QueueIcon />,
        value: "8",
        label: "In Queue Now",
        badge: null,
      },
    ],
  },
];

// ─── Analytics Carousel Data ──────────────────────────────────────────────

const ANALYTICS_CARDS = [
  {
    id: "dashboard",
    title: "Dashboard Analytics",
    subtitle: "View Detailed Reports",
    stats: [
      { label: "Completed Today", value: "18", color: "#22c55e" },
      { label: "Cancelled", value: "3", color: "rgba(239,67,67,0.85)" },
      { label: "Pending", value: "6", color: "var(--color-amber)" },
      { label: "Peak Hour", value: "2 PM", color: "var(--color-white)" },
    ],
  },

  {
    id: "live-status",
    title: "Live Status Analytics",
    subtitle: "Real-time Insights",
    stats: [
      { label: "Staff Online", value: "8/12", color: "#22c55e" },
      { label: "Avg Response Time", value: "2.3 min", color: "var(--color-amber)" },
      { label: "Customer Satisfaction", value: "96%", color: "#fbbf24" },
      { label: "Active Sessions", value: "24", color: "var(--color-white)" },
    ],
  },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [metricsIndex, setMetricsIndex] = useState(0);
  const [analyticsIndex, setAnalyticsIndex] = useState(0);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Current date
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Metrics carousel handlers
  const handlePrevMetrics = () => {
    setMetricsIndex((prev) => (prev === 0 ? METRICS_SETS.length - 1 : prev - 1));
  };

  const handleNextMetrics = () => {
    setMetricsIndex((prev) => (prev === METRICS_SETS.length - 1 ? 0 : prev + 1));
  };

  const currentMetrics = METRICS_SETS[metricsIndex];

  // Analytics carousel handlers
  const handlePrevAnalytics = () => {
    setAnalyticsIndex((prev) => (prev === 0 ? ANALYTICS_CARDS.length - 1 : prev - 1));
  };

  const handleNextAnalytics = () => {
    setAnalyticsIndex((prev) => (prev === ANALYTICS_CARDS.length - 1 ? 0 : prev + 1));
  };

  const currentAnalytics = ANALYTICS_CARDS[analyticsIndex];

  return (
    <div className="super-admin-container">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-16px)",
        transition: "all 0.5s ease"
      }}>
        {/* Logo + Toggle */}
        <div className="sidebar-logo-section">
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="logo-toggle-btn"
            title="Toggle sidebar"
          >
            <div className="logo-badge">
              <LogoIcon />
            </div>
          </button>
          {sidebarExpanded && <span className="brand-name">BeautyBook Pro</span>}
        </div>

        {/* Admin pill */}
        {sidebarExpanded && (
          <div className="admin-badge-pill">
            <div className="admin-badge-circle">S</div>
            <span className="admin-badge-text">Super Administrator</span>
          </div>
        )}

        {/* Nav items */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "user-accounts") {
                    navigate("/superadmin/users");
                  } else if (item.id === "database") {
                    navigate("/superadmin/database");
                  } else if (item.id === "security") {
                    navigate("/superadmin/security");
                  } else {
                    setActiveNav(item.id);
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

        {/* Log Out */}
        <div className="sidebar-logout-section">
          <button onClick={handleLogout} className="logout-button" title="Log out">
            <LogOutIcon />
            {sidebarExpanded && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="super-admin-main">

        {/* Header */}
        <header className={`dashboard-header ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          {/* Title block */}
          <div className="header-title-section">
            <h1 className="header-main-title">Super Admin Dashboard</h1>
            <p className="header-subtitle">BeautyBook Pro • {dateStr}</p>
          </div>

          {/* Actions */}
          <div className="header-actions">
            <button className="dash-action-btn">
              <BellIcon />
              Notifications
            </button>
            <button className="dash-action-btn">
              <SettingsIcon />
              Settings
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="dashboard-main">

          {/* ── Metrics Cards with Carousel ── */}
          <div className="dash-stats-carousel-container">
            {/* Carousel Header - Title Only */}
            <div className="dash-stats-carousel-header">
              <h3 className="dash-stats-set-title">{currentMetrics.name}</h3>
            </div>

            {/* Metrics Cards */}
            <div className="dash-stats-row">
              {currentMetrics.cards.map((m, idx) => (
                <div
                  key={`${metricsIndex}-${idx}`}
                  className="dash-stat-card"
                  style={{ animationDelay: `${0.08 + idx * 0.07}s` }}
                >
                  <div className="dash-stat-top">
                    <div className="dash-stat-icon-box">{m.icon}</div>
                    {m.badge && (
                      <span
                        className={`dash-stat-badge ${
                          m.badge.type === "green"
                            ? "dash-stat-badge-green"
                            : "dash-stat-badge-blue"
                        }`}
                      >
                        {m.badge.text}
                      </span>
                    )}
                  </div>
                  <div className="dash-stat-bottom">
                    <p className="dash-stat-value">{m.value}</p>
                    <p className="dash-stat-label">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Navigation - Bottom */}
            <div className="dash-stats-carousel-bottom">
              <div className="dash-stats-carousel-nav">
                <button
                  onClick={handlePrevMetrics}
                  className="stats-carousel-btn"
                  title="Previous metrics"
                  aria-label="Previous"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Carousel Dots */}
                <div className="dash-stats-carousel-dots">
                  {METRICS_SETS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMetricsIndex(idx)}
                      className={`stats-carousel-dot ${idx === metricsIndex ? "active" : ""}`}
                      title={`View ${METRICS_SETS[idx].name}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextMetrics}
                  className="stats-carousel-btn"
                  title="Next metrics"
                  aria-label="Next"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Chart + Analytics row ── */}
          <div className="flex gap-5 items-start w-full">

            {/* Chart Panel */}
            <div className="chart-panel">
              {/* Panel title */}
              <div className="flex flex-col gap-1">
                <h2 className="chart-panel-title">Today's Appointment Chart</h2>
                <div className="chart-divider" />
              </div>

              {/* Chart area */}
              <div className="chart-container">
                <AppointmentLineChart />
              </div>
            </div>

            {/* Analytics Card */}
            <div className="analytics-card">
              {/* Header */}
              <div className="dash-analytics-header">
                <div className="dash-analytics-icon-box">
                  <AnalyticsIcon />
                </div>
                <div className="dash-analytics-text">
                  <p className="dash-analytics-title">{currentAnalytics.title}</p>
                  <p className="dash-analytics-sub">{currentAnalytics.subtitle}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="analytics-divider" />

              {/* Quick stats */}
              <div className="analytics-stats">
                {currentAnalytics.stats.map((stat) => (
                  <div key={stat.label} className="stat-row">
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-value" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="analytics-divider" />

              {/* Download button */}
              <button className="dash-download-btn">
                <DownloadIcon />
                Download Reports →
              </button>
            </div>

          </div>
          {/* End chart row */}

        </main>
      </div>
    </div>
  );
}