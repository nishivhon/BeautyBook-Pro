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
    const { name, email, phone, password, histories } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, password' });
    }

    // Set histories to null if not provided
    const insertData = {
      name,
      password,
      ...(email && { email }),
      ...(phone && { phone }),
      histories: histories || null,
    };

    const { data, error } = await supabase
      .from('customers_accounts')
      .insert([insertData])
      .select();

    if (error) {
      console.error('[Customers:Create] Error:', error);
      return res.status(400).json({ error: 'Failed to create account', details: error.message });
    }

    return res.status(201).json(data[0]);
  } catch (err) {
    console.error('[Customers:Create] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
