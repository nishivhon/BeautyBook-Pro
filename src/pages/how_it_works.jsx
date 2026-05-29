import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicTheme } from "../theme/publicThemeContext";
import { ThemeToggle } from "../components/public/ThemeToggle";

const HERO_BG_IMAGE_DARK = new URL("../../images/DarkmodeBG.png", import.meta.url).href;
const HERO_BG_IMAGE_LIGHT = new URL("../../images/LightmodeBG.png", import.meta.url).href;

const STEP_IMAGES = {
  booking: new URL(
    "../../images/HowItWorks/Tuğçe Senetci _ Interior Design (@ts_interiordesign) · Instagram 照片和视频.jpg",
    import.meta.url
  ).href,
  service: new URL("../../images/HowItWorks/mechas.jpg", import.meta.url).href,
  notify: new URL("../../images/HowItWorks/download (4).jpg", import.meta.url).href,
  finish: new URL("../../images/HowItWorks/Gilded Aqua Marble Manicure.jpg", import.meta.url).href,
};

// PAGE_STYLES moved to `src/styles/tailwind.css` to centralize styles.

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

const CheckItem = ({ lightMode = false }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 13, height: 13, flexShrink: 0 }}
  >
    {lightMode ? (
      <>
        <circle
          cx="8"
          cy="8"
          r="6.25"
          stroke="#f38ba6"
          strokeWidth="0.55"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
        <path
          d="M4.95 8.15l2.05 2.05 3.75-4.55"
          stroke="#f38ba6"
          strokeWidth="0.65"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <circle
          cx="8"
          cy="8"
          r="7.15"
          stroke="#dd901d"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
        <path
          d="M5.25 8.1l2 2L10.8 5.9"
          stroke="#dd901d"
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
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
  { id: "hrs", text: "Monday to Sunday: 8:00 AM - 8:00 PM" },
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

// Styles for this page were moved to `src/styles/tailwind.css`.

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

      <div className="flex-center-gap-1 nav-links-desktop">
        {NAV_ITEMS.map((item) => (
          <button key={item.label} onClick={() => handleNavClick(item)} className="nav-link">
            {item.label}
          </button>
        ))}
      </div>

      <div
        className="btn-nav-desktop"
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", gap: 8 }}
      >
        <ThemeToggle />
        <button onClick={handleBooking} className="btn-primary btn-nav">
          Login
        </button>
      </div>

      <div className="mobile-auth-actions">
        <ThemeToggle className="mobile-theme-toggle" />
        <button onClick={handleBooking} className="btn-primary btn-nav btn-mobile-cta">
          Login
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn mobile-menu-btn-inline" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {NAV_ITEMS.map((item) => (
              <button key={item.label} onClick={() => handleNavClick(item)} className="mobile-menu-link">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const { themeMode } = usePublicTheme();
  const heroBackgroundImage = themeMode === "light" ? HERO_BG_IMAGE_LIGHT : HERO_BG_IMAGE_DARK;

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 9, 8, 0.55), rgba(10, 9, 8, 0.72)), url('${heroBackgroundImage}')`,
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
          color: themeMode === "light" ? "#0c0a09" : "#fff",
          maxWidth: 920,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1 className="hero-title">
          <span className="hero-line-1">Book Smart</span>
          <span className="hero-line-2">Get Glamorous. No Wait</span>
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
  const { themeMode } = usePublicTheme();
  const isLightMode = themeMode === "light";

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
                  <span className="hiw-item-icon"><CheckItem lightMode={isLightMode} /></span>
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
  const { themeMode } = usePublicTheme();


  useLayoutEffect(() => {
    const resetToTop = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    resetToTop();
    const raf1 = window.requestAnimationFrame(() => {
      resetToTop();
      window.requestAnimationFrame(resetToTop);
    });

    return () => {
      window.cancelAnimationFrame(raf1);
    };
  }, []);

  return (
    <main
      className="hiw-page-root"
      style={{
        background: themeMode === "light" ? "#f5f0e8" : "#060505",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Navbar />
      <HeroSection />
      <JourneySection />
      <Footer />
    </main>
  );
}