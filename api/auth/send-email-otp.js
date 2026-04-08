import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveOtp } from '../supabaseOtpClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = 'BeautyBook';

console.log('[Brevo] REST API configured:');
console.log(`  Endpoint: ${BREVO_API_URL}`);
console.log(`  API Key: ${BREVO_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`  Sender: ${BREVO_SENDER_EMAIL}`);
console.log(`  Sender Name: ${BREVO_SENDER_NAME}`);

export default async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, full_name, phone } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    console.log(`[EmailOTP] Generated OTP for ${email}, expires at: ${expiresAt}`);
    console.log(`[EmailOTP] 🔐 OTP CODE: ${otp} (for testing - copy from here)`);


    // Save OTP to Supabase
    await saveOtp({
      email,
      phone,
      otp,
      name: full_name
    });

    console.log(`[EmailOTP] OTP saved to database for: ${email}`);

    // Send email synchronously (wait for result before responding)
    await sendEmailAsync(email, full_name, otp);

    // Return success immediately to show modal
    res.status(200).json({
      success: true,
      message: 'OTP generated. Check your email.',
      email: email
    });

  } catch (error) {
    console.error(`[EmailOTP] Error:`, error);
    res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
  }
};

// Send email asynchronously without blocking
async function sendEmailAsync(email, full_name, otp) {
  try {
    console.log(`[EmailOTP] 🚀 Calling Brevo REST API...`);
    console.log(`  To: ${email}`);
    console.log(`  User: ${full_name}`);
    console.log(`  OTP: ${otp}`);

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

    console.log(`[EmailOTP] 📧 Sending mail with subject: "${emailBody.subject}"`);
    console.log(`[EmailOTP] ⏳ Waiting for Brevo response...`);
    console.log(`[EmailOTP] DEBUG - API Key length: ${BREVO_API_KEY.length}`);
    console.log(`[EmailOTP] DEBUG - Endpoint: ${BREVO_API_URL}`);

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

    console.log(`[EmailOTP] DEBUG - Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[EmailOTP] ❌ HTTP ${response.status}: ${errorText}`);
      return;
    }

    const result = await response.json();
    console.log(`[EmailOTP] ✅ Email sent! Message ID: ${result.messageId}`);
  } catch (error) {
    console.error(`[EmailOTP] ❌ Background email error:`, error);
    console.error(`[EmailOTP] Error name: ${error.name}`);
    console.error(`[EmailOTP] Error message: ${error.message}`);
  }
}
