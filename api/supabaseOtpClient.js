/**
 * Supabase OTP Helper Functions
 * Handles all OTP storage and retrieval from customer_otps table
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Log to verify env vars are loaded
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[OTP] Missing Supabase config!');
  console.error(`  SUPABASE_URL: ${SUPABASE_URL ? 'loaded' : 'MISSING'}`);
  console.error(`  SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? 'loaded' : 'MISSING'}`);
  console.error(`  Attempted env vars: SUPABASE_URL, VITE_SUPABASE_URL, SUPABASE_ANON_KEY, VITE_SUPABASE_ANON_KEY`);
}

/**
 * Save OTP to database
 * Deletes old OTP first, then inserts new one
 */
export const saveOtp = async (data) => {
  try {
    const { email, phone, otp, name } = data;

    // Delete old OTP records FIRST (synchronously wait)
    if (email) {
      await deleteOtpByEmail(email);
    }
    if (phone) {
      await deleteOtpByPhone(phone);
    }

    // Insert new OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const url = `${SUPABASE_URL}/rest/v1/customer_otps`;
    const payload = {
      name: name || null,
      email: email || null,
      phone: phone || null,
      otp: otp,
      verified: false,
      expires_at: expiresAt
    };
    console.log(`[OTP] Saving OTP expiry: ${expiresAt}`);
    console.log(`[OTP] Connecting to: ${url}`);
    
    // Create abort controller with 30 second timeout (was 10s default)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP ${response.status}: ${error}`);
      }

      return true;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error(`[OTP] Error saving OTP: ${error.message}`);
    console.error(`[OTP] Error details:`, {
      message: error.message,
      code: error.code,
      name: error.name,
      supabaseUrl: SUPABASE_URL,
      keyIsSet: !!SUPABASE_ANON_KEY
    });
    throw error;
  }
};

/**
 * Get OTP by email
 */
export const getOtpByEmail = async (email) => {
  try {
    const url = `${SUPABASE_URL}/rest/v1/customer_otps?email=eq.${encodeURIComponent(email)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();
    const result = data.length > 0 ? data[0] : null;
    if (result) {
      console.log(`[OTP] Retrieved EMAIL OTP from DB - Email: ${result.email}, Expires: ${result.expires_at}`);
    }
    return result;
  } catch (error) {
    console.error(`[OTP] Error getting OTP by email: ${error.message}`);
    throw error;
  }
};

/**
 * Get OTP by phone
 */
export const getOtpByPhone = async (phone) => {
  try {
    const url = `${SUPABASE_URL}/rest/v1/customer_otps?phone=eq.${encodeURIComponent(phone)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`[OTP] Error getting OTP by phone: ${error.message}`);
    throw error;
  }
};

/**
 * Delete OTP by email
 */
export const deleteOtpByEmail = async (email) => {
  try {
    const url = `${SUPABASE_URL}/rest/v1/customer_otps?email=eq.${encodeURIComponent(email)}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return true;
  } catch (error) {
    console.error(`[OTP] Error deleting OTP by email: ${error.message}`);
    throw error;
  }
};

/**
 * Delete OTP by phone
 */
export const deleteOtpByPhone = async (phone) => {
  try {
    const url = `${SUPABASE_URL}/rest/v1/customer_otps?phone=eq.${encodeURIComponent(phone)}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return true;
  } catch (error) {
    console.error(`[OTP] Error deleting OTP by phone: ${error.message}`);
    throw error;
  }
};

/**
 * Update OTP verified status
 */
export const updateOtpVerified = async (id) => {
  try {
    const url = `${SUPABASE_URL}/rest/v1/customer_otps?id=eq.${id}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verified: true }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return true;
  } catch (error) {
    console.error(`[OTP] Error updating OTP verified: ${error.message}`);
    throw error;
  }
};
