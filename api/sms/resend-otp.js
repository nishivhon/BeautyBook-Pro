import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { smsOtpStorage } from '../storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const UNISMS_API_URL = 'https://unismsapi.com/api/sms';

const getUniSmsAuthHeader = () => {
  const apiKey = process.env.UNISMS_API_KEY;
  const base64Auth = Buffer.from(`${apiKey}:`).toString('base64');
  return `Basic ${base64Auth}`;
};

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
    // Delete old OTP
    smsOtpStorage.delete(phone);

    // Format phone number
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.substring(1);
      } else {
        formattedPhone = '+63' + formattedPhone;
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    smsOtpStorage.set(phone, {
      otp,
      expiresAt,
      attempts: 0
    });

    console.log(`[SMSOTP] Resending OTP to: ${phone}`);

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

    console.log(`[SMSOTP] Resent successfully to ${phone}`);

    res.status(200).json({
      success: true,
      message: `New OTP resent to ${phone}`,
      phone: phone
    });

  } catch (error) {
    console.error(`[SMSOTP] Error resending OTP: ${error.message}`);
    if (error.response) {
      console.error(`[SMSOTP] UniSMS Error:`, error.response.data);
    }
    res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
  }
};
