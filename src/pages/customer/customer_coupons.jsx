import { CustomerShell } from "./customer_shell";
import { useState } from "react";
import { useCustomerCouponsData, useCustomerProfileData } from "./customer_store";

export default function CustomerCouponsPage() {
  const [profile] = useCustomerProfileData();
  const [coupons, setCoupons] = useCustomerCouponsData();
  const [couponFilter, setCouponFilter] = useState("all");

  const filteredCoupons = coupons.filter((coupon) => {
    if (couponFilter === "all") return true;
    return coupon.category === couponFilter;
  });

  const handleClaimCoupon = (id) => {
    setCoupons((prev) => prev.map((coupon) => (coupon.id === id ? { ...coupon, claimed: true } : coupon)));
  };

  return (
    <CustomerShell activeNav="coupons" profile={profile}>
      <section className="cdb-section cdb-mounted">
        <div className="cdb-card">
          <h2 className="cdb-section-title">Full Coupon List</h2>
          
          <div className="cdb-coupon-header">
            <div className="cdb-coupon-left">
              <div className="cdb-filter-row cdb-filter-wrap">
                {[
                  { id: "all", label: "All" },
                  { id: "limited", label: "Limited Time" },
                  { id: "promo", label: "Promo" },
                  { id: "discount", label: "Discount" },
                ].map((filter) => (
                  <button key={filter.id} className={`cdb-filter-btn ${couponFilter === filter.id ? "active" : ""}`} onClick={() => setCouponFilter(filter.id)}>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="cdb-coupon-right">
            </div>
          </div>

          <div className="cdb-grid cdb-grid-coupons">
            {filteredCoupons.map((coupon) => (
              <div key={coupon.id} className={`cdb-coupon-card ${coupon.status === "expired" ? "expired" : ""}`}>
                <div className="cdb-coupon-left">
                  <h3 className={`cdb-coupon-title ${coupon.status === "expired" ? "expired" : ""}`}>{coupon.discount}</h3>
                  <p className="cdb-coupon-code">{coupon.code} · {coupon.category}</p>
                  <p className="cdb-coupon-description">{coupon.description}</p>
                  <p className="cdb-date-text">Expires: {new Date(coupon.expiration).toLocaleDateString()}</p>
                </div>
                <div className="cdb-coupon-right">
                  {coupon.status === "expired" ? (
                    <span className={`cdb-status-badge ${coupon.status}`}>{coupon.status}</span>
                  ) : coupon.claimed ? (
                    <span className="cdb-status-badge claimed">claimed</span>
                  ) : (
                    <button className="cdb-btn cdb-btn-primary" onClick={() => handleClaimCoupon(coupon.id)}>Claim Coupon</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CustomerShell>
  );
}
