import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { saveOtp } from '../supabaseOtpClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const UNISMS_API_URL = 'https://unismsapi.com/api/sms';
const UNISMS_API_KEY = process.env.UNISMS_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');

const sendSmsAsync = async (phone, name, otp) => {
  try {
    const message = `Hello ${name}, Your BeautyBook Password Reset OTP is: ${otp}. Valid for 10 minutes.`;
    const payload = {
      recipient: phone,
      content: message
    };

    const base64Auth = Buffer.from(`${UNISMS_API_KEY}:`).toString('base64');

    // Create abort controller with 10 second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://unismsapi.com/api/sms', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ForgotPasswordPhone] Failed to send SMS: HTTP ${response.status} - ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log(`[ForgotPasswordPhone] SMS sent successfully to ${phone}`);
    return true;
  } catch (error) {
    console.error(`[ForgotPasswordPhone] Error sending SMS:`, error.message);
    return false;
  }
};

export default async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Check if API key is configured
    if (!UNISMS_API_KEY) {
      console.error('[ForgotPasswordPhone] UNISMS_API_KEY is not configured!');
      return res.status(500).json({ error: 'SMS service is not configured. Please contact support.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Check if customer exists with normalized phone (just digits)
    const { data: customer, error: lookupError } = await supabase
      .from('customers_accounts')
      .select('id, name, phone')
      .eq('phone', normalizedPhone)
      .maybeSingle();
    
    // Format phone number for SMS sending and storage
    let formattedPhone = normalizedPhone;
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.substring(1);
      } else {
        formattedPhone = '+63' + formattedPhone;
      }
    }

    if (lookupError) {
      console.error('[ForgotPasswordPhone] Lookup error:', lookupError);
      return res.status(500).json({ error: 'Failed to check account', details: lookupError.message });
    }

    if (!customer) {
      // Don't reveal if phone exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that phone number, an OTP will be sent.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[ForgotPasswordPhone] Generated OTP for ${formattedPhone}`);

    // Save OTP to Supabase
    await saveOtp({
      phone: formattedPhone,
      otp,
      name: customer.name
    });

    console.log(`[ForgotPasswordPhone] OTP saved to database for: ${formattedPhone}`);

    // Send SMS and wait for result
    const smsSent = await sendSmsAsync(formattedPhone, customer.name, otp);

    if (!smsSent) {
      console.error('[ForgotPasswordPhone] Failed to send SMS');
      return res.status(500).json({ error: 'Failed to send SMS. Please try again.' });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number.',
      phone: formattedPhone
    });
  } catch (error) {
    console.error('[ForgotPasswordPhone] Error:', error.message);
    return res.status(500).json({ error: 'Failed to process password reset request. Please try again later.' });
  }
};
