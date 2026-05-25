import { getOtpByPhone, deleteOtpByPhone } from '../supabaseOtpClient.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  try {
    // Format phone number to match what's in database
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.substring(1);
      } else {
        formattedPhone = '+63' + formattedPhone;
      }
    }

    console.log(`[SMSOTP] Verification - Received: ${phone}, Formatted: ${formattedPhone}`);

    const storedOtp = await getOtpByPhone(formattedPhone);

    if (!storedOtp) {
      return res.status(401).json({ error: 'OTP not found. Request a new OTP.' });
    }

    // Check if OTP expired (ensure Z suffix for proper UTC parsing)
    const now = new Date();
    const expiresAtStr = storedOtp.expires_at.endsWith('Z') ? storedOtp.expires_at : `${storedOtp.expires_at}Z`;
    const expiresAt = new Date(expiresAtStr);
    console.log(`[SMSOTP] Verification - Now: ${now.toISOString()}, Expires: ${expiresAt.toISOString()}`);
    
    if (now > expiresAt) {
      await deleteOtpByPhone(formattedPhone);
      return res.status(401).json({ error: 'OTP expired. Request a new one.' });
    }

    // Verify OTP
    if (storedOtp.otp !== otp) {
      return res.status(401).json({
        error: 'Invalid OTP. Please try again.'
      });
    }

    // OTP verified - mark as verified instead of deleting
    const { error: updateError } = await supabase
      .from('customer_otps')
      .update({ verified: true })
      .eq('id', storedOtp.id);

    if (updateError) {
      console.error(`[SMSOTP] Error marking OTP as verified:`, updateError);
      return res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
    }

    console.log(`[SMSOTP] Verified successfully for: ${phone}`);

    res.status(200).json({
      success: true,
      verified: true,
      message: 'OTP verified successfully!',
      user: {
        phone: phone,
        full_name: storedOtp.name || '',
        email: storedOtp.email || ''
      }
    });

  } catch (error) {
    console.error(`[SMSOTP] Error verifying: ${error.message}`);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
};
