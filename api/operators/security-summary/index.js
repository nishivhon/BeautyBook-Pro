import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const normalizeRole = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/[-_]+/g, ' ');
};

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = normalizeEmail(req.query.email);
    const role = normalizeRole(req.query.role);

    if (!email && !role) {
      return res.status(400).json({ error: 'email or role query parameter is required' });
    }

    let query = supabase
      .from('secured_credentials')
      .select('id, email, role, last_password_change_at, failed_logins, last_login, updated_at');

    if (email) {
      query = query.eq('email', email);
    } else {
      query = query.eq('role', role);
    }

    const { data: credential, error } = await query.single();

    if (error || !credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const failedLogins = Array.isArray(credential.failed_logins) ? credential.failed_logins : [];

    return res.status(200).json({
      success: true,
      data: {
        id: credential.id,
        email: credential.email,
        role: credential.role,
        last_password_change_at: credential.last_password_change_at,
        failed_login_count: failedLogins.length,
        failed_logins: failedLogins,
        last_login: credential.last_login,
        updated_at: credential.updated_at,
      },
    });
  } catch (error) {
    console.error('[Operators:SecuritySummary] Error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch security summary', details: error.message });
  }
};