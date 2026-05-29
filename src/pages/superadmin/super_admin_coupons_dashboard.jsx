import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";
import { ToastViewport, useToast } from "../../components/toast";
import { logoutOperator } from "../../services/operatorAuth";

// Tag icon (Heroicons outline style)
const TagIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.293 10.293l-7.586-7.586A1 1 0 008.586 2H4a2 2 0 00-2 2v4.586a1 1 0 00.293.707l7.586 7.586a2 2 0 002.828 0l4.586-4.586a2 2 0 000-2.828z" stroke={color} strokeWidth="1.5"/>
    <circle cx="6.5" cy="6.5" r="1.5" fill={color} />
  </svg>
);

const DashboardIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
    <rect x="10" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
    <rect x="1" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
    <rect x="10" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
  </svg>
);

const UserIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5.5" r="3.5" stroke={color} strokeWidth="1.6" />
    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const DatabaseIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="9" cy="4.5" rx="6" ry="2.5" stroke={color} strokeWidth="1.6" />
    <path d="M3 4.5v9C3 15.09 5.686 17 9 17s6-1.91 6-3.5v-9" stroke={color} strokeWidth="1.6" />
    <path d="M3 9c0 1.657 2.686 3 6 3s6-1.343 6-3" stroke={color} strokeWidth="1.6" />
  </svg>
);

const ShieldIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 1.5L3 4v5.5C3 13.09 5.686 16.3 9 17c3.314-.7 6-3.91 6-7.5V4L9 1.5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6.5 9l1.75 1.75L11.5 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FilterIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Status badge colors
const statusColors = {
  Active: { bg: "#27ae60", color: "#fff" },
  Inactive: { bg: "#6b6157", color: "#fff" },
  Expired: { bg: "#7f8c8d", color: "#fff" },
  Upcoming: { bg: "#f39c12", color: "#fff" },
  Deleted: { bg: "#8a6f5a", color: "#fff" },
  Disabled: { bg: "#e74c3c", color: "#fff" },
};

// Helper: format date as 'MMM DD, YYYY'
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

const normalizeCouponStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();
  if (!value) return "Active";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const normalizeCouponValueType = (valueType) => {
  const value = String(valueType || "").trim().toLowerCase();
  return value === "percentage" ? "Percentage" : "Fixed Amount";
};

// Sidebar nav items (copy from clients dashboard, add Coupons)
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon, path: "/superadmin/dashboard" },
  { id: "staff-management", label: "Staff Management", icon: UserIcon, path: "/superadmin/users" },
  { id: "clients", label: "Client Accounts", icon: DatabaseIcon, path: "/superadmin/clients" },
  { id: "coupons", label: "Coupons", icon: DatabaseIcon, path: "/superadmin/coupons" },
  { id: "logs", label: "Logs", icon: DatabaseIcon, path: "/superadmin/logs" },
  { id: "services", label: "Services", icon: DatabaseIcon, path: "/superadmin/services" },
  { id: "security", label: "Security", icon: ShieldIcon, path: "/superadmin/security" },
];

const STATUS_TABS = ["All", "Active", "Expired", "Upcoming", "Deleted"];

const ROWS_PER_PAGE = 7;
const TABLE_CELL_STYLE = { fontSize: 13, whiteSpace: 'normal', wordBreak: 'break-word', padding: '12px 8px' };
const TABLE_CHECKBOX_CELL_STYLE = { ...TABLE_CELL_STYLE, width: 40, textAlign: 'center' };

export default function SuperAdminCouponsDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeNav, setActiveNav] = useState("coupons");
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.getAttribute('data-theme') !== 'light');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCouponPage, setCurrentCouponPage] = useState(1);
  const [couponsData, setCouponsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("Active");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showBulkBar, setShowBulkBar] = useState(false);
  const [pendingBulkAction, setPendingBulkAction] = useState(null);
  const [isBulkMutating, setIsBulkMutating] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') !== 'light');
    };
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/coupons/read?includeDeleted=true');
        if (!response.ok) {
          throw new Error(`Failed to fetch coupons: ${response.status}`);
        }

        const body = await response.json();
        const rows = Array.isArray(body?.data) ? body.data : [];

        setCouponsData(rows.map((coupon) => ({
          id: coupon.id,
          code: coupon.code || '',
          valueType: normalizeCouponValueType(coupon.value_type || coupon.discount_type),
          value: coupon.value ?? 0,
          description: coupon.description || '—',
          startDate: coupon.start_date || coupon.created_at || null,
          endDate: coupon.end_date || null,
          maxUses: coupon.max_uses ?? 0,
          timesUsed: coupon.number_of_uses ?? 0,
          status: coupon.is_deleted ? 'Deleted' : normalizeCouponStatus(coupon.status),
          isDeleted: Boolean(coupon.is_deleted),
          createdAt: coupon.created_at || null,
          lastUpdated: coupon.updated_at || coupon.created_at || null,
        })));
      } catch (error) {
        console.error('[SuperAdminCoupons] Failed to fetch coupons:', error);
        setCouponsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Filtered coupons
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const filteredCoupons = couponsData.filter(coupon => {
    const isExpired = coupon.endDate && new Date(coupon.endDate) < todayStart;
    const isUpcoming = coupon.startDate && new Date(coupon.startDate) > todayStart;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Deleted"
        ? coupon.isDeleted
        : statusFilter === "Expired"
          ? isExpired && !coupon.isDeleted
          : statusFilter === "Upcoming"
            ? isUpcoming && !coupon.isDeleted
          : coupon.status === statusFilter);
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Checkbox logic
  const allSelected = filteredCoupons.length > 0 && filteredCoupons.every(c => selectedCoupons.has(c.id));
  const someSelected = selectedCoupons.size > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedCoupons(new Set());
    } else {
      setSelectedCoupons(new Set(filteredCoupons.map(c => c.id)));
    }
  };

  const handleSelectCoupon = (id) => {
    setSelectedCoupons(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id); else updated.add(id);
      return updated;
    });
  };

  const updateCouponsInState = (updatedCoupons) => {
    const updatedMap = new Map((updatedCoupons || []).map((coupon) => [coupon.id, coupon]));
    setCouponsData((prev) => prev.map((coupon) => updatedMap.get(coupon.id) || coupon));
  };

  // Bulk actions
  const handleBulkDelete = () => setPendingBulkAction("delete");
  const handleBulkDeactivate = () => setPendingBulkAction("deactivate");
  const handleBulkActivate = () => setPendingBulkAction("activate");

  const confirmBulkAction = async () => {
    if (!pendingBulkAction || selectedCoupons.size === 0) {
      setPendingBulkAction(null);
      return;
    }

    setIsBulkMutating(true);

    try {
      const couponIds = Array.from(selectedCoupons);
      const apiUrl = import.meta.env.VITE_API_URL || "";

      if (pendingBulkAction === "delete") {
        for (const couponId of couponIds) {
          const response = await fetch(`${apiUrl}/coupons/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: couponId }),
          });

          const body = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(body?.error || body?.details || `Failed to delete coupon ${couponId}`);
          }
        }

        setCouponsData((prev) => prev.filter((coupon) => !selectedCoupons.has(coupon.id)));
        showToast({ message: 'Selected coupons deleted', type: 'success', duration: 2200 });
      } else {
        const nextStatus = pendingBulkAction === "activate" ? "active" : "inactive";
        const updatedCoupons = [];

        for (const couponId of couponIds) {
          const response = await fetch(`${apiUrl}/coupons/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: couponId, status: nextStatus }),
          });

          const body = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(body?.error || body?.details || `Failed to update coupon ${couponId}`);
          }

          if (body?.data) {
            updatedCoupons.push({
              id: body.data.id,
              code: body.data.code || '',
              valueType: normalizeCouponValueType(body.data.value_type || body.data.discount_type),
              value: body.data.value ?? 0,
              description: body.data.description || '—',
              startDate: body.data.start_date || body.data.created_at || null,
              endDate: body.data.end_date || null,
              maxUses: body.data.max_uses ?? 0,
              timesUsed: body.data.number_of_uses ?? 0,
              status: normalizeCouponStatus(body.data.status),
              createdAt: body.data.created_at || null,
              lastUpdated: body.data.updated_at || body.data.created_at || null,
            });
          }
        }

        updateCouponsInState(updatedCoupons);
        showToast({
          message: pendingBulkAction === "activate" ? "Selected coupons activated" : "Selected coupons deactivated",
          type: 'success',
          duration: 2200,
        });
      }

      setSelectedCoupons(new Set());
      setPendingBulkAction(null);
    } catch (error) {
      console.error('[SuperAdminCoupons] Bulk action failed:', error);
      showToast({
        message: error.message || 'Failed to update coupons',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsBulkMutating(false);
    }
  };

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  // Table columns
  const columns = [
    { key: "select", label: "" },
    { key: "code", label: "Code" },
    { key: "valueType", label: "Value Type" },
    { key: "value", label: "Value" },
    { key: "description", label: "Description" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "maxUses", label: "Max Uses" },
    { key: "timesUsed", label: "Times Used" },
    { key: "status", label: "Status" },
  ];

  // Render
  return (
    <DashboardShell
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      roleLabel="Super Administrator"
      roleInitial="S"
      showSidebarHeader={false}
      title="Coupon Management"
      subtitle="BeautyBook Pro • Manage coupons and discounts"
      profile={null}
      notifications={[]}
      useSuperAdminHeaderActions={true}
      superAdminNoNotificationsMessage="No recent coupon notifications."
      storageKey="superadminSidebarExpanded"
      onLogoutConfirm={handleLogout}
      logoutTitle="Log Out?"
      logoutMessage="Are you sure you want to log out?"
      logoutConfirmText="Yes, Log Out"
      logoutCancelText="Stay Logged In"
    >
      <div className="superadmin-page-content" style={{ paddingTop: 20 }}>
        <div className="dashboard-panel superadmin-fixed-panel" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Header actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexShrink: 0 }}>
            <div className="panel-title">
              {searchQuery || statusFilter !== "All"
                ? `Search Results (${filteredCoupons.length})`
                : `All Coupons (${couponsData.length})`}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'nowrap', justifyContent: 'flex-end', overflowX: 'auto', maxWidth: 'min(100%, 720px)' }}>
              {selectedCoupons.size > 0 && (
                <>
                  <span style={{ color: '#988f81', fontSize: 13, whiteSpace: 'nowrap' }}>
                    {selectedCoupons.size} coupon{selectedCoupons.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    style={{
                      padding: '6px 14px',
                      background: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDeactivate}
                    style={{
                      padding: '6px 14px',
                      background: '#7f8c8d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkActivate}
                    style={{
                      padding: '6px 14px',
                      background: '#27ae60',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Activate
                  </button>
                  <div
                    aria-hidden
                    style={{ width: 1, height: 24, background: 'rgba(152, 143, 129, 0.35)', flexShrink: 0 }}
                  />
                </>
              )}
              {/* Search */}
              <input
                type="text"
                placeholder="Search by code or description..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSelectedCoupons(new Set());
                  setCurrentCouponPage(1);
                }}
                style={{
                  padding: '8px 12px 8px 32px',
                  borderRadius: 6,
                  border: '1px solid rgba(152, 143, 129, 0.3)',
                  backgroundColor: 'rgba(35, 29, 26, 0.8)',
                  color: '#D4C5B9',
                  fontSize: 13,
                  width: 200,
                  transition: 'all 0.2s',
                }}
              />
              {/* Export button */}
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6B6157',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'not-allowed',
                  opacity: 0.7,
                  position: 'relative',
                }}
                title="Coming Soon"
                disabled
              >
                Export
              </button>
              <div className="staff-filter-container" style={{ position: 'relative' }}>
                <button
                  className="staff-filter-btn"
                  aria-label="Filter"
                  onClick={() => setFilterOpen(!filterOpen)}
                  type="button"
                >
                  <FilterIcon size={15} color="currentColor" />
                </button>
                {filterOpen && (
                  <div className="staff-filter-dropdown" style={{ position: 'absolute', top: '110%', right: 0, zIndex: 10, minWidth: 180 }}>
                    {STATUS_TABS.filter(tab => tab !== 'All').map((status) => (
                      <button
                        key={status}
                        className={`staff-filter-option ${statusFilter === status ? 'active' : ''}`}
                        type="button"
                        onClick={() => {
                          setStatusFilter(status);
                          setSelectedCoupons(new Set());
                          setCurrentCouponPage(1);
                          setFilterOpen(false);
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ marginTop: 0, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {loading ? (
              <div className="container-empty-state">Loading coupon data...</div>
            ) : (
              <>
                <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', width: 40, padding: '12px 8px' }} />
                      {columns.slice(1).map(col => (
                        <th key={col.key} style={{ textAlign: 'left' }}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoupons.length > 0 ? (() => {
                      const startIdx = (currentCouponPage - 1) * ROWS_PER_PAGE;
                      const endIdx = startIdx + ROWS_PER_PAGE;
                      return filteredCoupons.slice(startIdx, endIdx).map((coupon) => (
                        <tr key={coupon.id} className="db-row">
                          <td style={TABLE_CHECKBOX_CELL_STYLE}>
                            <input
                              type="checkbox"
                              checked={selectedCoupons.has(coupon.id)}
                              onChange={() => handleSelectCoupon(coupon.id)}
                              style={{
                                cursor: 'pointer',
                                width: 18,
                                height: 18,
                                margin: 0,
                                accentColor: isDarkMode ? '#FFD700' : '#e91e63',
                                appearance: 'auto',
                              }}
                            />
                          </td>
                          <td style={TABLE_CELL_STYLE}>{coupon.code}</td>
                          <td style={TABLE_CELL_STYLE}>{coupon.valueType}</td>
                          <td style={TABLE_CELL_STYLE}>{coupon.valueType === 'Percentage' ? `${coupon.value}%` : `₱${coupon.value}`}</td>
                          <td style={TABLE_CELL_STYLE}>{coupon.description}</td>
                          <td style={TABLE_CELL_STYLE}>{formatDate(coupon.startDate)}</td>
                          <td style={TABLE_CELL_STYLE}>{formatDate(coupon.endDate)}</td>
                          <td style={TABLE_CELL_STYLE}>{!coupon.maxUses || coupon.maxUses === 0 ? 'Unlimited' : coupon.maxUses}</td>
                          <td style={TABLE_CELL_STYLE}>{coupon.timesUsed}</td>
                          <td style={TABLE_CELL_STYLE}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 10px',
                              borderRadius: 12,
                              fontWeight: 600,
                              fontSize: 12,
                              background: statusColors[coupon.status]?.bg || '#bbb',
                              color: statusColors[coupon.status]?.color || '#fff',
                              minWidth: 70,
                              textAlign: 'center',
                            }}>{coupon.status}</span>
                          </td>
                        </tr>
                      ));
                    })() : (
                      <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center', padding: 32, color: '#988f81', fontSize: 15 }}>
                          No coupons found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {filteredCoupons.length > 0 && (() => {
                  const totalPages = Math.ceil(filteredCoupons.length / ROWS_PER_PAGE);
                  const startIdx = (currentCouponPage - 1) * ROWS_PER_PAGE + 1;
                  const endIdx = Math.min(currentCouponPage * ROWS_PER_PAGE, filteredCoupons.length);
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(152, 143, 129, 0.2)', marginTop: 'auto' }}>
                      <div style={{ color: '#988f81', fontSize: '13px' }}>
                        Showing {startIdx}–{endIdx} of {filteredCoupons.length} coupons
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setCurrentCouponPage(p => Math.max(1, p - 1))}
                          disabled={currentCouponPage === 1}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentCouponPage === 1 ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentCouponPage === 1 ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentCouponPage === 1 ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (currentCouponPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentCouponPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          ← Previous
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#988f81', fontSize: '13px' }}>
                          Page {currentCouponPage} of {totalPages}
                        </div>
                        <button
                          onClick={() => setCurrentCouponPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentCouponPage === totalPages}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentCouponPage === totalPages ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentCouponPage === totalPages ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentCouponPage === totalPages ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (currentCouponPage !== totalPages) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentCouponPage !== totalPages) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
        <ConfirmationDialog
          isOpen={Boolean(pendingBulkAction)}
          title={pendingBulkAction === 'delete' ? 'Delete Coupons?' : pendingBulkAction === 'activate' ? 'Activate Coupons?' : 'Deactivate Coupons?'}
          message={pendingBulkAction === 'delete'
            ? `Are you sure you want to delete ${selectedCoupons.size} coupon${selectedCoupons.size > 1 ? 's' : ''}?`
            : pendingBulkAction === 'activate'
              ? `Are you sure you want to activate ${selectedCoupons.size} coupon${selectedCoupons.size > 1 ? 's' : ''}?`
              : `Are you sure you want to deactivate ${selectedCoupons.size} coupon${selectedCoupons.size > 1 ? 's' : ''}?`}
          confirmText={isBulkMutating ? 'Saving…' : pendingBulkAction === 'delete' ? 'Delete' : pendingBulkAction === 'activate' ? 'Activate' : 'Deactivate'}
          cancelText="Cancel"
          onConfirm={confirmBulkAction}
          onCancel={() => {
            if (!isBulkMutating) {
              setPendingBulkAction(null);
            }
          }}
        />
      </div>
      <ToastViewport />
    </DashboardShell>
  );
}
