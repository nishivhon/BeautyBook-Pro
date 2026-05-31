import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3v10m0 0l4-4m-4 4l-4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// LIVE DATA FETCH
// ═══════════════════════════════════════════════════════════════════

const fetchCustomerHistory = async (staffName, range) => {
  try {
    const qs = new URLSearchParams({ staffName: staffName || '', range: range || 'today' });
    const res = await fetch(`/api/staffs/read/customer-history?${qs.toString()}`);
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = payload?.error || `HTTP ${res.status}`;
      return { data: null, error: String(msg) };
    }
    return { data: payload.data || [], error: null };
  } catch (err) {
    console.error('[CustomerHistory] Fetch error:', err);
    return { data: null, error: String(err.message || err) };
  }
};

const formatServiceExportValue = (item) => {
  if (!item) return '';

  if (typeof item === 'string') return item;

  if (Array.isArray(item)) {
    return item
      .map((service) => {
        if (!service) return null;
        if (typeof service === 'string') return service;
        const name = service.name || service.title || service.service || '';
        return name || null;
      })
      .filter(Boolean)
      .join(', ');
  }

  if (typeof item === 'object') {
    const name = item.name || item.title || item.service || '';
    return name;
  }

  return String(item);
};

const normalizeExportServices = (servicesValue) => {
  if (!servicesValue) return '';

  if (typeof servicesValue === 'string') {
    try {
      return formatServiceExportValue(JSON.parse(servicesValue));
    } catch (error) {
      return servicesValue;
    }
  }

  return formatServiceExportValue(servicesValue);
};

const formatDateTimeForExport = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export const CustomerHistoryModal = ({ isOpen, onClose, staffName = null }) => {
  const [filterType, setFilterType] = useState('today');
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const result = await fetchCustomerHistory(staffName, filterType);
      if (cancelled) return;
      if (result.error) {
        setHistory([]);
        setError(result.error);
      } else {
        setHistory(result.data || []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [isOpen, staffName, filterType]);

  const handleExport = () => {
    if (!history.length || exporting) return;

    setExporting(true);

    try {
      const appointmentRows = [];
      const walkInRows = [];

      history.forEach((item) => {
        const source = item.source === 'slot' ? 'appointment' : item.source;
        const raw = item.raw || {};
        const serviceValue = normalizeExportServices(raw.services || item.services || item.service || '');
        const customerName = item.customer || raw.customer_name || raw.client_name || '';
        const customerContact = item.contact || raw.customer_contact || raw.client_phone || raw.client_contact || '';
        const hasRealAppointmentData = Boolean(
          customerName ||
          customerContact ||
          serviceValue ||
          item.amount ||
          raw.total_price ||
          raw.price ||
          String(item.status || raw.status || '').trim()
        );

        if (source === 'walkin') {
          walkInRows.push({
            date: item.date || raw.date || '',
            customer_name: item.customer || raw.customer_name || raw.client_name || '',
            assigned_staff: item.staff || raw.assigned_staff || '',
            services: serviceValue,
            created_at: formatDateTimeForExport(raw.created_at || raw.createdAt || ''),
          });
          return;
        }

        if (!hasRealAppointmentData) return;

        appointmentRows.push({
          date: item.date || raw.date || raw.slot_date || raw.slotDate || '',
          time_slot: item.time || raw.time_slot || raw.time || '',
          customer_name: customerName,
          customer_contact: customerContact,
          assigned_staff: item.staff || raw.assigned_staff || '',
          services: serviceValue,
          status: item.status || raw.status || '',
          total_price: item.amount ?? raw.total_price ?? raw.price ?? '',
          reminder_sent: raw.reminder_sent ?? '',
        });
      });

      const appointmentHeaders = [
        'date',
        'time_slot',
        'customer_name',
        'customer_contact',
        'assigned_staff',
        'services',
        'status',
        'total_price',
        'reminder_sent',
      ];

      const walkInHeaders = [
        'date',
        'created_at',
        'customer_name',
        'assigned_staff',
        'services',
      ];

      const appointmentWorkbookRows = [
        appointmentHeaders,
        ...appointmentRows.map((row) => appointmentHeaders.map((header) => row[header] ?? '')),
      ];
      const walkInWorkbookRows = [
        walkInHeaders,
        ...walkInRows.map((row) => walkInHeaders.map((header) => row[header] ?? '')),
      ];

      const workbook = XLSX.utils.book_new();
      const appointmentSheet = XLSX.utils.aoa_to_sheet(appointmentWorkbookRows);
      const walkInSheet = XLSX.utils.aoa_to_sheet(walkInWorkbookRows);

      const appointmentLastRow = Math.max(appointmentWorkbookRows.length, 2);
      const walkInLastRow = Math.max(walkInWorkbookRows.length, 2);

      appointmentSheet['!autofilter'] = { ref: `A1:I${appointmentLastRow}` };
      walkInSheet['!autofilter'] = { ref: `A1:E${walkInLastRow}` };

      XLSX.utils.book_append_sheet(workbook, appointmentSheet, 'Appointments');
      XLSX.utils.book_append_sheet(workbook, walkInSheet, 'Walk-ins');

      const fileName = `customer-history-${filterType}-${staffName ? staffName.replace(/\s+/g, '_') : 'all'}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif"
    }}
    onClick={onClose}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        width: "90%",
        maxWidth: "700px",
        height: "80vh",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(221, 144, 29, 0.2)",
        display: "flex",
        flexDirection: "column"
      }}
      onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#f5f5f5",
              margin: 0
            }}>Customer History</h2>
            <p style={{ margin: 0, color: '#988f81', fontSize: '13px' }}>
              Exported view matches the selected {filterType} range.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleExport}
              disabled={loading || exporting || !history.length}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: loading || exporting || !history.length ? 'rgba(221, 144, 29, 0.18)' : '#dd901d',
                border: 'none',
                borderRadius: '8px',
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: '700',
                cursor: loading || exporting || !history.length ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease'
              }}
            >
              <DownloadIcon size={16} color="currentColor" />
              {exporting ? 'Exporting...' : 'Export Excel'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#988f81",
                transition: "color 0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.color = "#dd901d"}
              onMouseOut={(e) => e.target.style.color = "#988f81"}
            >
              <CloseIcon size={20} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div style={{
          position: "relative",
          marginBottom: "24px"
        }}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "rgba(26, 15, 0, 0.5)",
              border: "1px solid rgba(221, 144, 29, 0.3)",
              borderRadius: "8px",
              color: "#f5f5f5",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
              e.target.style.backgroundColor = "rgba(26, 15, 0, 0.7)";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
              e.target.style.backgroundColor = "rgba(26, 15, 0, 0.5)";
            }}
          >
            <span>
              {filterType === "all" && "All Time"}
              {filterType === "today" && "Today"}
              {filterType === "week" && "This Week"}
              {filterType === "month" && "This Month"}
            </span>
            <ChevronDownIcon size={16} color="#dd901d" />
          </button>

          {filterOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              marginTop: '8px',
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(221, 144, 29, 0.3)',
              borderRadius: '8px',
              overflow: 'hidden',
              zIndex: 10,
              minWidth: '150px'
            }}>
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setFilterType(value);
                    setFilterOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: filterType === value ? 'rgba(221, 144, 29, 0.2)' : 'transparent',
                    border: 'none',
                    color: filterType === value ? '#dd901d' : '#f5f5f5',
                    fontSize: '14px',
                    fontWeight: filterType === value ? '600' : '500',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer History List */}
        <div className="customer-history-scroll" style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingRight: "8px"
        }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <p style={{ fontSize: '14px', color: '#988f81' }}>Loading...</p>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <p style={{ fontSize: '14px', color: '#fca5a5' }}>Error: {error}</p>
            </div>
          ) : history && history.length > 0 ? (
            (() => {
              const visibleHistory = (history || []).filter((item) => item && (item.staff || item.raw?.assigned_staff));

              if (visibleHistory.length === 0) {
                return (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                    <p style={{ fontSize: '14px', color: '#988f81' }}>No customer history found</p>
                  </div>
                );
              }

              return visibleHistory.map((item) => {
                const id = item.id;
                const customerName = item.customer || item.raw?.customer_name || item.raw?.client_name || 'Unknown';
                const date = item.date || '';
                const time = item.time || '';
                const service = typeof item.serviceSummary === 'string'
                  ? item.serviceSummary
                  : (typeof item.service === 'string' ? item.service : (item.raw?.services ? JSON.stringify(item.raw.services) : 'Service'));
                const amount = item.amount !== null && item.amount !== undefined ? `₱${Number(item.amount).toFixed(2)}` : '-';
                const stylist = item.staff || item.raw?.assigned_staff || '-';
                const phone = item.contact || item.raw?.customer_contact || item.raw?.client_phone || '';
                const email = item.raw?.customer_email || item.raw?.client_email || '';

                return (
                  <div key={id}>
                    <button
                      onClick={() => setExpandedCustomer(expandedCustomer === id ? null : id)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: 'rgba(26, 15, 0, 0.5)',
                        border: '1px solid rgba(221, 144, 29, 0.3)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(221, 144, 29, 0.6)';
                        e.currentTarget.style.backgroundColor = 'rgba(26, 15, 0, 0.7)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(221, 144, 29, 0.3)';
                        e.currentTarget.style.backgroundColor = 'rgba(26, 15, 0, 0.5)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#dd901d', margin: 0 }}>{customerName}</p>
                            <span style={{ fontSize: '11px', color: '#1a1a1a', backgroundColor: '#dd901d', padding: '4px 8px', borderRadius: '999px', fontWeight: 700 }}>
                              {item.source === 'appointment' ? 'Appointment' : item.source === 'walkin' ? 'Walk-in' : (item.source || 'Entry')}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#988f81', margin: '0 0 4px 0' }}>{date} • {time}</p>
                          <p style={{ fontSize: '13px', color: '#f5f5f5', margin: '0' }}>{service} • {amount}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '13px', color: '#dd901d', margin: '0', fontWeight: '600' }}>{item.status || ''}</p>
                        </div>
                      </div>
                    </button>

                    {expandedCustomer === id && (
                      <div style={{ backgroundColor: 'rgba(221, 144, 29, 0.05)', borderLeft: '3px solid #dd901d', padding: '16px', borderRadius: '6px', marginTop: '8px', marginBottom: '8px' }}>
                        {/* Receipt Section Only */}
                        <div style={{ background: '#11100d', borderRadius: '8px', padding: '18px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', color: '#f5f1eb' }}>
                          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                            <div style={{ fontWeight: 700, fontSize: '18px', color: '#dd901d' }}>Receipt</div>
                            <div style={{ fontSize: '12px', color: '#988f81' }}>Booking Summary</div>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#988f81', marginBottom: '2px' }}>Customer</div>
                            <div style={{ fontWeight: 600 }}>{customerName}</div>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#988f81', marginBottom: '2px' }}>Date</div>
                            <div style={{ fontWeight: 600 }}>{date} {time && `• ${time}`}</div>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#988f81', marginBottom: '2px' }}>Service</div>
                            <div style={{ fontWeight: 600 }}>{service}</div>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#988f81', marginBottom: '2px' }}>Amount</div>
                            <div style={{ fontWeight: 600 }}>{amount}</div>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#988f81', marginBottom: '2px' }}>Stylist</div>
                            <div style={{ fontWeight: 600 }}>{stylist}</div>
                          </div>
                          {item.status && (
                            <div style={{ marginBottom: '10px' }}>
                              <div style={{ fontSize: '13px', color: '#988f81', marginBottom: '2px' }}>Status</div>
                              <div style={{ fontWeight: 600 }}>{item.status}</div>
                            </div>
                          )}
                          {item.id && (
                            <div style={{ marginBottom: '10px' }}>
                              <div style={{ fontSize: '13px', color: '#988f81', marginBottom: '2px' }}>Reference No.</div>
                              <div style={{ fontWeight: 600 }}>{item.id}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <p style={{ fontSize: '14px', color: '#988f81' }}>No customer history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistoryModal;
