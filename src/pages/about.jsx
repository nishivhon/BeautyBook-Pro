import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePublicTheme } from "../theme/publicThemeContext";
import { ThemeToggle } from "../components/public/ThemeToggle";

const HERO_BG_IMAGE_DARK = new URL("../../images/DarkmodeBG.png", import.meta.url).href;
const HERO_BG_IMAGE_LIGHT = new URL("../../images/LightmodeBG.png", import.meta.url).href;

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
const CheckItem = ({ lightMode = false }) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:13,height:13,flexShrink:0}}>
    {lightMode ? (
      <>
        <circle cx="8" cy="8" r="6.25" stroke="#000000" strokeWidth="0.55" vectorEffect="non-scaling-stroke" fill="none" />
        <path d="M4.95 8.15l2.05 2.05 3.75-4.55" stroke="#000000" strokeWidth="0.65" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <>
        <circle cx="8" cy="8" r="7.2" stroke="#dd901d" strokeWidth="1.3" fill="none" />
        <path d="M5 8l2.2 2.2L11 5.5" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
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
      // Navigate to home with hash to trigger scroll
      window.location.href = item.path;
    } else {
      navigate(item.path);
      setMenuOpen(false);
    }
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
          {label:"Home",         path:"/"},
          {label:"How It Works",  path:"/how-it-works"},
          {label:"Services",     path:"/services"},
          {label:"About",         path:"/about"},
        ].map(item => (
          <button key={item.label} onClick={() => handleNavClick(item)} className="nav-link">
            {item.label}
          </button>
        ))}
      </div>

      {/* CTA - Desktop */}
      <div
        className="btn-nav-desktop"
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", gap: 8 }}
      >
        <ThemeToggle />
        <button onClick={handleBooking} className="btn-primary btn-nav">
          Login
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {[
              {label:"Home",         path:"/"},
              {label:"How It Works",  path:"/how-it-works"},
              {label:"Services",     path:"/services"},
              {label:"About",         path:"/about"},
            ].map(item => (
              <button 
                key={item.label} 
                onClick={() => { handleNavClick(item); setMenuOpen(false); }} 
                className="mobile-menu-link"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mobile-menu-footer">
            <ThemeToggle className="mobile-theme-toggle" />
            <button onClick={handleBooking} className="btn-primary btn-nav btn-mobile-cta">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => {
  const { themeMode } = usePublicTheme();
  const heroBackgroundImage = themeMode === "light" ? HERO_BG_IMAGE_LIGHT : HERO_BG_IMAGE_DARK;

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 9, 8, 0.55), rgba(10, 9, 8, 0.72)), url('${heroBackgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 420,
        padding: '4.5rem 1.25rem',
      }}
    >
      <div style={{position:'absolute', inset:0, background:'rgba(6,6,6,0.6)', zIndex:0}} />

      <div style={{position:'relative', zIndex:1, color:'var(--color-white)'}}>
      <div className="hero-badge" style={{marginBottom:16}}>
        <span>ABOUT BEAUTYBOOK PRO</span>
      </div>

      <h1 className="hero-title" style={{color:'var(--color-white)'}}>
        Transforming Beauty<br/>
        <span className="accent">Business Management</span>
      </h1>

      <p className="hero-text" style={{marginTop:8}}>
        A modern digital solution built for salons, barbershops, and spas in Sta. Mesa, Manila to streamline appointments, enhance customer experience, and help businesses grow smarter.
      </p>
      </div>
    </section>
  );
};

const PurposeSection = () => (
  <section className="section" style={{backgroundColor:'var(--bg-secondary)', padding:'4rem 1.5rem 0'}}>
    <div className="section-container">
      <h2 className="section-title">Project Purpose</h2>
      <div style={{maxWidth:900, margin:'0 auto'}}>
        <p className="section-text" style={{fontSize:'1.05rem', lineHeight:1.8, color:'var(--color-tan)', textAlign:'center'}}>
          BeautyBook Pro is a web-based digital appointment and customer management system developed as a capstone project by students from the <strong>Polytechnic University of the Philippines Institute of Technology</strong>. It addresses outdated manual scheduling and customer tracking practices used by salons, barbershops, and spas.
        </p>
      </div>
    </div>
  </section>
);

const MissionSection = () => (
  <section className="section" style={{backgroundColor:'var(--bg-secondary)', paddingBottom:'4rem'}}>
    <div className="section-container">
      <h2 className="section-title">Mission</h2>
      <div style={{maxWidth:900, margin:'0 auto'}}>
        <p className="section-text" style={{fontSize:'1.05rem', lineHeight:1.8, color:'var(--color-tan)', textAlign:'center'}}>
          Our mission is to empower beauty businesses in Sta. Mesa, Manila with an intuitive platform that streamlines appointments, improves communication, and helps deliver exceptional customer experiences through automation and data.
        </p>
      </div>
    </div>
  </section>
);

const ProblemSection = () => {
  const { themeMode } = usePublicTheme();
  const problems = [
    {icon:<ConflictIcon/>, text:"Scheduling conflicts and double bookings"},
    {icon:<WaitIcon/>, text:"Long customer wait times and poor queue management"},
    {icon:<DataIcon/>, text:"Lack of customer data and service history tracking"},
    {icon:<CommunicationIcon/>, text:"Limited communication between businesses and clients"},
    {icon:<RetentionIcon/>, text:"Poor customer retention due to manual processes"},
    {icon:<SolutionIcon/>, text:"Inefficient staff scheduling and reporting"},
  ];

  return (
    <section className="section" style={{backgroundColor:'var(--bg-darker)', padding:'4rem 1.5rem'}}>
      <div className="section-container">
        <h2 className="section-title">The Problem We Solve</h2>
        <p className="section-subtitle">Beauty businesses face real challenges in the digital age</p>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.25rem', maxWidth:1100, margin:'2.5rem auto 0'}}>
          {problems.map((p, i) => (
            <div key={i}
              className={themeMode === 'light' ? 'step-card' : ''}
              style={{
                padding:'16px',
                backgroundColor: themeMode === 'light' ? '#dc8a99' : 'var(--bg-card)',
                border:'1px solid',
                borderColor: themeMode === 'light' ? 'rgba(243, 139, 166, 0.35)' : 'var(--border-tan-light)',
                borderRadius:9,
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                textAlign:'center',
                gap:12,
                minHeight:120,
                justifyContent:'center',
                transition: 'all 0.3s ease',
                cursor: themeMode === 'light' ? 'pointer' : 'default'
              }}
              onMouseEnter={(e) => {
                if (themeMode === 'light') {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(243, 139, 166, 0.28)';
                  e.currentTarget.style.borderColor = 'rgba(243, 139, 166, 0.65)';
                } else {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(221, 144, 29, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(221,144,29,0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = themeMode === 'light' ? 'rgba(243, 139, 166, 0.35)' : 'rgba(221,144,29,0.06)';
              }}
            >
              <div style={{width:52, height:52, display:'flex', alignItems:'center', justifyContent:'center', background: themeMode === 'light' ? '#ffffff' : 'var(--bg-darker)', borderRadius:10, border: themeMode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : 'none', marginBottom:14}}>
                <div style={{width:28,height:28,color: themeMode === 'light' ? '#f38ba6' : '#dd901d'}}>{p.icon}</div>
              </div>
              <p style={{fontSize:'0.9rem', color: themeMode === 'light' ? '#0c0a09' : 'var(--color-tan)', fontWeight:500, margin:0}}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
  const { themeMode } = usePublicTheme();
  const features = [
    'Online booking with real-time availability',
    'Automated SMS reminders and notifications',
    'Customer service histories and profiles',
    'Smart queue for scheduled and walk-in clients',
    'Data-driven insights for business growth',
    'Multi-role access: customers, staff, admins',
  ];

  return (
    <section className="section" style={{backgroundColor:'var(--bg-secondary)', paddingTop:'4rem', paddingBottom:'44px', paddingLeft:'1.5rem', paddingRight:'1.5rem'}}>
      <div className="section-container" style={{maxWidth:1100}}>
        <h2 className="section-title">Our Solution</h2>
        <p className="section-subtitle">Comprehensive features designed for modern beauty businesses</p>

        <div style={{maxWidth:1000, margin:'3rem auto', paddingLeft:'75px'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 420px))', gap:'2rem', alignItems:'start', justifyContent:'center'}}>
            <div style={{marginTop:'0'}}>
              <p style={{fontSize:'1.05rem', lineHeight:1.8, color:'var(--color-tan)', marginTop:0, marginBottom:'1rem'}}>
                BeautyBook Pro combines modern web technologies with established theories such as the Technology Acceptance Model (TAM) and Customer Relationship Management (CRM) principles to deliver a platform tailored to the beauty industry.
              </p>
              <p style={{fontSize:'0.95rem', color:'var(--color-tan)', fontStyle:'italic'}}>
                The system focuses on usability and trust to encourage adoption by salon staff and clients while preserving rich customer histories and communication channels.
              </p>
            </div>

            <div>
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                {features.map((f, i) => (
                  <div key={i} style={{display:'flex', gap:'0.75rem', alignItems:'flex-start'}}>
                    <CheckItem lightMode={themeMode === 'light'} />
                    <span style={{fontSize:'0.95rem', color: themeMode === 'light' ? '#0c0a09' : '#555'}}>{f}</span>
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
  const { themeMode } = usePublicTheme();
  const team = [
    {id:1, name:'Dagodog, Vhon Inishi M.', role:'Project Leader'},
    {id:2, name:'Arejola, Charlie R.', role:'Lead Programmer'},
    {id:3, name:'Villon, Karl Lemuel R.', role:'Documentation'},
    {id:4, name:'Zamora, Athlon Miguel C.', role:'QA'}
  ];

  return (
    <section className="section" style={{backgroundColor:'var(--bg-darker)', paddingTop:'4rem', paddingBottom:'44px', paddingLeft:'1.5rem', paddingRight:'1.5rem'}}>
      <div className="section-container">
        <h2 className="section-title">Meet The Team</h2>
        <p className="section-subtitle">Passionate PUP IT students behind BeautyBook Pro</p>

        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 220px)', gap:'60px', justifyContent:'center', maxWidth:760, margin:'3rem auto'}}>
          {team.map((member) => (
            <div key={member.id} style={{display:'flex', justifyContent:'center'}}>
              <div className="team-card" style={{width:220, height:220, borderRadius:10, border:'1px solid var(--border-tan-light)', background:'var(--bg-card)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{color:'var(--color-tan)'}}>
                  Photo Placeholder
                </div>

                <div style={{position:'absolute', left:0, right:0, bottom:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none'}}>
                  <h3 style={{fontSize:'1.02rem', fontWeight:600, color:'var(--color-white)', margin:0}}>{member.name}</h3>
                  <p style={{fontSize:'0.85rem', color: themeMode === 'light' ? '#f38ba6' : '#dd901d', fontWeight:600, margin:'6px 0 0'}}>{member.role}</p>
                </div>
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
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-wrapper" style={{ zoom: isDesktop ? '150%' : '100%' }}>
      <NavBar/>
      <HeroSection/>
      <div style={{backgroundColor:'var(--bg-secondary)'}}>
        <PurposeSection/>
        <MissionSection/>
      </div>
      <ProblemSection/>
      <SolutionSection/>
      <TeamSection/>
      <FooterSection/>
    </div>
  );
}
