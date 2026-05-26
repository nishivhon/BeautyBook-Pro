const CACHE_KEY = "superadminNotificationsCache";
const READ_CACHE_PREFIX = "superadminNotificationsReadCache";
const CACHE_TTL_MS = 5 * 60 * 1000;

const getApiBase = () => (
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "/api"
);

export const getSuperAdminNotificationCacheKey = () => CACHE_KEY;

export const getSuperAdminNotificationReadCacheKey = (sessionKey = "global") => `${READ_CACHE_PREFIX}:${sessionKey}`;

export const getSuperAdminNotificationSessionKey = (session = null) => {
  const email = String(session?.email || "").trim().toLowerCase();
  const role = String(session?.role || "").trim().toLowerCase();
  return [role, email].filter(Boolean).join(":") || "global";
};

export const readSuperAdminNotificationCache = () => {
  if (typeof window === "undefined") {
    return { items: [], fetchedAt: 0 };
  }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return { items: [], fetchedAt: 0 };

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { items: parsed, fetchedAt: 0 };
    }

    if (parsed && Array.isArray(parsed.items)) {
      return {
        items: parsed.items,
        fetchedAt: typeof parsed.fetchedAt === "number" ? parsed.fetchedAt : 0,
      };
    }

    return { items: [], fetchedAt: 0 };
  } catch (error) {
    console.warn("[SuperAdminNotifications] Failed to read cache:", error);
    return { items: [], fetchedAt: 0 };
  }
};

export const writeSuperAdminNotificationCache = (items) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ items: Array.isArray(items) ? items : [], fetchedAt: Date.now() })
    );
  } catch (error) {
    console.warn("[SuperAdminNotifications] Failed to write cache:", error);
  }
};

export const readSuperAdminNotificationReadCache = (sessionKey = "global") => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getSuperAdminNotificationReadCacheKey(sessionKey));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("[SuperAdminNotifications] Failed to read read-cache:", error);
    return [];
  }
};

export const writeSuperAdminNotificationReadCache = (sessionKey = "global", readIds = []) => {
  if (typeof window === "undefined") return;

  try {
    const normalized = Array.from(new Set((Array.isArray(readIds) ? readIds : []).map((id) => String(id)).filter(Boolean)));
    window.localStorage.setItem(getSuperAdminNotificationReadCacheKey(sessionKey), JSON.stringify(normalized));
  } catch (error) {
    console.warn("[SuperAdminNotifications] Failed to write read-cache:", error);
  }
};

export const isSuperAdminNotificationCacheFresh = (fetchedAt) => {
  if (!fetchedAt) return false;
  return Date.now() - fetchedAt < CACHE_TTL_MS;
};

export const fetchSuperAdminNotifications = async () => {
  const response = await fetch(`${getApiBase()}/superadmin/notifications`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Failed to fetch super admin notifications");
  }

  return Array.isArray(payload.notifications) ? payload.notifications : [];
};
