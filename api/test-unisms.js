import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default async (req, res) => {
  const UNISMS_API_KEY = process.env.UNISMS_API_KEY;
  const UNISMS_API_URL = 'https://unismsapi.com/api/sms';

  console.log('[UNISMS TEST] Starting...');
  console.log('[UNISMS TEST] API Key length:', UNISMS_API_KEY?.length || 0);
  console.log('[UNISMS TEST] API Key first 10 chars:', UNISMS_API_KEY?.substring(0, 10) || 'MISSING');

  const base64Auth = Buffer.from(`${UNISMS_API_KEY}:`).toString('base64');

  const payload = {
    recipient: '+639182115559',
    content: 'Test OTP: 123456'
  };

  try {
    console.log('[UNISMS TEST] Sending request...');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('[UNISMS TEST] ⏰ Timeout triggered after 5 seconds!');
      controller.abort();
    }, 5000);

    const response = await fetch(UNISMS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    console.log('[UNISMS TEST] ✅ Got response:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('[UNISMS TEST] Response body:', responseText);

    return res.json({ 
      success: true, 
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

  } catch (error) {
    console.error('[UNISMS TEST] ❌ Error:', error.name, error.message);
    return res.status(500).json({ 
      error: error.message,
      name: error.name
    });
  }
};
