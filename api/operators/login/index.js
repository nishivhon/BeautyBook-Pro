import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data: credential, error } = await supabase
      .from('secured_credentials')
      .select('id, email, role, password_hash, is_active')
      .eq('email', normalizedEmail)
      .eq('is_active', true)
      .single();

    if (error || !credential) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, credential.password_hash || '');

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: credential.id,
        email: credential.email,
        role: credential.role,
      },
    });
  } catch (err) {
    console.error('[Operators:Login] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};