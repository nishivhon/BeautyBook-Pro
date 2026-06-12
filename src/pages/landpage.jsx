import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import haircutImage from "../../images/Service Category/Haircut.png";
import hairColorImage from "../../images/Service Category/Hair Color.png";
import stylingImage from "../../images/Service Category/Styling.png";
import treatmentsImage from "../../images/Service Category/Treatments.png";
import rebondingImage from "../../images/Service Category/Rebonding & Chemical Treatments.png";
import highlightsImage from "../../images/Service Category/Highlights & Specialty.png";
import handFootImage from "../../images/Service Category/Hand & Foot Care.png";
import othersImage from "../../images/Service Category/Others.png";
import { usePublicTheme } from "../theme/publicThemeContext";
import { ThemeToggle } from "../components/public/ThemeToggle";
import {
  LogoMark,
  BookOnlineIcon,
  GetNotifiedIcon,
  EnjoyServiceIcon,
} from "../components/public/publicPageIcons";

const HERO_BG_IMAGE_DARK = new URL("../../images/DarkmodeBG.png", import.meta.url).href;
const HERO_BG_IMAGE_LIGHT = new URL("../../images/LightmodeBG.png", import.meta.url).href;

const CATEGORY_IMAGES = [
  { match: /hair\s*cut|\bbasic hair\b|\bcut\b/i, src: haircutImage },
  { match: /color|coloring|dye/i, src: hairColorImage },
  { match: /styling|blowout|style/i, src: stylingImage },
  { match: /treatment|hair treatment|keratin/i, src: treatmentsImage },
  { match: /rebonding|chemical|perm|relaxer/i, src: rebondingImage },
  { match: /highlight|balayage|ombre|specialty/i, src: highlightsImage },
  { match: /hand|foot|nail|manicure|pedicure/i, src: handFootImage },
];

const getCategoryImage = (categoryName) => {
  const found = CATEGORY_IMAGES.find(({ match }) => match.test(categoryName));
  return found ? found.src : othersImage;
};

/* ── Services: SCISSORS (haircut) ── */
const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* left handle ring */}
    <circle cx="5.5" cy="6.5" r="3" stroke="black" strokeWidth="1.6" fill="none"/>
    {/* right handle ring */}
    <circle cx="5.5" cy="17.5" r="3" stroke="black" strokeWidth="1.6" fill="none"/>
    {/* blade 1: from left-ring going right */}
    <path d="M8 5 L21 12" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    {/* blade 2 */}
    <path d="M8 19 L21 12" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    {/* pivot dot at crossing */}
    <circle cx="14.5" cy="10.5" r="0.8" fill="black"/>
    <circle cx="14.5" cy="13.5" r="0.8" fill="black"/>
  </svg>
);

/* ── Services: NAIL POLISH BOTTLE ── */
const NailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* bottle body */}
    <rect x="8" y="10" width="8" height="11" rx="2" stroke="black" strokeWidth="1.7" fill="none"/>
    {/* neck */}
    <rect x="10" y="6" width="4" height="4" rx="0.5" stroke="black" strokeWidth="1.5" fill="none"/>
    {/* cap */}
    <rect x="9" y="3" width="6" height="3.5" rx="1.5" stroke="black" strokeWidth="1.5" fill="black" fillOpacity="0.15"/>
    {/* shine line on body */}
    <line x1="11" y1="12" x2="11" y2="19" stroke="black" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

/* ── Services: SMILEY FACE (skin care) ── */
const SkinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* face circle */}
    <circle cx="12" cy="12" r="9.5" stroke="black" strokeWidth="1.7" fill="none"/>
    {/* eyes */}
    <circle cx="9"  cy="10" r="1.2" fill="black"/>
    <circle cx="15" cy="10" r="1.2" fill="black"/>
    {/* smile — proper arc */}
    <path d="M8.5 14.5 Q12 18 15.5 14.5" stroke="black" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
  </svg>
);

/* ── Services: MASSAGE (person lying, hands above) ── */
const MassageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* head circle */}
    <circle cx="18" cy="5" r="2.2" stroke="black" strokeWidth="1.5" fill="none"/>
    {/* body lying on table */}
    <path d="M2 14 Q5 11 9 12 L14 11 Q17 10.5 20 12" stroke="black" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    {/* table / bed base */}
    <line x1="1" y1="16" x2="23" y2="16" stroke="black" strokeWidth="1.7" strokeLinecap="round"/>
    {/* table legs */}
    <line x1="4"  y1="16" x2="4"  y2="20" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="16" x2="20" y2="20" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
    {/* wavy lines above = relaxation */}
    <path d="M5 8 Q6.5 6 8 8 Q9.5 10 11 8" stroke="black" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M8 5.5 Q9.5 3.5 11 5.5 Q12.5 7.5 14 5.5" stroke="black" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
);

/* ── Services: STAR (premium) ── */
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <path
      d="M12 2.5 L14.6 9.2 H21.8 L15.9 13.4 L18.2 20.2 L12 16.1 L5.8 20.2 L8.1 13.4 L2.2 9.2 H9.4 Z"
      stroke="black" strokeWidth="1.7" fill="none" strokeLinejoin="round"
    />
  </svg>
);

/* ── List item: amber circle check ── */
const CheckItem = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:15,height:15,flexShrink:0}}>
    <circle cx="8" cy="8" r="7.2" stroke="#dd901d" strokeWidth="1.3" fill="none"/>
    <path d="M5 8l2.2 2.2L11 5.5" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NavBar = ({ onBookAppointment }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 52;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/operators/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="flex-center-gap-2">
        <div className="public-icon-slot public-icon-slot--logo">
          <LogoMark/>
        </div>
        <span className="brand-name">BeautyBook Pro</span>
      </div>

      {/* Nav links - Desktop */}
      <div className="flex-center-gap-1 nav-links-desktop">
        {[
          {label:"Home",       id:"home"},
          {label:"How It Works", path:"/how-it-works"},
          {label:"Services",     path:"/services"},
        ].map(item => (
          <button key={item.label} onClick={() => item.path ? navigate(item.path) : scrollToSection(item.id)} className="nav-link">
            {item.label}
          </button>
        ))}
        <button onClick={() => { navigate("/about"); setMenuOpen(false); }} className="nav-link">
          About
        </button>
      </div>

      {/* CTA - Desktop */}
      <div
        className="btn-nav-desktop"
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", gap: 8 }}
      >
        <ThemeToggle />
        <button onClick={() => { navigate("/operators/login"); setMenuOpen(false); }} className="btn-primary btn-nav">
          Login
        </button>
      </div>

      <div className="mobile-auth-actions">
        <ThemeToggle className="mobile-theme-toggle" />
        <button onClick={() => { navigate("/operators/login"); setMenuOpen(false); }} className="btn-primary btn-nav btn-mobile-cta">
          Login
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn mobile-menu-btn-inline"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:20,height:20}}>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {[
              {label:"Home",       id:"home"},
              {label:"How It Works", path:"/how-it-works"},
              {label:"Services",     path:"/services"},
            ].map(item => (
              <button 
                key={item.label} 
                onClick={() => item.path ? navigate(item.path) : scrollToSection(item.id)} 
                className="mobile-menu-link"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => { navigate("/about"); setMenuOpen(false); }} 
              className="mobile-menu-link"
            >
              About
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = ({ onBookAppointment }) => {
  const navigate = useNavigate();
  const { themeMode } = usePublicTheme();
  const heroBackgroundImage = themeMode === "light" ? HERO_BG_IMAGE_LIGHT : HERO_BG_IMAGE_DARK;
  
  return (
    <section
      id="home"
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 9, 8, 0.55), rgba(10, 9, 8, 0.72)), url('${heroBackgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Badge */}
      <div className="hero-badge">
        <span>
          DIGITAL APPOINTMENT SYSTEM
        </span>
      </div>

      {/* Headline */}
      <h1 className="hero-title">
        Skip The&nbsp;&nbsp;Wait,{" "}
        <span className="accent">Book Your Style</span>
      </h1>

      {/* Sub-copy */}
      <p className="hero-text">
        A digital appointment and customer management system for barbershops,
        hair salons, and spas.<br/>
        Book appointments online, reduce wait times, and experience seamless,
        personalized service—instantly.
      </p>

      {/* CTA */}
      <button onClick={() => navigate("/operators/login?createAccount=1")} className="btn-large btn-hero">
        Create Your Account
      </button>
    </section>
  );
};

const HowItWorksSection = () => {
  const navigate = useNavigate();
  const steps = [
    {icon:<BookOnlineIcon/>,   title:"Book Online",    desc:"Select your service, preferred stylist, and convenient time slot"},
    {icon:<GetNotifiedIcon/>,  title:"Get Notified",   desc:"Receive real-time updates and \u2018Your Turn Soon\u2019 alerts"},
    {icon:<EnjoyServiceIcon/>, title:"Enjoy Service",  desc:"Arrive on time and skip the traditional waiting queue"},
  ];
  return (
    <section id="howitworks" className="howitworks-section">
      <h2 className="section-title">How BeautyBook Pro Works</h2>
      <p className="section-subtitle">Simple, efficient digital booking appointment for modern salon businesses</p>

      <div className="grid-3col">
        {steps.map((s,i) => (
          <div
            key={i}
            className="step-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/how-it-works")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate("/how-it-works");
              }
            }}
            aria-label={`Go to How It Works page: ${s.title}`}
          >
            <div className="public-icon-slot">{s.icon}</div>
            <div className="step-title">{s.title}</div>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SvcCard = ({icon,title,items}) => (
  <div className="service-card">
    <div className="svc-icon-box">{icon}</div>
    <div className="service-title">{title}</div>
    <div className="service-items">
      {items.map((l,i) => (
        <div key={i} className="service-item">
          <CheckItem/>
          <span>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

const SERVICE_CATEGORIES = [
  {
    name: "Haircut",
    description: "Precision cuts, clean trims, and tailored shapes for everyday grooming and polish.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: haircut workstation with stylist and client.",
  },
  {
    name: "Styling (No Color/Chemical)",
    description: "Blow-dry finishes, formal looks, and style sets without chemical or color services.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: styling station with tools and finishing products.",
  },
  {
    name: "Hair Color",
    description: "Root retouch, single-process color, and full-color refresh services for vibrant results.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: color application and mixing setup.",
  },
  {
    name: "Highlights & Specialty Color",
    description: "Foils, balayage, dimensional blends, and custom color work for standout depth and contrast.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: highlight foils and specialty color application.",
  },
  {
    name: "Rebonding & Chemical Treatments",
    description: "Rebonding, smoothing, and controlled chemical services for long-lasting structure and manageability.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: chemical treatment and rebonding station.",
  },
  {
    name: "Treatments",
    description: "Deep conditioning, scalp care, and restorative treatments that support healthy hair and scalp balance.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: hair treatment setup and care products.",
  },
  {
    name: "Hand & Foot Care",
    description: "Manicure and pedicure services for clean, refreshed hands and feet with polished finishes.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: manicure and pedicure station.",
  },
  {
    name: "Other Services",
    description: "Additional salon offerings and custom requests that support a complete beauty appointment experience.",
    imageLabel: "Category Visual",
    imageNote: "Primary image: assorted salon service tools and accessories.",
  },
];

const ServicesSection = () => {
  const navigate = useNavigate();
  const { themeMode } = usePublicTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [isCompact, setIsCompact] = useState(window.innerWidth < 768);
  const wheelCooldownRef = useRef(false);
  const touchStateRef = useRef({ active: false, startX: 0, startY: 0 });
  const containerRef = useRef(null);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const CATEGORIES_CACHE_KEY = 'bbp_landing_services_v1';
  const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        const raw = localStorage.getItem(CATEGORIES_CACHE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed?.ts && Date.now() - parsed.ts < CACHE_TTL_MS && Array.isArray(parsed.categories)) {
              setFetchedCategories(parsed.categories);
              return;
            }
          } catch (e) {
            // fall through to fetch
          }
        }

        const res = await fetch('/api/services');
        if (!res.ok) return;
        const data = await res.json();
        const services = Array.isArray(data) ? data : (data.data || []);

        const grouped = services.reduce((acc, s) => {
          const cat = (s.category || s.category_name || 'Other Services').trim() || 'Other Services';
          acc[cat] = acc[cat] || [];
          acc[cat].push(s);
          return acc;
        }, {});

        const categories = Object.keys(grouped).map((name) => {
          const group = grouped[name];
          const first = group[0] || {};
          const description = first.description || first.meta || '';
          const items = group.map((svc) => svc.service_name || svc.name || svc.serviceName || 'Service');
          return { name, description, items, services: group };
        });

        if (mounted) {
          setFetchedCategories(categories);
          try {
            localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify({ ts: Date.now(), categories }));
          } catch (e) {
            // ignore localStorage write failures
          }
        }
      } catch (err) {
        console.error('[Landing] Failed to load services for categories', err);
      }
    };

    loadServices();
    return () => { mounted = false; };
  }, []);
  const effectiveCategories = fetchedCategories.length > 0 ? fetchedCategories : SERVICE_CATEGORIES;
  const currentCategory = effectiveCategories[activeSlide] || SERVICE_CATEGORIES[0];
  const sectionSidePadding = isCompact ? 12 : 40;
  const contentGridWidth = isCompact ? 1000 : 860;
  const leftAlignedGridInset = `max(0px, calc((100% - ${contentGridWidth}px) / 2))`;

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rotateTo = (targetIndex) => {
    if (isSliding || targetIndex === activeSlide) return;

    const total = effectiveCategories.length;
    const forwardSteps = (targetIndex - activeSlide + total) % total;
    const backwardSteps = (activeSlide - targetIndex + total) % total;
    const direction = forwardSteps <= backwardSteps ? 1 : -1;

    setSlideDirection(direction);
    setIsSliding(true);

    window.setTimeout(() => {
      setActiveSlide(targetIndex);
      setIsSliding(false);
    }, 220);
  };

  const handleTouchStart = (event) => {
    if (isSliding) return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStateRef.current = { active: true, startX: touch.clientX, startY: touch.clientY };
    setIsTouchActive(true);
  };

  const handleTouchMove = (event) => {
    if (!touchStateRef.current.active) return;
    const touch = event.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStateRef.current.startX;
    const deltaY = touch.clientY - touchStateRef.current.startY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleTouchEnd = (event) => {
    if (!touchStateRef.current.active) return;
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) {
      touchStateRef.current.active = false;
      setIsTouchActive(false);
      return;
    }

    const deltaX = touch.clientX - touchStateRef.current.startX;
    const deltaY = touch.clientY - touchStateRef.current.startY;
      if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction = deltaX < 0 ? 1 : -1;
      const total = effectiveCategories.length;
      const target = ((activeSlide + direction) % total + total) % total;
      rotateTo(target);
    }

    touchStateRef.current.active = false;
    setIsTouchActive(false);
  };

  // Wheel scroll listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const listener = (event) => {
      if (!isHovered) return;
      event.preventDefault();
      event.stopPropagation();
      if (wheelCooldownRef.current) return;
      const delta = event.deltaY;
      const dir = delta > 0 ? 1 : -1;
      const total = effectiveCategories.length;
      const target = ((activeSlide + dir) % total + total) % total;
      rotateTo(target);
      wheelCooldownRef.current = true;
      window.setTimeout(() => { wheelCooldownRef.current = false; }, 200);
    };

    el.addEventListener('wheel', listener, { passive: false });
    return () => el.removeEventListener('wheel', listener);
  }, [isHovered, activeSlide]);

  const orderedCategories = effectiveCategories.map((_, offset) => {
    const sourceIndex = (activeSlide + offset) % effectiveCategories.length;
    return {
      sourceIndex,
      category: effectiveCategories[sourceIndex],
    };
  });

  return (
    <section id="services" className="services-section" style={{ paddingBottom: "40px" }}>
      <div
        className="service-carousel-shell"
        style={{
          display: "grid",
          gridTemplateColumns: "270px minmax(0, 1fr)",
          gap: "34px",
          alignItems: "center",
          marginLeft: leftAlignedGridInset,
          width: `calc(100% - ${leftAlignedGridInset} + ${sectionSidePadding}px)`,
          marginRight: `-${sectionSidePadding}px`,
        }}
      >
        <div
          className="service-carousel-copy"
          style={{
            background: "transparent",
            border: "none",
            borderRadius: "0",
            padding: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "16px",
            minHeight: isCompact ? "auto" : "280px",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "var(--color-white)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "2.1rem",
              lineHeight: 1.1,
            }}
          >
            {currentCategory.name}
          </h3>
          <p
            style={{
              margin: 0,
              color: themeMode === "light" ? "#0b0b0b" : "#c9c2b8",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.93rem",
              lineHeight: 1.45,
              maxWidth: "240px",
            }}
          >
            {currentCategory.description}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/services")}
            style={{
              alignSelf: "flex-start",
              marginTop: "14px",
              minWidth: "130px",
              height: "34px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              padding: "0 14px",
            }}
          >
            Check Service
          </button>
        </div>

        <div
          ref={containerRef}
          className="service-carousel-panel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transform: "translateX(-10px)",
            touchAction: "pan-y",
            WebkitTapHighlightColor: "transparent",
            boxShadow: isTouchActive ? "0 0 0 1px rgba(221, 144, 29, 0.18), 0 0 24px rgba(221, 144, 29, 0.12)" : "none",
            borderRadius: "12px",
          }}
        >
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: isCompact ? "12px" : "20px",
              overflow: "visible",
              borderRadius: "0",
              border: "none",
              background: "transparent",
              boxShadow: "none",
              padding: isCompact ? "10px 2px 16px 12px" : "12px 10px 16px 24px",
              pointerEvents: isSliding ? "none" : "auto",
            }}
          >
            {orderedCategories.map(({ sourceIndex, category }, orderedIndex) => (
              (() => {
                const isHovered = hoveredSlide === sourceIndex;
                const isPrimary = orderedIndex === 0;

                // theme-aware hover colors
                const hoverBorderColor = themeMode === "light" ? "rgba(243, 139, 166, 0.88)" : "rgba(221, 144, 29, 0.88)";
                const hoverBoxShadow = themeMode === "light" ? "0 16px 30px rgba(243, 139, 166, 0.28), 0 0 0 1px rgba(243, 139, 166, 0.26)" : "0 16px 30px rgba(221, 144, 29, 0.28), 0 0 0 1px rgba(221, 144, 29, 0.26)";

                return (
              <button
                key={category.name}
                type="button"
                onClick={() => rotateTo(sourceIndex)}
                onMouseEnter={() => setHoveredSlide(sourceIndex)}
                onMouseLeave={() => setHoveredSlide(null)}
                style={{
                  flex: "0 0 auto",
                  width: isPrimary ? (isCompact ? "min(82vw, 280px)" : "330px") : (isCompact ? "min(62vw, 200px)" : "235px"),
                  height: isPrimary ? (isCompact ? "200px" : "250px") : (isCompact ? "150px" : "182px"),
                  boxSizing: "border-box",
                  borderRadius: "8px",
                  border: "2px solid #e1d4b8",
                    background: "#181412",
                  padding: 0,
                  cursor: "pointer",
                  position: "relative",
                    overflow: "hidden",
                  transition: "width 340ms cubic-bezier(0.22, 0.61, 0.36, 1), height 340ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 280ms ease, filter 280ms ease, border-color 240ms ease",
                  transform: isPrimary ? (isHovered ? "translateY(-6px)" : "translateY(0)") : (isHovered ? "translateY(-2px)" : "translateY(4px)"),
                  boxShadow: isHovered ? hoverBoxShadow : "0 0 0 rgba(0, 0, 0, 0)",
                  filter: isHovered ? "brightness(1.03) saturate(1.02)" : "none",
                  borderColor: isHovered ? hoverBorderColor : "#e1d4b8",
                  willChange: "transform, box-shadow, filter",
                }}
              >
                  <img
                    src={getCategoryImage(category.name)}
                    alt={category.name}
                    loading="lazy"
                    draggable="false"
                  style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                      transition: "transform 240ms ease, filter 240ms ease",
                      filter: isHovered ? "saturate(1.04) brightness(1.03)" : "none",
                  }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(14, 11, 8, 0.08) 40%, rgba(14, 11, 8, 0.72) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: isCompact ? "10px" : "12px",
                      right: isCompact ? "10px" : "12px",
                      bottom: isCompact ? "10px" : "12px",
                      color: "#fffaf3",
                      fontFamily: "Inter, sans-serif",
                      fontSize: isPrimary ? (isCompact ? "0.9rem" : "1rem") : (isCompact ? "0.8rem" : "0.86rem"),
                      fontWeight: 700,
                      lineHeight: 1.15,
                      textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                      textAlign: "left",
                    }}
                  >
                    <div style={{fontWeight:700}}>{category.name}</div>
                    <div style={{fontSize: isPrimary ? '0.8rem' : '0.72rem', marginTop:6, opacity:0.95}}>
                      {(category.items && category.items.length > 0 ? category.items : (category.services || []) ).slice(0,4).map((it, idx) => (
                        <div key={idx} style={{display:'flex', gap:8, alignItems:'center'}}>
                          <CheckItem />
                          <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{typeof it === 'string' ? it : (it.service_name || it.name || it.serviceName || '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </button>
                );
              })()
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {effectiveCategories.map((category, index) => {
              const isActive = index === activeSlide;
              // Use pink accent for active pill in light mode, amber for dark mode
              const PINK = "#f38ba6"; // rgb(243,139,166)
              const PINK_SHADOW = "0 0 0 3px rgba(243, 139, 166, 0.18)";
              const AMBER = "#dd901d";

              const pillBg = isActive
                ? (themeMode === "light" ? PINK : AMBER)
                : (themeMode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.18)");
              const pillBorder = isActive ? "none" : (themeMode === "light" ? "1px solid rgba(0,0,0,0.06)" : "none");
              const pillBoxShadow = isActive
                ? (themeMode === "light" ? PINK_SHADOW : "0 0 0 3px rgba(221, 144, 29, 0.18)")
                : (themeMode === "light" ? "inset 0 -1px 0 rgba(0,0,0,0.02)" : "none");
              const pillWidth = isActive ? "34px" : "20px";
              const pillHeight = isActive ? "10px" : "12px";

              return (
                <button
                  key={`${category.name}-pill`}
                  type="button"
                  aria-label={`Go to ${category.name}`}
                  aria-pressed={isActive}
                  onClick={() => rotateTo(index)}
                  style={{
                    width: pillWidth,
                    height: pillHeight,
                    borderRadius: "999px",
                    border: pillBorder,
                    background: pillBg,
                    boxShadow: pillBoxShadow,
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

const FooterSection = () => (
  <footer className="footer">
    <div className="section-container">
      {/* Contact row */}
      <div className="footer-row">
        <span className="footer-label">
          Contact us
        </span>
        {[
          "beautybookpro33@gmail.com",
          "Anonas Street, Santa Mesa, Manila",
          "09123456789",
          "8AM - 5PM",
        ].map((t,i) => (
          <span key={i} className="footer-text">
            {t}
          </span>
        ))}

      </div>

      {/* Follow row */}
      <div className="footer-row">
        <span className="footer-label">
          Follow us
        </span>
        {[
          /* Facebook */
          <svg key="fb" viewBox="0 0 24 24" fill="none" width="14" height="14">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
              stroke="white" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
          </svg>,
          /* Instagram */
          <svg key="ig" viewBox="0 0 24 24" fill="none" width="16" height="16">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.6" fill="none"/>
            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6" fill="none"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
          </svg>,
        ].map((ic,i) => (
          <div key={i} className="social-icon">{ic}</div>
        ))}
      </div>

      {/* Divider + copyright */}
      <div className="footer-divider">
        <p className="copyright">
          © 2025 BeautyBook Pro. All rights reserved. |Polytechnic University of the Philippines Institute of Technology
        </p>
      </div>
    </div>
  </footer>
);

export default function App() {
  const navigate = useNavigate();
  const handleBook = () => navigate("/operators/login");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const scrollToSection = (id) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 52;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    // Handle hash on initial load
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => scrollToSection(sectionId), 100);
    }

    // Handle hash changes
    const handleHashChange = () => {
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        scrollToSection(sectionId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-wrapper" style={{ zoom: isDesktop ? "150%" : "100%" }}>
      <NavBar onBookAppointment={handleBook}/>
      <HeroSection onBookAppointment={handleBook}/>
      <HowItWorksSection/>
      <ServicesSection/>
      <FooterSection/>
    </div>
  );
}