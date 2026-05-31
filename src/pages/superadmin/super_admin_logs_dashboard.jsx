import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { databaseAPI } from "../../services/databaseApi";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import DatabaseTableModal from "../../components/modal/superadmin/DatabaseTableModal";
import { useToast } from "../../components/toast";
import { SUPER_ADMIN_NAV_ITEMS } from "../../components/superadmin/superAdminDashboardIcons";
import DateRangePicker from "../../components/shared/DateRangePicker";
import * as XLSX from 'xlsx';

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="3.5" stroke="#000" strokeWidth="2"/>
    <circle cx="7" cy="15" r="3.5" stroke="#000" strokeWidth="2"/>
    <path d="M9.8 8.8l7 7M9.8 13.2L17 6.2" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DashboardIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
    <rect x="10" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6"/>
  </svg>
);

const UserIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5.5" r="3.5" stroke={color} strokeWidth="1.6"/>
    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const DatabaseIcon = ({ color = "currentColor" }) => (
  <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="9" cy="4.5" rx="6" ry="2.5" stroke={color} strokeWidth="1.6"/>
    <path d="M3 4.5v9C3 15.09 5.686 17 9 17s6-1.91 6-3.5v-9" stroke={color} strokeWidth="1.6"/>
    <path d="M3 9c0 1.657 2.686 3 6 3s6-1.343 6-3" stroke={color} strokeWidth="1.6"/>
  </svg>
);

const ShieldIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 1.5L3 4v5.5C3 13.09 5.686 16.3 9 17c3.314-.7 6-3.91 6-7.5V4L9 1.5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M6.5 9l1.75 1.75L11.5 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TagIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.293 10.293l-7.586-7.586A1 1 0 008.586 2H4a2 2 0 00-2 2v4.586a1 1 0 00.293.707l7.586 7.586a2 2 0 002.828 0l4.586-4.586a2 2 0 000-2.828z" stroke={color} strokeWidth="1.5"/>
    <circle cx="6.5" cy="6.5" r="1.5" fill={color} />
  </svg>
);

const GlobeIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.6"/>
    <path d="M9 2C9 2 7 5 7 9s2 7 2 7M9 2c0 0 2 3 2 7s-2 7-2 7M2 9h14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const LogOutIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 15H3.5A1.5 1.5 0 012 13.5v-9A1.5 1.5 0 013.5 3H7" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M12 12l4-3-4-3M16 9H7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1a5 5 0 00-5 5v3l-1.5 2.5h13L13 9V6a5 5 0 00-5-5z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M6.5 15.5a1.5 1.5 0 003 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.5" cy="8.5" r="2.5" stroke="white" strokeWidth="1.6"/>
    <path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3.05 3.05l1.41 1.41M12.54 12.54l1.41 1.41M3.05 13.95l1.41-1.41M12.54 4.46l1.41-1.41" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const ViewIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="6.5" cy="6.5" rx="5.5" ry="3.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
  </svg>
);

const SearchIcon = ({ color = "#988f81" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="5.5" stroke={color} strokeWidth="1.3" opacity="0.6"/>
    <line x1="11.5" y1="11.5" x2="16" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

// ─── Navigation Items ─────────────────────────────────────────────────────

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminLogsDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeNav, setActiveNav] = useState("logs");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTable, setModalTable] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
    const [currentLogsPage, setCurrentLogsPage] = useState(1);
    const rowsPerPage = 4;

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use fixed row height for consistency and dynamic rowsPerPage to prevent overflow/gaps
    // Pages show 4 rows each (fixed)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Fetch appointment_logs table on mount
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        console.log('[Logs] Fetching appointment_logs table...');
        const tablesInfo = await databaseAPI.getTablesInfo(['appointment_logs']);
        
        if (tablesInfo && Array.isArray(tablesInfo)) {
          console.log('[Logs] Fetched tables info:', tablesInfo);
          
          const tableInfo = tablesInfo[0];
          if (!tableInfo) return;
          
          // Get column names and filter out hidden columns
          let colNames = tableInfo.columns?.map(col => col.column_name) || [];
          const hiddenColumns = ['availability', 'status', 'archived_at'];
          colNames = colNames.filter(col => !hiddenColumns.includes(col));
          
          // Fetch actual data sorted by date descending
          let rowData = [];
          try {
            const dataResult = await databaseAPI.getTableData('appointment_logs', 10000, 0, 'date', 'desc');
            rowData = dataResult.data || [];
            
            // Secondary sort: within each date, sort by time_slot ascending
            rowData = rowData.sort((a, b) => {
              // First sort by date descending
              const dateA = new Date(a.date || 0);
              const dateB = new Date(b.date || 0);
              if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime();
              }
              
              // Within same date, sort by time_slot ascending
              const timeA = a.time_slot || '';
              const timeB = b.time_slot || '';
              return timeA.localeCompare(timeB);
            });
            
            // Remove hidden columns from each row
            rowData = rowData.map(row => {
              hiddenColumns.forEach(hiddenCol => {
                delete row[hiddenCol];
              });
              return row;
            });
            
            console.log(`[Logs] Fetched ${rowData.length} rows`);
          } catch (dataError) {
            console.warn(`[Logs] Error fetching data:`, dataError);
          }
          
          setLogsData({
            id: 'appointment_logs',
            name: 'Appointment Logs',
            meta: `${tableInfo.rowCount} rows`,
            lastUpdated: 'Today',
            rows: rowData,
            cols: colNames,
          });
        }
      } catch (error) {
        console.error('[Logs] Error fetching data:', error);
        showToast({ message: 'Failed to fetch appointment logs', type: 'error', duration: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  // Format cell display value, especially for JSON services
  const formatCellValue = (cellValue, colName) => {
    if (typeof cellValue === 'boolean') {
      return String(cellValue);
    }
    
    // Parse JSON services if it's the services column
    if (colName === 'services' && cellValue && typeof cellValue === 'string') {
      try {
        const services = JSON.parse(cellValue);
        if (Array.isArray(services)) {
          return services.map(s => s.name || s).join(', ');
        }
      } catch (e) {
        // If not valid JSON, return as is
      }
    }
    
    return cellValue || '';
  };

  // Format column names for display
  const formatColumnName = (colName) => {
    const columnMap = {
      'time_slot': 'time slot',
      'customer_name': 'customer name',
      'customer_contact': 'customer contact',
      'assigned_staff': 'assigned staff'
    };
    return columnMap[colName] || colName;
  };

  const openViewModal = () => {
    setModalTable(logsData);
    setModalMode("view");
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    setShowModal(false);
    showToast({ message: 'Changes saved.', type: 'success', duration: 2800 });
  };

  const handleExportLogs = () => {
    const rows = logsData.rows;
    const cols = logsData.cols;
    if (!rows?.length || !cols?.length) {
      showToast({ message: 'No logs to export', type: 'warning', duration: 2800 });
      return;
    }

    const escapeCsv = (value) => {
      const str = String(value ?? '');
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerLine = cols.map((col) => escapeCsv(formatColumnName(col))).join(',');
    const dataLines = rows.map((row) =>
      cols.map((col) => escapeCsv(formatCellValue(row[col], col))).join(',')
    );
    const csv = [headerLine, ...dataLines].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast({ message: `Exported ${rows.length} logs`, type: 'success', duration: 2800 });
  };

  const [exportPickerOpen, setExportPickerOpen] = useState(false);

  const handleExportWithRange = (range) => {
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    end.setHours(23, 59, 59, 999);

    const rows = logsData.rows || [];
    const cols = logsData.cols || [];
    const filtered = rows.filter(r => {
      const v = r.date || r.created_at || r.date;
      const d = v ? new Date(v) : null;
      if (!d || Number.isNaN(d.getTime())) return false;
      return d >= start && d <= end;
    });

    if (!filtered.length) {
      showToast({ message: 'No logs in selected range', type: 'warning', duration: 2800 });
      setExportPickerOpen(false);
      return;
    }

    const rowsOut = [];
    rowsOut.push(['Date Range', `${range.startDate} to ${range.endDate}`]);
    const header = cols.map(col => formatColumnName(col));
    rowsOut.push(header);
    filtered.forEach(row => {
      rowsOut.push(cols.map(col => {
        const v = formatCellValue(row[col], col);
        return v ?? '';
      }));
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rowsOut);
    // set reasonable column widths
    worksheet['!cols'] = cols.map(() => ({ wch: 20 }));

    // apply autofilter on header row (which is row 2)
    const lastColIndex = cols.length - 1;
    const colToLetter = (n) => {
      let s = '';
      while (n >= 0) { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; }
      return s;
    };
    const lastColLetter = colToLetter(lastColIndex);
    const totalDataRows = filtered.length;
    const endRow = 2 + totalDataRows; // header row is 2, data starts at 3
    worksheet['!autofilter'] = { ref: `A2:${lastColLetter}${endRow}` };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointment Logs');
    const filename = `appointment-logs-${range.startDate}-to-${range.endDate}.xlsx`;
    XLSX.writeFile(workbook, filename);
    showToast({ message: `Exported ${filtered.length} logs`, type: 'success', duration: 2800 });
    setExportPickerOpen(false);
  };

  return (
    <DashboardShell
      navItems={SUPER_ADMIN_NAV_ITEMS}
      activeNav={activeNav}
      roleLabel="Super Administrator"
      roleInitial="S"
      showSidebarHeader={false}
      title="Appointment Logs"
      subtitle="BeautyBook Pro • View and manage all appointment logs"
      profile={null}
      notifications={[]}
      useSuperAdminHeaderActions={true}
      superAdminNoNotificationsMessage="No recent system log alerts requiring super admin action."
      storageKey="superadminSidebarExpanded"
      onLogoutConfirm={handleLogout}
      logoutTitle="Log Out?"
      logoutMessage="Are you sure you want to log out?"
      logoutConfirmText="Yes, Log Out"
      logoutCancelText="Stay Logged In"
    >
        {/* ─── SIDEBAR & HEADER HANDLED BY DASHBOARDSHELL ─── */}

        <div className="superadmin-page-content" style={{ paddingTop: '20px' }}>
          <div className="dashboard-panel superadmin-fixed-panel">
            {/* Panel header with search and add button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="panel-title">All Appointment Logs ({logsData.rows?.length || 0})</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase();
                      if (value) {
                        console.log('[Logs] Searching for:', value);
                      }
                    }}
                    style={{
                      padding: '8px 12px 8px 32px',
                      borderRadius: '6px',
                      border: '1px solid rgba(152, 143, 129, 0.3)',
                      backgroundColor: 'rgba(35, 29, 26, 0.8)',
                      color: '#D4C5B9',
                      fontSize: '13px',
                      width: '200px',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(221, 144, 29, 0.5)';
                      e.currentTarget.style.backgroundColor = 'rgba(35, 29, 26, 0.95)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                      e.currentTarget.style.backgroundColor = 'rgba(35, 29, 26, 0.8)';
                    }}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setExportPickerOpen(true)}
                    disabled={loading || !logsData.rows?.length}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6B6157',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: loading || !logsData.rows?.length ? 'not-allowed' : 'pointer',
                      opacity: loading || !logsData.rows?.length ? 0.7 : 1,
                    }}
                    title={!logsData.rows?.length ? 'No logs to export' : 'Export logs as CSV'}
                  >
                    Export
                  </button>
                  <DateRangePicker open={exportPickerOpen} initialRange={null} onClose={() => setExportPickerOpen(false)} onConfirm={handleExportWithRange} />
                </div>
              </div>
            </div>

            {/* Logs Table View */}
            {loading ? (
              <div className="container-empty-state">Loading logs...</div>
            ) : logsData.rows && logsData.rows.length > 0 ? (
              <div style={{ marginTop: '0px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      {logsData.cols.map((col) => (
                        <th key={col} style={{ textAlign: 'left' }}>{formatColumnName(col)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const itemsPerPage = rowsPerPage || 7;
                      const totalRows = logsData.rows.length;
                      const totalPages = Math.ceil(totalRows / itemsPerPage);
                      // Only the last page can have fewer than itemsPerPage rows
                      let startIdx = (currentLogsPage - 1) * itemsPerPage;
                      let endIdx = startIdx + itemsPerPage;
                      // If not last page, always fill up to itemsPerPage
                      if (currentLogsPage < totalPages) {
                        endIdx = startIdx + itemsPerPage;
                      } else {
                        endIdx = totalRows;
                      }
                      return logsData.rows.slice(startIdx, endIdx).map((log, idx) => (
                        <tr key={idx} className="db-row" style={{ minHeight: 80, height: 80 }}>
                          {logsData.cols.map((col) => {
                            const cellValue = log[col];
                            const displayValue = formatCellValue(cellValue, col);
                            return (
                              <td key={col} style={{ fontSize: '13px', whiteSpace: 'normal', wordBreak: 'break-word', padding: '12px 8px', minHeight: 80, height: 80, verticalAlign: 'middle' }}>{displayValue}</td>
                            );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
                {logsData.rows.length > 0 && (() => {
                  const itemsPerPage = rowsPerPage || 7;
                  const totalPages = Math.ceil(logsData.rows.length / itemsPerPage);
                  const startIdx = (currentLogsPage - 1) * itemsPerPage + 1;
                  const endIdx = Math.min(currentLogsPage * itemsPerPage, logsData.rows.length);
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(152, 143, 129, 0.2)' }}>
                      <div style={{ color: '#988f81', fontSize: '13px' }}>
                        Showing {startIdx}–{endIdx} of {logsData.rows.length} logs
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setCurrentLogsPage(p => Math.max(1, p - 1))}
                          disabled={currentLogsPage === 1}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentLogsPage === 1 ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentLogsPage === 1 ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentLogsPage === 1 ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentLogsPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentLogsPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          ← Previous
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#988f81', fontSize: '13px' }}>
                          Page {currentLogsPage} of {totalPages}
                        </div>
                        <button
                          onClick={() => setCurrentLogsPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentLogsPage === totalPages}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentLogsPage === totalPages ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentLogsPage === totalPages ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentLogsPage === totalPages ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentLogsPage !== totalPages) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentLogsPage !== totalPages) {
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
              </div>
            ) : (
              <div className="container-empty-state">No appointment logs found</div>
            )}
            </div>
          </div>

          {/* ─── MODAL ─── */}
      <DatabaseTableModal
        showModal={showModal}
        modalTable={modalTable}
        modalMode={modalMode}
        setShowModal={setShowModal}
        handleSaveChanges={handleSaveChanges}
      />
    </DashboardShell>
  );
}
