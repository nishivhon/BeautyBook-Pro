import dashboardHomeIcon from "../../../svg icons/Dashboard Home Icon.svg";
import userIcon from "../../../svg icons/User Icon.svg";
import clockIcon from "../../../svg icons/Clock Icon.svg";
import discountIcon from "../../../svg icons/Discount Icon.svg";
import calendarIcon from "../../../svg icons/Calender Icon.svg";
import logOutIcon from "../../../svg icons/Log out Icon.svg";
import queueIcon from "../../../svg icons/Queue Icon.svg";
import gearIcon from "../../../svg icons/Gear Icon.svg";

export { LogoMark } from "../public/publicPageIcons";

const DashIconImg = ({ src, className = "", alt = "" }) => (
  <img src={src} alt={alt} className={`customer-dash-icon ${className}`.trim()} draggable={false} />
);

const makeNavIcon = (src) =>
  function NavIcon({ color: _color, className = "" }) {
    return <DashIconImg src={src} className={`customer-dash-icon--nav ${className}`.trim()} />;
  };

export const CustomerDashboardIcon = makeNavIcon(dashboardHomeIcon);
export const CustomerProfileIcon = makeNavIcon(userIcon);
export const CustomerHistoryIcon = makeNavIcon(clockIcon);
export const CustomerCouponsIcon = makeNavIcon(discountIcon);
export const CustomerBookingIcon = makeNavIcon(calendarIcon);
export const CustomerLogOutIcon = ({ color: _color, className = "" }) => (
  <DashIconImg src={logOutIcon} className={`customer-dash-icon--nav ${className}`.trim()} />
);

export const CustomerNotificationIcon = ({ size: _size, color: _color, className = "" }) => (
  <DashIconImg src={queueIcon} className={`customer-dash-icon--header ${className}`.trim()} />
);

export const CustomerSettingsIcon = ({ size: _size, color: _color, className = "" }) => (
  <DashIconImg src={gearIcon} className={`customer-dash-icon--header ${className}`.trim()} />
);
