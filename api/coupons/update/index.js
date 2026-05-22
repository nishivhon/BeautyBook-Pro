import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      id,
      code,
      value_type,
      value,
      description,
      start_date,
      end_date,
      max_uses,
      status
    } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ error: 'Missing required field: id' });
    }

    // Validate value if provided
    if (value && Number(value) <= 0) {
      return res.status(400).json({ error: 'Value must be greater than 0' });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (code) updateData.code = code.toUpperCase();
    if (value_type) updateData.value_type = value_type;
    if (value) updateData.value = Number(value);
    if (description !== undefined) updateData.description = description || null;
    if (start_date) updateData.start_date = start_date;
    if (end_date) updateData.end_date = end_date;
    if (max_uses !== undefined) updateData.max_uses = max_uses ? Number(max_uses) : null;
    if (status) updateData.status = status;

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('coupons')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Coupons:Update] Error:', error);
      return res.status(400).json({
        error: 'Failed to update coupon',
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    return res.status(200).json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    console.error('[Coupons:Update] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
