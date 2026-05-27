import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const normalizeHistories = (historiesValue) => {
  if (!historiesValue) return [];

  if (Array.isArray(historiesValue)) return historiesValue;

  if (typeof historiesValue === 'string') {
    try {
      const parsed = JSON.parse(historiesValue);
      if (Array.isArray(parsed)) return parsed;
      return parsed ? [parsed] : [];
    } catch {
      return [];
    }
  }

  if (typeof historiesValue === 'object') {
    return [historiesValue];
  }

  return [];
};

const isRatedDoneHistory = (historyItem) => {
  const status = String(historyItem?.status || '').trim().toLowerCase();
  const isDone = status === 'done' || status === 'completed';

  const ratedValue = historyItem?.rated;
  const isRated = ratedValue === true || String(ratedValue).trim().toLowerCase() === 'true';

  const rating = Number.parseFloat(historyItem?.rating);
  const hasValidRating = Number.isFinite(rating) && rating > 0;

  return isDone && isRated && hasValidRating;
};

const getHistoryStaffName = (historyItem) => {
  const rawValue = historyItem?.staff || historyItem?.assigned_staff || historyItem?.stylist || '';
  const name = String(rawValue).trim();
  return name || null;
};

const getStaffKey = (name) => String(name || '').trim().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ success: false, error: 'Server misconfigured' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    const { data: customers, error } = await supabase
      .from('customers_accounts')
      .select('id, histories');

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch customer histories', details: error.message });
    }

    const aggregates = new Map();
    let ratedDoneEntries = 0;

    for (const customer of customers || []) {
      const histories = normalizeHistories(customer?.histories);

      for (const historyItem of histories) {
        if (!isRatedDoneHistory(historyItem)) continue;

        const staffName = getHistoryStaffName(historyItem);
        if (!staffName) continue;

        const ratingValue = Number.parseFloat(historyItem.rating);
        const key = getStaffKey(staffName);
        const current = aggregates.get(key) || {
          staff: staffName,
          totalRating: 0,
          reviewCount: 0,
        };

        current.totalRating += ratingValue;
        current.reviewCount += 1;
        current.staff = current.staff || staffName;

        aggregates.set(key, current);
        ratedDoneEntries += 1;
      }
    }

    const feedback = Array.from(aggregates.values())
      .map((entry) => {
        const averageRaw = entry.reviewCount > 0 ? entry.totalRating / entry.reviewCount : 0;
        return {
          staff: entry.staff,
          averageRating: Number(averageRaw.toFixed(2)),
          reviewCount: entry.reviewCount,
          totalRating: Number(entry.totalRating.toFixed(2)),
        };
      })
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
        if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
        return a.staff.localeCompare(b.staff);
      });

    return res.status(200).json({
      success: true,
      feedback,
      meta: {
        customersScanned: (customers || []).length,
        ratedDoneEntries,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error', details: err.message });
  }
}
