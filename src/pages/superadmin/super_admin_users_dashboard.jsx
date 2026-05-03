import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { databaseAPI } from "../../services/databaseApi";
import { EditStaffModal } from "../../components/modal/superadmin/edit_staff";
import { AddStaffModal } from "../../components/modal/superadmin/add_staff";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="3.5" stroke="#000" strokeWidth="2"/>
    <circle cx="7" cy="15" r="3.5" stroke="#000" strokeWidth="2"/>
    <path d="M9.8 8.8l7 7M9.8 13.2L17 6.2" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const UserIcon = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="7" r="3" stroke={color} strokeWidth="1.3"/>
    <path d="M2 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="16" cy="7" r="2.2" stroke={color} strokeWidth="1.3"/>
    <path d="M20 18c0-2.485-1.79-4.5-4-4.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = ({ color = "#988f81" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="5.5" stroke={color} strokeWidth="1.3" opacity="0.6"/>
    <line x1="11.5" y1="11.5" x2="16" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const LinkIcon = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M14 9a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
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

const EditIcon = ({ color = "#988f81" }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 9.5L9.5 2l2.5 2.5L4.5 12H2V9.5z" stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
    <line x1="7.5" y1="4" x2="10" y2="6.5" stroke={color} strokeWidth="1.2"/>
  </svg>
);

const DeleteIcon = ({ color = "#988f81" }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3.5h8M5 3.5V2.5h4v1M4 3.5l.5 8h5l.5-8" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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

const GlobeIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.6"/>
    <path d="M9 2C9 2 7 5 7 9s2 7 2 7M9 2c0 0 2 3 2 7s-2 7-2 7M2 9h14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// ─── Navigation Items ─────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { id: "staff-management", label: "Staff Management", icon: NavUserIcon },
  { id: "database", label: "Database", icon: DatabaseIcon },  { id: "services", label: "Services", icon: DatabaseIcon },
  { id: "logs", label: "Logs", icon: DatabaseIcon },  { id: "security", label: "Security", icon: ShieldIcon },
  { id: "landing-page", label: "Landing Page", icon: GlobeIcon },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminUsersDashboard() {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState("staff-management");
  const [staffsData, setStaffsData] = useState({
    id: 'staffs',
    name: 'Staff Members',
    meta: '0 staff members',
    rows: [],
    cols: ['names', 'category_specialty', 'employment'],
  });
  const [loading, setLoading] = useState(false);
  const [currentStaffPage, setCurrentStaffPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  // Fetch staffs table on mount
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        console.log('[Staffs] Starting fetch from staffs table...');
        const tablesInfo = await databaseAPI.getTablesInfo(['staffs']);
        
        if (tablesInfo && Array.isArray(tablesInfo)) {
          console.log('[Staffs] Fetched tables info:', tablesInfo);
          
          const tableInfo = tablesInfo[0];
          if (!tableInfo) {
            console.warn('[Staffs] No table info returned');
            return;
          }
          
          console.log('[Staffs] Table info for staffs:', tableInfo);
          
          // Get column names - display only names, category_specialty, employment
          const displayColumns = ['names', 'category_specialty', 'employment'];
          
          // Fetch actual data
          let rowData = [];
          try {
            const dataResult = await databaseAPI.getTableData('staffs', 10000, 0);
            rowData = dataResult.data || [];
            
            console.log('[Staffs] Raw data from API:', rowData);
            console.log('[Staffs] Total rows:', rowData.length);
            if (rowData.length > 0) {
              console.log('[Staffs] Available columns in first row:', Object.keys(rowData[0]));
              console.log('[Staffs] First row full data:', rowData[0]);
              console.log('[Staffs] names value:', rowData[0].names, 'category_specialty value:', rowData[0].category_specialty, 'employment value:', rowData[0].employment);
            }
            
            // Filter to only display columns - but keep id for editing
            rowData = rowData.map(row => {
              const filtered = { id: row.id };
              displayColumns.forEach(col => {
                // Always include the column, even if empty
                filtered[col] = row[col] !== undefined ? row[col] : null;
              });
              return filtered;
            });
            
            console.log(`[Staffs] Fetched ${rowData.length} rows, filtered first row:`, rowData[0]);
          } catch (dataError) {
            console.warn(`[Staffs] Error fetching data:`, dataError);
            rowData = [];
          }
          
          console.log(`[Staffs] After processing: ${rowData.length} rows available`);
          
          setStaffsData({
            id: 'staffs',
            name: 'Staff Members',
            meta: `${tableInfo.rowCount} staff members`,
            lastUpdated: 'Today',
            rows: rowData,
            cols: displayColumns,
          });
          
          console.log('[Staffs] State updated with', rowData.length, 'rows');
        }
      } catch (error) {
        console.error('[Staffs] Error fetching data:', error);
        setStaffsData({
          id: 'staffs',
          name: 'Staff Members',
          meta: '0 staff members',
          rows: [],
          cols: ['names', 'category_specialty', 'employment'],
        });
        displayToast('Failed to fetch staff data');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
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

  // Handle opening the edit modal
  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setIsEditModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStaff(null);
  };

  // Handle saving the edited staff
  const handleSaveStaff = (updatedStaff) => {
    setStaffsData(prev => ({
      ...prev,
      rows: prev.rows.map(staff => 
        staff.id === updatedStaff.id ? { ...staff, ...updatedStaff } : staff
      )
    }));
    displayToast('Staff member updated successfully');
  };

  // Handle opening the add modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle closing the add modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle saving a new staff member
  const handleAddNewStaff = (newStaff) => {
    setStaffsData(prev => ({
      ...prev,
      rows: [newStaff, ...prev.rows],
      meta: `${prev.rows.length + 1} staff members`
    }));
    displayToast('Staff member added successfully');
  };

  // Format column names for display
  const formatColumnName = (colName) => {
    const columnMap = {
      'names': 'name',
      'category_specialty': 'specialty',
      'employment': 'employment status'
    };
    return columnMap[colName] || colName;
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
                  if (item.id === "staff-management") {
                    setActiveNav(item.id);
                  } else if (item.id === "dashboard") {
                    navigate("/superadmin/dashboard");
                  } else if (item.id === "database") {
                    navigate("/superadmin/database");
                  } else if (item.id === "services") {
                    navigate("/superadmin/services");
                  } else if (item.id === "logs") {
                    navigate("/superadmin/logs");
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
            <h1 className="header-main-title">Staff Management</h1>
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
                  ? `Search Results (${(staffsData.rows || []).filter(staff => (staff.names || '').toLowerCase().includes(searchQuery.toLowerCase())).length})`
                  : `All Staff Members (${staffsData.rows?.length || 0})`
                }
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search staff by name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentStaffPage(1);
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
                  onClick={handleOpenAddModal}
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
                  Add Staff
                </button>
              </div>
            </div>

            {/* Staff Table View */}
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#D4C5B9' }}>Loading staff data...</div>
            ) : (() => {
              // Filter staff by search query
              const filteredStaff = staffsData.rows ? staffsData.rows.filter(staff =>
                (staff.names || '').toLowerCase().includes(searchQuery.toLowerCase())
              ) : [];
              
              return staffsData.rows && staffsData.rows.length > 0 ? (
                filteredStaff.length > 0 ? (
                  <div style={{ marginTop: '0px', overflowX: 'auto' }}>
                    <table className="data-table" style={{ minWidth: '800px' }}>
                      <thead>
                        <tr>
                          {staffsData.cols.map((col) => (
                            <th key={col} style={{ textAlign: 'left' }}>{formatColumnName(col)}</th>
                          ))}
                          <th style={{ textAlign: 'left' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const itemsPerPage = 12;
                          const startIdx = (currentStaffPage - 1) * itemsPerPage;
                          const endIdx = startIdx + itemsPerPage;
                          return filteredStaff.slice(startIdx, endIdx).map((staff, idx) => (
                        <tr key={idx} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(221, 144, 29, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          {staffsData.cols.map((col) => {
                            const cellValue = staff[col];
                            const displayValue = formatCellValue(cellValue, col);
                            return (
                              <td key={col} style={{ fontSize: '13px' }}>{displayValue}</td>
                            );
                          })}
                          <td style={{ fontSize: '13px' }}>
                            <button
                              onClick={() => handleEditStaff(staff)}
                              title="Edit staff"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#988f81',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                borderRadius: '4px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#dd901d';
                                e.currentTarget.style.backgroundColor = 'rgba(221, 144, 29, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#988f81';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <EditIcon color="currentColor" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
                {(() => {
                  const filteredStaff = staffsData.rows.filter(staff =>
                    (staff.names || '').toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (filteredStaff.length === 0) return null;
                  
                  const itemsPerPage = 12;
                  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
                  const startIdx = (currentStaffPage - 1) * itemsPerPage + 1;
                  const endIdx = Math.min(currentStaffPage * itemsPerPage, filteredStaff.length);
                  
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(152, 143, 129, 0.2)', marginTop: '12px' }}>
                      <div style={{ color: '#988f81', fontSize: '13px' }}>
                        Showing {startIdx}–{endIdx} of {filteredStaff.length} staff
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setCurrentStaffPage(p => Math.max(1, p - 1))}
                          disabled={currentStaffPage === 1}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentStaffPage === 1 ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentStaffPage === 1 ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentStaffPage === 1 ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentStaffPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentStaffPage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          ← Previous
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#988f81', fontSize: '13px' }}>
                          Page {currentStaffPage} of {totalPages}
                        </div>
                        <button
                          onClick={() => setCurrentStaffPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentStaffPage === totalPages}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentStaffPage === totalPages ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentStaffPage === totalPages ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentStaffPage === totalPages ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentStaffPage !== totalPages) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentStaffPage !== totalPages) {
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
                  <div style={{ padding: '40px', textAlign: 'center', color: '#D4C5B9' }}>
                    No staff members match your search
                  </div>
                )
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#D4C5B9' }}>No staff members found</div>
              );
            })()}
          </div>
        </main>
      </div>

      {/* ─── TOAST ─── */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
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

      {/* ─── EDIT STAFF MODAL ─── */}
      <EditStaffModal 
        staff={editingStaff}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveStaff}
      />

      {/* ─── ADD STAFF MODAL ─── */}
      <AddStaffModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleAddNewStaff}
      />
    </div>
  );
}