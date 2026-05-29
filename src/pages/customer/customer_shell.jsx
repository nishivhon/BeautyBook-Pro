import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import AppointmentForm from "../../components/modal/customer/appointment/phase_one";
import { AppointmentFormPhase2 } from "../../components/modal/customer/appointment/phase_two";
import { AppointmentFormPhase3 } from "../../components/modal/customer/appointment/phase_three";
import { AppointmentFormPhase4 } from "../../components/modal/customer/appointment/phase_four";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";
import { useToast } from "../../components/toast";
import CustomerHeaderActions from "../../components/customer/CustomerHeaderActions";
import {
  LogoMark,
  CustomerDashboardIcon,
  CustomerProfileIcon,
  CustomerHistoryIcon,
  CustomerCouponsIcon,
  CustomerBookingIcon,
  CustomerLogOutIcon,
} from "../../components/customer/customerDashboardIcons";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { useCustomerAppointmentsData } from "./customer_store";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: CustomerDashboardIcon, path: "/customer/dashboard" },
  { id: "profile", label: "Profile", icon: CustomerProfileIcon, path: "/customer/profile" },
  { id: "history", label: "Service History", icon: CustomerHistoryIcon, path: "/customer/history" },
  { id: "coupons", label: "Coupons", icon: CustomerCouponsIcon, path: "/customer/coupons" },
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
  const [isMobileViewport, setIsMobileViewport] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem("customerSidebarExpanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showAppointment, setShowAppointment] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [appointmentPhase, setAppointmentPhase] = useState(1);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [appointments] = useCustomerAppointmentsData();
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem("customerSidebarExpanded", JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobileViewport(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const sidebarDisplayName = profile?.name || "Customer";
  const sidebarDisplayInitial = sidebarDisplayName.trim().charAt(0).toUpperCase() || "C";

  // Helper function to convert 12-hour format to Date object
  const parseAppointmentDateTime = (dateStr, timeStr) => {
    try {
      let timeToUse = timeStr || "";
      
      // If time is in 12-hour format (e.g., "10:00 AM"), convert to 24-hour
      if (timeToUse.includes("AM") || timeToUse.includes("PM")) {
        const [time, period] = timeToUse.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let hours24 = hours;
        
        if (period === "PM" && hours !== 12) hours24 = hours + 12;
        if (period === "AM" && hours === 12) hours24 = 0;
        
        timeToUse = `${hours24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      }
      
      // Create datetime string (YYYY-MM-DD HH:MM)
      const dateTimeStr = `${dateStr}T${timeToUse || "00:00"}`;
      return new Date(dateTimeStr);
    } catch (err) {
      console.error("[parseAppointmentDateTime] Error parsing:", err);
      return null;
    }
  };

  // Helper function to check if appointment is active (should block booking)
  const isAppointmentActive = (appointment) => {
    // Only block if status is pending or current
    if (!appointment.status || !["pending", "current"].includes(appointment.status)) {
      return false;
    }
    
    // Check if appointment date/time is in the future
    const appointmentDateTime = parseAppointmentDateTime(appointment.date, appointment.time);
    if (!appointmentDateTime) return false;
    
    const now = new Date();
    return appointmentDateTime > now;
  };

  // Helper function to handle Book Appointment button click
  const handleBookAppointmentClick = () => {
    // Filter for active appointments that should block booking
    const activeAppointments = appointments.filter(isAppointmentActive);
    
    if (activeAppointments.length > 0) {
      const appointmentWord = activeAppointments.length === 1 ? "appointment" : "appointments";
      showToast({
        message: `You already have an upcoming ${appointmentWord}. Please complete or cancel your current booking before scheduling a new one.`,
        type: "warning",
      });
      return;
    }
    
    // No active appointments, proceed with booking
    setShowAppointment(true);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
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
    setAppointmentData((prev) => ({
      ...(prev || {}),
      services: details.services,
      promoCode: details?.promoCode || prev?.promoCode || "",
      appliedCoupon: details?.appliedCoupon || prev?.appliedCoupon || null,
    }));
    setAppointmentPhase(3);
  };

  const handlePhase3Continue = (details) => {
    if (!details?.stylist) {
      showToast({ message: "Please select a stylist to continue", type: "warning" });
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
    const servicesData = appointmentData?.services; // Now guaranteed to be array
    const stylistName = appointmentData?.stylist?.name || "Any Available Stylist";
    const bookingDateISO = scheduleInfo?.dateISO || scheduleInfo?.date?.date || scheduleInfo?.date || null;
    const bookingDateLabel = bookingDateISO
      ? new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          month: 'long',
          day: 'numeric',
        }).format(new Date(`${bookingDateISO}T00:00:00`))
      : (scheduleInfo?.date?.date || scheduleInfo?.dateLabel || "Not Selected");
    const bookingTimeLabel = scheduleInfo?.time || scheduleInfo?.timeLabel || "N/A";

    let allServices = servicesData || [];

    console.log("[formatBooking] Services data:", servicesData);
    console.log("[formatBooking] All services:", allServices);

    const formattedServices = allServices.map((service) => ({
      title: service.title || service.name || "Service",
      duration: service.duration || service.est_time || "N/A",
      price: service.price || "N/A",
      est: service.duration || service.est_time || "N/A",
    }));

    return {
      rawServices: allServices,
      services: formattedServices,
      dateTime: `${bookingDateLabel} | ${bookingTimeLabel}`,
      date: bookingDateISO,
      time: scheduleInfo?.time || null,
      name: profile?.name || "",
      email: profile?.emails?.[0] || "",
      phone: profile?.phones?.[0] || "",
      stylist: stylistName,
      refNo: "18xxx-xxxx",
      verificationMethod: profile?.notificationPreference || "email",
      promoCode: appointmentData?.promoCode || "",
      appliedCoupon: appointmentData?.appliedCoupon || null,
      coupon: appointmentData?.appliedCoupon || null,
    };
  };

  const handlePhase4Confirm = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log("[Phase4] Profile object:", profile);
      console.log("[Phase4] Profile ID:", profile?.id);
      console.log("[Phase4] API URL:", apiUrl);
      
      const booking = formatBooking();
      const serviceEstTime = Array.isArray(booking.rawServices)
        ? booking.rawServices.reduce((total, service) => {
            const minutes = Number(service?.est_time ?? service?.estimated_time ?? service?.duration_minutes ?? service?.duration ?? 0);
            return total + (Number.isFinite(minutes) ? minutes : 0);
          }, 0)
        : 0;

      const payload = {
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: booking.date,
        time: booking.time,
        service: booking.services.map((s) => s.title).join(", ") || "General Service",
        services: booking.rawServices,
        staff_assigned: booking.stylist,
        service_est_time: serviceEstTime,
      };

      const response = await fetch(`${apiUrl}/appointments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok || data.success) {
          console.log("[Phase4] Appointment creation successful, response:", data);
        // Calculate total price from all services
        const totalPrice = booking.services.reduce((sum, service) => {
          const price = parseFloat(service.price) || 0;
          return sum + price;
        }, 0);
        
  console.log("[Phase4] Services:", booking.services);
  console.log("[Phase4] Total price calculated:", totalPrice);

        // Add booking to customer histories
        if (profile?.id) {
          const historyPayload = {
            customerId: profile.id,
            service: payload.service,
            staff: booking.stylist,
            price: totalPrice,
            date: booking.date,
          };

          try {
            console.log("[Booking] Sending history update:", historyPayload);
            const historyResponse = await fetch(`${apiUrl}/customers/update-histories`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(historyPayload),
            });
            const historyData = await historyResponse.json();
            console.log("[Booking] History update response:", historyData);
            
            if (!historyResponse.ok) {
              console.error("[Booking] History update failed:", historyData);
            }
          } catch (historyError) {
            console.error("[Booking] Exception while updating history:", historyError);
            console.error("[Booking] Error details:", {
              message: historyError.message,
              stack: historyError.stack
            });
            // Don't fail the booking if history save fails
          }
        } else {
          console.warn("[Booking] No profile.id available for history update");
        }

        handleCancelBooking();
        showToast({ message: "Appointment booked successfully", type: "success" });
      } else {
        showToast({ message: data.error || "Failed to book appointment. Please try again.", type: "error" });
      }
    } catch (error) {
      showToast({ message: `Error: ${error.message || "Unable to book appointment"}`, type: "error" });
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowBackdropConfirm(true);
    }
  };

  return (
    <>
      <div className="customer-shell">
        <DashboardShell
          navItems={NAV_ITEMS}
          activeNav={activeNav}
          LogoIcon={LogoMark}
          LogOutIcon={CustomerLogOutIcon}
          roleLabel={sidebarDisplayName}
          roleInitial={sidebarDisplayInitial}
          showSidebarHeader={false}
          title={PAGE_META[activeNav].title}
          subtitle={`BeautyBook Pro · ${todayDate} · ${PAGE_META[activeNav].subtitle}`}
          profile={profile}
          notifications={[]}
          headerExtraActions={<CustomerHeaderActions externalNotifications={appointments || []} profile={profile} compact={isMobileViewport} />}
          storageKey="customerSidebarExpanded"
          sidebarExtraAction={(
            <button onClick={handleBookAppointmentClick} className="nav-button cdb-book-nav-btn" title="Book Appointment" type="button">
              <CustomerBookingIcon color="currentColor" />
              {sidebarExpanded && <span>Book Appointment</span>}
            </button>
          )}
          onLogoutConfirm={confirmLogout}
          logoutTitle="Log Out?"
          logoutMessage="Are you sure you want to log out of your customer dashboard?"
          logoutConfirmText="Yes, Log Out"
          logoutCancelText="Stay Logged In"
          profileActionLabel="Edit Profile"
          profileActionPath="/customer/profile"
          enableMobileDrawer
          showHeaderPageMeta={!isMobileViewport}
        >
          {isMobileViewport ? (
            <section className="cdb-page-meta-section">
              <h1
                className="cdb-page-meta-title"
                style={{ fontSize: "1.12rem", lineHeight: 1.16 }}
              >
                {PAGE_META[activeNav].title}
              </h1>
              <p
                className="cdb-page-meta-subtitle"
                style={{ fontSize: "0.82rem", lineHeight: 1.3 }}
              >
                BeautyBook Pro · {todayDate} · {PAGE_META[activeNav].subtitle}
              </p>
            </section>
          ) : null}
          {children}
        </DashboardShell>
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
              onClose={handleCancelBooking}
              initialData={appointmentData || {}}
            />
          ) : appointmentPhase === 3 ? (
            <AppointmentFormPhase3
              onBack={handleBackPhase3}
              onContinue={handlePhase3Continue}
              onCancel={handleCancelBooking}
              onClose={handleCancelBooking}
              initialData={{ services: appointmentData?.services || [], schedule: appointmentData?.schedule || {} }}
              showTime={false}
              showNext={false}
            />
          ) : appointmentPhase === 4 ? (
            <AppointmentFormPhase4
              onBack={() => setAppointmentPhase(3)}
              onConfirm={handlePhase4Confirm}
              onCancel={handleCancelBooking}
              onClose={handleCancelBooking}
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

      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmText="Yes, Log Out"
        cancelText="Stay Logged In"
        onConfirm={() => confirmLogout()}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
