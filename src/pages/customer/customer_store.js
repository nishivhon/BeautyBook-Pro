import { useEffect, useState } from "react";

const PROFILE_KEY = "customerProfileData";
const HISTORY_KEY = "customerHistoryData";
const COUPONS_KEY = "customerCouponsData";

export const defaultProfile = {
  name: "Sarah Johnson",
  emails: ["sarah.johnson@email.com"],
  phones: ["+1 (555) 123-4567"],
  notificationPreference: "email",
  profilePhoto: "",
};

export const defaultHistory = [
  { id: 1, date: "2026-04-20", service: "Haircut & Styling", stylist: "Maria Rodriguez", cost: 45.0, status: "completed", rated: false },
  { id: 2, date: "2026-04-10", service: "Hair Color", stylist: "Carlos Martinez", cost: 85.0, status: "completed", rated: true, rating: 5 },
  { id: 3, date: "2026-03-28", service: "Facial Treatment", stylist: "Ana Santos", cost: 65.0, status: "completed", rated: true, rating: 4 },
  { id: 4, date: "2026-03-15", service: "Manicure", stylist: "Maria Rodriguez", cost: 35.0, status: "completed", rated: false },
  { id: 5, date: "2026-05-02", service: "Swedish Massage", stylist: "John Davis", cost: 75.0, status: "upcoming", rated: false },
];

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
export const useCustomerHistoryData = () => usePersistentState(HISTORY_KEY, defaultHistory);
export const useCustomerCouponsData = () => usePersistentState(COUPONS_KEY, defaultCoupons);
