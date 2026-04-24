import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = 'BeautyBook';

export default async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
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

    // Generate a password reset token (simple token - in production, use JWT)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email via Brevo
    const emailResponse = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email,
          },
        ],
        subject: 'Password Reset Request - BeautyBook',
        htmlContent: `
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password for your BeautyBook account.</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetLink}" style="background-color: #B45309; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p>If you didn't request this, you can ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br/>BeautyBook Team</p>
        `,
        textContent: `Password Reset Request\n\nWe received a request to reset your password.\n\nClick here to reset: ${resetLink}\n\nThis link will expire in 1 hour.`,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[ForgotPassword] Password reset email sent to ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully. Please check your email.',
    });
  } catch (error) {
    console.error('[ForgotPassword] Error:', error.message);
    if (error.response?.status === 400) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    return res.status(500).json({ error: 'Failed to send password reset email. Please try again later.' });
  }
};
