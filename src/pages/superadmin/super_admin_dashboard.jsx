import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { logoutOperator } from "../../services/operatorAuth";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import PasswordReminderBanner from "../../components/PasswordReminderBanner";
import {
  SUPER_ADMIN_NAV_ITEMS,
  SuperAdminIconSlot,
  SuperAdminLogOutIcon,
  SuperAdminMetricCalendarIcon,
  SuperAdminMetricWalkInIcon,
  SuperAdminMetricMoneyIcon,
} from "../../components/superadmin/superAdminDashboardIcons";

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="16" height="15" rx="3" stroke="#DD901D" strokeWidth="1.7" />
    <path d="M2 8h16M6 1.8v3.4M14 1.8v3.4" stroke="#DD901D" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = ({ size = 18, color = "#DD901D" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 7L10 11M10 11L6 7M10 11V2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 11v5c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const formatISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseISODate = (value) => {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getGraphModeForRange = (rangeStart, rangeEnd) => {
  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "daily";
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
  return totalDays > 14 ? "weekly" : "daily";
};

const buildReportGraphSkeleton = (rangeStart, rangeEnd) => {
  const mode = getGraphModeForRange(rangeStart, rangeEnd);
  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { mode: "daily", points: [] };
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const bucketSize = mode === "weekly" ? 7 : 1;
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const points = [];

  for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, bucketSize)) {
    const bucketEnd = new Date(cursor);
    bucketEnd.setDate(bucketEnd.getDate() + bucketSize - 1);

    if (bucketEnd > end) {
      bucketEnd.setTime(end.getTime());
    }

    const bucketLabel = mode === "weekly"
      ? `${formatter.format(cursor)} - ${formatter.format(bucketEnd)}`
      : cursor.toLocaleDateString("en-US", { weekday: "short" });

    points.push({
      date: formatISODate(cursor),
      label: mode === "weekly"
        ? cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : cursor.toLocaleDateString("en-US", { weekday: "short" }),
      monthDay: bucketLabel,
      rangeLabel: bucketLabel,
      appointments: 0,
      walkIns: 0,
      revenue: 0,
    });
  }

  return { mode, points };
};

const isDarkMode = () => {
  if (typeof document === 'undefined') return true;
  return document.documentElement.getAttribute('data-theme') !== 'light';
};

const getMetricActionButtonStyles = () => {
  if (isDarkMode()) {
    return {
      background: 'rgba(221, 144, 29, 0.12)',
      border: '1px solid rgba(221, 144, 29, 0.35)',
      color: 'var(--color-white)',
    };
  }

  return {
    background: '#fff',
    border: '1px solid rgba(221, 144, 29, 0.45)',
    color: '#6e4b12',
  };
};

const formatRevenueValue = (value) => `₱${Number(value || 0).toLocaleString('en-PH')}`;
const SUPERADMIN_LIST_VIEWPORT_HEIGHT = 560;

const downloadXlsxWorkbook = (workbook, fileName) => {
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

const LoadingRowSkeleton = ({ variant = "staff", index = 0 }) => {
  const baseDelay = `${index * 0.08}s`;

  if (variant === "category") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderRadius: 16,
          border: "1px solid rgba(152, 143, 129, 0.35)",
          background: "rgba(255, 255, 255, 0.02)",
          padding: "12px 14px",
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: baseDelay,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{ width: 92, height: 16, borderRadius: 999, background: "rgba(221, 144, 29, 0.12)" }} />
        </div>
        <div style={{ width: 108, height: 24, borderRadius: 999, background: "rgba(221, 144, 29, 0.12)" }} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.5fr) repeat(3, minmax(0, 0.7fr))",
        gap: 12,
        alignItems: "center",
        borderRadius: 16,
        border: "1px solid rgba(152, 143, 129, 0.35)",
        background: "rgba(255, 255, 255, 0.02)",
        padding: "12px 14px",
        animation: "pulse 1.4s ease-in-out infinite",
        animationDelay: baseDelay,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(221, 144, 29, 0.12)", flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ width: "70%", height: 15, borderRadius: 999, background: "rgba(221, 144, 29, 0.12)" }} />
          <div style={{ width: "55%", height: 10, borderRadius: 999, background: "rgba(221, 144, 29, 0.08)", marginTop: 8 }} />
        </div>
      </div>

      <div style={{ margin: "0 auto", width: 40, height: 15, borderRadius: 999, background: "rgba(221, 144, 29, 0.12)" }} />
      <div style={{ margin: "0 auto", width: 40, height: 15, borderRadius: 999, background: "rgba(221, 144, 29, 0.12)" }} />
      <div style={{ marginLeft: "auto", width: 72, height: 15, borderRadius: 999, background: "rgba(221, 144, 29, 0.12)" }} />
    </div>
  );
};

const LoadingListSkeleton = ({ variant = "staff", rows = 10 }) => {
  return Array.from({ length: rows }, (_, index) => (
    <LoadingRowSkeleton key={`${variant}-skeleton-${index}`} variant={variant} index={index} />
  ));
};

const StaffSummaryPanel = ({ staffMetrics = [], loading = false, rangeLabel = "", onExport }) => {
  const rows = Array.isArray(staffMetrics) ? staffMetrics : [];

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h3 className="dash-stats-set-title">Staff Summary</h3>
          <p style={{ margin: "6px 0 0", color: "#c9ab7b", fontSize: 12, fontWeight: 600 }}>{rangeLabel}</p>
        </div>
        <button
          type="button"
          onClick={onExport}
          title="Export Staff Summary to XLSX"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            borderRadius: 6,
            ...getMetricActionButtonStyles(),
            padding: "4px 8px",
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <DownloadIcon size={18} />
          <span style={{ fontSize: 11 }}>Export</span>
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: SUPERADMIN_LIST_VIEWPORT_HEIGHT,
          maxHeight: SUPERADMIN_LIST_VIEWPORT_HEIGHT,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) repeat(3, minmax(0, 0.7fr))",
            gap: 12,
            padding: "0 4px 4px",
            color: "#9f8457",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>Staff</span>
          <span style={{ textAlign: "center" }}>Walk-ins</span>
          <span style={{ textAlign: "center" }}>Appointments</span>
          <span style={{ textAlign: "right" }}>Revenue</span>
        </div>

        {loading ? (
          <LoadingListSkeleton variant="staff" rows={10} />
        ) : rows.length === 0 ? (
          <div style={{ padding: "24px 6px", color: "#9f8457", fontWeight: 600 }}>No staff activity in the selected range.</div>
        ) : (
          rows.map((item) => (
            <div
              key={item.staff}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) repeat(3, minmax(0, 0.7fr))",
                gap: 12,
                alignItems: "center",
                borderRadius: 16,
                border: "1px solid rgba(152, 143, 129, 0.35)",
                background: "rgba(255, 255, 255, 0.02)",
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(221, 144, 29, 0.14)",
                    border: "1px solid rgba(221, 144, 29, 0.22)",
                    color: "var(--color-white)",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {String(item.staff || "?").trim().charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, color: "var(--color-white)", fontSize: 15, fontWeight: 700, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.staff}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center", color: "var(--color-white)", fontSize: 15, fontWeight: 700 }}>{item.walkIns}</div>
              <div style={{ textAlign: "center", color: "var(--color-white)", fontSize: 15, fontWeight: 700 }}>{item.appointments}</div>
              <div style={{ textAlign: "right", color: "#7fbf7f", fontSize: 15, fontWeight: 800 }}>{formatRevenueValue(item.revenue)}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = formatISODate(today);
  const defaultPastDate = new Date(today);
  defaultPastDate.setDate(defaultPastDate.getDate() - 1);
  const defaultPastISO = formatISODate(defaultPastDate);

  const [summaryRange, setSummaryRange] = useState(() => {
    return { startDate: defaultPastISO, endDate: defaultPastISO };
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [awaitingEndDate, setAwaitingEndDate] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(defaultPastDate.getFullYear(), defaultPastDate.getMonth(), 1));
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({ appointments: 0, walkIns: 0, revenue: 0, staffMetrics: [] });
  const [serviceMetrics, setServiceMetrics] = useState([]);
  const [dailyReport, setDailyReport] = useState([]);
  const [weeklyGraph, setWeeklyGraph] = useState([]);
  const [weeklyGraphLoading, setWeeklyGraphLoading] = useState(false);
  const [weeklyGraphError, setWeeklyGraphError] = useState("");
  const [weeklyGraphMode, setWeeklyGraphMode] = useState("daily");
  const [hoveredTower, setHoveredTower] = useState(null);
  const calendarRef = useRef(null);
  const graphChartRef = useRef(null);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  const fetchSummary = async (range = summaryRange) => {
    try {
      setSummaryLoading(true);
      setWeeklyGraphLoading(true);
      setWeeklyGraphError("");

      const params = new URLSearchParams({
        summary: 'superadmin-dashboard',
        startDate: range.startDate,
        endDate: range.endDate,
        graphStartDate: range.startDate,
        graphEndDate: range.endDate,
      });
      const resp = await fetch(`/api/database/table-data?${params.toString()}`);
      if (!resp.ok) throw new Error('Failed to load summary');
      const json = await resp.json();
      setSummaryData({
        appointments: json.appointments || 0,
        walkIns: json.walkIns || 0,
        revenue: json.revenue || 0,
        staffMetrics: Array.isArray(json.staffMetrics) ? json.staffMetrics : [],
      });
      setServiceMetrics(Array.isArray(json.serviceMetrics) ? json.serviceMetrics : []);
      setDailyReport(Array.isArray(json.dailyReport) ? json.dailyReport : []);
      setWeeklyGraph(Array.isArray(json.weeklyGraph) ? json.weeklyGraph : []);
      setWeeklyGraphMode(json.graphMode || getGraphModeForRange(range.startDate, range.endDate));
    } catch (err) {
      console.error('Summary load error', err);
      const fallbackGraph = buildReportGraphSkeleton(range.startDate, range.endDate);
      setWeeklyGraphError('Unable to load report graph right now.');
      setDailyReport(fallbackGraph.points.map((point) => ({
        date: point.date,
        label: point.label,
        monthDay: point.monthDay,
        rangeLabel: point.rangeLabel,
        appointments: point.appointments,
        walkIns: point.walkIns,
        revenue: point.revenue,
      })));
      setWeeklyGraph(fallbackGraph.points);
      setWeeklyGraphMode(fallbackGraph.mode);
    } finally {
      setSummaryLoading(false);
      setWeeklyGraphLoading(false);
    }
  };

  const toLocalDate = (value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getMondayStart = (date) => {
    const start = new Date(date);
    const dayOfWeek = start.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    start.setDate(start.getDate() + offset);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const addDays = (date, amount) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  };

  // Load initial summary for the default range
  useEffect(() => {
    fetchSummary(summaryRange);
  }, []);

  useEffect(() => {
    if (!calendarOpen) return undefined;

    const handlePointerDownOutside = (event) => {
      if (!calendarRef.current) return;
      if (!calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [calendarOpen]);

  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const metricsCardsFor = (data = { appointments: 0, walkIns: 0, revenue: 0 }) => [
    {
      Icon: SuperAdminMetricCalendarIcon,
      iconSlot: "metric",
      value: String(data.appointments || 0),
      label: "Total Appointments",
      badge: null,
    },
    {
      Icon: SuperAdminMetricWalkInIcon,
      iconSlot: "metric-walkin",
      value: String(data.walkIns || 0),
      label: "Total Walk-ins",
      badge: null,
    },
    {
      Icon: SuperAdminMetricMoneyIcon,
      iconSlot: "metric",
      value: `₱${Number((data.revenue || 0)).toLocaleString()}`,
      label: "Total Revenue",
      badge: null,
    },
  ];

  // Simple metrics cards for summary data
  const cards = metricsCardsFor(summaryData);
  const staffMetrics = Array.isArray(summaryData.staffMetrics) ? summaryData.staffMetrics : [];
  const serviceMetricCategories = serviceMetrics;
  const reportGraphSeries = [
    { key: "appointments", label: "Appointments", color: "#dd901d" },
    { key: "walkIns", label: "Walk-ins", color: "#e85d75" },
  ];
  const reportGraphModeLabel = weeklyGraphMode === "weekly" ? "Weekly points" : "Daily points";
  const reportGraphCellWidth = weeklyGraphMode === "weekly" ? 118 : 76;
  const reportGraphWidth = Math.max(720, weeklyGraph.length * reportGraphCellWidth);
  const reportGraphHeight = 300;
  const reportGraphPadding = { top: 24, right: 24, bottom: 60, left: 50 };
  const reportGraphPlotWidth = Math.max(1, reportGraphWidth - reportGraphPadding.left - reportGraphPadding.right);
  const reportGraphPlotHeight = Math.max(1, reportGraphHeight - reportGraphPadding.top - reportGraphPadding.bottom);
  const reportGraphMaxValue = Math.max(
    1,
    ...weeklyGraph.flatMap((entry) => reportGraphSeries.map((series) => Number(entry?.[series.key] || 0)))
  );
  const reportGraphXStep = weeklyGraph.length > 1 ? reportGraphPlotWidth / (weeklyGraph.length - 1) : 0;

  const buildGraphPoints = (seriesKey) => weeklyGraph.map((entry, index) => {
    const value = Number(entry?.[seriesKey] || 0);
    return {
      x: reportGraphPadding.left + (index * reportGraphXStep),
      y: reportGraphPadding.top + (reportGraphPlotHeight - ((value / reportGraphMaxValue) * reportGraphPlotHeight)),
      value,
      entry,
    };
  });

  const appointmentGraphPoints = buildGraphPoints("appointments");
  const walkInGraphPoints = buildGraphPoints("walkIns");

  const buildGraphPath = (points) => {
    if (points.length === 0) return "";
    return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  };

  const buildGraphAreaPath = (points) => {
    if (points.length === 0) return "";

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    return [
      `M ${firstPoint.x} ${reportGraphPadding.top + reportGraphPlotHeight}`,
      `L ${firstPoint.x} ${firstPoint.y}`,
      ...points.slice(1).map((point) => `L ${point.x} ${point.y}`),
      `L ${lastPoint.x} ${reportGraphPadding.top + reportGraphPlotHeight}`,
      "Z",
    ].join(" ");
  };

  const handleGraphPointHover = (point, series) => {
    setHoveredTower({
      x: point.x,
      y: point.y,
      title: series.label,
      value: point.value,
      dayLabel: point.entry?.label,
      monthDay: point.entry?.monthDay,
      rangeLabel: point.entry?.rangeLabel,
      color: series.color,
      appointments: point.entry?.appointments || 0,
      walkIns: point.entry?.walkIns || 0,
      revenue: point.entry?.revenue || 0,
    });
  };

  const selectionLabel = `${summaryRange.startDate} to ${summaryRange.endDate}`;
  const monthTitle = calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleExportMetricsXlsx = () => {
    const workbook = XLSX.utils.book_new();
    const summaryRows = [
      ["Metric", "Value"],
      ["Date Range", selectionLabel],
      ["Total Appointments", summaryData.appointments || 0],
      ["Total Walk-ins", summaryData.walkIns || 0],
      ["Total Revenue", summaryData.revenue || 0],
    ];

    const dailyRows = [
      ["Date", "Day", "Appointments", "Walk-ins", "Revenue"],
      ...dailyReport.map((day) => [
        day.date || "",
        day.label || "",
        Number(day.appointments || 0),
        Number(day.walkIns || 0),
        Number(day.revenue || 0),
      ]),
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryRows);
    summaryWorksheet["!cols"] = [{ wch: 24 }, { wch: 24 }];
    const dailyWorksheet = XLSX.utils.aoa_to_sheet(dailyRows);
    dailyWorksheet["!cols"] = [{ wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 16 }];

    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Metrics");
    XLSX.utils.book_append_sheet(workbook, dailyWorksheet, "Daily Breakdown");
    downloadXlsxWorkbook(workbook, `superadmin-metrics-${summaryRange.startDate}-to-${summaryRange.endDate}.xlsx`);
  };

  const handleExportStaffSummaryXlsx = () => {
    const workbook = XLSX.utils.book_new();
    const rows = [
      ["Staff", "Walk-ins", "Appointments", "Revenue"],
      ...staffMetrics.map((item) => [
        item.staff || "",
        Number(item.walkIns || 0),
        Number(item.appointments || 0),
        Number(item.revenue || 0),
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!cols"] = [{ wch: 28 }, { wch: 12 }, { wch: 14 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Summary");
    downloadXlsxWorkbook(workbook, `superadmin-staff-summary-${summaryRange.startDate}-to-${summaryRange.endDate}.xlsx`);
  };

  const handleExportCategoriesXlsx = () => {
    const workbook = XLSX.utils.book_new();
    const rows = [
      ["Category", "Top Service", "Bookings"],
      ...serviceMetricCategories.map((category) => [
        category.category || "",
        category.topService?.name || "No bookings yet",
        Number(category.topService?.count || 0),
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    downloadXlsxWorkbook(workbook, `superadmin-categories-services-${summaryRange.startDate}-to-${summaryRange.endDate}.xlsx`);
  };
  const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const leadingEmptyDays = firstDayOfMonth.getDay();
  const totalSlots = Math.ceil((leadingEmptyDays + lastDayOfMonth.getDate()) / 7) * 7;
  const dayCells = Array.from({ length: totalSlots }, (_, index) => {
    const dayNumber = index - leadingEmptyDays + 1;
    if (dayNumber < 1 || dayNumber > lastDayOfMonth.getDate()) return null;
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNumber);
    const iso = formatISODate(date);
    return { dayNumber, iso };
  });

  const handleCalendarDayClick = async (iso) => {
    if (!iso || iso >= todayISO) return;

    if (!awaitingEndDate) {
      setSummaryRange({ startDate: iso, endDate: iso });
      setAwaitingEndDate(true);
      return;
    }

    if (iso < summaryRange.startDate) {
      setSummaryRange({ startDate: iso, endDate: iso });
      setAwaitingEndDate(true);
      return;
    }

    const nextRange = { startDate: summaryRange.startDate, endDate: iso };
    setSummaryRange(nextRange);
    setAwaitingEndDate(false);
    setCalendarOpen(false);
    await fetchSummary(nextRange);
  };

  return (
    <DashboardShell
      navItems={SUPER_ADMIN_NAV_ITEMS}
      LogOutIcon={SuperAdminLogOutIcon}
      activeNav={activeNav}
      roleLabel="Super Administrator"
      roleInitial="S"
      showSidebarHeader={false}
      title="Super Admin Dashboard"
      subtitle={`BeautyBook Pro • ${dateStr}`}
      profile={null}
      notifications={[]}
      useSuperAdminHeaderActions={true}
      superAdminNoNotificationsMessage="No recent super admin activity across client, staff, security, or database events."
      storageKey="superadminSidebarExpanded"
      onLogoutConfirm={handleLogout}
      logoutTitle="Log Out?"
      logoutMessage="Are you sure you want to log out?"
      logoutConfirmText="Yes, Log Out"
      logoutCancelText="Stay Logged In"
    >
      {/* Password Reminder Banner */}
      <PasswordReminderBanner />

      {/* ── Metrics Cards ── */}
      <div className="dash-stats-carousel-container">
        <div className="dash-stats-carousel-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <h3 className="dash-stats-set-title">Metrics</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div ref={calendarRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setCalendarOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  borderRadius: 6,
                  ...getMetricActionButtonStyles(),
                  padding: '4px 8px',
                  fontWeight: 600,
                }}
              >
                <CalendarIcon />
                <span style={{ fontSize: 11 }}>{selectionLabel}</span>
              </button>

            {calendarOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: 220,
                  borderRadius: 8,
                  border: '1px solid rgba(221, 144, 29, 0.25)',
                  background: '#fff',
                  boxShadow: '0 7px 14px rgba(0, 0, 0, 0.1)',
                  padding: 5,
                  zIndex: 30,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    style={{ border: 'none', background: 'transparent', color: '#6e4b12', fontWeight: 700, cursor: 'pointer', fontSize: 11, padding: '1px 3px' }}
                  >
                    {'<'}
                  </button>
                  <span style={{ fontWeight: 700, color: '#2f220f', fontSize: 11 }}>{monthTitle}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
                      const nextMonthFirstDayISO = formatISODate(next);
                      if (nextMonthFirstDayISO < todayISO) {
                        setCalendarMonth(next);
                      }
                    }}
                    style={{ border: 'none', background: 'transparent', color: '#6e4b12', fontWeight: 700, cursor: 'pointer', fontSize: 11, padding: '1px 3px' }}
                  >
                    {'>'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} style={{ textAlign: 'center', fontSize: 8, color: '#9f8457', fontWeight: 700 }}>{day}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                  {dayCells.map((cell, index) => {
                    if (!cell) return <div key={`empty-${index}`} />;

                    if (cell.iso === todayISO) return <div key={`today-hidden-${cell.iso}`} />;

                    const isFutureOrToday = cell.iso >= todayISO;
                    const isStart = cell.iso === summaryRange.startDate;
                    const isEnd = !awaitingEndDate && cell.iso === summaryRange.endDate;
                    const inBetween = !awaitingEndDate && cell.iso > summaryRange.startDate && cell.iso < summaryRange.endDate;

                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        disabled={isFutureOrToday}
                        onClick={() => handleCalendarDayClick(cell.iso)}
                        style={{
                          height: 22,
                          borderRadius: 5,
                          border: isStart || isEnd ? '1px solid #DD901D' : '1px solid transparent',
                          background: isStart || isEnd ? '#DD901D' : inBetween ? '#fdeed6' : 'transparent',
                          color: isStart || isEnd ? '#fff' : isFutureOrToday ? '#d1c2aa' : '#3f2d11',
                          fontWeight: 600,
                          fontSize: 9,
                          cursor: isFutureOrToday ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {cell.dayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            </div>
              <button
                type="button"
                onClick={handleExportMetricsXlsx}
                title="Export Metrics to XLSX"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                borderRadius: 6,
                ...getMetricActionButtonStyles(),
                padding: '4px 8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <DownloadIcon size={20} />
              <span style={{ fontSize: 11 }}>Export</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards - simplified 3-card layout */}
        <div className="dash-stats-row" style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {cards.map(({ Icon, iconSlot = "metric", label, value }) => (
            <div key={label} className="dash-stat-card" style={{ flex: '1 1 0' }}>
              <div className="dash-stat-top">
                <SuperAdminIconSlot size={iconSlot}>
                  <Icon />
                </SuperAdminIconSlot>
              </div>
              <div className="dash-stat-bottom">
                <p className="dash-stat-value">{value}</p>
                <p className="dash-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="superadmin-services-split">
          <section
            className="dash-stat-card no-hover"
            style={{
              minHeight: 360,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              background: "linear-gradient(180deg, rgba(221, 144, 29, 0.05) 0%, rgba(221, 144, 29, 0.02) 100%)",
            }}
          >
              <StaffSummaryPanel staffMetrics={staffMetrics} loading={summaryLoading} rangeLabel={selectionLabel} onExport={handleExportStaffSummaryXlsx} />
          </section>

          <section
            className="dash-stat-card no-hover"
            style={{
              minHeight: 360,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              background: "rgba(221, 144, 29, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h3 className="dash-stats-set-title">Categories and popular services</h3>
              </div>
              <button
                type="button"
                onClick={handleExportCategoriesXlsx}
                title="Export Categories and Popular Services to XLSX"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 6,
                  ...getMetricActionButtonStyles(),
                  padding: "4px 8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <DownloadIcon size={18} />
                <span style={{ fontSize: 11 }}>Export</span>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: SUPERADMIN_LIST_VIEWPORT_HEIGHT,
                maxHeight: SUPERADMIN_LIST_VIEWPORT_HEIGHT,
                overflowY: "auto",
                paddingRight: 4,
              }}
            >
              {summaryLoading ? (
                <LoadingListSkeleton variant="category" rows={10} />
              ) : serviceMetricCategories.length === 0 ? (
                <div style={{ padding: "24px 6px", color: "#9f8457", fontWeight: 600 }}>No service in the selected range.</div>
              ) : (
                serviceMetricCategories.map((category) => {
                  const topService = category.topService;

                  return (
                    <div
                      key={category.category}
                      style={{
                        borderRadius: 16,
                        border: "1px solid rgba(152, 143, 129, 0.35)",
                        background: "rgba(255, 255, 255, 0.02)",
                        padding: "12px 14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <h4 style={{ margin: 0, color: "var(--color-white)", fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{category.category}</h4>
                        {topService ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "6px 10px",
                              borderRadius: 999,
                              background: "rgba(221, 144, 29, 0.12)",
                              border: "1px solid rgba(221, 144, 29, 0.18)",
                              color: "var(--color-white)",
                              fontSize: 12,
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span>{topService.name}</span>
                            <span style={{ color: "#c9ab7b", fontWeight: 700 }}>x{topService.count}</span>
                          </span>
                        ) : (
                          <span style={{ color: "#9f8457", fontSize: 12, fontWeight: 600 }}>No bookings yet</span>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <section
          className="dash-stat-card no-hover"
          style={{
            width: "100%",
            minHeight: 360,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginTop: 16,
            background: "linear-gradient(180deg, rgba(221, 144, 29, 0.05) 0%, rgba(221, 144, 29, 0.02) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h3 className="dash-stats-set-title">Report Graph</h3>
              <p style={{ margin: "6px 0 0", color: "#c9ab7b", fontSize: 12, fontWeight: 600 }}>{selectionLabel}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: "#c9ab7b", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(221, 144, 29, 0.18)", background: "rgba(255, 255, 255, 0.02)" }}>{reportGraphModeLabel}</span>
            </div>
          </div>

          <div
            ref={graphChartRef}
            style={{
              flex: 1,
              minHeight: 260,
              borderRadius: 18,
              border: "1px solid rgba(152, 143, 129, 0.35)",
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))",
              padding: 18,
              position: "relative",
              overflow: "visible",
            }}
          >
            {weeklyGraphLoading ? (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#9f8457", fontWeight: 600 }}>
                Loading report graph...
              </div>
            ) : weeklyGraphError ? (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#c08a4d", fontWeight: 600 }}>
                {weeklyGraphError}
              </div>
            ) : weeklyGraph.length === 0 ? (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#9f8457", fontWeight: 600 }}>
                No report data available.
              </div>
            ) : (
              <div style={{ position: "relative", width: "100%", height: reportGraphHeight, margin: "0 auto" }}>
                <svg width="100%" height={reportGraphHeight} viewBox={`0 0 ${reportGraphWidth} ${reportGraphHeight}`} role="img" aria-label="Selected range report line graph">
                    <defs>
                      <linearGradient id="report-appointments-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#dd901d" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#dd901d" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="report-walkins-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#e85d75" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#e85d75" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {Array.from({ length: 4 }).map((_, index) => {
                      const y = reportGraphPadding.top + (reportGraphPlotHeight * (index / 3));
                      const labelValue = Math.round(reportGraphMaxValue * (1 - (index / 3)));

                      return (
                        <g key={`grid-${index}`}>
                          <line x1={reportGraphPadding.left} y1={y} x2={reportGraphWidth - reportGraphPadding.right} y2={y} stroke="rgba(152, 143, 129, 0.18)" strokeDasharray="4 6" />
                          <text x={14} y={y + 4} fill="#9f8457" fontSize="10" fontWeight="600">{labelValue}</text>
                        </g>
                      );
                    })}

                    <path d={buildGraphAreaPath(appointmentGraphPoints)} fill="url(#report-appointments-area)" />
                    <path d={buildGraphAreaPath(walkInGraphPoints)} fill="url(#report-walkins-area)" />

                    <path d={buildGraphPath(appointmentGraphPoints)} fill="none" stroke="#dd901d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={buildGraphPath(walkInGraphPoints)} fill="none" stroke="#e85d75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {appointmentGraphPoints.map((point, index) => (
                      <g key={`appointment-point-${point.entry?.date || index}`}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="5"
                          fill="#dd901d"
                          stroke="rgba(17, 12, 6, 0.9)"
                          strokeWidth="2"
                          onMouseEnter={() => handleGraphPointHover(point, reportGraphSeries[0])}
                          onMouseLeave={() => setHoveredTower(null)}
                          style={{ cursor: "pointer" }}
                        />
                      </g>
                    ))}

                    {walkInGraphPoints.map((point, index) => (
                      <g key={`walkin-point-${point.entry?.date || index}`}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="5"
                          fill="#e85d75"
                          stroke="rgba(17, 12, 6, 0.9)"
                          strokeWidth="2"
                          onMouseEnter={() => handleGraphPointHover(point, reportGraphSeries[1])}
                          onMouseLeave={() => setHoveredTower(null)}
                          style={{ cursor: "pointer" }}
                        />
                      </g>
                    ))}

                    {weeklyGraph.map((dayEntry, index) => {
                      const x = reportGraphPadding.left + (index * reportGraphXStep);
                      const axisLabel = weeklyGraphMode === "weekly" ? dayEntry.label : dayEntry.label;
                      const axisSubLabel = weeklyGraphMode === "weekly" ? dayEntry.rangeLabel : dayEntry.monthDay;

                      return (
                        <g key={`axis-${dayEntry.date || index}`}>
                          <text x={x} y={reportGraphHeight - 26} fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">{axisLabel}</text>
                          <text x={x} y={reportGraphHeight - 10} fill="#9f8457" fontSize="10" fontWeight="600" textAnchor="middle">{axisSubLabel}</text>
                        </g>
                      );
                    })}
                </svg>

                {hoveredTower ? (
                  <div
                    style={{
                      position: "absolute",
                      left: `${Math.min(95, Math.max(5, (hoveredTower.x / reportGraphWidth) * 100))}%`,
                      top: Math.max(10, hoveredTower.y - 14),
                      transform: "translateY(-100%)",
                      background: "rgba(17, 12, 6, 0.96)",
                      border: `1px solid ${hoveredTower.color}`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      minWidth: 150,
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.22)",
                      zIndex: 50,
                      pointerEvents: "none",
                    }}
                  >
                    <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 700 }}>{hoveredTower.title}</p>
                    <p style={{ margin: "2px 0 0", color: "#c9ab7b", fontSize: 12, fontWeight: 600 }}>{hoveredTower.rangeLabel}</p>
                    <p style={{ margin: "4px 0 0", color: hoveredTower.color, fontSize: 16, fontWeight: 800 }}>{hoveredTower.value}</p>
                    <p style={{ margin: "6px 0 0", color: "#c9ab7b", fontSize: 11, fontWeight: 600 }}>
                      Revenue: {formatRevenueValue(hoveredTower.revenue)}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

      </div>

          {/* Weekly graph lives on the left; service metrics stay on the right */}
    </DashboardShell>
  );
}