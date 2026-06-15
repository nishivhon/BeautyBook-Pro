import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import PasswordReminderBanner from "../../components/PasswordReminderBanner";
import { AddWalkInModal } from "../../components/modal/customer/add_walkin";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";
import { AssignStylistModal } from "../../components/modal/admin/assign_stylist";
import { useToast } from "../../components/toast";
import DateRangePicker from "../../components/shared/DateRangePicker";
import { AdminHeaderActions } from "../../components/admin/AdminHeaderActions";
import {
  AdminDashboardNavIcon,
  AdminServicesNavIcon,
  AdminLiveStatusNavIcon,
  AdminStaffStatusNavIcon,
  AdminLogOutIcon,
  AdminIconSlot,
  AdminMetricCalendarIcon,
  AdminMetricQueueIcon,
  AdminMetricMoneyIcon,
  AdminMetricClockIcon,
  AdminMetricWalkInIcon,
  AdminQueueActiveIcon,
  AdminAnalyticsIcon,
  AdminDownloadIcon,
} from "../../components/admin/adminDashboardIcons";
import { LogoMark } from "../../components/public/publicPageIcons";

// ═══════════════════════════════════════════════════════════════════
// THEME HOOK (reactive to theme changes)
// ═══════════════════════════════════════════════════════════════════
import { useSyncExternalStore } from "react";

function getCurrentTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function subscribeTheme(callback) {
  // Listen for attribute changes on <html>
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function useTheme() {
  return useSyncExternalStore(subscribeTheme, getCurrentTheme, getCurrentTheme);
}

const isDarkMode = (theme) => theme !== 'light';

const getThemeStyles = (theme, darkStyles, lightStyles) => {
  return isDarkMode(theme) ? darkStyles : lightStyles;
};

const getWalkInRevenue = (walkIn) => {
  const directTotal = Number(walkIn?.total_price || 0);
  if (Number.isFinite(directTotal) && directTotal > 0) return directTotal;

  let services = walkIn?.services;
  if (typeof services === 'string') {
    try {
      services = JSON.parse(services);
    } catch (_) {
      services = [];
    }
  }

  if (Array.isArray(services)) {
    return services.reduce((sum, service) => sum + (Number(service?.price || 0) || 0), 0);
  }

  if (services && typeof services === 'object') {
    return Number(services?.price || 0) || 0;
  }

  return 0;
};

const isAnyStylistAssignment = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase();
  return normalizedValue === 'any'
    || normalizedValue === 'any available'
    || normalizedValue === 'any available stylist'
    || normalizedValue === 'any stylist'
    || normalizedValue.includes('any available')
    || normalizedValue.includes('any stylist');
};

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS (UI controls — dashboard assets live in adminDashboardIcons)
// ═══════════════════════════════════════════════════════════════════

const ChevronRightIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ProceedIcon = ({ size = 14, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M10 8l6 4-6 4V8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
  </svg>
);

const CheckCircleIcon = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CancelledIcon = ({ size = 14, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: AdminDashboardNavIcon },
  { id: "services", label: "Services", icon: AdminServicesNavIcon },
  { id: "live-status", label: "Live Status", icon: AdminLiveStatusNavIcon },
  { id: "staff-status", label: "Staff Status", icon: AdminStaffStatusNavIcon },
];

const STATS = [
  { Icon: AdminMetricCalendarIcon, badge: "+3",      badgeType: "green", value: "24",      label: "Today's Appointments" },
  { Icon: AdminMetricQueueIcon,    badge: null,      badgeType: null,    value: "8",       label: "In Queue Now"         },
  { Icon: AdminMetricMoneyIcon,    badge: "+15%",    badgeType: "green", value: "₱12,450", label: "Revenue Today"        },
  { Icon: AdminMetricClockIcon,    badge: "-5 mins", badgeType: "blue",  value: "18 mins", label: "Avg. Waiting Time"    },
];

const CURRENT_QUEUE = [
  { name: "Juan Dela Cruz", service: "Haircut • Mike S.",      status: "Now", sub: "In Progress" },
  { name: "Pedro Santos",   service: "Beard Trim • John D.",   status: "Now", sub: "In Progress" },
  { name: "Maria Garcia",   service: "Hair Color • Carlos R.", status: "Now", sub: "In Progress" },
];

const NEXT_QUEUE = [
  { number: 1, name: "Anna Reyes", service: "Full Service • Mike S.", wait: "20 mins", sub: "Waiting" },
];

const STAFF = [
  { initial: "M", name: "Mike Santos",     subStatus: "Serving: Juan D.", dotClass: "dash-staff-status-dot-green", nextTime: "10:30 AM" },
  { initial: "J", name: "Daniel Smith",    subStatus: "Available",        dotClass: "dash-staff-status-dot-amber", nextTime: "1:00 PM"  },
  { initial: "C", name: "Antonio Marquez", subStatus: "On Break",         dotClass: "dash-staff-status-dot-gray",  nextTime: "1:30 PM"  },
];

const getManilaDateString = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const sortBookingNotifications = (items) => {
  return [...items].sort((a, b) => {
    const aTime = new Date(a?.activityAt || a?.updatedAt || a?.createdAt || 0).getTime();
    const bTime = new Date(b?.activityAt || b?.updatedAt || b?.createdAt || 0).getTime();

    if (aTime !== bTime) return bTime - aTime;

    return String(b?.id || '').localeCompare(String(a?.id || ''));
  });
};

const mergeBookingNotifications = (currentItems, incomingItems) => {
  const notificationMap = new Map();

  [...currentItems, ...incomingItems].forEach((item) => {
    if (!item?.id) return;
    notificationMap.set(String(item.id), item);
  });

  return sortBookingNotifications(Array.from(notificationMap.values()));
};

const getOldestBookingNotificationCursor = (items) => {
  const sortedItems = sortBookingNotifications(items);
  const oldestItem = sortedItems[sortedItems.length - 1];

  if (!oldestItem?.createdAt || !oldestItem?.id) return null;

  return {
    createdAt: oldestItem.activityAt || oldestItem.updatedAt || oldestItem.createdAt,
    id: oldestItem.id,
  };
};

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const AdminSidebar = ({ activeNav, setActiveNav, sidebarExpanded, onLogout }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleNavClick = (itemId) => {
    setActiveNav(itemId);
    if (itemId === "home") {
      navigate("/admin/dashboard");
    } else if (itemId === "services") {
      navigate("/admin/dashboard/services");
    } else if (itemId === "live-status") {
      navigate("/admin/dashboard/live-status");
    } else if (itemId === "staff-status") {
      navigate("/admin/dashboard/staff-status");
    }
  };

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <aside className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateX(0)" : "translateX(-16px)",
      transition: "all 0.5s ease"
    }}>
      {/* Admin pill */}
      <div className="admin-badge-pill">
        <div className="admin-badge-circle">A</div>
        <span className="admin-badge-text">Administrator</span>
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-button ${isActive ? "active" : ""}`}
              title={item.label}
            >
              <item.icon color={isActive ? "#000" : "currentColor"} />
              {sidebarExpanded && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Log Out */}
      <div className="sidebar-logout-section">
        <button onClick={handleLogout} className="logout-button" title="Log out">
          <AdminLogOutIcon />
          {sidebarExpanded && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

/* ── Page title + actions ── */
const PageTitle = () => {
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="dash-page-header">
      <div className="dash-page-title-block">
        <h1 className="dash-page-title">Admin Dashboard</h1>
        <p className="dash-page-subtitle">BeautyBook Pro · {todayDate}</p>
      </div>
      <AdminHeaderActions />
    </div>
  );
};

/* ── Metric cards for hero section ── */
const PageMetrics = ({ stats }) => (
  <div className="dash-stats-row">
    {stats.map(({ Icon, iconSlot = "metric", badge, badgeType, value, label }, i) => (
      <div key={i} className="dash-stat-card">
        <div className="dash-stat-top">
          <AdminIconSlot size={iconSlot}>
            <Icon />
          </AdminIconSlot>
          {badge && (
            <span className={`dash-stat-badge ${badgeType === "green" ? "dash-stat-badge-green" : "dash-stat-badge-blue"}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="dash-stat-bottom">
          <p className="dash-stat-value">{value}</p>
          <p className="dash-stat-label">{label}</p>
        </div>
      </div>
    ))}
  </div>
);

const LiveQueue = ({ onOpenWalkInModal, onProceedClick }) => {
  const { showToast } = useToast();
  const theme = useTheme();
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [walkInAppointments, setWalkInAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completeConfirmId, setCompleteConfirmId] = useState(null);
  const [completeConfirmData, setCompleteConfirmData] = useState(null);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [cancelConfirmData, setCancelConfirmData] = useState(null);

  const requestCompleteService = (itemId, customerName, service, staff) => {
    setCompleteConfirmId(itemId);
    setCompleteConfirmData({ name: customerName, service, staff });
  };

  const requestCancelWalkIn = (itemId, customerName, isWalkIn = false) => {
    setCancelConfirmId(itemId);
    setCancelConfirmData({ name: customerName, isWalkIn });
  };

  const getManilaDateString = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const normalizeQueueItemTime = (appointment) => appointment?.time || appointment?.time_slot || '';

  const formatTimeToAmPm = (timeValue) => {
    if (!timeValue) return 'N/A';

    const timeString = String(timeValue).trim();
    const timePart = timeString.includes('T')
      ? timeString.split('T')[1]?.split('.')[0]
      : timeString;

    const [hours = '0', minutes = '00'] = timePart.split(':');
    const hourNumber = Number.parseInt(hours, 10);

    if (Number.isNaN(hourNumber)) return 'N/A';

    const period = hourNumber >= 12 ? 'PM' : 'AM';
    const hour12 = String(hourNumber % 12 || 12).padStart(2, '0');

    return `${hour12}:${minutes.padStart(2, '0')} ${period}`;
  };

  const getQueueItemId = (itemId) => String(itemId || '').replace(/^walkin-/, '');

  // Fetch appointments data on component mount and auto-refresh
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get today's date
        const today = getManilaDateString();
        console.log('[LiveQueue] Fetching for date:', today);

        // Fetch current appointments
        const currentRes = await fetch('/api/appointments/read/by-status?status=current');
        if (!currentRes.ok) {
          throw new Error(`Current appointments fetch failed: ${currentRes.status}`);
        }
        const currentData = await currentRes.json();

        // Fetch pending appointments
        const pendingRes = await fetch('/api/appointments/read/by-status?status=pending');
        if (!pendingRes.ok) {
          throw new Error(`Pending appointments fetch failed: ${pendingRes.status}`);
        }
        const pendingData = await pendingRes.json();

        // Fetch walk-in logs for today
        console.log('[LiveQueue] Fetching walk-ins from:', `/api/appointments/walk-in-logs?date=${today}`);
        const walkInRes = await fetch(`/api/appointments/walk-in-logs?date=${today}`);
        console.log('[LiveQueue] Walk-in response status:', walkInRes.status);

        if (!walkInRes.ok) {
          console.error('[LiveQueue] Walk-in API error:', walkInRes.status, walkInRes.statusText);
        }

        const walkInData = await walkInRes.json();
        console.log('[LiveQueue] Walk-in data received:', Array.isArray(walkInData) ? walkInData.length : 'not array', walkInData);

        if (currentData.success) {
          setCurrentAppointments(currentData.appointments || []);
        }
        if (pendingData.success) {
          setPendingAppointments(pendingData.appointments || []);
        }
        if (walkInRes.ok && Array.isArray(walkInData)) {
          setWalkInAppointments(walkInData);
          console.log('[LiveQueue] Set walk-ins:', walkInData.length, 'items');
        } else {
          console.log('[LiveQueue] Walk-in data not valid array or not ok response');
          setWalkInAppointments([]);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    const handleWalkInCreated = (event) => {
      if (event?.detail?.id) {
        fetchAppointments();
      }
    };

    const handleAppointmentsUpdated = () => {
      fetchAppointments();
    };

    const handleQueueStatusChanged = (event) => {
      const detail = event?.detail || {};
      const normalizedId = String(detail.id || '').replace(/^walkin-/, '');
      if (!normalizedId || !detail.status) return;

      if (detail.status === 'current') {
        if (detail.isWalkIn) {
          setWalkInAppointments((prev) => prev.map((walkIn) => (
            String(walkIn.id) === normalizedId ? { ...walkIn, status: 'current' } : walkIn
          )));
          return;
        }

        setPendingAppointments((prev) => prev.filter((apt) => String(apt.id) !== normalizedId));
        setCurrentAppointments((prev) => {
          if (prev.some((apt) => String(apt.id) === normalizedId)) return prev;
          return [
            ...prev,
            {
              id: normalizedId,
              name: detail.name || 'Customer',
              staff: detail.staff || 'Any available',
              service: detail.service || 'Service',
              time: detail.time || '',
              date: detail.date || today,
              status: 'current',
            },
          ];
        });
        return;
      }

      if (detail.status === 'done') {
        if (detail.isWalkIn) {
          setWalkInAppointments((prev) => prev.filter((walkIn) => String(walkIn.id) !== normalizedId));
        } else {
          setCurrentAppointments((prev) => prev.filter((apt) => String(apt.id) !== normalizedId));
          // Do not manage doneAppointments here; parent component handles done lists.
        }
      }
    };

    window.addEventListener('admin:walkin-created', handleWalkInCreated);
    window.addEventListener('appointmentsUpdated', handleAppointmentsUpdated);
    window.addEventListener('live-queue:status-changed', handleQueueStatusChanged);
    return () => {
      window.removeEventListener('admin:walkin-created', handleWalkInCreated);
      window.removeEventListener('appointmentsUpdated', handleAppointmentsUpdated);
      window.removeEventListener('live-queue:status-changed', handleQueueStatusChanged);
    };

  }, []);

  const handleCompleteService = async (itemId, customerName, service) => {
    try {
      console.log(`Service completed for ${customerName}: ${service}`);
      console.log(`Updating appointment ${itemId} status to 'done'`);

      const normalizedId = getQueueItemId(itemId);
      const wasWalkIn = String(itemId || '').startsWith('walkin-');
      
      const response = await fetch('/api/appointments/update/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: normalizedId,
          status: 'done'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to complete service: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Service completion result:`, result);
      
      // Remove the completed row from the live queue immediately
      if (wasWalkIn) {
        setWalkInAppointments(prev => prev.filter((apt) => String(apt.id) !== normalizedId));
      } else {
        setCurrentAppointments(prev => prev.filter((apt) => String(apt.id) !== normalizedId));
      }

      window.dispatchEvent(new CustomEvent('live-queue:status-changed', {
        detail: {
          id: normalizedId,
          status: 'done',
          isWalkIn: wasWalkIn,
          name: customerName,
          service,
        },
      }));
      
      showToast({
        message: '✓ Service marked as done!',
        type: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error(`Error completing service:`, error);
      showToast({
        message: 'Failed to complete service: ' + error.message,
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleCancelWalkIn = async (itemId, customerName) => {
    try {
      const normalizedId = getQueueItemId(itemId);
      // Call the cancel endpoint which resets the slot and increments cancellations
      const response = await fetch('/api/appointments/update/cancel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: normalizedId }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText || String(response.status));
        throw new Error(`Failed to cancel appointment: ${errText}`);
      }

      // Remove the cancelled item from any local queues
      setWalkInAppointments((prev) => prev.filter((walkIn) => String(walkIn.id) !== normalizedId));
      setPendingAppointments((prev) => prev.filter((apt) => String(apt.id) !== normalizedId));
      setCurrentAppointments((prev) => prev.filter((apt) => String(apt.id) !== normalizedId));
      setExpandedItemId(null);

      window.dispatchEvent(new CustomEvent('appointmentsUpdated'));

      showToast({ message: `Appointment for ${customerName} cancelled.`, type: 'success', duration: 2000 });
    } catch (error) {
      console.error('Error cancelling walk-in:', error);
      showToast({
        message: 'Failed to cancel walk-in: ' + error.message,
        type: 'error',
        duration: 3000,
      });
    }
  };

  // Transform appointments to queue item format
  const formatQueueItems = (appointments, type) => {
    return appointments.map((apt, index) => {
      // Extract service name - should come from API now
      const serviceName = apt.service || 'Service';
      const displayTime = type === 'active'
        ? formatAddedTime(apt.updated_at || apt.updatedAt || apt.created_at || apt.createdAt || apt.time)
        : formatTimeToAmPm(apt.time);
      const timeLabel = type === 'active' ? 'Started at' : 'Appointment time';
      
      return {
        id: apt.id,
        type: type,
        number: index + 1,
        name: apt.name,
        staff: apt.staff,
        service: `${serviceName} • ${apt.staff}`,
        statusTop: type === 'active' ? 'Now' : formatTimeToAmPm(apt.time),
        statusSub: type === 'active' ? 'In Progress' : 'Waiting',
        details: {
          serviceSelected: serviceName,
          currentService: type === 'active' ? 'In Progress' : 'Pending',
          startTime: displayTime,
          timeLabel,
          estimatedTime: '45 mins'
        },
        upNextSortKey: type === 'waiting'
          ? getAppointmentSortTimestamp(apt.date, apt.time)
          : Number.MAX_SAFE_INTEGER
      };
    });
  };

  const formatAddedTime = (value) => {
    if (!value) return '—';
    const dateValue = new Date(value);
    if (Number.isNaN(dateValue.getTime())) return '—';
    return dateValue.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getAppointmentSortTimestamp = (dateValue, timeValue) => {
    if (!timeValue) return Number.MAX_SAFE_INTEGER;

    const normalizedTime = String(timeValue).trim();
    const meridiemMatch = normalizedTime.match(/(AM|PM)$/i);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (meridiemMatch) {
      const timePart = normalizedTime.replace(/\s*(AM|PM)$/i, '');
      const [h, m = '0', s = '0'] = timePart.split(':');
      hours = Number.parseInt(h, 10) || 0;
      minutes = Number.parseInt(m, 10) || 0;
      seconds = Number.parseInt(s, 10) || 0;
      const period = meridiemMatch[1].toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    } else {
      const [h, m = '0', s = '0'] = normalizedTime.split(':');
      hours = Number.parseInt(h, 10) || 0;
      minutes = Number.parseInt(m, 10) || 0;
      seconds = Number.parseInt(s, 10) || 0;
    }

    const baseDate = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
    if (Number.isNaN(baseDate.getTime())) return Number.MAX_SAFE_INTEGER;
    baseDate.setHours(hours, minutes, seconds, 0);
    return baseDate.getTime();
  };

  const getWalkInSortTimestamp = (value) => {
    if (!value) return Number.MAX_SAFE_INTEGER;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? Number.MAX_SAFE_INTEGER : parsed.getTime();
  };

  const currentItems = formatQueueItems(currentAppointments, 'active');
  
  // Format walk-in items with status consideration
  const formatWalkInItems = (walkIns, itemType) => {
    return walkIns.map((walkin, index) => {
      // Extract service names from the services JSONB array
      const serviceNames = Array.isArray(walkin.services) 
        ? walkin.services.map(s => s.title || s.name).join(', ')
        : 'Walk-in Service';
      
      const isCurrentType = itemType === 'active';
      
      return {
        id: `walkin-${walkin.id}`,
        actualId: walkin.id,  // Store actual UUID for API calls
        type: itemType,
        number: index + 1,
        name: walkin.customer_name,
        staff: walkin.assigned_staff,
        service: `${serviceNames} • ${walkin.assigned_staff}`,
        statusTop: isCurrentType ? 'Now' : 'Walk-in',
        statusSub: isCurrentType
          ? 'In Progress'
          : formatAddedTime(walkin.created_at || walkin.createdAt || walkin.updated_at),
        details: {
          serviceSelected: serviceNames,
          currentService: isCurrentType ? 'In Progress' : 'Pending',
          startTime: isCurrentType
            ? formatAddedTime(walkin.updated_at || walkin.updatedAt || walkin.created_at || walkin.createdAt)
            : formatAddedTime(walkin.created_at || walkin.createdAt || walkin.updated_at),
          timeLabel: isCurrentType ? 'Started at' : 'Time added',
          estimatedTime: '45 mins'
        },
        upNextSortKey: isCurrentType
          ? Number.MAX_SAFE_INTEGER
          : getWalkInSortTimestamp(walkin.created_at || walkin.createdAt || walkin.updated_at),
        isWalkIn: true
      };
    });
  };

  // Separate walk-ins by status
  const currentWalkIns = walkInAppointments.filter(w => w.status === 'current') || [];
  const pendingWalkIns = walkInAppointments.filter(w => w.status === 'pending') || [];
  
  const currentWalkInItems = formatWalkInItems(currentWalkIns, 'active');
  const pendingWalkInItems = formatWalkInItems(pendingWalkIns, 'waiting');
  
  console.log('[LiveQueue] Current walk-ins:', currentWalkInItems.length);
  console.log('[LiveQueue] Pending walk-ins:', pendingWalkInItems.length);
  
  // Merge walk-ins with appointments in each category
  const allCurrentItems = [...currentItems, ...currentWalkInItems];
  
  // Filter pending items to only show today's appointments with actual bookings (not empty slots)
  const todayPendingAppointments = pendingAppointments.filter(apt => 
    apt.date === today && apt.name && apt.name !== 'Unknown'
  );
  const pendingItems = formatQueueItems(todayPendingAppointments, 'waiting');

  // Combine pending appointments with pending walk-ins
  const allUpNextItems = [...pendingItems, ...pendingWalkInItems]
    .sort((a, b) => (a.upNextSortKey || Number.MAX_SAFE_INTEGER) - (b.upNextSortKey || Number.MAX_SAFE_INTEGER))
    .map((item, index) => ({
      ...item,
      number: index + 1,
    }));
  console.log('[LiveQueue] All up next items (appointments + walk-ins):', allUpNextItems.length);
  console.log('[LiveQueue] All current items (appointments + current walk-ins):', allCurrentItems.length);

  // Create queue sections - always include both Current and Up Next
  const queueSections = [
    {
      label: "Current",
      items: allCurrentItems
    },
    {
      label: "Up Next",
      items: allUpNextItems
    }
  ];

  const QueueItem = ({ id, type, number, name, staff, service, statusTop, statusSub, details, onCompleteService, showProceedButton = false, onProceed, isProceedEnabled = true, onProceedClick, actualId, isWalkIn, onCancelWalkIn }) => {
    const isActive = type === "active";
    const isCancelled = type === "cancelled";
    const rowClass = isActive ? "live-queue-row-active"
                   : isCancelled ? "live-queue-row-cancelled"
                   : "live-queue-row-waiting";
    const isItemExpanded = expandedItemId === id;

    const handleChevronClick = () => {
      setExpandedItemId(isItemExpanded ? null : id);
    };

    const handleCompleteService = () => {
      if (onCompleteService) {
        onCompleteService(id, name, service);
      }
    };

    const handleProceed = () => {
      if (isProceedEnabled && onProceedClick) {
        onProceedClick(id, name, service, staff, actualId, isWalkIn);
      }
    };

    const handleCancelWalkIn = () => {
      if (onCancelWalkIn) {
        onCancelWalkIn(id, name, isWalkIn);
      }
    };

    return (
      <>
        <div className={rowClass}>
          <div className="live-queue-left">
            {isActive ? (
              <AdminIconSlot size="queue">
                <AdminQueueActiveIcon />
              </AdminIconSlot>
            ) : (
              <div className="live-queue-number-box">{number}</div>
            )}
            <div className="live-queue-info">
              <span className="live-queue-name">{name}</span>
              <span className="live-queue-service">{service}</span>
            </div>
          </div>

          <div className="live-queue-right">
            <div className="live-queue-status-col">
              <span className={isActive ? "live-status-now" : isCancelled ? "live-status-red" : "live-status-wait"}>{statusTop}</span>
              <span className={isCancelled ? "live-status-red" : "live-status-sub"}>{statusSub}</span>
            </div>
            <button 
              className="live-queue-chevron"
              onClick={handleChevronClick}
              style={{
                transform: isItemExpanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease"
              }}
            >
              <ChevronRightIcon size={13} color="currentColor" />
            </button>
          </div>
        </div>

        {isItemExpanded && (
          <div
            style={getThemeStyles(
              theme,
              {
                backgroundColor: "rgba(20, 17, 15, 0.5)",
                borderLeft: "3px solid rgba(221, 144, 29, 0.35)",
                padding: "16px",
                marginTop: "8px",
                borderRadius: "6px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 24px"
              },
              {
                backgroundColor: "rgba(230, 100, 140, 0.35)",
                borderLeft: "3px solid rgba(213, 210, 211, 0.35)",
                padding: "16px",
                marginTop: "8px",
                borderRadius: "6px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 24px"
              }
            )}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <span className="dash-detail-label">Service Selected</span>
                <span className="dash-detail-value">{details.serviceSelected}</span>
              </div>

              <div>
                <span className="dash-detail-label">Current Service</span>
                <span className="dash-detail-value">{details.currentService}</span>
              </div>

              <div>
                <span className="dash-detail-label">{details.timeLabel || 'Time added'}</span>
                <span className="dash-detail-value">{details.startTime}</span>
              </div>

              <div>
                <span className="dash-detail-label">Estimated Time</span>
                <span className="dash-detail-value">{details.estimatedTime}</span>
              </div>
            </div>

            {isActive && (
              <div style={{ gridColumn: '1 / -1' }}>
                <button
                  onClick={handleCompleteService}
                  className="dash-complete-btn"
                  style={{ width: '100%' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#16a34a"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#22c55e"}
                >
                  <CheckCircleIcon size={16} color="#fff" />
                  Complete Service
                </button>
              </div>
            )}

            {showProceedButton && !isActive && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
                {isDarkMode(theme) ? (
                  <button
                    onClick={handleProceed}
                    disabled={!isProceedEnabled}
                    className="live-queue-row-btn"
                    style={{
                      background: isProceedEnabled ? "#dd901d" : "#ccc",
                      color: "#fff",
                      border: "none",
                      cursor: isProceedEnabled ? "pointer" : "not-allowed",
                      opacity: isProceedEnabled ? 1 : 0.6,
                    }}
                    onMouseOver={e => {
                      if (isProceedEnabled) e.target.style.backgroundColor = "#c47a14";
                    }}
                    onMouseOut={e => {
                      if (isProceedEnabled) e.target.style.backgroundColor = "#dd901d";
                    }}
                  >
                    <ProceedIcon size={14} color="#fff" />
                    Proceed
                  </button>
                ) : (
                  <button
                    onClick={handleProceed}
                    disabled={!isProceedEnabled}
                    className="dash-complete-btn live-queue-row-btn"
                    style={{
                      opacity: isProceedEnabled ? 1 : 0.6,
                      cursor: isProceedEnabled ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <ProceedIcon size={14} color="#fff" />
                    Proceed
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCancelWalkIn}
                  className="live-queue-cancel-btn live-queue-row-btn"
                >
                  <CancelledIcon size={14} color="#ef4444" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="live-queue-panel">
      {/* Header */}
      <div className="dash-panel-header">
        <div className="dash-panel-title-row">
          <h2 className="dash-panel-title">Live Queue</h2>
          <span className="dash-live-badge">
            <span className="dash-live-dot" />
            Live
          </span>
        </div>
        <div className="dash-panel-buttons">
          <button 
            className="live-add-walkin-btn-small"
            onClick={onOpenWalkInModal}
          >
            <PlusIcon size={10} color="#000" />
            Add Walk-in
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={getThemeStyles(
          theme,
          {
            padding: '20px',
            textAlign: 'center',
            color: '#999'
          },
          {
            padding: '20px',
            textAlign: 'center',
            color: '#999'
          }
        )}>
          Loading appointments...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={getThemeStyles(
          theme,
          {
            padding: '20px',
            textAlign: 'center',
            color: '#f5f1eb'
          },
          {
            padding: '20px',
            textAlign: 'center',
            color: '#ef4444'
          }
        )}>
          Error loading appointments: {error}
        </div>
      )}

      {/* Sections */}
      {!loading && !error && (
        <div className="live-queue-scroll-limited admin-dashboard-scrollable">
          {queueSections.every(s => s.items.length === 0) ? (
            <div className="container-empty-state">
              No live queue at the moment
            </div>
          ) : (
            queueSections.map((section, si) => (
              <div key={si}>
                <p className="live-section-label">{section.label}</p>
                <div className="live-queue-group">
                  {section.items.length === 0 ? (
                    <p style={getThemeStyles(
                      theme,
                      {
                        padding: '10px',
                        color: '#999',
                        fontSize: '14px'
                      },
                      {
                        padding: '10px',
                        color: '#999',
                        fontSize: '14px'
                      }
                    )}>No appointments</p>
                  ) : (
                    section.items.map((item, ii) => {
                      const isUpNext = section.label === "Up Next";
                      return (
                        <QueueItem 
                          key={ii} 
                          {...item} 
                          onCompleteService={requestCompleteService}
                          showProceedButton={isUpNext}
                          isProceedEnabled={ii < 3}
                          onProceedClick={onProceedClick}
                          onCancelWalkIn={requestCancelWalkIn}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>

    {completeConfirmId && (
      <ConfirmationDialog
        isOpen={true}
        title="Complete Service?"
        message={`Are you sure you want to mark ${completeConfirmData?.name}'s service as complete?`}
        confirmText="Yes, Complete"
        cancelText="Cancel"
        onConfirm={async () => {
          try {
            await handleCompleteService(completeConfirmId, completeConfirmData?.name, completeConfirmData?.service);
          } finally {
            setCompleteConfirmId(null);
            setCompleteConfirmData(null);
          }
        }}
        onCancel={() => {
          setCompleteConfirmId(null);
          setCompleteConfirmData(null);
        }}
      />
    )}

    {cancelConfirmId && (
      <ConfirmationDialog
        isOpen={true}
        title={cancelConfirmData?.isWalkIn ? "Cancel Walk-in?" : "Cancel Appointment?"}
        message={cancelConfirmData?.isWalkIn ? `Are you sure you want to cancel ${cancelConfirmData?.name}'s walk-in?` : `Are you sure you want to cancel ${cancelConfirmData?.name}'s appointment?`}
        confirmText="Yes, Cancel"
        cancelText="Keep"
        onConfirm={async () => {
          try {
            await handleCancelWalkIn(cancelConfirmId, cancelConfirmData?.name);
          } finally {
            setCancelConfirmId(null);
            setCancelConfirmData(null);
          }
        }}
        onCancel={() => {
          setCancelConfirmId(null);
          setCancelConfirmData(null);
        }}
      />
    )}
    </>
  );
};

const StaffStatus = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [resStaff, resSlots] = await Promise.all([
          fetch('/api/staffs'),
          fetch('/api/appointments/read/slots')
        ]);
        
        if (!resStaff.ok) {
          throw new Error(`Failed to fetch staff: ${resStaff.status}`);
        }
        
        const staffData = await resStaff.json();
        
        // Handle slots response - ensure it's an array
        const slotsData = resSlots.ok ? await resSlots.json() : null;
        const allSlots = Array.isArray(slotsData) ? slotsData : [];

        // Format time helper
        const formatTimeToAmPm = (time24) => {
          if (!time24) return 'N/A';
          const [hours, minutes] = time24.split(':');
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour % 12 || 12;
          return `${hour12}:${minutes}${ampm}`;
        };

        // Transform staff data to match the dashboard format
        const transformedStaff = staffData.map((s) => {
          // Get the name - handle both 'name' and 'names' column variants
          const staffName = s.names || s.name || 'Unknown';
          
          // Check if clocked out
          const hasClockOut = s.clock_out && s.clock_out.trim() && s.clock_out !== '—';
          
          // Determine status based on clock out, status column, then in_service column
          let dotClass = 'dash-staff-status-dot-gray';
          let subStatus = 'Available';
          
          const statusValue = (s.status || '').trim().toLowerCase();
          const inServiceValue = (s.in_service || '').trim().toLowerCase();
          
          // Priority 1: Check if clocked out or status is 'off'
          if (hasClockOut || statusValue === 'off') {
            dotClass = 'dash-staff-status-dot-gray';
            subStatus = 'Off';
          }
          // Priority 2: Check in_service status
          else if (inServiceValue === 'in-service') {
            dotClass = 'dash-staff-status-dot-green';
            subStatus = 'In Service';
          } else if (inServiceValue === 'on-break') {
            dotClass = 'dash-staff-status-dot-amber';
            subStatus = 'On Break';
          } else {
            dotClass = 'dash-staff-status-dot-green';
            subStatus = 'Available';
          }

          // Find next slot for this staff from available_slots table
          const nextSlot = allSlots.find(slot => slot.assigned_staff === staffName);
          const nextTime = nextSlot ? formatTimeToAmPm(nextSlot.time_slot) : 'N/A';

          return {
            initial: staffName ? staffName.charAt(0).toUpperCase() : '?',
            name: staffName,
            subStatus: subStatus,
            dotClass: dotClass,
            nextTime: nextTime
          };
        });

        setStaff(transformedStaff);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleManageClick = () => {
    navigate("/admin/dashboard/staff-status");
  };

  return (
    <div className="dash-sidebar-panel">
      <div className="dash-sidebar-header">
        <h3 className="dash-sidebar-title">Staff Status</h3>
        <button className="dash-panel-manage-btn" onClick={handleManageClick} style={{ color: "#fff" }}>Manage</button>
      </div>
      
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Loading staff...
        </div>
      )}
      
      {error && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
          Error loading staff
        </div>
      )}
      
      {!loading && !error && (
        <div className="dash-staff-list live-queue-scroll-limited admin-dashboard-scrollable" style={{ maxHeight: "200px", padding: "12px 0", paddingRight: "12px" }}>
          {staff.map((s, i) => (
            <div key={i} className="dash-staff-row">
              <div className="dash-staff-left">
                <div className="dash-staff-avatar-wrap">
                  <div className="dash-staff-avatar">{s.initial}</div>
                  <span className={`dash-staff-status-dot ${s.dotClass}`} />
                </div>
                <div className="dash-staff-info">
                  <span className="dash-staff-name">{s.name}</span>
                  <span className="dash-staff-substatus">{s.subStatus}</span>
                </div>
              </div>
              <div className="dash-staff-right">
                <span className="dash-staff-next-label">Next:</span>
                <span className="dash-staff-next-time">{s.nextTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AnalyticsPanel = ({ onDownloadReports, isDownloading, exportPickerOpen, setExportPickerOpen }) => (
  <div className="dash-sidebar-panel">
    <div className="dash-analytics-header">
      <AdminIconSlot size="analytics-lg">
        <AdminAnalyticsIcon />
      </AdminIconSlot>
      <div className="dash-analytics-text">
        <h3 className="dash-analytics-title">Analytics</h3>
        <p className="dash-analytics-sub">View monthly detailed report</p>
      </div>
    </div>
    <div style={{ position: 'relative' }}>
      <button
        className="dash-download-btn"
        onClick={() => setExportPickerOpen(true)}
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading...' : 'Download Reports'}
        <AdminIconSlot size="inline">
          <AdminDownloadIcon />
        </AdminIconSlot>
      </button>
      <DateRangePicker
        open={exportPickerOpen}
        initialRange={null}
        onClose={() => setExportPickerOpen(false)}
        onConfirm={onDownloadReports}
      />
    </div>
  </div>
);


const CouponsPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllCoupons = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/coupons/read?includeDeleted=true');
        if (!response.ok) throw new Error('Failed to fetch coupons');
        const result = await response.json();
        setCoupons(result.data || []);
      } catch (err) {
        console.error('Error loading coupons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCoupons();
  }, []);

  // Helper: format discount
  const formatDiscount = (coupon) => {
    if (coupon.value_type === 'percentage') {
      return `${coupon.value}%`;
    } else {
      return `₱${coupon.value.toFixed(2)}`;
    }
  };

  // Helper: get coupon status
  const getCouponStatus = (coupon) => {
    const now = new Date();
    const start = coupon.start_date ? new Date(coupon.start_date) : null;
    const endDateValue = coupon.end_date || coupon.expiration_date;
    const end = endDateValue ? new Date(endDateValue) : null;
    if (coupon.is_deleted) return 'deleted';
    if (end && now > end) return 'expired';
    if (start && now < start) return 'upcoming';
    if (coupon.status === 'inactive') return 'inactive';
    return 'active';
  };

  // Helper: badge color
  const statusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'expired': return 'bg-gray-400 text-white';
      case 'upcoming': return 'bg-amber-400 text-white';
      case 'inactive': return 'bg-red-400 text-white';
      default: return 'bg-gray-300 text-black';
    }
  };


  // Dropdown options (match coupon statuses)
  const filterOptions = [
    { key: 'active', label: 'Active Only' },
    { key: 'inactive', label: 'Inactive Only' },
    { key: 'expired', label: 'Expired Only' },
    { key: 'upcoming', label: 'Upcoming Only' },
    { key: 'deleted', label: 'Deleted Only' },
  ];

  // Filter and sort coupons
  const filteredCoupons = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    let filtered = coupons.map(c => ({ ...c, _status: getCouponStatus(c) }));

    if (normalizedQuery) {
      filtered = filtered.filter((coupon) => {
        const searchableText = [
          coupon.code,
          coupon.description,
          coupon.value_type,
          coupon.start_date,
          coupon.end_date,
          coupon.expiration_date,
          coupon.status,
          coupon._status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      });
    }

    if (selectedFilter) filtered = filtered.filter(c => c._status === selectedFilter);
    filtered.sort((a, b) => {
      const order = { upcoming: 0, active: 1, inactive: 2, expired: 3, deleted: 4 };
      if (order[a._status] !== order[b._status]) return order[a._status] - order[b._status];
      const aExp = (a.end_date || a.expiration_date) ? new Date(a.end_date || a.expiration_date) : new Date(0);
      const bExp = (b.end_date || b.expiration_date) ? new Date(b.end_date || b.expiration_date) : new Date(0);
      return bExp - aExp;
    });
    return filtered;
  }, [coupons, searchQuery, selectedFilter]);

  const handleFilterSelect = (key) => {
    setSelectedFilter(key);
    setFilterOpen(false);
  };

  // Filter icon (from staff status page)
  const FilterIcon = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Styling helpers
  const theme = useTheme();
  const textColor = isDarkMode(theme) ? '#f5f1eb' : '#0c0a09';
  const labelColor = isDarkMode(theme) ? '#988f81' : '#666';
  const tertiaryColor = isDarkMode(theme) ? '#666' : '#999';


  // (No old dropdown logic; only staff filter logic is used)

  return (
    <div className="live-queue-panel">
      {/* Header */}
      <div className="dash-panel-header" style={{ position: 'relative' }}>
        <div className="dash-panel-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h2 className="dash-panel-title">Coupons List</h2>
          <div className="dash-panel-buttons" style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              id="admin-coupons-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search coupons"
              aria-label="Search coupons"
              style={{
                width: 220,
                borderRadius: 10,
                border: '1px solid rgba(221, 144, 29, 0.22)',
                background: isDarkMode(theme) ? 'rgba(20, 17, 15, 0.45)' : '#fff',
                color: textColor,
                padding: '10px 12px',
                fontSize: 13,
                outline: 'none',
                marginRight: 10,
              }}
            />
            <button
              className="staff-filter-btn"
              aria-label="Filter"
              onClick={() => setFilterOpen(!filterOpen)}
              style={{ marginLeft: 'auto' }}
            >
              <FilterIcon size={15} color="currentColor" />
            </button>
            {filterOpen && (
              <div className="staff-filter-dropdown" style={{ position: 'absolute', top: '110%', right: 0, zIndex: 10, minWidth: 180 }}>
                {filterOptions.map(opt => (
                  <button
                    key={opt.key ?? 'all'}
                    className={`staff-filter-option${selectedFilter === opt.key ? ' active' : ''}`}
                    onClick={() => handleFilterSelect(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: 13, minHeight: 120 }}>
          Loading coupons...
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: 13, minHeight: 120 }}>
          No coupons found
        </div>
      ) : (
        <div
          className="dash-coupons-list live-queue-scroll-limited"
          style={{
            maxHeight: "420px",
            minHeight: "220px",
            padding: "12px 0",
            paddingRight: "12px",
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarGutter: 'stable',
          }}
        >
          {filteredCoupons.map((coupon) => {
            const status = coupon._status;
            const muted = status === 'expired' || status === 'inactive' || status === 'deleted';
            const couponRowStyle = getThemeStyles(
              theme,
              {
                padding: '12px',
                marginBottom: '8px',
                background: muted ? 'rgba(20, 17, 15, 0.25)' : 'rgba(20, 17, 15, 0.5)',
                borderRadius: 6,
                border: muted ? '1px solid #444' : '1px solid rgba(221, 144, 29, 0.2)',
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'background 0.2s, border 0.2s',
              },
              {
                padding: '12px',
                marginBottom: '8px',
                background: muted ? 'rgba(243, 139, 166, 0.15)' : 'rgba(243, 139, 166, 0.5)',
                borderRadius: 6,
                border: muted ? '1px solid #ddd' : '1px solid rgba(255, 255, 255, 0.6)',
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'background 0.2s, border 0.2s',
              }
            );
            return (
              <div
                key={coupon.id}
                style={couponRowStyle}
                className="group hover:shadow-md"
              >
                <div className="flex items-center gap-2 justify-between">
                  <div className="font-semibold text-base" style={{ color: textColor }}>{coupon.code}</div>
                </div>
                <div className="text-sm" style={{ color: labelColor }}>
                  {coupon.description || 'No description provided'}
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span style={{ color: labelColor }}>{formatDiscount(coupon)} OFF</span>
                  {(coupon.end_date || coupon.expiration_date) && (
                    <span className="text-xs" style={{ color: tertiaryColor }}>
                      Expires: {new Date(coupon.end_date || coupon.expiration_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 justify-between text-xs" style={{ color: tertiaryColor }}>
                  <span>Claims: {coupon.number_of_uses}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}</span>
                  {coupon.start_date && status === 'upcoming' && (
                    <span className="italic text-amber-600">Starts: {new Date(coupon.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════

export const AdminDashboard = ({ date }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showAssignStylistModal, setShowAssignStylistModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [proceedConfirmId, setProceedConfirmId] = useState(null);
  const [proceedConfirmData, setProceedConfirmData] = useState(null);
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [doneAppointments, setDoneAppointments] = useState([]);
  const [walkInLogs, setWalkInLogs] = useState([]);
  const [bookingNotifications, setBookingNotifications] = useState([]);
  const [bookingNotificationsHasMore, setBookingNotificationsHasMore] = useState(false);
  const [loadingMoreBookingNotifications, setLoadingMoreBookingNotifications] = useState(false);
  const [isDownloadingReports, setIsDownloadingReports] = useState(false);
  const [exportPickerOpen, setExportPickerOpen] = useState(false);
  const [stats, setStats] = useState([
    { Icon: AdminMetricCalendarIcon, badge: null, badgeType: null, value: '0', label: "Total Appointments Today" },
    { Icon: AdminMetricWalkInIcon, iconSlot: "metric-walkin", badge: null, badgeType: null, value: '0', label: "Total Walk In" },
    { Icon: AdminMetricQueueIcon, badge: null, badgeType: null, value: '0', label: "In Queue" },
    { Icon: AdminMetricMoneyIcon, badge: null, badgeType: null, value: '₱0', label: "Total Revenue" },
  ]);
  const [activeNav, setActiveNav] = useState("home");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('adminSidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = getManilaDateString();

        // Fetch current appointments
        const currentRes = await fetch('/api/appointments/read/by-status?status=current');
        if (currentRes.ok) {
          const currentData = await currentRes.json();
          const current = currentData.appointments || [];
          setCurrentAppointments(current);
        }
        
        // Fetch pending appointments
        const pendingRes = await fetch('/api/appointments/read/by-status?status=pending');
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          const pending = pendingData.appointments || [];
          setPendingAppointments(pending);
        }

        // Fetch done appointments
        const doneRes = await fetch('/api/appointments/read/by-status?status=done');
        if (doneRes.ok) {
          const doneData = await doneRes.json();
          const done = doneData.appointments || [];
          setDoneAppointments(done);
        }

        const walkInRes = await fetch(`/api/appointments/walk-in-logs?date=${today}`);
        if (walkInRes.ok) {
          const walkInData = await walkInRes.json();
          setWalkInLogs(Array.isArray(walkInData) ? walkInData : []);
        } else {
          setWalkInLogs([]);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchBookingNotifications = async ({ cursor = null } = {}) => {
      try {
        const searchParams = new URLSearchParams({ limit: '20' });

        if (cursor?.createdAt && cursor?.id) {
          searchParams.set('beforeCreatedAt', cursor.createdAt);
          searchParams.set('beforeId', String(cursor.id));
        }

        const response = await fetch(`/api/appointments/read/recent-bookings?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking notifications');
        }

        const result = await response.json();
        const nextNotifications = result.notifications || [];
        setBookingNotifications((prev) => mergeBookingNotifications(prev, nextNotifications));
        setBookingNotificationsHasMore(Boolean(result.hasMore));
      } catch (error) {
        console.error('[AdminDashboard] Error loading booking notifications:', error);
        setBookingNotificationsHasMore(false);
      }
    };

    fetchBookingNotifications();

    const handleWalkInCreated = (event) => {
      const detail = event?.detail || {};
      if (!detail.id) return;

      setWalkInLogs((prev) => {
        if (prev.some((item) => String(item.id) === String(detail.id))) return prev;
        return [{ id: detail.id, ...detail }, ...prev];
      });

      const createdAt = detail.createdAt || new Date().toISOString();
      const timeAgo = 'Just now';

      const newNotification = {
        id: detail.id,
        tone: 'amber',
        category: 'New booking',
        title: `${detail.name || 'Customer'} booked ${detail.service || 'a service'}`,
        description: `${detail.staff || 'Any available stylist'} • Walk-in`,
        time: timeAgo,
        unread: true,
        createdAt,
      };

      setBookingNotifications((prev) => mergeBookingNotifications(prev, [newNotification]));
    };

    window.addEventListener('admin:walkin-created', handleWalkInCreated);
    return () => window.removeEventListener('admin:walkin-created', handleWalkInCreated);
  }, []);

  const handleLoadMoreBookingNotifications = async () => {
    if (loadingMoreBookingNotifications || !bookingNotificationsHasMore) return;

    const oldestNotification = getOldestBookingNotificationCursor(bookingNotifications);

    if (!oldestNotification?.createdAt || !oldestNotification?.id) return;

    try {
      setLoadingMoreBookingNotifications(true);

      const searchParams = new URLSearchParams({
        limit: '20',
        beforeCreatedAt: oldestNotification.createdAt,
        beforeId: String(oldestNotification.id),
      });

      const response = await fetch(`/api/appointments/read/recent-bookings?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load more booking notifications');
      }

      const result = await response.json();
      setBookingNotifications((prev) => mergeBookingNotifications(prev, result.notifications || []));
      setBookingNotificationsHasMore(Boolean(result.hasMore));
    } catch (error) {
      console.error('[AdminDashboard] Error loading more booking notifications:', error);
    } finally {
      setLoadingMoreBookingNotifications(false);
    }
  };

  // Calculate stats dynamically
  useEffect(() => {
    const today = getManilaDateString();
    
    console.log('[AdminDash] Today:', today);
    console.log('[AdminDash] Current appointments:', currentAppointments.map(a => ({ name: a.name, date: a.date })));
    console.log('[AdminDash] Pending appointments:', pendingAppointments.map(a => ({ name: a.name, date: a.date })));
    console.log('[AdminDash] Done appointments:', doneAppointments.map(a => ({ name: a.name, date: a.date })));
    console.log('[AdminDash] Walk-ins today:', walkInLogs.length);
    
    // Total appointments for today (current + pending + done)
    const todayAppointments = [
      ...currentAppointments.filter(apt => apt.date === today),
      ...pendingAppointments.filter(apt => apt.date === today),
      ...doneAppointments.filter(apt => apt.date === today)
    ];
    
    const totalToday = todayAppointments.length;

    const totalWalkIns = walkInLogs.length;

    const inQueueCount = [
      ...pendingAppointments.filter(apt => apt.date === today),
      ...walkInLogs.filter((walkIn) => {
        const walkInStatus = String(walkIn.status || '').toLowerCase();
        if (walkInStatus && !['pending'].includes(walkInStatus)) return false;
        const walkInDate = walkIn.date || walkIn.created_at?.split('T')[0] || walkIn.createdAt?.split('T')[0];
        return walkInDate === today;
      }),
    ].length;

    const appointmentRevenue = doneAppointments
      .filter(apt => apt.date === today)
      .reduce((sum, apt) => sum + (Number(apt.price || apt.total_price || 0) || 0), 0);

    const walkInRevenue = walkInLogs
      .filter((walkIn) => {
        const walkInDate = walkIn.date || walkIn.created_at?.split('T')[0] || walkIn.createdAt?.split('T')[0];
        return walkInDate === today;
      })
      .reduce((sum, walkIn) => sum + getWalkInRevenue(walkIn), 0);

    const totalRevenue = appointmentRevenue + walkInRevenue;

    console.log('[AdminDash] Total today:', totalToday, 'Walk-ins:', totalWalkIns, 'In queue:', inQueueCount, 'Revenue:', totalRevenue);

    setStats([
      { Icon: AdminMetricCalendarIcon, badge: null, badgeType: null, value: totalToday.toString(), label: "Total Appointments Today" },
      { Icon: AdminMetricWalkInIcon, iconSlot: "metric-walkin", badge: null, badgeType: null, value: totalWalkIns.toString(), label: "Total Walk In" },
      { Icon: AdminMetricQueueIcon, badge: null, badgeType: null, value: inQueueCount.toString(), label: "In Queue" },
      { Icon: AdminMetricMoneyIcon, badge: null, badgeType: null, value: `₱${Number(totalRevenue).toLocaleString('en-PH')}`, label: "Total Revenue" },
    ]);
  }, [currentAppointments, pendingAppointments, doneAppointments, walkInLogs]);

  useEffect(() => {
    const handleQueueStatusChanged = (event) => {
      const detail = event?.detail || {};
      const normalizedId = String(detail.id || '').replace(/^walkin-/, '');
      if (!normalizedId || !detail.status || detail.isWalkIn) return;

      const baseDate = detail.date || new Date().toISOString().split('T')[0];

      if (detail.status === 'current') {
        setPendingAppointments((prev) => prev.filter((apt) => String(apt.id) !== normalizedId));
        setCurrentAppointments((prev) => {
          if (prev.some((apt) => String(apt.id) === normalizedId)) return prev;
          return [
            ...prev,
            {
              id: normalizedId,
              name: detail.name || 'Customer',
              staff: detail.staff || 'Any available',
              service: detail.service || 'Service',
              time: detail.time || '',
              date: baseDate,
              status: 'current',
            },
          ];
        });
      }

      if (detail.status === 'done') {
        setCurrentAppointments((prev) => prev.filter((apt) => String(apt.id) !== normalizedId));
        setDoneAppointments((prev) => {
          if (prev.some((apt) => String(apt.id) === normalizedId)) return prev;
          return [
            ...prev,
            {
              id: normalizedId,
              name: detail.name || 'Customer',
              staff: detail.staff || 'Any available',
              service: detail.service || 'Service',
              time: detail.time || '',
              date: baseDate,
              status: 'done',
            },
          ];
        });
      }
    };

    window.addEventListener('live-queue:status-changed', handleQueueStatusChanged);
    return () => window.removeEventListener('live-queue:status-changed', handleQueueStatusChanged);
  }, []);

  const headerNotifications = bookingNotifications;

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logoutOperator();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleAddWalkIn = (walkInData) => {
    console.log("Walk-in added:", walkInData);
    // Here you can integrate with your API or state management
    // For now, just logging the data
  };

  const handleDownloadReports = async (range) => {
    try {
      setIsDownloadingReports(true);

      const searchParams = new URLSearchParams();
      if (range?.startDate) searchParams.set('fromDate', range.startDate);
      if (range?.endDate) searchParams.set('toDate', range.endDate);

      const response = await fetch(`/api/cron/dashboard-analytics-export?${searchParams.toString()}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to download reports: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const rangeLabel = range?.startDate && range?.endDate ? `${range.startDate}_to_${range.endDate}` : new Date().toISOString().slice(0, 10);
      link.download = `dashboard_analytics_${rangeLabel}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      showToast({
        message: 'Dashboard analytics CSV downloaded successfully.',
        type: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('[AdminDashboard] Error downloading analytics CSV:', error);
      showToast({
        message: `Failed to download reports: ${error.message}`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setExportPickerOpen(false);
      setIsDownloadingReports(false);
    }
  };

  const handleCompleteServiceFromDialog = async (itemId, customerName, service, staffNameOverride = null) => {
    try {
      // For walk-ins, use actualId instead of prefixed id
      const apiId = proceedConfirmData?.actualId || itemId;
      const isWalkIn = proceedConfirmData?.isWalkIn || false;
      const resolvedStaffName = staffNameOverride || proceedConfirmData?.staff;
      
      console.log(`[AdminDashboard] Moving appointment ${itemId} to current for ${customerName}`);
      console.log(`[AdminDashboard] isWalkIn:`, isWalkIn, 'actualId:', apiId);
      console.log(`[AdminDashboard] Request payload:`, { id: apiId, status: 'current', staffName: resolvedStaffName });
      
      const response = await fetch('/api/appointments/update/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: apiId,
          status: 'current',
          staffName: resolvedStaffName
        })
      });

      console.log(`[AdminDashboard] Response status:`, response.status, response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[AdminDashboard] Error response:', errorData);
        showToast({
          message: `API Error: ${errorData.error || response.statusText}`,
          type: 'error',
          duration: 3000
        });
        throw new Error(`Failed to move appointment to current: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log(`[AdminDashboard] Appointment moved to current:`, result);
      console.log(`[AdminDashboard] History synced:`, result.historyUpdated, result.historyUpdateReason);
      
      // Update local state instead of reloading page
      if (isWalkIn) {
      } else {
        // Move appointment from pending to current
        setCurrentAppointments(prev => [
          ...prev,
          ...pendingAppointments.filter(apt => apt.id === apiId)
        ]);
        setPendingAppointments(prev => prev.filter(apt => apt.id !== apiId));
      }

      window.dispatchEvent(new CustomEvent('live-queue:status-changed', {
        detail: {
          id: apiId,
          status: 'current',
          isWalkIn,
          name: proceedConfirmData?.name,
          staff: proceedConfirmData?.staff,
          service: proceedConfirmData?.service,
        },
      }));

      // Close dialog and show success
      setProceedConfirmId(null);
      setProceedConfirmData(null);
      showToast({
        message: `✓ Status updated!`,
        type: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('[AdminDashboard] Error moving appointment:', error);
      console.error('[AdminDashboard] Full error:', error.toString());
      showToast({
        message: 'Failed to move appointment. Please try again.',
        type: 'error',
        duration: 3000
      });
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="super-admin-container admin-dashboard-page"
      style={{ "--sidebar-width": sidebarExpanded ? "340px" : "80px" }}
    >
      {/* Sidebar */}
      <div
        inert={showWalkInModal || showAssignStylistModal ? "" : undefined}
        aria-hidden={showWalkInModal || showAssignStylistModal ? "true" : undefined}
        style={{ pointerEvents: showWalkInModal || showAssignStylistModal ? "none" : "auto" }}
      >
        <AdminSidebar 
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          sidebarExpanded={sidebarExpanded}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="super-admin-main">
        {/* Dashboard Header - Fixed Title and Actions */}
        <header 
          className={`dashboard-header ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          inert={showWalkInModal ? "" : undefined}
          aria-hidden={showWalkInModal ? "true" : undefined}
          style={{ pointerEvents: showWalkInModal ? "none" : "auto" }}
        >
          <div className="dashboard-header-main">
            <button
              onClick={() => setSidebarExpanded((prev) => !prev)}
              className="logo-toggle-btn dashboard-header-logo-btn"
              title="Toggle sidebar"
            >
              <div className="logo-badge public-icon-slot public-icon-slot--logo">
                <LogoMark />
              </div>
            </button>
            <span className="dashboard-system-title">BeautyBook Pro</span>
            <div className="dashboard-page-title-wrap">
              <h1 className="dash-page-title">Admin Dashboard</h1>
              <p className="dash-page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          <AdminHeaderActions
            notifications={headerNotifications}
            onLoadMoreNotifications={handleLoadMoreBookingNotifications}
            hasMoreNotifications={bookingNotificationsHasMore}
            loadingMoreNotifications={loadingMoreBookingNotifications}
          />
        </header>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Password Reminder Banner */}
          <PasswordReminderBanner />
          
          {/* Metrics Cards - Hero Section */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <PageMetrics stats={stats} />
          </div>
          <div className="dash-content-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <LiveQueue 
                onOpenWalkInModal={() => setShowWalkInModal(true)}
                onProceedClick={(id, name, service, staff, actualId, isWalkIn) => {
                  setProceedConfirmId(id);
                  setProceedConfirmData({ name, service, staff, actualId, isWalkIn });
                  setShowAssignStylistModal(isAnyStylistAssignment(staff));
                }}
              />

            </div>

            <div className="dash-sidebar">
              <StaffStatus />
              <AnalyticsPanel
                onDownloadReports={handleDownloadReports}
                isDownloading={isDownloadingReports}
                exportPickerOpen={exportPickerOpen}
                setExportPickerOpen={setExportPickerOpen}
              />
            </div>
          </div>
        </main>
      </div>

      <AddWalkInModal 
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSubmit={handleAddWalkIn}
      />

      <AssignStylistModal
        isOpen={showAssignStylistModal}
        title="Choose an available stylist"
        message={`Select the stylist who will serve ${proceedConfirmData?.name} for ${proceedConfirmData?.service}.`}
        onClose={() => {
          setShowAssignStylistModal(false);
          setProceedConfirmId(null);
          setProceedConfirmData(null);
        }}
        onSelect={(selectedStaff) => {
          const selectedStaffName = selectedStaff?.names || null;
          setShowAssignStylistModal(false);
          handleCompleteServiceFromDialog(proceedConfirmId, proceedConfirmData?.name, proceedConfirmData?.service, selectedStaffName);
        }}
      />

      {proceedConfirmId && !showAssignStylistModal && (
        <ConfirmationDialog
          isOpen={true}
          title="Move to Serving?"
          message={`Confirm that a stylist is available and ready to serve ${proceedConfirmData?.name} for ${proceedConfirmData?.service}.`}
          confirmText="Yes, Proceed"
          cancelText="Cancel"
          onConfirm={() => handleCompleteServiceFromDialog(proceedConfirmId, proceedConfirmData.name, proceedConfirmData.service, proceedConfirmData.staff)}
          onCancel={() => {
            setProceedConfirmId(null);
            setProceedConfirmData(null);
          }}
        />
      )}

      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title="Log Out?"
        message="Are you sure you want to log out of the admin dashboard?"
        confirmText="Yes, Log Out"
        cancelText="Stay Logged In"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
};

export default AdminDashboard;
