import React, { useEffect, useMemo, useRef, useState } from "react";
import { getOperatorSession } from "../../services/operatorAuth";

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

const notificationItems = [
  { id: 1, tone: "amber", category: "New booking", title: "Jake Quaker booked Haircut", description: "Scheduled for today at 9:00 AM with Any Available Stylist.", time: "2m ago", unread: true },
  { id: 2, tone: "blue", category: "Booking change", title: "Maria Garcia rescheduled her appointment", description: "Moved to 10:30 AM and updated the service notes.", time: "14m ago", unread: true },
  { id: 3, tone: "green", category: "Live queue", title: "Juan Dela Cruz moved to In Progress", description: "The live queue and dashboard queue were refreshed.", time: "28m ago", unread: false },
];

const settingsItems = [
  { id: "notification-preferences", label: "Notification preferences", description: "Choose which admin alerts should be visible." },
  { id: "profile-edit", label: "Profile settings", description: "Update username and avatar stored locally." },
];

const themeStorageKey = "adminThemeMode";
const notificationPreferencesStorageKey = "adminNotificationPreferences";
const profileStorageKey = "adminOperatorProfile";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return savedTheme === "light" ? "light" : "dark";
};

export function AdminHeaderActions({ notifications: externalNotifications = [] }) {
  const wrapperRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [settingsView, setSettingsView] = useState("main");
  const [themeMode, setThemeMode] = useState(getInitialTheme);
  const [notifications, setNotifications] = useState(notificationItems);
  const [notificationPreferences, setNotificationPreferences] = useState(() => {
    if (typeof window === "undefined") return {};
    const saved = window.localStorage.getItem(notificationPreferencesStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return { newBookings: true, bookingChanges: true, liveQueueUpdates: true, staffUpdates: true, systemAlerts: true, promotions: true, lowStock: true, soundAlerts: true };
  });

  const session = getOperatorSession();
  const [profile, setProfile] = useState(() => {
    if (typeof window === "undefined") return { username: null, avatar: null };
    try { const raw = window.localStorage.getItem(profileStorageKey); return raw ? JSON.parse(raw) : { username: null, avatar: null }; } catch { return { username: null, avatar: null }; }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem(profileStorageKey, JSON.stringify(profile)); } catch {};
    }
  }, [profile]);

  const handleAvatarFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const notificationSeed = externalNotifications.length > 0 ? externalNotifications : notificationItems;
  const notificationSeedKey = useMemo(() => notificationSeed.map((item) => `${item.id}-${item.title}-${item.time}-${item.unread ? 1 : 0}`).join("|"), [notificationSeed]);
  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  useEffect(() => { setNotifications(notificationSeed); }, [notificationSeedKey]);
  useEffect(() => { if (typeof document !== "undefined") { document.documentElement.dataset.theme = themeMode; window.localStorage.setItem(themeStorageKey, themeMode); } }, [themeMode]);
  useEffect(() => { if (typeof window !== "undefined") { window.localStorage.setItem(notificationPreferencesStorageKey, JSON.stringify(notificationPreferences)); } }, [notificationPreferences]);

  useEffect(() => {
    const handlePointerDown = (event) => { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpenMenu(null); };
    const handleEscape = (event) => { if (event.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handlePointerDown); document.removeEventListener("touchstart", handlePointerDown); document.removeEventListener("keydown", handleEscape); };
  }, []);

  const toggleMenu = (menu) => { setOpenMenu((prev) => (prev === menu ? null : menu)); setSettingsView("main"); };
  const closeMenu = () => { setOpenMenu(null); setSettingsView("main"); };
  const toggleTheme = () => setThemeMode((m) => (m === "dark" ? "light" : "dark"));
  const markAllNotificationsRead = () => setNotifications((n) => n.map((it) => ({ ...it, unread: false })));
  const togglePreference = (key) => setNotificationPreferences((p) => ({ ...p, [key]: !p[key] }));

  const renderSettings = () => {
    switch (settingsView) {
      case "main":
        return (
          <>
            <div className="admin-dropdown-topbar">
              <div>
                <p className="admin-dropdown-eyebrow">Preferences</p>
                <h3 className="admin-dropdown-title">Settings</h3>
              </div>
              <span className="admin-dropdown-chip">Admin tools</span>
            </div>

            <button type="button" className="admin-theme-toggle" onClick={toggleTheme}>
              <div className="admin-theme-copy">
                <span className="admin-theme-label">Appearance</span>
                <strong>{themeMode === "dark" ? "Dark mode" : "Light mode"}</strong>
                <p>Switch the admin area between the charcoal and ivory palettes.</p>
              </div>
              <span className={`admin-theme-switch ${themeMode === "light" ? "is-light" : "is-dark"}`} aria-hidden>
                <span className="admin-theme-switch-track" />
                <span className="admin-theme-switch-thumb">{themeMode === "dark" ? <MoonIcon size={11} color="#fff" /> : <SunIcon size={11} color="#1a0f00" />}</span>
              </span>
            </button>

            <div className="admin-settings-list">
              {settingsItems.map((item) => (
                <button key={item.id} type="button" className="admin-settings-item" onClick={() => setSettingsView(item.id)}>
                  <div>
                    <span className="admin-settings-item-title">{item.label}</span>
                    <p className="admin-settings-item-copy">{item.description}</p>
                  </div>
                  <CheckIcon size={14} color="#dd901d" />
                </button>
              ))}
            </div>

            <div className="admin-dropdown-footer">
              <span className="admin-dropdown-footnote">More ideas to add later: timezone, language, and compact sidebar mode.</span>
            </div>
          </>
        );

      case "notification-preferences":
        return (
          <>
            <div className="admin-dropdown-topbar">
              <div>
                <p className="admin-dropdown-eyebrow">Settings</p>
                <h3 className="admin-dropdown-title">Notification preferences</h3>
              </div>
              <button type="button" className="admin-dropdown-link" onClick={() => setSettingsView("main")}>Back</button>
            </div>

            <div className="admin-settings-list">
              {[
                ["newBookings", "New bookings", "Alert me when a customer books an appointment."],
                ["bookingChanges", "Booking changes", "Show reschedules, cancellations, and confirmations."],
                ["liveQueueUpdates", "Live queue updates", "Notify me when the queue moves or staff start a service."],
                ["staffUpdates", "Staff updates", "Track staff availability, break, and status changes."],
                ["systemAlerts", "System alerts", "Show sync issues, system errors, and maintenance notices."],
                ["promotions", "Promotions and sales", "Surface campaign and discount performance alerts."],
                ["lowStock", "Low-stock warnings", "Warn me when supplies drop below the threshold."],
                ["soundAlerts", "Sound alerts", "Play a soft cue for important updates."],
              ].map(([key, label, description]) => {
                const enabled = Boolean(notificationPreferences[key]);
                return (
                  <button key={key} type="button" className="admin-settings-item" onClick={() => togglePreference(key)}>
                    <div>
                      <span className="admin-settings-item-title">{label}</span>
                      <p className="admin-settings-item-copy">{description}</p>
                    </div>
                    <span className={`admin-settings-chip ${enabled ? "is-on" : "is-off"}`}>{enabled ? "On" : "Off"}</span>
                  </button>
                );
              })}
            </div>

            <div className="admin-dropdown-footer">
              <span className="admin-dropdown-footnote">Preferences are saved on this device and applied across the admin area.</span>
            </div>
          </>
        );

      case "profile-edit":
        return (
          <>
            <div className="admin-dropdown-topbar">
              <div>
                <p className="admin-dropdown-eyebrow">Account</p>
                <h3 className="admin-dropdown-title">Edit profile</h3>
              </div>
              <button type="button" className="admin-dropdown-link" onClick={() => setSettingsView("main")}>Back</button>
            </div>

            <div className="admin-profile-edit">
              <div className="admin-profile-edit-row">
                <label className="admin-settings-item-title">Username</label>
                <input className="admin-text-input" type="text" value={profile?.username || (session?.email || "").split("@")[0] || ""} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} placeholder="Display username" />
              </div>

              <div className="admin-profile-edit-row">
                <label className="admin-settings-item-title">Avatar</label>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="cdb-avatar" style={{ width: 56, height: 56 }}>
                    {profile?.avatar ? (<img src={profile.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : (<span style={{ fontWeight: 700, color: "var(--color-amber)" }}>{(profile?.username || session?.email || "A")[0]}</span>)}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) handleAvatarFile(f); }} />
                    <p className="admin-settings-item-copy">PNG/JPG, small images recommended. Saved locally.</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button type="button" className="cdb-btn-edit" onClick={() => { setSettingsView("main"); }}>Done</button>
              </div>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="admin-dropdown-topbar">
              <div>
                <p className="admin-dropdown-eyebrow">Account</p>
                <h3 className="admin-dropdown-title">Profile settings</h3>
              </div>
              <button type="button" className="admin-dropdown-link" onClick={() => setSettingsView("main")}>Back</button>
            </div>

            <div className="admin-profile-card">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="cdb-avatar" style={{ width: 56, height: 56 }}>
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontWeight: 700, color: "var(--color-amber)" }}>{(profile?.username || session?.email || "A")[0]}</span>
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <span className="admin-settings-item-title">{profile?.username || (session?.email || "").split("@")[0] || "Administrator"}</span>
                  <p className="admin-settings-item-copy">{session?.email || ""}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button type="button" className="cdb-btn-edit" onClick={() => setSettingsView("profile-edit")}>Edit profile</button>
              </div>
            </div>
          </>
        );
    }
  };

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
                <button type="button" className="admin-dropdown-link" onClick={markAllNotificationsRead}>Mark all as read</button>
              </div>

              <div className="admin-notification-list">
                {notifications.map((notification) => (
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
                ))}
              </div>

              <div className="admin-dropdown-footer">
                <span className="admin-dropdown-footnote">Showing recent activity across bookings, staff, and system alerts.</span>
                <button type="button" className="admin-dropdown-link" onClick={closeMenu}>View all notifications</button>
              </div>
            </>
          ) : (
            renderSettings()
          )}
        </div>
      )}
    </div>
  );
}

// Provide both named and default export so callers can import either form
export default AdminHeaderActions;
