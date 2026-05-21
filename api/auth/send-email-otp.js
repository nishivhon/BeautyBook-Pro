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

export default async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, full_name } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  try {
    // Check if API key is configured
    if (!BREVO_API_KEY) {
      console.error('[EmailOTP] BREVO_API_KEY is not configured!');
      return res.status(500).json({ error: 'Email service is not configured. Please contact support.' });
    }

    if (!BREVO_SENDER_EMAIL) {
      console.error('[EmailOTP] BREVO_SENDER_EMAIL is not configured!');
      return res.status(500).json({ error: 'Email service is not configured. Please contact support.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const { data: existingCustomer, error: lookupError } = await supabase
      .from('customers_accounts')
      .select('id, name, email, phone')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error('[EmailOTP] Duplicate lookup error:', lookupError);
      return res.status(500).json({ error: 'Failed to check existing account', details: lookupError.message });
    }

    if (existingCustomer) {
      return res.status(409).json({
        error: 'Account already exists',
        details: 'There is already an existing account with that email address'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    console.log(`[EmailOTP] Generated OTP for ${email}`);

    // Save OTP to Supabase
    await saveOtp({
      email: normalizedEmail,
      otp,
      name: full_name
    });

    console.log(`[EmailOTP] OTP saved to database for: ${normalizedEmail}`);

    // Send email and wait for result
    const emailSent = await sendEmailAsync(normalizedEmail, full_name, otp);

    if (!emailSent) {
      console.error('[EmailOTP] Failed to send email');
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

    // Return success immediately to show modal
    res.status(200).json({
      success: true,
      message: 'OTP generated. Check your email.',
      email: normalizedEmail
    });

  } catch (error) {
    console.error(`[EmailOTP] Error:`, error);
    res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
  }
};

// Send email asynchronously and return success status
async function sendEmailAsync(email, full_name, otp) {
  try {
    const emailBody = {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL
      },
      to: [
        {
          email: email,
          name: full_name
        }
      ],
      subject: 'Verify Your Email - BeautyBook',
      htmlContent: `
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
    };

    // Create abort controller with 10 second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[EmailOTP] Failed to send email: HTTP ${response.status} - ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log(`[EmailOTP] Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EmailOTP] Error sending email:`, error.message);
    return false;
  }
}
