import { useEffect, useState } from "react";

const PROFILE_KEY = "customerProfileData";
const HISTORY_KEY = "customerHistoryData";
const COUPONS_KEY = "customerCouponsData";

export const defaultProfile = {
  name: "",
  emails: [],
  phones: [],
  notificationPreference: "",
  profilePhoto: "",
  id: null,
  histories: [],
};

export const defaultHistory = [];

export const defaultCoupons = [
  { id: 1, code: "SAVE15", discount: "15% OFF", description: "All hair services", expiration: "2026-05-30", status: "available", claimed: false, category: "limited" },
  { id: 2, code: "NAIL20", discount: "20% OFF", description: "Nail services only", expiration: "2026-05-15", status: "expired", claimed: false, category: "discount" },
  { id: 3, code: "SUMMER25", discount: "$25 OFF", description: "Services over $75", expiration: "2026-06-30", status: "available", claimed: false, category: "promo" },
  { id: 4, code: "MASSAGE10", discount: "10% OFF", description: "Massage services", expiration: "2026-05-08", status: "available", claimed: true, category: "discount" },
  { id: 5, code: "FLASH30", discount: "30% OFF", description: "Today only", expiration: "2026-04-27", status: "available", claimed: false, category: "limited" },
];



const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const usePersistentState = (key, fallback) => {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const useCustomerProfileData = () => usePersistentState(PROFILE_KEY, defaultProfile);

export const useCustomerHistoryData = () => {
  const [profile] = useCustomerProfileData();
  const [history, setHistory] = useState(() => {
    // Transform profile histories into dashboard history format
    if (!profile?.histories || !Array.isArray(profile.histories)) {
      return [];
    }

    return profile.histories.map((item, idx) => ({
      id: item.id || idx,
      date: item.date || new Date().toISOString().split('T')[0],
      service: item.service || 'Service',
      stylist: item.staff || 'Unknown Stylist',
      cost: parseFloat(item.price) || 0,
      status: item.status === 'done' ? 'completed' : item.status === 'current' ? 'upcoming' : item.status || 'pending',
      rated: item.rated || false,
      rating: item.rating || 0,
      rated_at: item.rated_at || null,
    }));
  });

  return [history, setHistory];
};

export const useCustomerCouponsData = () => {
  const [profile] = useCustomerProfileData();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all coupons with claimed status for this customer
        const response = await fetch(`/api/customers/coupons-status?customerId=${profile.id}`);
        if (!response.ok) throw new Error('Failed to fetch coupons');
        
        const result = await response.json();
        const couponsWithStatus = result.data || [];
        
        // Transform to match dashboard format
        const transformedCoupons = couponsWithStatus.map(coupon => ({
          id: coupon.id,
          code: coupon.code,
          discount: coupon.value_type === 'percentage' 
            ? `${coupon.value}% OFF` 
            : `₱${coupon.value.toFixed(2)} OFF`,
          description: coupon.description || 'Special discount',
          expiration: coupon.end_date,
          status: coupon.status,
          claimed: coupon.isClaimed,
          value: coupon.value,
          value_type: coupon.value_type,
          max_uses: coupon.max_uses,
          number_of_uses: coupon.number_of_uses
        }));
        
        setCoupons(transformedCoupons);
      } catch (err) {
        console.error('[useCustomerCouponsData] Error fetching coupons:', err);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [profile?.id]);

  return [coupons, setCoupons];
};

// Default appointment data for upcoming appointments
export const defaultAppointments = [
  {
    id: 1,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    time: "10:00 AM",
    service: "Haircut",
    duration: "30 mins",
    price: 150,
    stylist: "Maria Santos",
    customerName: "Jake Quaker",
    email: "quakerjake@gmail.com",
    phone: "09171234567",
    refNo: "18001-0001",
    status: "upcoming",
    booked_at: new Date().toISOString(),
    cancelled: false,
  },
];

export const useCustomerAppointmentsData = () => {
  const [profile] = useCustomerProfileData();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);

        // Use email or phone from profile to fetch appointments
        const email = profile?.emails?.[0];
        const phone = profile?.phones?.[0];

        if (!email && !phone) {
          console.log('[useCustomerAppointmentsData] No email or phone available');
          if (mounted) setAppointments([]);
          setLoading(false);
          return;
        }

        console.log('[useCustomerAppointmentsData] Fetching appointments for email:', email, 'phone:', phone);

        // Build query parameters
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (phone) params.append('phone', phone);

        const response = await fetch(`/api/appointments/read/by-customer?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.statusText}`);
        }

        const data = await response.json();

        if (mounted) {
          if (data.success && data.appointments) {
            console.log('[useCustomerAppointmentsData] Fetched appointments:', data.appointments);
            setAppointments(data.appointments);
          } else {
            setAppointments([]);
          }
        }
      } catch (err) {
        console.error('[useCustomerAppointmentsData] Error fetching appointments:', err);
        if (mounted) setAppointments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const triggerFetch = () => {
      if (profile?.id) fetchAppointments();
    };

    // Initial fetch
    triggerFetch();

    // Refetch when the window/tab gains focus or when visibility changes
    const onFocus = () => triggerFetch();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') triggerFetch();
    };

    // Listen for custom event dispatched after booking is confirmed
    window.addEventListener('appointmentsUpdated', triggerFetch);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mounted = false;
      window.removeEventListener('appointmentsUpdated', triggerFetch);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [profile?.id, profile?.emails, profile?.phones]);

  return [appointments, setAppointments];
};
