import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerShell } from "./customer_shell";
import { useCustomerCouponsData, useCustomerHistoryData, useCustomerProfileData } from "./customer_store";

export default function CustomerDashboard() {
	const navigate = useNavigate();
	const [profile] = useCustomerProfileData();
	const [history, setHistory] = useCustomerHistoryData();
	const [coupons, setCoupons] = useCustomerCouponsData();

	const [historyFilter, setHistoryFilter] = useState("all");
	const [selectedForRating, setSelectedForRating] = useState(null);
	const [ratingValue, setRatingValue] = useState(0);
	const [couponFilter, setCouponFilter] = useState("all");

	const filteredHistory = history.filter((item) => {
		if (historyFilter === "previous") return item.status === "completed";
		if (historyFilter === "current") return item.status === "upcoming";
		return true;
	});

	const filteredCoupons = coupons.filter((coupon) => {
		if (couponFilter === "all") return true;
		return coupon.category === couponFilter;
	});

	const profileInitial = (profile.name || "?").trim().charAt(0).toUpperCase() || "?";



	const handleRateService = (id) => {
		const item = history.find((h) => h.id === id);
		setSelectedForRating(item || null);
		setRatingValue(0);
	};

	const handleSubmitRating = () => {
		if (!selectedForRating || ratingValue <= 0) return;
		setHistory((prev) =>
			prev.map((h) => (h.id === selectedForRating.id ? { ...h, rated: true, rating: ratingValue } : h))
		);
		setSelectedForRating(null);
	};

	const handleClaimCoupon = (id) => {
		setCoupons((prev) => prev.map((coupon) => (coupon.id === id ? { ...coupon, claimed: true } : coupon)));
	};

	return (
		<CustomerShell activeNav="dashboard" profile={profile}>
			<section className="cdb-section cdb-mounted">
			<div className="cdb-card">
				<h2 className="cdb-section-title">My Profile</h2>
				<>
					<div className="cdb-grid cdb-grid-profile cdb-grid-avatar">
									<div className="cdb-profile-avatar-col">
										<div className="cdb-avatar cdb-avatar-dashboard" aria-label={`${profile.name || "Customer"} avatar`}>
											<span className="cdb-avatar-initial">{profileInitial}</span>
										</div>
										</div>
										<div className="cdb-profile-info-col">
											<div>
												<label className="cdb-field-label">Name</label>
												<p className="cdb-field-value cdb-field-value-lg">{profile.name}</p>
											</div>
											<div>
												<label className="cdb-field-label">Email</label>
												<p className="cdb-field-value cdb-field-value-lg">{profile.emails && profile.emails.length ? profile.emails[0] : ""}</p>
											</div>
											<div>
												<label className="cdb-field-label">Phone</label>
												<p className="cdb-field-value cdb-field-value-lg">{profile.phones && profile.phones.length ? profile.phones[0] : ""}</p>
											</div>
											<div>
												<label className="cdb-field-label">Notification Preference</label>
												<p className="cdb-field-value cdb-field-value-lg">{profile.notificationPreference ? profile.notificationPreference.toUpperCase() : ""}</p>
											</div>
											<div className="cdb-action-row">
												<button className="cdb-btn cdb-btn-edit" onClick={() => navigate("/customer/profile")}>Edit Profile</button>
											</div>
										</div>
									</div>
								</>
				</div>
			</section>

			<section className="cdb-section cdb-mounted">
			<div className="cdb-card">
				<h2 className="cdb-section-title">Service History</h2>
					<div className="cdb-history-header">
						<div className="cdb-history-left">
							<button className="cdb-btn cdb-btn-secondary" onClick={() => navigate("/customer/history")}>View Full Transaction History</button>
						</div>
						<div className="cdb-history-right">
							<div className="cdb-filter-row">
								{[
									{ id: "current", label: "Current" },
									{ id: "previous", label: "Previous" },
									{ id: "all", label: "All" },
								].map((filter) => (
									<button key={filter.id} className={`cdb-filter-btn ${historyFilter === filter.id ? "active" : ""}`} onClick={() => setHistoryFilter(filter.id)}>
										{filter.label}
									</button>
								))}
							</div>
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
				<h2 className="cdb-section-title">Coupons</h2>
					<div className="cdb-coupon-header">
						<div className="cdb-coupon-left">
							<button className="cdb-btn cdb-btn-secondary" onClick={() => navigate("/customer/coupons")}>View Full Coupons</button>
						</div>
						<div className="cdb-coupon-right">
							<div className="cdb-filter-row cdb-filter-wrap">
								{[
									{ id: "discount", label: "Discount" },
									{ id: "promo", label: "Promo" },
									{ id: "limited", label: "Limited Time" },
									{ id: "all", label: "All" },
								].map((filter) => (
									<button key={filter.id} className={`cdb-filter-btn ${couponFilter === filter.id ? "active" : ""}`} onClick={() => setCouponFilter(filter.id)}>
										{filter.label}
									</button>
								))}
							</div>
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

			{selectedForRating && (
				<div className="cdb-modal-overlay">
					<div className="cdb-modal-card">
						<h3 className="cdb-modal-title">Rate {selectedForRating.service}</h3>
						<p className="cdb-modal-subtitle">Stylist: {selectedForRating.stylist}</p>
						<div className="cdb-star-row">
							{[1, 2, 3, 4, 5].map((star) => (
								<button key={star} onClick={() => setRatingValue(star)} className={`cdb-star-btn ${ratingValue >= star ? "active" : ""}`}>
									{star <= ratingValue ? "★" : "☆"}
								</button>
							))}
						</div>
						<div className="cdb-modal-actions">
							<button className="cdb-btn cdb-btn-danger-outline cdb-btn-flex" onClick={() => setSelectedForRating(null)}>Cancel</button>
							<button className="cdb-btn cdb-btn-primary cdb-btn-flex" onClick={handleSubmitRating} disabled={ratingValue === 0}>Submit Rating</button>
						</div>
					</div>
				</div>
			)}
		</CustomerShell>
	);
}