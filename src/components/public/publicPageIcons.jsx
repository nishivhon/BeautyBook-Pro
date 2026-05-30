import logoIcon from "../../../svg icons/Logo icon.svg";
import calendarIcon from "../../../svg icons/Calender Icon.svg";
import queueIcon from "../../../svg icons/Queue Icon.svg";
import checkCompleteIcon from "../../../svg icons/Check Complete Icon.svg";
import cancelledIcon from "../../../svg icons/Cancelled Icon.svg";
import clockIcon from "../../../svg icons/Clock Icon.svg";
import databaseIcon from "../../../svg icons/Database Icon.svg";
import globeIcon from "../../../svg icons/Globe Icon.svg";
import userPlusIcon from "../../../svg icons/User with + icon.svg";
import briefcaseIcon from "../../../svg icons/Briefcase icon.svg";

const SvgImg = ({ src, className = "", alt = "" }) => (
  <img src={src} alt={alt} className={`public-page-icon ${className}`.trim()} draggable={false} />
);

export const LogoMark = () => (
  <span className="public-page-icon-logo-wrap" aria-hidden="true">
    <SvgImg src={logoIcon} className="public-page-icon--logo-art" alt="" />
  </span>
);

export const BookOnlineIcon = () => <SvgImg src={calendarIcon} alt="" />;
export const GetNotifiedIcon = () => <SvgImg src={queueIcon} alt="" />;
export const EnjoyServiceIcon = () => <SvgImg src={checkCompleteIcon} alt="" />;

export const ConflictIcon = () => <SvgImg src={cancelledIcon} alt="" />;
export const WaitIcon = () => <SvgImg src={clockIcon} alt="" />;
export const DataIcon = () => <SvgImg src={databaseIcon} alt="" />;
export const CommunicationIcon = () => <SvgImg src={globeIcon} alt="" />;
export const RetentionIcon = () => <SvgImg src={userPlusIcon} className="public-page-icon--retention-art" alt="" />;
export const StaffSchedulingIcon = () => <SvgImg src={briefcaseIcon} alt="" />;
