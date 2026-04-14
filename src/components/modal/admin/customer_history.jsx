import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════════════

const CUSTOMER_HISTORY_DATA = [
  {
    id: 1,
    customerName: "Maria Garcia",
    date: "2024-12-07",
    time: "2:00 PM - 3:30 PM",
    service: "Hair Color",
    duration: "1h 30m",
    amount: "₱1,200",
    stylist: "Carlos Reyes",
    phone: "09123456789",
    email: "maria@email.com"
  },
  {
    id: 2,
    customerName: "Sarah Johnson",
    date: "2024-12-06",
    time: "10:00 AM - 11:00 AM",
    service: "Hair Cut",
    duration: "1h",
    amount: "₱500",
    stylist: "Antonio Marquez",
    phone: "09134567890",
    email: "sarah@email.com"
  },
  {
    id: 3,
    customerName: "Roberto Silva",
    date: "2024-12-05",
    time: "3:00 PM - 4:30 PM",
    service: "Deep Tissue Massage",
    duration: "1h 30m",
    amount: "₱1,500",
    stylist: "John Dela Cruz",
    phone: "09145678901",
    email: "roberto@email.com"
  },
  {
    id: 4,
    customerName: "Angela Martinez",
    date: "2024-12-04",
    time: "1:00 PM - 2:00 PM",
    service: "Manicure",
    duration: "1h",
    amount: "₱600",
    stylist: "Daniel Smith",
    phone: "09156789012",
    email: "angela@email.com"
  },
  {
    id: 5,
    customerName: "Pedro Santos",
    date: "2024-12-03",
    time: "11:00 AM - 12:30 PM",
    service: "Facial Treatment",
    duration: "1h 30m",
    amount: "₱1,000",
    stylist: "Mike Santos",
    phone: "09167890123",
    email: "pedro@email.com"
  },
  {
    id: 6,
    customerName: "Maria Fernandez",
    date: "2024-11-28",
    time: "2:00 PM - 3:30 PM",
    service: "Hair Treatment",
    duration: "1h 30m",
    amount: "₱900",
    stylist: "Carlos Reyes",
    phone: "09178901234",
    email: "maria.f@email.com"
  },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export const CustomerHistoryModal = ({ isOpen, onClose, staffName = null }) => {
  const [filterType, setFilterType] = useState("all");
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const getFilteredData = () => {
    const today = new Date();
    let data = CUSTOMER_HISTORY_DATA;

    // Filter by staff if staffName is provided
    if (staffName) {
      data = data.filter(item => item.stylist === staffName);
    }

    if (filterType === "all") return data;

    if (filterType === "today") {
      return data.filter(item => item.date === today.toISOString().split('T')[0]);
    }

    if (filterType === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return data.filter(item => new Date(item.date) >= weekAgo);
    }

    if (filterType === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return data.filter(item => new Date(item.date) >= monthAgo);
    }

    return data;
  };

  const filteredData = getFilteredData();

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif"
    }}
    onClick={onClose}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        width: "90%",
        maxWidth: "700px",
        height: "80vh",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(221, 144, 29, 0.2)",
        display: "flex",
        flexDirection: "column"
      }}
      onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#f5f5f5",
            margin: 0
          }}>Customer History</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#988f81",
              transition: "color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.color = "#dd901d"}
            onMouseOut={(e) => e.target.style.color = "#988f81"}
          >
            <CloseIcon size={20} color="currentColor" />
          </button>
        </div>

        {/* Filter Dropdown */}
        <div style={{
          position: "relative",
          marginBottom: "24px"
        }}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "rgba(26, 15, 0, 0.5)",
              border: "1px solid rgba(221, 144, 29, 0.3)",
              borderRadius: "8px",
              color: "#f5f5f5",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
              e.target.style.backgroundColor = "rgba(26, 15, 0, 0.7)";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
              e.target.style.backgroundColor = "rgba(26, 15, 0, 0.5)";
            }}
          >
            <span>
              {filterType === "all" && "All Time"}
              {filterType === "today" && "Today"}
              {filterType === "week" && "This Week"}
              {filterType === "month" && "This Month"}
            </span>
            <ChevronDownIcon size={16} color="#dd901d" />
          </button>

          {filterOpen && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: "0",
              marginTop: "8px",
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(221, 144, 29, 0.3)",
              borderRadius: "8px",
              overflow: "hidden",
              zIndex: 10,
              minWidth: "150px"
            }}>
              {[
                { value: "all", label: "All Time" },
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setFilterType(value);
                    setFilterOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: filterType === value ? "rgba(221, 144, 29, 0.2)" : "transparent",
                    border: "none",
                    color: filterType === value ? "#dd901d" : "#f5f5f5",
                    fontSize: "14px",
                    fontWeight: filterType === value ? "600" : "500",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "all 0.2s ease",
                    textAlign: "left"
                  }}
                  onMouseOver={(e) => !filterType === value && (e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)")}
                  onMouseOut={(e) => !filterType === value && (e.target.style.backgroundColor = "transparent")}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer History List */}
        <div className="customer-history-scroll" style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingRight: "8px"
        }}>
          {filteredData.length > 0 ? (
            filteredData.map((customer) => (
              <div key={customer.id}>
                <button
                  onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "rgba(26, 15, 0, 0.5)",
                    border: "1px solid rgba(221, 144, 29, 0.3)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "all 0.2s ease",
                    textAlign: "left"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.6)";
                    e.currentTarget.style.backgroundColor = "rgba(26, 15, 0, 0.7)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(221, 144, 29, 0.3)";
                    e.currentTarget.style.backgroundColor = "rgba(26, 15, 0, 0.5)";
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}>
                    <div>
                      <p style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#dd901d",
                        margin: "0 0 4px 0"
                      }}>{customer.customerName}</p>
                      <p style={{
                        fontSize: "13px",
                        color: "#988f81",
                        margin: "0 0 4px 0"
                      }}>{customer.date} • {customer.time}</p>
                      <p style={{
                        fontSize: "13px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.service} • {customer.amount}</p>
                    </div>
                    <div style={{
                      textAlign: "right"
                    }}>
                      <p style={{
                        fontSize: "13px",
                        color: "#dd901d",
                        margin: "0",
                        fontWeight: "600"
                      }}>{customer.duration}</p>
                    </div>
                  </div>
                </button>

                {/* Expanded Customer Details */}
                {expandedCustomer === customer.id && (
                  <div style={{
                    backgroundColor: "rgba(221, 144, 29, 0.05)",
                    borderLeft: "3px solid #dd901d",
                    padding: "16px",
                    borderRadius: "6px",
                    marginTop: "8px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px"
                  }}>
                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>Stylist</p>
                      <p style={{
                        fontSize: "14px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.stylist}</p>
                    </div>

                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>Phone</p>
                      <p style={{
                        fontSize: "14px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.phone}</p>
                    </div>

                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>Email</p>
                      <p style={{
                        fontSize: "14px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.email}</p>
                    </div>

                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>Service</p>
                      <p style={{
                        fontSize: "14px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.service}</p>
                    </div>

                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>Duration</p>
                      <p style={{
                        fontSize: "14px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.duration}</p>
                    </div>

                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>Time Slot</p>
                      <p style={{
                        fontSize: "14px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.time}</p>
                    </div>

                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dd901d",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>Amount</p>
                      <p style={{
                        fontSize: "14px",
                        color: "#f5f5f5",
                        margin: "0"
                      }}>{customer.amount}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "200px"
            }}>
              <p style={{
                fontSize: "14px",
                color: "#988f81"
              }}>No customer history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistoryModal;
