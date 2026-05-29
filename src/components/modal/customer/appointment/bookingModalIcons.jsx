import logoIcon from "../../../../../svg icons/Logo icon.svg";
import calendarIcon from "../../../../../svg icons/Calender Icon.svg";
import clockIcon from "../../../../../svg icons/Clock Icon.svg";
import userIcon from "../../../../../svg icons/User Icon.svg";
import serviceIcon from "../../../../../svg icons/Service Icon.svg";
import briefcaseIcon from "../../../../../svg icons/Briefcase icon.svg";
import downloadIcon from "../../../../../svg icons/Dowload Icon.svg";

const BookingModalIconImg = ({ src, className = "", alt = "" }) => (
  <img src={src} alt={alt} className={`booking-modal-icon ${className}`.trim()} draggable={false} />
);

/** Wraps icons with landpage-aligned slot sizes (see `.booking-modal-icon-slot` in tailwind.css). */
export const BookingModalIconSlot = ({ children, size = "feature", className = "" }) => (
  <span
    className={`booking-modal-icon-slot booking-modal-icon-slot--${size} ${className}`.trim()}
    aria-hidden="true"
  >
    {children}
  </span>
);

export const BookingLogoIcon = () => (
  <span className="booking-modal-icon-logo-wrap">
    <BookingModalIconImg src={logoIcon} className="booking-modal-icon--logo-art" alt="" />
  </span>
);
export const BookingCalendarIcon = () => <BookingModalIconImg src={calendarIcon} alt="" />;
export const BookingClockIcon = () => <BookingModalIconImg src={clockIcon} alt="" />;
export const BookingUserIcon = () => <BookingModalIconImg src={userIcon} alt="" />;
export const BookingServiceIcon = () => <BookingModalIconImg src={serviceIcon} alt="" />;
export const BookingStylistIcon = () => <BookingModalIconImg src={briefcaseIcon} alt="" />;
export const BookingAnyStylistIcon = () => <BookingModalIconImg src={userIcon} alt="" />;
export const BookingDownloadIcon = () => <BookingModalIconImg src={downloadIcon} alt="" />;
