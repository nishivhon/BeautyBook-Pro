import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";

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
  { id: "user-accounts", label: "User Accounts", icon: UserIcon },
  { id: "database", label: "Database", icon: DatabaseIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
  { id: "landing-page", label: "Landing Page", icon: GlobeIcon },
];

// ─── Database Tables Data ───────────────────────────────────────────────────

const DATABASE_TABLES = [
  {
    id: 'users',
    name: 'Users',
    meta: '142 rows · 2.4 MB',
    lastUpdated: 'Today',
    rows: [
      { id:'U001', name:'Anna Cruz',      email:'anna@beautybook.pro',    role:'Admin',  status:'Active' },
      { id:'U002', name:'Mike Santos',    email:'mike@gmail.com',         role:'Staff',  status:'Active' },
      { id:'U003', name:'Lea Mendoza',    email:'lea@gmail.com',          role:'Staff',  status:'Active' },
      { id:'U004', name:'Ramon Reyes',    email:'ramon@gmail.com',        role:'Staff',  status:'Active' },
      { id:'U005', name:'Carla Bautista', email:'carla@gmail.com',        role:'Staff',  status:'Inactive' },
    ],
    cols: ['ID','Name','Email','Role','Status'],
  },
  {
    id: 'appointments',
    name: 'Appointments',
    meta: '3,847 rows · 12.1 MB',
    lastUpdated: 'Today',
    rows: [
      { id:'A001', client:'Maria Santos',  service:'Hair Color',   staff:'Anna Cruz',   time:'10:00 AM', status:'Confirmed' },
      { id:'A002', client:'Jose Reyes',    service:'Haircut',      staff:'Lea Mendoza', time:'11:30 AM', status:'Confirmed' },
      { id:'A003', client:'Clara Lim',     service:'Nail Art',     staff:'Mike Santos', time:'1:00 PM',  status:'Pending' },
      { id:'A004', client:'Ben Torres',    service:'Facial',       staff:'Carla B.',    time:'2:30 PM',  status:'Cancelled' },
      { id:'A005', client:'Rosa Aquino',   service:'Manicure',     staff:'Anna Cruz',   time:'4:00 PM',  status:'Confirmed' },
    ],
    cols: ['ID','Client','Service','Staff','Time','Status'],
  },
  {
    id: 'services',
    name: 'Services',
    meta: '18 rows · 0.1 MB',
    lastUpdated: '3 days ago',
    rows: [
      { id:'S001', name:'Hair Color',  category:'Hair',   price:'₱800', duration:'90 min' },
      { id:'S002', name:'Haircut',     category:'Hair',   price:'₱250', duration:'30 min' },
      { id:'S003', name:'Nail Art',    category:'Nails',  price:'₱350', duration:'60 min' },
      { id:'S004', name:'Facial',      category:'Skin',   price:'₱600', duration:'60 min' },
      { id:'S005', name:'Manicure',    category:'Nails',  price:'₱200', duration:'45 min' },
    ],
    cols: ['ID','Name','Category','Price','Duration'],
  },
  {
    id: 'staff',
    name: 'Staff',
    meta: '12 rows · 0.8 MB',
    lastUpdated: 'Today',
    rows: [
      { id:'ST01', name:'Anna Cruz',      specialty:'Colorist',   schedule:'Mon-Fri', status:'Active',   rating:'4.9' },
      { id:'ST02', name:'Mike Santos',    specialty:'Stylist',    schedule:'Tue-Sat', status:'Active',   rating:'4.7' },
      { id:'ST03', name:'Lea Mendoza',    specialty:'Nail Tech',  schedule:'Mon-Fri', status:'Active',   rating:'4.8' },
      { id:'ST04', name:'Ramon Reyes',    specialty:'Esthetician',schedule:'Wed-Sun', status:'Active',   rating:'4.6' },
      { id:'ST05', name:'Carla Bautista', specialty:'Stylist',    schedule:'Mon-Thu', status:'On leave', rating:'4.5' },
    ],
    cols: ['ID','Name','Specialty','Schedule','Status','Rating'],
  },
  {
    id: 'reports',
    name: 'Reports',
    meta: '142 rows · 2.4 MB',
    lastUpdated: '16 hours ago',
    rows: [
      { id:'R001', title:'Monthly Revenue',   period:'Nov 2024',  total:'₱184,200', status:'Final' },
      { id:'R002', title:'Staff Performance', period:'Nov 2024',  total:'—',        status:'Final' },
      { id:'R003', title:'Monthly Revenue',   period:'Oct 2024',  total:'₱162,500', status:'Final' },
      { id:'R004', title:'Client Retention',  period:'Q3 2024',   total:'—',        status:'Final' },
      { id:'R005', title:'Monthly Revenue',   period:'Sep 2024',  total:'₱155,900', status:'Final' },
    ],
    cols: ['ID','Title','Period','Total','Status'],
  },
];

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
    const table = DATABASE_TABLES.find(t => t.id === tableId);
    setModalTable(table);
    setModalMode("view");
    setShowModal(true);
  };

  const openEditModal = (tableId) => {
    const table = DATABASE_TABLES.find(t => t.id === tableId);
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
    displayToast('Changes saved.');
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
                  } else if (item.id === "user-accounts") {
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
                <button className="btn-gold" onClick={handleBackup}>
                  <BackupIcon />
                  Backup
                </button>
              </div>
            </div>

            {/* Database rows */}
            <div className="space-y-2 mt-2">
              {DATABASE_TABLES.map((table) => (
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
                    <button className="row-btn edit-btn" onClick={() => openEditModal(table.id)}>
                      <EditIconSmall />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div className="stats-bar">
              <div className="stat-card">
                <span className="stat-value">28.3 MB</span>
                <span className="stat-label">Total size</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">7,236</span>
                <span className="stat-label">Total records</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" style={{fontSize:'14px'}}>03/24/26 · 6:00 PM</span>
                <span className="stat-label">Last backup</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─── MODAL ─── */}
      {showModal && modalTable && (
        <div className="modal-backdrop" onClick={(e) => {if(e.target === e.currentTarget) setShowModal(false)}}>
          <div className="modal">
            <div className="modal-title">
              {modalTable.name} — {modalMode === 'view' ? 'View' : 'Edit'}
            </div>
            <div className="modal-sub">
              {modalMode === 'view' 
                ? `${modalTable.meta} · Last updated: ${modalTable.lastUpdated}`
                : 'Click any cell to edit. Changes are saved on confirmation.'
              }
            </div>

            {/* Table */}
            <div style={{overflowX:'auto', marginTop:'16px'}}>
              <table className="data-table">
                <thead>
                  <tr>
                    {modalTable.cols.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modalTable.rows.map((row, idx) => {
                    const rowKeys = Object.keys(row);
                    return (
                      <tr key={idx}>
                        {rowKeys.map((key) => (
                          <td key={key}>
                            {modalMode === 'edit' && !key.startsWith('id') 
                              ? <input defaultValue={row[key]} style={{background:'transparent', border:'none', outline:'none', color:'white', fontSize:'13px', width:'100%'}} />
                              : row[key]
                            }
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn-gold" onClick={handleSaveChanges}>
                {modalMode === 'view' ? 'Close' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ─── */}
      {showToast && (
        <div className="toast show">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
