import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "../modal/customer/confirmation_dialog";
import SuperAdminHeaderActions from "../superadmin/SuperAdminHeaderActions";
import {
  BellIcon,
  LogOutIcon,
  LogoIcon,
  SettingsIcon,
} from "./dashboardIcons";

const defaultNotifications = [];

const normalizePath = (path) => (path || "").replace(/\/+$/, "");

const getFallbackTitle = (navItems, activeNav, roleLabel) => {
  const item = navItems.find((entry) => entry.id === activeNav);
  return item?.label || roleLabel || "Dashboard";
};

export function DashboardShell({
  navItems = [],
  activeNav,
  roleLabel = "User",
  roleInitial = "U",
  title,
  subtitle,
  profile,
  notifications = defaultNotifications,
  storageKey = "dashboardSidebarExpanded",
  showSidebarHeader = true,
  showRoleBadge = true,
  sidebarExtraAction = null,
  headerExtraActions = null,
  onLogoutConfirm,
  logoutTitle = "Log Out?",
  logoutMessage = "Are you sure you want to log out?",
  logoutConfirmText = "Yes, Log Out",
  logoutCancelText = "Stay Logged In",
  profileActionLabel = "Profile",
  profileActionPath,
  useSuperAdminHeaderActions = false,
  superAdminNoNotificationsMessage,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem(storageKey);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [openMenu, setOpenMenu] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(sidebarExpanded));
    }
  }, [sidebarExpanded, storageKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setShowLogoutConfirm(false);
      }
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

  const activeItemId = useMemo(() => {
    const currentPath = normalizePath(location.pathname);
    const matchedItem = navItems.find((item) => {
      const itemPath = normalizePath(item.path);
      return itemPath && (currentPath === itemPath || currentPath.startsWith(`${itemPath}/`));
    });

    return matchedItem?.id || activeNav || navItems[0]?.id || null;
  }, [activeNav, location.pathname, navItems]);

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);
  const displayName = profile?.name || roleLabel;
  const displayEmail = profile?.emails?.[0] || profile?.email || "";
  const pageTitle = title || getFallbackTitle(navItems, activeItemId, roleLabel);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleNavClick = (item) => {
    if (!item?.path) return;
    navigate(item.path);
    setOpenMenu(null);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setOpenMenu(null);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    if (onLogoutConfirm) {
      await onLogoutConfirm();
    }
  };

  return (
    <div className="super-admin-container admin-dashboard-page" style={{ "--sidebar-width": sidebarExpanded ? "340px" : "80px" }}>
      <aside className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-16px)",
        transition: "all 0.5s ease"
      }}>
        {showSidebarHeader && (
          <div className="sidebar-logo-section">
            <button
              onClick={() => setSidebarExpanded((prev) => !prev)}
              className="logo-toggle-btn"
              title="Toggle sidebar"
              type="button"
            >
              <div className="logo-badge">
                <LogoIcon />
              </div>
              {sidebarExpanded && <span className="brand-name">BeautyBook Pro</span>}
            </button>
          </div>
        )}

        {showRoleBadge && sidebarExpanded && (
          <div className="admin-badge-pill">
            <div className="admin-badge-circle">{roleInitial}</div>
            <span className="admin-badge-text">{roleLabel}</span>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeItemId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`nav-button ${isActive ? "active" : ""}`}
                title={item.label}
                type="button"
              >
                <item.icon color={isActive ? "#000" : "currentColor"} />
                {sidebarExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
          {sidebarExtraAction}
        </nav>

        <div className="sidebar-logout-section">
          <button onClick={handleLogout} className="logout-button" title="Log out" type="button">
            <LogOutIcon />
            {sidebarExpanded && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      <div className="super-admin-main">
        <header className={`dashboard-header ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          <div className="dashboard-header-main">
            <button
              onClick={() => setSidebarExpanded((prev) => !prev)}
              className="logo-toggle-btn dashboard-header-logo-btn"
              title="Toggle sidebar"
              type="button"
            >
              <div className="logo-badge">
                <LogoIcon />
              </div>
            </button>
            <span className="dashboard-system-title">BeautyBook Pro</span>
            <div className="dashboard-page-title-wrap">
              <h1 className="dash-page-title">{pageTitle}</h1>
              <p className="dash-page-subtitle">{subtitle}</p>
            </div>
          </div>

          {useSuperAdminHeaderActions ? (
            <SuperAdminHeaderActions
              notifications={notifications}
              roleLabel={roleLabel}
              noNotificationsMessage={superAdminNoNotificationsMessage}
            />
          ) : headerExtraActions ? (
            headerExtraActions
          ) : (
            <div className="admin-header-actions" ref={wrapperRef}>
              {headerExtraActions}

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
                      </div>

                      <div className="admin-notification-list" style={{ minHeight: 220, maxHeight: 360, overflowY: "auto" }}>
                        {notifications.length === 0 ? (
                          <div className="admin-notification-empty" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 20, color: "var(--color-muted, #6b7280)" }}>
                            No recent notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button key={notification.id} type="button" className={`admin-notification-item${notification.unread ? " unread" : ""}`} onClick={() => setOpenMenu(null)}>
                              <span className={`admin-notification-tone tone-${notification.tone || "amber"}`} />
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
                          <p className="admin-dropdown-eyebrow">Account</p>
                          <h3 className="admin-dropdown-title">Profile</h3>
                        </div>
                        <span className="admin-dropdown-chip">{roleLabel}</span>
                      </div>

                      <div className="admin-profile-card">
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div className="cdb-avatar" style={{ width: 56, height: 56 }}>
                            <span style={{ fontWeight: 700, color: "var(--color-amber)" }}>{(displayName || roleLabel).trim().charAt(0).toUpperCase() || roleInitial}</span>
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <span className="admin-settings-item-title">{displayName}</span>
                            {displayEmail && <p className="admin-settings-item-copy">{displayEmail}</p>}
                            <p className="admin-settings-item-copy">{roleLabel}</p>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                          {profileActionPath ? (
                            <button type="button" className="cdb-btn-edit" onClick={() => navigate(profileActionPath)}>{profileActionLabel}</button>
                          ) : null}
                          <button type="button" className="cdb-btn cdb-btn-danger-outline" onClick={handleLogout}>Log out</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </header>

        <main className="dashboard-main">
          {children}
        </main>
      </div>

      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title={logoutTitle}
        message={logoutMessage}
        confirmText={logoutConfirmText}
        cancelText={logoutCancelText}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
