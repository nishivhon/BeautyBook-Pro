import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, phone, newPassword, confirmPassword } = req.body;
  const normalizedEmail = email ? normalizeEmail(email) : null;
  const normalizedPhone = phone ? normalizePhone(phone) : null;

  if ((!normalizedEmail && !normalizedPhone) || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Email or phone, new password, and confirm password are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if verified OTP exists
    let otpQuery = supabase
      .from('customer_otps')
      .select('id')
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (normalizedEmail) {
      otpQuery = otpQuery.eq('email', normalizedEmail);
    } else if (normalizedPhone) {
      // Format phone for OTP table lookup (stores with +63 prefix)
      let formattedPhone = normalizedPhone;
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+63' + formattedPhone.substring(1);
        } else {
          formattedPhone = '+63' + formattedPhone;
        }
      }
      otpQuery = otpQuery.eq('phone', formattedPhone);
    }

    const { data: otpRecords, error: otpError } = await otpQuery;

    if (otpError) {
      console.error(`[ResetPassword] OTP lookup error:`, otpError);
      return res.status(500).json({ error: 'Failed to verify OTP status' });
    }

    if (!otpRecords || otpRecords.length === 0) {
      const fieldType = normalizedEmail ? 'Email' : 'Phone';
      return res.status(403).json({ error: `${fieldType} verification required. Please verify your ${fieldType.toLowerCase()} first.` });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update customer password by email or phone
    let updateQuery = supabase
      .from('customers_accounts')
      .update({ password: hashedPassword })
      .select('id, email, name');

    if (normalizedEmail) {
      updateQuery = updateQuery.eq('email', normalizedEmail);
    } else if (normalizedPhone) {
      updateQuery = updateQuery.eq('phone', normalizedPhone);
    }

    const { data: updateData, error: updateError } = await updateQuery;

    if (updateError) {
      console.error(`[ResetPassword] Password update error:`, updateError);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    if (!updateData || updateData.length === 0) {
      return res.status(404).json({ error: 'Customer account not found' });
    }

    // Delete the verified OTP record after successful password reset
    let deleteQuery = supabase
      .from('customer_otps')
      .delete()
      .eq('verified', true);

    if (normalizedEmail) {
      deleteQuery = deleteQuery.eq('email', normalizedEmail);
    } else if (normalizedPhone) {
      // Format phone for OTP table lookup (stores with +63 prefix)
      let formattedPhone = normalizedPhone;
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+63' + formattedPhone.substring(1);
        } else {
          formattedPhone = '+63' + formattedPhone;
        }
      }
      deleteQuery = deleteQuery.eq('phone', formattedPhone);
    }

    const { error: deleteError } = await deleteQuery;

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
