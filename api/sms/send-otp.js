import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveOtp } from '../supabaseOtpClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const UNISMS_API_URL = 'https://unismsapi.com/api/sms';

console.log('[UniSMS] Configuration:');
console.log(`  API URL: ${UNISMS_API_URL}`);
console.log(`  API Key: ${process.env.UNISMS_API_KEY ? '✅ Set' : '❌ Missing'}`);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, name } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Format phone number
    let formattedPhone = phone;
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
    console.log(`[SMSOTP] 🔐 OTP CODE: ${otp} (for testing - copy from here)`);

    // Save OTP to Supabase
    await saveOtp({
      phone: formattedPhone,
      otp,
      name
    });

    console.log(`[SMSOTP] OTP saved to database for: ${phone}`);

    // Send SMS synchronously (wait for result before responding)
    await sendSmsAsync(formattedPhone, name, otp);

    // Return success immediately to show modal
    res.status(200).json({
      success: true,
      message: `OTP generated. Check your SMS.`,
      phone: phone
    });

  } catch (error) {
    console.error(`[SMSOTP] Error:`, error);
    res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
  }
};

// Send SMS asynchronously without blocking
async function sendSmsAsync(formattedPhone, name, otp) {
  try {
    console.log(`[SMSOTP] 🚀 Calling UniSMS API...`);
    console.log(`  Recipient: ${formattedPhone}`);
    console.log(`  Name: ${name}`);
    console.log(`  OTP: ${otp}`);

    const message = `Hello ${name}, Your BeautyBook OTP is: ${otp}. Valid for 10 minutes.`;
    const payload = {
      recipient: formattedPhone,
      content: message
    };

    const base64Auth = Buffer.from(`${process.env.UNISMS_API_KEY}:`).toString('base64');

    console.log(`[SMSOTP] 📤 Sending SMS with payload:`, JSON.stringify(payload));

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

    console.log(`[SMSOTP] DEBUG - Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[SMSOTP] ❌ HTTP ${response.status}: ${errorText}`);
      return;
    }

    const result = await response.json();
    console.log(`[SMSOTP] ✅ SMS sent! Message ID: ${result.message.reference_id}`);
  } catch (error) {
    console.error(`[SMSOTP] ❌ Background SMS error:`, error);
    console.error(`[SMSOTP] Error name: ${error.name}`);
    console.error(`[SMSOTP] Error message: ${error.message}`);
  }
}
