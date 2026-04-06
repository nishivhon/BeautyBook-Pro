import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { HowItWorksStepEditModal } from "../../components/modal/howitworks_step_edit";

// ─── Logo Mark SVG ───────────────────────────────────────────────────────────
const LogoMark = () => (
  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:22,height:22}}>
    <circle cx="6"  cy="21" r="4" stroke="black" strokeWidth="2" fill="none"/>
    <circle cx="6"  cy="9"  r="4" stroke="black" strokeWidth="2" fill="none"/>
    <path d="M10 18.5 L28 7"  stroke="black" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 11.5 L28 23" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="6"  cy="21" r="1.6" fill="black"/>
    <circle cx="6"  cy="9"  r="1.6" fill="black"/>
  </svg>
);

// ─── Icon Sets from Real Landing Page ───────────────────────────────────────

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect x="2" y="4" width="20" height="18" rx="2" stroke="black" strokeWidth="1.8" fill="none"/>
    <line x1="2" y1="10" x2="22" y2="10" stroke="black" strokeWidth="1.8"/>
    <path d="M8 2v4M16 2v4" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="7"  cy="14.5" r="1" fill="black"/>
    <circle cx="12" cy="14.5" r="1" fill="black"/>
    <circle cx="17" cy="14.5" r="1" fill="black"/>
    <circle cx="7"  cy="19"   r="1" fill="black"/>
    <circle cx="12" cy="19"   r="1" fill="black"/>
  </svg>
);

const BellNotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <path d="M5 15V10a7 7 0 0 1 14 0v5l2 2H3l2-2z" stroke="black" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
    <path d="M10 19a2 2 0 0 0 4 0" stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="17.5" cy="6.5" r="4" fill="#dd901d"/>
    <path d="M15.8 6.5l1.2 1.2 2-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.8" fill="none"/>
    <path d="M7.5 12l3 3.5 6-7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckItem = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:15,height:15,flexShrink:0}}>
    <circle cx="8" cy="8" r="7.2" stroke="#dd901d" strokeWidth="1.3" fill="none"/>
    <path d="M5 8l2.2 2.2L11 5.5" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── How It Works Icons ───────────────────────────────────────────────────────

const HowItWorksCalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect x="2" y="4" width="20" height="18" rx="2" stroke="black" strokeWidth="1.8" fill="none"/>
    <line x1="2" y1="10" x2="22" y2="10" stroke="black" strokeWidth="1.8"/>
    <path d="M8 2v4M16 2v4" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="7"  cy="14.5" r="1" fill="black"/>
    <circle cx="12" cy="14.5" r="1" fill="black"/>
    <circle cx="17" cy="14.5" r="1" fill="black"/>
    <circle cx="7"  cy="19"   r="1" fill="black"/>
    <circle cx="12" cy="19"   r="1" fill="black"/>
  </svg>
);

const HowItWorksBellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <path d="M5 15V10a7 7 0 0 1 14 0v5l2 2H3l2-2z" stroke="black" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
    <path d="M10 19a2 2 0 0 0 4 0" stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="17.5" cy="6.5" r="4" fill="#dd901d"/>
    <path d="M15.8 6.5l1.2 1.2 2-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HowItWorksCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.8" fill="none"/>
    <path d="M7.5 12l3 3.5 6-7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Services Icons ───────────────────────────────────────────────────────────

const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="5.5" cy="6.5" r="3" stroke="black" strokeWidth="1.6" fill="none"/>
    <circle cx="5.5" cy="17.5" r="3" stroke="black" strokeWidth="1.6" fill="none"/>
    <path d="M8 5 L21 12" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M8 19 L21 12" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="14.5" cy="10.5" r="0.8" fill="black"/>
    <circle cx="14.5" cy="13.5" r="0.8" fill="black"/>
  </svg>
);

const NailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect x="8" y="10" width="8" height="11" rx="2" stroke="black" strokeWidth="1.7" fill="none"/>
    <rect x="10" y="6" width="4" height="4" rx="0.5" stroke="black" strokeWidth="1.5" fill="none"/>
    <rect x="9" y="3" width="6" height="3.5" rx="1.5" stroke="black" strokeWidth="1.5" fill="black" fillOpacity="0.15"/>
    <line x1="11" y1="12" x2="11" y2="19" stroke="black" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const SkinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="12" cy="12" r="9.5" stroke="black" strokeWidth="1.7" fill="none"/>
    <circle cx="9"  cy="10" r="1.2" fill="black"/>
    <circle cx="15" cy="10" r="1.2" fill="black"/>
    <path d="M8.5 14.5 Q12 18 15.5 14.5" stroke="black" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
  </svg>
);

const MassageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="18" cy="5" r="2.2" stroke="black" strokeWidth="1.5" fill="none"/>
    <path d="M2 14 Q5 11 9 12 L14 11 Q17 10.5 20 12" stroke="black" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    <line x1="1" y1="16" x2="23" y2="16" stroke="black" strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="4"  y1="16" x2="4"  y2="20" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="16" x2="20" y2="20" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 8 Q6.5 6 8 8 Q9.5 10 11 8" stroke="black" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M8 5.5 Q9.5 3.5 11 5.5 Q12.5 7.5 14 5.5" stroke="black" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <path d="M12 2.5 L14.6 9.2 H21.8 L15.9 13.4 L18.2 20.2 L12 16.1 L5.8 20.2 L8.1 13.4 L2.2 9.2 H9.4 Z" stroke="black" strokeWidth="1.7" fill="none" strokeLinejoin="round"/>
  </svg>
);

// ─── Preview and Save Icons ───────────────────────────────────────────────────

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:16,height:16}}>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M1 12c0 0 4-8 11-8s11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:16,height:16}}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 5 7 1 17 1 17 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LiveEditStarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:18,height:18,flexShrink:0}}>
    <path d="M12 2L15.09 10.26H24L17.55 15.36L20.64 23.61L12 18.5L3.36 23.61L6.45 15.36L0 10.26H8.91L12 2Z" fill="#dd901d"/>
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:16,height:16}}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// ─── EditableText Component ───────────────────────────────────────────────────

const EditableText = ({ value, onChange, isEditing, setIsEditing, className = "", isTextarea = false, size = "large" }) => {
  const [draft, setDraft] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  const fontSize = size === "body" ? "16px" : "48px";
  const fontWeight = size === "body" ? "normal" : "bold";
  const minHeight = size === "body" ? "40px" : "80px";

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (!isEditing) {
      setIsHovered(false);
    }
  }, [isEditing]);

  const commit = () => {
    onChange(draft);
    setIsEditing(false);
  };

  if (isEditing) {
    if (isTextarea) {
      return (
        <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "800px", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            fontSize: "16px",
            lineHeight: "1.6",
            textAlign: "center",
            marginBottom: "12px",
            display: "block",
            color: "white",
            whitespace: "pre-wrap",
            wordWrap: "break-word",
          }}>
            {draft}
          </div>
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.ctrlKey) {
                  e.preventDefault();
                  setDraft(draft + "\n");
                } else {
                  e.preventDefault();
                  commit();
                }
              } else if (e.key === "Escape") {
                e.preventDefault();
                setIsEditing(false);
              }
            }}
            style={{ fontSize: "16px", lineHeight: "1.6", fontFamily: "inherit", color: "#dd901d", overflow: "hidden", width: "100%", boxSizing: "border-box", textAlign: "center", backgroundColor: "rgba(221, 144, 29, 0.08)", borderRadius: "1rem", border: "1.5px solid #dd901d" }}
            className={`px-5 py-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#dd901d] transition-all duration-200 shadow-xl placeholder-gray-500 resize-none ${className}`}
            placeholder="Type to edit..."
          />
        </div>
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "800px", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          fontSize: fontSize,
          fontWeight: fontWeight,
          lineHeight: "1.2",
          textAlign: "center",
          marginBottom: "12px",
          display: "inline-block",
          color: "white",
        }}>
          {draft}
        </div>
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setIsEditing(false);
          }}
          style={{ fontSize: fontSize, fontWeight: fontWeight, lineHeight: "1.2", display: "block", width: "100%", boxSizing: "border-box", textAlign: "center", backgroundColor: "rgba(221, 144, 29, 0.08)", borderRadius: "1rem", border: "1.5px solid #dd901d", minHeight: minHeight }}
          className={`px-5 py-4 !text-[#dd901d] focus:outline-none focus:ring-2 focus:ring-[#dd901d] transition-all duration-200 shadow-xl placeholder-gray-500 ${className}`}
          placeholder="Type to edit..."
        />
      </div>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        opacity: isHovered ? 1 : 0.9,
        boxShadow: isHovered ? "0 0 12px rgba(221, 144, 29, 0.4)" : "none",
        borderRadius: "0.5rem",
        padding: "0 4px",
        display: "inline-block",
      }}
      className={className}
    >
      {value}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminLandingPageEditor() {
  const navigate = useNavigate();

  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [editingField, setEditingField] = useState(null);
  const [activeNav, setActiveNav] = useState("landing-page");
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hero, setHero] = useState({
    badge: "DIGITAL APPOINTMENT SYSTEM",
    headline1: "Skip The Wait,",
    headline2: "Book Your Style",
    subheading: "A digital appointment and customer management system for barbershops, hair salons, and spas. Book appointments online, reduce wait times, and experience seamless, personalized service—instantly.",
    ctaText: "Book Appointment",
  });

  const [howitworks, setHowitworks] = useState({
    title: "How BeautyBook Pro Works",
    subtitle: "Simple, efficient digital booking appointment for modern salon businesses",
  });

  const [services, setServices] = useState({
    title: "Our Services",
    subtitle: "Professional grooming services tailored to your style",
  });

  const [footer, setFooter] = useState({
    address: "Canvas city, Abc st., 245 lot B",
    phone: "(02) 123-4567",
    email: "beautybookpro@gmail.com",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
  });

  const [howitworksSteps, setHowitworksSteps] = useState([
    { id: 0, icon: "calendar", title: "Book Online", desc: "Select your service, preferred stylist, and convenient time slot" },
    { id: 1, icon: "bell", title: "Get Notified", desc: "Receive real-time updates and 'Your Turn Soon' alerts" },
    { id: 2, icon: "check", title: "Enjoy Service", desc: "Arrive on time and skip the traditional waiting queue" },
  ]);

  const [editingStepModal, setEditingStepModal] = useState(null);
  const [uploadedSvgs, setUploadedSvgs] = useState({
    calendar: "calendar",
    bell: "bell",
    check: "check",
  });

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (editingField === null) {
      setIsHovered(false);
    }
  }, [editingField]);

  const handleLogout = () => {
    logoutOperator();
    navigate("/login");
  };

  // Icon Components
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

  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
    { id: "user-accounts", label: "User Accounts", icon: UserIcon },
    { id: "database", label: "Database", icon: DatabaseIcon },
    { id: "security", label: "Security", icon: ShieldIcon },
    { id: "landing-page", label: "Landing Page", icon: GlobeIcon },
  ];

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="super-admin-container">
      {/* ── Sidebar ────────────────────────────────────────────────────────────── */}
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
              <LogoMark />
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
                  if (item.id === "dashboard") {
                    navigate("/superadmin/dashboard");
                  } else if (item.id === "user-accounts") {
                    navigate("/superadmin/users");
                  } else if (item.id === "database") {
                    navigate("/superadmin/database");
                  } else if (item.id === "security") {
                    navigate("/superadmin/security");
                  } else if (item.id === "landing-page") {
                    navigate("/superadmin/landing-page");
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

        {/* Logout */}
        {sidebarExpanded && (
          <div className="sidebar-logout-section">
            <button className="logout-button" onClick={handleLogout}>
              <LogOutIcon color="#988f81" />
              <span>Log Out</span>
            </button>
          </div>
        )}
        {!sidebarExpanded && (
          <div className="sidebar-logout-section">
            <button className="logout-button" onClick={handleLogout} title="Log Out">
              <LogOutIcon color="#988f81" />
            </button>
          </div>
        )}
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <div className="super-admin-main">
        {/* Header + Live Edit Mode Combined Section */}
        <div className={`dashboard-header-combined ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{ transition: "opacity 0.5s, transform 0.5s" }}
        >
          {/* Header Part */}
          <header className="dashboard-header-inner">
            <div className="flex justify-between items-start w-full">
              <div className="header-title-section">
                <h1 className="header-main-title">Customize Landing Page</h1>
                <p className="header-subtitle">
                  BeautyBook Pro • {dateStr}
                </p>
              </div>

              <div className="header-actions">
              <button className="dash-action-btn">
                <BellIcon />
              </button>
              <button className="dash-action-btn">
                <SettingsIcon />
              </button>
            </div>
            </div>
          </header>

          {/* Live Edit Mode Part */}
          <div className="live-edit-container">
            <div className="live-edit-content">
              <div className="live-edit-info">
                <LiveEditStarIcon />
                <span>Live Edit Mode — Click any text on the preview below to edit it inline.</span>
              </div>
              <div className="live-edit-actions">
                <button className="live-edit-btn-secondary">
                  <EyeIcon />
                  Preview
                </button>
                <button
                  onClick={() => alert("Changes saved!")}
                  className="live-edit-btn-primary"
                >
                  <SaveIcon />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Landing Page Preview */}
        <main className="dashboard-main" style={{transform: "scale(1.2)", transformOrigin: "top center", marginBottom: "300px"}}>
          {/* HERO SECTION */}
          <section id="home" className="hero-section" style={{paddingTop: "40px"}}>
            <div className="hero-badge">
              <span>{hero.badge}</span>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
              {editingField === "headline-combined" ? (
                <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "800px", margin: "0 auto", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                    textAlign: "center",
                    marginBottom: "12px",
                    display: "inline-block",
                  }}>
                    {(() => {
                      const fullText = `${hero.headline1}${hero.headline2}`;
                      const midpoint = Math.ceil(fullText.length / 2);
                      const firstHalf = fullText.substring(0, midpoint);
                      const secondHalf = fullText.substring(midpoint);
                      return (
                        <>
                          <span style={{ color: "white" }}>{firstHalf}</span>
                          <span style={{ color: "#dd901d" }}>{secondHalf}</span>
                        </>
                      );
                    })()}
                  </div>
                  <input
                    autoFocus
                    type="text"
                    value={`${hero.headline1}${hero.headline2}`}
                    onChange={(v) => {
                      const fullText = v.target.value;
                      const midpoint = Math.ceil(fullText.length / 2);
                      setHero({
                        ...hero,
                        headline1: fullText.substring(0, midpoint),
                        headline2: fullText.substring(midpoint),
                      });
                    }}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingField(null);
                      if (e.key === "Escape") setEditingField(null);
                    }}
                    style={{ fontSize: "48px", lineHeight: "1.2", display: "block", width: "100%", boxSizing: "border-box", textAlign: "center", backgroundColor: "rgba(221, 144, 29, 0.08)", borderRadius: "1rem", border: "1.5px solid #dd901d" }}
                    className="px-5 py-4 min-h-[80px] !text-[#dd901d] font-bold focus:outline-none focus:ring-2 focus:ring-[#dd901d] transition-all duration-200 shadow-xl placeholder-gray-500"
                    placeholder="Type to edit..."
                  />
                </div>
              ) : (
                <h1 className="hero-title">
                  <span
                    onClick={() => setEditingField("headline-combined")}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      opacity: isHovered ? 1 : 0.9,
                      boxShadow: isHovered ? "0 0 12px rgba(221, 144, 29, 0.4)" : "none",
                      borderRadius: "0.5rem",
                      padding: "0 4px",
                      display: "inline-block",
                    }}
                  >
                    {(() => {
                      const fullText = `${hero.headline1}${hero.headline2}`;
                      const midpoint = Math.ceil(fullText.length / 2);
                      const firstHalf = fullText.substring(0, midpoint);
                      const secondHalf = fullText.substring(midpoint);
                      return (
                        <>
                          <span style={{ color: "white" }}>{firstHalf}</span>
                          <span style={{ color: "#dd901d" }}>{secondHalf}</span>
                        </>
                      );
                    })()}
                  </span>
                </h1>
              )}
            </div>

            <p className="section-subtitle" style={{ width: "100%", display: "flex", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginBottom: "32px" }}>
              <EditableText
                value={hero.subheading}
                onChange={(v) => setHero({ ...hero, subheading: v })}
                isEditing={editingField === "subheading"}
                setIsEditing={(val) => setEditingField(val ? "subheading" : null)}
                isTextarea={true}
              />
            </p>

            <button className="btn-large" style={{width:"auto",padding:"10px 28px",height:"44px",fontSize:"0.9rem"}}>
              {hero.ctaText}
            </button>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section id="howitworks" className="howitworks-section">
            <h2 className="section-title">
              <EditableText
                value={howitworks.title}
                onChange={(v) => setHowitworks({ ...howitworks, title: v })}
                isEditing={editingField === "howitworks-title"}
                setIsEditing={(val) => setEditingField(val ? "howitworks-title" : null)}
              />
            </h2>
            <p className="section-subtitle">
              <EditableText
                value={howitworks.subtitle}
                onChange={(v) => setHowitworks({ ...howitworks, subtitle: v })}
                isEditing={editingField === "howitworks-subtitle"}
                setIsEditing={(val) => setEditingField(val ? "howitworks-subtitle" : null)}
                isTextarea={true}
              />
            </p>

            <div style={{
              display:"grid",gridTemplateColumns:"repeat(3,1fr)",
              gap:24,maxWidth:800,margin:"0 auto",
            }}>
              {howitworksSteps.map((step, i) => {
                const iconMap = {
                  calendar: <HowItWorksCalendarIcon/>,
                  bell: <HowItWorksBellIcon/>,
                  check: <HowItWorksCheckIcon/>,
                };
                
                // Check if it's an uploaded SVG
                const isUploadedSvg = step.icon.startsWith("svg_");
                const iconContent = isUploadedSvg ? (
                  <img
                    src={uploadedSvgs[step.icon]}
                    alt="Custom icon"
                    style={{width: "100%", height: "100%", objectFit: "contain"}}
                  />
                ) : (
                  iconMap[step.icon]
                );
                
                return (
                  <div key={i} className="step-card" style={{position:"relative"}}>
                    <button
                      onClick={() => setEditingStepModal(step.id)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "#dd901d",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#c97c1c"}
                      onMouseLeave={(e) => e.target.style.background = "#dd901d"}
                      title="Edit step"
                    >
                      <PencilIcon />
                    </button>
                    <div className="icon-box">{iconContent}</div>
                    <div className="step-title">{step.title}</div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                );
              })}
            </div>


          </section>

          {/* SERVICES SECTION */}
          <section id="services" className="services-section">
            <h2 className="section-title">
              <EditableText
                value={services.title}
                onChange={(v) => setServices({ ...services, title: v })}
                isEditing={editingField === "services-title"}
                setIsEditing={(val) => setEditingField(val ? "services-title" : null)}
              />
            </h2>
            <p className="section-subtitle">
              <EditableText
                value={services.subtitle}
                onChange={(v) => setServices({ ...services, subtitle: v })}
                isEditing={editingField === "services-subtitle"}
                setIsEditing={(val) => setEditingField(val ? "services-subtitle" : null)}
                isTextarea={true}
              />
            </p>
            
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:800,margin:"0 auto"}}>
              {[
                { icon: <ScissorsIcon/>, title: "Hair Services", items: ["Haircut & Style", "Color Treatment", "Hair Spa", "Keratin Treatment"] },
                { icon: <NailIcon/>, title: "Nail Services", items: ["Manicure", "Pedicure", "Nail Art", "Gel Extension"] },
                { icon: <SkinIcon/>, title: "Skin Care Services", items: ["Facial Treatment", "Chemical Peel", "Microdermabrasion", "Hydration Therapy"] },
                { icon: <MassageIcon/>, title: "Massage Services", items: ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Massage", "Spa Reflexology"] },
                { icon: <StarIcon/>, title: "Premium Services", items: ["Bridal Package", "Couple's Massage", "Hair & Glow Combo", "VIP Lounge Experience"] },
              ].map((svc, i) => (
                <div key={i} className="service-card">
                  <div style={{
                    width:50,height:50,background:"#dd901d",
                    borderRadius:14,padding:10,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    marginBottom:16,
                  }}>{svc.icon}</div>
                  <div className="service-title">{svc.title}</div>
                  <div className="service-items">
                    {svc.items.map((item, j) => (
                      <div key={j} className="service-item">
                        <CheckItem/>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER SECTION */}
          <footer id="about" className="footer">
            <div style={{maxWidth:860,margin:"0 auto"}}>
              <div className="footer-row">
                <span className="footer-label">Contact us</span>
                <span className="footer-text">
                  <EditableText
                    value={footer.address}
                    onChange={(v) => setFooter({ ...footer, address: v })}
                    isEditing={editingField === "footer-address"}
                    setIsEditing={(val) => setEditingField(val ? "footer-address" : null)}
                    size="body"
                  />
                </span>
                <span className="footer-text">
                  <EditableText
                    value={footer.phone}
                    onChange={(v) => setFooter({ ...footer, phone: v })}
                    isEditing={editingField === "footer-phone"}
                    setIsEditing={(val) => setEditingField(val ? "footer-phone" : null)}
                    size="body"
                  />
                </span>
                <span className="footer-text">
                  <EditableText
                    value={footer.email}
                    onChange={(v) => setFooter({ ...footer, email: v })}
                    isEditing={editingField === "footer-email"}
                    setIsEditing={(val) => setEditingField(val ? "footer-email" : null)}
                    size="body"
                  />
                </span>
                <span className="footer-text">
                  <EditableText
                    value={footer.hours}
                    onChange={(v) => setFooter({ ...footer, hours: v })}
                    isEditing={editingField === "footer-hours"}
                    setIsEditing={(val) => setEditingField(val ? "footer-hours" : null)}
                    size="body"
                  />
                </span>
              </div>

              <div className="footer-row">
                <span className="footer-label">Follow us</span>
                {[
                  <svg key="fb" viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                      stroke="white" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
                  </svg>,
                  <svg key="ig" viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.6" fill="none"/>
                    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6" fill="none"/>
                    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                  </svg>,
                ].map((ic,i) => (
                  <div key={i} className="social-icon">{ic}</div>
                ))}
              </div>

              <div className="footer-divider">
                <p className="copyright">
                  © 2025 BeautyBook Pro. All rights reserved. |Polytechnic University of the Philippines Institute of Technology
                </p>
              </div>
            </div>
          </footer>
        </main>

        {/* How It Works Step Edit Modal - Outside transformed container */}
        <HowItWorksStepEditModal
          isOpen={editingStepModal !== null}
          stepId={editingStepModal}
          howitworksSteps={howitworksSteps}
          setHowitworksSteps={setHowitworksSteps}
          uploadedSvgs={uploadedSvgs}
          setUploadedSvgs={setUploadedSvgs}
          onClose={() => setEditingStepModal(null)}
        />
      </div>
    </div>
  );
}
