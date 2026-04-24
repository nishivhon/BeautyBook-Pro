import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import AddStaffModal from "../../components/modal/superadmin/add_staff";

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

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);
  
  const [availableServices] = useState([
    { id: 1, name: 'Hair Cut', category: 'Hair' },
    { id: 2, name: 'Hair Coloring', category: 'Hair' },
    { id: 3, name: 'Hair Treatment', category: 'Hair' },
    { id: 4, name: 'Manicure', category: 'Nail' },
    { id: 5, name: 'Pedicure', category: 'Nail' },
    { id: 6, name: 'Facial', category: 'Skincare' },
    { id: 7, name: 'Massage', category: 'Massage' },
    { id: 8, name: 'Waxing', category: 'Skincare' },
  ]);

  const [staffData] = useState([
    { id:1, initial:'A', name:'Anna Cruz',      specialty:'Hair',     services:[1,2,3],  status:'Active' },
    { id:2, initial:'M', name:'Mike Santos',    specialty:'Nail',     services:[4,5],    status:'Active' },
    { id:3, initial:'L', name:'Lea Mendoza',    specialty:'Skincare', services:[6,8],    status:'Active' },
    { id:4, initial:'R', name:'Ramon Reyes',    specialty:'Massage',  services:[7],      status:'Active' },
    { id:5, initial:'C', name:'Carla Bautista', specialty:'Hair',     services:[1,2],    status:'Inactive' },
  ]);
  
  const [filteredStaff, setFilteredStaff] = useState(staffData);
  const [searchValue, setSearchValue] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({ name: "", specialty: "", services: [], status: "" });
  const [showModal, setShowModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [dropdownResults, setDropdownResults] = useState([]);
  const [confirmExit, setConfirmExit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Check if form has any data
  const hasFormData = useCallback(() => {
    return formData.name.trim() !== "" || 
           formData.specialty.trim() !== "" || 
           formData.services.length > 0 || 
           formData.status.trim() !== "";
  }, [formData]);

  // Handle modal close with confirmation
  const handleModalClose = useCallback(() => {
    setConfirmExit(true);
  }, []);

  const handleConfirmExit = () => {
    setFormData({ name: "", specialty: "", services: [], status: "" });
    setConfirmExit(false);
    setShowModal(false);
    setIsEditing(false);
    setEditingStaffId(null);
  };

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

  const getServiceNames = (serviceIds) => {
    return availableServices
      .filter(s => serviceIds.includes(s.id))
      .map(s => s.name)
      .join(", ");
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    const lower = value.toLowerCase().trim();
    if (!lower) {
      setShowSearchDropdown(false);
      setDropdownResults([]);
      setFilteredStaff(staffData);
    } else {
      const results = staffData
        .filter(s => 
          s.name.toLowerCase().startsWith(lower) || s.specialty.toLowerCase().startsWith(lower)
        )
        .sort((a, b) => a.name.localeCompare(b.name));
      setDropdownResults(results);
      setShowSearchDropdown(results.length > 0);
    }
  };

  const handleSelectFromDropdown = (staff) => {
    setSearchValue(staff.name);
    setShowSearchDropdown(false);
    setFilteredStaff([staff]);
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const handleAddStaff = () => {
    if (!formData.name || !formData.specialty || formData.services.length === 0 || !formData.status) {
      displayToast("Please fill in all fields");
      return;
    }
    // Add new staff to the list
    const newStaff = {
      id: staffData.length + 1,
      initial: formData.name.charAt(0).toUpperCase(),
      name: formData.name,
      specialty: formData.specialty,
      services: formData.services,
      status: formData.status
    };
    // Reset form and close modal
    setFormData({ name: "", specialty: "", services: [], status: "" });
    setShowModal(false);
    displayToast(`Staff member ${formData.name} added successfully!`);
  };

  const handleEditStaff = (staff) => {
    setIsEditing(true);
    setEditingStaffId(staff.id);
    setFormData({
      name: staff.name,
      specialty: staff.specialty,
      services: staff.services || [],
      status: staff.status
    });
    setShowModal(true);
  };

  const handleUpdateStaff = () => {
    if (!formData.name || !formData.specialty || formData.services.length === 0 || !formData.status) {
      displayToast("Please fill in all fields");
      return;
    }
    // Update logic would go here
    setFormData({ name: "", specialty: "", services: [], status: "" });
    setShowModal(false);
    setIsEditing(false);
    setEditingStaffId(null);
    displayToast(`Staff member ${formData.name} updated successfully!`);
  };

  const handleDeleteStaff = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      displayToast(`Account deleted for ${staffToDelete.name}!`);
      setShowDeleteConfirm(false);
      setStaffToDelete(null);
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
            <p className="header-subtitle">BeautyBook Pro • Saturday, Dec 7, 2024</p>
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
          {/* User Management Panel */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title">
                <UserIcon />
                Staff Management
              </div>
              <div className="table-controls">
                <div className="search-wrap" style={{ position: "relative" }}>
                  <SearchIcon />
                  <input 
                    className="search-input" 
                    type="text" 
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {/* Search Results Dropdown */}
                  {showSearchDropdown && searchValue && (
                    <div className="search-dropdown" style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      marginTop: "8px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid rgba(221, 144, 29, 0.3)",
                      borderRadius: "8px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                      zIndex: 100,
                      maxHeight: "300px",
                      overflowY: "auto",
                      fontFamily: "Inter, sans-serif",
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(221, 144, 29, 0.2) transparent"
                    }}>
                      {dropdownResults.map((staff, index) => (
                        <div 
                          key={staff.id} 
                          onClick={() => handleSelectFromDropdown(staff)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            borderBottom: index !== dropdownResults.length - 1 ? "1px solid rgba(221, 144, 29, 0.1)" : "none",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(221, 144, 29, 0.08)"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(221, 144, 29, 0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#dd901d",
                            flexShrink: 0
                          }}>
                            {staff.initial}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#f5f5f5"
                            }}>
                              {staff.name}
                            </div>
                            <div style={{
                              fontSize: "11px",
                              color: "#988f81"
                            }}>
                              {staff.email}
                            </div>
                          </div>
                          <div style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: staff.status === 'Active' ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
                            color: staff.status === 'Active' ? "#4caf50" : "#f44336",
                            flexShrink: 0
                          }}>
                            {staff.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="btn-gold" onClick={() => setShowModal(true)}>Add Staff</button>
              </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <div className="table-head">
                <div className="th-user">Staff Member</div>
                <div className="th-role">Specialty</div>
                <div className="th-status">Services</div>
                <div className="th-login">Status</div>
                <div className="th-actions">Actions</div>
              </div>

              <div className="table-body">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map(staff => (
                    <div key={staff.id} className="table-row">
                      <div className="user-cell">
                        <div className="avatar">
                          <span className="avatar-initial">{staff.initial}</span>
                          <span className={`avatar-dot ${staff.status === 'Active' ? 'active' : 'inactive'}`}></span>
                        </div>
                        <div className="user-info">
                          <span className="user-name">{staff.name}</span>
                        </div>
                      </div>

                      <div className="badge">
                        <span className="badge-inner badge-staff">
                          {staff.specialty}
                        </span>
                      </div>

                      <div className="last-login-cell">
                        <span className="last-login-badge">{getServiceNames(staff.services)}</span>
                      </div>

                      <div className="badge">
                        <span className={`badge-inner ${staff.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                          {staff.status}
                        </span>
                      </div>

                      <div className="actions-cell">
                        <button className="action-btn" title="Edit" onClick={() => handleEditStaff(staff)}>
                          <EditIcon />
                        </button>
                        <button className="action-btn danger" title="Remove" onClick={() => handleDeleteStaff(staff)}>
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="table-empty">No staff members found.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─── MODAL ─── */}
      <AddStaffModal 
        showModal={showModal}
        onClose={handleModalClose}
        formData={formData}
        setFormData={setFormData}
        handleAddStaff={isEditing ? handleUpdateStaff : handleAddStaff}
        isEditing={isEditing}
        availableServices={availableServices}
      />

      {/* ─── DELETE CONFIRMATION DIALOG ─── */}
      {showDeleteConfirm && staffToDelete && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
          fontFamily: "Inter, sans-serif"
        }}>
          <div style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: "32px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(221, 144, 29, 0.2)"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#f5f5f5",
              margin: "0 0 16px 0"
            }}>Delete Staff Member?</h3>
            <p style={{
              fontSize: "14px",
              color: "#988f81",
              margin: "0 0 8px 0",
              lineHeight: "1.5"
            }}>Are you sure you want to delete <span style={{ color: "#dd901d", fontWeight: "600" }}>{staffToDelete.name}</span>? This action cannot be undone.</p>
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px"
            }}>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setStaffToDelete(null);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(221, 144, 29, 0.4)",
                  color: "#dd901d",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "background-color 0.2s ease"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#c0392b"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#e74c3c"}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL EXIT CONFIRMATION DIALOG ─── */}
      {confirmExit && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
          fontFamily: "Inter, sans-serif"
        }}>
          <div style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: "32px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(221, 144, 29, 0.2)"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#f5f5f5",
              margin: "0 0 16px 0"
            }}>Discard Changes?</h3>
            <p style={{
              fontSize: "14px",
              color: "#988f81",
              margin: "0 0 24px 0",
              lineHeight: "1.5"
            }}>You have unsaved data. Are you sure you want to exit without adding the staff member?</p>
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end"
            }}>
              <button
                onClick={() => setConfirmExit(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(221, 144, 29, 0.4)",
                  color: "#dd901d",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
                }}
              >
                Keep Editing
              </button>
              <button
                onClick={handleConfirmExit}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dd901d",
                  color: "#1a1a1a",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "background-color 0.2s ease"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#e6a326"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#dd901d"}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {showToast && (
        <div className="toast show">
          {toastMessage}
        </div>
      )}
    </div>
  );
}