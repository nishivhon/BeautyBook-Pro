import { useState, useEffect } from "react";
import { CustomerShell } from "./customer_shell";
import { useCustomerHistoryData, useCustomerProfileData } from "./customer_store";

const StarIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#dd901d" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#dd901d" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export default function CustomerHistoryPage() {
  const [profile] = useCustomerProfileData();
  const [history, setHistory] = useCustomerHistoryData();
  const [historyFilter, setHistoryFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [selectedForRating, setSelectedForRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceCategories, setServiceCategories] = useState([{ id: "All", label: "All" }]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch service categories dynamically from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('[CustomerHistory] Fetching service categories from API');
        setCategoriesLoading(true);
        
        const response = await fetch('/api/services/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[CustomerHistory] Service categories fetched:', data.categories);
        
        // Separate "Other" category and sort the rest
        const otherCategory = data.categories.find(cat => cat.name === 'Other');
        const otherCategories = data.categories.filter(cat => cat.name !== 'Other');
        
        // Build categories array with "All" first, then sorted categories, then "Other" at end
        const categories = [
          { id: "All", label: "All" },
          ...otherCategories.map(cat => ({
            id: cat.name,
            label: cat.name
          }))
        ];
        
        // Add "Other" at the end if it exists
        if (otherCategory) {
          categories.push({
            id: otherCategory.name,
            label: otherCategory.name
          });
        }
        
        setServiceCategories(categories);
      } catch (err) {
        console.error('[CustomerHistory] Error fetching service categories:', err);
        // Fallback to just "All" option if fetch fails
        setServiceCategories([{ id: "All", label: "All" }]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredHistory = history.filter((h) => {
    if (historyFilter === "previous") return h.status === "completed";
    if (historyFilter === "current") return h.status === "upcoming";
    return true;
  });

  const filteredServices = services.filter((service) => {
    if (serviceFilter === "All") return true;
    return service.category === serviceFilter;
  });

  const handleRateService = (id) => {
    const item = history.find((h) => h.id === id);
    setSelectedForRating(item);
    setRatingValue(0);
  };

  const handleSubmitRating = () => {
    if (ratingValue <= 0) return;
    setHistory((prev) =>
      prev.map((h) => (h.id === selectedForRating.id ? { ...h, rated: true, rating: ratingValue } : h))
    );
    setSelectedForRating(null);
  };

  return (
    <CustomerShell activeNav="history" profile={profile}>
      <section className="cdb-section cdb-mounted">
        <div className="cdb-card">
          <h2 className="cdb-section-title">Transaction History</h2>
          
          <div className="cdb-history-header">
            <div className="cdb-history-left">
              <div className="cdb-filter-row">
                {[
                  { id: "all", label: "All" },
                  { id: "previous", label: "Previous" },
                  { id: "current", label: "Current" },
                ].map((filter) => (
                  <button key={filter.id} className={`cdb-filter-btn ${historyFilter === filter.id ? "active" : ""}`} onClick={() => setHistoryFilter(filter.id)}>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="cdb-history-right">
            </div>
          </div>

          <div className="cdb-grid cdb-grid-history">
            {filteredHistory.map((item) => (
              <div key={item.id} className="cdb-item-card">
                <div className="cdb-item-left">
                  <h3 className="cdb-item-title">{item.service}</h3>
                  <p className="cdb-item-subtitle">{item.stylist} · ${item.cost.toFixed(2)}</p>
                  <p className="cdb-date-text">{new Date(item.date).toLocaleDateString()}</p>
                  {item.status === "completed" && (
                    item.rated && <div className="cdb-rating-row">{[1, 2, 3, 4, 5].map((star) => <span key={star}>{star <= item.rating ? "★" : "☆"}</span>)}</div>
                  )}
                </div>
                <div className="cdb-item-right">
                  <span className={`cdb-status-badge ${item.status === "completed" ? "completed" : "upcoming"}`}>{item.status}</span>
                  {item.status === "completed" && !item.rated && (
                    <button className="cdb-btn cdb-btn-secondary" onClick={() => handleRateService(item.id)}>Rate Service</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cdb-section cdb-mounted">
        <div className="cdb-card">
          <h2 className="cdb-section-title">Browse Services Offered</h2>
          
          <div className="cdb-history-header">
            <div className="cdb-history-left">
              <div className="cdb-filter-row">
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "auto",
                  }}
                >
                  <select 
                    value={serviceFilter} 
                    onChange={(e) => setServiceFilter(e.target.value)}
                    style={{
                      padding: "8px 32px 8px 12px",
                      paddingRight: "32px",
                      backgroundColor: "#1a0f00",
                      border: "1px solid rgba(221, 144, 29, 0.3)",
                      borderRadius: "6px",
                      color: "#dd901d",
                      fontSize: "14px",
                      fontWeight: "500",
                      fontFamily: "Inter, sans-serif",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
                      e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(221, 144, 29, 0.3)";
                      e.target.style.backgroundColor = "#1a0f00";
                    }}
                  >
                    {serviceCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#dd901d",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
            </div>
            <div className="cdb-history-right">
            </div>
          </div>

          <div className="cdb-grid cdb-grid-coupons">
            {loading ? (
              <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#9a8b7e", padding: "20px" }}>Loading services...</p>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const serviceName = service.name || service.service_name || "Unknown Service";
                return (
                  <div key={service.id} className="cdb-item-card">
                    <div className="cdb-item-left">
                      <p className="cdb-item-title">{serviceName}</p>
                      <p className="cdb-item-subtitle">{service.description || ""}</p>
                    </div>
                    <div className="cdb-item-right">
                      <p className="cdb-item-subtitle">₱{parseFloat(service.price).toFixed(2)}</p>
                      <p className="cdb-item-subtitle">{service.est_time} min</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#9a8b7e", padding: "20px" }}>No services available in this category</p>
            )}
          </div>
        </div>
      </section>

      {selectedForRating && (
        <div className="cdb-modal-overlay">
          <div className="cdb-modal-card">
            <h3 className="cdb-modal-title">Rate {selectedForRating.service}</h3>
            <p className="cdb-modal-subtitle">Stylist: {selectedForRating.stylist}</p>
            <div className="cdb-star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRatingValue(star)} className={`cdb-star-btn ${ratingValue >= star ? "active" : ""}`}>
                  <StarIcon filled={ratingValue >= star} />
                </button>
              ))}
            </div>
            <div className="cdb-modal-actions">
              <button onClick={() => setSelectedForRating(null)} className="cdb-btn cdb-btn-danger-outline cdb-btn-flex">Cancel</button>
              <button onClick={handleSubmitRating} disabled={ratingValue === 0} className="cdb-btn cdb-btn-primary cdb-btn-flex">Submit Rating</button>
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
}
