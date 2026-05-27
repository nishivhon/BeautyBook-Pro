import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from('customers_accounts')
      .delete()
      .eq('id', id)
      .select('id, name, email, phone');

    if (error) {
      console.error('[Customers:Delete] Delete error:', error);
      return res.status(400).json({ error: 'Failed to delete customer', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Clean up related data that can link back to this customer's email/phone.
    const deleted = data[0] || {};
    const email = deleted.email || null;
    const phone = deleted.phone || null;

    try {
      // Remove any OTPs tied to this contact
      if (email || phone) {
        let otpQuery = supabase.from('customer_otps').delete();
        const ors = [];
        if (email) ors.push(`email.eq.${email}`);
        if (phone) ors.push(`phone.eq.${phone}`);
        if (ors.length) {
          otpQuery = otpQuery.or(ors.join(','));
          await otpQuery;
        }
      }
    } catch (otpCleanupErr) {
      console.warn('[Customers:Delete] Failed to cleanup OTPs:', otpCleanupErr.message || otpCleanupErr);
    }

    try {
      // Anonymize customer contact pointers in appointment-related tables so
      // future status updates won't attach historical logs to a recreated account.
      const updateData = { customer_name: null, customer_contact: null };

      const contactFilters = [];
      if (email) contactFilters.push(`customer_contact.eq.${email}`);
      if (phone) contactFilters.push(`customer_contact.eq.${phone}`);

      if (contactFilters.length) {
        const filterStr = contactFilters.join(',');

        // available_slots
        await supabase
          .from('available_slots')
          .update(updateData)
          .or(filterStr);

        // walk_in_logs
        await supabase
          .from('walk_in_logs')
          .update(updateData)
          .or(filterStr);

        // appointment_logs (if present)
        await supabase
          .from('appointment_logs')
          .update(updateData)
          .or(filterStr);
      }
    } catch (cleanupErr) {
      console.warn('[Customers:Delete] Failed to anonymize appointment records:', cleanupErr.message || cleanupErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      customer: deleted,
    });
  } catch (error) {
    console.error('[Customers:Delete] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
