import { CustomerShell } from "./customer_shell";
import { useState, useEffect } from "react";
import { useCustomerProfileData } from "./customer_store";
import { couponService } from "../../services/couponService";

export default function CustomerCouponsPage() {
  const [profile] = useCustomerProfileData();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

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
        setToast({ message: 'Failed to load coupons', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [profile?.id]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleClaimCoupon = async (coupon) => {
    if (!profile?.id) {
      setToast({ message: 'Please log in to claim coupons', type: 'error' });
      return;
    }

    try {
      await couponService.claimCoupon(profile.id, coupon.code);
      setToast({ message: `Coupon ${coupon.code} claimed successfully!`, type: 'success' });
      
      // Update coupon to mark as claimed
      setCoupons(prev => prev.map(c => 
        c.id === coupon.id ? { ...c, isClaimed: true } : c
      ));
    } catch (err) {
      console.error('Error claiming coupon:', err);
      setToast({ message: err.message, type: 'error' });
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

  const Toast = ({ message, type = 'success' }) => (
    <div style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '12px 20px',
      backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
      color: '#fff',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 500,
      zIndex: 2000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      {message}
    </div>
  );

  return (
    <CustomerShell activeNav="coupons" profile={profile}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
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
                        onClick={() => handleClaimCoupon(coupon)}
                        style={{
                          padding: '10px 16px',
                          background: '#dd901d',
                          border: 'none',
                          borderRadius: 8,
                          color: '#fff',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </CustomerShell>
  );
}
