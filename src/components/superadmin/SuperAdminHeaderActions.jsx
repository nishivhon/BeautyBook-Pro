import { useEffect, useMemo, useRef, useState } from "react";
import { getOperatorSession } from "../../services/operatorAuth";
import {
  getSuperAdminNotificationReadCacheKey,
  getSuperAdminNotificationSessionKey,
  readSuperAdminNotificationReadCache,
  writeSuperAdminNotificationReadCache,
} from "../../services/superadminNotifications";
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

const CheckIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const settingsItems = [
  { id: "profile-view", label: "Profile settings", description: "View your account details and role." },
];

const profileStorageKey = "superAdminOperatorProfile";

const getDisplayUsername = (session) => {
  const emailPrefix = (session?.email || "").split("@")[0];
  return session?.username || emailPrefix || "SuperAdmin";
};

const mapSuperAdminCategory = (item) => {
  const category = String(item?.category || "").toLowerCase();
  if (category.includes("client")) return { category: "Client registrations", tone: "green" };
  if (category.includes("staff")) return { category: "Staff accounts", tone: "blue" };
  if (category.includes("security")) return { category: "Security alerts", tone: "amber" };
  if (category.includes("database")) return { category: "Database status", tone: "blue" };
  if (category.includes("live queue")) return { category: "Live queue", tone: "amber" };

  const text = `${item?.category || ""} ${item?.title || ""} ${item?.description || ""}`.toLowerCase();

  const clientRe = /\b(new client|new customer|client registration|customer registration|registered|signup|sign up|customer account created|client account created)\b/;
  const staffRe = /\b(staff account|staff created|staff deleted|staff removed|staff added|role updated|employee account)\b/;
  const securityRe = /\b(failed login|security|blocked ip|unauthorized|suspicious|threat|password changed|alert)\b/;
  const databaseRe = /\b(database|backup|restore|replication|migration|db status|storage status|snapshot)\b/;

  if (clientRe.test(text)) return { category: "Client registrations", tone: "green" };
  if (staffRe.test(text)) return { category: "Staff accounts", tone: "blue" };
  if (securityRe.test(text)) return { category: "Security alerts", tone: "amber" };
  if (databaseRe.test(text)) return { category: "Database status", tone: "blue" };

  return null;
};

export function SuperAdminHeaderActions({
  notifications: externalNotifications = [],
  roleLabel = "Super Administrator",
  noNotificationsMessage = "No recent super admin activity across client, staff, security, or database events.",
}) {
  const wrapperRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [settingsView, setSettingsView] = useState("main");
  const { themeMode, toggleTheme } = useThemeScope("staff");

  const session = getOperatorSession();
  const notificationSessionKey = useMemo(() => getSuperAdminNotificationSessionKey(session), [session?.email, session?.role]);
  const [readNotificationIds, setReadNotificationIds] = useState(() => new Set(readSuperAdminNotificationReadCache(notificationSessionKey).map((id) => String(id))));

  const notificationSeed = useMemo(() => externalNotifications, [externalNotifications]);
  const notificationSeedKey = useMemo(
    () => notificationSeed.map((item) => `${item.id}-${item.title}-${item.time}-${item.unread ? 1 : 0}`).join("|"),
    [notificationSeed]
  );

  const notifications = useMemo(() => {
    const readIds = readNotificationIds;

    return (notificationSeed || [])
      .map((item) => {
        const mappedCategory = mapSuperAdminCategory(item);
        const itemId = String(item?.id ?? "");

        return {
          ...item,
          category: mappedCategory?.category || item?.category || "Notification",
          tone: item.tone || mappedCategory?.tone || "amber",
          unread: !readIds.has(itemId),
        };
      })
      .filter((item) => item.id !== undefined && item.id !== null && item.id !== "");
  }, [notificationSeedKey, notificationSeed, readNotificationIds]);

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);
  const profileUsername = getDisplayUsername(session);
  const profileRole = session?.role || roleLabel;

  useEffect(() => {
    setReadNotificationIds(new Set(readSuperAdminNotificationReadCache(notificationSessionKey).map((id) => String(id))));
  }, [notificationSessionKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event) => {
      if (event.key !== getSuperAdminNotificationReadCacheKey(notificationSessionKey)) return;
      setReadNotificationIds(new Set(readSuperAdminNotificationReadCache(notificationSessionKey).map((id) => String(id))));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [notificationSessionKey]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
    setSettingsView("main");
  };

  const closeMenu = () => {
    setOpenMenu(null);
    setSettingsView("main");
  };

  const markAllNotificationsRead = () => {
    const nextReadIds = notifications.map((item) => String(item.id));
    setReadNotificationIds(new Set(nextReadIds));
    writeSuperAdminNotificationReadCache(notificationSessionKey, nextReadIds);
  };

  const markNotificationRead = (notificationId) => {
    if (!notificationId) return;

    const nextReadIds = new Set(readNotificationIds);
    nextReadIds.add(String(notificationId));
    setReadNotificationIds(nextReadIds);
    writeSuperAdminNotificationReadCache(notificationSessionKey, Array.from(nextReadIds));
  };

  const formatRoleLabel = (role) => {
    if (!role) return roleLabel;
    return role
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

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
              <span className="admin-dropdown-chip">Super Admin tools</span>
            </div>

            <button type="button" className="admin-theme-toggle" onClick={toggleTheme}>
              <div className="admin-theme-copy">
                <span className="admin-theme-label">Appearance</span>
                <strong>{themeMode === "dark" ? "Dark mode" : "Light mode"}</strong>
                <p>Switch the super admin area between the charcoal and ivory palettes.</p>
              </div>
              <span className={`admin-theme-switch ${themeMode === "light" ? "is-light" : "is-dark"}`} aria-hidden>
                <span className="admin-theme-switch-track" />
                <span className="admin-theme-switch-thumb">
                  {themeMode === "dark" ? <MoonIcon size={11} color="#fff" /> : <SunIcon size={11} color="#1a0f00" />}
                </span>
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
              <span className="admin-dropdown-footnote">Security-first controls for clients, staff, logs, and platform settings.</span>
            </div>
          </>
        );

      case "profile-view":
        return (
          <>
            <div className="admin-dropdown-topbar">
              <div>
                <p className="admin-dropdown-eyebrow">Account</p>
                <h3 className="admin-dropdown-title">Profile details</h3>
              </div>
              <button type="button" className="admin-dropdown-link" onClick={() => setSettingsView("main")}>Back</button>
            </div>

            <div className="admin-profile-card">
              <div className="admin-profile-top-row">
                <div className="admin-profile-avatar-panel">
                  <div className="cdb-avatar admin-profile-avatar-badge" aria-hidden="true">
                    <span className="admin-profile-avatar-badge-text">BB</span>
                  </div>
                </div>

                <div className="admin-profile-role-panel">
                  <span className="admin-profile-field-label">Role</span>
                  <span className="admin-profile-field-value">{formatRoleLabel(profileRole)}</span>
                </div>
              </div>

              <div className="admin-profile-bottom-row">
                <div className="admin-profile-field">
                  <span className="admin-profile-field-label">Username</span>
                  <span className="admin-profile-field-value">{profileUsername}</span>
                </div>
                <div className="admin-profile-field">
                  <span className="admin-profile-field-label">Email</span>
                  <span className="admin-profile-field-value">{session?.email || "Not available"}</span>
                </div>
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
              <div className="admin-profile-top-row">
                <div className="admin-profile-avatar-panel">
                  <div className="cdb-avatar admin-profile-avatar-badge" aria-hidden="true">
                    <span className="admin-profile-avatar-badge-text">BB</span>
                  </div>
                </div>

                <div className="admin-profile-role-panel">
                  <span className="admin-profile-field-label">Role</span>
                  <span className="admin-profile-field-value">{formatRoleLabel(profileRole)}</span>
                </div>
              </div>

              <div className="admin-profile-bottom-row">
                <div className="admin-profile-field">
                  <span className="admin-profile-field-label">Username</span>
                  <span className="admin-profile-field-value">{profileUsername}</span>
                </div>
                <div className="admin-profile-field">
                  <span className="admin-profile-field-label">Email</span>
                  <span className="admin-profile-field-value">{session?.email || "Not available"}</span>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
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
                    <p className="admin-dropdown-eyebrow">Monitoring</p>
                    <h3 className="admin-dropdown-title">Super Admin Notifications</h3>
                  </div>
                  <button type="button" className="admin-dropdown-link admin-mark-read-link" onClick={markAllNotificationsRead}>Mark all as read</button>
                </div>

                <div className="admin-notification-list" style={{ minHeight: 220, maxHeight: 360, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div className="admin-notification-empty" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 20, color: "var(--color-muted, #6b7280)" }}>
                      {noNotificationsMessage}
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

                <div className="admin-dropdown-footer">
                  <span className="admin-dropdown-footnote">Showing security alerts and database status updates.</span>
                </div>
              </>
            ) : (
              renderSettings()
            )}
          </div>
        )}
      </div>

    </>
  );
}

export default SuperAdminHeaderActions;
