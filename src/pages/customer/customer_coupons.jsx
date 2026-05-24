import { CustomerShell } from "./customer_shell";
import { useState, useEffect } from "react";
import { useCustomerProfileData } from "./customer_store";
import { couponService } from "../../services/couponService";
import { useToast } from "../../components/toast";

export default function CustomerCouponsPage() {
  const [profile] = useCustomerProfileData();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));
  const { showToast } = useToast();

  // Load all coupons with claimed status on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      if (!profile?.id) return;
      
      setLoading(true);
      try {
        const data = await couponService.getAllCouponsWithStatus(profile.id);
        setCoupons(data);
      } catch (err) {
        console.error('Error loading coupons:', err);
        showToast({ message: 'Failed to load coupons', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [profile?.id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClaimCoupon = async (coupon) => {
    if (!profile?.id) {
      showToast({ message: 'Please log in to claim coupons', type: 'error' });
      return;
    }

    try {
      await couponService.claimCoupon(profile.id, coupon.code);
      showToast({ message: `Coupon ${coupon.code} claimed successfully!`, type: 'success' });
      
      // Update coupon to mark as claimed
      setCoupons(prev => prev.map(c => 
        c.id === coupon.id ? { ...c, isClaimed: true } : c
      ));
    } catch (err) {
      console.error('Error claiming coupon:', err);
      showToast({ message: err.message, type: 'error' });
    }
  };

  const formatDiscount = (coupon) => {
    if (coupon.value_type === 'percentage') {
      return `${coupon.value}%`;
    } else {
      return `₱${coupon.value.toFixed(2)}`;
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  return (
    <CustomerShell activeNav="coupons" profile={profile}>
      <section className="cdb-section cdb-mounted">
        <div className="cdb-card">
          <h2 className="cdb-section-title">Coupons</h2>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              Loading coupons...
            </div>
          ) : coupons.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              No coupons at the moment.
            </div>
          ) : (
            <div className="cdb-grid cdb-grid-coupons">
              {coupons.map((coupon) => (
                isMobile ? (
                  <div
                    key={coupon.id}
                    className={`cdb-coupon-card ${coupon.status === "expired" ? "expired" : ""}`}
                    style={{ flexDirection: "column", alignItems: "flex-start" }}
                  >
                    <div className="cdb-coupon-left">
                      <h3 className={`cdb-coupon-title ${coupon.status === "expired" ? "expired" : ""}`}>{formatDiscount(coupon)} OFF</h3>
                      <p className="cdb-coupon-code">
                        {coupon.code}{coupon.category ? ` · ${coupon.category}` : ""}
                      </p>
                      <p className="cdb-coupon-description">{coupon.description || 'Special discount offer'}</p>
                      <p className="cdb-date-text">Expires: {new Date(coupon.end_date).toLocaleDateString()}</p>
                    </div>
                    <div className="cdb-coupon-right" style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                      {coupon.status === "expired" ? (
                        <span className={`cdb-status-badge ${coupon.status}`}>{coupon.status}</span>
                      ) : coupon.isClaimed ? (
                        <span className="cdb-status-badge claimed">claimed</span>
                      ) : (
                        <button
                          className="cdb-btn cdb-btn-primary"
                          type="button"
                          onClick={() => handleClaimCoupon(coupon)}
                          style={{ width: '100%' }}
                        >
                          Claim Coupon
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={coupon.id} className="cdb-coupon-card">
                    <div className="cdb-coupon-left">
                      <h3 className="cdb-coupon-title">{formatDiscount(coupon)} OFF</h3>
                      <p className="cdb-coupon-code">{coupon.code}</p>
                      <p className="cdb-coupon-description">{coupon.description || 'Special discount offer'}</p>
                      <p className="cdb-date-text">Valid: {formatDateRange(coupon.start_date, coupon.end_date)}</p>
                    </div>
                    <div className="cdb-coupon-right">
                      {!coupon.isClaimed && (
                        <button 
                          className="cdb-btn cdb-btn-primary" 
                          type="button"
                          onClick={() => handleClaimCoupon(coupon)}
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </section>
    </CustomerShell>
  );
}
