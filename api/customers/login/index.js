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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Query customers_accounts by email
    const { data: customers, error } = await supabase
      .from('customers_accounts')
      .select('id, name, email, phone, password, histories, created_at')
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('[Customers:Login] Query error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (!customers || customers.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const customer = customers[0];

    // Compare passwords (simple comparison for now)
    // TODO: In production, use bcrypt to compare hashed passwords
    if (customer.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful
    return res.status(200).json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: 'customer',
      },
    });
  } catch (err) {
    console.error('[Customers:Login] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
