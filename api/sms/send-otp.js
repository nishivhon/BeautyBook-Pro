import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { saveOtp } from '../supabaseOtpClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const UNISMS_API_URL = 'https://unismsapi.com/api/sms';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, name } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Check if API key is configured
    if (!process.env.UNISMS_API_KEY) {
      console.error('[SMSOTP] UNISMS_API_KEY is not configured!');
      return res.status(500).json({ error: 'SMS service is not configured. Please contact support.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const { data: existingCustomers, error: lookupError } = await supabase
      .from('customers_accounts')
      .select('id, name, email, phone')
      .eq('phone', normalizedPhone)
      .limit(1);

    if (lookupError) {
      console.error('[SMSOTP] Duplicate lookup error:', lookupError);
      return res.status(500).json({ error: 'Failed to check existing account', details: lookupError.message });
    }

    if (existingCustomers && existingCustomers.length > 0) {
      return res.status(409).json({
        error: 'Account already exists',
        details: 'There is already an existing account with that phone number'
      });
    }

    // Format phone number
    let formattedPhone = normalizedPhone;
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.substring(1);
      } else {
        formattedPhone = '+63' + formattedPhone;
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SMSOTP] Generated OTP for ${phone}`);

    // Save OTP to Supabase
    await saveOtp({
      phone: formattedPhone,
      otp,
      name
    });

    console.log(`[SMSOTP] OTP saved to database for: ${normalizedPhone}`);

    // Send SMS and wait for result
    const smsSent = await sendSmsAsync(formattedPhone, name, otp);

    if (!smsSent) {
      console.error('[SMSOTP] Failed to send SMS');
      return res.status(500).json({ error: 'Failed to send SMS. Please try again.' });
    }

    // Return success immediately to show modal
    res.status(200).json({
      success: true,
      message: `OTP generated. Check your SMS.`,
      phone: normalizedPhone
    });

  } catch (error) {
    console.error(`[SMSOTP] Error:`, error);
    res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
  }
};

// Send SMS asynchronously and return success status
async function sendSmsAsync(formattedPhone, name, otp) {
  try {
    const message = `Hello ${name}, Your BeautyBook OTP is: ${otp}. Valid for 10 minutes.`;
    const payload = {
      recipient: formattedPhone,
      content: message
    };

    const base64Auth = Buffer.from(`${process.env.UNISMS_API_KEY}:`).toString('base64');

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
      console.error(`[SMSOTP] Failed to send SMS: HTTP ${response.status} - ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log(`[SMSOTP] SMS sent successfully to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error(`[SMSOTP] Error sending SMS:`, error.message);
    return false;
  }
}
