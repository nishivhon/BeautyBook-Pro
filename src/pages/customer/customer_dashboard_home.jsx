import { useNavigate } from "react-router-dom";
import { CustomerShell } from "./customer_shell";
import { useCustomerCouponsData, useCustomerHistoryData, useCustomerProfileData } from "./customer_store";

export default function CustomerDashboardHome() {
  const navigate = useNavigate();
  const [profile] = useCustomerProfileData();
  const [history] = useCustomerHistoryData();
  const [coupons] = useCustomerCouponsData();

  const latestReceipt = history.find((h) => h.status === "completed") || history[0];
  const summaryCoupons = coupons.filter((c) => c.status === "available" && !c.claimed).slice(0, 2);

  return (
    <CustomerShell activeNav="dashboard" profile={profile}>
      <div className="cdb-summary-row">
        <section className="cdb-card cdb-summary-row-card">
          <h2 className="cdb-section-title">Profile Summary</h2>
          <div className="cdb-profile-summary-row">
            <div className="cdb-avatar">{profile.name[0]}</div>
            <div>
              <p className="cdb-field-value">{profile.name}</p>
              <p className="cdb-date-text">Primary Email: {profile.emails[0]}</p>
              <p className="cdb-date-text">Primary Phone: {profile.phones[0]}</p>
            </div>
          </div>
          <button className="cdb-btn cdb-btn-secondary" onClick={() => navigate("/customer/profile")}>View Full Profile</button>
        </section>

        <section className="cdb-card cdb-summary-row-card">
          <h2 className="cdb-section-title">Latest Receipt</h2>
          <div className="cdb-item-card">
            <h3 className="cdb-item-title">{latestReceipt.service}</h3>
            <p className="cdb-item-subtitle">{latestReceipt.stylist}</p>
            <p className="cdb-date-text">Date: {new Date(latestReceipt.date).toLocaleDateString()}</p>
            <p className="cdb-date-text">Amount: ${latestReceipt.cost.toFixed(2)}</p>
          </div>
          <button className="cdb-btn cdb-btn-secondary" onClick={() => navigate("/customer/history")}>View Full History</button>
        </section>

        <section className="cdb-card cdb-summary-row-card">
          <h2 className="cdb-section-title">Coupon Highlights</h2>
          <div className="cdb-grid">
            {summaryCoupons.map((coupon) => (
              <div key={coupon.id} className="cdb-item-card">
                <p className="cdb-item-title">{coupon.discount}</p>
                <p className="cdb-item-subtitle">{coupon.code} · {coupon.category}</p>
              </div>
            ))}
          </div>
          <button className="cdb-btn cdb-btn-secondary" onClick={() => navigate("/customer/coupons")}>View Full Coupons</button>
        </section>
      </div>
    </CustomerShell>
  );
}
