import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";

// ─── SVG Icons ─────────────────────────────────────────────────────────

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="3.5" stroke="#000" strokeWidth="2"/>
    <circle cx="7" cy="15" r="3.5" stroke="#000" strokeWidth="2"/>
    <path d="M9.8 8.8l7 7M9.8 13.2L17 6.2" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const UserIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5.5" r="3.5" stroke={color} strokeWidth="1.6"/>
    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const LogOutIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 15H3.5A1.5 1.5 0 012 13.5v-9A1.5 1.5 0 013.5 3H7" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M12 12l4-3-4-3M16 9H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#dd901d" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#dd901d" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

const HistoryIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TicketIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16v2H4V4zm0 4h16v8H4V8zm0 10h16v2H4v-2z" stroke={color} strokeWidth="1.5" fill="none"/>
  </svg>
);

const EditIcon = ({ color = "#dd901d" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const SaveIcon = ({ color = "#22c55e" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CancelIcon = ({ color = "#ef4343" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SMSIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#dd901d" strokeWidth="1.5"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#dd901d" strokeWidth="1.5"/>
    <path d="M2 6l10 8 10-8" stroke="#dd901d" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Mock Data ─────────────────────────────────────────────────────────

const mockServiceHistory = [
  { id: 1, date: "2026-04-20", service: "Haircut & Styling", stylist: "Maria Rodriguez", cost: 45.00, status: "completed", rated: false },
  { id: 2, date: "2026-04-10", service: "Hair Color", stylist: "Carlos Martinez", cost: 85.00, status: "completed", rated: true, rating: 5 },
  { id: 3, date: "2026-03-28", service: "Facial Treatment", stylist: "Ana Santos", cost: 65.00, status: "completed", rated: true, rating: 4 },
  { id: 4, date: "2026-03-15", service: "Manicure", stylist: "Maria Rodriguez", cost: 35.00, status: "completed", rated: false },
  { id: 5, date: "2026-05-02", service: "Swedish Massage", stylist: "John Davis", cost: 75.00, status: "upcoming", rated: false },
];

const mockCoupons = [
  { id: 1, code: "SAVE15", discount: "15% OFF", description: "All hair services", expiration: "2026-05-30", status: "available", claimed: false, expiresIfNotClaimed: "2026-05-10" },
  { id: 2, code: "NAIL20", discount: "20% OFF", description: "Nail services only", expiration: "2026-05-15", status: "expired", claimed: false, expiresIfNotClaimed: "2026-04-20" },
  { id: 3, code: "SUMMER25", discount: "$25 OFF", description: "Services over $75", expiration: "2026-06-30", status: "available", claimed: false, expiresIfNotClaimed: "2026-05-15" },
  { id: 4, code: "MASSAGE10", discount: "10% OFF", description: "Massage services", expiration: "2026-05-08", status: "available", claimed: true, expiresIfNotClaimed: "2026-05-01" },
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    notificationPreference: "email" // "sms" or "email"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  
  // History state
  const [history, setHistory] = useState(mockServiceHistory);
  const [historyFilter, setHistoryFilter] = useState("all"); // "all", "completed", "upcoming"
  const [selectedForRating, setSelectedForRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  
  // Coupons state
  const [coupons, setCoupons] = useState(mockCoupons);
  const [couponFilter, setCouponFilter] = useState("available");
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  // Profile handlers
  const handleEditProfile = () => {
    setTempProfile(profile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setIsEditingProfile(false);
    displayToast("Profile updated successfully");
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  // Rating handlers
  const handleRateService = (id) => {
    const item = history.find(h => h.id === id);
    setSelectedForRating(item);
    setRatingValue(0);
  };

  const handleSubmitRating = () => {
    if (ratingValue > 0) {
      setHistory(prev => prev.map(h => 
        h.id === selectedForRating.id ? { ...h, rated: true, rating: ratingValue } : h
      ));
      setSelectedForRating(null);
      displayToast(`✓ Thank you for rating ${selectedForRating.service}!`);
    }
  };

  // Coupon handlers
  const handleClaimCoupon = (id) => {
    setCoupons(prev => prev.map(c => 
      c.id === id ? { ...c, claimed: true } : c
    ));
    displayToast("Coupon claimed! Use it at your next appointment.");
  };

  const filteredHistory = history.filter(h => {
    if (historyFilter === "completed") return h.status === "completed";
    if (historyFilter === "upcoming") return h.status === "upcoming";
    return true;
  });

  const filteredCoupons = coupons.filter(c => {
    if (couponFilter === "available") return c.status === "available" && !c.claimed;
    if (couponFilter === "claimed") return c.claimed;
    if (couponFilter === "expired") return c.status === "expired";
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0a06', color: '#f5f5f5', fontFamily: "'Inter', sans-serif" }}>
      {/* ─── HEADER ─── */}
      <header style={{ backgroundColor: '#1a1714', borderBottom: '1px solid rgba(221, 144, 29, 0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-10px)', transition: 'all 0.5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#dd901d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoIcon />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: "'Georgia', serif" }}>BeautyBook Pro</span>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'rgba(239, 67, 67, 0.1)', border: '1px solid rgba(239, 67, 67, 0.3)', borderRadius: '8px', color: '#ef4343', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(239, 67, 67, 0.2)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(239, 67, 67, 0.1)'; }}>
          <LogOutIcon color="#ef4343" />
          Logout
        </button>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* ─── PROFILE SECTION ─── */}
        <section style={{ marginBottom: '40px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.5s ease 0.1s' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', fontFamily: "'Georgia', serif", color: '#dd901d' }}>My Profile</h2>
          <div style={{ backgroundColor: '#1a1714', border: '1px solid rgba(221, 144, 29, 0.2)', borderRadius: '12px', padding: '24px' }}>
            {!isEditingProfile ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                    <p style={{ fontSize: '16px', margin: 0, color: '#e5d9d0' }}>{profile.name}</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
                    <p style={{ fontSize: '16px', margin: 0, color: '#e5d9d0' }}>{profile.phone}</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                    <p style={{ fontSize: '16px', margin: 0, color: '#e5d9d0' }}>{profile.email}</p>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notification Preference</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: profile.notificationPreference === 'email' ? 'rgba(221, 144, 29, 0.15)' : 'rgba(152, 143, 129, 0.05)', border: `1px solid ${profile.notificationPreference === 'email' ? 'rgba(221, 144, 29, 0.4)' : 'rgba(152, 143, 129, 0.2)'}`, borderRadius: '6px', fontSize: '14px' }}>
                      <EmailIcon /> Email
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: profile.notificationPreference === 'sms' ? 'rgba(221, 144, 29, 0.15)' : 'rgba(152, 143, 129, 0.05)', border: `1px solid ${profile.notificationPreference === 'sms' ? 'rgba(221, 144, 29, 0.4)' : 'rgba(152, 143, 129, 0.2)'}`, borderRadius: '6px', fontSize: '14px' }}>
                      <SMSIcon /> SMS
                    </div>
                  </div>
                </div>
                <button onClick={handleEditProfile} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#dd901d', border: 'none', borderRadius: '8px', color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#e6a326'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#dd901d'; }}>
                  <EditIcon />
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                    <input type="text" value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(26, 15, 0, 0.5)', border: '1px solid rgba(221, 144, 29, 0.3)', borderRadius: '8px', color: '#f5f5f5', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase' }}>Phone</label>
                    <input type="tel" value={tempProfile.phone} onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(26, 15, 0, 0.5)', border: '1px solid rgba(221, 144, 29, 0.3)', borderRadius: '8px', color: '#f5f5f5', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase' }}>Email</label>
                    <input type="email" value={tempProfile.email} onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', backgroundColor: 'rgba(26, 15, 0, 0.5)', border: '1px solid rgba(221, 144, 29, 0.3)', borderRadius: '8px', color: '#f5f5f5', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#dd901d', marginBottom: '8px', textTransform: 'uppercase' }}>Notification Preference</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setTempProfile({ ...tempProfile, notificationPreference: 'email' })} style={{ flex: 1, padding: '10px', backgroundColor: tempProfile.notificationPreference === 'email' ? 'rgba(221, 144, 29, 0.2)' : 'rgba(152, 143, 129, 0.05)', border: `1px solid ${tempProfile.notificationPreference === 'email' ? 'rgba(221, 144, 29, 0.4)' : 'rgba(152, 143, 129, 0.2)'}`, borderRadius: '8px', color: '#f5f5f5', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                      <EmailIcon /> Email
                    </button>
                    <button onClick={() => setTempProfile({ ...tempProfile, notificationPreference: 'sms' })} style={{ flex: 1, padding: '10px', backgroundColor: tempProfile.notificationPreference === 'sms' ? 'rgba(221, 144, 29, 0.2)' : 'rgba(152, 143, 129, 0.05)', border: `1px solid ${tempProfile.notificationPreference === 'sms' ? 'rgba(221, 144, 29, 0.4)' : 'rgba(152, 143, 129, 0.2)'}`, borderRadius: '8px', color: '#f5f5f5', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                      <SMSIcon /> SMS
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handleSaveProfile} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#22c55e', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#16a34a'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#22c55e'; }}>
                    <SaveIcon />
                    Save
                  </button>
                  <button onClick={handleCancelEdit} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(239, 67, 67, 0.1)', border: '1px solid rgba(239, 67, 67, 0.3)', borderRadius: '8px', color: '#ef4343', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s ease' }}>
                    <CancelIcon />
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ─── SERVICE HISTORY SECTION ─── */}
        <section style={{ marginBottom: '40px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.5s ease 0.2s' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', fontFamily: "'Georgia', serif", color: '#dd901d' }}>Service History</h2>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            {['all', 'completed', 'upcoming'].map(filter => (
              <button key={filter} onClick={() => setHistoryFilter(filter)} style={{ padding: '8px 16px', backgroundColor: historyFilter === filter ? '#dd901d' : 'rgba(221, 144, 29, 0.1)', border: `1px solid ${historyFilter === filter ? '#dd901d' : 'rgba(221, 144, 29, 0.3)'}`, borderRadius: '6px', color: historyFilter === filter ? '#000' : '#dd901d', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s ease' }}>
                {filter === 'all' ? 'All' : filter === 'completed' ? 'Completed' : 'Upcoming'}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredHistory.map(item => (
              <div key={item.id} style={{ backgroundColor: '#1a1714', border: '1px solid rgba(221, 144, 29, 0.2)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0' }}>{item.service}</h3>
                    <p style={{ fontSize: '13px', color: '#988f81', margin: 0 }}>{item.stylist} • ${item.cost.toFixed(2)}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: item.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(221, 144, 29, 0.15)', color: item.status === 'completed' ? '#22c55e' : '#dd901d', textTransform: 'uppercase' }}>{item.status}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#b8a599', margin: '0 0 12px 0' }}>{new Date(item.date).toLocaleDateString()}</p>
                {item.status === 'completed' && (
                  item.rated ? (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star}><StarIcon filled={star <= item.rating} /></span>
                      ))}
                      <span style={{ fontSize: '12px', color: '#dd901d', marginLeft: '8px', fontWeight: 600 }}>{item.rating} stars</span>
                    </div>
                  ) : (
                    <button onClick={() => handleRateService(item.id)} style={{ width: '100%', padding: '8px', backgroundColor: 'rgba(221, 144, 29, 0.15)', border: '1px solid rgba(221, 144, 29, 0.3)', borderRadius: '6px', color: '#dd901d', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(221, 144, 29, 0.25)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(221, 144, 29, 0.15)'; }}>
                      Rate Service
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── COUPONS SECTION ─── */}
        <section style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.5s ease 0.3s' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', fontFamily: "'Georgia', serif", color: '#dd901d' }}>Your Coupons</h2>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['available', 'claimed', 'expired'].map(filter => (
              <button key={filter} onClick={() => setCouponFilter(filter)} style={{ padding: '8px 16px', backgroundColor: couponFilter === filter ? '#dd901d' : 'rgba(221, 144, 29, 0.1)', border: `1px solid ${couponFilter === filter ? '#dd901d' : 'rgba(221, 144, 29, 0.3)'}`, borderRadius: '6px', color: couponFilter === filter ? '#000' : '#dd901d', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s ease' }}>
                {filter === 'available' ? 'Available' : filter === 'claimed' ? 'Claimed' : 'Expired'}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredCoupons.map(coupon => (
              <div key={coupon.id} style={{ backgroundColor: coupon.status === 'expired' ? 'rgba(152, 143, 129, 0.05)' : '#1a1714', border: `1px solid ${coupon.status === 'expired' ? 'rgba(152, 143, 129, 0.2)' : 'rgba(221, 144, 29, 0.2)'}`, borderRadius: '12px', padding: '16px', opacity: coupon.status === 'expired' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: coupon.status === 'expired' ? '#988f81' : '#dd901d' }}>{coupon.discount}</h3>
                    <p style={{ fontSize: '12px', color: '#b8a599', margin: 0 }}>{coupon.code}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: coupon.status === 'expired' ? 'rgba(152, 143, 129, 0.2)' : coupon.claimed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(221, 144, 29, 0.15)', color: coupon.status === 'expired' ? '#988f81' : coupon.claimed ? '#22c55e' : '#dd901d', textTransform: 'uppercase' }}>{coupon.status === 'expired' ? 'Expired' : coupon.claimed ? 'Claimed' : 'Available'}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#e5d9d0', margin: '0 0 12px 0' }}>{coupon.description}</p>
                <p style={{ fontSize: '11px', color: '#b8a599', margin: '0 0 12px 0' }}>Expires: {new Date(coupon.expiration).toLocaleDateString()}</p>
                {coupon.status !== 'expired' && !coupon.claimed && (
                  <button onClick={() => handleClaimCoupon(coupon.id)} style={{ width: '100%', padding: '8px', backgroundColor: '#dd901d', border: 'none', borderRadius: '6px', color: '#000', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#e6a326'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#dd901d'; }}>
                    Claim Coupon
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── RATING MODAL ─── */}
      {selectedForRating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: '#1a1714', borderRadius: '16px', border: '1px solid rgba(221, 144, 29, 0.2)', padding: '32px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px 0', fontFamily: "'Georgia', serif" }}>Rate {selectedForRating.service}</h3>
            <p style={{ fontSize: '14px', color: '#b8a599', margin: '0 0 24px 0' }}>Stylist: {selectedForRating.stylist}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRatingValue(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '32px', transition: 'transform 0.2s ease', transform: ratingValue >= star ? 'scale(1.2)' : 'scale(1)' }} onMouseEnter={(e) => { e.target.style.transform = 'scale(1.2)'; }} onMouseLeave={(e) => { e.target.style.transform = ratingValue >= star ? 'scale(1.2)' : 'scale(1)'; }}>
                  <StarIcon filled={ratingValue >= star} />
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelectedForRating(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'rgba(239, 67, 67, 0.1)', border: '1px solid rgba(239, 67, 67, 0.3)', borderRadius: '8px', color: '#ef4343', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleSubmitRating} disabled={ratingValue === 0} style={{ flex: 1, padding: '12px', backgroundColor: ratingValue > 0 ? '#dd901d' : '#888', border: 'none', borderRadius: '8px', color: '#000', cursor: ratingValue > 0 ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s ease' }} onMouseEnter={(e) => { if (ratingValue > 0) e.target.style.backgroundColor = '#e6a326'; }} onMouseLeave={(e) => { if (ratingValue > 0) e.target.style.backgroundColor = '#dd901d'; }}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ─── */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#22c55e', color: '#fff', padding: '14px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', animation: 'slideUp 0.3s ease' }}>
          {toastMessage}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
