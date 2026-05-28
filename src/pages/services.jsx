import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const HERO_BG_IMAGE_DARK = new URL("../../images/DarkmodeBG.png", import.meta.url).href;
const HERO_BG_IMAGE_LIGHT = new URL("../../images/LightmodeBG.png", import.meta.url).href;

// ── Service Categories with Descriptions ──────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: "Hair Cut", description: "Professional cutting and styling services tailored to your hair type and preferences", imageLabel: "Category Visual", imageNote: "Primary image: haircut workstation with stylist and client." },
  { id: 2, name: "Styling", description: "Expert styling techniques including blow dry, curling, and hair setting services", imageLabel: "Category Visual", imageNote: "Primary image: styling station with tools and finishing products." },
  { id: 3, name: "Hair Color", description: "Premium hair coloring services from basic to fashion colors for a vibrant look", imageLabel: "Category Visual", imageNote: "Primary image: color application and mixing setup." },
  { id: 4, name: "Highlights", description: "Sophisticated highlights, balayage, and specialty color treatments", imageLabel: "Category Visual", imageNote: "Primary image: highlight foils and specialty color application." },
  { id: 5, name: "Rebonding", description: "Chemical hair treatments including rebonding and permanent straightening", imageLabel: "Category Visual", imageNote: "Primary image: chemical treatment and rebonding station." },
  { id: 6, name: "Treatment", description: "Intensive hair treatments for deep conditioning and restoration", imageLabel: "Category Visual", imageNote: "Primary image: hair treatment setup and care products." },
  { id: 7, name: "Nail Care", description: "Complete manicure and pedicure services with gel and polish options", imageLabel: "Category Visual", imageNote: "Primary image: manicure and pedicure station." },
  { id: 8, name: "Other", description: "Additional beauty services including threading, perming, and cellophane treatments", imageLabel: "Category Visual", imageNote: "Primary image: assorted salon service tools and accessories." },
];

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

// ── Complete Services Data ────────────────────────────────────────────────────
const SERVICES = [
  // Hair Cut
  { id: 1, name: "Hair Cut", price: "₱100", duration: "30 min", category: 1, description: "Professional haircut service designed to enhance your facial features and personal style." },
  { id: 2, name: "Hair Cut + Shampoo & Blowdry", price: "₱200", duration: "45 min", category: 1, description: "Complete hair cut package including professional shampoo and blowdry styling." },
  { id: 3, name: "Gentlemen's Haircut", price: "₱199", duration: "30 min", category: 1, description: "Precision haircut tailored for men with clean lines and professional finishing." },
  { id: 4, name: "Ladies' Haircut & Style", price: "₱199", duration: "45 min", category: 1, description: "Customized haircut with professional styling to achieve your desired look." },
  
  // Styling
  { id: 5, name: "Blow Dry", price: "₱150", duration: "30 min", category: 2, description: "Professional blow drying service to achieve smooth, voluminous, and shiny hair." },
  { id: 6, name: "Hair Iron", price: "₱250", duration: "30 min", category: 2, description: "Expert hair straightening with flat iron to create sleek and polished results." },
  { id: 7, name: "Hair Curling", price: "₱399", duration: "30 min", category: 2, description: "Professional hair curling service for beautiful waves and curls that last." },
  { id: 8, name: "Hair Setting Basic", price: "₱450", duration: "45 min", category: 2, description: "Basic hair setting techniques for elegant waves and structured styles." },
  { id: 9, name: "Hair Iron Styling", price: "₱299", duration: "30 min", category: 2, description: "Advanced styling using hair iron technology for contemporary looks." },
  
  // Hair Color
  { id: 10, name: "Hair Color", price: "₱390", duration: "60 min", category: 3, description: "Single process hair coloring service for uniform, radiant color coverage." },
  { id: 11, name: "Men Regular Colors", price: "₱399", duration: "60 min", category: 3, description: "Professional hair coloring designed specifically for men's hair needs." },
  { id: 12, name: "Women Regular Colors", price: "₱999", duration: "60 min", category: 3, description: "Premium single-process hair coloring for women with vibrant, long-lasting results." },
  { id: 13, name: "Men Fashion Colors", price: "₱1,499", duration: "90 min", category: 3, description: "Trendy fashion colors for men including bold shades and contemporary hues." },
  { id: 14, name: "Women Fashion Colors", price: "₱2,999", duration: "90 min", category: 3, description: "Cutting-edge fashion colors for women to express your unique style." },
  { id: 15, name: "Premium Bleaching", price: "₱650", duration: "90 min", category: 3, description: "Professional bleaching service using premium products for optimal results." },
  { id: 16, name: "Fashion Color (Full)", price: "₱1,500", duration: "90 min", category: 3, description: "Complete hair transformation with full coverage fashion color application." },
  { id: 17, name: "Permanent Color Cello", price: "₱990", duration: "90 min", category: 3, description: "Permanent color treatment with cellophane for enhanced shine and depth." },
  
  // Highlights & Specialty
  { id: 18, name: "Highlights Full Head", price: "₱1,500", duration: "120 min", category: 4, description: "Full head highlights for dimensional color and increased volume appearance." },
  { id: 19, name: "Men Highlights", price: "₱1,499", duration: "120 min", category: 4, description: "Subtle to bold highlights designed specifically for men's styling preferences." },
  { id: 20, name: "Women Highlights", price: "₱9,999", duration: "180 min", category: 4, description: "Premium women's highlights service for sophisticated dimensional color." },
  { id: 21, name: "Women Color + Highlights", price: "₱5,799", duration: "180 min", category: 4, description: "Combined color and highlights service for complete hair transformation." },
  { id: 22, name: "Balayage", price: "₱3,000", duration: "180 min", category: 4, description: "Hand-painted balayage technique for natural-looking, sun-kissed highlights." },
  { id: 23, name: "Ombre", price: "₱3,000", duration: "180 min", category: 4, description: "Gradient color technique creating beautiful transition from dark to light." },
  
  // Rebonding & Chemical Treatments
  { id: 24, name: "Absolute Rebond (Basic + Spa + Vitamins)", price: "₱1,000", duration: "240 min", category: 5, description: "Basic rebonding with spa treatment and vitamin infusion for healthy-looking hair." },
  { id: 25, name: "Absolute Rebond (+ Cello + Vitamins)", price: "₱1,300", duration: "240 min", category: 5, description: "Enhanced rebonding with cellophane and vitamins for silky, shiny results." },
  { id: 26, name: "Absolute Rebond (Complete Treatment)", price: "₱1,500", duration: "270 min", category: 5, description: "Comprehensive rebonding treatment with full spa and conditioning package." },
  { id: 27, name: "Absolute Rebond (+ Permanent Color)", price: "₱2,000", duration: "300 min", category: 5, description: "Rebonding combined with permanent color for transformation in one visit." },
  { id: 28, name: "Absolute Rebond (+ Hair Botox)", price: "₱3,000", duration: "300 min", category: 5, description: "Premium rebonding with hair botox treatment for ultimate restoration." },
  { id: 29, name: "Absolute Rebond (+ Color + Botox)", price: "₱3,500", duration: "360 min", category: 5, description: "Complete transformation package combining rebonding, color, and botox." },
  { id: 30, name: "Organic Rebonding", price: "₱1,499", duration: "240 min", category: 5, description: "Chemical-free organic rebonding for those seeking gentler hair treatments." },
  { id: 31, name: "Matrix Rebonding", price: "₱2,499", duration: "270 min", category: 5, description: "Advanced matrix rebonding technology for superior straightening results." },
  { id: 32, name: "Bangs Rebonding", price: "₱699", duration: "90 min", category: 5, description: "Specialized rebonding treatment for bangs only." },
  
  // Treatments
  { id: 33, name: "Hair Spa", price: "₱300", duration: "60 min", category: 6, description: "Relaxing hair spa treatment for deep conditioning and scalp rejuvenation." },
  { id: 34, name: "Pro Vitamins", price: "₱350", duration: "45 min", category: 6, description: "Professional vitamin treatment to strengthen and nourish hair." },
  { id: 35, name: "Ionic Keratin", price: "₱790", duration: "120 min", category: 6, description: "Ionic keratin treatment for smooth, frizz-free hair with lasting shine." },
  { id: 36, name: "Brazilian Keratin", price: "₱1,500", duration: "180 min", category: 6, description: "Intensive Brazilian keratin treatment for smoothing and protein replenishment." },
  { id: 37, name: "Men Brazilian Keratin", price: "₱819", duration: "150 min", category: 6, description: "Brazilian keratin specifically formulated for men's hair types." },
  { id: 38, name: "Women Brazilian Keratin", price: "₱1,499", duration: "180 min", category: 6, description: "Premium Brazilian keratin treatment for women with enhanced conditioning." },
  { id: 39, name: "Hair Botox", price: "₱1,500", duration: "180 min", category: 6, description: "Revolutionary hair botox treatment for extreme smoothness and repair." },
  { id: 40, name: "Macademia Treatment", price: "₱899", duration: "90 min", category: 6, description: "Luxurious macademia oil treatment for deep nourishment and hydration." },
  { id: 41, name: "Men Hair & Scalp Treatment", price: "₱299", duration: "60 min", category: 6, description: "Specialized treatment targeting men's hair and scalp health concerns." },
  { id: 42, name: "Women Hair & Scalp Treatment", price: "₱499", duration: "60 min", category: 6, description: "Advanced treatment for women's hair vitality and scalp wellness." },
  
  // Nail Care
  { id: 43, name: "Manicure Classic", price: "₱125", duration: "30 min", category: 7, description: "Classic manicure service with nail shaping, cuticle care, and polish." },
  { id: 44, name: "Pedicure Classic", price: "₱125", duration: "30 min", category: 7, description: "Complete pedicure with foot care, nail shaping, and polish application." },
  { id: 45, name: "Gel Manicure", price: "₱400", duration: "60 min", category: 7, description: "Long-lasting gel manicure with professional application and curing." },
  { id: 46, name: "Gel Pedicure", price: "₱400", duration: "60 min", category: 7, description: "Durable gel pedicure that lasts up to three weeks without chipping." },
  { id: 47, name: "Gel Removal", price: "₱200", duration: "30 min", category: 7, description: "Professional gel nail removal service using safe, non-damaging methods." },
  { id: 48, name: "French Tip", price: "₱100", duration: "30 min", category: 7, description: "Classic French tip manicure for an elegant and timeless look." },
  { id: 49, name: "Foot Spa Classic", price: "₱250", duration: "45 min", category: 7, description: "Soothing foot spa with massage and conditioning treatment." },
  { id: 50, name: "Foot Spa + Mani/Pedi", price: "₱500", duration: "90 min", category: 7, description: "Relaxing foot spa combined with full manicure and pedicure service." },
  { id: 51, name: "Foot Spa Gel", price: "₱300", duration: "60 min", category: 7, description: "Foot spa treatment followed by gel polish application." },
  { id: 52, name: "Foot Massage (30 min)", price: "₱200", duration: "30 min", category: 7, description: "Therapeutic foot massage to relieve tension and improve circulation." },
  { id: 53, name: "Poly/Soft Gel Extension -- Basic", price: "₱900", duration: "90 min", category: 7, description: "Basic gel extension service for enhanced nail length and strength." },
  { id: 54, name: "Poly/Soft Gel Extension -- Premium", price: "₱1,200", duration: "120 min", category: 7, description: "Premium gel extension with advanced design and extended wear time." },
  
  // Other Services
  { id: 55, name: "Eyebrow Threading", price: "₱100", duration: "15 min", category: 8, description: "Precise eyebrow threading for clean, defined, and perfectly shaped brows." },
  { id: 56, name: "Perma Gloss", price: "₱350", duration: "60 min", category: 8, description: "Semi-permanent hair gloss treatment for enhanced shine and color depth." },
  { id: 57, name: "Cellophane", price: "₱490", duration: "60 min", category: 8, description: "Cellophane treatment for temporary color and enhanced shine." },
  { id: 58, name: "Washable Cellophane", price: "₱790", duration: "75 min", category: 8, description: "Temporary washable cellophane for color experimentation without commitment." },
  { id: 59, name: "Men Traditional Perming", price: "₱999", duration: "120 min", category: 8, description: "Traditional perming service designed for men's curling preferences." },
  { id: 60, name: "Women Traditional Perming", price: "₱1,499", duration: "150 min", category: 8, description: "Classic perming technique for women seeking long-lasting curls and waves." },
];

// ── Navbar ───────────────────────────────────────────────────────────────────
/* Reuse NavBar (same implementation as other pages) */
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

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/operators/login");
    setMenuOpen(false);
  };

  const handleNavClick = (item) => {
    if (item.label === "Services") {
      navigate("/services");
      setMenuOpen(false);
    } else if (item.label === "How It Works") {
      window.location.href = item.path;
    } else {
      navigate(item.path);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="flex-center-gap-2">
        <div className="logo-badge"><LogoMark/></div>
        <span className="brand-name">BeautyBook Pro</span>
      </div>

      <div className="flex-center-gap-1 nav-links-desktop">
        {[
          {label:"Home", path:"/"},
          {label:"How It Works", path:"/#howitworks"},
        ].map(item => (
          <button key={item.label} onClick={() => handleNavClick(item)} className="nav-link">
            {item.label}
          </button>
        ))}

        <button onClick={() => handleNavClick({label:"Services", path:"/services"})} className="nav-link">Services</button>
        <button onClick={() => handleNavClick({label:"About", path:"/about"})} className="nav-link">About</button>
      </div>

      <div
        className="btn-nav-desktop"
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", gap: 8 }}
      >
        <ThemeToggle />
        <button onClick={handleBooking} className="btn-primary btn-nav">Login</button>
      </div>

      <div className="mobile-auth-actions">
        <ThemeToggle className="mobile-theme-toggle" />
        <button onClick={handleBooking} className="btn-primary btn-nav btn-mobile-cta">Login</button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn mobile-menu-btn-inline" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:20,height:20}}>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {[{label:"Home", path:"/"},{label:"How It Works", path:"/#howitworks"}].map(item => (
              <button key={item.label} onClick={() => { handleNavClick(item); setMenuOpen(false); }} className="mobile-menu-link">
                {item.label}
              </button>
            ))}
            <button onClick={() => { handleNavClick({label:'Services', path:'/services'}); setMenuOpen(false); }} className="mobile-menu-link">Services</button>
            <button onClick={() => { handleNavClick({label:'About', path:'/about'}); setMenuOpen(false); }} className="mobile-menu-link">About</button>
          </div>
        </div>
      )}
    </nav>
  );
};

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { themeMode } = usePublicTheme();
  const heroBackgroundImage = themeMode === "light" ? HERO_BG_IMAGE_LIGHT : HERO_BG_IMAGE_DARK;

  return (
    <section
      id="hero"
      className="hero-section services-hero"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 9, 8, 0.55), rgba(10, 9, 8, 0.72)), url('${heroBackgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <h1 className="hero-title services-hero-title">
        <span className="hero-line-1">Look Good, Feel Good</span>
        <span className="hero-line-2 accent">Without the Wait</span>
      </h1>

      <p className="hero-text">
        Explore our comprehensive catalog of professional beauty and wellness services. Each service includes detailed information, pricing, and duration for your convenience.
      </p>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
const FooterSection = () => (
  <footer className="footer">
    <div className="section-container">
      <div className="footer-row">
        <span className="footer-label">Contact us</span>
        {["Canvas city, Abc st., 245 lot B","(02) 123-4567","beautybookpro@gmail.com","Mon-Fri: 8:00 AM - 5:00 PM"].map((t,i) => (
          <span key={i} className="footer-text">{t}</span>
        ))}
      </div>

      <div className="footer-row">
        <span className="footer-label">Follow us</span>
        {[
          <svg key="fb" viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="white" strokeWidth="1.6" fill="none" strokeLinejoin="round"/></svg>,
          <svg key="ig" viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.6" fill="none"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6" fill="none"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg>
        ].map((ic,i) => (<div key={i} className="social-icon">{ic}</div>))}
      </div>

      <div className="footer-divider">
        <p className="copyright">© 2025 BeautyBook Pro. All rights reserved. | Polytechnic University of the Philippines Institute of Technology</p>
      </div>
    </div>
  </footer>
);

const SERVICES_BY_CATEGORY = CATEGORIES.reduce((accumulator, category) => {
  accumulator[category.id] = SERVICES.filter((service) => service.category === category.id);
  return accumulator;
}, {});

function ServiceCategoryCarousel({ categories, activeCategoryIndex, hoveredCategoryIndex, onHoverCategory, onSelectCategory, isSliding, isCompact }) {
  const { themeMode } = usePublicTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const wheelCooldownRef = useRef(false);
  const containerRef = useRef(null);
  const touchStateRef = useRef({ active: false, startX: 0, startY: 0 });
  const hoverBorderColor = themeMode === "light" ? "rgba(243, 139, 166, 0.88)" : "rgba(221, 144, 29, 0.88)";
  const hoverBoxShadow = themeMode === "light" ? "0 16px 30px rgba(243, 139, 166, 0.28), 0 0 0 1px rgba(243, 139, 166, 0.26)" : "0 16px 30px rgba(221, 144, 29, 0.28), 0 0 0 1px rgba(221, 144, 29, 0.26)";
  const activePillColor = themeMode === "light" ? "#f38ba6" : "#dd901d";
  const inactivePillColor = themeMode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.18)";
  const inactivePillBorder = themeMode === "light" ? "1px solid rgba(0,0,0,0.06)" : "none";
  const activePillShadow = themeMode === "light" ? "0 0 0 3px rgba(243, 139, 166, 0.18)" : "0 0 0 3px rgba(221, 144, 29, 0.18)";
  const inactivePillShadow = themeMode === "light" ? "inset 0 -1px 0 rgba(0,0,0,0.02)" : "none";
  const primaryWidth = isCompact ? "min(78vw, 260px)" : "250px";
  const secondaryWidth = isCompact ? "min(58vw, 190px)" : "176px";
  const primaryHeight = isCompact ? "190px" : "170px";
  const secondaryHeight = isCompact ? "140px" : "126px";

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
      const target = ((activeCategoryIndex + direction) % categories.length + categories.length) % categories.length;
      onSelectCategory(target);
    }

    touchStateRef.current.active = false;
    setIsTouchActive(false);
  };

  // Use a native wheel listener with passive:false so we can reliably prevent page scroll
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
      const target = ((activeCategoryIndex + dir) % categories.length + categories.length) % categories.length;
      onSelectCategory(target);
      wheelCooldownRef.current = true;
      window.setTimeout(() => { wheelCooldownRef.current = false; }, 200);
    };

    el.addEventListener('wheel', listener, { passive: false });
    return () => el.removeEventListener('wheel', listener);
  }, [isHovered, activeCategoryIndex, categories.length, onSelectCategory]);
  const orderedCategories = categories.map((_, offset) => {
    const sourceIndex = (activeCategoryIndex + offset) % categories.length;
    return { sourceIndex, category: categories[sourceIndex] };
  });

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "10px 0", pointerEvents: isSliding ? "none" : "auto", touchAction: "pan-y", WebkitTapHighlightColor: "transparent" }}
    >
      <div className="hide-scrollbar" style={{ display: "flex", alignItems: "center", gap: isCompact ? "12px" : "14px", overflow: "visible", padding: isCompact ? "10px 4px 14px" : "10px 8px 14px", boxShadow: isTouchActive ? "0 0 0 1px rgba(221, 144, 29, 0.18), 0 0 24px rgba(221, 144, 29, 0.12)" : "none", borderRadius: "12px" }}>
        {orderedCategories.map(({ sourceIndex, category }, orderedIndex) => {
          const isHovered = hoveredCategoryIndex === sourceIndex;
          const isPrimary = orderedIndex === 0;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() => onSelectCategory(sourceIndex)}
              onMouseEnter={() => onHoverCategory(sourceIndex)}
              onMouseLeave={() => onHoverCategory(null)}
              style={{
                flex: "0 0 auto",
                width: isPrimary ? primaryWidth : secondaryWidth,
                height: isPrimary ? primaryHeight : secondaryHeight,
                boxSizing: "border-box",
                borderRadius: "8px",
                border: "2px solid #e1d4b8",
                background: themeMode === "light" ? "#fff7f8" : "#181412",
                color: "#171717",
                padding: 0,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "width 320ms cubic-bezier(0.22, 0.61, 0.36, 1), height 320ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 240ms ease, box-shadow 240ms ease, filter 240ms ease, border-color 240ms ease",
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
                  background: themeMode === "light"
                    ? "linear-gradient(180deg, rgba(14, 11, 8, 0.06) 42%, rgba(14, 11, 8, 0.58) 100%)"
                    : "linear-gradient(180deg, rgba(14, 11, 8, 0.1) 42%, rgba(14, 11, 8, 0.7) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "10px",
                  right: "10px",
                  bottom: "9px",
                  color: "#fffaf3",
                  fontFamily: "Inter, sans-serif",
                  fontSize: isPrimary ? "0.9rem" : "0.8rem",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                  textAlign: "left",
                }}
              >
                {category.name}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", width: "100%", justifyContent: "center", gap: "8px", flexWrap: "wrap", transform: "translateX(34px)" }}>
        {categories.map((category, index) => {
          const isActive = index === activeCategoryIndex;
          return (
            <button
              key={`${category.name}-pill`}
              type="button"
              aria-label={`Go to ${category.name}`}
              aria-pressed={isActive}
              onClick={() => onSelectCategory(index)}
              style={{
                width: "20px",
                height: "10px",
                borderRadius: "999px",
                border: isActive ? "none" : inactivePillBorder,
                background: isActive ? activePillColor : inactivePillColor,
                boxShadow: isActive ? activePillShadow : inactivePillShadow,
                transition: "all 0.25s ease",
                cursor: "pointer",
                padding: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ServicePinWheelCarousel({ services, activeServiceIndex, onSelectService, isCompact }) {
  const { themeMode } = usePublicTheme();
  const wheelLockRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const virtualIndexRef = useRef(activeServiceIndex);
  const wheelStepCooldownRef = useRef(false);
  const touchStateRef = useRef({ active: false, startX: 0, startY: 0 });
  const [virtualIndex, setVirtualIndex] = useState(activeServiceIndex);
  const [isUserScroll, setIsUserScroll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const containerRef = useRef(null);

  const visibleCount = Math.min(5, services.length);
  const itemSpacing = 90;
  const activeCardBorder = themeMode === "light" ? "1px solid rgba(243, 139, 166, 0.72)" : "1px solid rgba(221, 144, 29, 0.9)";
  const inactiveCardBorder = themeMode === "light" ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(225, 212, 184, 0.26)";
  const activeCardBackground = themeMode === "light"
    ? "linear-gradient(180deg, rgba(243, 139, 166, 0.36), rgba(255, 231, 238, 0.98))"
    : "linear-gradient(180deg, rgba(221, 144, 29, 0.25), rgba(20, 20, 20, 0.98))";
  const inactiveCardBackground = themeMode === "light" ? "#fff7f8" : "rgba(18, 18, 18, 0.88)";
  const activeCardShadow = themeMode === "light" ? "0 20px 36px rgba(243, 139, 166, 0.18)" : "0 20px 36px rgba(221, 144, 29, 0.18)";
  const inactiveCardShadow = themeMode === "light" ? "0 10px 20px rgba(0, 0, 0, 0.08)" : "0 10px 20px rgba(0, 0, 0, 0.2)";
  const serviceNameColor = themeMode === "light" ? "#111111" : "#f7f1e6";
  const durationColor = themeMode === "light" ? "rgba(17, 17, 17, 0.68)" : "rgba(229, 218, 198, 0.82)";
  const priceColor = themeMode === "light" ? "#f38ba6" : "rgba(247, 241, 230, 0.78)";
  const activePriceColor = themeMode === "light" ? "#f38ba6" : "#f7c669";
  const cardVerticalSpacing = isCompact ? 90 : itemSpacing;
  const cardPaddingX = isCompact ? "12px" : "16px";

  const handleTouchStart = (event) => {
    if (!services.length) return;
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
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
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
    if (Math.abs(deltaY) >= 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      const direction = deltaY < 0 ? 1 : -1;
      const current = Math.round(virtualIndexRef.current);
      const target = ((current + direction) % services.length + services.length) % services.length;
      onSelectService(target);
      virtualIndexRef.current = target;
      setVirtualIndex(target);
      setIsUserScroll(true);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsUserScroll(false);
      }, 260);
    }

    touchStateRef.current.active = false;
    setIsTouchActive(false);
  };

  useEffect(() => () => {
    if (wheelLockRef.current) window.clearTimeout(wheelLockRef.current);
    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
  }, []);

  useEffect(() => {
    // keep virtual index in sync when activeServiceIndex changes externally
    virtualIndexRef.current = activeServiceIndex;
    setVirtualIndex(activeServiceIndex);
  }, [activeServiceIndex]);

  const rotateTo = (targetIndex) => {
    if (!services.length || targetIndex === activeServiceIndex) return;
    onSelectService(targetIndex);
  };

  const handleWheel = (event) => {
    if (!isHovered) return;
    if (!services.length) return;
    event.preventDefault();

    if (wheelStepCooldownRef.current) return;

    const delta = event.deltaY;
    const dir = delta > 0 ? 1 : -1;

    const current = Math.round(virtualIndexRef.current);
    const target = ((current + dir) % services.length + services.length) % services.length;

    // step to next/prev item like category carousel
    onSelectService(target);
    virtualIndexRef.current = target;
    setVirtualIndex(target);
    setIsUserScroll(true);

    wheelStepCooldownRef.current = true;
    window.setTimeout(() => { wheelStepCooldownRef.current = false; }, 220);

    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsUserScroll(false);
    }, 260);
  };

  // Attach native wheel listener to ensure preventDefault works and doesn't scroll the page
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const listener = (e) => handleWheel(e);
    el.addEventListener('wheel', listener, { passive: false });
    return () => el.removeEventListener('wheel', listener);
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        position: "relative",
        minHeight: isCompact ? "220px" : "280px",
        overflow: "visible",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        transform: "none",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
        boxShadow: isTouchActive ? "0 0 0 1px rgba(221, 144, 29, 0.16), 0 0 28px rgba(221, 144, 29, 0.12)" : "none",
        borderRadius: "16px",
      }}
    >
      <div style={{ position: "relative", height: "100%", minHeight: isCompact ? "160px" : "220px", paddingInline: isCompact ? "4px" : 0 }}>
        {services.map((service, index) => {
          let offset = index - virtualIndex;
          if (offset > services.length / 2) offset -= services.length;
          else if (offset < -services.length / 2) offset += services.length;

          const distance = Math.abs(offset);
          const isActive = Math.abs(offset) < 0.5;
          const scale = isActive ? 1 : Math.max(0.82, 1 - distance * 0.06);
          const opacity = Math.max(isUserScroll ? 0.5 : 0.26, 1 - distance * 0.16);

          const maxRenderDistance = isUserScroll ? Math.max(visibleCount + 1, 6) : Math.max(visibleCount / 2 + 1, 3);

          if (distance > maxRenderDistance) {
            return null;
          }

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => rotateTo(index)}
              style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "100%",
                  transform: `translate(-50%, calc(-50% + ${offset * cardVerticalSpacing}px)) scale(${scale})`,
                  opacity,
                  zIndex: 20 - distance,
                  minHeight: "75px",
                  borderRadius: "16px",
                  border: isActive ? activeCardBorder : inactiveCardBorder,
                  background: isActive ? activeCardBackground : inactiveCardBackground,
                  color: themeMode === "light" ? "#111111" : "#f7f1e6",
                  padding: `12px ${cardPaddingX}`,
                  cursor: "pointer",
                  boxShadow: isActive ? activeCardShadow : inactiveCardShadow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "18px",
                  transition: "transform 240ms ease, opacity 240ms ease, background 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
                  pointerEvents: services.length > 5 && distance > 2 ? "none" : "auto",
                }}
            >
              <div style={{ minWidth: 0, textAlign: "left" }}>
                <div style={{ fontSize: "1.06rem", fontWeight: 800, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: serviceNameColor }}>{service.name}</div>
                <div style={{ fontSize: "0.9rem", color: durationColor, marginTop: "4px" }}>{service.duration}</div>
              </div>

              <span style={{ fontSize: "0.9rem", fontWeight: 800, letterSpacing: "0.04em", color: isActive ? activePriceColor : priceColor, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {service.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceDetailsPanel({ service, onBookService, isCompact }) {
  const { themeMode } = usePublicTheme();
  return (
    <div
      style={{
        // Fixed height based on the largest details content (Women Regular Colors)
        height: isCompact ? "240px" : "280px",
        padding: isCompact ? "12px 6px 30px" : "10px 12px 30px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "var(--color-white)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: isCompact ? "1.05rem" : "1.25rem",
          lineHeight: 1.15,
          width: "100%",
          maxWidth: "16rem",
          minHeight: isCompact ? "2.6rem" : "2.9rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          overflowWrap: "anywhere",
        }}
      >
        {service.name}
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", width: isCompact ? "18rem" : "20rem" }}>
        <div style={{ color: themeMode === "light" ? "#000000" : "#a79c8b", fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "none" }}>Category:</div>
        <div style={{ color: themeMode === "light" ? "#000000" : "#f7f1e6", fontSize: "0.86rem", fontWeight: 700, fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{(CATEGORIES.find(c => c.id === service.category) || {}).name || "—"}</div>
      </div>

      <p
        style={{
          margin: 0,
          color: themeMode === "light" ? "#111111" : "#f7f1e6",
          fontSize: isCompact ? "0.94rem" : "1rem",
          lineHeight: 1.35,
          maxWidth: isCompact ? "18rem" : "20rem",
          width: "100%",
          minHeight: isCompact ? "4.05rem" : "4.05rem",
          maxHeight: isCompact ? "4.05rem" : "4.05rem",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          overflowWrap: "anywhere",
        }}
      >
        {service.description}
      </p>

      <div style={{ marginTop: "auto" }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onBookService}
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: isCompact ? "100%" : "180px",
            width: isCompact ? "100%" : "auto",
            height: isCompact ? "44px" : "34px",
            borderRadius: "6px",
            fontSize: "0.88rem",
            padding: "0 18px",
          }}
        >
          Book Service
        </button>
      </div>
    </div>
  );
}

// ── Main Services Page ────────────────────────────────────────────────────────
export default function ServicesPage() {
  const navigate = useNavigate();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState(null);
  const [isCategorySliding, setIsCategorySliding] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const isCompact = !isDesktop;

  const activeCategory = CATEGORIES[activeCategoryIndex];
  const categoryServices = SERVICES_BY_CATEGORY[activeCategory.id] || [];
  const activeService = categoryServices[activeServiceIndex] || categoryServices[0] || SERVICES[0];

  const rotateToCategory = (targetIndex) => {
    if (isCategorySliding || targetIndex === activeCategoryIndex) return;
    setIsCategorySliding(true);
    window.setTimeout(() => {
      setActiveCategoryIndex(targetIndex);
      setIsCategorySliding(false);
    }, 220);
  };

  useEffect(() => {
    setActiveServiceIndex(0);
  }, [activeCategoryIndex]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-wrapper" style={{ zoom: isDesktop ? '150%' : '100%', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      <NavBar />

      {/* Hero */}
      <div className="pt-16">
        <HeroSection />
      </div>

      {/* Main Content Section - Services Three Column Layout */}
      <section id="services" className="services-section">
        <div
          className="service-carousel-shell"
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "minmax(240px, 280px) minmax(0, 1fr) minmax(220px, 300px)" : "1fr",
            gap: isDesktop ? "24px" : "14px",
            alignItems: "start",
            width: isDesktop ? "min(1320px, calc(100% - 32px))" : "100%",
            margin: "0 auto",
            padding: isDesktop ? "0 16px" : "0 12px",
          }}
        >
          {isDesktop ? (
            <>
              <div
                className="service-carousel-copy"
                style={{
                  minWidth: 0,
                  marginTop: isDesktop ? "24px" : "16px",
                }}
              >
                <ServicePinWheelCarousel
                  services={categoryServices}
                  activeServiceIndex={activeServiceIndex}
                  onSelectService={setActiveServiceIndex}
                  isCompact={isCompact}
                />
              </div>

              <div className="service-carousel-panel" style={{ minWidth: 0 }}>
                <div style={{ width: "100%" }}>
                  <div style={{ position: isCompact ? "static" : "sticky", top: isCompact ? "auto" : "80px", zIndex: 40 }}>
                    <ServiceDetailsPanel
                      service={activeService}
                      onBookService={() => navigate("/login")}
                      isCompact={isCompact}
                    />
                  </div>
                </div>
              </div>

              <div className="service-carousel-copy" style={{ minWidth: 0 }}>
                <div>
                  <ServiceCategoryCarousel
                    categories={CATEGORIES}
                    activeCategoryIndex={activeCategoryIndex}
                    hoveredCategoryIndex={hoveredCategoryIndex}
                    onHoverCategory={setHoveredCategoryIndex}
                    onSelectCategory={rotateToCategory}
                    isSliding={isCategorySliding}
                    isCompact={isCompact}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  alignItems: "flex-start",
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "nowrap",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div style={{ flex: "0 0 55%", minWidth: "0" }}>
                  <ServicePinWheelCarousel
                    services={categoryServices}
                    activeServiceIndex={activeServiceIndex}
                    onSelectService={setActiveServiceIndex}
                    isCompact={isCompact}
                  />
                </div>

                <div style={{ flex: "0 0 43%", minWidth: "0" }}>
                  <div style={{ width: "100%" }}>
                    <div style={{ position: "static", top: "auto", zIndex: 40 }}>
                      <ServiceDetailsPanel
                        service={activeService}
                        onBookService={() => navigate("/login")}
                        isCompact={isCompact}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="service-carousel-copy" style={{ minWidth: 0, marginTop: "0", position: "relative", zIndex: 2 }}>
                <div>
                  <ServiceCategoryCarousel
                    categories={CATEGORIES}
                    activeCategoryIndex={activeCategoryIndex}
                    hoveredCategoryIndex={hoveredCategoryIndex}
                    onHoverCategory={setHoveredCategoryIndex}
                    onSelectCategory={rotateToCategory}
                    isSliding={isCategorySliding}
                    isCompact={isCompact}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

