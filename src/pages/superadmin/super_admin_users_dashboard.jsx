import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import CreateAccountModal from "../../components/modal/create_account";

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
  { id: "user-accounts", label: "User Accounts", icon: NavUserIcon },
  { id: "database", label: "Database", icon: DatabaseIcon },
  { id: "security", label: "Security", icon: ShieldIcon },
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
  const [activeNav, setActiveNav] = useState("user-accounts");

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);
  
  const [staffData] = useState([
    { id:1, initial:'A', name:'Anna Cruz',      email:'annacruz@gmail.com',      role:'Admin',  status:'Active',   lastLogin:'Last Active 2 hrs ago' },
    { id:2, initial:'M', name:'Mike Santos',    email:'mikesantos@gmail.com',     role:'Staff',  status:'Active',   lastLogin:'Last Active 2 hrs ago' },
    { id:3, initial:'L', name:'Lea Mendoza',    email:'leamendoza@gmail.com',     role:'Staff',  status:'Active',   lastLogin:'Last Active 5 hrs ago' },
    { id:4, initial:'R', name:'Ramon Reyes',    email:'ramonreyes@gmail.com',     role:'Staff',  status:'Active',   lastLogin:'Last Active 1 day ago'  },
    { id:5, initial:'C', name:'Carla Bautista', email:'carlabautista@gmail.com',  role:'Staff',  status:'Inactive', lastLogin:'Last Active 3 days ago' },
  ]);
  
  const [filteredStaff, setFilteredStaff] = useState(staffData);
  const [searchValue, setSearchValue] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [linkEmail, setLinkEmail] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [dropdownResults, setDropdownResults] = useState([]);
  const [confirmExit, setConfirmExit] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", password: "", confirmPassword: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Check if form has any data
  const hasFormData = useCallback(() => {
    return formData.name.trim() !== "" || 
           formData.email.trim() !== "" || 
           formData.role.trim() !== "" || 
           formData.password.trim() !== "" || 
           formData.confirmPassword.trim() !== "";
  }, [formData]);

  // Handle modal close with confirmation
  const handleModalClose = useCallback(() => {
    setConfirmExit(true);
  }, []);

  const handleConfirmExit = () => {
    setFormData({ name: "", email: "", role: "", password: "", confirmPassword: "" });
    setConfirmExit(false);
    setShowModal(false);
    setIsEditing(false);
    setEditingStaffId(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Email validation helper
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    const lower = value.toLowerCase().trim();
    if (!lower) {
      setShowSearchDropdown(false);
      setDropdownResults([]);
      setFilteredStaff(staffData);
    } else {
      const results = staffData.filter(s => 
        s.name.toLowerCase().includes(lower) || s.email.toLowerCase().includes(lower)
      );
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

  const handleGenerateLink = () => {
    const val = linkEmail.trim();
    if (!val) {
      displayToast('Please enter an email or select a user.');
      return;
    }
    if (!validateEmail(val)) {
      displayToast('Please enter a valid email address.');
      return;
    }
    const link = `https://beautybook.pro/magic/${btoa(val).slice(0,14)}`;
    navigator.clipboard?.writeText(link).catch(()=>{});
    displayToast('Link copied: ' + link.slice(0,40) + '…');
    setLinkEmail('');
  };

  const handleCreateAccount = () => {
    if (!formData.name || !formData.email || !formData.role || !formData.password || !formData.confirmPassword) {
      displayToast("Please fill in all fields");
      return;
    }
    if (!validateEmail(formData.email)) {
      displayToast("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 8) {
      displayToast("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      displayToast("Passwords do not match.");
      return;
    }
    const emailExists = staffData.some(staff => staff.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
      displayToast("This email is already registered.");
      return;
    }
    // Add new staff to the list
    const newStaff = {
      id: staffData.length + 1,
      initial: formData.name.charAt(0).toUpperCase(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: "Active",
      lastLogin: "Last Active just now"
    };
    // Reset form and close modal
    setFormData({ name: "", email: "", role: "", password: "", confirmPassword: "" });
    setShowModal(false);
    displayToast(`Account created for ${formData.name}!`);
  };

  const handleEditStaff = (staff) => {
    setIsEditing(true);
    setEditingStaffId(staff.id);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      password: "",
      confirmPassword: ""
    });
    setShowModal(true);
  };

  const handleUpdateAccount = () => {
    if (!formData.name || !formData.email || !formData.role) {
      displayToast("Please fill in name, email, and role");
      return;
    }
    if (!validateEmail(formData.email)) {
      displayToast("Please enter a valid email address.");
      return;
    }
    // If password is being changed, validate it
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 8) {
        displayToast("Password must be at least 8 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        displayToast("Passwords do not match.");
        return;
      }
    }
    // Update logic would go here
    setFormData({ name: "", email: "", role: "", password: "", confirmPassword: "" });
    setShowModal(false);
    setIsEditing(false);
    setEditingStaffId(null);
    displayToast(`Account updated for ${formData.name}!`);
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
                  if (item.id === "user-accounts") {
                    setActiveNav(item.id);
                  } else if (item.id === "dashboard") {
                    navigate("/superadmin/dashboard");
                  } else if (item.id === "database") {
                    navigate("/superadmin/database");
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
            <h1 className="header-main-title">User Accounts Management</h1>
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
                User Management
              </div>
              <div className="table-controls">
                <div className="search-wrap">
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
                    <div className="search-dropdown">
                      <div className="search-dropdown-header">
                        <span className="search-results-count">{dropdownResults.length} result{dropdownResults.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="search-dropdown-list">
                        {dropdownResults.map(staff => (
                          <div 
                            key={staff.id} 
                            className="search-result-item"
                            onClick={() => handleSelectFromDropdown(staff)}
                          >
                            <div className="result-avatar">
                              <span className="avatar-initial">{staff.initial}</span>
                            </div>
                            <div className="result-info">
                              <span className="result-name">{staff.name}</span>
                              <span className="result-email">{staff.email}</span>
                            </div>
                            <div className="result-badge">
                              <span className={`badge-inner ${staff.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                                {staff.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="btn-gold" onClick={() => setShowModal(true)}>Create Account</button>
              </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <div className="table-head">
                <div className="th-user">User</div>
                <div className="th-role">Roles</div>
                <div className="th-status">Status</div>
                <div className="th-login">Last Log in</div>
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
                          <span className="user-email">{staff.email}</span>
                        </div>
                      </div>

                      <div className="badge">
                        <span className={`badge-inner ${staff.role === 'Admin' ? 'badge-admin' : 'badge-staff'}`}>
                          {staff.role}
                        </span>
                      </div>

                      <div className="badge">
                        <span className={`badge-inner ${staff.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                          {staff.status}
                        </span>
                      </div>

                      <div className="last-login-cell">
                        <span className="last-login-badge">{staff.lastLogin}</span>
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
                  <div className="table-empty">No users found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Login Link Generator Panel */}
          <div className="dashboard-panel">
            <div className="panel-header-simple">
              <div className="panel-title">
                <LinkIcon />
                Log In Link Generator
              </div>
            </div>

            <p className="panel-description">
              Generate a one-time login link for staff or admin accounts.
            </p>

            <div className="link-gen-body">
              <div className="link-input-wrap">
                <input 
                  className="link-input" 
                  type="text" 
                  placeholder="Select user or enter email"
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                />
              </div>
              <button className="btn-gold" onClick={handleGenerateLink}>Generate Link</button>
            </div>
          </div>
        </main>
      </div>

      {/* ─── MODAL ─── */}
      <CreateAccountModal 
        showModal={showModal}
        onClose={handleModalClose}
        formData={formData}
        setFormData={setFormData}
        handleCreateAccount={isEditing ? handleUpdateAccount : handleCreateAccount}
        isEditing={isEditing}
        showPassword={showPassword}
        togglePasswordVisibility={() => setShowPassword(!showPassword)}
        showConfirmPassword={showConfirmPassword}
        toggleConfirmPasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
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
            }}>Delete Account?</h3>
            <p style={{
              fontSize: "14px",
              color: "#988f81",
              margin: "0 0 8px 0",
              lineHeight: "1.5"
            }}>Are you sure you want to delete the account for <span style={{ color: "#dd901d", fontWeight: "600" }}>{staffToDelete.name}</span>? This action cannot be undone.</p>
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
            }}>You have unsaved data. Are you sure you want to exit without creating the account?</p>
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