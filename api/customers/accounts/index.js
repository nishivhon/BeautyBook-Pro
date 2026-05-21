import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[GetCustomerAccounts] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log('[GetCustomerAccounts] Fetching all customer accounts...');

    const { data: accounts, error } = await supabase
      .from('customers_accounts')
      .select('id, name, email, phone')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GetCustomerAccounts] Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch customer accounts', details: error.message });
    }

    console.log(`[GetCustomerAccounts] Successfully fetched ${accounts?.length || 0} customer accounts`);

    res.status(200).json({
      success: true,
      count: accounts?.length || 0,
      accounts: accounts || []
    });
  } catch (error) {
    console.error(`[GetCustomerAccounts] Exception: ${error.message}`);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
