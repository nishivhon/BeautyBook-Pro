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
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Email, current password, new password, and confirm password are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const { data: credential, error } = await supabase
      .from('secured_credentials')
      .select('id, email, password_hash')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error || !credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const currentPasswordMatches = await bcrypt.compare(currentPassword, credential.password_hash || '');

    if (!currentPasswordMatches) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('secured_credentials')
      .update({
        password_hash: hashedPassword,
        last_password_change_at: now,
        updated_at: now,
      })
      .eq('id', credential.id);

    if (updateError) {
      console.error('[Operators:ChangePassword] Update error:', updateError);
      return res.status(500).json({ error: 'Failed to update password', details: updateError.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: {
        email: credential.email,
        last_password_change_at: now,
      },
    });
  } catch (error) {
    console.error('[Operators:ChangePassword] Error:', error.message);
    return res.status(500).json({ error: 'Failed to change password', details: error.message });
  }
};