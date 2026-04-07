import { emailOtpStorage } from '../storage.js';

export default (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const storedOtp = emailOtpStorage.get(email);

    if (!storedOtp) {
      return res.status(401).json({ error: 'OTP not found. Request a new OTP.' });
    }

    // Check if OTP expired
    if (Date.now() > storedOtp.expiresAt) {
      emailOtpStorage.delete(email);
      return res.status(401).json({ error: 'OTP expired. Request a new one.' });
    }

    // Check max attempts
    if (storedOtp.attempts >= 5) {
      emailOtpStorage.delete(email);
      return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
    }

    // Verify OTP
    if (storedOtp.otp !== otp) {
      storedOtp.attempts += 1;
      return res.status(401).json({
        error: 'Invalid OTP. Please try again.',
        attemptsLeft: 5 - storedOtp.attempts
      });
    }

    // OTP verified - delete it and return user data
    emailOtpStorage.delete(email);

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
