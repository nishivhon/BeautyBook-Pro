import { getOtpByEmail, deleteOtpByEmail, updateOtpVerified } from '../supabaseOtpClient.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

export default async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const storedOtp = await getOtpByEmail(email);

    if (!storedOtp) {
      return res.status(401).json({ error: 'OTP not found. Request a new OTP.' });
    }

    // Check if OTP expired
    const now = new Date();
    const expiresAtStr = storedOtp.expires_at.endsWith('Z') ? storedOtp.expires_at : `${storedOtp.expires_at}Z`;
    const expiresAt = new Date(expiresAtStr);
    console.log(`[EmailOTP] Verification - Now: ${now.toISOString()}, Expires: ${expiresAt.toISOString()}`);
    
    if (now > expiresAt) {
      await deleteOtpByEmail(email);
      return res.status(401).json({ error: 'OTP expired. Request a new one.' });
    }

    // Verify OTP
    if (storedOtp.otp !== otp) {
      return res.status(401).json({
        error: 'Invalid OTP. Please try again.'
      });
    }

    // OTP verified - mark only the exact unverified row as verified
    try {
      await updateOtpVerified({
        id: storedOtp.id,
        otp,
        email: storedOtp.email || email,
      });
    } catch (updateError) {
      console.error(`[EmailOTP] Error marking OTP as verified:`, updateError);
      return res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
    }

    console.log(`[EmailOTP] Verified successfully for: ${email}`);

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Email verified successfully!',
      user: {
        email: email,
        full_name: storedOtp.full_name,
        phone: storedOtp.phone || ''
      }
    });
  } catch (error) {
    console.error(`[EmailOTP] Error verifying: ${error.message}`);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
};
