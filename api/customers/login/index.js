import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone, password } = req.body;
    const loginValue = email || phone;
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone || email);

    if (!loginValue || !password) {
      return res.status(400).json({ error: 'Email or phone and password required' });
    }

    const isEmail = String(loginValue).includes('@');

    // Query customers_accounts by email or phone
    let query = supabase
      .from('customers_accounts')
      .select('id, name, email, phone, password, histories, created_at');

    query = isEmail ? query.eq('email', normalizedEmail) : query.eq('phone', normalizedPhone);

    const { data: customers, error } = await query.limit(1);

    if (error) {
      console.error('[Customers:Login] Query error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (!customers || customers.length === 0) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }

    const customer = customers[0];

    const storedPassword = String(customer.password || '');
    const looksHashed = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');

    let passwordMatches = false;
    if (looksHashed) {
      passwordMatches = await bcrypt.compare(password, storedPassword);
    } else {
      // Backward compatibility for older accounts saved before hashing
      passwordMatches = storedPassword === password;
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
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
