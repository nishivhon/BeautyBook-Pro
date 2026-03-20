import { useState, useEffect } from "react";

/* ─── Inline SVG icons ─── */
const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <path d="M4 8c0-1 0.5-2 1.5-2 1.5 0 2 1 2 2M19 8c0-1-0.5-2-1.5-2-1.5 0-2 1-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 12c0-1 0.5-2 1-2 1 0 1.5 1 1.5 2M19 12c0-1-0.5-2-1-2-1 0-1.5 1-1.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 7c0-0.5 2-2 6-2s6 1.5 6 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M6 17c0 0.5 0 2 6 2s6-1.5 6-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect x="3" y="5" width="18" height="14" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M8 2v5M16 2v5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="1.5"/>
    <circle cx="7" cy="14" r="0.8" fill="white"/>
    <circle cx="12" cy="14" r="0.8" fill="white"/>
    <circle cx="17" cy="14" r="0.8" fill="white"/>
    <circle cx="7" cy="18" r="0.8" fill="white"/>
    <circle cx="12" cy="18" r="0.8" fill="white"/>
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <path d="M10 2h4v2h-4V2z" stroke="white" strokeWidth="1.5" fill="white" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="5" fill="none" stroke="white" strokeWidth="1.5"/>
    <path d="M10 10l1 1 2-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 8c-1 1 0 3 1 3.5M17 8c1 1 0 3-1 3.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M9 12l2 2.5 4-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MassageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="6" cy="9" r="1" fill="white"/>
    <circle cx="18" cy="9" r="1" fill="white"/>
    <ellipse cx="12" cy="14" rx="6" ry="5" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M9 10v-2c0-0.5 0.5-1 1-1h4c0.5 0 1 0.5 1 1v2" stroke="white" strokeWidth="1" fill="none"/>
    <path d="M4 18c0 1 1 2 2 2h12c1 0 2-1 2-2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <path d="M12 2l3 7h8l-6.5 5 2.5 7-6-5-6 5 2.5-7-6.5-5h8z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
  </svg>
);
const NailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect x="8" y="11" width="8" height="9" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M10 11V8a2 2 0 0 1 4 0v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="15.5" r="1" fill="white"/>
  </svg>
);
const SkinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="9" cy="10" r="1" fill="white"/>
    <circle cx="15" cy="10" r="1" fill="white"/>
    <path d="M9 15c0.5 1.5 5.5 1.5 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const CheckItem = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:14,height:14,flexShrink:0}}>
    <circle cx="8" cy="8" r="7" stroke="#dd901d" strokeWidth="1.2" fill="none"/>
    <path d="M5.5 8l1.5 1.5 3-3.5" stroke="#dd901d" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LogoMark = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:26,height:26}}>
    <path d="M8 10c0-1.5 1-3 2.5-3 2 0 3 1.5 3 3M21.5 10c0-1.5-1-3-2.5-3-2 0-3 1.5-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6 16c0-1.5 1-3 1.5-3 1.5 0 2.5 1.5 2.5 3M25.5 16c0-1.5-1-3-1.5-3-1.5 0-2.5 1.5-2.5 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 9.5c0-0.5 2.5-2.5 7-2.5s7 2 7 2.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M9 22.5c0 0.5 0 2.5 7 2.5s7-2 7-2.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── NavBar ─── */
const NavBar = () => (
  <nav style={{
    position:"fixed",top:0,left:0,right:0,zIndex:50,
    background:"#0a0908",
    borderBottom:"1px solid rgba(221,144,29,0.1)",
    height:52,display:"flex",alignItems:"center",
    padding:"0 40px",justifyContent:"space-between",
  }}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:38,height:38,background:"#dd901d",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <LogoMark/>
      </div>
      <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"1rem",color:"#f5f1eb"}}>BeautyBook Pro</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:2}}>
      {["Home","Services","Queue Status","About"].map(item=>(
        <a key={item} href="#" style={{
          padding:"6px 14px",color:"#988f81",
          fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.85rem",
          textDecoration:"none",transition:"all 0.3s ease",
        }}
          onMouseEnter={e=>{e.target.style.color="#dd901d"; e.target.style.transform="translateY(-2px)"}}
          onMouseLeave={e=>{e.target.style.color="#988f81"; e.target.style.transform="translateY(0)"}}
        >{item}</a>
      ))}
    </div>
    <button style={{
      padding:"9px 20px",background:"#dd901d",color:"#000",
      fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.85rem",
      border:"none",borderRadius:8,cursor:"pointer",transition:"all 0.3s ease",
    }}
      onMouseEnter={e=>{e.target.style.background="#c47f18"; e.target.style.transform="scale(1.05)"; e.target.style.boxShadow="0 4px 12px rgba(221,144,29,0.3)"}}
      onMouseLeave={e=>{e.target.style.background="#dd901d"; e.target.style.transform="scale(1)"; e.target.style.boxShadow="none"}}
    >Book Appointment</button>
  </nav>
);

/* ─── Hero ─── */
const HeroSection = () => (
  <section style={{
    background:"#0a0908",
    minHeight:"auto",
    marginTop:52,
    display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",
    textAlign:"center",
    padding:"40px 20px 50px",
  }}>
    <div style={{
      display:"inline-flex",alignItems:"center",
      padding:"5px 22px",borderRadius:30,
      border:"1px solid #dd901d",
      background:"rgba(221,144,29,0.1)",
      marginBottom:28,
    }}>
      <span style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:"0.72rem",color:"#dd901d",letterSpacing:"0.08em"}}>DIGITAL APPOINTMENT SYSTEM</span>
    </div>
    <h1 style={{
      fontFamily:"'Georgia','Times New Roman',serif",
      fontWeight:700,fontSize:"clamp(2rem,4.5vw,3.2rem)",
      color:"#fff",lineHeight:1.1,
      margin:"0 0 22px",maxWidth:760,
    }}>
      Skip The&nbsp;&nbsp;Wait,{" "}
      <span style={{color:"#dd901d"}}>Book Your Style</span>
    </h1>
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
    <button style={{
      padding:"12px 36px",
      background:"#dd901d",color:"#000",
      fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.95rem",
      border:"none",borderRadius:8,cursor:"pointer",transition:"all 0.3s ease",
    }}
      onMouseEnter={e=>{e.target.style.background="#c47f18"; e.target.style.transform="scale(1.08) translateY(-2px)"; e.target.style.boxShadow="0 8px 20px rgba(221,144,29,0.4)"}}
      onMouseLeave={e=>{e.target.style.background="#dd901d"; e.target.style.transform="scale(1) translateY(0)"; e.target.style.boxShadow="none"}}
    >Book Appointment</button>
  </section>
);

/* ─── How It Works ─── */
const HowItWorksSection = () => {
  const steps = [
    {icon:<CalendarIcon/>,title:"Book Online",desc:"Select your service, preferred stylist, and convenient time slot"},
    {icon:<BellIcon/>,title:"Get Notified",desc:"Receive real-time updates and 'Your Turn Soon' alerts"},
    {icon:<CheckCircleIcon/>,title:"Enjoy Service",desc:"Arrive on time and skip the traditional waiting queue"},
  ];
  return (
    <section style={{background:"#14110f",padding:"40px 40px"}}>
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
        {steps.map((s,i)=>(
          <div key={i} style={{
            background:"#14110f",borderRadius:9,
            border:"1px solid rgba(152,143,129,0.35)",
            padding:"16px 16px 20px",transition:"all 0.3s ease",cursor:"pointer",
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)"; e.currentTarget.style.boxShadow="0 12px 24px rgba(221,144,29,0.2)"; e.currentTarget.style.borderColor="#dd901d"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="rgba(152,143,129,0.35)"}}
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

/* ─── Service card ─── */
const SvcCard = ({icon,title,items}) => (
  <div style={{
    background:"#060605",borderRadius:9,
    border:"1px solid rgba(152,143,129,0.3)",
    padding:"16px",transition:"all 0.3s ease",cursor:"pointer",
  }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.02)"; e.currentTarget.style.boxShadow="0 10px 20px rgba(221,144,29,0.15)"; e.currentTarget.style.borderColor="rgba(221,144,29,0.6)"}}
    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="rgba(152,143,129,0.3)"}}
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
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      {items.map((l,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
          <CheckItem/>
          <span style={{fontFamily:"'Inter',sans-serif",fontWeight:200,fontSize:"0.78rem",color:"#988f81"}}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Services ─── */
const ServicesSection = () => {
  const row1 = [
    {icon:<ScissorsIcon/>,title:"Haircut Services",items:["Haircut & Styling","Hair Color","Hair Treatment","Beard Trimming"]},
    {icon:<NailIcon/>,title:"Nail Services",items:["Manicures","Pedicures","Nail Enhancement","Nail Art & Design"]},
    {icon:<SkinIcon/>,title:"Skin Care Services",items:["Facial Treatments","Advance Treatments","Specialized Facials","Body Treatment"]},
  ];
  const row2 = [
    {icon:<MassageIcon/>,title:"Massage Services",items:["Swedish Massage","Deep Tissue Massage","Hot Stone Massage","Foot Reflexology"]},
    {icon:<StarIcon/>,title:"Premium Services",items:["Bridal Package","Couple's Massage","Hair & Glow Combo","VIP Lounge Experience"]},
  ];
  return (
    <section style={{background:"#0a0908",padding:"40px 40px"}}>
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
          {row1.map((s,i)=><SvcCard key={i} {...s}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18,maxWidth:572}}>
          {row2.map((s,i)=><SvcCard key={i} {...s}/>)}
        </div>
      </div>
    </section>
  );
};

/* ─── Footer ─── */
const FooterSection = () => (
  <footer style={{
    background:"#050504",
    borderTop:"1px solid rgba(221,144,29,0.08)",
    padding:"20px 40px 16px",
  }}>
    <div style={{maxWidth:860,margin:"0 auto"}}>
      <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:18,marginBottom:14}}>
        <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"#fff",minWidth:78}}>Contact us</span>
        {["Canvas city, Abc st., 245 lot B","(02) 123-4567","beautybookpro@gmail.com","Mon-Fri: 8:00 AM - 5:00 PM"].map((t,i)=>(
          <span key={i} style={{fontFamily:"'Inter',sans-serif",fontWeight:200,fontSize:"0.75rem",color:"rgba(255,255,255,0.6)"}}>{t}</span>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
        <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"#fff",minWidth:78}}>Follow us</span>
        {[
          <svg key="fb" viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/></svg>,
          <svg key="ig" viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="17.5" cy="6.5" r="1" fill="white"/></svg>,
        ].map((ic,i)=>(
          <div key={i} style={{
            width:28,height:28,borderRadius:7,
            border:"1px solid rgba(152,143,129,0.3)",
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s ease",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#dd901d"; e.currentTarget.style.transform="scale(1.15) rotate(5deg)"; e.currentTarget.style.boxShadow="0 6px 12px rgba(221,144,29,0.25)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(152,143,129,0.3)"; e.currentTarget.style.transform="scale(1) rotate(0deg)"; e.currentTarget.style.boxShadow="none"}}
          >{ic}</div>
        ))}
      </div>
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
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div style={{background:"#0a0908",minHeight:"100vh",width:"100%",zoom:"150%",transformOrigin:"top left"}}>
        <NavBar/>
        <HeroSection/>
        <HowItWorksSection/>
        <ServicesSection/>
        <FooterSection/>
      </div>
    </>
  );
}