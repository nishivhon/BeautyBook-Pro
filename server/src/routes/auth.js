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
 * POST /signup - Send verification email via Brevo (no database save)
 */
router.post('/signup', async (req, res) => {
  const { email, full_name, phone } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  try {
    // Generate magic token
    const magicToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store token in memory (no database)
    verificationTokens.set(magicToken, {
      email,
      full_name,
      phone,
      expiresAt: expiresAt.getTime()
    });

    // Generate magic link URL
    const magicLink = `${process.env.FRONTEND_URL}/auth/callback?token=${magicToken}&email=${encodeURIComponent(email)}&full_name=${encodeURIComponent(full_name)}&phone=${encodeURIComponent(phone || '')}`;

    console.log('🔑 Brevo SMTP configured:', !!process.env.BREVO_API_KEY && !!process.env.BREVO_SENDER_EMAIL);
    console.log('📧 Attempting to send email to:', email);

    // Send email via Brevo SMTP
    const emailResponse = await transporter.sendMail({
      from: `BeautyBook <${process.env.BREVO_SENDER_EMAIL}>`,
      to: email,
      subject: 'Verify Your Booking - BeautyBook',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dd901d;">Verify Your Booking</h2>
          <p>Hi ${full_name},</p>
          <p>Click the link below to verify your email and start booking appointments:</p>
          <p style="margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #dd901d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Booking
            </a>
          </p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            This link expires in 10 minutes.
          </p>
        </div>
      `
    });

    console.log('✅ Email sent successfully, Message ID:', emailResponse.messageId);
    console.log('📦 Full Response:', emailResponse);

    res.status(200).json({
      message: 'Verification email sent. Check your inbox!',
      user: { email, full_name }
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
  }
});

/**
 * GET /auth-callback - Verify email token and redirect to appointments
 * Called when user clicks the magic link in email
 */
router.get('/auth-callback', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    // Get token from memory
    const tokenData = verificationTokens.get(token);
    
    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid or expired verification link' });
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      verificationTokens.delete(token);
      return res.status(401).json({ error: 'Token expired' });
    }

    // Token is valid - delete it after use
    verificationTokens.delete(token);

    // Redirect to appointment page with user data in URL
    const appointmentUrl = `${process.env.FRONTEND_URL}/book-appointment?email=${encodeURIComponent(tokenData.email)}&full_name=${encodeURIComponent(tokenData.full_name)}&phone=${encodeURIComponent(tokenData.phone || '')}`;
    
    res.redirect(appointmentUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * POST /auth-callback - Alternative for POST requests
 */
router.post('/auth-callback', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    // Get token from memory
    const tokenData = verificationTokens.get(token);
    
    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid or expired verification link' });
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      verificationTokens.delete(token);
      return res.status(401).json({ error: 'Token expired' });
    }

    // Token is valid - delete it after use
    verificationTokens.delete(token);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        email: tokenData.email,
        full_name: tokenData.full_name,
        phone: tokenData.phone
      }
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});


export default router;
