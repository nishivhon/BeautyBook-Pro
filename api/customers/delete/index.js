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
      .select('id, name');

    if (error) {
      console.error('[Customers:Delete] Delete error:', error);
      return res.status(400).json({ error: 'Failed to delete customer', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      customer: data[0],
    });
  } catch (error) {
    console.error('[Customers:Delete] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
