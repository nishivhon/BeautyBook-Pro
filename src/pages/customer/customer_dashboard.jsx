import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerShell } from "./customer_shell";
import { useCustomerCouponsData, useCustomerHistoryData, useCustomerProfileData, useCustomerAppointmentsData } from "./customer_store";

export default function CustomerDashboard() {
	const navigate = useNavigate();
	const [profile, setProfile] = useCustomerProfileData();
	const [history, setHistory] = useCustomerHistoryData();
	const [coupons, setCoupons] = useCustomerCouponsData();
	const [appointments, setAppointments] = useCustomerAppointmentsData();

	
	const [selectedForRating, setSelectedForRating] = useState(null);
	const [ratingValue, setRatingValue] = useState(0);
	const [cancelModalOpen, setCancelModalOpen] = useState(false);
	const [selectedAppointmentToCancel, setSelectedAppointmentToCancel] = useState(null);

	// Fetch full customer data from database (including histories)
	useEffect(() => {
		const fetchFullCustomerData = async () => {
			try {
				if (!profile?.id) {
					console.log('[CustomerDashboard] No customer ID in profile, skipping fetch');
					return;
				}

				console.log('[CustomerDashboard] Fetching full customer data for ID:', profile.id);
				
				// Fetch customer from database
				const response = await fetch(`/api/customers/get?id=${profile.id}`);
				if (!response.ok) {
					console.error('[CustomerDashboard] Failed to fetch customer data:', response.status);
					return;
				}

				const data = await response.json();
				const customer = data.customer;
				
				console.log('[CustomerDashboard] Fetched customer from DB:', customer);
				console.log('[CustomerDashboard] Histories from DB:', customer?.histories);

				// Update profile with full data including histories
				if (customer) {
					const updatedProfile = {
						...profile,
						name: customer.name || profile.name,
						emails: customer.email ? [customer.email] : profile.emails,
						phones: customer.phone ? [customer.phone] : profile.phones,
						histories: customer.histories || [],
					};
					
					console.log('[CustomerDashboard] Updated profile:', updatedProfile);
					setProfile(updatedProfile);
				}
			} catch (error) {
				console.error('[CustomerDashboard] Error fetching customer data:', error);
			}
		};

		fetchFullCustomerData();
	}, [profile?.id]);

	// Refetch history data when profile changes (to pick up new bookings from histories)
	useEffect(() => {
		console.log('[CustomerDashboard] Profile updated:', profile);
		console.log('[CustomerDashboard] Histories array:', profile?.histories);
		
		// Re-render history by calling the hook logic again
		if (profile?.histories && Array.isArray(profile.histories) && profile.histories.length > 0) {
			const transformedHistory = profile.histories.map((item, idx) => ({
				id: item.id || idx,
				date: item.date || new Date().toISOString().split('T')[0],
				service: item.service || 'Service',
				stylist: item.staff || 'Unknown Stylist',
				cost: parseFloat(item.price) || 0,
				status: item.status || 'pending',
				rated: false,
				rating: 0,
			}));
			console.log('[CustomerDashboard] Transformed history:', transformedHistory);
			setHistory(transformedHistory);
		} else {
			console.log('[CustomerDashboard] No histories found or empty array');
		}
	}, [profile, setHistory]);

	console.log('[CustomerDashboard] Final history to display:', history);

	// Only show unrated transactions in the dashboard "Recent Transaction" section
	const recentUnrated = history.filter((item) => !item.rated);

	// Only show unclaimed, non-expired coupons in the dashboard coupons section
	const recentUnclaimedCoupons = coupons.filter((coupon) => !coupon.claimed && coupon.status !== "expired");

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

	// Helper function to determine if appointment can be cancelled (not within 24 hours)
	const canCancelAppointment = (appointmentDate, appointmentTime) => {
		const now = new Date();
		const appointmentDateTime = new Date(`${appointmentDate}T${convertTo24Hour(appointmentTime)}`);
		const hoursDifference = (appointmentDateTime - now) / (1000 * 60 * 60);
		return hoursDifference > 24;
	};

	// Helper function to convert 12-hour to 24-hour format
	const convertTo24Hour = (time12) => {
		const [time, period] = time12.split(' ');
		let [hours, minutes] = time.split(':').map(Number);
		if (period === 'PM' && hours !== 12) hours += 12;
		if (period === 'AM' && hours === 12) hours = 0;
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
	};

	// Helper function to determine appointment status
	const getAppointmentStatus = (appointmentDate) => {
		const today = new Date().toISOString().split('T')[0];
		return appointmentDate === today ? 'today' : 'upcoming';
	};

	// Handle cancel appointment button click
	const handleInitiateCancelAppointment = (appointment) => {
		const canCancel = canCancelAppointment(appointment.date, appointment.time);
		if (!canCancel) {
			setSelectedAppointmentToCancel(appointment);
			setCancelModalOpen(true);
			return;
		}
		setSelectedAppointmentToCancel(appointment);
		setCancelModalOpen(true);
	};

	// Handle confirm cancellation
	const handleConfirmCancelAppointment = () => {
		if (!selectedAppointmentToCancel) return;

		setAppointments((prev) =>
			prev.map((appt) =>
				appt.id === selectedAppointmentToCancel.id
					? { ...appt, cancelled: true, status: 'cancelled' }
					: appt
			)
		);

		setCancelModalOpen(false);
		setSelectedAppointmentToCancel(null);
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
		<section className="cdb-section cdb-section-appointments cdb-mounted">
		<div className="cdb-card">
			<h2 className="cdb-section-title">Upcoming Appointment</h2>
			{appointments && appointments.length > 0 && !appointments[0]?.cancelled ? (
				<div className="confirm-card">
					<div className="confirm-service-row">
						<div className="confirm-service-left">
							<div className="confirm-svc-text">
								<span className="confirm-svc-name">{appointments[0].service}</span>
								<span className="confirm-svc-duration">{appointments[0].duration}</span>
							</div>
						</div>
						<div className="confirm-svc-meta">
							<span className="confirm-svc-datetime">{new Date(appointments[0].date).toLocaleDateString()} · {appointments[0].time}</span>
							<span className="confirm-svc-price">₱{appointments[0].price.toFixed(2)}</span>
						</div>
					</div>

					{appointments[0].service && (
						<>
							<div style={{ marginBottom: 12 }}>
								<div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-tan)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8 }}>Services Selected</div>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span style={{ color: 'var(--color-light)' }}>{appointments[0].service}</span>
										<span style={{ color: 'var(--color-tan)' }}>₱{appointments[0].price.toFixed(2)}</span>
									</div>
								</div>
							</div>
							<div className="confirm-details">
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Name</span>
										<span className="confirm-detail-value">{appointments[0].customerName}</span>
									</div>
								</div>
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Email</span>
										<span className="confirm-detail-value">{appointments[0].email}</span>
									</div>
								</div>
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Phone</span>
										<span className="confirm-detail-value">{appointments[0].phone}</span>
									</div>
								</div>
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Stylist</span>
										<span className="confirm-detail-value">{appointments[0].stylist}</span>
									</div>
								</div>
							</div>
						</>
					)}

					<div className="confirm-bottom-row">
						<div className="confirm-ref-pill">Ref. No.: {appointments[0].refNo}</div>
						<div className="confirm-reminder-box">
							<p className="confirm-reminder-text">You'll receive a reminder 15 minutes before your appointment.</p>
						</div>
					</div>

					<div className="cdb-appointment-actions">
						{canCancelAppointment(appointments[0].date, appointments[0].time) ? (
							<button className="cdb-btn cdb-btn-secondary" onClick={() => handleInitiateCancelAppointment(appointments[0])} style={{ flex: 1 }}>Cancel Appointment</button>
						) : (
							<div style={{ flex: 1, textAlign: 'center', color: 'var(--color-tan)', fontSize: '13px', padding: '10px 0' }}>Cannot cancel within 24 hours of appointment</div>
						)}
					</div>
				</div>
			) : appointments && appointments.length > 0 && appointments[0]?.cancelled ? (
				<div className="cdb-appointment-receipt cdb-appointment-cancelled">
					<div className="cdb-appointment-header">
						<h3 className="cdb-appointment-title">{appointments[0].service}</h3>
						<span className="cdb-appointment-status" style={{ background: 'rgba(152, 143, 129, 0.15)', color: 'var(--color-tan)' }}>
							Cancelled
						</span>
					</div>
					<div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-tan)', fontSize: '14px' }}>
						This appointment has been cancelled.
					</div>
				</div>
			) : (
				<div className="cdb-appointment-empty">
					<div className="cdb-appointment-empty-icon">📅</div>
					<div className="cdb-appointment-empty-text">No upcoming appointments</div>
					<div className="cdb-appointment-empty-subtext">Book your next appointment to see it here.</div>
				</div>
			)}
		</div>
		</section>
			<section className="cdb-section cdb-mounted">
			<div className="cdb-card">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<h2 className="cdb-section-title">Recent Transaction</h2>
					<div>
						<button className="cdb-btn cdb-btn-secondary" onClick={() => navigate("/customer/history")}>View Full Transaction History</button>
					</div>
				</div>
					<div className="cdb-grid cdb-grid-history">
						{recentUnrated && recentUnrated.length > 0 ? (
							recentUnrated.map((item) => (
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
										{!item.rated && (
											<button className="cdb-btn cdb-btn-secondary" onClick={() => handleRateService(item.id)}>Rate Service</button>
										)}
									</div>
								</div>
							))
						) : (
							<div style={{ padding: '20px', gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>
								<p>No recent transactions needing rating</p>
							</div>
						)}
					</div>
				</div>
			</section>

			<section className="cdb-section cdb-mounted">
			<div className="cdb-card">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<h2 className="cdb-section-title">Coupons</h2>
					<div>
						<button className="cdb-btn cdb-btn-secondary" onClick={() => navigate("/customer/coupons")}>View Full Coupons</button>
					</div>
				</div>
					<div className="cdb-grid cdb-grid-coupons">
						{recentUnclaimedCoupons.map((coupon) => (
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

			{cancelModalOpen && selectedAppointmentToCancel && (
				<div className="cdb-cancel-modal-overlay">
					<div className="cdb-cancel-modal-card">
						<h3 className="cdb-cancel-modal-title">Cancel Appointment?</h3>
						<p className="cdb-cancel-modal-message">
							Are you sure you want to cancel your {selectedAppointmentToCancel.service} appointment on {new Date(selectedAppointmentToCancel.date).toLocaleDateString()} at {selectedAppointmentToCancel.time}?
						</p>
						{!canCancelAppointment(selectedAppointmentToCancel.date, selectedAppointmentToCancel.time) && (
							<div className="cdb-cancel-modal-warning">
								⚠️ Warning: You are cancelling within 24 hours of your appointment. This may affect future booking privileges.
							</div>
						)}
						<div className="cdb-cancel-modal-actions">
							<button className="cdb-btn cdb-btn-primary" onClick={() => {
								setCancelModalOpen(false);
								setSelectedAppointmentToCancel(null);
							}}>
								Keep Appointment
							</button>
							<button className="cdb-btn cdb-btn-danger-outline" onClick={handleConfirmCancelAppointment}>
								Confirm Cancellation
							</button>
						</div>
					</div>
				</div>
			)}
		</CustomerShell>
	);
}