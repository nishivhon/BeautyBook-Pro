import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientRequestsModal from "../../components/modal/staff/client_requests";
import RequestNewServiceModal from "../../components/modal/staff/request_new_service";
import "../../styles/tailwind.css";

// ── Icons ──────────────────────────────────────────────────────────────────────
const ScissorsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <circle cx="8" cy="8" r="3.5" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
    <circle cx="8" cy="20" r="3.5" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
    <line x1="10.5" y1="9.5" x2="22" y2="21" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="10.5" y1="18.5" x2="22" y2="7" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const BellIcon = () => (
  <svg width="15" height="18" viewBox="0 0 15 18" fill="none">
    <path d="M7.5 1a5 5 0 00-5 5v4l-1.5 2.5h13L12.5 10V6a5 5 0 00-5-5z" stroke="#988f81" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M6 14.5a1.5 1.5 0 003 0" stroke="#988f81" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const BreakIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 5h10v5a4 4 0 01-4 4H7a4 4 0 01-4-4V5z" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M13 7c2 0 2 3 0 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="6" y1="2" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="10" y1="2" x2="10" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const ClockOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 3H3.5A1.5 1.5 0 002 4.5v7A1.5 1.5 0 003.5 13H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M10 11l3-3-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Service category icons
const HaircutSvcIcon = ({ available }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="6.5" cy="6.5" r="2.5" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.4"/>
    <circle cx="6.5" cy="17.5" r="2.5" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.4"/>
    <line x1="8.5" y1="8.2" x2="19" y2="19" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="8.5" y1="15.8" x2="19" y2="5" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const StylingIcon = ({ available }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3C8 3 5 6 5 10c0 2.5 1.2 4.7 3 6l1 5h6l1-5c1.8-1.3 3-3.5 3-6 0-4-3-7-7-7z" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="9" y1="21" x2="15" y2="21" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const NailIcon = ({ available }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="8" y="3" width="8" height="12" rx="4" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3"/>
    <path d="M10 15v3a2 2 0 004 0v-3" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const SkinIcon = ({ available }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3"/>
    <path d="M8.5 14.5c1 2 5 2 7 0" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="9.5" cy="10.5" r="1" fill={available ? "#1a1000" : "var(--muted)"}/>
    <circle cx="14.5" cy="10.5" r="1" fill={available ? "#1a1000" : "var(--muted)"}/>
  </svg>
);
const MassageIcon = ({ available }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 16c2-5 6-9 10-9s8 4 8 9" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="12" cy="5.5" r="2.5" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.3"/>
    <path d="M9 16c1-2 5-2 6 0" stroke={available ? "#1a1000" : "var(--muted)"} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Services icon map
const categoryIconMap = {
  haircut:  HaircutSvcIcon,
  styling:  StylingIcon,
  nails:    NailIcon,
  skincare: SkinIcon,
  massage:  MassageIcon,
};

// Quick action icons
const MyServicesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M11 7l1.5 1.5L15 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ClientRequestIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="2.5" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4.5 7.5h7M4.5 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="12" cy="3.5" r="2" fill="var(--gold)"/>
    <text x="11.2" y="5" fontSize="2.5" fontWeight="700" fill="#1a1000">2</text>
  </svg>
);
const AddServiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const initialServices = {
  haircut: [
    { id:1, name:"Hair cuts",           meta:"Classic cut with styling",         price:"₱150", available:true },
    { id:2, name:"Hair color",           meta:"Full hair color service",          price:"₱500", available:true },
    { id:3, name:"Hair treatment",       meta:"Full hair treatment",              price:"₱400", available:false },
    { id:4, name:"Beard trimming",       meta:"Trim and beard shaping",           price:"₱100", available:true },
  ],
  nails: [
    { id:5, name:"Manicure",             meta:"Care & beautification for fingernails", price:"₱200", available:true },
    { id:6, name:"Pedicure",             meta:"Care & beautification for toenails",    price:"₱250", available:true },
    { id:7, name:"Nail enhancement",     meta:"Artificial nail application",           price:"₱300", available:false },
    { id:8, name:"Nail art & design",    meta:"Arts & Design for nails",               price:"₱350", available:true },
  ],
  skincare: [
    { id:9,  name:"Facial treatment",    meta:"Care & beautification for face & skin", price:"₱600", available:true },
    { id:10, name:"Advance treatment",   meta:"High-tech solutions for skin concerns",  price:"₱800", available:true },
    { id:11, name:"Specialized facials", meta:"Targeted care for specific skin needs",  price:"₱700", available:true },
    { id:12, name:"Body treatment",      meta:"Full-body skincare services",           price:"₱900", available:false },
  ],
  massage: [
    { id:13, name:"Swedish massage",     meta:"Gently stroke for relaxation",          price:"₱500", available:true },
    { id:14, name:"Deep tissue massage", meta:"Intense pressure for muscle knots",     price:"₱700", available:true },
    { id:15, name:"Hot stone massage",   meta:"Heated stones to melt tension",         price:"₱650", available:false },
    { id:16, name:"Foot reflexology",    meta:"Pressure points for overall wellness",  price:"₱400", available:true },
  ],
  premium: [
    { id:17, name:"Bridal package",      meta:"Full wedding day beauty",               price:"₱2000", available:true },
    { id:18, name:"Couple's Massage",    meta:"Relaxation for 2",                      price:"₱1200", available:true },
    { id:19, name:"Hair & glow combo",   meta:"Scalp treatment + facial",              price:"₱900", available:true },
    { id:20, name:"VIP experience",      meta:"Private room + drinks",                 price:"₱1500", available:false },
  ],
};

const categoryMeta = {
  haircut:  { label:"Hair Services",        icon:"haircut"  },
  nails:    { label:"Nail Services",       icon:"nails"    },
  skincare: { label:"Skin Care Services",  icon:"skincare" },
  massage:  { label:"Massage Services",    icon:"massage"  },
  premium:  { label:"Premium Services",    icon:"premium"  },
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg:"", show:false });
  let timer;
  const show = (msg) => {
    setToast({ msg, show:true });
    clearTimeout(timer);
    timer = setTimeout(() => setToast(t => ({ ...t, show:false })), 2500);
  };
  return { toast, show };
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`toggle-switch ${checked ? "checked" : ""}`}
      aria-label="Toggle service availability"
    >
      <div className="toggle-switch-thumb" />
    </button>
  );
}

// ── Service item ──────────────────────────────────────────────────────────────
function ServiceItem({ service, category, onToggle, showToast }) {
  const IconComp = categoryIconMap[category] || HaircutSvcIcon;
  
  return (
    <div
      className={`service-item ${!service.available ? "unavailable" : ""}`}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(35,29,26,0.85)"}
      onMouseLeave={e => e.currentTarget.style.background = !service.available ? "rgba(35,29,26,0.30)" : "rgba(35,29,26,0.60)"}
    >
      {/* Icon box */}
      <div className={`service-icon-box ${!service.available ? "unavailable" : ""}`}>
        <IconComp available={service.available} />
      </div>

      {/* Info */}
      <div className="service-item-info">
        <div className={`service-item-name ${!service.available ? "unavailable" : ""}`}>
          {service.name}
        </div>
        <div className="service-item-meta">{service.meta}</div>
      </div>

      {/* Price + status */}
      <div className="service-item-status">
        <div className={`service-item-status-label ${!service.available ? "unavailable" : ""}`}>
          {service.available ? "Available" : "Not Available"}
        </div>
        <div className="service-item-price">{service.price}</div>
      </div>

      {/* Toggle */}
      <Toggle
        checked={service.available}
        onChange={() => {
          onToggle(service.id);
          showToast(`${service.name} marked as ${service.available ? "unavailable" : "available"}`);
        }}
      />
    </div>
  );
}

// ── Service section ───────────────────────────────────────────────────────────
function ServiceSection({ category, label, services, onToggle, showToast }) {
  const available = services.filter(s => s.available).length;

  return (
    <div className="service-section">
      <div className="service-section-header">
        <div className="service-section-title">
          {label}
          <span className="service-section-badge">
            {available}/{services.length} available
          </span>
        </div>
      </div>

      {services.map(s => (
        <ServiceItem
          key={s.id}
          service={s}
          category={category}
          onToggle={onToggle}
          showToast={showToast}
        />
      ))}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ showToast }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("Services");

  const handleNavigation = (link) => {
    setActive(link);
    if (link === "Services") {
      navigate("/staff/services");
    } else if (link === "Queue") {
      navigate("/staff/queue");
    } else {
      navigate("/staff/dashboard");
    }
  };
  
  return (
    <header className="admin-navbar">
      <div className="admin-nav-logo">
        <div className="admin-nav-logo-badge">
          <ScissorsIcon />
        </div>
        <span className="admin-nav-brand">BeautyBook Pro</span>
      </div>
      <nav className="admin-nav-links">
        <button 
          className={`admin-nav-link ${active === "Home" ? "active" : ""}`}
          onClick={() => handleNavigation("Home")}
        >
          Home
        </button>
        <button 
          className={`admin-nav-link ${active === "Services" ? "active" : ""}`}
          onClick={() => handleNavigation("Services")}
        >
          Services
        </button>
        <button 
          className={`admin-nav-link ${active === "Queue" ? "active" : ""}`}
          onClick={() => handleNavigation("Queue")}
        >
          Queue
        </button>
      </nav>
      <div className="admin-nav-right">
        <div className="admin-nav-user">
          <div className="admin-nav-avatar">M</div>
          <span className="admin-nav-username">Staff</span>
        </div>
        <div className="admin-nav-divider" />
        <button className="admin-nav-logout" onClick={() => showToast("Logging out…")}>Log Out</button>
      </div>
    </header>
  );
}

// ── Summary bar ───────────────────────────────────────────────────────────────
function SummaryBar({ services }) {
  const all = Object.values(services).flat();
  const available = all.filter(s => s.available).length;
  const total = all.length;
  const pct = Math.round((available / total) * 100);

  return (
    <div className="service-summary-bar">
      {[
        { value: available, label: "Available now", color: "service-stat-value-green" },
        { value: total - available, label: "Unavailable", color: "service-stat-value-red" },
        { value: `${pct}%`, label: "Availability rate", color: "service-stat-value-amber" },
      ].map(({ value, label, color }) => (
        <div key={label} className="service-stat-card">
          <div className={`service-stat-value ${color}`}>{value}</div>
          <div className="service-stat-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Quick actions ─────────────────────────────────────────────────────────────
function QuickActionsCard({ showToast, onOpenClientRequests, onOpenRequestService }) {
  const actions = [
    { icon: <ClientRequestIcon />, label: "Check Client Requests", onClick: onOpenClientRequests },
    { icon: <AddServiceIcon />, label: "Request New Service", onClick: onOpenRequestService },
  ];

  return (
    <div className="quick-actions-panel">
      <div className="quick-actions-title">Quick Actions</div>
      <div className="quick-actions-list">
        {actions.map(({ icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="quick-action-btn"
            onMouseEnter={e => e.currentTarget.style.background = "rgba(35,29,26,0.6)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Availability hint */}
      <div className="quick-actions-tip">
        <div className="quick-actions-tip-label">Tip</div>
        <p className="quick-actions-tip-text">
          Toggle a service off to hide it from client booking. Changes take effect immediately.
        </p>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <div className={`service-toast ${toast.show ? "show" : "hidden"}`}>
      {toast.msg}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function StaffServices() {
  const [services, setServices] = useState(initialServices);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isClientRequestsOpen, setIsClientRequestsOpen] = useState(false);
  const [isRequestServiceOpen, setIsRequestServiceOpen] = useState(false);
  const { toast, show: showToast } = useToast();

  const toggle = (id) => {
    setServices(prev => {
      const updated = {};
      for (const [cat, list] of Object.entries(prev)) {
        updated[cat] = list.map(s => s.id === id ? { ...s, available: !s.available } : s);
      }
      return updated;
    });
  };

  return (
    <div className="dash-root">
      <Nav showToast={showToast} />

      <main className="dash-main">
        {/* Page header */}
        <div className="dash-page-header">
          <div className="dash-page-title-block">
            <h1 className="dash-page-title">Hi, Mike! 👋</h1>
            <p className="dash-page-subtitle">Manage your service availability</p>
          </div>
          <div className="service-header-actions">
            {[
              { icon: <BreakIcon />, label: "Take Break" },
              { icon: <ClockOutIcon />, label: "Clock Out" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                onClick={() => showToast(`${label} clicked`)}
                className="service-action-btn"
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary bar */}
        <div className="dash-stats-row">
          {[
            { value: (() => Object.values(services).flat().filter(s => s.available).length)(), label: "Available now", color: "service-stat-value-green" },
            { value: (() => Object.values(services).flat().filter(s => !s.available).length)(), label: "Unavailable", color: "service-stat-value-red" },
            { value: `${Math.round((Object.values(services).flat().filter(s => s.available).length / Object.values(services).flat().length) * 100)}%`, label: "Availability rate", color: "service-stat-value-amber" },
            { value: Object.values(services).flat().length, label: "Total services", color: "" },
          ].map(({ value, label, color }) => (
            <div key={label} className="dash-stat-card">
              <p className={`dash-stat-value ${color}`}>{value}</p>
              <p className="dash-stat-label">{label}</p>
            </div>
          ))}
        </div>

        {/* Two-column grid */}
        <div className="dash-content-grid">
          {/* Left — services list */}
          <div className="service-list-panel">
            <div className="service-list-panel-header">
              <h3 className="service-list-panel-title">Services</h3>
              <button
                className="service-list-panel-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            </div>
            <div className={isExpanded ? "service-list-scroll" : "service-list-scroll-limited"}>
              {Object.entries(services).map(([cat, list]) => (
                <ServiceSection
                  key={cat}
                  category={cat}
                  label={categoryMeta[cat]?.label || cat}
                  services={list}
                  onToggle={toggle}
                  showToast={showToast}
                />
              ))}
            </div>
          </div>

          {/* Right — quick actions sidebar */}
          <div className="dash-sidebar">
            <QuickActionsCard 
              showToast={showToast}
              onOpenClientRequests={() => setIsClientRequestsOpen(true)}
              onOpenRequestService={() => setIsRequestServiceOpen(true)}
            />
          </div>
        </div>
      </main>

      <ClientRequestsModal 
        isOpen={isClientRequestsOpen}
        onClose={() => setIsClientRequestsOpen(false)}
      />

      <RequestNewServiceModal 
        isOpen={isRequestServiceOpen}
        onClose={() => setIsRequestServiceOpen(false)}
        showToast={showToast}
        systemServices={services}
      />

      <Toast toast={toast} />
    </div>
  );
}