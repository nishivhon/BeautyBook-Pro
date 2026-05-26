import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = getPhtDateString();

    const { data: coupons, error: fetchError } = await supabase
      .from('coupons')
      .select('id, start_date, end_date, status, is_deleted')
      .eq('is_deleted', false);

    if (fetchError) {
      throw fetchError;
    }

    const rowsToActivate = [];
    const rowsToDeactivate = [];
    const rowsToExpire = [];

    for (const coupon of coupons || []) {
      const nextStatus = getCouponLifecycleStatus(coupon.start_date, coupon.end_date);
      if (nextStatus === coupon.status) {
        continue;
      }

      if (nextStatus === 'active') {
        rowsToActivate.push(coupon.id);
      } else if (nextStatus === 'inactive') {
        rowsToDeactivate.push(coupon.id);
      } else if (nextStatus === 'expired') {
        rowsToExpire.push(coupon.id);
      }
    }

    const updates = [];
    const timestamp = new Date().toISOString();

    if (rowsToActivate.length > 0) {
      const { error } = await supabase
        .from('coupons')
        .update({ status: 'active', updated_at: timestamp })
        .in('id', rowsToActivate);

      if (error) {
        throw error;
      }

      updates.push({ status: 'active', count: rowsToActivate.length });
    }

    if (rowsToDeactivate.length > 0) {
      const { error } = await supabase
        .from('coupons')
        .update({ status: 'inactive', updated_at: timestamp })
        .in('id', rowsToDeactivate);

      if (error) {
        throw error;
      }

      updates.push({ status: 'inactive', count: rowsToDeactivate.length });
    }

    if (rowsToExpire.length > 0) {
      const { error } = await supabase
        .from('coupons')
        .update({ status: 'expired', updated_at: timestamp })
        .in('id', rowsToExpire);

      if (error) {
        throw error;
      }

      updates.push({ status: 'expired', count: rowsToExpire.length });
    }

    return res.status(200).json({
      success: true,
      date: today,
      updated: updates,
      total: rowsToActivate.length + rowsToDeactivate.length + rowsToExpire.length,
    });
  } catch (error) {
    console.error('[Coupons:SyncStatuses] Error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};
