import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default async (req, res) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
  const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

  console.log('[BREVO TEST] Starting...');
  console.log('[BREVO TEST] API Key length:', BREVO_API_KEY?.length || 0);
  console.log('[BREVO TEST] API Key first 10 chars:', BREVO_API_KEY?.substring(0, 10) || 'MISSING');
  console.log('[BREVO TEST] Endpoint:', BREVO_API_URL);

  const emailBody = {
    sender: {
      name: 'BeautyBook Test',
      email: BREVO_SENDER_EMAIL
    },
    to: [
      {
        email: 'test@example.com',
        name: 'Test User'
      }
    ],
    subject: 'Test Email',
    htmlContent: '<p>Test</p>'
  };

  try {
    console.log('[BREVO TEST] Sending request...');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('[BREVO TEST] ⏰ Timeout triggered after 5 seconds!');
      controller.abort();
    }, 5000);

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

    console.log('[BREVO TEST] ✅ Got response:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('[BREVO TEST] Response body:', responseText);

    return res.json({ 
      success: true, 
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

  } catch (error) {
    console.error('[BREVO TEST] ❌ Error:', error.name, error.message);
    return res.status(500).json({ 
      error: error.message,
      name: error.name
    });
  }
};
