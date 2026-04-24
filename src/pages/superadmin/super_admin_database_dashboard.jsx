import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { databaseAPI } from "../../services/databaseApi";
import DatabaseTableModal from "../../components/modal/superadmin/DatabaseTableModal";

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

const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const BackupIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10a3 3 0 010-6 3.5 3.5 0 016.9 1A2.5 2.5 0 0110 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M7 8v4M5 10l2 2 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ViewIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="6.5" cy="6.5" rx="5.5" ry="3.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/>
  </svg>
);

const EditIconSmall = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 9L8.5 2.5l2 2L4 11H2V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <line x1="6.5" y1="4" x2="8.5" y2="6" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

// ─── Navigation Items ─────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "staff-management", label: "Staff Management", icon: UserIcon },
  { id: "database", label: "Database", icon: DatabaseIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
  { id: "landing-page", label: "Landing Page", icon: GlobeIcon },
];

// ─── Database Tables Data ───────────────────────────────────────────────────
// Tables are now fetched from the API at component mount

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminDatabaseDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("database");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTable, setModalTable] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [databaseTables, setDatabaseTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Persist sidebar state
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

  // Fetch services and appointment_logs tables on mount
  useEffect(() => {
    const fetchDatabaseTables = async () => {
      setLoading(true);
      try {
        console.log('[Dashboard] Fetching services and appointment_logs tables...');
        const tablesInfo = await databaseAPI.getTablesInfo(['services', 'appointment_logs']);
        
        if (tablesInfo && Array.isArray(tablesInfo)) {
          console.log('[Dashboard] Fetched tables info:', tablesInfo);
          
          // Convert fetched data to display format
          const fetchedTables = await Promise.all(
            tablesInfo.map(async (tableInfo) => {
              // Get column names from the columns data
              const colNames = tableInfo.columns?.map(col => col.column_name) || [];
              
              // Fetch actual data for this table
              let rowData = [];
              try {
                const dataResult = await databaseAPI.getTableData(tableInfo.name, 50, 0);
                rowData = dataResult.data || [];
                console.log(`[Dashboard] Fetched ${rowData.length} rows from ${tableInfo.name}`);
              } catch (dataError) {
                console.warn(`[Dashboard] Error fetching data for ${tableInfo.name}:`, dataError);
              }
              
              return {
                id: tableInfo.name,
                name: tableInfo.name.charAt(0).toUpperCase() + tableInfo.name.slice(1).replace(/_/g, ' '),
                meta: `${tableInfo.rowCount} rows`,
                lastUpdated: 'Today',
                rows: rowData,
                cols: colNames,
              };
            })
          );
          
          // Set the fetched tables
          setDatabaseTables(fetchedTables);
        }
      } catch (error) {
        console.error('[Dashboard] Error fetching tables:', error);
        displayToast('Failed to fetch database tables');
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseTables();
  }, []);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const openViewModal = (tableId) => {
    const table = databaseTables.find(t => t.id === tableId);
    setModalTable(table);
    setModalMode("view");
    setShowModal(true);
  };

  const openEditModal = (tableId) => {
    const table = databaseTables.find(t => t.id === tableId);
    setModalTable(table);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleExportAll = () => {
    displayToast('Exporting all tables as CSV…');
  };

  const handleBackup = () => {
    const time = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    displayToast(`Backup initiated — 03/30/26 · ${time}`);
  };

  const handleSaveChanges = () => {
    setShowModal(false);
    if (modalMode === 'edit') {
      displayToast('Changes saved.');
    }
  };

  return (
    <div className="super-admin-container">
      {/* ─── SIDEBAR ─── */}
      <aside className={`super-admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-16px)",
        transition: "all 0.5s ease"
      }}>
        <div className="sidebar-logo-section">
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="logo-toggle-btn"
            title="Toggle sidebar"
          >
            <div className="logo-badge">
              <LogoIcon />
            </div>
            {sidebarExpanded && <span className="brand-name">BeautyBook Pro</span>}
          </button>
        </div>

        {sidebarExpanded && (
          <div className="admin-badge-pill">
            <div className="admin-badge-circle">S</div>
            <span className="admin-badge-text">Super Administrator</span>
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "database") {
                    navigate("/superadmin/database");
                  } else if (item.id === "dashboard") {
                    navigate("/superadmin/dashboard");
                  } else if (item.id === "staff-management") {
                    navigate("/superadmin/users");
                  } else if (item.id === "security") {
                    navigate("/superadmin/security");
                  } else if (item.id === "landing-page") {
                    navigate("/superadmin/landing-page");
                  } else {
                    setActiveNav(item.id);
                    displayToast(`${item.label} section coming soon`);
                  }
                }}
                className={`nav-button ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <item.icon color={isActive ? "#000" : "currentColor"} />
                {sidebarExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-logout-section">
          <button className="logout-button" onClick={handleLogout} title="Log out">
            <LogOutIcon color="#988f81" />
            {sidebarExpanded && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="super-admin-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title-section">
            <h1 className="header-main-title">System Database</h1>
            <p className="header-subtitle">BeautyBook Pro • Saturday, Dec 7, 2024</p>
          </div>
          <div className="header-actions">
            <button className="header-action-btn" onClick={() => displayToast('No new notifications')}>
              <BellIcon />
              <span>Notifications</span>
            </button>
            <button className="header-action-btn" onClick={() => displayToast('Settings coming soon')}>
              <SettingsIcon />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-main">
          <div className="dashboard-panel">
            {/* Panel header */}
            <div className="panel-header">
              <div className="panel-title">Database Tables</div>
              <div className="table-controls">
                <button className="btn-ghost" onClick={handleExportAll}>
                  <ExportIcon />
                  Export All
                </button>
              </div>
            </div>

            {/* Database rows */}
            <div className="space-y-2 mt-2">
              {databaseTables.map((table) => (
                <div key={table.id} className="db-row">
                  <div className="db-icon">
                    <DatabaseIcon color="#4387ef" />
                  </div>
                  <div className="db-name-wrap">
                    <span className="db-name">{table.name}</span>
                    <span className="db-meta">{table.meta}</span>
                  </div>
                  <div className="db-updated">{table.lastUpdated}</div>
                  <div className="db-row-actions">
                    <button className="row-btn" onClick={() => openViewModal(table.id)}>
                      <ViewIcon />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className="stats-bar" style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', width: '100%', marginTop: '24px' }}>
              <div className="stat-card" style={{ flex: 1 }}>
                <span className="stat-value">28.3 MB</span>
                <span className="stat-label">Total size</span>
              </div>
              <div className="stat-card" style={{ flex: 1 }}>
                <span className="stat-value">7,236</span>
                <span className="stat-label">Total records</span>
              </div>
              <div className="stat-card" style={{ flex: 1 }}>
                <span className="stat-value">03/24/26 · 6:00 PM</span>
                <span className="stat-label">Last backup</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─── MODAL ─── */}
      <DatabaseTableModal
        showModal={showModal}
        modalTable={modalTable}
        modalMode={modalMode}
        setShowModal={setShowModal}
        handleSaveChanges={handleSaveChanges}
      />

      {/* ─── TOAST ─── */}
      {showToast && (
        <div className="toast show">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
