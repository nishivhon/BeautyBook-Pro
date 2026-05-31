import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { useToast } from "../../components/toast";
import {
  SUPER_ADMIN_NAV_ITEMS,
  SuperAdminIconSlot,
  SuperAdminLogOutIcon,
  SuperAdminSecurityPanelIcon,
  SuperAdminAdminSecurityPanelIcon,
  SuperAdminSystemSettingsPanelIcon,
  SuperAdminMaintenanceRowIcon,
} from "../../components/superadmin/superAdminDashboardIcons";

const SECURITY_PANEL_HEADER_ICONS = {
  "super-admin": SuperAdminSecurityPanelIcon,
  admin: SuperAdminAdminSecurityPanelIcon,
};

const initialSecurityItems = [
  { label: "System Maintenance", status: "Disabled", enabled: false, Icon: SuperAdminMaintenanceRowIcon },
];

const SECURITY_PANELS = [
  { panelKey: 'super-admin', role: 'super admin', title: 'Super Admin Security Settings' },
  { panelKey: 'admin', role: 'admin', title: 'Admin Security Settngs' },
];

const formatDateTime = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString();
};

const isSameLocalDay = (value, referenceDate = new Date()) => {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
};

const buildDeviceLabel = (loginData) => {
  if (!loginData) return "No login data recorded";

  const parts = [];
  if (loginData.ip_address) parts.push(loginData.ip_address);
  if (loginData.platform) parts.push(loginData.platform.replaceAll('"', ''));
  if (loginData.user_agent) parts.push(loginData.user_agent);

  return parts.length ? parts.join(' • ') : 'No device details available';
};

const buildFailedLoginLabel = (failedLogins) => {
  if (!Array.isArray(failedLogins) || failedLogins.length === 0) {
    return 'No failed login attempts recorded';
  }

  const latestAttempt = failedLogins[failedLogins.length - 1];
  const device = latestAttempt?.device;
  const deviceLabel = buildDeviceLabel(device);
  const attemptedAt = formatDateTime(latestAttempt?.attempted_at);

  return `${deviceLabel} • ${attemptedAt}`;
};

const getRecentFailedLoginEntries = (failedLogins, limit = 3) => {
  if (!Array.isArray(failedLogins) || failedLogins.length === 0) {
    return [];
  }

  return [...failedLogins].slice(-limit).reverse();
};

const formatDeviceSummary = (loginData) => {
  if (!loginData) return 'No device details available';

  const parts = [];
  if (loginData.ip_address) parts.push(`IP ${loginData.ip_address}`);
  if (loginData.platform) parts.push(loginData.platform.replaceAll('"', ''));
  if (loginData.user_agent) parts.push(loginData.user_agent);

  return parts.length ? parts.join(' • ') : 'No device details available';
};

export default function SuperAdminSecurityDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeNav, setActiveNav] = useState("security");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [secItems, setSecItems] = useState(initialSecurityItems);

  // Maintenance states
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const [activeUsers, setActiveUsers] = useState(12); // Mock data
  const [maintenanceStartTime, setMaintenanceStartTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [maintenanceWhitelist, setMaintenanceWhitelist] = useState([]);
  const [whitelistInput, setWhitelistInput] = useState("");
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [showCountdownBanner, setShowCountdownBanner] = useState(false);
  const [securitySummaries, setSecuritySummaries] = useState({
    'super admin': {
      lastLogin: null,
      failedLogins: [],
      failedLoginCount: 0,
      lastPasswordChangeAt: null,
      email: '',
    },
    admin: {
      lastLogin: null,
      failedLogins: [],
      failedLoginCount: 0,
      lastPasswordChangeAt: null,
      email: '',
    },
  });
  const [securitySummaryLoading, setSecuritySummaryLoading] = useState(false);
  const [expandedSecurityRow, setExpandedSecurityRow] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchSecuritySummary = async () => {
      setSecuritySummaryLoading(true);
      try {
        const apiBase = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:3000/api'
          : '/api';

        const summaries = await Promise.all(
          SECURITY_PANELS.map(async ({ role }) => {
            const response = await fetch(`${apiBase}/operators/security-summary?role=${encodeURIComponent(role)}`);
            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
              throw new Error(result.error || `Failed to load security summary for ${role}`);
            }

            return [role, {
              lastLogin: result.data?.last_login || null,
              failedLogins: Array.isArray(result.data?.failed_logins) ? result.data.failed_logins : [],
              failedLoginCount: result.data?.failed_login_count || 0,
              lastPasswordChangeAt: result.data?.last_password_change_at || null,
              email: result.data?.email || '',
            }];
          })
        );

        setSecuritySummaries(Object.fromEntries(summaries));
      } catch (error) {
        console.error('[SecuritySummary] Error:', error.message);
      } finally {
        setSecuritySummaryLoading(false);
      }
    };

    fetchSecuritySummary();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!maintenanceStartTime) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(maintenanceStartTime).getTime();
      const diff = startTime - now;
      
      if (diff <= 0) {
        setCountdown(null);
        setShowCountdownBanner(false);
        clearInterval(interval);
      } else if (diff <= 5 * 60 * 1000) { // 5 minutes
        setShowCountdownBanner(true);
        setCountdown(Math.floor(diff / 1000));
      } else if (diff <= 24 * 60 * 60 * 1000) { // 24 hours
        setShowWarningBanner(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [maintenanceStartTime]);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
    setPasswordChangeError('');
    setPasswordChangeMessage('');
  };

  const handleChangePasswordSubmit = async (e, targetRole) => {
    e.preventDefault();

    const summary = securitySummaries[targetRole];
    const email = summary?.email;

    if (!email) {
      setPasswordChangeError(`No credential row found for ${targetRole}.`);
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordChangeError('All password fields are required.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordChangeError('New password and confirm password do not match.');
      return;
    }

    setPasswordChangeLoading(true);
    setPasswordChangeError('');
    setPasswordChangeMessage('');

    try {
      const apiBase = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api';

      const response = await fetch(`${apiBase}/operators/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password');
      }

      setSecuritySummaries(prev => ({
        ...prev,
        [targetRole]: {
          ...(prev[targetRole] || {}),
          lastPasswordChangeAt: result.data?.last_password_change_at || new Date().toISOString(),
        },
      }));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordChangeMessage('Password updated successfully.');
      showToast({ message: 'Password updated successfully.', type: 'success', duration: 2800 });
    } catch (error) {
      setPasswordChangeError(error.message || 'Failed to change password.');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const toggleSecurityRow = (panelKey, rowKey) => {
    const nextRowKey = `${panelKey}:${rowKey}`;
    setExpandedSecurityRow(prev => (prev === nextRowKey ? null : nextRowKey));
  };

  const toggleSecurityItem = (idx) => {
    setSecItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const next = !item.enabled;
      
      // Handle maintenance toggle
      if (item.label === "System Maintenance") {
        if (next) {
          setShowMaintenanceConfirm(true);
        } else {
          setMaintenanceEnabled(false);
          setMaintenanceStartTime(null);
          showToast({ message: 'System maintenance disabled', type: 'success', duration: 2800 });
        }
        return item; // Don't update status yet
      }
      
      return { ...item, enabled: next, status: next ? "Enabled" : "Disabled" };
    }));
  };

  const handleMaintenanceConfirm = () => {
    setMaintenanceEnabled(true);
    setMaintenanceStartTime(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes from now
    setShowMaintenanceConfirm(false);
    setSecItems(prev => prev.map(item => 
      item.label === "System Maintenance" 
        ? { ...item, enabled: true, status: "Enabled" }
        : item
    ));
    showToast({ message: 'System maintenance enabled', type: 'success', duration: 2800 });
  };

  const handleAddToWhitelist = () => {
    if (whitelistInput && /^(\d{1,3}\.){3}\d{1,3}$/.test(whitelistInput)) {
      setMaintenanceWhitelist([...maintenanceWhitelist, whitelistInput]);
      setWhitelistInput("");
      showToast({ message: `IP ${whitelistInput} added to whitelist`, type: 'success', duration: 2800 });
    } else {
      showToast({ message: 'Invalid IP address format', type: 'warning', duration: 2800 });
    }
  };

  const handleRemoveFromWhitelist = (ip) => {
    setMaintenanceWhitelist(maintenanceWhitelist.filter(item => item !== ip));
    showToast({ message: `IP ${ip} removed from whitelist`, type: 'success', duration: 2800 });
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSecurityRow = (panelKey, rowKey, title, summary, updatedLabel, details) => {
    const currentRowKey = `${panelKey}:${rowKey}`;
    const isExpanded = expandedSecurityRow === currentRowKey;

    return (
      <div>
        <button
          type="button"
          onClick={() => toggleSecurityRow(panelKey, rowKey)}
          className="db-row"
          style={{
            width: '100%',
            padding: '16px',
            height: 'auto',
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div className="db-name-wrap" style={{ flex: 1 }}>
            <span className="db-name">{title}</span>
            <span className="db-meta">{summary}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div className="db-updated">{updatedLabel}</div>
            <div style={{ color: '#988f81', fontSize: '14px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
              ▾
            </div>
          </div>
        </button>

        {isExpanded && (
          <div style={{ marginTop: '8px', padding: '14px 16px', borderRadius: '10px', background: 'rgba(152, 143, 129, 0.08)', border: '1px solid rgba(152, 143, 129, 0.15)', color: '#D4C5B9', fontSize: '13px', lineHeight: '1.7' }}>
            {details}
          </div>
        )}
      </div>
    );
  };

  const renderChangePasswordDetails = (targetRole) => (
    <form onSubmit={(event) => handleChangePasswordSubmit(event, targetRole)} style={{ display: 'grid', gap: '12px' }}>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label style={{ color: '#D4C5B9', fontSize: '12px', fontWeight: 600 }}>Current Password</label>
        <input
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
          placeholder="Enter current password"
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(152, 143, 129, 0.2)', background: 'rgba(35, 29, 26, 0.75)', color: '#fff', outline: 'none' }}
        />
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label style={{ color: '#D4C5B9', fontSize: '12px', fontWeight: 600 }}>New Password</label>
        <input
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
          placeholder="Enter new password"
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(152, 143, 129, 0.2)', background: 'rgba(35, 29, 26, 0.75)', color: '#fff', outline: 'none' }}
        />
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label style={{ color: '#D4C5B9', fontSize: '12px', fontWeight: 600 }}>Confirm New Password</label>
        <input
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
          placeholder="Confirm new password"
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(152, 143, 129, 0.2)', background: 'rgba(35, 29, 26, 0.75)', color: '#fff', outline: 'none' }}
        />
      </div>

      {passwordChangeError && (
        <div style={{ color: '#ef4444', fontSize: '12px' }}>{passwordChangeError}</div>
      )}

      {passwordChangeMessage && (
        <div style={{ color: '#22c55e', fontSize: '12px' }}>{passwordChangeMessage}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={passwordChangeLoading}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #DD901D',
            background: passwordChangeLoading ? 'rgba(221, 144, 29, 0.5)' : 'rgba(221, 144, 29, 0.15)',
            color: '#DD901D',
            fontWeight: 700,
            cursor: passwordChangeLoading ? 'default' : 'pointer',
          }}
        >
          {passwordChangeLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );

  return (
    <DashboardShell
      navItems={SUPER_ADMIN_NAV_ITEMS}
      LogOutIcon={SuperAdminLogOutIcon}
      activeNav={activeNav}
      roleLabel="Super Administrator"
      roleInitial="S"
      showSidebarHeader={false}
      title="Admin Security"
      subtitle="BeautyBook Pro · Manage access controls"
      profile={null}
      notifications={[]}
      useSuperAdminHeaderActions={true}
      superAdminNoNotificationsMessage="No failed login attempts were recorded today."
      superAdminUseDefaultNotificationsWhenEmpty={false}
      storageKey="superadminSidebarExpanded"
      onLogoutConfirm={handleLogout}
      logoutTitle="Log Out?"
      logoutMessage="Are you sure you want to log out?"
      logoutConfirmText="Yes, Log Out"
      logoutCancelText="Stay Logged In"
    >
      {/* ─── WARNING BANNERS ─── */}
      {showWarningBanner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(221, 144, 29, 0.15)', border: '1px solid rgba(221, 144, 29, 0.3)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001, fontFamily: "'Inter', sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10 2L18.5 17H1.5L10 2z" stroke="#DD901D" strokeWidth="1.3" strokeLinejoin="round"/>
            <line x1="10" y1="9" x2="10" y2="13" stroke="#DD901D" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="10" cy="15.5" r="0.8" fill="#DD901D"/>
          </svg>
          <span style={{ color: '#DD901D', fontSize: '13px', fontWeight: 600 }}>Scheduled system maintenance in 24 hours. Users will be notified and logged out.</span>
        </div>
      )}

      {showCountdownBanner && (
        <div style={{ position: 'fixed', top: showWarningBanner ? 48 : 0, left: 0, right: 0, background: 'rgba(239, 67, 67, 0.15)', border: '1px solid rgba(239, 67, 67, 0.3)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001, fontFamily: "'Inter', sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, animation: 'pulse 1s infinite' }}>
            <circle cx="10" cy="10" r="7.5" stroke="#EF4343" strokeWidth="1.3"/>
            <path d="M10 6v4l2.5 2.5" stroke="#EF4343" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: '#EF4343', fontSize: '13px', fontWeight: 600 }}>CRITICAL: System maintenance starts in {formatCountdown(countdown || 0)}</span>
        </div>
      )}

      {/* ─── SIDEBAR & HEADER HANDLED BY DASHBOARDSHELL ─── */}

      <div className="superadmin-page-content" style={{ paddingTop: '20px' }}>
        {SECURITY_PANELS.map(({ panelKey, role, title }) => {
          const summary = securitySummaries[role] || {
            lastLogin: null,
            failedLogins: [],
            failedLoginCount: 0,
            lastPasswordChangeAt: null,
          };
          const PanelHeaderIcon = SECURITY_PANEL_HEADER_ICONS[panelKey] || SuperAdminSecurityPanelIcon;

          return (
            <div key={panelKey} className="dashboard-panel" style={{ marginBottom: '16px' }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "16px", marginBottom: panelKey === 'super-admin' ? '16px' : '10px' }}>
                <SuperAdminIconSlot size="action-lg">
                  <PanelHeaderIcon />
                </SuperAdminIconSlot>
                {title}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                {renderSecurityRow(
                  panelKey,
                  'changePassword',
                  'Change Password',
                  securitySummaryLoading ? 'Loading password change data…' : 'Tap to view password age and reminder details',
                  securitySummaryLoading ? 'Loading…' : formatDateTime(summary.lastPasswordChangeAt),
                  <div>
                    <div style={{ marginBottom: '10px' }}><strong>Last changed:</strong> {formatDateTime(summary.lastPasswordChangeAt)}</div>
                    {renderChangePasswordDetails(role)}
                  </div>
                )}
                {renderSecurityRow(
                  panelKey,
                  'lastLogin',
                  'Last Login',
                  buildDeviceLabel(summary.lastLogin),
                  securitySummaryLoading ? 'Loading…' : formatDateTime(summary.lastLogin?.logged_in_at),
                  <div>
                    <div><strong>Logged in at:</strong> {formatDateTime(summary.lastLogin?.logged_in_at)}</div>
                    <div><strong>Device:</strong> {formatDeviceSummary(summary.lastLogin)}</div>
                  </div>
                )}
                {renderSecurityRow(
                  panelKey,
                  'failedLogins',
                  'Failed Login Attempts',
                  buildFailedLoginLabel(summary.failedLogins),
                  securitySummaryLoading ? 'Loading…' : `${summary.failedLoginCount} attempts`,
                  <div>
                    <div style={{ marginBottom: '8px' }}><strong>Total attempts:</strong> {summary.failedLoginCount}</div>
                    {getRecentFailedLoginEntries(summary.failedLogins).length > 0 ? (
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {getRecentFailedLoginEntries(summary.failedLogins).map((attempt, index) => (
                          <div key={`${attempt.attempted_at || index}`} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(35, 29, 26, 0.55)', border: '1px solid rgba(152, 143, 129, 0.12)' }}>
                            <div><strong>Time:</strong> {formatDateTime(attempt.attempted_at)}</div>
                            <div><strong>Device:</strong> {formatDeviceSummary(attempt.device)}</div>
                            <div><strong>Reason:</strong> {attempt.reason || 'failed_auth'}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>No failed attempts to display.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

          <div className="dashboard-panel">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "16px", marginBottom: "16px" }}>
              <SuperAdminIconSlot size="inline">
                <SuperAdminSystemSettingsPanelIcon />
              </SuperAdminIconSlot>
              System Settings
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {secItems.map((item, idx) => (
                <div key={idx} className="db-row" style={{ padding: "16px", height: "auto" }}>
                  <div className="db-icon admin-icon-btn-bare" style={{ background: item.enabled ? "rgba(34, 197, 94, 0.1)" : "rgba(152, 143, 129, 0.1)", borderRadius: "8px", width: "36px", height: "36px", marginRight: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SuperAdminIconSlot size="action">
                      <item.Icon />
                    </SuperAdminIconSlot>
                  </div>
                  <div className="db-name-wrap">
                    <span className="db-name">{item.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <div style={{
                      height: "23px",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "48px",
                      background: item.enabled ? "rgba(34, 197, 94, 0.15)" : "rgba(152, 143, 129, 0.15)",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: item.enabled ? "#22c55e" : "#988f81",
                      whiteSpace: "nowrap",
                    }}>
                      {item.status}
                    </div>
                    <Toggle enabled={item.enabled} onToggle={() => {
                      toggleSecurityItem(idx);
                      showToast({
                        message: `${item.label} ${item.enabled ? 'disabled' : 'enabled'}`,
                        type: 'success',
                        duration: 2800,
                      });
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* ─── MAINTENANCE CONFIRMATION DIALOG ─── */}
      {showMaintenanceConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--bg-darker)', border: '1px solid rgba(239, 67, 67, 0.3)', borderRadius: '12px', padding: '24px', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 700, fontSize: '18px', color: '#EF4343', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L18.5 17H1.5L10 2z" stroke="#EF4343" strokeWidth="1.3" strokeLinejoin="round"/>
                <line x1="10" y1="9" x2="10" y2="13" stroke="#EF4343" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="10" cy="15.5" r="0.8" fill="#EF4343"/>
              </svg>
              Start System Maintenance?
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '13px', color: '#D4C5B9', marginBottom: '16px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>There are <span style={{ color: '#EF4343', fontWeight: 600 }}>{activeUsers} active users</span>.</div>
              <div>Starting maintenance will:</div>
              <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                <li>Log out all non-admin users</li>
                <li>Display maintenance page to visitors</li>
                <li>May cause data loss if services are interrupted</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowMaintenanceConfirm(false)} 
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(152, 143, 129, 0.3)', background: 'transparent', color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)'; e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)'; }}
              >
                Cancel
              </button>
              <button 
                onClick={handleMaintenanceConfirm} 
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #EF4343', background: 'rgba(239, 67, 67, 0.15)', color: '#EF4343', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 67, 67, 0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 67, 67, 0.15)'; }}
              >
                Start Maintenance
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ─── Toggle Component ──────────────────────────────────────────────────

function Toggle({ enabled, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      position: "relative",
      width: "40px",
      height: "22px",
      borderRadius: "11px",
      background: enabled ? "rgba(34, 197, 94, 0.4)" : "rgba(152, 143, 129, 0.25)",
      border: `1px solid ${enabled ? "#22c55e" : "rgba(152, 143, 129, 0.40)"}`,
      cursor: "pointer",
      transition: "background 0.2s, border-color 0.2s",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute",
        top: "2px",
        left: enabled ? "20px" : "2px",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: enabled ? "#22c55e" : "#988f81",
        transition: "left 0.2s, background 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }}/>
    </div>
  );
}