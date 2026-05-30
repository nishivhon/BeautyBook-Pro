import logoIcon from "../../../svg icons/Logo icon.svg";
import dashboardHomeIcon from "../../../svg icons/Dashboard Home Icon.svg";
import userIcon from "../../../svg icons/User Icon.svg";
import userMetricIcon from "../../../svg icons/User Icon Metric.svg";
import databaseIcon from "../../../svg icons/Database Icon.svg";
import discountIcon from "../../../svg icons/Discount Icon.svg";
import serviceIcon from "../../../svg icons/Service Icon.svg";
import securityIcon from "../../../svg icons/Security Icon.svg";
import logOutIcon from "../../../svg icons/Log out Icon.svg";
import queueIcon from "../../../svg icons/Queue Icon.svg";
import gearIcon from "../../../svg icons/Gear Icon.svg";
import calendarIcon from "../../../svg icons/Calender Icon.svg";
import moneyIcon from "../../../svg icons/Money Icon.svg";
import userPlusIcon from "../../../svg icons/User with + icon.svg";
import downloadIcon from "../../../svg icons/Dowload Icon.svg";
import userWithCheckIcon from "../../../svg icons/User with Check icon.svg";
import padlockIcon from "../../../svg icons/Padlock Icon.svg";

const SuperAdminDashIconImg = ({ src, className = "", alt = "" }) => (
  <img src={src} alt={alt} className={`admin-dash-icon ${className}`.trim()} draggable={false} />
);

/** Landpage-aligned slot sizes (shared `.admin-dash-icon-slot` in tailwind.css). */
export const SuperAdminIconSlot = ({ children, size = "metric", className = "" }) => (
  <span
    className={`admin-dash-icon-slot admin-dash-icon-slot--${size} ${className}`.trim()}
    aria-hidden="true"
  >
    {children}
  </span>
);

const makeNavIcon = (src) =>
  function NavIcon({ color: _color, className = "" }) {
    return <SuperAdminDashIconImg src={src} className={`admin-dash-icon--nav ${className}`.trim()} />;
  };

export const SuperAdminLogoIcon = () => (
  <SuperAdminDashIconImg src={logoIcon} className="admin-dash-icon--nav-logo-art" alt="" />
);

export const SuperAdminDashboardNavIcon = makeNavIcon(dashboardHomeIcon);
export const SuperAdminStaffNavIcon = makeNavIcon(userIcon);
export const SuperAdminClientsNavIcon = makeNavIcon(userMetricIcon);
export const SuperAdminCouponsNavIcon = makeNavIcon(discountIcon);
export const SuperAdminLogsNavIcon = makeNavIcon(databaseIcon);
export const SuperAdminServicesNavIcon = makeNavIcon(serviceIcon);
export const SuperAdminSecurityNavIcon = makeNavIcon(securityIcon);

export const SuperAdminLogOutIcon = ({ color: _color, className = "" }) => (
  <SuperAdminDashIconImg src={logOutIcon} className={`admin-dash-icon--nav ${className}`.trim()} />
);

export const SuperAdminNotificationIcon = ({ size: _size, color: _color, className = "" }) => (
  <SuperAdminDashIconImg src={queueIcon} className={`admin-dash-icon--header ${className}`.trim()} />
);

export const SuperAdminSettingsIcon = ({ size: _size, color: _color, className = "" }) => (
  <SuperAdminDashIconImg src={gearIcon} className={`admin-dash-icon--header ${className}`.trim()} />
);

export const SuperAdminMetricCalendarIcon = () => (
  <SuperAdminDashIconImg src={calendarIcon} className="admin-dash-icon--metric-art" alt="" />
);

export const SuperAdminMetricWalkInIcon = () => (
  <SuperAdminDashIconImg src={userPlusIcon} className="admin-dash-icon--walkin-metric-art" alt="" />
);

export const SuperAdminMetricMoneyIcon = () => (
  <SuperAdminDashIconImg src={moneyIcon} className="admin-dash-icon--metric-art" alt="" />
);

export const SuperAdminDownloadIcon = () => (
  <SuperAdminDashIconImg src={downloadIcon} alt="" />
);

export const SuperAdminServicesPanelIcon = () => (
  <SuperAdminDashIconImg src={serviceIcon} className="admin-dash-icon--metric-art" alt="" />
);

export const SuperAdminSecurityPanelIcon = () => (
  <SuperAdminDashIconImg src={securityIcon} alt="" />
);

export const SuperAdminAdminSecurityPanelIcon = () => (
  <SuperAdminDashIconImg src={userWithCheckIcon} alt="" />
);

export const SuperAdminSystemSettingsPanelIcon = () => (
  <SuperAdminDashIconImg src={padlockIcon} alt="" />
);

export const SuperAdminMaintenanceRowIcon = () => (
  <SuperAdminDashIconImg src={gearIcon} className="admin-dash-icon--action-art" alt="" />
);

export const SUPER_ADMIN_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: SuperAdminDashboardNavIcon, path: "/superadmin/dashboard" },
  { id: "staff-management", label: "Staff Management", icon: SuperAdminStaffNavIcon, path: "/superadmin/users" },
  { id: "clients", label: "Client Accounts", icon: SuperAdminClientsNavIcon, path: "/superadmin/clients" },
  { id: "coupons", label: "Coupons", icon: SuperAdminCouponsNavIcon, path: "/superadmin/coupons" },
  { id: "logs", label: "Logs", icon: SuperAdminLogsNavIcon, path: "/superadmin/logs" },
  { id: "services", label: "Services", icon: SuperAdminServicesNavIcon, path: "/superadmin/services" },
  { id: "security", label: "Security", icon: SuperAdminSecurityNavIcon, path: "/superadmin/security" },
];
