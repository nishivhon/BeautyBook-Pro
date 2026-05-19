import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Coupons:Create] Request body:', req.body);

    const {
      code,
      value_type,
      value,
      description,
      applicable_services,
      start_date,
      end_date,
      max_uses,
      status
    } = req.body;

    // Validate required fields
    if (!code || !value_type || !value || !start_date || !end_date) {
      console.log('[Coupons:Create] Missing fields:', { code, value_type, value, start_date, end_date });
      return res.status(400).json({
        error: 'Missing required fields: code, value_type, value, start_date, end_date'
      });
    }

    // Validate value is positive
    if (Number(value) <= 0) {
      return res.status(400).json({ error: 'Value must be greater than 0' });
    }

    // Prepare insert data
    const insertData = {
      code: code.toUpperCase(),
      value_type,
      value: Number(value),
      description: description || null,
      applicable_services: applicable_services && applicable_services.length > 0 
        ? applicable_services.map(id => Number(id)) 
        : [],
      start_date,
      end_date,
      max_uses: max_uses ? Number(max_uses) : null,
      status: status || 'active',
      number_of_uses: 0,
      is_deleted: false
    };

    console.log('[Coupons:Create] Insert data:', insertData);

    const { data, error } = await supabase
      .from('coupons')
      .insert([insertData])
      .select();

    if (error) {
      console.error('[Coupons:Create] Error:', error);
      return res.status(400).json({
        error: 'Failed to create coupon',
        details: error.message
      });
    }

    return res.status(201).json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    console.error('[Coupons:Create] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
