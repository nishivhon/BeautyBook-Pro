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
    // Fetch active, valid coupons (not deleted, active status, within date range)
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_deleted', false)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Filter coupons by date range only
    const now = new Date().toISOString().split('T')[0];
    const availableCoupons = coupons.filter(coupon => {
      return coupon.start_date <= now && now <= coupon.end_date;
    });

    return res.status(200).json({
      data: availableCoupons
    });
  } catch (err) {
    console.error('[Coupons:Available] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
