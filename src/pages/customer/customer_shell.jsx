import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import AppointmentForm from "../../components/modal/customer/appointment/phase_one";
import { AppointmentFormPhase2 } from "../../components/modal/customer/appointment/phase_two";
import { AppointmentFormPhase3 } from "../../components/modal/customer/appointment/phase_three";
import { AppointmentFormPhase4 } from "../../components/modal/customer/appointment/phase_four";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";
import { Toast } from "../../components/toast";

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="3.5" stroke="#000" strokeWidth="2" />
    <circle cx="7" cy="15" r="3.5" stroke="#000" strokeWidth="2" />
    <path d="M9.8 8.8l7 7M9.8 13.2L17 6.2" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DashboardIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
    <rect x="10" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
    <rect x="1" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
    <rect x="10" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
  </svg>
);

const UserIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5.5" r="3.5" stroke={color} strokeWidth="1.6" />
    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const HistoryIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TicketIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16v2H4V4zm0 4h16v8H4V8zm0 10h16v2H4v-2z" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

const BookingIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.6" />
    <path d="M8 2v4M16 2v4M3 10h18" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const BellIcon = ({ color = "#fff" }) => (
  <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1a5 5 0 00-5 5v3l-1.5 2.5h13L13 9V6a5 5 0 00-5-5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6.5 15.5a1.5 1.5 0 003 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SettingsIcon = ({ color = "#fff" }) => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.5" cy="8.5" r="2.5" stroke={color} strokeWidth="1.6" />
    <path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3.05 3.05l1.41 1.41M12.54 12.54l1.41 1.41M3.05 13.95l1.41-1.41M12.54 4.46l1.41-1.41" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const LogOutIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 15H3.5A1.5 1.5 0 012 13.5v-9A1.5 1.5 0 013.5 3H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 12l4-3-4-3M16 9H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon, path: "/customer/dashboard" },
  { id: "profile", label: "Profile", icon: UserIcon, path: "/customer/profile" },
  { id: "history", label: "Service History", icon: HistoryIcon, path: "/customer/history" },
  { id: "coupons", label: "Coupons", icon: TicketIcon, path: "/customer/coupons" },
];

const PAGE_META = {
  dashboard: { title: "Customer Dashboard", subtitle: "Summary of your profile, services, and coupons" },
  profile: { title: "Profile", subtitle: "Manage personal details and notifications" },
  history: { title: "Service History", subtitle: "Review past and current transactions" },
  coupons: { title: "Coupons", subtitle: "Browse available, promo, and limited-time offers" },
};

export function CustomerShell({ activeNav, profile, children }) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem("customerSidebarExpanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showAppointment, setShowAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [appointmentPhase, setAppointmentPhase] = useState(1);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("customerSidebarExpanded", JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const todayDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    []
  );

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleLogout = () => {
    logoutOperator();
    navigate("/");
  };

  const handleCancelBooking = () => {
    setShowAppointment(false);
    setAppointmentPhase(1);
    setAppointmentData(null);
    setShowBackdropConfirm(false);
  };

  const handleAppointmentContinue = (details) => {
    setAppointmentData((prev) => ({ ...(prev || {}), schedule: details }));
    setAppointmentPhase(2);
  };

  const handlePhase2Continue = (details) => {
    setAppointmentData((prev) => ({ ...(prev || {}), services: details }));
    setAppointmentPhase(3);
  };

  const handlePhase3Continue = (details) => {
    if (!details?.stylist) {
      displayToast("Please select a stylist to continue");
      return;
    }
    setAppointmentData((prev) => ({ ...(prev || {}), stylist: details.stylist }));
    setAppointmentPhase(4);
  };

  const handleBackPhase3 = (details) => {
    setAppointmentData((prev) => ({ ...(prev || {}), stylist: details?.stylist }));
    setAppointmentPhase(2);
  };

  const formatBooking = () => {
    const scheduleInfo = appointmentData?.schedule;
    const servicesData = appointmentData?.services;
    const stylistName = appointmentData?.stylist?.name || "Any Available Stylist";

    let allServices = [];
    if (servicesData) {
      const groups = [
        servicesData.selectedHairServices,
        servicesData.selectedNailServices,
        servicesData.selectedSkincareServices,
        servicesData.selectedMassageServices,
        servicesData.selectedPremiumServices,
      ];

      groups.forEach((arr) => {
        if (Array.isArray(arr) && arr.length > 0) {
          allServices = allServices.concat(arr);
        }
      });
    }

    const formattedServices = allServices.map((service) => ({
      title: service.title || service.name || "Service",
      duration: service.duration || "N/A",
      price: service.price || "N/A",
      est: service.duration || "N/A",
    }));

    return {
      services: formattedServices,
      dateTime: `${scheduleInfo?.date?.date || "Not Selected"} | ${scheduleInfo?.time || "N/A"}`,
      date: scheduleInfo?.dateISO || scheduleInfo?.date?.date || null,
      time: scheduleInfo?.time || null,
      name: profile?.name || "",
      email: profile?.emails?.[0] || "",
      phone: profile?.phones?.[0] || "",
      stylist: stylistName,
      refNo: "18xxx-xxxx",
      verificationMethod: profile?.notificationPreference || "email",
    };
  };

  const handlePhase4Confirm = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const booking = formatBooking();
      const payload = {
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: booking.date,
        time: booking.time,
        service: booking.services.map((s) => s.title).join(", ") || "General Service",
        staff_assigned: booking.stylist,
      };

      const response = await fetch(`${apiUrl}/appointments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok || data.success) {
        handleCancelBooking();
        displayToast("Appointment booked successfully");
      } else {
        displayToast(data.error || "Failed to book appointment. Please try again.");
      }
    } catch (error) {
      displayToast(`Error: ${error.message || "Unable to book appointment"}`);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowBackdropConfirm(true);
    }
  };

  return (
    <div className="super-admin-container">
      <aside
        className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-16px)",
          transition: "all 0.5s ease",
        }}
      >
        <div className="sidebar-logo-section">
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className="logo-toggle-btn" title="Toggle sidebar">
            <div className="logo-badge">
              <LogoIcon />
            </div>
          </button>
          {sidebarExpanded && <span className="brand-name">BeautyBook Pro</span>}
        </div>

        {sidebarExpanded && (
          <div className="admin-badge-pill">
            <div className="admin-badge-circle">C</div>
            <span className="admin-badge-text">Customer</span>
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`nav-button ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <item.icon color={isActive ? "#000" : "currentColor"} />
                {sidebarExpanded && <span>{item.label}</span>}
              </button>
            );
          })}

          <button onClick={() => setShowAppointment(true)} className="nav-button cdb-book-nav-btn" title="Book Appointment">
            <BookingIcon color="currentColor" />
            {sidebarExpanded && <span>Book Appointment</span>}
          </button>
        </nav>

        <div className="sidebar-logout-section">
          <button onClick={handleLogout} className="logout-button" title="Log out">
            <LogOutIcon />
            {sidebarExpanded && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      <div className="super-admin-main">
        <header className={`dashboard-header ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          <div className="dash-page-header">
            <div className="dash-page-title-block">
              <h1 className="dash-page-title">{PAGE_META[activeNav].title}</h1>
              <p className="dash-page-subtitle">BeautyBook Pro · {todayDate} · {PAGE_META[activeNav].subtitle}</p>
            </div>
            <div className="dash-page-actions">
              <button className="dash-action-btn cdb-header-book-btn" onClick={() => setShowAppointment(true)}>
                <BookingIcon color="#fff" />
                Book Appointment
              </button>
              <button className="dash-action-btn" onClick={() => displayToast("No new notifications") }>
                <BellIcon />
                Notifications
              </button>
              <button className="dash-action-btn" onClick={() => displayToast("Settings panel coming soon") }>
                <SettingsIcon />
                Settings
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-main">{children}</main>
      </div>

      {showAppointment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 101,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0,0,0,0.72)",
          }}
          onClick={handleBackdropClick}
        >
          {appointmentPhase === 1 ? (
            <AppointmentForm onBack={handleCancelBooking} onContinue={handleAppointmentContinue} />
          ) : appointmentPhase === 2 ? (
            <AppointmentFormPhase2
              onBack={() => setAppointmentPhase(1)}
              onContinue={handlePhase2Continue}
              onCancel={handleCancelBooking}
              initialData={appointmentData?.services}
            />
          ) : appointmentPhase === 3 ? (
            <AppointmentFormPhase3
              onBack={handleBackPhase3}
              onContinue={handlePhase3Continue}
              onCancel={handleCancelBooking}
              initialData={appointmentData}
            />
          ) : appointmentPhase === 4 ? (
            <AppointmentFormPhase4
              onBack={() => setAppointmentPhase(3)}
              onConfirm={handlePhase4Confirm}
              onCancel={handleCancelBooking}
              booking={formatBooking()}
            />
          ) : null}
        </div>
      )}

      <ConfirmationDialog
        isOpen={showBackdropConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your booking progress will be lost."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={() => {
          setShowBackdropConfirm(false);
          handleCancelBooking();
        }}
        onCancel={() => setShowBackdropConfirm(false)}
      />

      <Toast isVisible={showToast} message={toastMessage} type="info" duration={1200} />
    </div>
  );
}
