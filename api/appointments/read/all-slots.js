import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

function convertTo12HourFormat(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date parameter is required' });

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: slots, error } = await supabase
      .from('available_slots')
      .select('id, date, time_slot, availability, assigned_staff')
      .eq('date', date)
      .order('time_slot', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch slots', details: error.message });
    }

    const formatted = (slots || []).map(s => ({
      id: s.id,
      date: s.date,
      time_24: s.time_slot,
      time: convertTo12HourFormat(s.time_slot),
      available: s.availability,
      assigned_staff: s.assigned_staff || null,
    }));

    res.status(200).json({ success: true, date, slots: formatted, total: formatted.length });
  } catch (err) {
    console.error('[AllSlots] Error', err);
    res.status(500).json({ error: 'Failed to fetch slots', details: err.message });
  }
};
