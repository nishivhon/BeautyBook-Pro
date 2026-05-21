import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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

    const hashedPassword = await bcrypt.hash(password, 12);

    // Set histories to null if not provided
    const insertData = {
      name,
      password: hashedPassword,
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

    return res.status(201).json({
      success: true,
      data: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
      }
    });
  } catch (err) {
    console.error('[Customers:Create] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
