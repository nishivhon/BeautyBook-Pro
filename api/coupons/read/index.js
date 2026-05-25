import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { includeDeleted, recentDays, status } = req.query;

    // Build query
    let query = supabase
      .from('coupons')
      .select('*')
      .order('updated_at', { ascending: false });

    // Filter out deleted coupons by default
    if (includeDeleted !== 'true') {
      query = query.eq('is_deleted', false);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const parsedRecentDays = Number(recentDays);
    if (Number.isFinite(parsedRecentDays) && parsedRecentDays > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - parsedRecentDays);
      query = query.gte('updated_at', cutoff.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Coupons:Read] Error:', error);
      return res.status(400).json({
        error: 'Failed to fetch coupons',
        details: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (err) {
    console.error('[Coupons:Read] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
