import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerShell } from "./customer_shell";
import { useCustomerCouponsData, useCustomerHistoryData, useCustomerProfileData, useCustomerAppointmentsData } from "./customer_store";
import { couponService } from "../../services/couponService";
import { useToast } from "../../components/toast";

const CUSTOMER_CACHE_TTL_MS = 5 * 60 * 1000;

const getCustomerCacheKey = (customerId) => `customerDashboardCache:${customerId}`;

const readCustomerCache = (customerId) => {
	if (typeof window === "undefined" || !customerId) return null;
	try {
		const raw = localStorage.getItem(getCustomerCacheKey(customerId));
		if (!raw) return null;

		const parsed = JSON.parse(raw);
		if (!parsed?.savedAt || !parsed?.customer) return null;

		if (Date.now() - parsed.savedAt > CUSTOMER_CACHE_TTL_MS) return null;
		return parsed.customer;
	} catch (error) {
		console.warn("[CustomerDashboard] Failed to read cache:", error);
		return null;
	}
};

const writeCustomerCache = (customerId, customer) => {
	if (typeof window === "undefined" || !customerId || !customer) return;
	try {
		localStorage.setItem(
			getCustomerCacheKey(customerId),
			JSON.stringify({ savedAt: Date.now(), customer })
		);
	} catch (error) {
		console.warn("[CustomerDashboard] Failed to write cache:", error);
	}
};

const StarIcon = ({ filled = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#dd901d" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#dd901d" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export default function CustomerDashboard() {
	const navigate = useNavigate();
	const [profile, setProfile] = useCustomerProfileData();
	const [history, setHistory] = useCustomerHistoryData();
	const [coupons, setCoupons] = useCustomerCouponsData();
	const [appointments, setAppointments] = useCustomerAppointmentsData();
	const { showToast } = useToast();

	
	const [selectedForRating, setSelectedForRating] = useState(null);
	const [ratingValue, setRatingValue] = useState(0);
	const [cancelModalOpen, setCancelModalOpen] = useState(false);
	const [selectedAppointmentToCancel, setSelectedAppointmentToCancel] = useState(null);
	const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));
	const avatarSize = isMobile ? 70 : 230;
	const avatarFontSize = isMobile ? 22 : 62;
	const avatarStyle = {
		width: avatarSize,
		height: avatarSize,
		fontSize: avatarFontSize,
	};
	const sectionHeaderStyle = {
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		marginBottom: isMobile ? '16px' : '20px',
	};
	const sectionHeaderRowStyle = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: '12px',
	};
	const sectionHeaderDividerStyle = {
		width: '100%',
		height: '1px',
		backgroundColor: 'rgba(221, 144, 29, 0.12)',
	};

	// Fetch full customer data from database (including histories)
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		let isMounted = true;

		const applyCustomerData = (customer) => {
			if (!customer || !isMounted) return;

			const updatedProfile = {
				...profile,
				name: customer.name || profile.name,
				emails: customer.email ? [customer.email] : profile.emails,
				phones: customer.phone ? [customer.phone] : profile.phones,
				histories: customer.histories || [],
				// Map notif_pref (could be 'email'|'sms' or a contact string) to notificationPreference
				notificationPreference: (function() {
					if (!customer?.notif_pref) return profile.notificationPreference || "";
					const val = String(customer.notif_pref || "").trim();
					if (val === 'email' || val === 'sms') return val;
					if (val.includes('@')) return 'email';
					if (/\d/.test(val)) return 'sms';
					return profile.notificationPreference || "";
				})(),
			};

			console.log('[CustomerDashboard] Updated profile:', updatedProfile);
			setProfile(updatedProfile);
			writeCustomerCache(profile.id, customer);
		};

		const fetchFullCustomerData = async ({ force = false } = {}) => {
			try {
				if (!profile?.id) {
					console.log('[CustomerDashboard] No customer ID in profile, skipping fetch');
					return;
				}

				const cachedCustomer = !force ? readCustomerCache(profile.id) : null;
				if (cachedCustomer) {
					console.log('[CustomerDashboard] Using cached customer data for ID:', profile.id);
					applyCustomerData(cachedCustomer);
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
					applyCustomerData(customer);
				}
			} catch (error) {
				console.error('[CustomerDashboard] Error fetching customer data:', error);
			}
		};

		fetchFullCustomerData();

		return () => {
			isMounted = false;
		};
	}, [profile?.id]);

	// Refetch history data when profile changes (to pick up new bookings from histories)
	useEffect(() => {
		console.log('[CustomerDashboard] Profile updated:', profile);
		console.log('[CustomerDashboard] Histories array:', profile?.histories);
		
		// Re-render history by calling the hook logic again
		if (profile?.histories && Array.isArray(profile.histories) && profile.histories.length > 0) {
			const transformedHistory = profile.histories
				.map((item, idx) => ({
					id: item.id || idx,
					date: item.date || new Date().toISOString().split('T')[0],
					service: item.service || 'Service',
					stylist: item.staff || 'Unknown Stylist',
					cost: parseFloat(item.price) || 0,
					status: item.status === 'done' ? 'completed' : item.status === 'current' ? 'upcoming' : item.status || 'pending',
					rated: item.rated || false,
					rating: item.rating || 0,
					rated_at: item.rated_at || null,
				}))
				.reduce((uniqueHistory, item) => {
					const existingIndex = uniqueHistory.findIndex((entry) => String(entry.id) === String(item.id));

					if (existingIndex === -1) {
						uniqueHistory.push(item);
					} else {
						uniqueHistory[existingIndex] = item;
					}

					return uniqueHistory;
				}, []);
			console.log('[CustomerDashboard] Transformed history:', transformedHistory);
			setHistory(transformedHistory);
		} else {
			console.log('[CustomerDashboard] No histories found or empty array');
		}
	}, [profile, setHistory]);

	console.log('[CustomerDashboard] Final history to display:', history);

	function isMaxUsesReached(coupon) {
		return coupon.max_uses && coupon.number_of_uses >= coupon.max_uses;
	}

	// Only show completed (and unrated) transactions in the dashboard "Recent Transaction" section
	const recentCompleted = history
		.filter((item) => item.status === 'completed' && !item.rated)
		.reduce((uniqueHistory, item) => {
			const existingIndex = uniqueHistory.findIndex((entry) => String(entry.id) === String(item.id));

			if (existingIndex === -1) {
				uniqueHistory.push(item);
		} else {
				uniqueHistory[existingIndex] = item;
			}

			return uniqueHistory;
		}, []);

	// Only show unclaimed, non-expired, non-deleted, and not-maxed-out coupons in the dashboard coupons section
	const recentUnclaimedCoupons = coupons.filter((coupon) => !coupon.claimed && coupon.status !== "expired" && !coupon.is_deleted && !isMaxUsesReached(coupon));

	const profileInitial = (profile.name || "?").trim().charAt(0).toUpperCase() || "?";
	const profileAvatar = (
		<div className="cdb-avatar cdb-avatar-dashboard cdb-avatar-profile" style={avatarStyle} aria-label={`${profile.name || "Customer"} avatar`}>
			<div className="cdb-avatar-placeholder">
				<span className="cdb-avatar-initial">{profileInitial}</span>
			</div>
		</div>
	);



	const handleRateService = (id) => {
		const item = history.find((h) => h.id === id);
		setSelectedForRating(item || null);
		setRatingValue(0);
	};

	const handleSubmitRating = async () => {
		if (!selectedForRating || ratingValue <= 0 || !profile?.id) return;

		try {
			console.log('[CustomerDashboard] Submitting rating:', {
				customerId: profile.id,
				date: selectedForRating.date,
				service: selectedForRating.service,
				staff: selectedForRating.stylist,
				rating: ratingValue,
			});

			// Call API to save rating to history
			const response = await fetch('/api/customers/update/rating', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customerId: profile.id,
					date: selectedForRating.date,
					service: selectedForRating.service,
					staff: selectedForRating.stylist,
					rating: ratingValue,
				}),
			});

			if (!response.ok) {
				throw new Error(`Failed to submit rating: ${response.statusText}`);
			}

			const data = await response.json();
			console.log('[CustomerDashboard] Rating saved:', data);

			// Update local history state to reflect the rating
			setHistory((prev) =>
				prev.map((h) => (h.id === selectedForRating.id ? { ...h, rated: true, rating: ratingValue } : h))
			);

			showToast({ message: "Rating submitted successfully!", type: "success" });
			setSelectedForRating(null);
		} catch (err) {
			console.error('[CustomerDashboard] Error submitting rating:', err);
			showToast({ message: 'Failed to submit rating: ' + err.message, type: 'error' });
		}
	};

	const handleClaimCoupon = async (id, code, coupon) => {
		if (!profile?.id) {
			showToast({ message: 'Please log in to claim coupons', type: 'error' });
			return;
		}

		// Check if max uses reached
		if (isMaxUsesReached(coupon)) {
			showToast({ message: 'This coupon has reached its maximum usage limit', type: 'warning' });
			return;
		}

		try {
			await couponService.claimCoupon(profile.id, code);
			
			// Update local state to show claimed badge
			setCoupons((prev) => prev.map((coupon) => (coupon.id === id ? { ...coupon, claimed: true } : coupon)));
			
			showToast({ message: `Coupon ${code} claimed successfully!`, type: 'success' });
		} catch (err) {
			console.error('[CustomerDashboard] Error claiming coupon:', err);
			showToast({ message: 'Failed to claim coupon: ' + err.message, type: 'error' });
		}
	};

	// Helper function to determine if appointment can be cancelled (not within 2 hours)
	const canCancelAppointment = (appointmentDate, appointmentTime) => {
		const now = new Date();
		const appointmentDateTime = new Date(`${appointmentDate}T${convertTo24Hour(appointmentTime)}`);
		const hoursDifference = (appointmentDateTime - now) / (1000 * 60 * 60);
		return hoursDifference > 2;
	};

	// Helper function to convert 12-hour to 24-hour format
	const convertTo24Hour = (time12) => {
		const [time, period] = time12.split(' ');
		let [hours, minutes] = time.split(':').map(Number);
		if (period === 'PM' && hours !== 12) hours += 12;
		if (period === 'AM' && hours === 12) hours = 0;
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
	};

	const getAppointmentDateTime = (appointment) => {
		if (!appointment?.date) return null;
		const timeValue = appointment.time ? convertTo24Hour(String(appointment.time)) : '00:00';
		const dateTime = new Date(`${appointment.date}T${timeValue}`);
		return Number.isNaN(dateTime.getTime()) ? null : dateTime;
	};

	const isFutureAppointment = (appointment) => {
		const dateTime = getAppointmentDateTime(appointment);
		return !!dateTime && dateTime > new Date();
	};

	// Helper function to determine appointment status
	const getAppointmentStatus = (appointmentDate) => {
		const today = new Date().toISOString().split('T')[0];
		return appointmentDate === today ? 'today' : 'upcoming';
	};

	const visibleUpcomingAppointments = [...(appointments || [])]
		.filter((appointment) => appointment && !appointment.cancelled && isFutureAppointment(appointment))
		.sort((left, right) => {
			const leftTime = getAppointmentDateTime(left)?.getTime() || 0;
			const rightTime = getAppointmentDateTime(right)?.getTime() || 0;
			return leftTime - rightTime;
		});

	const nextUpcomingAppointment = visibleUpcomingAppointments[0] || null;

	// Handle cancel appointment button click
	const handleInitiateCancelAppointment = (appointment) => {
		const canCancel = canCancelAppointment(appointment.date, appointment.time);
		if (!canCancel) {
			showToast({ message: 'You are cancelling within 2 hours of your appointment.', type: 'warning' });
			setSelectedAppointmentToCancel(appointment);
			setCancelModalOpen(true);
			return;
		}
		setSelectedAppointmentToCancel(appointment);
		setCancelModalOpen(true);
	};

	// Handle confirm cancellation
	const handleConfirmCancelAppointment = async () => {
		if (!selectedAppointmentToCancel) return;

		try {
			console.log('[CustomerDashboard] Cancelling appointment:', selectedAppointmentToCancel.id);

			// Call API to reset appointment slot in database
			const response = await fetch('/api/appointments/update/cancel', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: selectedAppointmentToCancel.id }),
			});

			if (!response.ok) {
				throw new Error(`Failed to cancel appointment: ${response.statusText}`);
			}

			const data = await response.json();
			console.log('[CustomerDashboard] Appointment cancelled:', data);

			// Remove from appointments list in UI
			setAppointments((prev) =>
				prev.filter((appt) => appt.id !== selectedAppointmentToCancel.id)
			);

			showToast({ message: 'Appointment cancelled successfully', type: 'success' });
		} catch (err) {
			console.error('[CustomerDashboard] Error cancelling appointment:', err);
			showToast({ message: 'Failed to cancel appointment: ' + err.message, type: 'error' });
		} finally {
			setCancelModalOpen(false);
			setSelectedAppointmentToCancel(null);
		}
	};

	return (
		<CustomerShell activeNav="dashboard" profile={profile}>
			<section className="cdb-section cdb-mounted">
			<div className="cdb-card">
				<h2 className="cdb-section-title">My Profile</h2>
				<>
					<div className="cdb-grid cdb-grid-profile cdb-grid-avatar">
{isMobile ? (
<div className="cdb-profile-info-col">
<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
{profileAvatar}
</div>
<div>
<label className="cdb-field-label">Name</label>
<p className="cdb-field-value cdb-field-value-lg">{profile.name}</p>
</div>
<div>
<label className="cdb-field-label">Email</label>
<p className="cdb-field-value cdb-field-value-lg">{profile.emails && profile.emails.length ? profile.emails[0] : <span style={{ color: "#a3a398" }}>No email added</span>}</p>
</div>
<div>
<label className="cdb-field-label">Phone</label>
<p className="cdb-field-value cdb-field-value-lg">{profile.phones && profile.phones.length ? profile.phones[0] : <span style={{ color: "#a3a398" }}>No phone added</span>}</p>
</div>
<div>
<label className="cdb-field-label">Notification Preference</label>
<p className="cdb-field-value cdb-field-value-lg">{typeof profile.notificationPreference === 'string' ? profile.notificationPreference.toUpperCase() : (profile.notificationPreference ? 'ENABLED' : 'DISABLED')}</p>
</div>
<div className="cdb-action-row">
<button className="cdb-btn cdb-btn-edit" onClick={() => navigate("/customer/profile")}>Edit Profile</button>
</div>
</div>
) : (
<>
<div className="cdb-profile-avatar-col">{profileAvatar}</div>
<div className="cdb-profile-info-col">
<div>
<label className="cdb-field-label">Name</label>
<p className="cdb-field-value cdb-field-value-lg">{profile.name}</p>
</div>
<div>
<label className="cdb-field-label">Email</label>
<p className="cdb-field-value cdb-field-value-lg">{profile.emails && profile.emails.length ? profile.emails[0] : <span style={{ color: "#a3a398" }}>No email added</span>}</p>
</div>
<div>
<label className="cdb-field-label">Phone</label>
<p className="cdb-field-value cdb-field-value-lg">{profile.phones && profile.phones.length ? profile.phones[0] : <span style={{ color: "#a3a398" }}>No phone added</span>}</p>
</div>
<div>
<label className="cdb-field-label">Notification Preference</label>
<p className="cdb-field-value cdb-field-value-lg">{typeof profile.notificationPreference === 'string' ? profile.notificationPreference.toUpperCase() : (profile.notificationPreference ? 'ENABLED' : 'DISABLED')}</p>
</div>
<div className="cdb-action-row">
<button className="cdb-btn cdb-btn-edit" onClick={() => navigate("/customer/profile")}>Edit Profile</button>
</div>
</div>
</>
)}
</div>
				</>
					</div>
			</section>
		<section className="cdb-section cdb-section-appointments cdb-mounted">
		<div className="cdb-card">
			<h2 className="cdb-section-title">Upcoming Appointment</h2>
			{nextUpcomingAppointment ? (
				<div className="confirm-card">
					<div className="confirm-service-row">
						<div className="confirm-service-left">
							<div className="confirm-svc-text">
								<span className="confirm-svc-name">{String(nextUpcomingAppointment.category || 'General')}</span>
								<span className="confirm-svc-duration">{String(nextUpcomingAppointment.duration || '1 hour')}</span>
							</div>
						</div>
						<div className="confirm-svc-meta">
							<span className="confirm-svc-datetime">
								{nextUpcomingAppointment.date ? new Date(nextUpcomingAppointment.date).toLocaleDateString() : 'TBD'} · {String(nextUpcomingAppointment.time || '')}
							</span>
							<span className="confirm-svc-price">₱{typeof nextUpcomingAppointment.price === 'number' ? nextUpcomingAppointment.price.toFixed(2) : '0.00'}</span>
						</div>
					</div>

					{nextUpcomingAppointment.service && (
						<>
							<div style={{ marginBottom: 12 }}>
								<div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-tan)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8 }}>Services Selected</div>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span style={{ color: 'var(--color-light)' }}>{String(nextUpcomingAppointment.service || 'Service')}</span>
										<span style={{ color: 'var(--color-tan)' }}>₱{typeof nextUpcomingAppointment.price === 'number' ? nextUpcomingAppointment.price.toFixed(2) : '0.00'}</span>
									</div>
								</div>
							</div>
							<div className="confirm-details">
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Name</span>
										<span className="confirm-detail-value">{String(nextUpcomingAppointment.customerName || '')}</span>
									</div>
								</div>
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Email</span>
										<span className="confirm-detail-value">{String(nextUpcomingAppointment.email || '')}</span>
									</div>
								</div>
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Phone</span>
										<span className="confirm-detail-value">{String(nextUpcomingAppointment.phone || '')}</span>
									</div>
								</div>
								<div className="confirm-detail-row">
									<div className="confirm-detail-text">
										<span className="confirm-detail-label">Stylist</span>
										<span className="confirm-detail-value">{String(nextUpcomingAppointment.stylist || 'Unassigned')}</span>
									</div>
								</div>
							</div>
						</>
					)}

					<div className="confirm-bottom-row">
						<div className="confirm-ref-pill">Ref. No.: {String(nextUpcomingAppointment.refNo || nextUpcomingAppointment.id || '')}</div>
						<div className="confirm-reminder-box">
							<p className="confirm-reminder-text">You'll receive a reminder 15 minutes before your appointment.</p>
						</div>
					</div>

					<div className="cdb-appointment-actions">
						{canCancelAppointment(nextUpcomingAppointment.date, nextUpcomingAppointment.time) ? (
							<button className="cdb-btn cdb-btn-secondary" onClick={() => handleInitiateCancelAppointment(nextUpcomingAppointment)} style={{ flex: 1 }}>Cancel Appointment</button>
						) : (
							<div className="cdb-appointment-cancel-warning">Cannot cancel within 2 hours of appointment</div>
						)}
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
				<header className="cdb-section-head-row" style={sectionHeaderStyle}>
					<div style={sectionHeaderRowStyle}>
						<h2 className="cdb-section-title" style={{ fontSize: isMobile ? '16px' : undefined }}>Recent Transaction</h2>
						<div style={{ flex: isMobile ? 1 : '0 0 auto', marginLeft: isMobile ? undefined : 'auto', textAlign: isMobile ? 'left' : 'right' }}>
							<button className="cdb-btn cdb-btn-secondary cdb-btn-reverse" onClick={() => navigate("/customer/history")} style={{ padding: isMobile ? '6px 10px' : undefined, fontSize: isMobile ? '11px' : undefined, whiteSpace: 'nowrap' }}>
								{isMobile ? 'Full History' : 'View Full Transaction History'}
							</button>
						</div>
					</div>
					<div style={sectionHeaderDividerStyle} />
				</header>
					<div className="cdb-grid cdb-grid-history">
						{recentCompleted && recentCompleted.length > 0 ? (
							recentCompleted.map((item) => (
								<div key={`${item.id || 'history'}-${item.date || 'unknown'}-${item.service || 'service'}`} className="cdb-item-card cdb-history-item-card">
									<div className="cdb-item-left">
										<h3 className="cdb-item-title">{item.service}</h3>
										<p className="cdb-item-subtitle">{item.stylist} · ${item.cost.toFixed(2)}</p>
										<p className="cdb-date-text">{new Date(item.date).toLocaleDateString()}</p>
										{item.rated && <div className="cdb-rating-row">{[1, 2, 3, 4, 5].map((star) => <span key={star}>{star <= item.rating ? "★" : "☆"}</span>)}</div>}
									</div>
									<div className="cdb-item-right">
										<span className={`cdb-status-badge ${item.status === "completed" ? "completed" : "upcoming"}`}>{item.status}</span>
										{(item.rating === 0 || item.rating === undefined || item.rating === null) && (
											<button className="cdb-btn cdb-btn-secondary" onClick={() => handleRateService(item.id)}>Rate Service</button>
										)}
									</div>
								</div>
							))
						) : (
							<div style={{ padding: '20px', gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>
								<p>No completed services yet</p>
							</div>
						)}
					</div>
				</div>
			</section>

			<section className="cdb-section cdb-mounted">
			<div className="cdb-card">
				<header className="cdb-section-head-row" style={sectionHeaderStyle}>
					<div style={sectionHeaderRowStyle}>
						<h2 className="cdb-section-title">Coupons</h2>
						<div>
							<button className="cdb-btn cdb-btn-secondary cdb-btn-reverse" onClick={() => navigate("/customer/coupons")}>View All Coupons</button>
						</div>
					</div>
					<div style={sectionHeaderDividerStyle} />
				</header>
						<div className="cdb-grid cdb-grid-coupons">
							{recentUnclaimedCoupons.map((coupon) => (
								<div
									key={coupon.id}
									className={`cdb-coupon-card ${coupon.status === "expired" ? "expired" : ""}`}
									style={isMobile ? { flexDirection: 'column', alignItems: 'flex-start' } : undefined}
								>
									<div className="cdb-coupon-left">
										<h3 className={`cdb-coupon-title ${coupon.status === "expired" ? "expired" : ""}`}>{coupon.discount}</h3>
										<p className="cdb-coupon-code">{coupon.code} · {coupon.category}</p>
										<p className="cdb-coupon-description">{coupon.description}</p>
										<p className="cdb-date-text">Expires: {new Date(coupon.expiration).toLocaleDateString()}</p>
									</div>
									<div className="cdb-coupon-right" style={isMobile ? { width: '100%', justifyContent: 'flex-start', alignItems: 'stretch' } : undefined}>
										{coupon.status === "expired" ? (
											<span className={`cdb-status-badge ${coupon.status}`}>{coupon.status}</span>
										) : isMaxUsesReached(coupon) ? (
											<span className="cdb-status-badge expired" title={`Usage limit reached (${coupon.number_of_uses}/${coupon.max_uses})`}>limit reached</span>
										) : coupon.claimed ? (
											<span className="cdb-status-badge claimed">claimed</span>
										) : (
											<button className="cdb-btn cdb-btn-primary" onClick={() => handleClaimCoupon(coupon.id, coupon.code, coupon)} style={isMobile ? { width: '100%' } : undefined} title={isMaxUsesReached(coupon) ? `Usage limit reached (${coupon.number_of_uses}/${coupon.max_uses})` : ''}>Claim Coupon</button>
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
									<StarIcon filled={ratingValue >= star} />
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
			<div style={{
				position: "fixed",
				inset: 0,
				zIndex: 10000020,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backdropFilter: "blur(2px)",
				backgroundColor: "rgba(0,0,0,0.5)",
				pointerEvents: 'auto'
			}}>
				<div style={{
					background: "white",
					borderRadius: "16px",
					padding: "32px 24px",
					maxWidth: "360px",
					width: "90%",
					boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
					animation: "fade-up 0.3s ease forwards",
				}}>
					<h2 style={{
						fontSize: "18px",
						fontWeight: "700",
						color: "#1a0f00",
						marginBottom: "12px",
						textAlign: "center",
						fontFamily: "Inter, sans-serif",
					}}>
						Cancel Appointment?
					</h2>
					<p style={{
						fontSize: "14px",
						color: "#665544",
						marginBottom: "24px",
						textAlign: "center",
						lineHeight: "1.5",
						fontFamily: "Inter, sans-serif",
					}}>
						Are you sure you want to cancel your {selectedAppointmentToCancel.service} appointment on {new Date(selectedAppointmentToCancel.date).toLocaleDateString()} at {selectedAppointmentToCancel.time}?
					</p>
					{!canCancelAppointment(selectedAppointmentToCancel.date, selectedAppointmentToCancel.time) && (
						<div style={{ padding: '12px', marginBottom: '16px', backgroundColor: 'rgba(221, 144, 29, 0.1)', borderRadius: '4px', fontSize: '13px', color: '#dd901d', textAlign: 'center' }}>
							⚠️ Warning: You are cancelling within 2 hours of your appointment.
						</div>
					)}
					<div style={{
						display: "flex",
						gap: "12px",
						flexDirection: "column",
					}}>
						<button
							onClick={() => {
								setCancelModalOpen(false);
								setSelectedAppointmentToCancel(null);
							}}
							style={{
								padding: "12px 16px",
								background: "#dd901d",
								color: "white",
								border: "none",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "600",
								cursor: "pointer",
								fontFamily: "Inter, sans-serif",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.target.style.background = "#c17a14";
								e.target.style.transform = "translateY(-2px)";
							}}
							onMouseLeave={(e) => {
								e.target.style.background = "#dd901d";
								e.target.style.transform = "translateY(0)";
							}}
						>
							Keep Appointment
						</button>
						<button
							onClick={handleConfirmCancelAppointment}
							style={{
								padding: "12px 16px",
								background: "transparent",
								color: "#dd901d",
								border: "1.5px solid #dd901d",
								borderRadius: "8px",
								fontSize: "14px",
								fontWeight: "600",
								cursor: "pointer",
								fontFamily: "Inter, sans-serif",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.target.style.background = "rgba(221, 144, 29, 0.1)";
							}}
							onMouseLeave={(e) => {
								e.target.style.background = "transparent";
							}}
						>
							Confirm Cancellation
						</button>
					</div>
				</div>
			</div>
		)}
		</CustomerShell>
	);
}