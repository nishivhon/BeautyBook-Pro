import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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

/* ── Problem Icons ── */
const ConflictIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect x="2" y="4" width="8" height="14" rx="1" stroke="black" strokeWidth="1.6" fill="none"/>
    <rect x="14" y="4" width="8" height="14" rx="1" stroke="black" strokeWidth="1.6" fill="none"/>
    <path d="M6 8h12M6 12h12M6 16h12" stroke="black" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="20" cy="6" r="3" stroke="#dd901d" strokeWidth="1.8" fill="none"/>
    <path d="M18 4l4 4M22 4l-4 4" stroke="#dd901d" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const WaitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* clock circle */}
    <circle cx="12" cy="12" r="9.5" stroke="black" strokeWidth="1.7" fill="none"/>
    {/* clock hands */}
    <line x1="12" y1="12" x2="12" y2="7" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="12" y1="12" x2="16.5" y2="12" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
    {/* waiting people */}
    <circle cx="4" cy="18" r="1.5" fill="black"/>
    <path d="M3 20.5v2M5 20.5v2" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="8" cy="19" r="1.5" fill="black"/>
    <path d="M7 21.5v2M9 21.5v2" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const DataIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect x="2" y="2" width="20" height="20" rx="2" stroke="black" strokeWidth="1.7" fill="none"/>
    <line x1="2" y1="6" x2="22" y2="6" stroke="black" strokeWidth="1.5"/>
    <circle cx="6" cy="10" r="1" fill="black"/>
    <circle cx="12" cy="10" r="1" fill="black"/>
    <circle cx="18" cy="10" r="1" fill="black"/>
    <circle cx="6" cy="15" r="1" fill="black"/>
    <circle cx="12" cy="15" r="1" fill="black"/>
    <circle cx="18" cy="15" r="1" fill="black"/>
    <circle cx="6" cy="20" r="1" fill="black"/>
    <circle cx="12" cy="20" r="1" fill="black"/>
  </svg>
);

const CommunicationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* phone outline */}
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 00-.684 1.72M3 5a2 2 0 002 2h3.28" stroke="black" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
    <rect x="4" y="6" width="10" height="12" rx="1.5" stroke="black" strokeWidth="1.6" fill="none"/>
    <circle cx="9" cy="17" r="0.8" fill="black"/>
    {/* message bubbles */}
    <path d="M18 8l-4 2 4 2v-4z" fill="black"/>
    <path d="M20 10h2a1 1 0 011 1v4a1 1 0 01-1 1h-2" stroke="black" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
  </svg>
);

const RetentionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    {/* heart outline */}
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.18L12 21z" stroke="black" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
    {/* upward arrow */}
    <path d="M12 12l-2 2v-4M14 12l2 2v-4" stroke="#dd901d" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Solution Icon ── */
const SolutionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="12" cy="12" r="9.5" stroke="black" strokeWidth="1.7" fill="none"/>
    <path d="M7.5 12l3 3.5L16 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── CheckItem for feature lists ── */
const CheckItem = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:15,height:15,flexShrink:0}}>
    <circle cx="8" cy="8" r="7.2" stroke="#dd901d" strokeWidth="1.3" fill="none"/>
    <path d="M5 8l2.2 2.2L11 5.5" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
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
        <button onClick={() => handleNavClick("/")} className="nav-link">Home</button>
        <button onClick={() => handleNavClick("/about")} className="nav-link">About</button>
      </div>

      {/* CTA - Desktop */}
      <button onClick={() => navigate("/register")} className="btn-primary btn-nav btn-nav-desktop">
        Book Appointment
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <button onClick={() => handleNavClick("/")} className="mobile-menu-link">Home</button>
            <button onClick={() => handleNavClick("/about")} className="mobile-menu-link">About</button>
          </div>
          <button onClick={() => navigate("/register")} className="btn-primary btn-nav btn-mobile-cta">
            Book Appointment
          </button>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => (
  <section className="hero-section">
    <div className="hero-badge">
      <span>ABOUT BEAUTYBOOK PRO</span>
    </div>
    <h1 className="hero-title">
      Transforming Beauty<br/>
      <span className="accent">Business Management</span>
    </h1>
    <p className="hero-text">
      A modern digital solution built for salons, barbershops, and spas to streamline appointments, enhance customer experience, and grow their business smarter.
    </p>
  </section>
);

const OurStorySection = () => (
  <section className="section">
    <div className="section-container">
      <h2 className="section-title">Our Story</h2>
      <div style={{maxWidth:"800px", margin:"0 auto"}}>
        <p className="section-text" style={{fontSize:"1.05rem", lineHeight:"1.8", color:"#555", marginBottom:"1.5rem"}}>
          BeautyBook Pro is a capstone project developed by talented students from the <strong>Polytechnic University of the Philippines Institute of Technology</strong>. We recognized a critical gap in how beauty businesses operate—they were still relying on outdated manual systems for managing appointments and customer relationships.
        </p>
        <p className="section-text" style={{fontSize:"1.05rem", lineHeight:"1.8", color:"#555"}}>
          Our mission was simple: create a modern, intuitive digital solution that empowers salon owners, barbershops, and spas in Sta. Mesa, Manila to operate more efficiently and deliver exceptional customer experiences. BeautyBook Pro is the result of dedication, research, and a genuine passion for digital transformation in the beauty industry.
        </p>
      </div>
    </div>
  </section>
);

const ProblemSection = () => {
  const problems = [
    {icon:<ConflictIcon/>, text:"Scheduling conflicts and double bookings"},
    {icon:<WaitIcon/>, text:"Long customer wait times and poor queue management"},
    {icon:<DataIcon/>, text:"Lack of customer data and service history tracking"},
    {icon:<CommunicationIcon/>, text:"Limited communication between businesses and clients"},
    {icon:<RetentionIcon/>, text:"Poor customer retention due to manual processes"},
  ];

  return (
    <section className="section" style={{backgroundColor:"#14110f", padding:"4rem 1.5rem"}}>
      <div className="section-container">
        <h2 className="section-title">The Problem We Solve</h2>
        <p className="section-subtitle">Beauty businesses face real challenges in the digital age</p>
        
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"2rem", maxWidth:"1000px", margin:"3rem auto 0"}}>
          {problems.map((p, i) => (
            <div key={i} style={{
              padding:"16px",
              backgroundColor:"#14110f",
              border:"1px solid rgba(152, 143, 129, 0.35)",
              borderRadius:"9px",
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              textAlign:"center",
              gap:"1rem",
              transition:"all 0.3s ease",
              cursor:"pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(221, 144, 29, 0.2)";
              e.currentTarget.style.borderColor = "#dd901d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(152, 143, 129, 0.35)";
            }}
            >
              <div style={{width:"60px", height:"60px"}}>
                {p.icon}
              </div>
              <p style={{fontSize:"1rem", color:"#988f81", fontWeight:"500", margin:0}}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
  const features = [
    "Online booking system with real-time availability",
    "Automated SMS reminders and notifications",
    "Customer service history and profiles",
    "Smart queue management for scheduled and walk-in clients",
    "Data-driven insights for business growth",
    "Seamless multi-role access (customers, staff, admins)",
  ];

  return (
    <section className="section">
      <div className="section-container">
        <h2 className="section-title">Our Solution</h2>
        <p className="section-subtitle">Comprehensive features designed for modern beauty businesses</p>
        
        <div style={{maxWidth:"900px", margin:"3rem auto"}}>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"2rem"}}>
            {/* Left column - Text */}
            <div>
              <p style={{fontSize:"1.05rem", lineHeight:"1.8", color:"#555", marginBottom:"1.5rem"}}>
                BeautyBook Pro combines cutting-edge technology with industry best practices to create a unified platform that benefits everyone—business owners, staff, and customers.
              </p>
              <p style={{fontSize:"0.95rem", color:"#777", fontStyle:"italic"}}>
                Our system is built on proven theories in appointment management and customer relationship management (CRM), adapted specifically for the beauty industry.
              </p>
            </div>

            {/* Right column - Features */}
            <div>
              <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
                {features.map((f, i) => (
                  <div key={i} style={{display:"flex", gap:"0.75rem", alignItems:"flex-start"}}>
                    <CheckItem/>
                    <span style={{fontSize:"0.95rem", color:"#555"}}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const team = [
    {id:1, name:"Team Member 1", role:"Full Stack Developer"},
    {id:2, name:"Team Member 2", role:"UI/UX Designer"},
    {id:3, name:"Team Member 3", role:"Backend Developer"},
    {id:4, name:"Team Member 4", role:"Project Manager"},
  ];

  return (
    <section className="section" style={{backgroundColor:"#14110f", padding:"4rem 1.5rem"}}>
      <div className="section-container">
        <h2 className="section-title">Meet The Team</h2>
        <p className="section-subtitle">Passionate PUP IT students behind BeautyBook Pro</p>
        
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"2.5rem", maxWidth:"1000px", margin:"3rem auto"}}>
          {team.map((member) => (
            <div key={member.id} style={{
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              textAlign:"center",
              gap:"1rem",
              transition:"all 0.3s ease",
              cursor:"pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
            >
              {/* Placeholder Image */}
              <div style={{
                width:"180px",
                height:"180px",
                borderRadius:"9px",
                border:"1px solid rgba(152, 143, 129, 0.35)",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:"#999",
                fontSize:"0.9rem",
                fontWeight:"500",
                backgroundColor:"#14110f",
                transition:"all 0.3s ease",
                cursor:"pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(221, 144, 29, 0.15)";
                e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(152, 143, 129, 0.35)";
              }}
              >
                Photo Placeholder
              </div>
              
              <div>
                <h3 style={{fontSize:"1.1rem", fontWeight:"600", color:"#333", margin:"0.5rem 0"}}>
                  {member.name}
                </h3>
                <p style={{fontSize:"0.95rem", color:"#dd901d", fontWeight:"500", margin:0}}>
                  {member.role}
                </p>
              </div>
            </div>
          ))}
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
          © 2025 BeautyBook Pro. All rights reserved. | Polytechnic University of the Philippines Institute of Technology
        </p>
      </div>
    </div>
  </footer>
);

export default function About() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-wrapper" style={{ zoom: isDesktop ? "150%" : "100%" }}>
      <NavBar/>
      <HeroSection/>
      <OurStorySection/>
      <ProblemSection/>
      <SolutionSection/>
      <TeamSection/>
      <FooterSection/>
    </div>
  );
}
