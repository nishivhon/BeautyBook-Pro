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
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    // Fetch all coupons (not deleted)
    const { data: coupons, error: couponsError } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (couponsError) {
      throw couponsError;
    }

    // Fetch customer's claimed coupons
    const { data: customerData, error: customerError } = await supabase
      .from('customers_accounts')
      .select('coupons_used')
      .eq('id', customerId)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      throw customerError;
    }

    // Parse claimed coupon codes
    const claimedCodes = [];
    if (customerData?.coupons_used && Array.isArray(customerData.coupons_used)) {
      claimedCodes.push(...customerData.coupons_used.map(c => c.code?.toUpperCase()));
    }

    // Map coupons with claimed status
    const couponsWithStatus = coupons.map(coupon => ({
      ...coupon,
      isClaimed: claimedCodes.includes(coupon.code?.toUpperCase())
    }));

    return res.status(200).json({
      data: couponsWithStatus
    });
  } catch (err) {
    console.error('[Customers:CouponsStatus] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
