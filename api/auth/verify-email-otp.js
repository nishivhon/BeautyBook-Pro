import { getOtpByEmail, deleteOtpByEmail } from '../supabaseOtpClient.js';

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

    // OTP verified - delete it and return user data
    await deleteOtpByEmail(email);

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
