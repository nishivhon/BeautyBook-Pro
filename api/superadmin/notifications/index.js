import { createClient } from '@supabase/supabase-js';

const MANILA_TIME_ZONE = 'Asia/Manila';
const MAX_ITEMS = 12;

const getSupabase = () => createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const formatRelativeTime = (value) => {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: MANILA_TIME_ZONE,
  }).format(date);
};

const isSameLocalDay = (value, referenceDate = new Date()) => {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
};

const formatRoleLabel = (role) => {
  if (!role) return 'Security';
  return String(role)
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const buildDeviceSummary = (device = {}) => {
  const parts = [];

  if (device.ip_address) parts.push(`IP ${device.ip_address}`);
  if (device.platform) parts.push(String(device.platform).replaceAll('"', ''));
  if (device.user_agent) parts.push(device.user_agent);

  return parts.length ? parts.join(' • ') : 'No device details available';
};

const pushItem = (items, item) => {
  if (!item) return;
  items.push(item);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const notifications = [];
    const now = new Date();

    const [couponsResult, credentialsResult] = await Promise.all([
      supabase
        .from('coupons')
        .select('id, code, status, description, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
      supabase
        .from('secured_credentials')
        .select('role, email, failed_logins, last_login, last_password_change_at, updated_at')
        .in('role', ['admin', 'super admin'])
    ]);

    if (!couponsResult.error && Array.isArray(couponsResult.data)) {
      couponsResult.data.forEach((coupon, index) => {
        const timestamp = coupon?.updated_at || coupon?.created_at;
        if (!timestamp) return;

        pushItem(notifications, {
          id: `coupon-${coupon.id || index}`,
          tone: 'blue',
          category: 'Database status',
          title: `${coupon.code || 'Coupon'} ${String(coupon.status || '').toLowerCase() === 'active' ? 'is active' : 'was updated'}`,
          description: coupon.description || 'Coupon settings were updated.',
          time: formatRelativeTime(timestamp),
          unread: true,
          sortAt: timestamp,
        });
      });
    }

    if (!credentialsResult.error && Array.isArray(credentialsResult.data)) {
      credentialsResult.data.forEach((credential) => {
        const failedLogins = Array.isArray(credential?.failed_logins) ? credential.failed_logins : [];

        failedLogins
          .filter((attempt) => isSameLocalDay(attempt?.attempted_at, now))
          .forEach((attempt, index) => {
            const timestamp = attempt?.attempted_at;
            if (!timestamp) return;

            pushItem(notifications, {
              id: `failed-login-${credential.role || 'role'}-${timestamp}-${index}`,
              tone: 'amber',
              category: 'Security alerts',
              title: `${formatRoleLabel(credential.role)} failed login attempt`,
              description: `${buildDeviceSummary(attempt?.device)}${attempt?.reason ? ` • ${attempt.reason}` : ''}`,
              time: formatRelativeTime(timestamp),
              unread: true,
              sortAt: timestamp,
            });
          });

        if (credential?.last_password_change_at) {
          pushItem(notifications, {
            id: `password-change-${credential.role || 'role'}`,
            tone: 'blue',
            category: 'Security alerts',
            title: `${formatRoleLabel(credential.role)} password changed`,
            description: `${formatRoleLabel(credential.role)} credentials were updated recently.`,
            time: formatRelativeTime(credential.last_password_change_at),
            unread: true,
            sortAt: credential.last_password_change_at,
          });
        }
      });
    }

    const sortedNotifications = notifications
      .filter((item) => item && item.sortAt)
      .sort((left, right) => new Date(right.sortAt).getTime() - new Date(left.sortAt).getTime())
      .slice(0, MAX_ITEMS)
      .map(({ sortAt, ...item }) => item);

    return res.status(200).json({
      notifications: sortedNotifications,
      count: sortedNotifications.length,
    });
  } catch (error) {
    console.error('[SuperAdminNotifications] Error:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch super admin notifications',
      details: error.message,
    });
  }
}
