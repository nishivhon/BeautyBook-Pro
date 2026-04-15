import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

/* ── NAVBAR logo: scissors <> mark (white strokes on amber bg) ── */
const LogoMark = () => (
  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:22,height:22}}>
    {/* left pivot rings */}
    <circle cx="6"  cy="21" r="4" stroke="black" strokeWidth="2" fill="none"/>
    <circle cx="6"  cy="9"  r="4" stroke="black" strokeWidth="2" fill="none"/>
    {/* blade crossing to the right */}
    <path d="M10 18.5 L28 7"  stroke="black" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 11.5 L28 23" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    {/* inner filled dots */}
    <circle cx="6"  cy="21" r="1.6" fill="black"/>
    <circle cx="6"  cy="9"  r="1.6" fill="black"/>
  </svg>
);

/* ── How It Works: CALENDAR ── */
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* outer box */}
    <rect x="2" y="4" width="20" height="18" rx="2" stroke="black" strokeWidth="1.8" fill="none"/>
    {/* header divider */}
    <line x1="2" y1="10" x2="22" y2="10" stroke="black" strokeWidth="1.8"/>
    {/* hanger pins */}
    <path d="M8 2v4M16 2v4" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
    {/* date dots — 2 rows */}
    <circle cx="7"  cy="14.5" r="1" fill="black"/>
    <circle cx="12" cy="14.5" r="1" fill="black"/>
    <circle cx="17" cy="14.5" r="1" fill="black"/>
    <circle cx="7"  cy="19"   r="1" fill="black"/>
    <circle cx="12" cy="19"   r="1" fill="black"/>
  </svg>
);

/* ── How It Works: BELL with notification badge + checkmark ── */
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* bell body */}
    <path
      d="M5 15V10a7 7 0 0 1 14 0v5l2 2H3l2-2z"
      stroke="black" strokeWidth="1.8" fill="none" strokeLinejoin="round"
    />
    {/* clapper */}
    <path d="M10 19a2 2 0 0 0 4 0" stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    {/* notification badge circle top-right */}
    <circle cx="17.5" cy="6.5" r="4" fill="#dd901d"/>
    {/* tiny check inside badge */}
    <path d="M15.8 6.5l1.2 1.2 2-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── How It Works: CIRCLE CHECK ── */
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.8" fill="none"/>
    <path d="M7.5 12l3 3.5 6-7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
    navigate("/register");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="flex-center-gap-2">
        <div className="logo-badge">
          <LogoMark/>
        </div>
        <span className="brand-name">
          BeautyBook Pro
        </span>
      </div>

      {/* Mobile menu button */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)} 
        className="mobile-menu-btn"
        aria-label="Toggle menu"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:20,height:20}}>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Nav links - Desktop */}
      <div className="flex-center-gap-1 nav-links-desktop">
        {[
          {label:"Home",       id:"home"},
          {label:"Services",   id:"services"},
          {label:"How It Works",id:"howitworks"},
          {label:"About",      id:"about"},
        ].map(item => (
          <button key={item.id} onClick={() => scrollToSection(item.id)} className="nav-link">
            {item.label}
          </button>
        ))}
      </div>

      {/* CTA - Desktop */}
      <button onClick={handleBooking} className="btn-primary btn-nav btn-nav-desktop">
        Book Appointment
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {[
              {label:"Home",       id:"home"},
              {label:"Services",   id:"services"},
              {label:"How It Works",id:"howitworks"},
              {label:"About",      id:"about"},
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => scrollToSection(item.id)} 
                className="mobile-menu-link"
              >
                {item.label}
              </button>
            ))}
          </div>
          <button onClick={handleBooking} className="btn-primary btn-nav btn-mobile-cta">
            Book Appointment
          </button>
        </div>
      )}
    </nav>
  );
};

const HeroSection = ({ onBookAppointment }) => (
  <section id="home" className="hero-section">
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
    <button onClick={onBookAppointment} className="btn-large btn-hero">
      Book Appointment
    </button>
  </section>
);

const HowItWorksSection = () => {
  const steps = [
    {icon:<CalendarIcon/>,   title:"Book Online",    desc:"Select your service, preferred stylist, and convenient time slot"},
    {icon:<BellIcon/>,       title:"Get Notified",   desc:"Receive real-time updates and \u2018Your Turn Soon\u2019 alerts"},
    {icon:<CheckCircleIcon/>,title:"Enjoy Service",  desc:"Arrive on time and skip the traditional waiting queue"},
  ];
  return (
    <section id="howitworks" className="howitworks-section">
      <h2 className="section-title">How BeautyBook Pro Works</h2>
      <p className="section-subtitle">Simple, efficient digital booking appointment for modern salon businesses</p>

      <div className="grid-3col">
        {steps.map((s,i) => (
          <div key={i} className="step-card">
            <div className="icon-box">{s.icon}</div>
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

const ServicesSection = () => {
  const row1 = [
    {icon:<ScissorsIcon/>, title:"Haircut Services",   items:["Haircut & Styling","Hair Color","Hair Treatment","Beard Trimming"]},
    {icon:<NailIcon/>,     title:"Nail Services",      items:["Manicures","Pedicures","Nail Enhancement","Nail Art & Design"]},
    {icon:<SkinIcon/>,     title:"Skin Care Services", items:["Facial Treatments","Advance Treatments","Specialized Facials","Body Treatment"]},
  ];
  const row2 = [
    {icon:<MassageIcon/>,  title:"Massage Services",   items:["Swedish Massage","Deep Tissue Massage","Hot Stone Massage","Foot Reflexology"]},
    {icon:<StarIcon/>,     title:"Premium Services",   items:["Bridal Package","Couple's Massage","Hair & Glow Combo","VIP Lounge Experience"]},
  ];
  return (
    <section id="services" className="services-section">
      <h2 className="section-title">Our Services</h2>
      <p className="section-subtitle">Professional grooming services tailored to your style</p>

      <div className="section-flex-col">
        <div className="grid-auto">
          {row1.map((s,i) => <SvcCard key={i} {...s}/>)}
        </div>
        <div className="grid-2col">
          {row2.map((s,i) => <SvcCard key={i} {...s}/>)}
        </div>
      </div>
    </section>
  );
};

const FooterSection = () => (
  <footer id="about" className="footer">
    <div className="section-container">
      {/* Contact row */}
      <div className="footer-row">
        <span className="footer-label">
          Contact us
        </span>
        {["Canvas city, Abc st., 245 lot B","(02) 123-4567","beautybookpro@gmail.com","Mon-Fri: 8:00 AM - 5:00 PM"].map((t,i) => (
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
  const handleBook = () => navigate("/register");

  return (
    <div className="app-wrapper">
      <NavBar onBookAppointment={handleBook}/>
      <HeroSection onBookAppointment={handleBook}/>
      <HowItWorksSection/>
      <ServicesSection/>
      <FooterSection/>
    </div>
  );
}