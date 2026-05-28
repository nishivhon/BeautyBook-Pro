import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { saveOtp } from '../supabaseOtpClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = 'BeautyBook';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const sendEmailAsync = async (email, name, otp) => {
  try {
    const axios = (await import('axios')).default;
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject: 'Password Reset OTP - BeautyBook',
        htmlContent: `
          <h2>Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password for your BeautyBook account.</p>
          <p>Your 6-digit verification code is:</p>
          <h1 style="font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; color: #B45309;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, you can ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br/>BeautyBook Team</p>
        `,
        textContent: `Password Reset OTP\n\nHi ${name},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[ForgotPassword] OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('[ForgotPassword] Error sending email:', error.message);
    return false;
  }
};

export default async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if API key is configured
    if (!BREVO_API_KEY) {
      console.error('[ForgotPassword] BREVO_API_KEY is not configured!');
      return res.status(500).json({ error: 'Email service is not configured. Please contact support.' });
    }

    if (!BREVO_SENDER_EMAIL) {
      console.error('[ForgotPassword] BREVO_SENDER_EMAIL is not configured!');
      return res.status(500).json({ error: 'Email service is not configured. Please contact support.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Check if customer exists
    const { data: customer, error: lookupError } = await supabase
      .from('customers_accounts')
      .select('id, name, email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error('[ForgotPassword] Lookup error:', lookupError);
      return res.status(500).json({ error: 'Failed to check account', details: lookupError.message });
    }

    if (!customer) {
      // Don't reveal if email exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, an OTP will be sent.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[ForgotPassword] Generated OTP for ${normalizedEmail}`);

    // Save OTP to Supabase
    await saveOtp({
      email: normalizedEmail,
      otp,
      name: customer.name
    });

    console.log(`[ForgotPassword] OTP saved to database for: ${normalizedEmail}`);

    // Send email and wait for result
    const emailSent = await sendEmailAsync(normalizedEmail, customer.name, otp);

    if (!emailSent) {
      console.error('[ForgotPassword] Failed to send email');
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please check your inbox.',
      email: normalizedEmail
    });
  } catch (error) {
    console.error('[ForgotPassword] Error:', error.message);
    return res.status(500).json({ error: 'Failed to process password reset request. Please try again later.' });
  }
};
