import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutOperator } from "../../services/operatorAuth";
import { databaseAPI } from "../../services/databaseApi";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { AddClientModal } from "../../components/modal/superadmin/add_client_modal";
import { ConfirmationDialog } from "../../components/modal/customer/confirmation_dialog";
import { useToast } from "../../components/toast";
import { SUPER_ADMIN_NAV_ITEMS } from "../../components/superadmin/superAdminDashboardIcons";

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

// Tag icon (Heroicons outline style)
const TagIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.293 10.293l-7.586-7.586A1 1 0 008.586 2H4a2 2 0 00-2 2v4.586a1 1 0 00.293.707l7.586 7.586a2 2 0 002.828 0l4.586-4.586a2 2 0 000-2.828z" stroke={color} strokeWidth="1.5"/>
    <circle cx="6.5" cy="6.5" r="1.5" fill={color} />
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

const ROWS_PER_PAGE = 7;
const TABLE_CELL_STYLE = { fontSize: '13px', whiteSpace: 'normal', wordBreak: 'break-word', padding: '12px 8px' };
const TABLE_CHECKBOX_CELL_STYLE = { ...TABLE_CELL_STYLE, width: 40, textAlign: 'center' };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminClientsDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingClients, setIsDeletingClients] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  });

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  // Fetch clients table on mount
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        console.log('[Clients] Fetching customer accounts...');
        
        const response = await fetch('/api/customers/accounts');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[Clients] Fetched accounts:', data);
        
        const accounts = data.accounts || [];
        const cols = ['id', 'name', 'email', 'phone'];
        
        setClientsData({
          id: 'customers',
          name: 'Client Accounts',
          meta: `${data.count || accounts.length} clients`,
          lastUpdated: 'Today',
          rows: accounts,
          cols: cols,
        });
        
        console.log('[Clients] State updated with', accounts.length, 'rows');
      } catch (error) {
        console.error('[Clients] Error fetching data:', error);
        setClientsData({
          id: 'customers',
          name: 'Client Accounts',
          meta: '0 clients',
          rows: [],
          cols: ['id', 'name', 'email', 'phone'],
        });
        showToast({ message: 'Failed to fetch client data', type: 'error', duration: 3000 });
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

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme !== 'light');
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    logoutOperator();
    navigate("/operators/login");
  };

  const handleOpenAddClientModal = () => {
    setIsAddClientModalOpen(true);
  };

  const handleCloseAddClientModal = () => {
    setIsAddClientModalOpen(false);
  };

  const handleSelectClient = (clientId) => {
    setSelectedClients((prev) => {
      const updated = new Set(prev);
      if (updated.has(clientId)) {
        updated.delete(clientId);
      } else {
        updated.add(clientId);
      }
      return updated;
    });
  };

  const handleRemoveClients = async () => {
    if (selectedClients.size === 0) {
      showToast({ message: 'Please select clients to remove', type: 'warning', duration: 2800 });
      return;
    }

    setShowDeleteConfirm(true);
  };

  const confirmRemoveClients = async () => {
    if (selectedClients.size === 0) {
      setShowDeleteConfirm(false);
      return;
    }

    try {
      setIsDeletingClients(true);
      const clientIds = Array.from(selectedClients);
      
      // Delete each selected client
      for (const clientId of clientIds) {
        const response = await fetch(`/api/customers/delete?id=${encodeURIComponent(clientId)}`, { method: 'DELETE' });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body?.error || body?.details || `Failed to delete client ${clientId}`);
        }
      }

      // Remove from UI
      setClientsData((prev) => ({
        ...prev,
        rows: prev.rows.filter((client) => !selectedClients.has(client.id)),
        meta: `${(prev.rows?.length || 0) - selectedClients.size} clients`,
      }));
      
      setSelectedClients(new Set());
      setShowDeleteConfirm(false);
      showToast({ message: `${clientIds.length} client(s) removed successfully`, type: 'success', duration: 2800 });
    } catch (error) {
      console.error('[Clients] Error removing clients:', error);
      showToast({ message: 'Failed to remove clients', type: 'error', duration: 3000 });
    } finally {
      setIsDeletingClients(false);
    }
  };

  const handleAddNewClient = (result) => {
    const newClient = result?.account || result?.client || result?.customer || result;

    if (newClient) {
      setClientsData((prev) => ({
        ...prev,
        rows: [newClient, ...prev.rows],
        meta: `${(prev.rows?.length || 0) + 1} clients`,
      }));
    }

    showToast({ message: 'Client added successfully', type: 'success', duration: 2800 });
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
    <DashboardShell
      navItems={SUPER_ADMIN_NAV_ITEMS}
      activeNav={activeNav}
      roleLabel="Super Administrator"
      roleInitial="S"
      showSidebarHeader={false}
      title="Client Accounts"
      subtitle="BeautyBook Pro • Manage customer database"
      profile={null}
      notifications={[]}
      useSuperAdminHeaderActions={true}
      superAdminNoNotificationsMessage="No recent client registration notifications to review."
      storageKey="superadminSidebarExpanded"
      onLogoutConfirm={handleLogout}
      logoutTitle="Log Out?"
      logoutMessage="Are you sure you want to log out?"
      logoutConfirmText="Yes, Log Out"
      logoutCancelText="Stay Logged In"
    >
      <div className="superadmin-page-content" style={{ paddingTop: '20px' }}>
          <div className="dashboard-panel superadmin-fixed-panel">
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
                
                {/* Remove Button */}
                <button
                  onClick={handleRemoveClients}
                  disabled={selectedClients.size === 0}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedClients.size === 0 ? '#6B6157' : isDarkMode ? '#dd901d' : '#e74c3c',
                    color: isDarkMode ? '#1a1a1a' : '#1a1a1a',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: selectedClients.size === 0 ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: selectedClients.size === 0 ? 0.5 : 1
                  }}
                  onMouseOver={(e) => selectedClients.size > 0 && (e.currentTarget.style.backgroundColor = isDarkMode ? '#e6a326' : '#c0392b')}
                  onMouseOut={(e) => selectedClients.size > 0 && (e.currentTarget.style.backgroundColor = isDarkMode ? '#dd901d' : '#e74c3c')}
                >
                  Remove ({selectedClients.size})
                </button>
              </div>
            </div>

            {/* Clients Table View */}
            {loading ? (
              <div className="container-empty-state">Loading client data...</div>
            ) : clientsData.rows && clientsData.rows.length > 0 ? (
              <div style={{ marginTop: '0px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', width: 40, padding: '12px 8px' }}></th>
                      {clientsData.cols.map((col) => (
                        <th key={col} style={{ textAlign: 'left' }}>{formatColumnName(col)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const startIdx = (currentClientPage - 1) * ROWS_PER_PAGE;
                      const endIdx = startIdx + ROWS_PER_PAGE;
                      return filteredClients.slice(startIdx, endIdx).map((client, idx) => (
                        <tr key={idx} className="db-row">
                          <td style={TABLE_CHECKBOX_CELL_STYLE}>
                            <input
                              type="checkbox"
                              className="client-select-checkbox"
                              checked={selectedClients.has(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              style={{
                                cursor: 'pointer',
                                width: 18,
                                height: 18,
                                margin: 0,
                                accentColor: isDarkMode ? '#FFD700' : '#e91e63',
                                appearance: 'auto',
                              }}
                            />
                          </td>
                          {clientsData.cols.map((col) => {
                            const cellValue = client[col];
                            const displayValue = formatCellValue(cellValue, col);
                            return (
                              <td key={col} style={TABLE_CELL_STYLE}>{displayValue}</td>
                            );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
                {filteredClients.length > 0 && (() => {
                  const totalPages = Math.ceil(filteredClients.length / ROWS_PER_PAGE);
                  const startIdx = (currentClientPage - 1) * ROWS_PER_PAGE + 1;
                  const endIdx = Math.min(currentClientPage * ROWS_PER_PAGE, filteredClients.length);
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(152, 143, 129, 0.2)', marginTop: 'auto' }}>
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
                  <div className="container-empty-state">
                    {searchQuery ? 'No clients match your search' : 'No clients found'}
                  </div>
            )}
          </div>
      </div>

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={handleCloseAddClientModal}
        onSave={handleAddNewClient}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Delete Client Account?"
        message={selectedClients.size > 1
          ? `Are you sure you want to delete these ${selectedClients.size} client accounts? This will remove them from the database.`
          : 'Are you sure you want to delete this client account? This will remove it from the database.'}
        confirmText={isDeletingClients ? 'Deleting…' : 'Delete'}
        cancelText="Keep Client"
        onConfirm={confirmRemoveClients}
        onCancel={() => {
          if (!isDeletingClients) {
            setShowDeleteConfirm(false);
          }
        }}
      />
    </DashboardShell>
  );
}
