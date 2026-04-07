import { smsOtpStorage } from '../storage.js';

export default (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  try {
    const storedOtp = smsOtpStorage.get(phone);

    if (!storedOtp) {
      return res.status(401).json({ error: 'OTP not found. Request a new OTP.' });
    }

    // Check if OTP expired
    if (Date.now() > storedOtp.expiresAt) {
      smsOtpStorage.delete(phone);
      return res.status(401).json({ error: 'OTP expired. Request a new one.' });
    }

    // Check max attempts
    if (storedOtp.attempts >= 5) {
      smsOtpStorage.delete(phone);
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

    // OTP verified - delete it
    smsOtpStorage.delete(phone);

    console.log(`[SMSOTP] Verified successfully for: ${phone}`);

    res.status(200).json({
      success: true,
      verified: true,
      message: 'OTP verified successfully!',
      phone: phone
    });

  } catch (error) {
    console.error(`[SMSOTP] Error verifying: ${error.message}`);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
};
