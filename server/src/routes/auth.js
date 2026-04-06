import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// Initialize Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_SMTP_USERNAME,
    pass: process.env.BREVO_SMTP_PASSWORD
  }
});

// In-memory storage for verification tokens (testing only, no database)
const verificationTokens = new Map();

/**
 * POST /signup - DEPRECATED: Use /send-email-otp instead
 * Magic links are no longer used. All email verification uses OTP only.
 */
router.post('/signup', async (req, res) => {
  return res.status(410).json({ 
    error: 'Magic links deprecated. Use /send-email-otp endpoint for email OTP verification.',
    endpoint: '/send-email-otp'
  });
});

/**
 * GET /auth-callback - DEPRECATED: Magic links no longer used
 * Use /send-email-otp and /verify-email-otp instead
 */
router.get('/auth-callback', async (req, res) => {
  return res.status(410).json({ 
    error: 'Magic links deprecated. Use /send-email-otp and /verify-email-otp for email OTP verification.'
  });
});

/**
 * POST /auth-callback - DEPRECATED: Magic links no longer used
 * Use /send-email-otp and /verify-email-otp instead
 */
router.post('/auth-callback', async (req, res) => {
  return res.status(410).json({ 
    error: 'Magic links deprecated. Use /send-email-otp and /verify-email-otp for email OTP verification.'
  });
});

// In-memory storage for email OTP
const emailOtpStorage = new Map();

/**
 * POST /send-email-otp - Generate and send OTP via email
 */
router.post('/send-email-otp', async (req, res) => {
  const { email, full_name, phone } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP in memory
    emailOtpStorage.set(email, {
      otp,
      expiresAt,
      attempts: 0,
      full_name,
      phone
    });

    console.log(`📧 Sending OTP to: ${email}`);
    console.log(`🔐 OTP Code: ${otp}`);

    // Send OTP via Brevo SMTP
    const emailResponse = await transporter.sendMail({
      from: `BeautyBook <${process.env.BREVO_SENDER_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - BeautyBook',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dd901d;">Email Verification</h2>
          <p>Hi ${full_name},</p>
          <p>Your BeautyBook verification code is:</p>
          <p style="font-size: 32px; font-weight: bold; color: #dd901d; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </p>
          <p>This code expires in 10 minutes.</p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    });

    console.log('✅ Email OTP sent successfully, Message ID:', emailResponse.messageId);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      email: email
    });
  } catch (error) {
    console.error('❌ Error sending email OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

/**
 * POST /verify-email-otp - Verify email OTP
 */
router.post('/verify-email-otp', async (req, res) => {
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

    console.log('✅ Email OTP verified successfully for:', email);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        email: email,
        full_name: storedOtp.full_name,
        phone: storedOtp.phone || ''
      }
    });
  } catch (error) {
    console.error('❌ Error verifying email OTP:', error.message);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

export default router;
