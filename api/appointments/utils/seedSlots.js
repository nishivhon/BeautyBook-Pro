import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Seed available slots for the next 5 days
 * Automatically cleans up past slots before seeding
 */
export const seedAvailableSlots = async () => {
  try {
    const supabase = getSupabaseClient();

    // First, clean up any past slots
    await cleanupPastSlots();

    const today = new Date();
    const slots = [];

    // Morning: 9:00 AM to 11:00 AM (30-min intervals)
    const morningTimes = [
      '09:00', '09:30', '10:00', '10:30', '11:00'
    ];

    // Afternoon: 2:00 PM to 5:00 PM (30-min intervals)
    const afternoonTimes = [
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Generate slots for next 5 days
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Add morning slots
      morningTimes.forEach(time => {
        slots.push({
          date: dateStr,
          time_slot: time,
          availability: true
        });
      });

      // Add afternoon slots
      afternoonTimes.forEach(time => {
        slots.push({
          date: dateStr,
          time_slot: time,
          availability: true
        });
      });
    }

    // Insert all slots
    const { data, error } = await supabase
      .from('available_slots')
      .insert(slots)
      .select();

    if (error) {
      console.error('[SeedSlots] Error inserting slots:', error);
      return { success: false, error: error.message };
    }

    console.log(`[SeedSlots] Successfully seeded ${data?.length || 0} available slots`);
    return { success: true, count: data?.length || 0 };
  } catch (error) {
    console.error('[SeedSlots] Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Clean up past slots (dates before today)
 */
export const cleanupPastSlots = async () => {
  try {
    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD

    const { data, error } = await supabase
      .from('available_slots')
      .delete()
      .lt('date', today); // Delete all rows where date < today

    if (error) {
      console.error('[SeedSlots] Error cleaning up past slots:', error);
      return { success: false, error: error.message };
    }

    console.log('[SeedSlots] Successfully cleaned up past slots');
    return { success: true };
  } catch (error) {
    console.error('[SeedSlots] Error in cleanupPastSlots:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Clear all available slots
 * Use this if you need to reset and re-seed
 */
export const clearAvailableSlots = async () => {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('available_slots')
      .delete()
      .gte('id', '0'); // Delete all rows

    if (error) {
      console.error('[SeedSlots] Error clearing slots:', error);
      return { success: false, error: error.message };
    }

    console.log('[SeedSlots] Successfully cleared all available slots');
    return { success: true };
  } catch (error) {
    console.error('[SeedSlots] Error:', error.message);
    return { success: false, error: error.message };
  }
};
