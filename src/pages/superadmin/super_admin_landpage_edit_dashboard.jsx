import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { HowItWorksStepEditModal } from "../../components/modal/superadmin/howitworks_step_edit";
import { ServiceEditModal } from "../../components/modal/superadmin/service_edit";
import { FooterEditModal } from "../../components/modal/superadmin/footer_edit";
import AddCardModal from "../../components/modal/superadmin/AddCardModal";
import NavigateSectionsModal from "../../components/modal/superadmin/NavigateSectionsModal";
import AddSectionModal from "../../components/modal/superadmin/AddSectionModal";
import AddSubheadingModal from "../../components/modal/superadmin/AddSubheadingModal";
import AddTitleModal from "../../components/modal/superadmin/AddTitleModal";

// ─── Logo Mark SVG ───────────────────────────────────────────────────────────
const LogoMark = () => (
  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-22">
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
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
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
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <path d="M5 15V10a7 7 0 0 1 14 0v5l2 2H3l2-2z" stroke="black" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
    <path d="M10 19a2 2 0 0 0 4 0" stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="17.5" cy="6.5" r="4" fill="#dd901d"/>
    <path d="M15.8 6.5l1.2 1.2 2-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.8" fill="none"/>
    <path d="M7.5 12l3 3.5 6-7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckItem = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-15">
    <circle cx="8" cy="8" r="7.2" stroke="#dd901d" strokeWidth="1.3" fill="none"/>
    <path d="M5 8l2.2 2.2L11 5.5" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── How It Works Icons ───────────────────────────────────────────────────────

const HowItWorksCalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
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
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <path d="M5 15V10a7 7 0 0 1 14 0v5l2 2H3l2-2z" stroke="black" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
    <path d="M10 19a2 2 0 0 0 4 0" stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="17.5" cy="6.5" r="4" fill="#dd901d"/>
    <path d="M15.8 6.5l1.2 1.2 2-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HowItWorksCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.8" fill="none"/>
    <path d="M7.5 12l3 3.5 6-7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Services Icons ───────────────────────────────────────────────────────────

const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <circle cx="5.5" cy="6.5" r="3" stroke="black" strokeWidth="1.6" fill="none"/>
    <circle cx="5.5" cy="17.5" r="3" stroke="black" strokeWidth="1.6" fill="none"/>
    <path d="M8 5 L21 12" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M8 19 L21 12" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="14.5" cy="10.5" r="0.8" fill="black"/>
    <circle cx="14.5" cy="13.5" r="0.8" fill="black"/>
  </svg>
);

const NailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <rect x="8" y="10" width="8" height="11" rx="2" stroke="black" strokeWidth="1.7" fill="none"/>
    <rect x="10" y="6" width="4" height="4" rx="0.5" stroke="black" strokeWidth="1.5" fill="none"/>
    <rect x="9" y="3" width="6" height="3.5" rx="1.5" stroke="black" strokeWidth="1.5" fill="black" fillOpacity="0.15"/>
    <line x1="11" y1="12" x2="11" y2="19" stroke="black" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const SkinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <circle cx="12" cy="12" r="9.5" stroke="black" strokeWidth="1.7" fill="none"/>
    <circle cx="9"  cy="10" r="1.2" fill="black"/>
    <circle cx="15" cy="10" r="1.2" fill="black"/>
    <path d="M8.5 14.5 Q12 18 15.5 14.5" stroke="black" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
  </svg>
);

const MassageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
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
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-full">
    <path d="M12 2.5 L14.6 9.2 H21.8 L15.9 13.4 L18.2 20.2 L12 16.1 L5.8 20.2 L8.1 13.4 L2.2 9.2 H9.4 Z" stroke="black" strokeWidth="1.7" fill="none" strokeLinejoin="round"/>
  </svg>
);

// ─── Preview and Save Icons ───────────────────────────────────────────────────

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M1 12c0 0 4-8 11-8s11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 5 7 1 17 1 17 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LiveEditStarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-18">
    <path d="M12 2L15.09 10.26H24L17.55 15.36L20.64 23.61L12 18.5L3.36 23.61L6.45 15.36L0 10.26H8.91L12 2Z" fill="#dd901d"/>
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const ToolsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M3 3h8v8H3V3M13 3h8v8h-8V3M3 13h8v8H3v-8M13 13h8v8h-8v-8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M7 16.5L12 12l5 4.5M7 7.5L12 12l5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UpArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M5 15l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16">
    <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-16" width="20" height="20">
    <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <div className="editable-text-container">
          <div className="editable-text-preview">
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
            className={`editable-text-textarea px-5 py-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#dd901d] transition-all duration-200 shadow-xl placeholder-gray-500 resize-none ${className}`}
            placeholder="Type to edit..."
          />
        </div>
      );
    }

    return (
      <div className="editable-text-container">
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
          style={{ fontSize: fontSize, fontWeight: fontWeight, lineHeight: "1.2", minHeight: minHeight }}
          className={`editable-text-input px-5 py-4 !text-[#dd901d] focus:outline-none focus:ring-2 focus:ring-[#dd901d] transition-all duration-200 shadow-xl placeholder-gray-500 ${className}`}
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
      className={`editable-text-span ${className}`}
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
    buttons: [],
    additionalSubheadings: [],
    additionalTitles: [],
  });

  const [howitworks, setHowitworks] = useState({
    title: "How BeautyBook Pro Works",
    subtitle: "Simple, efficient digital booking appointment for modern salon businesses",
    buttons: [],
    additionalSubheadings: [],
    additionalTitles: [],
  });

  const [services, setServices] = useState({
    title: "Our Services",
    subtitle: "Professional grooming services tailored to your style",
    buttons: [],
    additionalSubheadings: [],
    additionalTitles: [],
  });

  const [footer, setFooter] = useState({
    address: "Canvas city, Abc st., 245 lot B",
    phone: "(02) 123-4567",
    email: "beautybookpro@gmail.com",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    socialLinks: [],
    additionalSubheadings: [],
    additionalTitles: [],
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
  const [servicesData, setServicesData] = useState([
    { icon: <ScissorsIcon/>, title: "Hair Services", items: ["Haircut & Style", "Color Treatment", "Hair Spa", "Keratin Treatment"] },
    { icon: <NailIcon/>, title: "Nail Services", items: ["Manicure", "Pedicure", "Nail Art", "Gel Extension"] },
    { icon: <SkinIcon/>, title: "Skin Care Services", items: ["Facial Treatment", "Chemical Peel", "Microdermabrasion", "Hydration Therapy"] },
    { icon: <MassageIcon/>, title: "Massage Services", items: ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Massage", "Spa Reflexology"] },
    { icon: <StarIcon/>, title: "Premium Services", items: ["Bridal Package", "Couple's Massage", "Hair & Glow Combo", "VIP Lounge Experience"] },
  ]);
  const [editingServiceIndex, setEditingServiceIndex] = useState(null);
  const [editingFooterModal, setEditingFooterModal] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [addCardModal, setAddCardModal] = useState(false);
  const [cardConfig, setCardConfig] = useState({ section: "howitworks", title: "New Card", description: "", items: [] });
  const [navigateSectionsOpen, setNavigateSectionsOpen] = useState(false);
  const [sectionOrder, setSectionOrder] = useState(["hero", "howitworks", "services", "footer"]);
  const [hiddenSections, setHiddenSections] = useState({});
  const [addSectionModal, setAddSectionModal] = useState(false);
  const [draftSection, setDraftSection] = useState({ title: "New Section", subtitle: "" });
  const [customSections, setCustomSections] = useState([]);
  const [addSubheadingModal, setAddSubheadingModal] = useState(false);
  const [addTitleModal, setAddTitleModal] = useState(false);

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
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                    className="live-edit-btn-secondary"
                    title="Tools and options"
                  >
                    <ToolsIcon />
                    Tools
                  </button>

                  {/* Dropdown Menu */}
                  {toolsMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        marginTop: "8px",
                        background: "#1a1a1a",
                        border: "1.5px solid #dd901d",
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                        minWidth: "220px",
                        zIndex: 1000,
                      }}
                    >
                      <button
                        onClick={() => {
                          setAddCardModal(true);
                          setToolsMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "transparent",
                          border: "none",
                          color: "white",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          transition: "all 0.2s ease",
                          borderBottom: "1px solid rgba(221, 144, 29, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(221, 144, 29, 0.1)";
                          e.currentTarget.style.color = "#dd901d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "white";
                        }}
                      >
                        <PlusIcon />
                        Add Cards
                      </button>
                      <button
                        onClick={() => {
                          setAddSectionModal(true);
                          setToolsMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "transparent",
                          border: "none",
                          color: "white",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          transition: "all 0.2s ease",
                          borderBottom: "1px solid rgba(221, 144, 29, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(221, 144, 29, 0.1)";
                          e.currentTarget.style.color = "#dd901d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "white";
                        }}
                      >
                        <PlusIcon />
                        Add Section
                      </button>
                      <button
                        onClick={() => {
                          setAddSubheadingModal(true);
                          setToolsMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "transparent",
                          border: "none",
                          color: "white",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          transition: "all 0.2s ease",
                          borderBottom: "1px solid rgba(221, 144, 29, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(221, 144, 29, 0.1)";
                          e.currentTarget.style.color = "#dd901d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "white";
                        }}
                      >
                        <PlusIcon />
                        Add Subheading
                      </button>
                      <button
                        onClick={() => {
                          setAddTitleModal(true);
                          setToolsMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "transparent",
                          border: "none",
                          color: "white",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          transition: "all 0.2s ease",
                          borderBottom: "1px solid rgba(221, 144, 29, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(221, 144, 29, 0.1)";
                          e.currentTarget.style.color = "#dd901d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "white";
                        }}
                      >
                        <PlusIcon />
                        Add Title
                      </button>
                      <button
                        onClick={() => {
                          setNavigateSectionsOpen(true);
                          setToolsMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "rgba(221, 144, 29, 0.15)",
                          border: "1px solid rgba(221, 144, 29, 0.4)",
                          color: "#dd901d",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          transition: "all 0.2s ease",
                          fontWeight: "500",
                          borderRadius: "0 0 6px 6px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(221, 144, 29, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(221, 144, 29, 0.15)";
                        }}
                      >
                        <ArrowsIcon />
                        Navigate Sections
                      </button>
                    </div>
                  )}
                </div>
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
        <main className="dashboard-main" style={{transform: "scale(1.2)", transformOrigin: "top center", marginBottom: "300px", display: "flex", flexDirection: "column"}}>
          {/* HERO SECTION */}
          <section id="home" className="hero-section" style={{paddingTop: "40px", display: hiddenSections.hero ? "none" : "block", order: sectionOrder.indexOf("hero")}}>
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

            {/* Additional Titles */}
            {hero.additionalTitles && hero.additionalTitles.length > 0 && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginBottom: "24px", gap: "16px" }}>
                {hero.additionalTitles.map((title) => (
                  <div key={title.id} style={{ position: "relative" }}>
                    <h2 className="section-title">{title.text}</h2>
                    <button
                      onClick={() => {
                        setHero({
                          ...hero,
                          additionalTitles: hero.additionalTitles.filter(t => t.id !== title.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "0",
                        background: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "12px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                      onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                      title="Delete title"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Subheadings */}
            {hero.additionalSubheadings && hero.additionalSubheadings.length > 0 && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginBottom: "32px", gap: "16px" }}>
                {hero.additionalSubheadings.map((sub) => (
                  <div key={sub.id} style={{ position: "relative" }}>
                    <p className="section-subtitle">{sub.text}</p>
                    <button
                      onClick={() => {
                        setHero({
                          ...hero,
                          additionalSubheadings: hero.additionalSubheadings.filter(s => s.id !== sub.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        background: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "12px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                      onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                      title="Delete subheading"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", marginBottom: "0" }}>
              <button 
                className="btn-large" 
                style={{width:"auto",padding:"10px 28px",height:"44px",fontSize:"0.9rem"}}
              >
                {hero.ctaText}
              </button>
            </div>

            {/* Additional Buttons */}
            {hero.buttons && hero.buttons.length > 0 && (() => {
              console.log("Rendering buttons:", hero.buttons);
              return (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "16px", padding: "16px 0" }}>
                {hero.buttons.map((btn) => (
                  <div key={btn.id} style={{ position: "relative", display: "inline-block" }}>
                    <button
                      className="btn-large"
                      style={{
                        width: "auto",
                        padding: "10px 28px",
                        height: "44px",
                        fontSize: "0.9rem",
                        border: "1px solid #dd901d",
                        opacity: 0.8,
                      }}
                      onClick={() => setEditingField(`button-${btn.id}`)}
                    >
                      {editingField === `button-${btn.id}` ? (
                        <input
                          autoFocus
                          type="text"
                          value={btn.text}
                          onChange={(e) => {
                            setHero({
                              ...hero,
                              buttons: hero.buttons.map(b => b.id === btn.id ? { ...b, text: e.target.value } : b)
                            });
                          }}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingField(null);
                            if (e.key === "Escape") setEditingField(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "white",
                            fontSize: "0.9rem",
                            fontWeight: "inherit",
                            textAlign: "center",
                            outline: "none",
                            width: "100%",
                          }}
                        />
                      ) : (
                        btn.text
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setHero({
                          ...hero,
                          buttons: hero.buttons.filter(b => b.id !== btn.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#dd901d",
                        border: "none",
                        color: "#1a1a1a",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#c97c1c"}
                      onMouseLeave={(e) => e.target.style.background = "#dd901d"}
                      title="Delete button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              );
            })()}
          </section>

          {/* HOW IT WORKS SECTION */}
          <section id="howitworks" className="howitworks-section" style={{display: hiddenSections.howitworks ? "none" : "block", order: sectionOrder.indexOf("howitworks")}}>
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

            {/* Additional Titles */}
            {howitworks.additionalTitles && howitworks.additionalTitles.length > 0 && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginBottom: "24px", gap: "16px" }}>
                {howitworks.additionalTitles.map((title) => (
                  <div key={title.id} style={{ position: "relative" }}>
                    <h2 className="section-title">{title.text}</h2>
                    <button
                      onClick={() => {
                        setHowitworks({
                          ...howitworks,
                          additionalTitles: howitworks.additionalTitles.filter(t => t.id !== title.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "0",
                        background: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "12px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                      onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                      title="Delete title"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Subheadings */}
            {howitworks.additionalSubheadings && howitworks.additionalSubheadings.length > 0 && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginBottom: "24px", gap: "16px" }}>
                {howitworks.additionalSubheadings.map((sub) => (
                  <div key={sub.id} style={{ position: "relative" }}>
                    <p className="section-subtitle">{sub.text}</p>
                    <button
                      onClick={() => {
                        setHowitworks({
                          ...howitworks,
                          additionalSubheadings: howitworks.additionalSubheadings.filter(s => s.id !== sub.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        background: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "12px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                      onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                      title="Delete subheading"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

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
                        right: "44px",
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
                    <button
                      onClick={() => {
                        setHowitworksSteps(howitworksSteps.filter((_, idx) => idx !== i));
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "#dc2626",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        color: "white",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                      onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                      title="Delete step"
                    >
                      <TrashIcon />
                    </button>
                    <div className="icon-box">{iconContent}</div>
                    <div className="step-title">{step.title}</div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Additional Buttons for How It Works */}
            {howitworks.buttons && howitworks.buttons.length > 0 && (() => {
              return (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "24px", padding: "16px 0" }}>
                {howitworks.buttons.map((btn) => (
                  <div key={btn.id} style={{ position: "relative", display: "inline-block" }}>
                    <button
                      className="btn-large"
                      style={{
                        width: "auto",
                        padding: "10px 28px",
                        height: "44px",
                        fontSize: "0.9rem",
                        border: "1px solid #dd901d",
                        opacity: 0.8,
                      }}
                      onClick={() => setEditingField(`howitworks-button-${btn.id}`)}
                    >
                      {editingField === `howitworks-button-${btn.id}` ? (
                        <input
                          autoFocus
                          type="text"
                          value={btn.text}
                          onChange={(e) => {
                            setHowitworks({
                              ...howitworks,
                              buttons: howitworks.buttons.map(b => b.id === btn.id ? { ...b, text: e.target.value } : b)
                            });
                          }}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingField(null);
                            if (e.key === "Escape") setEditingField(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "white",
                            fontSize: "0.9rem",
                            fontWeight: "inherit",
                            textAlign: "center",
                            outline: "none",
                            width: "100%",
                          }}
                        />
                      ) : (
                        btn.text
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setHowitworks({
                          ...howitworks,
                          buttons: howitworks.buttons.filter(b => b.id !== btn.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#dd901d",
                        border: "none",
                        color: "#1a1a1a",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#c97c1c"}
                      onMouseLeave={(e) => e.target.style.background = "#dd901d"}
                      title="Delete button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              );
            })()}

          </section>

          {/* SERVICES SECTION */}
          <section id="services" className="services-section" style={{display: hiddenSections.services ? "none" : "block", order: sectionOrder.indexOf("services")}}>
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

            {/* Additional Titles */}
            {services.additionalTitles && services.additionalTitles.length > 0 && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginBottom: "24px", gap: "16px" }}>
                {services.additionalTitles.map((title) => (
                  <div key={title.id} style={{ position: "relative" }}>
                    <h2 className="section-title">{title.text}</h2>
                    <button
                      onClick={() => {
                        setServices({
                          ...services,
                          additionalTitles: services.additionalTitles.filter(t => t.id !== title.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "0",
                        background: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "12px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                      onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                      title="Delete title"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Subheadings */}
            {services.additionalSubheadings && services.additionalSubheadings.length > 0 && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginBottom: "24px", gap: "16px" }}>
                {services.additionalSubheadings.map((sub) => (
                  <div key={sub.id} style={{ position: "relative" }}>
                    <p className="section-subtitle">{sub.text}</p>
                    <button
                      onClick={() => {
                        setServices({
                          ...services,
                          additionalSubheadings: services.additionalSubheadings.filter(s => s.id !== sub.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        background: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "12px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                      onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                      title="Delete subheading"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:800,margin:"0 auto"}}>
              {servicesData.map((svc, i) => (
                <div key={i} className="service-card" style={{position:"relative"}}>
                  <button
                    onClick={() => setEditingServiceIndex(i)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "44px",
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
                    title="Edit service"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => {
                      setServicesData(servicesData.filter((_, idx) => idx !== i));
                    }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#dc2626",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      color: "white",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                    onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                    title="Delete service"
                  >
                    <TrashIcon />
                  </button>
                  <div style={{
                    width:50,height:50,background:"#dd901d",
                    borderRadius:14,padding:10,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    marginBottom:16,
                  }}>
                    {typeof svc.icon === "string" && uploadedSvgs[svc.icon] ? (
                      <img src={uploadedSvgs[svc.icon]} alt="service icon" style={{width:"100%",height:"100%",objectFit:"contain"}} />
                    ) : (
                      svc.icon
                    )}
                  </div>
                  <div className="service-title">{svc.title}</div>
                  <div className="service-items">
                    {svc.items.slice(0, 4).map((item, j) => (
                      <div key={j} className="service-item">
                        <CheckItem/>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Buttons for Services */}
            {services.buttons && services.buttons.length > 0 && (() => {
              return (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "24px", padding: "16px 0" }}>
                {services.buttons.map((btn) => (
                  <div key={btn.id} style={{ position: "relative", display: "inline-block" }}>
                    <button
                      className="btn-large"
                      style={{
                        width: "auto",
                        padding: "10px 28px",
                        height: "44px",
                        fontSize: "0.9rem",
                        border: "1px solid #dd901d",
                        opacity: 0.8,
                      }}
                      onClick={() => setEditingField(`services-button-${btn.id}`)}
                    >
                      {editingField === `services-button-${btn.id}` ? (
                        <input
                          autoFocus
                          type="text"
                          value={btn.text}
                          onChange={(e) => {
                            setServices({
                              ...services,
                              buttons: services.buttons.map(b => b.id === btn.id ? { ...b, text: e.target.value } : b)
                            });
                          }}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingField(null);
                            if (e.key === "Escape") setEditingField(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "white",
                            fontSize: "0.9rem",
                            fontWeight: "inherit",
                            textAlign: "center",
                            outline: "none",
                            width: "100%",
                          }}
                        />
                      ) : (
                        btn.text
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setServices({
                          ...services,
                          buttons: services.buttons.filter(b => b.id !== btn.id)
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#dd901d",
                        border: "none",
                        color: "#1a1a1a",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#c97c1c"}
                      onMouseLeave={(e) => e.target.style.background = "#dd901d"}
                      title="Delete button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              );
            })()}
          </section>

          {/* Custom Sections */}
          {customSections.map((section) => {
            const sectionIndex = sectionOrder.indexOf(section.id);
            const isEvenPosition = sectionIndex % 2 === 0;
            const backgroundColor = isEvenPosition ? "#0a0908" : "#14110f";
            
            return (
            <section key={section.id} style={{
              width: "100%",
              paddingTop: "40px",
              paddingBottom: "64px",
              paddingLeft: "40px",
              paddingRight: "40px",
              display: hiddenSections[section.id] ? "none" : "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: backgroundColor,
              borderRadius: "0",
              boxSizing: "border-box",
              order: sectionIndex,
              marginBottom: "-24px",
            }}>
              <div style={{ width: "100%", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
                <h2 style={{ 
                  fontSize: "32px", 
                  fontWeight: "bold", 
                  color: "white",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  opacity: 0.9,
                }}
                onClick={() => setEditingField(`custom-section-${section.id}-title`)}
                onMouseEnter={(e) => e.target.style.opacity = "1"}
                onMouseLeave={(e) => e.target.style.opacity = "0.9"}
                >
                  {editingField === `custom-section-${section.id}-title` ? (
                    <input
                      autoFocus
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        setCustomSections(customSections.map(s => s.id === section.id ? { ...s, title: e.target.value } : s));
                      }}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingField(null);
                        if (e.key === "Escape") setEditingField(null);
                      }}
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        backgroundColor: "rgba(221, 144, 29, 0.15)",
                        border: "2px solid #dd901d",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        color: "#dd901d",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                      placeholder="Section Title"
                    />
                  ) : (
                    section.title
                  )}
                </h2>
                <p style={{
                  fontSize: "16px",
                  color: "#999",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  maxWidth: "600px",
                  margin: "16px auto",
                  marginBottom: "0",
                  opacity: 0.85,
                }}
                onClick={() => setEditingField(`custom-section-${section.id}-subtitle`)}
                onMouseEnter={(e) => e.target.style.opacity = "1"}
                onMouseLeave={(e) => e.target.style.opacity = "0.85"}
                >
                  {editingField === `custom-section-${section.id}-subtitle` ? (
                    <textarea
                      autoFocus
                      value={section.subtitle}
                      onChange={(e) => {
                        setCustomSections(customSections.map(s => s.id === section.id ? { ...s, subtitle: e.target.value } : s));
                      }}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setEditingField(null);
                      }}
                      style={{
                        fontSize: "16px",
                        backgroundColor: "rgba(221, 144, 29, 0.15)",
                        border: "2px solid #dd901d",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        color: "#dd901d",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                        fontFamily: "inherit",
                        minHeight: "60px",
                        resize: "vertical",
                      }}
                      placeholder="Section Subtitle (Optional)"
                    />
                  ) : (
                    section.subtitle || "(Click to add subtitle)"
                  )}
                </p>
              </div>
            </section>
            );
          })}

          {/* FOOTER SECTION */}
          <footer id="about" className="footer" style={{display: hiddenSections.footer ? "none" : "block", order: 999}}>
            <div style={{maxWidth:860,margin:"0 auto"}}>
              <div className="footer-row">
                <span className="footer-label">Contact us</span>
                <div className="footer-info-display">
                  <span className="footer-text">{footer.address}</span>
                  <span className="footer-text">{footer.phone}</span>
                  <span className="footer-text">{footer.email}</span>
                  <span className="footer-text">{footer.hours}</span>
                </div>
                <button
                  onClick={() => setEditingFooterModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#dd901d",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginTop: "12px",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#c97c1c"}
                  onMouseLeave={(e) => e.target.style.background = "#dd901d"}
                  title="Edit contact information"
                >
                  <PencilIcon />
                </button>
              </div>

              {/* Additional Titles */}
              {footer.additionalTitles && footer.additionalTitles.length > 0 && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: "24px", gap: "16px" }}>
                  {footer.additionalTitles.map((title) => (
                    <div key={title.id} style={{ position: "relative" }}>
                      <h3 style={{ color: "white", fontSize: "16px", marginBottom: "8px", fontWeight: "600" }}>{title.text}</h3>
                      <button
                        onClick={() => {
                          setFooter({
                            ...footer,
                            additionalTitles: footer.additionalTitles.filter(t => t.id !== title.id)
                          });
                        }}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          background: "#dc2626",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "12px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#991b1b"}
                        onMouseLeave={(e) => e.target.style.background = "#dc2626"}
                        title="Delete title"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="footer-row">
                <span className="footer-label">Follow us</span>
                <div className="footer-social-display">
                  {footer.socialLinks && footer.socialLinks.length > 0 ? (
                    footer.socialLinks.map((link) => {
                      const socialMap = {
                        facebook: (
                          <svg key={link.id} viewBox="0 0 24 24" fill="none" width="14" height="14">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                              stroke="white" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
                          </svg>
                        ),
                        instagram: (
                          <svg key={link.id} viewBox="0 0 24 24" fill="none" width="16" height="16">
                            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.6" fill="none"/>
                            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6" fill="none"/>
                            <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                          </svg>
                        ),
                        twitter: (
                          <svg key={link.id} viewBox="0 0 24 24" fill="none" width="14" height="14">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.45 7-7 7-7s-3 1-5-1V7a4.5 4.5 0 018.23-1"
                              stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ),
                        tiktok: (
                          <svg key={link.id} viewBox="0 0 24 24" fill="none" width="14" height="14">
                            <path d="M9 12a4 4 0 1 0 4.18-4M9 12a4 4 0 1 0 4.18-4" stroke="white" strokeWidth="1.6" fill="none"/>
                            <path d="M15.5 3.5v8M18 5.5a3 3 0 0 1-3 3" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                          </svg>
                        ),
                      };
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          title={`Visit our ${link.platform}`}
                        >
                          {socialMap[link.platform]}
                        </a>
                      );
                    })
                  ) : (
                    <span style={{ color: "#888", fontSize: "12px" }}>No social links added</span>
                  )}
                </div>
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

        {/* Service Edit Modal - Outside transformed container */}
        <ServiceEditModal
          isOpen={editingServiceIndex !== null}
          serviceIndex={editingServiceIndex}
          services={servicesData}
          setServices={setServicesData}
          uploadedSvgs={uploadedSvgs}
          setUploadedSvgs={setUploadedSvgs}
          onClose={() => setEditingServiceIndex(null)}
        />

        {/* Footer Edit Modal - Outside transformed container */}
        <FooterEditModal
          isOpen={editingFooterModal}
          footer={footer}
          setFooter={setFooter}
          onClose={() => setEditingFooterModal(false)}
        />

        {/* Add Card Modal */}
        <AddCardModal
          isOpen={addCardModal}
          onClose={() => {
            setAddCardModal(false);
            setCardConfig({ section: "howitworks", title: "New Card", description: "", items: [] });
          }}
          cardConfig={cardConfig}
          setCardConfig={setCardConfig}
          onAddCard={() => {
            if (cardConfig.section === "howitworks") {
              const newStep = {
                id: Math.max(...howitworksSteps.map(s => s.id), -1) + 1,
                icon: "calendar",
                title: cardConfig.title,
                desc: cardConfig.description,
              };
              setHowitworksSteps([...howitworksSteps, newStep]);
            } else if (cardConfig.section === "services") {
              const newService = {
                icon: <StarIcon />,
                title: cardConfig.title,
                items: cardConfig.items.filter(item => item.trim() !== ""),
              };
              setServicesData([...servicesData, newService]);
            }
            setAddCardModal(false);
            setCardConfig({ section: "howitworks", title: "New Card", description: "", items: [] });
          }}
          howitworksSteps={howitworksSteps}
          servicesData={servicesData}
        />

        {/* Navigate Sections Modal */}
        <NavigateSectionsModal
          isOpen={navigateSectionsOpen}
          onClose={() => setNavigateSectionsOpen(false)}
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
          hiddenSections={hiddenSections}
          setHiddenSections={setHiddenSections}
          customSections={customSections}
          setCustomSections={setCustomSections}
          onClearSection={(sectionId) => {
            if (sectionId === "hero") {
              setHero({
                badge: "DIGITAL APPOINTMENT SYSTEM",
                headline1: "Skip The Wait,",
                headline2: "Book Your Style",
                subheading: "A digital appointment and customer management system for barbershops, hair salons, and spas. Book appointments online, reduce wait times, and experience seamless, personalized service—instantly.",
                ctaText: "Book Appointment",
                buttons: [],
              });
            } else if (sectionId === "howitworks") {
              setHowitworksSteps([
                { id: 0, icon: "calendar", title: "Book Online", desc: "Select your service, preferred stylist, and convenient time slot" },
                { id: 1, icon: "bell", title: "Get Notified", desc: "Receive real-time updates and 'Your Turn Soon' alerts" },
                { id: 2, icon: "check", title: "Enjoy Service", desc: "Arrive on time and skip the traditional waiting queue" },
              ]);
            } else if (sectionId === "services") {
              setServicesData([
                { icon: <ScissorsIcon/>, title: "Hair Services", items: ["Haircut & Style", "Color Treatment", "Hair Spa", "Keratin Treatment"] },
                { icon: <NailIcon/>, title: "Nail Services", items: ["Manicure", "Pedicure", "Nail Art", "Gel Extension"] },
                { icon: <SkinIcon/>, title: "Skin Care Services", items: ["Facial Treatment", "Chemical Peel", "Microdermabrasion", "Hydration Therapy"] },
                { icon: <MassageIcon/>, title: "Massage Services", items: ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Massage", "Spa Reflexology"] },
                { icon: <StarIcon/>, title: "Premium Services", items: ["Bridal Package", "Couple's Massage", "Hair & Glow Combo", "VIP Lounge Experience"] },
              ]);
            }
          }}
        />

        {/* Add Section Modal */}
        <AddSectionModal
          isOpen={addSectionModal}
          onClose={() => {
            setAddSectionModal(false);
            setDraftSection({ title: "New Section", subtitle: "" });
          }}
          draftSection={draftSection}
          setDraftSection={setDraftSection}
          onAddSection={() => {
            const newId = `custom-${Date.now()}`;
            const newSection = { id: newId, ...draftSection };
            setCustomSections([...customSections, newSection]);
            setSectionOrder([...sectionOrder.slice(0, -1), newId, 'footer']);
            setAddSectionModal(false);
            setDraftSection({ title: "New Section", subtitle: "" });
          }}
        />

        {/* Add Subheading Modal */}
        <AddSubheadingModal
          isOpen={addSubheadingModal}
          onClose={() => setAddSubheadingModal(false)}
          sections={[
            { id: "hero", label: "Hero Section" },
            { id: "howitworks", label: "How It Works" },
            { id: "services", label: "Services" },
            { id: "footer", label: "Footer" },
            ...customSections.map(sec => ({ id: sec.id, label: sec.title }))
          ]}
          onAddSubheading={(sectionId, subheadingText) => {
            const newSubheading = { id: `sub-${Date.now()}`, text: subheadingText };
            if (sectionId === "hero") {
              setHero({ ...hero, additionalSubheadings: [...(hero.additionalSubheadings || []), newSubheading] });
            } else if (sectionId === "howitworks") {
              setHowitworks({ ...howitworks, additionalSubheadings: [...(howitworks.additionalSubheadings || []), newSubheading] });
            } else if (sectionId === "services") {
              setServices({ ...services, additionalSubheadings: [...(services.additionalSubheadings || []), newSubheading] });
            } else if (sectionId === "footer") {
              setFooter({ ...footer, additionalSubheadings: [...(footer.additionalSubheadings || []), newSubheading] });
            } else if (sectionId.startsWith("custom-")) {
              const updatedCustomSections = customSections.map(sec =>
                sec.id === sectionId ? { ...sec, additionalSubheadings: [...(sec.additionalSubheadings || []), newSubheading] } : sec
              );
              setCustomSections(updatedCustomSections);
            }
            setAddSubheadingModal(false);
          }}
        />

        {/* Add Title Modal */}
        <AddTitleModal
          isOpen={addTitleModal}
          onClose={() => setAddTitleModal(false)}
          sections={[
            { id: "hero", label: "Hero Section" },
            { id: "howitworks", label: "How It Works" },
            { id: "services", label: "Services" },
            { id: "footer", label: "Footer" },
            ...customSections.map(sec => ({ id: sec.id, label: sec.title }))
          ]}
          onAddTitle={(sectionId, titleText) => {
            const newTitle = { id: `title-${Date.now()}`, text: titleText };
            if (sectionId === "hero") {
              setHero({ ...hero, additionalTitles: [...(hero.additionalTitles || []), newTitle] });
            } else if (sectionId === "howitworks") {
              setHowitworks({ ...howitworks, additionalTitles: [...(howitworks.additionalTitles || []), newTitle] });
            } else if (sectionId === "services") {
              setServices({ ...services, additionalTitles: [...(services.additionalTitles || []), newTitle] });
            } else if (sectionId === "footer") {
              setFooter({ ...footer, additionalTitles: [...(footer.additionalTitles || []), newTitle] });
            } else if (sectionId.startsWith("custom-")) {
              const updatedCustomSections = customSections.map(sec =>
                sec.id === sectionId ? { ...sec, additionalTitles: [...(sec.additionalTitles || []), newTitle] } : sec
              );
              setCustomSections(updatedCustomSections);
            }
            setAddTitleModal(false);
          }}
        />
      </div>
    </div>
  );
}
