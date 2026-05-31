import { getSupabaseClient } from '../utils/supabaseClient.js';

const TIME_ZONE = 'Asia/Manila';

const convertTo12HourFormat = (timeValue) => {
  if (!timeValue) return 'TBA';

  const [hoursPart, minutesPart] = String(timeValue).slice(0, 5).split(':');
  const hours = Number(hoursPart);
  const minutes = Number(minutesPart);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 'TBA';

  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

const formatRelativeTime = (value) => {
  if (!value) return 'Just now';

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return 'Just now';

  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 60000));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const getServiceLabel = (services) => {
  if (!services) return 'a service';

  if (typeof services === 'string') return services;

  if (Array.isArray(services)) {
    const names = services
      .map((service) => service?.name || service?.title || service?.service || service)
      .filter(Boolean);

    return names.length > 0 ? names.join(', ') : 'a service';
  }

  if (typeof services === 'object') {
    return services.name || services.title || services.service || Object.values(services).filter(Boolean).join(', ') || 'a service';
  }

  return 'a service';
};

const getNotificationTone = (status) => {
  switch (status) {
    case 'current':
      return 'blue';
    case 'done':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'amber';
  }
};

const getNotificationCategory = (status) => {
  switch (status) {
    case 'current':
      return 'Live queue';
    case 'done':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled booking';
    default:
      return 'New booking';
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 20);
  const beforeCreatedAt = String(req.query.beforeCreatedAt || '').trim();
  const beforeId = String(req.query.beforeId || '').trim();

  try {
    const supabase = getSupabaseClient();

    let query = supabase
      .from('available_slots')
      .select('id, date, time_slot, customer_name, customer_contact, assigned_staff, services, status, created_at, updated_at')
      .not('customer_name', 'is', null)
      .eq('status', 'pending')
      .eq('availability', false)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (beforeCreatedAt && beforeId) {
      query = query.or(`created_at.lt.${beforeCreatedAt},and(created_at.eq.${beforeCreatedAt},id.lt.${beforeId})`);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch booking notifications', details: error.message });
    }

    const notifications = (data || []).map((slot, index) => {
      const createdAt = slot.created_at || null;
      const updatedAt = slot.updated_at || null;
      const activityAt = updatedAt || createdAt;
      const serviceLabel = getServiceLabel(slot.services);
      const staffLabel = slot.assigned_staff || 'Any available stylist';
      const timeLabel = convertTo12HourFormat(slot.time_slot);
      const dateLabel = slot.date
        ? new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(slot.date))
        : 'Today';

      return {
        id: slot.id || `booking-${index}`,
        tone: getNotificationTone(slot.status),
        category: getNotificationCategory(slot.status),
        title: `${slot.customer_name || 'Customer'} booked ${serviceLabel}`,
        description: `${dateLabel} at ${timeLabel} • ${staffLabel}`,
        time: formatRelativeTime(activityAt),
        activityAt,
        createdAt,
        updatedAt,
        unread: true,
      };
    });

    const oldestNotification = notifications[notifications.length - 1] || null;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
      hasMore: notifications.length === limit,
      nextCursor: oldestNotification
        ? {
            createdAt: oldestNotification.createdAt,
            id: oldestNotification.id,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch booking notifications', details: error.message });
  }
}