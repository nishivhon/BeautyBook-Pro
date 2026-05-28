import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date query parameter is required (YYYY-MM-DD)' });
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('available_slots')
      .select('id, date, cancellations')
      .eq('date', date);

    if (error) {
      console.error('[daily-cancellations] Error fetching available_slots:', error);
      return res.status(500).json({ error: 'Failed to read available_slots', details: error.message });
    }

    const totalCancellations = (data || []).reduce((sum, row) => sum + (Number(row.cancellations) || 0), 0);

    return res.status(200).json({
      success: true,
      date,
      count: totalCancellations,
      totalCancellations,
    });
  } catch (error) {
    console.error('[daily-cancellations] Unexpected error:', error.message);
    return res.status(500).json({ error: 'Unexpected server error', details: error.message });
  }
};