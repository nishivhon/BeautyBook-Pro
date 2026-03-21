import { useNavigate } from "react-router-dom";

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
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 52;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:50,
      background:"#0a0908",
      borderBottom:"1px solid rgba(221,144,29,0.1)",
      height:52,display:"flex",alignItems:"center",
      padding:"0 40px",justifyContent:"space-between",
    }}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:38,height:38,background:"#dd901d",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <LogoMark/>
        </div>
        <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"1rem",color:"#f5f1eb"}}>
          BeautyBook Pro
        </span>
      </div>

      {/* Nav links */}
      <div style={{display:"flex",alignItems:"center",gap:2}}>
        {[
          {label:"Home",       id:"home"},
          {label:"Services",   id:"services"},
          {label:"How It Works",id:"howitworks"},
          {label:"About",      id:"about"},
        ].map(item => (
          <button key={item.id} onClick={() => scrollToSection(item.id)} style={{
            padding:"6px 14px",color:"#988f81",
            fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.85rem",
            background:"none",border:"none",cursor:"pointer",transition:"color 0.2s, transform 0.2s",
          }}
            onMouseEnter={e=>{e.target.style.color="#dd901d";e.target.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.target.style.color="#988f81";e.target.style.transform="translateY(0)"}}
          >{item.label}</button>
        ))}
      </div>

      {/* CTA */}
      <button onClick={onBookAppointment} style={{
        padding:"9px 20px",background:"#dd901d",color:"#000",
        fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.85rem",
        border:"none",borderRadius:8,cursor:"pointer",transition:"all 0.2s",
      }}
        onMouseEnter={e=>{e.target.style.background="#c47f18";e.target.style.transform="scale(1.05)"}}
        onMouseLeave={e=>{e.target.style.background="#dd901d";e.target.style.transform="scale(1)"}}
      >Book Appointment</button>
    </nav>
  );
};

const HeroSection = ({ onBookAppointment }) => (
  <section id="home" style={{
    background:"#0a0908",
    marginTop:52,
    display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",
    textAlign:"center",
    padding:"40px 20px 50px",
  }}>
    {/* Badge */}
    <div style={{
      display:"inline-flex",alignItems:"center",
      padding:"5px 22px",borderRadius:30,
      border:"1px solid #dd901d",
      background:"rgba(221,144,29,0.1)",
      marginBottom:28,
    }}>
      <span style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:"0.72rem",color:"#dd901d",letterSpacing:"0.08em"}}>
        DIGITAL APPOINTMENT SYSTEM
      </span>
    </div>

    {/* Headline */}
    <h1 style={{
      fontFamily:"'Georgia','Times New Roman',serif",
      fontWeight:700,fontSize:"clamp(2rem,4.5vw,3.2rem)",
      color:"#fff",lineHeight:1.1,
      margin:"0 0 22px",maxWidth:760,
    }}>
      Skip The&nbsp;&nbsp;Wait,{" "}
      <span style={{color:"#dd901d"}}>Book Your Style</span>
    </h1>

    {/* Sub-copy */}
    <p style={{
      fontFamily:"'Inter',sans-serif",fontWeight:400,
      fontSize:"0.95rem",color:"#988f81",
      lineHeight:1.7,maxWidth:580,margin:"0 0 32px",
    }}>
      A digital appointment and customer management system for barbershops,
      hair salons, and spas.<br/>
      Book appointments online, reduce wait times, and experience seamless,
      personalized service—instantly.
    </p>

    {/* CTA */}
    <button onClick={onBookAppointment} style={{
      padding:"12px 36px",
      background:"#dd901d",color:"#000",
      fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.95rem",
      border:"none",borderRadius:8,cursor:"pointer",transition:"all 0.2s",
    }}
      onMouseEnter={e=>{e.target.style.background="#c47f18";e.target.style.transform="scale(1.05) translateY(-2px)"}}
      onMouseLeave={e=>{e.target.style.background="#dd901d";e.target.style.transform="scale(1) translateY(0)"}}
    >Book Appointment</button>
  </section>
);

const HowItWorksSection = () => {
  const steps = [
    {icon:<CalendarIcon/>,   title:"Book Online",    desc:"Select your service, preferred stylist, and convenient time slot"},
    {icon:<BellIcon/>,       title:"Get Notified",   desc:"Receive real-time updates and \u2018Your Turn Soon\u2019 alerts"},
    {icon:<CheckCircleIcon/>,title:"Enjoy Service",  desc:"Arrive on time and skip the traditional waiting queue"},
  ];
  return (
    <section id="howitworks" style={{background:"#14110f",padding:"40px 40px"}}>
      <h2 style={{
        textAlign:"center",
        fontFamily:"'Georgia','Times New Roman',serif",
        fontWeight:700,fontSize:"1.9rem",color:"#fff",
        margin:"0 0 10px",
      }}>How BeautyBook Pro Works</h2>
      <p style={{
        textAlign:"center",color:"#988f81",
        fontFamily:"'Inter',sans-serif",fontSize:"0.95rem",
        margin:"0 0 36px",
      }}>Simple, efficient digital booking appointment for modern salon businesses</p>

      <div style={{
        display:"grid",gridTemplateColumns:"repeat(3,1fr)",
        gap:18,maxWidth:860,margin:"0 auto",
      }}>
        {steps.map((s,i) => (
          <div key={i} style={{
            background:"#14110f",borderRadius:9,
            border:"1px solid rgba(152,143,129,0.35)",
            padding:"16px 16px 20px",
            transition:"all 0.3s ease",cursor:"pointer",
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow="0 12px 24px rgba(221,144,29,0.2)";e.currentTarget.style.borderColor="#dd901d"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="rgba(152,143,129,0.35)"}}
          >
            <div style={{
              width:52,height:52,background:"#dd901d",
              borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",
              padding:11,marginBottom:14,
            }}>{s.icon}</div>
            <div style={{
              fontFamily:"'Georgia','Times New Roman',serif",
              fontWeight:700,fontSize:"1.05rem",color:"#fff",marginBottom:6,
            }}>{s.title}</div>
            <p style={{
              fontFamily:"'Inter',sans-serif",fontWeight:200,
              fontSize:"0.82rem",color:"#988f81",margin:0,lineHeight:1.5,
            }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SvcCard = ({icon,title,items}) => (
  <div style={{
    background:"#060605",borderRadius:9,
    border:"1px solid rgba(152,143,129,0.3)",
    padding:"16px",transition:"all 0.3s ease",cursor:"pointer",
  }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.02)";e.currentTarget.style.boxShadow="0 10px 20px rgba(221,144,29,0.15)";e.currentTarget.style.borderColor="rgba(221,144,29,0.6)"}}
    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="rgba(152,143,129,0.3)"}}
  >
    <div style={{
      width:50,height:50,background:"#dd901d",
      borderRadius:14,padding:10,
      display:"flex",alignItems:"center",justifyContent:"center",
      marginBottom:10,
    }}>{icon}</div>
    <div style={{
      fontFamily:"'Georgia','Times New Roman',serif",
      fontWeight:700,fontSize:"1rem",color:"#fff",marginBottom:8,
    }}>{title}</div>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {items.map((l,i) => (
        <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
          <CheckItem/>
          <span style={{fontFamily:"'Inter',sans-serif",fontWeight:200,fontSize:"0.78rem",color:"#988f81"}}>{l}</span>
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
    <section id="services" style={{background:"#0a0908",padding:"40px 40px"}}>
      <h2 style={{
        textAlign:"center",
        fontFamily:"'Georgia','Times New Roman',serif",
        fontWeight:700,fontSize:"1.9rem",color:"#fff",
        margin:"0 0 10px",
      }}>Our Services</h2>
      <p style={{
        textAlign:"center",color:"#988f81",
        fontFamily:"'Inter',sans-serif",fontSize:"0.95rem",
        margin:"0 0 32px",
      }}>Professional grooming services tailored to your style</p>

      <div style={{maxWidth:860,margin:"0 auto",display:"flex",flexDirection:"column",gap:18}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {row1.map((s,i) => <SvcCard key={i} {...s}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18,maxWidth:572}}>
          {row2.map((s,i) => <SvcCard key={i} {...s}/>)}
        </div>
      </div>
    </section>
  );
};

const FooterSection = () => (
  <footer id="about" style={{
    background:"#050504",
    borderTop:"1px solid rgba(221,144,29,0.08)",
    padding:"20px 40px 16px",
  }}>
    <div style={{maxWidth:860,margin:"0 auto"}}>
      {/* Contact row */}
      <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:18,marginBottom:14}}>
        <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"#fff",minWidth:78}}>
          Contact us
        </span>
        {["Canvas city, Abc st., 245 lot B","(02) 123-4567","beautybookpro@gmail.com","Mon-Fri: 8:00 AM - 5:00 PM"].map((t,i) => (
          <span key={i} style={{fontFamily:"'Inter',sans-serif",fontWeight:200,fontSize:"0.75rem",color:"rgba(255,255,255,0.6)"}}>
            {t}
          </span>
        ))}
      </div>

      {/* Follow row */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
        <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"#fff",minWidth:78}}>
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
          <div key={i} style={{
            width:28,height:28,borderRadius:7,
            border:"1px solid rgba(152,143,129,0.3)",
            display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",transition:"all 0.3s ease",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#dd901d";e.currentTarget.style.transform="scale(1.15) rotate(5deg)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(152,143,129,0.3)";e.currentTarget.style.transform="scale(1) rotate(0deg)"}}
          >{ic}</div>
        ))}
      </div>

      {/* Divider + copyright */}
      <div style={{borderTop:"1px solid rgba(152,143,129,0.15)",paddingTop:12}}>
        <p style={{
          textAlign:"center",
          fontFamily:"'Inter',sans-serif",fontWeight:200,
          fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",margin:0,
        }}>
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
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { width:100%; height:100%; }
      `}</style>
      <div style={{background:"#0a0908",minHeight:"100vh",width:"100%",zoom:"125%",transformOrigin:"top left"}}>
        <NavBar onBookAppointment={handleBook}/>
        <HeroSection onBookAppointment={handleBook}/>
        <HowItWorksSection/>
        <ServicesSection/>
        <FooterSection/>
      </div>
    </>
  );
}