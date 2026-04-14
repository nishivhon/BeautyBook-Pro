import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

// Convert 24-hour time format to 12-hour format
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

  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  try {
    console.log(`[AvailableSlots] Fetching slots for date: ${date}`);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    console.log(`[AvailableSlots] Supabase URL: ${supabaseUrl ? 'loaded' : 'MISSING'}`);
    console.log(`[AvailableSlots] Supabase Key: ${supabaseKey ? 'loaded' : 'MISSING'}`);

    if (!supabaseUrl || !supabaseKey) {
      console.error('[AvailableSlots] Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log(`[AvailableSlots] Client created successfully`);

    // Get all available slots for the date
    const { data: slots, error } = await supabase
      .from('available_slots')
      .select('id, date, time_slot, availability')
      .eq('date', date)
      .eq('availability', true)
      .order('time_slot', { ascending: true });

    if (error) {
      console.error('[AvailableSlots] Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch available slots', details: error.message });
    }

    console.log(`[AvailableSlots] Found ${slots?.length || 0} available slots`);

    // Format time slots to 12-hour format
    const formattedSlots = slots.map(slot => ({
      id: slot.id,
      time: convertTo12HourFormat(slot.time_slot),
      time_24: slot.time_slot,
      date: slot.date,
      available: slot.availability
    }));

    console.log(`[AvailableSlots] Returning ${formattedSlots.length} formatted slots`);
    res.status(200).json({
      success: true,
      date: date,
      slots: formattedSlots,
      totalAvailable: formattedSlots.length
    });

  } catch (error) {
    console.error(`[AvailableSlots] Error:`, error.message);
    res.status(500).json({ error: 'Failed to fetch available slots', details: error.message });
  }
};
