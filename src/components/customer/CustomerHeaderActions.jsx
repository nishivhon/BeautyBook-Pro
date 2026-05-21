import React, { useEffect, useMemo, useRef, useState } from "react";

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

const CheckIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Use a dedicated storage key so customer and admin theme preferences remain independent.
const themeStorageKey = "customerThemeMode";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(themeStorageKey);
  return saved === "dark" ? "dark" : "light";
};

const defaultNotifications = [
  { id: 1, tone: "green", category: "Appointment confirmed", title: "Appointment confirmed", description: "Your appointment has been confirmed.", time: "Just now", unread: true },
  { id: 2, tone: "blue", category: "Appointment reminder", title: "Appointment reminder", description: "You have an upcoming appointment.", time: "1h", unread: true },
  { id: 3, tone: "amber", category: "Appointment cancelled", title: "Appointment cancelled", description: "An appointment was cancelled.", time: "2h", unread: false },
  { id: 4, tone: "green", category: "Appointment completed", title: "Service completed", description: "Your service was completed and is ready for rating.", time: "Today", unread: false },
  { id: 5, tone: "green", category: "Coupon awarded", title: "Coupon received", description: "You've been awarded a coupon.", time: "Today", unread: false },
];

export function CustomerHeaderActions({ externalNotifications = [], profile = null }) {
  const wrapperRef = useRef(null);
  const themeTransitionTimerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [themeMode, setThemeMode] = useState(getInitialTheme);
  const [notifications, setNotifications] = useState(defaultNotifications);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);
  const displayName = profile?.name || profile?.email || "Customer";

  useEffect(() => () => {
    if (themeTransitionTimerRef.current) window.clearTimeout(themeTransitionTimerRef.current);
    if (typeof document !== "undefined") document.documentElement.classList.remove("theme-transitioning");
  }, []);

  useEffect(() => {
    // externalNotifications may be either pre-shaped UI notifications or raw appointment objects.
    const seed = Array.isArray(externalNotifications) && externalNotifications.length > 0 ? externalNotifications : defaultNotifications;

    const mapped = (seed || []).map((it, idx) => {
      // If already has UI fields, pass through
      if (it && it.category && it.title) {
        return { ...it, id: it.id ?? `ui-${idx}`, unread: !!it.unread };
      }

      // If this looks like an appointment object, map it to a customer-friendly notification
      // Expected appointment shape: { id, date, time, status, service, staff }
      if (it && (it.date || it.time || it.status || it.service)) {
        let category = "Appointment";
        if (it.status === "confirmed" || it.status === "pending") category = "Appointment confirmed";
        if (it.status === "reminder" || it.status === "upcoming") category = "Appointment reminder";
        if (it.status === "cancelled") category = "Appointment cancelled";
        if (it.status === "done" || it.status === "completed") category = "Appointment completed";

        const title = `${category}: ${it.service || "Service"}`;
        const description = `${it.date ? new Date(it.date).toLocaleDateString() : ""} ${it.time || ""}`.trim();
        const tone = it.status === "cancelled" ? "amber" : (it.status === "done" || it.status === "completed") ? "green" : "blue";

        return {
          id: it.id ?? `apt-${idx}`,
          tone,
          category,
          title,
          description,
          time: it.time || it.date || "",
          unread: !!it.unread,
        };
      }

      // Generic fallback
      return { id: `gen-${idx}`, tone: it.tone || "amber", category: it.category || "Info", title: it.title || "Notification", description: it.description || "", time: it.time || "", unread: !!it.unread };
    });

    // Append mock coupons/promos for UI purposes (replace with real API when available)
    const mockCouponsAndPromos = [
      // TODO: Replace with real coupon/promo notification feed (e.g. `/api/customers/:id/notifications`)
      { id: `mock-coupon-1`, tone: "green", category: "Coupon awarded", title: "You've received a 10% coupon", description: "Use code WELCOME10 on your next visit.", time: "Today", unread: false },
      { id: `mock-promo-1`, tone: "blue", category: "Promo announcement", title: "Limited promo: 20% off selected services", description: "This week only — book now to save!", time: "2d", unread: false },
    ];

    setNotifications([...mapped, ...mockCouponsAndPromos]);
  }, [JSON.stringify(externalNotifications), profile?.id]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = themeMode;
      window.localStorage.setItem(themeStorageKey, themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    const handlePointerDown = (event) => { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpenMenu(null); };
    const handleEscape = (event) => { if (event.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handlePointerDown); document.removeEventListener("touchstart", handlePointerDown); document.removeEventListener("keydown", handleEscape); };
  }, []);

  const toggleMenu = (menu) => { setOpenMenu((prev) => (prev === menu ? null : menu)); };
  const closeMenu = () => { setOpenMenu(null); };

  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("theme-transitioning");
      if (themeTransitionTimerRef.current) window.clearTimeout(themeTransitionTimerRef.current);
      themeTransitionTimerRef.current = window.setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 500);
    }
    setThemeMode((m) => (m === "dark" ? "light" : "dark"));
  };

  const markAllNotificationsRead = () => setNotifications((n) => n.map((it) => ({ ...it, unread: false })));

  return (
    <div className="admin-header-actions" ref={wrapperRef}>
      <button className={`dash-action-btn admin-header-trigger${openMenu === "notifications" ? " active" : ""}`} type="button" onClick={() => toggleMenu("notifications")} aria-expanded={openMenu === "notifications"} aria-haspopup="menu">
        <BellIcon size={14} color="currentColor" />
        Notifications
        {unreadCount > 0 && <span className="admin-header-badge">{unreadCount}</span>}
      </button>

      <button className={`dash-action-btn admin-header-trigger${openMenu === "settings" ? " active" : ""}`} type="button" onClick={() => toggleMenu("settings")} aria-expanded={openMenu === "settings"} aria-haspopup="menu">
        <SettingsIcon size={14} color="currentColor" />
        Settings
      </button>

      {openMenu && (
        <div className="admin-header-dropdown" role="menu" aria-label={openMenu === "notifications" ? "Notifications" : "Settings"}>
          {openMenu === "notifications" ? (
            <>
              <div className="admin-dropdown-topbar">
                <div>
                  <p className="admin-dropdown-eyebrow">Inbox</p>
                  <h3 className="admin-dropdown-title">Recent Notifications</h3>
                </div>
                <button type="button" className="admin-dropdown-link admin-mark-read-link" onClick={markAllNotificationsRead}>Mark all as read</button>
              </div>

              <div className="admin-notification-list" style={{ minHeight: 220, maxHeight: 360, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="admin-notification-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 20, color: 'var(--color-muted, #6b7280)' }}>
                    You're all caught up! We'll notify you about appointments, coupons, and promos here.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button key={notification.id} type="button" className={`admin-notification-item${notification.unread ? " unread" : ""}`} onClick={closeMenu}>
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
