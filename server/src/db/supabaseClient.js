/**
 * Supabase REST API Client for Backend Services
 * More reliable than direct PostgreSQL connection for serverless/Node environments
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

console.log('[Supabase] Initializing Supabase client');
console.log(`  URL: ${SUPABASE_URL}`);

/**
 * Generic query helper for Supabase REST API
 */
const querySupabase = async (table, options = {}) => {
  try {
    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    
    // Build query params
    const params = new URLSearchParams();
    
    if (options.select) {
      params.append('select', options.select);
    }
    
    // Handle filters - Supabase uses format: field=eq.value
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (key === 'category') {
          params.append('category', `eq.${value}`);
        } else if (key === 'id') {
          params.append('id', `eq.${value}`);
        }
      });
    }
    
    if (options.order) {
      // Supabase order format: "field.asc" or "field.desc"
      params.append('order', options.order);
    }
    
    if (options.limit) {
      params.append('limit', options.limit);
    }
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
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
      console.error(`[Supabase] HTTP ${response.status}: ${error}`);
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[Supabase] Query error: ${error.message}`);
    throw error;
  }
};

/**
 * Upsert (insert or update) records
 */
const upsertSupabase = async (table, data) => {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(Array.isArray(data) ? data : [data]),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    return true;
  } catch (error) {
    console.error(`[Supabase] Upsert error: ${error.message}`);
    throw error;
  }
};

export { querySupabase, upsertSupabase };
