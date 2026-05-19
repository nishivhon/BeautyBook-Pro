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
    const { customerId, couponCode } = req.body;

    if (!customerId || !couponCode) {
      return res.status(400).json({
        error: 'Missing required fields: customerId, couponCode'
      });
    }

    // Get the coupon to verify it exists
    const { data: couponData, error: couponError } = await supabase
      .from('coupons')
      .select('id, code, number_of_uses, max_uses')
      .eq('code', couponCode.toUpperCase())
      .eq('is_deleted', false)
      .eq('status', 'active')
      .single();

    if (couponError || !couponData) {
      return res.status(404).json({ error: 'Coupon not found or unavailable' });
    }

    // Check if max_uses has been reached
    if (couponData.max_uses && couponData.number_of_uses >= couponData.max_uses) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    // Get the customer's current coupons_used
    const { data: customerData, error: customerError } = await supabase
      .from('customers_accounts')
      .select('coupons_used')
      .eq('id', customerId)
      .single();

    if (customerError || !customerData) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Parse existing coupons_used or initialize as empty array
    let couponsList = [];
    try {
      couponsList = customerData.coupons_used && Array.isArray(customerData.coupons_used) 
        ? customerData.coupons_used 
        : [];
    } catch (e) {
      couponsList = [];
    }

    // Check if coupon already claimed
    const alreadyClaimed = couponsList.some(c => c.code === couponCode.toUpperCase());
    if (alreadyClaimed) {
      return res.status(400).json({ error: 'You have already claimed this coupon' });
    }

    // Add new coupon to the list
    const newCouponEntry = {
      code: couponCode.toUpperCase(),
      claimed: true,
      used: false
    };
    couponsList.push(newCouponEntry);

    // Update customer's coupons_used
    const { error: updateCustomerError } = await supabase
      .from('customers_accounts')
      .update({ coupons_used: couponsList })
      .eq('id', customerId);

    if (updateCustomerError) {
      console.error('[Coupons:Claim] Error updating customer:', updateCustomerError);
      return res.status(400).json({
        error: 'Failed to claim coupon',
        details: updateCustomerError.message
      });
    }

    // Increment coupon's number_of_uses
    const { error: incrementError } = await supabase
      .from('coupons')
      .update({ number_of_uses: couponData.number_of_uses + 1 })
      .eq('id', couponData.id);

    if (incrementError) {
      console.error('[Coupons:Claim] Error incrementing uses:', incrementError);
      // Don't fail here, the claim was successful even if we can't update the counter
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon claimed successfully',
      coupon: newCouponEntry
    });
  } catch (err) {
    console.error('[Coupons:Claim] Error:', err.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
