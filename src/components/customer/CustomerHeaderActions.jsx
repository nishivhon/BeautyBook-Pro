import React, { useEffect, useMemo, useRef, useState } from "react";
import { useThemeScope } from "../../theme/publicThemeContext";

const BellIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth="1.8" />
  </svg>
);

const SunIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.8" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const MoonIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M16.7 14.4A7.2 7.2 0 019.6 4.2a8.2 8.2 0 1011.6 11.6 7.2 7.2 0 01-4.5-1.4z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getApiBase = () => (
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "/api"
);

const getReadCacheKey = (customerId) => `customerNotificationReadCache:${customerId}`;
const MANILA_TIME_ZONE = "Asia/Manila";

const readNotificationCache = (customerId) => {
  if (typeof window === "undefined" || !customerId) return [];

  try {
    const raw = localStorage.getItem(getReadCacheKey(customerId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("[CustomerHeaderActions] Failed to read notification cache:", error);
    return [];
  }
};

const writeNotificationCache = (customerId, readIds) => {
  if (typeof window === "undefined" || !customerId) return;

  try {
    localStorage.setItem(getReadCacheKey(customerId), JSON.stringify(Array.from(new Set(readIds))));
  } catch (error) {
    console.warn("[CustomerHeaderActions] Failed to write notification cache:", error);
  }
};

const formatCouponTime = (updatedAt) => {
  if (!updatedAt) return "Recently";
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: MANILA_TIME_ZONE,
  }).format(date);
};

const buildCouponNotifications = (coupons = []) => {
  return (Array.isArray(coupons) ? coupons : [])
    .filter((coupon) => String(coupon?.status || "").toLowerCase() === "active")
    .map((coupon, index) => ({
      id: coupon?.id ?? `coupon-${index}`,
      tone: "green",
      category: "Coupon added",
      title: `${coupon?.code || "Coupon"} added`,
      description: coupon?.description || coupon?.name || "A new coupon was added recently.",
      time: formatCouponTime(coupon?.updated_at),
      unread: true,
      sortAt: coupon?.updated_at || coupon?.created_at || null,
    }));
};

const formatAppointmentTime = (date, time24) => {
  const datePart = date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: MANILA_TIME_ZONE,
      }).format(new Date(`${date}T00:00:00Z`))
    : "Upcoming";
  return datePart;
};

const formatBookedAtTime = (updatedAt) => {
  if (!updatedAt) return "";
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: MANILA_TIME_ZONE,
  }).format(date);
};

const buildAppointmentNotifications = (appointments = []) => {
  return (Array.isArray(appointments) ? appointments : [])
    .filter((appointment) => {
      const status = String(appointment?.status || "").toLowerCase();
      return ["pending", "current", "confirmed", "upcoming"].includes(status);
    })
    .map((appointment, index) => ({
      id: `appointment-${appointment?.id ?? index}`,
      tone: "blue",
      category: "Appointment confirmed",
      title: `${appointment?.service || "Service"} booking confirmed`,
      description: formatAppointmentTime(appointment?.date, appointment?.time_24 || appointment?.time),
      time: formatBookedAtTime(appointment?.updated_at),
      unread: true,
      sortAt: appointment?.updated_at || appointment?.date && appointment?.time_24 ? `${appointment.date}T${appointment.time_24}` : appointment?.date || null,
    }));
};

const buildCompletedServiceNotifications = (appointments = []) => {
  return (Array.isArray(appointments) ? appointments : [])
    .filter((appointment) => String(appointment?.status || "").toLowerCase() === "done")
    .map((appointment, index) => ({
      id: `done-${appointment?.id ?? index}`,
      tone: "green",
      category: "Service completed",
      title: `${appointment?.service || "Service"} completed`,
      description: `Status: done`,
      time: formatBookedAtTime(appointment?.updated_at),
      unread: true,
      sortAt: appointment?.updated_at || appointment?.date || null,
    }));
};

export function CustomerHeaderActions({ externalNotifications = [], profile = null, compact = false }) {
  const wrapperRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));
  const { themeMode, toggleTheme } = useThemeScope("customer");
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);
  const displayName = profile?.name || profile?.email || "Customer";

  const getReadIds = () => readNotificationCache(profile?.id);

  const mergeReadState = (items = []) => {
    const readIds = new Set(getReadIds().map((id) => String(id)));
    return (Array.isArray(items) ? items : []).map((item) => ({
      ...item,
      unread: !readIds.has(String(item.id)),
    }));
  };

  useEffect(() => {
    if (Array.isArray(externalNotifications) && externalNotifications.length > 0) {
      const mapped = externalNotifications.map((it, idx) => ({
        id: it?.id ?? `ui-${idx}`,
        tone: it?.tone || "green",
        category: it?.category || "Notification",
        title: it?.title || "Notification",
        description: it?.description || "",
        time: it?.time || "",
        unread: !!it?.unread,
      }));

      setNotifications(mapped);
    } else {
      setNotifications([]);
    }
  }, [JSON.stringify(externalNotifications)]);

  useEffect(() => {
    if (openMenu !== "notifications") return;
    if (!profile?.id) return;

    let cancelled = false;

    const loadBookingNotifications = async () => {
      setNotificationLoading(true);

      try {
        const { emails = [], phones = [] } = profile || {};
        const email = emails?.[0] || profile?.email || "";
        const phone = phones?.[0] || profile?.phone || "";

        const baseParams = new URLSearchParams({
          ...(email ? { email } : {}),
          ...(phone ? { phone: phone.replace(/\D/g, "") } : {}),
        });

        const couponPromise = fetch(`${getApiBase()}/coupons/read?recentDays=3&status=active`);
        const activeAppointmentPromise = email || phone
          ? fetch(`${getApiBase()}/appointments/read/by-customer?${baseParams.toString()}`)
          : Promise.resolve(null);
        const completedAppointmentPromise = email || phone
          ? fetch(`${getApiBase()}/appointments/read/by-customer?${new URLSearchParams({
              ...Object.fromEntries(baseParams.entries()),
              status: "done",
              days: "7",
            }).toString()}`)
          : Promise.resolve(null);

        const [couponResponse, appointmentResponse, completedResponse] = await Promise.all([couponPromise, activeAppointmentPromise, completedAppointmentPromise]);
        const couponData = couponResponse?.ok ? await couponResponse.json() : null;
        const appointmentData = appointmentResponse?.ok ? await appointmentResponse.json() : null;
        const completedData = completedResponse?.ok ? await completedResponse.json() : null;

        const combinedNotifications = [
          ...buildCouponNotifications(couponData?.data || []),
          ...buildAppointmentNotifications(appointmentData?.appointments || []),
          ...buildCompletedServiceNotifications(completedData?.appointments || []),
        ]
          .sort((a, b) => new Date(b.sortAt || 0).getTime() - new Date(a.sortAt || 0).getTime())
          .map(({ sortAt, ...item }) => item);

        const couponNotifications = mergeReadState(combinedNotifications);

        if (!cancelled) {
          setNotifications(couponNotifications);
        }
      } catch (error) {
        console.error('[CustomerHeaderActions] Failed to load notifications:', error);
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) setNotificationLoading(false);
      }
    };
    loadBookingNotifications();

    return () => {
      cancelled = true;
    };
  }, [openMenu, profile?.id, profile?.emails, profile?.phones]);

  useEffect(() => {
    const handlePointerDown = (event) => { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpenMenu(null); };
    const handleEscape = (event) => { if (event.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handlePointerDown); document.removeEventListener("touchstart", handlePointerDown); document.removeEventListener("keydown", handleEscape); };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = (menu) => { setOpenMenu((prev) => (prev === menu ? null : menu)); };
  const closeMenu = () => { setOpenMenu(null); };

  const mobileDropdownStyle = isMobileView
    ? {
        position: "fixed",
        top: 84,
        right: 8,
        left: "auto",
        width: "min(80vw, 250px)",
        maxHeight: "calc(100vh - 96px)",
        padding: 12,
        zIndex: 13050,
        overflow: "hidden",
      }
    : undefined;

  const notificationListStyle = isMobileView
    ? { minHeight: 140, maxHeight: 220, overflowY: "scroll", paddingRight: 18, scrollbarGutter: "stable both-edges" }
    : { minHeight: 220, maxHeight: 360, overflowY: "auto" };

  const markAllReadStyle = isMobileView
    ? {
        width: "100%",
        maxWidth: "100%",
        textAlign: "left",
        whiteSpace: "normal",
        fontSize: "0.75rem",
        lineHeight: 1.2,
        fontWeight: 700,
      }
    : undefined;

  const markAllNotificationsRead = () => {
    setNotifications((current) => {
      const next = current.map((it) => ({ ...it, unread: false }));
      writeNotificationCache(profile?.id, next.map((it) => it.id));
      return next;
    });
  };

  const markNotificationRead = (notificationId) => {
    if (!notificationId) return;

    setNotifications((current) => {
      const next = current.map((it) => (String(it.id) === String(notificationId) ? { ...it, unread: false } : it));
      const readIds = next.filter((it) => !it.unread).map((it) => it.id);
      writeNotificationCache(profile?.id, readIds);
      return next;
    });
  };

  return (
    <div className="admin-header-actions" ref={wrapperRef}>
      <button className={`dash-action-btn admin-header-trigger${openMenu === "notifications" ? " active" : ""}`} type="button" onClick={() => toggleMenu("notifications")} aria-expanded={openMenu === "notifications"} aria-haspopup="menu" aria-label="Notifications" title="Notifications">
        <BellIcon size={14} color="currentColor" />
        {!compact ? <span>Notifications</span> : null}
        {unreadCount > 0 && <span className="admin-header-badge">{unreadCount}</span>}
      </button>

      <button className={`dash-action-btn admin-header-trigger${openMenu === "settings" ? " active" : ""}`} type="button" onClick={() => toggleMenu("settings")} aria-expanded={openMenu === "settings"} aria-haspopup="menu" aria-label="Settings" title="Settings">
        <SettingsIcon size={14} color="currentColor" />
        {!compact ? <span>Settings</span> : null}
      </button>

      {openMenu && (
        <div className="admin-header-dropdown" role="menu" aria-label={openMenu === "notifications" ? "Notifications" : "Settings"} style={mobileDropdownStyle}>
          {openMenu === "notifications" ? (
            <>
              <div className="admin-dropdown-topbar">
                <div>
                  <p className="admin-dropdown-eyebrow">Inbox</p>
                  <h3 className="admin-dropdown-title">Recent Notifications</h3>
                </div>
                <button type="button" className="admin-dropdown-link admin-mark-read-link" onClick={markAllNotificationsRead} style={markAllReadStyle}>Mark all as read</button>
              </div>

              <div className="admin-notification-list" style={notificationListStyle}>
                {notificationLoading ? (
                  <div className="admin-notification-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 20, color: 'var(--color-muted, #6b7280)' }}>
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="admin-notification-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 20, color: 'var(--color-muted, #6b7280)' }}>
                    No recent coupons or appointment confirmations found.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button key={notification.id} type="button" className={`admin-notification-item${notification.unread ? " unread" : ""}`} onClick={() => {
                      markNotificationRead(notification.id);
                      closeMenu();
                    }}>
                      <span className={`admin-notification-tone tone-${notification.tone}`} />
                      <div className="admin-notification-copy">
                        <div className="admin-notification-row">
                          <span className="admin-notification-category">{notification.category}</span>
                          {notification.unread && <span className="admin-notification-unread">New</span>}
                        </div>
                        <p className="admin-notification-title">{notification.title}</p>
                        <p className="admin-notification-description">{notification.description}</p>
                      </div>
                      <span className="admin-notification-time">{notification.time}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="admin-dropdown-topbar">
                <div>
                  <p className="admin-dropdown-eyebrow">Preferences</p>
                  <h3 className="admin-dropdown-title">Settings</h3>
                </div>
              </div>

              <button type="button" className="admin-theme-toggle" onClick={toggleTheme}>
                <div className="admin-theme-copy">
                  <span className="admin-theme-label">Appearance</span>
                  <strong>{themeMode === "dark" ? "Dark mode" : "Light mode"}</strong>
                  <p>Switch between the charcoal and ivory palettes.</p>
                </div>
                <span className={`admin-theme-switch ${themeMode === "light" ? "is-light" : "is-dark"}`} aria-hidden>
                  <span className="admin-theme-switch-track" />
                  <span className="admin-theme-switch-thumb">{themeMode === "dark" ? <MoonIcon size={11} color="#fff" /> : <SunIcon size={11} color="#1a0f00" />}</span>
                </span>
              </button>

              <div className="admin-dropdown-footer">
                <span className="admin-dropdown-footnote">More settings coming soon: timezone, language.</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerHeaderActions;
