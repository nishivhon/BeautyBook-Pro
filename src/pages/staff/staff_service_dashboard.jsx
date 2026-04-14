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

// Service category icons (matching booking modal)
const HaircutSvcIcon = ({ available }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    {/* pivot ring top */}
    <circle cx="6" cy="7"  r="3.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.8" fill="none"/>
    {/* pivot ring bottom */}
    <circle cx="6" cy="17" r="3.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.8" fill="none"/>
    {/* blade 1 */}
    <path d="M9 5.5 L22 12"  stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.8" strokeLinecap="round"/>
    {/* blade 2 */}
    <path d="M9 18.5 L22 12" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.8" strokeLinecap="round"/>
    {/* inner pivot dots */}
    <circle cx="6" cy="7"  r="1.4" fill={available ? "#1a0f00" : "#888"}/>
    <circle cx="6" cy="17" r="1.4" fill={available ? "#1a0f00" : "#888"}/>
  </svg>
);
const NailIcon = ({ available }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    {/* bottle body */}
    <rect x="7.5" y="10" width="9" height="11" rx="2.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.8" fill="none"/>
    {/* neck */}
    <rect x="9.5" y="6" width="5" height="4.5" rx="0.8" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.6" fill="none"/>
    {/* cap */}
    <rect x="8.5" y="3" width="7" height="3.5" rx="1.8" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.5" fill="none" />
    <rect x="8.5" y="3" width="7" height="3.5" rx="1.8" fill={available ? "#1a0f00" : "#888"} fillOpacity="0.25"/>
    {/* shine line on body */}
    <line x1="10.5" y1="12" x2="10.5" y2="19.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.1" strokeLinecap="round" opacity="0.45"/>
  </svg>
);
const SkinIcon = ({ available }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    {/* face circle */}
    <circle cx="12" cy="13.5" r="7.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.8" fill="none"/>
    {/* eyes */}
    <circle cx="9.5"  cy="12" r="1.1" fill={available ? "#1a0f00" : "#888"}/>
    <circle cx="14.5" cy="12" r="1.1" fill={available ? "#1a0f00" : "#888"}/>
    {/* smile */}
    <path d="M9.5 16.5 Q12 18.5 14.5 16.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    {/* sparkles above — represents skincare glow */}
    <path d="M12 3.5v2" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M10.3 4.8l.9.9" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M13.7 4.8l-.9.9" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const MassageServiceIcon = ({ available }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    {/* person head */}
    <circle cx="18" cy="4.5" r="2.2" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.6" fill="none"/>
    {/* body lying on table */}
    <path
      d="M2 13.5 Q5 11 9 12 L14 11 Q17 10.5 20 12"
      stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.7" strokeLinecap="round" fill="none"
    />
    {/* table surface */}
    <line x1="1" y1="15.5" x2="23" y2="15.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.7" strokeLinecap="round"/>
    {/* table legs */}
    <line x1="4"  y1="15.5" x2="4"  y2="19.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="15.5" x2="20" y2="19.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.5" strokeLinecap="round"/>
    {/* relaxation waves above */}
    <path d="M5 8 Q6.5 6 8 8 Q9.5 10 11 8"  stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M8 5.5 Q9.5 3.5 11 5.5 Q12.5 7.5 14 5.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>
);
const PremiumIcon = ({ available }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={20}>
    {/* diamond outline */}
    <path
      d="M12 20.5L2.5 9.5H21.5L12 20.5Z"
      stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.7" strokeLinejoin="round" fill="none"
    />
    {/* top facet triangle */}
    <path
      d="M2.5 9.5L7 3.5H17L21.5 9.5"
      stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.7" strokeLinejoin="round" fill="none"
    />
    {/* centre divider line */}
    <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="1.3"/>
    {/* inner facet lines */}
    <path d="M7 3.5L9.5 9.5L12 20.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="0.9" opacity="0.5"/>
    <path d="M17 3.5L14.5 9.5L12 20.5" stroke={available ? "#1a0f00" : "#888"} strokeWidth="0.9" opacity="0.5"/>
  </svg>
);

// Services icon map
const categoryIconMap = {
  haircut:  HaircutSvcIcon,
  nails:    NailIcon,
  skincare: SkinIcon,
  massage:  MassageServiceIcon,
  premium:  PremiumIcon,
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

const CloseDialogIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 20h20L12 2z" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill="#d97706"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
function ServiceItem({ service, category, onToggle, showToast, onRequestConfirmation, onRequestRemove }) {
  const IconComp = categoryIconMap[category] || HaircutSvcIcon;
  
  const handleToggle = () => {
    // If service is available and being turned off, show confirmation
    if (service.available) {
      onRequestConfirmation(service);
    } else {
      // If already unavailable, just toggle back to available
      onToggle(service.id);
      showToast(`${service.name} now available`);
    }
  };

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

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Remove button */}
        <button
          onClick={() => onRequestRemove(service)}
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "6px",
            padding: "6px 8px",
            cursor: "pointer",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
          }}
          title="Remove service"
        >
          <TrashIcon />
        </button>

        {/* Toggle */}
        <Toggle
          checked={service.available}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
}

// ── Service section ───────────────────────────────────────────────────────────
function ServiceSection({ category, label, services, onToggle, showToast, onRequestConfirmation, onRequestRemove }) {
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
          onRequestConfirmation={onRequestConfirmation}
          onRequestRemove={onRequestRemove}
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

// ── Confirmation Dialog ────────────────────────────────────────────────────────
function ConfirmUnavailableServiceDialog({ isOpen, service, onConfirm, onCancel }) {
  if (!isOpen || !service) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: "#231d1a",
        borderRadius: "12px",
        padding: "32px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 20px 55px rgba(0, 0, 0, 0.6)",
        border: "1px solid rgba(152, 143, 129, 0.2)",
      }}>
        {/* Close button */}
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#988f81",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloseDialogIcon />
        </button>

        {/* Icon and title */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "24px",
        }}>
          <div style={{ marginBottom: "16px" }}>
            <WarningIcon />
          </div>
          <h2 style={{
            color: "#f5f5f5",
            fontSize: "18px",
            fontWeight: "600",
            margin: "0 0 8px 0",
            textAlign: "center",
          }}>
            Mark "{service?.name}" as Unavailable?
          </h2>
        </div>

        {/* Message */}
        <p style={{
          color: "#c7b8ad",
          fontSize: "14px",
          lineHeight: "1.6",
          margin: "0 0 24px 0",
          textAlign: "center",
        }}>
          This service will be hidden from client bookings. Your admin will be notified of this change. You can mark it available again anytime.
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(152, 143, 129, 0.3)",
              backgroundColor: "transparent",
              color: "#c7b8ad",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.target.backgroundColor = "rgba(152, 143, 129, 0.1)";
              e.target.style.borderColor = "rgba(152, 143, 129, 0.5)";
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(152, 143, 129, 0.3)";
            }}
          >
            Keep Available
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#d97706",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.target.style.backgroundColor = "#c86b00"}
            onMouseLeave={e => e.target.style.backgroundColor = "#d97706"}
          >
            Make Unavailable
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Remove Service Dialog ──────────────────────────────────────────────────────
function ConfirmRemoveServiceDialog({ isOpen, service, onConfirm, onCancel }) {
  if (!isOpen || !service) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
    }}>
      <div style={{
        backgroundColor: "#231d1a",
        borderRadius: "12px",
        padding: "32px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 20px 55px rgba(0, 0, 0, 0.6)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      }}>
        {/* Close button */}
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#988f81",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloseDialogIcon />
        </button>

        {/* Icon and title */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "24px",
        }}>
          <div style={{ marginBottom: "16px", color: "#ef4444" }}>
            <TrashIcon />
          </div>
          <h2 style={{
            color: "#f5f5f5",
            fontSize: "18px",
            fontWeight: "600",
            margin: "0 0 8px 0",
            textAlign: "center",
          }}>
            Remove "{service?.name}"?
          </h2>
        </div>

        {/* Message */}
        <p style={{
          color: "#c7b8ad",
          fontSize: "14px",
          lineHeight: "1.6",
          margin: "0 0 24px 0",
          textAlign: "center",
        }}>
          This service will be permanently removed from your service list. Your admin will be notified of this removal. This action cannot be undone.
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(152, 143, 129, 0.3)",
              backgroundColor: "transparent",
              color: "#c7b8ad",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.target.backgroundColor = "rgba(152, 143, 129, 0.1)";
              e.target.style.borderColor = "rgba(152, 143, 129, 0.5)";
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(152, 143, 129, 0.3)";
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.target.style.backgroundColor = "#dc2626"}
            onMouseLeave={e => e.target.style.backgroundColor = "#ef4444"}
          >
            Remove Service
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function StaffServices() {
  const [services, setServices] = useState(initialServices);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isClientRequestsOpen, setIsClientRequestsOpen] = useState(false);
  const [isRequestServiceOpen, setIsRequestServiceOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, service: null });
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState({ isOpen: false, service: null });
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

  const remove = (id) => {
    setServices(prev => {
      const updated = {};
      for (const [cat, list] of Object.entries(prev)) {
        updated[cat] = list.filter(s => s.id !== id);
      }
      return updated;
    });
  };

  const handleToggleClick = (service) => {
    setConfirmDialog({ isOpen: true, service });
  };

  const handleRemoveClick = (service) => {
    setConfirmRemoveDialog({ isOpen: true, service });
  };

  const handleConfirmUnavailable = () => {
    if (confirmDialog.service) {
      toggle(confirmDialog.service.id);
      showToast(`${confirmDialog.service.name} marked as unavailable. Admin notified.`);
      setConfirmDialog({ isOpen: false, service: null });
    }
  };

  const handleCancelUnavailable = () => {
    setConfirmDialog({ isOpen: false, service: null });
  };

  const handleConfirmRemove = () => {
    if (confirmRemoveDialog.service) {
      remove(confirmRemoveDialog.service.id);
      showToast(`${confirmRemoveDialog.service.name} removed. Admin notified.`);
      setConfirmRemoveDialog({ isOpen: false, service: null });
    }
  };

  const handleCancelRemove = () => {
    setConfirmRemoveDialog({ isOpen: false, service: null });
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
                  onRequestConfirmation={handleToggleClick}
                  onRequestRemove={handleRemoveClick}
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

      <ConfirmUnavailableServiceDialog
        isOpen={confirmDialog.isOpen}
        service={confirmDialog.service}
        onConfirm={handleConfirmUnavailable}
        onCancel={handleCancelUnavailable}
      />

      <ConfirmRemoveServiceDialog
        isOpen={confirmRemoveDialog.isOpen}
        service={confirmRemoveDialog.service}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />

      <Toast toast={toast} />
    </div>
  );
}