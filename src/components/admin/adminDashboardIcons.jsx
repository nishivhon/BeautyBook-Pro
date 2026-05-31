import dashboardHomeIcon from "../../../svg icons/Dashboard Home Icon.svg";
import serviceIcon from "../../../svg icons/Service Icon.svg";
import queueIcon from "../../../svg icons/Queue Icon.svg";
import userWithCheckIcon from "../../../svg icons/User with Check icon.svg";
import logOutIcon from "../../../svg icons/Log out Icon.svg";
import gearIcon from "../../../svg icons/Gear Icon.svg";
import calendarIcon from "../../../svg icons/Calender Icon.svg";
import moneyIcon from "../../../svg icons/Money Icon.svg";
import clockIcon from "../../../svg icons/Clock Icon.svg";
import checkCompleteIcon from "../../../svg icons/Check Complete Icon.svg";
import warningIcon from "../../../svg icons/Warning Icon.svg";
import cancelledIcon from "../../../svg icons/Cancelled Icon.svg";
import analyticsIcon from "../../../svg icons/Analytics Icon.svg";
import downloadIcon from "../../../svg icons/Dowload Icon.svg";
import editIcon from "../../../svg icons/Edit Icon.svg";
import promoIcon from "../../../svg icons/Promo Icon.svg";
import breakTimeIcon from "../../../svg icons/Break Time Icon.svg";
import userPlusIcon from "../../../svg icons/User with + icon.svg";

const AdminDashIconImg = ({ src, className = "", alt = "" }) => (
  <img src={src} alt={alt} className={`admin-dash-icon ${className}`.trim()} draggable={false} />
);

/** Landpage-aligned slot sizes (see `.admin-dash-icon-slot` in tailwind.css). */
export const AdminIconSlot = ({ children, size = "metric", className = "" }) => (
  <span
    className={`admin-dash-icon-slot admin-dash-icon-slot--${size} ${className}`.trim()}
    aria-hidden="true"
  >
    {children}
  </span>
);

const makeNavIcon = (src) =>
  function NavIcon({ color: _color, className = "" }) {
    return <AdminDashIconImg src={src} className={`admin-dash-icon--nav ${className}`.trim()} />;
  };

export const AdminDashboardNavIcon = makeNavIcon(dashboardHomeIcon);
export const AdminServicesNavIcon = makeNavIcon(serviceIcon);
export const AdminLiveStatusNavIcon = makeNavIcon(queueIcon);
export const AdminStaffStatusNavIcon = makeNavIcon(userWithCheckIcon);

export const AdminLogOutIcon = ({ color: _color, className = "" }) => (
  <AdminDashIconImg src={logOutIcon} className={`admin-dash-icon--nav ${className}`.trim()} />
);

export const AdminNotificationIcon = ({ size: _size, color: _color, className = "" }) => (
  <AdminDashIconImg src={queueIcon} className={`admin-dash-icon--header ${className}`.trim()} />
);

export const AdminSettingsIcon = ({ size: _size, color: _color, className = "" }) => (
  <AdminDashIconImg src={gearIcon} className={`admin-dash-icon--header ${className}`.trim()} />
);

export const AdminMetricCalendarIcon = () => (
  <AdminDashIconImg src={calendarIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricQueueIcon = () => (
  <AdminDashIconImg src={queueIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricMoneyIcon = () => (
  <AdminDashIconImg src={moneyIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricClockIcon = () => (
  <AdminDashIconImg src={clockIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricPromoIcon = () => (
  <AdminDashIconImg src={promoIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricAvailableIcon = () => (
  <AdminDashIconImg src={userWithCheckIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricInServiceIcon = () => (
  <AdminDashIconImg src={serviceIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricOnBreakIcon = () => (
  <AdminDashIconImg src={breakTimeIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricOffTodayIcon = () => (
  <AdminDashIconImg src={calendarIcon} className="admin-dash-icon--metric-art" alt="" />
);
export const AdminMetricWalkInIcon = () => (
  <AdminDashIconImg src={userPlusIcon} className="admin-dash-icon--walkin-metric-art" alt="" />
);

export const AdminSummaryCompletedIcon = () => (
  <AdminDashIconImg src={checkCompleteIcon} className="admin-dash-icon--summary-art" alt="" />
);
export const AdminSummaryInProgressIcon = () => (
  <AdminDashIconImg src={clockIcon} className="admin-dash-icon--summary-art" alt="" />
);
export const AdminSummaryPendingIcon = () => (
  <AdminDashIconImg src={warningIcon} className="admin-dash-icon--summary-art" alt="" />
);
export const AdminSummaryCancelledIcon = () => (
  <AdminDashIconImg src={cancelledIcon} className="admin-dash-icon--summary-art" alt="" />
);

export const AdminQueueActiveIcon = () => (
  <AdminDashIconImg src={serviceIcon} className="admin-dash-icon--queue-art" alt="" />
);

export const AdminServiceRowIcon = () => (
  <AdminDashIconImg src={serviceIcon} className="admin-dash-icon--svc-row-art" alt="" />
);

export const AdminEditIcon = () => (
  <AdminDashIconImg src={editIcon} className="admin-dash-icon--edit-art" alt="" />
);

export const AdminAnalyticsIcon = () => (
  <AdminDashIconImg src={analyticsIcon} className="admin-dash-icon--analytics-art" alt="" />
);

export const AdminDownloadIcon = () => (
  <AdminDashIconImg src={downloadIcon} className="admin-dash-icon--download-art" alt="" />
);

export const AdminQuickActionServiceIcon = () => (
  <AdminDashIconImg src={serviceIcon} className="admin-dash-icon--action-art" alt="" />
);

export const AdminQuickActionPromoIcon = () => (
  <AdminDashIconImg src={promoIcon} className="admin-dash-icon--action-art" alt="" />
);

export const AdminQuickActionHistoryIcon = () => (
  <AdminDashIconImg src={clockIcon} className="admin-dash-icon--action-art" alt="" />
);

export const AdminNavLogoIcon = () => (
  <AdminDashIconImg src={serviceIcon} className="admin-dash-icon--nav-logo-art" alt="" />
);
