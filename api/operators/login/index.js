import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const getClientInfo = (req) => ({
  user_agent: req.headers['user-agent'] || null,
  ip_address: String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim() || null,
  platform: req.headers['sec-ch-ua-platform'] || null,
  language: req.headers['accept-language'] || null,
});

const appendFailedLogin = (existingValue, entry) => {
  const current = Array.isArray(existingValue) ? existingValue : [];
  return [...current, entry].slice(-20);
};

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
      .select('id, email, role, password_hash, is_active, failed_logins')
      .eq('email', normalizedEmail)
      .eq('is_active', true)
      .single();

    if (error || !credential) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const passwordMatches = await bcrypt.compare(password, credential.password_hash || '');

    if (!passwordMatches) {
      const clientInfo = getClientInfo(req);
      const failedLoginEntry = {
        device: clientInfo,
        attempted_at: new Date().toISOString(),
        reason: 'wrong_password',
      };

      await supabase
        .from('secured_credentials')
        .update({
          failed_logins: appendFailedLogin(credential.failed_logins, failedLoginEntry),
          updated_at: new Date().toISOString(),
        })
        .eq('id', credential.id);

      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const clientInfo = getClientInfo(req);
    const loginEntry = {
      ...clientInfo,
      logged_in_at: new Date().toISOString(),
    };

    await supabase
      .from('secured_credentials')
      .update({
        last_login: loginEntry,
        updated_at: new Date().toISOString(),
      })
      .eq('id', credential.id);

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