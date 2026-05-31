import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { databaseAPI } from "../../services/databaseApi";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import DatabaseTableModal from "../../components/modal/superadmin/DatabaseTableModal";
import { useToast } from "../../components/toast";
import { SUPER_ADMIN_NAV_ITEMS } from "../../components/superadmin/superAdminDashboardIcons";

export default function SuperAdminWalkinLogsDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeNav, setActiveNav] = useState("walkin-logs");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTable, setModalTable] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [logsData, setLogsData] = useState({ rows: [], cols: [], id: null, name: '' });
  const [loading, setLoading] = useState(false);
  const [currentLogsPage, setCurrentLogsPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Fetch walk_in_logs table on mount
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        console.log('[WalkInLogs] Fetching walk_in_logs table...');
        const tablesInfo = await databaseAPI.getTablesInfo(['walk_in_logs']);

        if (tablesInfo && Array.isArray(tablesInfo)) {
          const tableInfo = tablesInfo[0];
          if (!tableInfo) return;

          let colNames = tableInfo.columns?.map(col => col.column_name) || [];
          const hiddenColumns = ['availability', 'updated_at'];
          colNames = colNames.filter(col => !hiddenColumns.includes(col));

          let rowData = [];
          try {
            const dataResult = await databaseAPI.getTableData('walk_in_logs', 10000, 0, 'created_at', 'desc');
            rowData = dataResult.data || [];

            rowData = rowData.map(row => {
              hiddenColumns.forEach(h => delete row[h]);
              return row;
            });

            console.log(`[WalkInLogs] Fetched ${rowData.length} rows`);
          } catch (dataError) {
            console.warn('[WalkInLogs] Error fetching data:', dataError);
          }

          setLogsData({
            id: 'walk_in_logs',
            name: 'Walk-in Logs',
            meta: `${tableInfo.rowCount} rows`,
            lastUpdated: 'Today',
            rows: rowData,
            cols: colNames,
          });
        }
      } catch (error) {
        console.error('[WalkInLogs] Error fetching data:', error);
        showToast({ message: 'Failed to fetch walk-in logs', type: 'error', duration: 3000 });
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

  const formatCellValue = (cellValue, colName) => {
    if (typeof cellValue === 'boolean') return String(cellValue);

    // If value is an array (e.g., services stored as array of objects)
    if (Array.isArray(cellValue)) {
      if (cellValue.length === 0) return '';
      // Prefer name/title fields when available
      return cellValue
        .map(item => {
          if (!item && item !== 0) return '';
          if (typeof item === 'string') return item;
          if (typeof item === 'object') return item.name || item.title || JSON.stringify(item);
          return String(item);
        })
        .join(', ');
    }

    // If value is an object (not an array), try to show a readable field or stringify
    if (cellValue && typeof cellValue === 'object') {
      return cellValue.name || cellValue.title || JSON.stringify(cellValue);
    }

    // If services column contains JSON string -> parse
    if (colName === 'services' && cellValue && typeof cellValue === 'string') {
      try {
        const services = JSON.parse(cellValue);
        if (Array.isArray(services)) return services.map(s => s?.name || s?.title || s).join(', ');
      } catch (e) {}
    }

    // Format created_at to show PHT 12-hour time only
    if (colName === 'created_at' && cellValue) {
      const m = String(cellValue).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
      if (m) {
        const [hh, mm] = m[2].split(':');
        let hour = Number(hh);
        const minute = mm;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        if (hour === 0) hour = 12;
        return `${hour}:${minute} ${ampm}`;
      }
      try {
        const d = new Date(cellValue);
        if (!Number.isNaN(d.getTime())) {
          return d.toLocaleString('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit', hour12: true });
        }
      } catch (e) {}
    }

    return cellValue ?? '';
  };

  const formatColumnName = (colName) => {
    const columnMap = {
      'customer_name': 'customer name',
      'customer_contact': 'customer contact',
      'assigned_staff': 'assigned staff',
      'created_at': 'created at'
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
      if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
      return str;
    };

    const headerLine = cols.map((col) => escapeCsv(formatColumnName(col))).join(',');
    const dataLines = rows.map((row) => cols.map((col) => escapeCsv(formatCellValue(row[col], col))).join(','));
    const csv = [headerLine, ...dataLines].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `walkin-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast({ message: `Exported ${rows.length} logs`, type: 'success', duration: 2800 });
  };

  return (
    <DashboardShell
      navItems={SUPER_ADMIN_NAV_ITEMS}
      activeNav={activeNav}
      roleLabel="Super Administrator"
      roleInitial="S"
      showSidebarHeader={false}
      title="Walk-in Logs"
      subtitle="BeautyBook Pro • View and manage all walk-in logs"
      profile={null}
      notifications={[]}
      useSuperAdminHeaderActions={true}
      superAdminNoNotificationsMessage="No recent walk-in alerts requiring super admin action."
      storageKey="superadminSidebarExpanded"
      onLogoutConfirm={handleLogout}
      logoutTitle="Log Out?"
      logoutMessage="Are you sure you want to log out?"
      logoutConfirmText="Yes, Log Out"
      logoutCancelText="Stay Logged In"
    >
      <div className="superadmin-page-content" style={{ paddingTop: '20px' }}>
        <div className="dashboard-panel superadmin-fixed-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div className="panel-title">All Walk-in Logs ({logsData.rows?.length || 0})</div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="Search logs..." style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(152, 143, 129, 0.3)', backgroundColor: 'rgba(35,29,26,0.8)', color: '#D4C5B9' }} />
              </div>
              <button type="button" onClick={handleExportLogs} disabled={loading || !logsData.rows?.length} style={{ padding: '8px 16px', backgroundColor: '#6B6157', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="container-empty-state">Loading walk-in logs...</div>
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
                    let startIdx = (currentLogsPage - 1) * itemsPerPage;
                    let endIdx = startIdx + itemsPerPage;
                    if (currentLogsPage < totalPages) endIdx = startIdx + itemsPerPage; else endIdx = totalRows;
                    return logsData.rows.slice(startIdx, endIdx).map((log, idx) => (
                      <tr key={idx} className="db-row" style={{ minHeight: 80, height: 80 }}>
                        {logsData.cols.map((col) => (
                          <td key={col} style={{ fontSize: '13px', whiteSpace: 'normal', wordBreak: 'break-word', padding: '12px 8px', minHeight: 80, height: 80, verticalAlign: 'middle' }}>{formatCellValue(log[col], col)}</td>
                        ))}
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
                    <div style={{ color: '#988f81', fontSize: '13px' }}>Showing {startIdx}–{endIdx} of {logsData.rows.length} logs</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setCurrentLogsPage(p => Math.max(1, p - 1))} disabled={currentLogsPage === 1} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(152, 143, 129, 0.3)', background: currentLogsPage === 1 ? 'rgba(152, 143, 129, 0.05)' : 'transparent', color: currentLogsPage === 1 ? '#6B6157' : '#988f81' }}>← Previous</button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#988f81', fontSize: '13px' }}>Page {currentLogsPage} of {totalPages}</div>
                      <button onClick={() => setCurrentLogsPage(p => Math.min(totalPages, p + 1))} disabled={currentLogsPage === totalPages} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(152, 143, 129, 0.3)', background: currentLogsPage === totalPages ? 'rgba(152, 143, 129, 0.05)' : 'transparent', color: currentLogsPage === totalPages ? '#6B6157' : '#988f81' }}>Next →</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="container-empty-state">No walk-in logs found</div>
          )}
        </div>

        <DatabaseTableModal
          showModal={showModal}
          modalTable={modalTable}
          modalMode={modalMode}
          setShowModal={setShowModal}
          handleSaveChanges={handleSaveChanges}
        />
      </div>
    </DashboardShell>
  );
}
