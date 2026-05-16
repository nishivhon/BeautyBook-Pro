import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const HERO_BG_IMAGE = "/images/DarkmodeBG.png";

const STEP_IMAGES = {
  booking: new URL(
    "../../images/HowItWorks/Tuğçe Senetci _ Interior Design (@ts_interiordesign) · Instagram 照片和视频.jpg",
    import.meta.url
  ).href,
  service: new URL("../../images/HowItWorks/mechas.jpg", import.meta.url).href,
  notify: new URL("../../images/HowItWorks/download (4).jpg", import.meta.url).href,
  finish: new URL("../../images/HowItWorks/Gilded Aqua Marble Manicure.jpg", import.meta.url).href,
};

const PAGE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  .hiw-highlights {
    width: 100%;
    background: #060505;
    padding: 72px 0 28px;
  }

  .hiw-page-root {
    zoom: 1.5;
  }

  .hiw-highlights-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 80px;
  }

  .hiw-feature-strip {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -90px; /* restored: push cards lower so they sit below hero content */
    width: min(92%, 940px);
    z-index: 4;
  }

  .hiw-feature-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    background: rgba(18, 16, 15, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    min-height: 110px;
    max-width: 280px;
    margin: 0 auto;
    align-items: flex-start;
    box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    transition: all 0.3s ease;
    cursor: pointer;
    animation: hiwFeatureCardIn 520ms ease both;
  }

  .hiw-feature-card:nth-child(2) { animation-delay: 70ms; }
  .hiw-feature-card:nth-child(3) { animation-delay: 140ms; }

  .hiw-feature-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(221, 144, 29, 0.2);
    border-color: var(--color-amber);
  }

  @keyframes hiwFeatureCardIn {
    from {
      opacity: 0;
      transform: translateY(14px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .hiw-feature-icon {
    width: 30px;
    height: 30px;
    padding: 6px;
    box-sizing: border-box;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-amber);
    margin-left: 4px;
  }

  .hiw-feature-icon svg {
    width: 10px;
    height: 10px;
    display: block;
  }

  .hiw-feature-title {
    margin: 0;
    color: var(--color-white);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1rem;
    font-weight: 700;
    align-self: center;
    text-align: center;
  }

  .hiw-feature-desc {
    margin: 0;
    color: var(--color-tan);
    font-family: Inter, sans-serif;
    font-size: 0.78rem;
    text-align: center;
    line-height: 1.55;
  }

  .hiw-journey {
    padding-top: 56px;
  }

  .hiw-section {
    background: #060505;
    padding: 0 0 76px;
  }

  .hiw-section:first-of-type {
    padding-top: 12px;
  }

  .hiw-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
    gap: clamp(1.5rem, 4vw, 4rem);
    align-items: center;
  }

  .hiw-grid.reverse {
    grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.05fr);
  }

  .hiw-grid.reverse .hiw-media {
    order: 2;
  }

  .hiw-grid.reverse .hiw-copy {
    order: 1;
  }

  .hiw-row {
    display: flex;
    align-items: center;
    gap: 64px;
    width: 100%;
  }

  .hiw-row.reverse {
    flex-direction: row-reverse;
  }

  .hiw-media {
    flex: 0 0 380px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hiw-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .hiw-step-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 14px;
    border-radius: 20px;
    background: rgba(221, 144, 29, 0.1);
    border: 1px solid rgba(221, 144, 29, 0.3);
    width: fit-content;
  }

  .hiw-step-label {
    font-family: Inter, sans-serif;
    font-weight: 500;
    font-size: 0.68rem;
    color: rgba(221, 144, 29, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }

  .hiw-section-title {
    margin: 0;
    color: var(--color-white);
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 700;
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    line-height: 1.2;
  }

  .hiw-intro {
    margin: 0;
    color: var(--color-tan);
    font-family: Inter, sans-serif;
    font-size: 0.94rem;
    line-height: 1.7;
  }

  .hiw-photo-wrap {
    position: relative;
    width: 340px;
    height: 340px;
    flex-shrink: 0;
    animation: hiwPhotoFloat 6s ease-in-out infinite;
    will-change: transform;
  }

  @keyframes hiwPhotoFloat {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }

  .hiw-photo-circle {
    position: absolute;
    inset: 35px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(221, 144, 29, 0.3);
    box-shadow: 0 0 0 12px rgba(221, 144, 29, 0.05), 0 20px 60px rgba(0, 0, 0, 0.6);
  }

  .hiw-photo-booking   { background: radial-gradient(circle at 60% 35%, #8b5e1a 0%, #4a2e08 45%, #1a0d03 100%); }
  .hiw-photo-dashboard { background: radial-gradient(circle at 45% 55%, #c47a20 0%, #5a3510 50%, #1a0d03 100%); }
  .hiw-photo-service   { background: radial-gradient(circle at 55% 40%, #7a4a18 0%, #3d2009 50%, #1a0d03 100%); }
  .hiw-photo-staff     { background: radial-gradient(circle at 40% 50%, #6a3e14 0%, #341a06 50%, #1a0d03 100%); }

  .hiw-photo-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hiw-orb {
    position: absolute;
    border-radius: 50%;
    background: var(--color-amber);
    opacity: 0.85;
    animation-name: hiwOrbFloat;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    will-change: transform;
  }
  .hiw-orb.tl    { width: 52px; height: 52px; top: 12px; left: 14px; animation-duration: 5.4s; animation-delay: -0.6s; }
  .hiw-orb.tr    { width: 68px; height: 68px; top: 8px; right: 10px; animation-duration: 6.2s; animation-delay: -1.1s; }
  .hiw-orb.bl    { width: 36px; height: 36px; bottom: 24px; left: 20px; animation-duration: 4.8s; animation-delay: -0.4s; }
  .hiw-orb.br    { width: 44px; height: 44px; bottom: 18px; right: 18px; animation-duration: 5.9s; animation-delay: -1.7s; }
  .hiw-orb.tr-sm { width: 28px; height: 28px; top: 60px; right: 28px; opacity: 0.55; animation-duration: 4.4s; animation-delay: -1.3s; }
  .hiw-orb.br-sm { width: 24px; height: 24px; bottom: 60px; right: 30px; opacity: 0.55; animation-duration: 5.1s; animation-delay: -2.1s; }

  @keyframes hiwOrbFloat {
    0% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-8px) translateX(2px);
    }
    100% {
      transform: translateY(0) translateX(0);
    }
  }

  .hiw-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.45rem 0.95rem;
    margin-bottom: 1rem;
    border-radius: 999px;
    border: 1px solid rgba(221, 144, 29, 0.28);
    background: rgba(221, 144, 29, 0.07);
    color: var(--color-amber);
    font-family: Inter, sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .hiw-num {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-amber);
  }

  .hiw-title {
    margin: 0;
    color: var(--color-white);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.65rem, 2.6vw, 2.4rem);
    line-height: 1.12;
  }

  .hiw-copy-text {
    margin: 0;
    color: var(--color-tan);
    font-family: Inter, sans-serif;
    font-size: 0.95rem;
    line-height: 1.8;
  }

  .hiw-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0;
    margin: 0;
  }

  .hiw-item {
    display: flex;
    gap: 0.8rem;
    align-items: flex-start;
    padding: 0.9rem 0.95rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(152, 143, 129, 0.14);
    transition: transform 0.24s ease, border-color 0.24s ease, background 0.24s ease, box-shadow 0.24s ease;
  }

  .hiw-item:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(221, 144, 29, 0.45);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
  }

  .hiw-item strong {
    color: var(--color-white);
  }

  .hiw-item-icon {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    margin-top: 1px;
    color: var(--color-amber);
    transition: transform 0.24s ease, filter 0.24s ease;
  }

  .hiw-item:hover .hiw-item-icon {
    transform: scale(1.08);
    filter: drop-shadow(0 0 4px rgba(221, 144, 29, 0.35));
  }

  .hiw-item:hover .hiw-copy-text {
    color: rgba(244, 231, 207, 0.98);
  }

  .hiw-photo-shell {
    position: relative;
    width: min(100%, 430px);
    aspect-ratio: 1 / 1;
    border-radius: 32px;
    overflow: hidden;
    border: 1px solid rgba(221, 144, 29, 0.22);
    background: #110f0d;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.48);
  }

  .hiw-photo-shell::after {
    content: "";
    position: absolute;
    inset: auto -24px -24px auto;
    width: 120px;
    height: 120px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(221, 144, 29, 0.22) 0%, rgba(221, 144, 29, 0.05) 55%, transparent 72%);
    pointer-events: none;
  }

  .hiw-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: saturate(0.95) contrast(1.02);
  }

  .hiw-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(6, 5, 5, 0.08), rgba(6, 5, 5, 0.34));
  }

  .hiw-dot {
    position: absolute;
    border-radius: 50%;
    background: var(--color-amber);
    opacity: 0.82;
  }

  .hiw-dot.one {
    width: 72px;
    height: 72px;
    top: -20px;
    left: -18px;
  }

  .hiw-dot.two {
    width: 34px;
    height: 34px;
    bottom: 22px;
    right: -8px;
    opacity: 0.7;
  }

  .hiw-dot.three {
    width: 20px;
    height: 20px;
    top: 42px;
    right: 26px;
    opacity: 0.55;
  }

  .hiw-reveal {
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .hiw-reveal.hidden {
    opacity: 0;
    transform: translateY(26px);
  }

  .hiw-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 900px) {
    .hiw-page-root {
      zoom: 1;
    }

    .hiw-highlights-inner {
      padding: 0 20px;
    }

    .hiw-feature-strip {
      grid-template-columns: 1fr;
      max-width: 100%;
      position: static;
      transform: none;
      bottom: auto;
      margin-top: 18px;
    }

    .hiw-journey {
      padding-top: 20px;
    }

    .hiw-grid,
    .hiw-grid.reverse {
      grid-template-columns: 1fr;
    }

    .hiw-grid.reverse .hiw-media,
    .hiw-grid.reverse .hiw-copy {
      order: initial;
    }

    .hiw-media {
      display: flex;
      justify-content: center;
    }

    .hiw-photo-shell {
      max-width: 540px;
    }

    .hiw-row,
    .hiw-row.reverse {
      flex-direction: column;
      gap: 30px;
    }

    .hiw-media {
      flex-basis: auto;
    }

    .hiw-photo-wrap {
      width: 300px;
      height: 300px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hiw-feature-card {
      animation: none;
      transition: none;
    }

    .hiw-photo-wrap {
      animation: none;
    }

    .hiw-orb {
      animation: none;
    }
  }
`;

const LogoMark = () => (
  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
    <circle cx="6" cy="21" r="4" stroke="black" strokeWidth="2" fill="none" />
    <circle cx="6" cy="9" r="4" stroke="black" strokeWidth="2" fill="none" />
    <path d="M10 18.5 L28 7" stroke="black" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 11.5 L28 23" stroke="black" strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="21" r="1.6" fill="black" />
    <circle cx="6" cy="9" r="1.6" fill="black" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect x="2" y="4" width="20" height="18" rx="2" stroke="black" strokeWidth="1.8" fill="none" />
    <line x1="2" y1="10" x2="22" y2="10" stroke="black" strokeWidth="1.8" />
    <path d="M8 2v4M16 2v4" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="7" cy="14.5" r="1" fill="black" />
    <circle cx="12" cy="14.5" r="1" fill="black" />
    <circle cx="17" cy="14.5" r="1" fill="black" />
    <circle cx="7" cy="19" r="1" fill="black" />
    <circle cx="12" cy="19" r="1" fill="black" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <path d="M5 15V10a7 7 0 0 1 14 0v5l2 2H3l2-2z" stroke="black" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
    <path d="M10 19a2 2 0 0 0 4 0" stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="17.5" cy="6.5" r="4" fill="#dd901d" />
    <path d="M15.8 6.5l1.2 1.2 2-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.8" fill="none" />
    <path d="M7.5 12l3 3.5 6-7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" stroke="black" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    <circle cx="18.3" cy="17.1" r="1.4" fill="black" />
    <circle cx="5.7" cy="17.4" r="1" fill="black" />
  </svg>
);

const CheckItem = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 15, height: 15, flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7.2" stroke="#dd901d" strokeWidth="1.3" fill="none" />
    <path d="M5 8l2.2 2.2L11 5.5" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FEATURE_CARDS = [
  { title: "Book Online", desc: "Select your service, preferred stylist, and convenient time slot", icon: <CalendarIcon /> },
  { title: "Get Notified", desc: "Receive real-time updates and ‘Your Turn Soon’ alerts", icon: <BellIcon /> },
  { title: "Enjoy Service", desc: "Arrive on time and skip the traditional waiting queue", icon: <CheckCircleIcon /> },
];

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
];

const JOURNEY_STEPS = [
  {
    id: "book",
    number: "01",
    label: "Book Online",
    title: "Book an Appointment in Seconds",
    intro:
      "Skip the phone calls and walk-in uncertainty. With BeautyBook Pro, scheduling your next haircut, color, or spa service is fast and hassle-free.",
    bullets: [
      "Choose your service and see real-time availability of staff and time slots.",
      "Enter your details and get instant confirmation with a unique reference number.",
      "No more double bookings - the system automatically checks staff availability and prevents conflicts.",
    ],
    image: STEP_IMAGES.booking,
    imageAlt: "Elegant salon interior with soft lighting and styling stations",
    reverse: false,
    variant: "booking",
  },
  {
    id: "confirm",
    number: "02",
    label: "Get Notified",
    title: "Manage Everything from Your Customer Dashboard",
    intro:
      "Your personal customer portal gives you full control over your salon journey with powerful features designed to save you time.",
    bullets: [
      "View your transaction history and profile, including digital receipts of past appointments.",
      "Submit star-rating feedback and apply coupons during booking.",
      "Your service history is always saved, so staff can personalize your next visit.",
    ],
    image: STEP_IMAGES.service,
    imageAlt: "Hair highlighting and foil application in a salon",
    reverse: true,
    variant: "dashboard",
  },
  {
    id: "arrive",
    number: "03",
    label: "Arrive On Time",
    title: "Show Up & Enjoy Your Service",
    intro:
      "After booking, BeautyBook Pro keeps you informed every step of the way so you never have to wait anxiously.",
    bullets: [
      "Receive SMS reminders when your appointment is approaching or when you’re next in line.",
      "Walk-in coordination lets staff add you to the digital queue with real-time updates.",
      "No more waiting anxiety - you’ll know exactly when to arrive.",
    ],
    image: STEP_IMAGES.notify,
    imageAlt: "Hair washing and service preparation in a dark salon basin",
    reverse: false,
    variant: "service",
  },
  {
    id: "enjoy",
    number: "04",
    label: "Enjoy Service",
    title: "Behind the Scenes for Salon Owners & Staff",
    intro:
      "While customers enjoy a smooth booking experience, salon teams benefit from powerful management tools.",
    bullets: [
      "Real-time dashboard and queue management help staff view appointments and customer history side by side.",
      "Customer database and performance analytics make service history accessible for personalized care.",
      "Data-driven decisions help salons improve efficiency and build customer loyalty.",
    ],
    image: STEP_IMAGES.finish,
    imageAlt: "Salon interior with premium styling stations and warm lighting",
    reverse: true,
    variant: "staff",
  },
];

const CONTACTS = [
  { id: "addr", text: "Canvas city, Abc st., 245 lot B" },
  { id: "phone", text: "(02) 123-4567", href: "tel:021234567" },
  { id: "email", text: "beautybookpro@gmail.com", href: "mailto:beautybookpro@gmail.com" },
  { id: "hrs", text: "Mon-Fri: 8:00 AM - 5:00 PM" },
];

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function usePageStyles() {
  useEffect(() => {
    const styleId = "how-it-works-page-styles";
    if (document.getElementById(styleId)) return;

    const element = document.createElement("style");
    element.id = styleId;
    element.textContent = PAGE_STYLES;
    document.head.appendChild(element);

    return () => document.getElementById(styleId)?.remove();
  }, []);
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/operators/login");
    setMenuOpen(false);
  };

  const handleNavClick = (item) => {
    navigate(item.path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="flex-center-gap-2">
        <div className="logo-badge">
          <LogoMark />
        </div>
        <span className="brand-name">BeautyBook Pro</span>
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" aria-label="Toggle menu">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="flex-center-gap-1 nav-links-desktop">
        {NAV_ITEMS.map((item) => (
          <button key={item.label} onClick={() => handleNavClick(item)} className="nav-link">
            {item.label}
          </button>
        ))}
      </div>

      <button onClick={handleBooking} className="btn-primary btn-nav btn-nav-desktop">
        Login
      </button>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {NAV_ITEMS.map((item) => (
              <button key={item.label} onClick={() => handleNavClick(item)} className="mobile-menu-link">
                {item.label}
              </button>
            ))}
          </div>
          <button onClick={handleBooking} className="btn-primary btn-nav btn-mobile-cta">
            Login
          </button>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 9, 8, 0.55), rgba(10, 9, 8, 0.72)), url('${HERO_BG_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(6, 6, 6, 0.38)", zIndex: 0 }} />

      <div
        style={{
          position: "relative",
          zIndex: 6,
          color: "#fff",
          maxWidth: 920,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1 className="hero-title" style={{ color: "#fff" }}>
          Book Smart. <span className="accent">Get Glamorous.</span>
          <br />
          <span>No</span> <span className="accent">Wait</span>
        </h1>

        <p className="hero-text" style={{ marginTop: 10, marginBottom: 90, maxWidth: 760 }}>
          BeautyBook Pro turns salon scheduling into a clear, modern journey. Customers book online, receive timely updates, arrive with confidence, and enjoy service without the friction of manual queue handling.
        </p>
        
        <div style={{ marginTop: 28 }} className="hiw-feature-strip">
          {FEATURE_CARDS.map((card) => (
            <div key={card.title} className="hiw-feature-card hiw-reveal visible">
              <div className="hiw-feature-icon">{card.icon}</div>
              <h3 className="hiw-feature-title">{card.title}</h3>
              <p className="hiw-feature-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyStep({ step, index }) {
  return (
    <section className="hiw-section">
      <div className="section-container">
        <div className={`hiw-row${step.reverse ? " reverse" : ""}`}>
          <div className="hiw-media">
            <div className="hiw-photo-wrap">
              <div className={`hiw-photo-circle hiw-photo-${step.variant}`}>
                <img src={step.image} alt={step.imageAlt} />
              </div>
              <span className="hiw-orb tl" />
              <span className="hiw-orb tr" />
              <span className="hiw-orb bl" />
              <span className="hiw-orb br" />
              <span className="hiw-orb tr-sm" />
              <span className="hiw-orb br-sm" />
            </div>
          </div>

          <div className="hiw-body">
            <div className="hiw-step-pill">
              <span className="hiw-num">{step.number}</span>
              <span className="hiw-step-label">Step</span>
            </div>
            <h2 className="hiw-section-title">{step.title}</h2>
            <p className="hiw-intro">{step.intro}</p>
            <ul className="hiw-list">
              {step.bullets.map((bullet) => (
                <li key={bullet} className="hiw-item">
                  <span className="hiw-item-icon"><CheckItem /></span>
                  <p className="hiw-copy-text" style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>
                    {bullet}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <div className="hiw-journey">
      {JOURNEY_STEPS.map((step, index) => (
        <JourneyStep key={step.id} step={step} index={index} />
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer" aria-label="Footer contact information">
      <div className="section-container">
        <div className="footer-row">
          <span className="footer-label">Contact us</span>
          {CONTACTS.map((contact) =>
            contact.href ? (
              <a key={contact.id} href={contact.href} className="footer-text footer-link">
                {contact.text}
              </a>
            ) : (
              <span key={contact.id} className="footer-text">
                {contact.text}
              </span>
            )
          )}
        </div>

        <div className="footer-row">
          <span className="footer-label">Follow us</span>
          {[
            <svg key="fb" viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="white" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
            </svg>,
            <svg key="ig" viewBox="0 0 24 24" fill="none" width="16" height="16">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.6" fill="none" />
              <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6" fill="none" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
            </svg>,
          ].map((icon, index) => (
            <div key={index} className="social-icon">
              {icon}
            </div>
          ))}
        </div>

        <div className="footer-divider">
          <p className="copyright">
            © 2025 BeautyBook Pro. All rights reserved. | Polytechnic University of the Philippines Institute of Technology
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HowItWorksPage() {
  usePageStyles();

  return (
    <main className="hiw-page-root" style={{ background: "#060505", minHeight: "100vh", width: "100%" }}>
      <Navbar />
      <HeroSection />
      <JourneySection />
      <Footer />
    </main>
  );
}