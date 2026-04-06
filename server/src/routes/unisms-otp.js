import express from 'express';
import axios from 'axios';
import crypto from 'crypto';

const router = express.Router();

// In-memory OTP storage (for testing, use database in production)
const otpStorage = new Map();

// UniSMS API Base URL (correct endpoint from documentation)
const UNISMS_API_URL = 'https://unismsapi.com/api/sms';

// Prepare Basic Auth header (API key must be base64 encoded with colon)
const getUniSmsAuthHeader = () => {
  const apiKey = process.env.UNISMS_API_KEY;
  const base64Auth = Buffer.from(`${apiKey}:`).toString('base64');
  return `Basic ${base64Auth}`;
};

/**
 * POST /send-otp - Generate and send OTP via UniSMS
 */
router.post('/send-otp', async (req, res) => {
  const { phone, name } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Format phone number (accept local format like 09123456789)
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.substring(1); // 09xxx → +639xxx
      } else {
        formattedPhone = '+63' + formattedPhone; // 9xxx → +639xxx
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(phone, {
      otp,
      expiresAt,
      attempts: 0
    });

    console.log(`📱 Sending OTP to: ${phone}`);
    console.log(`🔐 OTP Code: ${otp}`);

    // Send SMS via UniSMS with correct API format
    const message = `Hello ${name}, Your BeautyBook OTP is: ${otp}. Valid for 10 minutes.`;

    const response = await axios.post(UNISMS_API_URL, {
      recipient: formattedPhone,
      content: message
    }, {
      headers: {
        'Authorization': getUniSmsAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ OTP sent successfully to', phone);
    console.log('📦 UniSMS Response:', response.data);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${phone}`,
      phone: phone
    });

  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    if (error.response) {
      console.error('UniSMS Error Response:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

/**
 * POST /verify-otp - Verify OTP code
 */
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  try {
    const storedOtp = otpStorage.get(phone);

    if (!storedOtp) {
      return res.status(401).json({ error: 'OTP not found. Request a new OTP.' });
    }

    // Check if OTP expired
    if (Date.now() > storedOtp.expiresAt) {
      otpStorage.delete(phone);
      return res.status(401).json({ error: 'OTP expired. Request a new one.' });
    }

    // Check max attempts (prevent brute force)
    if (storedOtp.attempts >= 5) {
      otpStorage.delete(phone);
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

    // OTP verified successfully - delete it
    otpStorage.delete(phone);

    console.log('✅ OTP verified successfully for:', phone);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      phone: phone,
      verified: true
    });

  } catch (error) {
    console.error('❌ Error verifying OTP:', error.message);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

/**
 * POST /resend-otp - Resend OTP (rate limited)
 */
router.post('/resend-otp', async (req, res) => {
  const { phone, name } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Delete old OTP to allow resend
    otpStorage.delete(phone);

    // Re-send new OTP
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.substring(1);
      } else {
        formattedPhone = '+63' + formattedPhone;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStorage.set(phone, {
      otp,
      expiresAt,
      attempts: 0
    });

    console.log(`📱 Resending OTP to: ${phone}`);
    console.log(`🔐 New OTP Code: ${otp}`);

    const message = `Hello ${name}, your new BeautyBook OTP is: ${otp}. Valid for 10 minutes.`;

    const response = await axios.post(UNISMS_API_URL, {
      recipient: formattedPhone,
      content: message
    }, {
      headers: {
        'Authorization': getUniSmsAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ OTP resent successfully to', phone);

    res.status(200).json({
      success: true,
      message: `New OTP resent to ${phone}`,
      phone: phone
    });

  } catch (error) {
    console.error('❌ Error resending OTP:', error.message);
    res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
  }
});

export default router;
