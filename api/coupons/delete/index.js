import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing required field: id' });
    }

    // Soft delete by setting is_deleted to true
    const { data, error } = await supabase
      .from('coupons')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Coupons:Delete] Error:', error);
      return res.status(400).json({
        error: 'Failed to delete coupon',
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
      data: data[0]
    });
  } catch (err) {
    console.error('[Coupons:Delete] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
