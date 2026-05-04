import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[GetCustomer] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log(`[GetCustomer] Fetching customer with id=${id}`);

    const { data: customer, error } = await supabase
      .from('customers_accounts')
      .select('id, name, email, phone, histories')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[GetCustomer] Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch customer', details: error.message });
    }

    if (!customer) {
      console.warn(`[GetCustomer] Customer not found with id=${id}`);
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log('[GetCustomer] Customer fetched successfully:', { id: customer.id, name: customer.name, histories_count: Array.isArray(customer.histories) ? customer.histories.length : 0 });

    res.status(200).json({
      success: true,
      customer
    });
  } catch (error) {
    console.error(`[GetCustomer] Exception: ${error.message}`);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
