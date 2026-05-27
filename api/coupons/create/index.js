import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const getPhtDateString = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
};

const getCouponLifecycleStatus = (startDate, endDate) => {
  const today = getPhtDateString();
  const normalizedStartDate = String(startDate || '').slice(0, 10);
  const normalizedEndDate = String(endDate || '').slice(0, 10);

  if (normalizedEndDate && normalizedEndDate < today) {
    return 'expired';
  }

  if (normalizedStartDate && normalizedStartDate > today) {
    return 'inactive';
  }

  return 'active';
};

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
      start_date,
      end_date,
      max_uses
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
      start_date,
      end_date,
      max_uses: max_uses ? Number(max_uses) : null,
      status: getCouponLifecycleStatus(start_date, end_date),
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
