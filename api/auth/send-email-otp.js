import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveOtp } from '../supabaseOtpClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USERNAME,
    pass: process.env.BREVO_SMTP_PASSWORD
  }
});

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

    // Save OTP to Supabase
    await saveOtp({
      email,
      phone,
      otp,
      name: full_name
    });

    console.log(`[EmailOTP] Sending OTP to: ${email}`);

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

    console.log(`[EmailOTP] Sent successfully, Message ID: ${emailResponse.messageId}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      email: email
    });
  } catch (error) {
    console.error(`[EmailOTP] Error sending OTP: ${error.message}`);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};
