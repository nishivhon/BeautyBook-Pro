import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { databaseAPI } from "../../services/databaseApi";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import DatabaseTableModal from "../../components/modal/superadmin/DatabaseTableModal";
import { EditServiceModal } from "../../components/modal/superadmin/edit_service_modal";
import { AddServiceModal } from "../../components/modal/superadmin/add_service_modal";
import { Toast } from "../../components/toast";

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

// Tag icon (Heroicons outline style)
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

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon, path: "/superadmin/dashboard" },
  { id: "staff-management", label: "Staff Management", icon: UserIcon, path: "/superadmin/users" },
  { id: "clients", label: "Client Accounts", icon: DatabaseIcon, path: "/superadmin/clients" },
  { id: "coupons", label: "Coupons", icon: DatabaseIcon, path: "/superadmin/coupons" },
  { id: "logs", label: "Logs", icon: DatabaseIcon, path: "/superadmin/logs" },
  { id: "services", label: "Services", icon: DatabaseIcon, path: "/superadmin/services" },
  { id: "security", label: "Security", icon: ShieldIcon, path: "/superadmin/security" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminServicesDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("services");
  const [mounted, setMounted] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  });
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTable, setModalTable] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [toastType, setToastType] = useState("success");

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

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme !== 'light');
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  // Fetch services table on mount
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        console.log('[Services] Fetching services table...');
        const tablesInfo = await databaseAPI.getTablesInfo(['services']);
        
        if (tablesInfo && Array.isArray(tablesInfo)) {
          console.log('[Services] Fetched tables info:', tablesInfo);
          
          const tableInfo = tablesInfo[0];
          if (!tableInfo) return;
          
          // Get column names
          const colNames = tableInfo.columns?.map(col => col.column_name) || [];
          
          // Fetch actual data
          let rowData = [];
          try {
            const dataResult = await databaseAPI.getTableData('services', 10000, 0);
            rowData = (dataResult.data || []).filter(service => !service.is_deleted);
            console.log(`[Services] Fetched ${rowData.length} rows`);
          } catch (dataError) {
            console.warn(`[Services] Error fetching data:`, dataError);
          }
          
          setServicesData({
            id: 'services',
            name: 'Services',
            meta: `${tableInfo.rowCount} rows`,
            lastUpdated: 'Today',
            rows: rowData,
            cols: colNames,
          });
        }
      } catch (error) {
        console.error('[Services] Error fetching data:', error);
        displayToast('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setToastType(/^(failed|error|invalid)/i.test(message) ? "error" : "success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  // Format cell display value
  const formatCellValue = (cellValue, colName) => {
    if (typeof cellValue === 'boolean') {
      return String(cellValue);
    }
    return cellValue || '';
  };

  // Format column names for display
  const formatColumnName = (colName) => {
    const columnMap = {
      'service_name': 'service name',
      'est_time': 'est. time'
    };
    return columnMap[colName] || colName;
  };

  const getServiceName = (service) =>
    service?.name || service?.service_name || service?.serviceName || '';

  const getServiceCategory = (service) =>
    service?.category || service?.service_category || service?.serviceCategory || '';

  const matchesServiceQuery = (service, query) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return true;

    const name = getServiceName(service).toLowerCase();
    const category = getServiceCategory(service).toLowerCase();
    return name.includes(q) || category.includes(q);
  };

  const openViewModal = () => {
    setModalTable(servicesData);
    setModalMode("view");
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    setShowModal(false);
    displayToast('Changes saved.');
  };

  // Handle editing a service
  const handleEditService = (service) => {
    setEditingService(service);
    setIsEditServiceModalOpen(true);
  };

  const handleCloseEditServiceModal = () => {
    setIsEditServiceModalOpen(false);
    setEditingService(null);
  };

  // Handle saving edited service
  const handleSaveService = (updatedService) => {
    setServicesData(prev => ({
      ...prev,
      rows: updatedService.is_deleted
        ? prev.rows.filter(service => service.id !== updatedService.id)
        : prev.rows.map(service =>
            service.id === updatedService.id ? { ...service, ...updatedService } : service
          )
    }));
            displayToast(updatedService.is_deleted ? 'Service removed successfully' : 'Service updated successfully');
  };

  // Handle opening add modal
  const handleOpenAddServiceModal = () => {
    setIsAddServiceModalOpen(true);
  };

  // Handle closing add modal
  const handleCloseAddServiceModal = () => {
    setIsAddServiceModalOpen(false);
  };

  // Handle saving new service
  const handleAddNewService = (newService) => {
    setServicesData(prev => ({
      ...prev,
      rows: [newService, ...prev.rows]
    }));
    displayToast('Service created successfully');
  };

  return (
    <DashboardShell
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      roleLabel="Super Administrator"
      roleInitial="S"
      showSidebarHeader={false}
      title="Services Management"
      subtitle="BeautyBook Pro • Manage services catalog"
      profile={null}
      notifications={[]}
      useSuperAdminHeaderActions={true}
      superAdminNoNotificationsMessage="No recent super admin system notifications for services monitoring."
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
              <div className="panel-title">
                {searchQuery 
                  ? `Search Results (${(servicesData.rows || []).filter(service => matchesServiceQuery(service, searchQuery)).length})`
                  : `All Services (${servicesData.rows?.length || 0})`
                }
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search by service name or category..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentServicePage(1);
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
                  onClick={handleOpenAddServiceModal}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isDarkMode ? '#dd901d' : '#e74c3c',
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
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#e6a326' : '#c0392b'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#dd901d' : '#e74c3c'}
                >
                  Add Service
                </button>
              </div>
            </div>

            {/* Services Table View */}
            {loading ? (
              <div className="container-empty-state">Loading services...</div>
            ) : (() => {
              const filteredServices = servicesData.rows ? servicesData.rows.filter(service =>
                matchesServiceQuery(service, searchQuery)
              ) : [];
              
              return servicesData.rows && servicesData.rows.length > 0 ? (
                filteredServices.length > 0 ? (
                  <div style={{ marginTop: '0px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      {servicesData.cols.map((col) => (
                        <th key={col} style={{ textAlign: 'left' }}>{formatColumnName(col)}</th>
                      ))}
                      <th style={{ textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Filter services by search query
                      const filteredServices = servicesData.rows.filter(service =>
                        matchesServiceQuery(service, searchQuery)
                      );
                      const itemsPerPage = 6;
                      const startIdx = (currentServicePage - 1) * itemsPerPage;
                      const endIdx = startIdx + itemsPerPage;
                      return filteredServices.slice(startIdx, endIdx).map((service, idx) => (
                      <tr key={idx} className="db-row">
                          {servicesData.cols.map((col) => {
                          const cellValue = service[col];
                          const displayValue = formatCellValue(cellValue, col);
                          return (
                            <td
                              key={col}
                              style={{
                                fontSize: '13px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 0,
                              }}
                              title={displayValue}
                            >
                              {displayValue}
                            </td>
                          );
                        })}
                        <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => handleEditService(service)}
                            title="Edit service"
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
                            Edit
                          </button>
                        </td>
                      </tr>
                    ));
                    })()}
                  </tbody>
                </table>
                {(() => {
                  const filteredServices = servicesData.rows.filter(service =>
                    matchesServiceQuery(service, searchQuery)
                  );
                  if (filteredServices.length === 0) return null;
                  
                  const itemsPerPage = 6;
                  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
                  const startIdx = (currentServicePage - 1) * itemsPerPage + 1;
                  const endIdx = Math.min(currentServicePage * itemsPerPage, filteredServices.length);
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(152, 143, 129, 0.2)', marginTop: 'auto' }}>
                      <div style={{ color: '#988f81', fontSize: '13px' }}>
                        Showing {startIdx}–{endIdx} of {filteredServices.length} services
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setCurrentServicePage(p => Math.max(1, p - 1))}
                          disabled={currentServicePage === 1}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentServicePage === 1 ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentServicePage === 1 ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentServicePage === 1 ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentServicePage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentServicePage !== 1) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          ← Previous
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#988f81', fontSize: '13px' }}>
                          Page {currentServicePage} of {totalPages}
                        </div>
                        <button
                          onClick={() => setCurrentServicePage(p => Math.min(totalPages, p + 1))}
                          disabled={currentServicePage === totalPages}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(152, 143, 129, 0.3)',
                            background: currentServicePage === totalPages ? 'rgba(152, 143, 129, 0.05)' : 'transparent',
                            color: currentServicePage === totalPages ? '#6B6157' : '#988f81',
                            fontSize: '13px',
                            cursor: currentServicePage === totalPages ? 'default' : 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (currentServicePage !== totalPages) {
                              e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                              e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentServicePage !== totalPages) {
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
                  <div className="container-empty-state">
                    No services match your search
                  </div>
                )
              ) : (
                <div className="container-empty-state">No services found</div>
              );
            })()}
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

      {/* ─── EDIT SERVICE MODAL ─── */}
      <EditServiceModal
        service={editingService}
        isOpen={isEditServiceModalOpen}
        onClose={handleCloseEditServiceModal}
        onSave={handleSaveService}
      />

      {/* ─── ADD SERVICE MODAL ─── */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={handleCloseAddServiceModal}
        onSave={handleAddNewService}
      />

      {/* ─── TOAST ─── */}
      <Toast isVisible={showToast} message={toastMessage} type={toastType} duration={2800} />
    </DashboardShell>
  );
}
