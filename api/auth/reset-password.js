import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, newPassword, confirmPassword } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Email, new password, and confirm password are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if verified OTP exists
    const { data: otpRecords, error: otpError } = await supabase
      .from('customer_otps')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('verified', true)
      .limit(1);

    if (otpError) {
      console.error(`[ResetPassword] OTP lookup error:`, otpError);
      return res.status(500).json({ error: 'Failed to verify OTP status' });
    }

    if (!otpRecords || otpRecords.length === 0) {
      return res.status(403).json({ error: 'Email verification required. Please verify your email first.' });
    }

    // Update customer password
    const { data: updateData, error: updateError } = await supabase
      .from('customers_accounts')
      .update({ password: newPassword })
      .eq('email', normalizedEmail)
      .select('id, email, name');

    if (updateError) {
      console.error(`[ResetPassword] Password update error:`, updateError);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    if (!updateData || updateData.length === 0) {
      return res.status(404).json({ error: 'Customer account not found' });
    }

    // Delete the verified OTP record after successful password reset
    const { error: deleteError } = await supabase
      .from('customer_otps')
      .delete()
      .eq('email', normalizedEmail)
      .eq('verified', true);

    if (deleteError) {
      console.error(`[ResetPassword] OTP deletion error:`, deleteError);
      // Still return success as password was updated
    }

    console.log(`[ResetPassword] Password reset successfully for: ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully!',
      user: {
        email: updateData[0].email,
        name: updateData[0].name
      }
    });
  } catch (error) {
    console.error(`[ResetPassword] Error:`, error.message);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
};
