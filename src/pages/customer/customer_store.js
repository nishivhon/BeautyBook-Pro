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
      rated: false,
      rating: 0,
    }));
  });

  return [history, setHistory];
};

export const useCustomerCouponsData = () => usePersistentState(COUPONS_KEY, defaultCoupons);
