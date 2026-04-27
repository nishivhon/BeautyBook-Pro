import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { databaseAPI } from "../../services/databaseApi";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="3.5" stroke="#000" strokeWidth="2"/>
    <circle cx="7" cy="15" r="3.5" stroke="#000" strokeWidth="2"/>
    <path d="M9.8 8.8l7 7M9.8 13.2L17 6.2" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = ({ color = "#988f81" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="5.5" stroke={color} strokeWidth="1.3" opacity="0.6"/>
    <line x1="11.5" y1="11.5" x2="16" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const BellIcon = () => (
  <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 1a5 5 0 00-5 5v4l-1.5 2.5h13L12.5 10V6a5 5 0 00-5-5z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M6 15.5a1.5 1.5 0 003 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const GearIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.5" cy="8.5" r="2.5" stroke="#fff" strokeWidth="1.2"/>
    <path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3.05 3.05l1.42 1.42M12.53 12.53l1.42 1.42M3.05 13.95l1.42-1.42M12.53 4.47l1.42-1.42" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const LogOutIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 3H3.5A1.5 1.5 0 002 4.5v11A1.5 1.5 0 003.5 17H7" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M13 13l4-3-4-3" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="10" x2="17" y2="10" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
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

const NavUserIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5.5" r="3.5" stroke={color} strokeWidth="1.6"/>
    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const DatabaseIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// ─── Navigation Items ─────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "staff-management", label: "Staff Management", icon: NavUserIcon },
  { id: "clients", label: "Client Accounts", icon: DatabaseIcon },  { id: "services", label: "Services", icon: DatabaseIcon },
  { id: "logs", label: "Logs", icon: DatabaseIcon },  { id: "security", label: "Security", icon: ShieldIcon },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminClientsDashboard() {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState("clients");
  const [clientsData, setClientsData] = useState({
    id: 'users',
    name: 'Client Accounts',
    meta: '0 clients',
    rows: [],
    cols: [],
  });
  const [loading, setLoading] = useState(false);
  const [currentClientPage, setCurrentClientPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  // Fetch clients table on mount
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        console.log('[Clients] Starting fetch from users table...');
        const tablesInfo = await databaseAPI.getTablesInfo(['users']);
        
        if (tablesInfo && Array.isArray(tablesInfo)) {
          console.log('[Clients] Fetched tables info:', tablesInfo);
          
          const tableInfo = tablesInfo[0];
          if (!tableInfo) {
            console.warn('[Clients] No table info returned');
            return;
          }
          
          console.log('[Clients] Table info for users:', tableInfo);
          
          // Fetch actual data
          let rowData = [];
          try {
            const dataResult = await databaseAPI.getTableData('users', 10000, 0);
            rowData = dataResult.data || [];
            
            console.log('[Clients] Raw data from API:', rowData);
            console.log('[Clients] Total rows:', rowData.length);
            if (rowData.length > 0) {
              console.log('[Clients] Available columns in first row:', Object.keys(rowData[0]));
              console.log('[Clients] First row full data:', rowData[0]);
            }
            
            console.log(`[Clients] Fetched ${rowData.length} rows`);
          } catch (dataError) {
            console.warn(`[Clients] Error fetching data:`, dataError);
            rowData = [];
          }
          
          console.log(`[Clients] After processing: ${rowData.length} rows available`);
          
          const cols = rowData.length > 0 ? Object.keys(rowData[0]) : [];
          
          setClientsData({
            id: 'users',
            name: 'Client Accounts',
            meta: `${tableInfo.rowCount} clients`,
            lastUpdated: 'Today',
            rows: rowData,
            cols: cols,
          });
          
          console.log('[Clients] State updated with', rowData.length, 'rows');
        }
      } catch (error) {
        console.error('[Clients] Error fetching data:', error);
        setClientsData({
          id: 'users',
          name: 'Client Accounts',
          meta: '0 clients',
          rows: [],
          cols: [],
        });
        displayToast('Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
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

  // Format column names for display
  const formatColumnName = (colName) => {
    return colName.charAt(0).toUpperCase() + colName.slice(1).replace(/_/g, ' ');
  };

  // Format cell display value
  const formatCellValue = (cellValue, colName) => {
    if (typeof cellValue === 'boolean') {
      return cellValue ? 'Active' : 'Inactive';
    }
    if (cellValue === null || cellValue === undefined) {
      return '—';
    }
    return cellValue || '';
  };

  // Filter clients based on search query
  const filteredClients = (clientsData.rows || []).filter(client => 
    Object.values(client).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
                  if (item.id === "clients") {
                    setActiveNav(item.id);
                  } else if (item.id === "dashboard") {
                    navigate("/superadmin/dashboard");
                  } else if (item.id === "staff-management") {
                    navigate("/superadmin/users");
                  } else if (item.id === "services") {
                    navigate("/superadmin/services");
                  } else if (item.id === "logs") {
                    navigate("/superadmin/logs");
                  } else if (item.id === "security") {
                    navigate("/superadmin/security");
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
            <h1 className="header-main-title">Client Accounts</h1>
            <p className="header-subtitle">BeautyBook Pro • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="header-actions">
            <button className="header-action-btn" onClick={() => displayToast('No new notifications')}>
              <BellIcon />
              <span>Notifications</span>
            </button>
            <button className="header-action-btn" onClick={() => displayToast('Settings coming soon')}>
              <GearIcon />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-main">
          <div className="dashboard-panel">
            {/* Panel header with search and add button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="panel-title">
                {searchQuery 
                  ? `Search Results (${filteredClients.length})`
                  : `All Clients (${clientsData.rows?.length || 0})`
                }
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentClientPage(1);
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
                
                {/* Add Button */}
                <button
                  onClick={() => displayToast('Add client feature coming soon')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dd901d',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e6a326'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dd901d'}
                >
                  Add Client
                </button>
              </div>
            </div>

            {/* Clients Table View */}
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#D4C5B9' }}>Loading client data...</div>
            ) : clientsData.rows && clientsData.rows.length > 0 ? (
              <div style={{ marginTop: '0px', overflowX: 'auto' }}>
                <table className="data-table" style={{ minWidth: '800px' }}>
                  <thead>
                    <tr>
                      {clientsData.cols.map((col) => (
                        <th key={col} style={{ textAlign: 'left' }}>{formatColumnName(col)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const itemsPerPage = 12;
                      const startIdx = (currentClientPage - 1) * itemsPerPage;
                      const endIdx = startIdx + itemsPerPage;
                      return filteredClients.slice(startIdx, endIdx).map((client, idx) => (
                        <tr key={idx} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(221, 144, 29, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          {clientsData.cols.map((col) => {
                            const cellValue = client[col];
                            const displayValue = formatCellValue(cellValue, col);
                            return (
                              <td key={col} style={{ fontSize: '13px' }}>{displayValue}</td>
                            );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
                {filteredClients.length > 0 && (() => {
                  const itemsPerPage = 12;
                  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
                  const startIdx = (currentClientPage - 1) * itemsPerPage + 1;
                  const endIdx = Math.min(currentClientPage * itemsPerPage, filteredClients.length);
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(152, 143, 129, 0.2)', marginTop: '12px' }}>
                      <div style={{ color: '#988f81', fontSize: '13px' }}>
                        Showing {startIdx}–{endIdx} of {filteredClients.length} clients
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setCurrentClientPage(p => Math.max(1, p - 1))}
                          disabled={currentClientPage === 1}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentClientPage === 1 ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentClientPage === 1 ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentClientPage === 1 ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentClientPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentClientPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          ← Previous
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#988f81', fontSize: '13px' }}>
                          Page {currentClientPage} of {totalPages}
                        </div>
                        <button
                          onClick={() => setCurrentClientPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentClientPage === totalPages}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentClientPage === totalPages ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentClientPage === totalPages ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentClientPage === totalPages ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentClientPage !== totalPages) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentClientPage !== totalPages) {
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
              <div style={{ padding: '40px', textAlign: 'center', color: '#D4C5B9' }}>No client accounts found</div>
            )}
          </div>
        </main>
      </div>

      {/* ─── TOAST ─── */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: 'rgba(35, 29, 26, 0.95)',
          border: '1px solid rgba(221, 144, 29, 0.3)',
          color: '#D4C5B9',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
