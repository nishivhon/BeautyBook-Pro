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
    // Get active coupons that haven't been soft-deleted
    // and are within their date range
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_deleted', false)
      .eq('status', 'active')
      .lte('start_date', today)
      .gte('end_date', today)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Coupons:Customer] Error:', error);
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
    console.error('[Coupons:Customer] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
