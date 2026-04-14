/**
 * Cron job to rotate appointment slots
 * Runs daily at midnight UTC
 * 
 * - Moves yesterday's and older slots to appointment_logs table
 * - Generates new slots for tomorrow (1 day ahead)
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for cron jobs
);

export default async (req, res) => {
  // Verify this is called by Supabase (optional but recommended)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[CronJob] Starting appointment slot rotation...');
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Step 1: Move yesterday's and older slots to appointment_logs
    console.log(`[CronJob] Moving slots before ${today} to appointment_logs...`);
    
    const { data: pastSlots, error: fetchError } = await supabase
      .from('available_slots')
      .select('availability, status, date, time_slot, customer_name, customer_contact, assigned_staff, services')
      .lt('date', today); // Less than today (so yesterday and older)

    if (fetchError) throw fetchError;

    if (pastSlots && pastSlots.length > 0) {
      // Insert into appointment_logs (copy all columns directly)
      const { error: insertError } = await supabase
        .from('appointment_logs')
        .insert(pastSlots);

      if (insertError) throw insertError;

      // Delete from available_slots
      const { error: deleteError } = await supabase
        .from('available_slots')
        .delete()
        .lt('date', today);

      if (deleteError) throw deleteError;

      console.log(`[CronJob] Moved ${pastSlots.length} past slots to appointment_logs`);
    }

    // Step 2: Generate new slots for the next 5 days (only if they don't exist)
    console.log(`[CronJob] Generating slots for the next 5 days...`);
    
    // Generate slots for today + next 5 days
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const targetDate = new Date(Date.now() + (dayOffset * 86400000)).toISOString().split('T')[0];
      
      const { data: existingSlots } = await supabase
        .from('available_slots')
        .select('id')
        .eq('date', targetDate);

      if (!existingSlots || existingSlots.length === 0) {
        // Generate 30-minute interval slots from 9 AM to 6 PM
        const newSlots = [];
        
        // Morning: 9:00 AM to 11:00 AM
        const morningTimes = [
          '09:00', '09:30', '10:00', '10:30', '11:00'
        ];

        // Afternoon: 2:00 PM to 5:00 PM
        const afternoonTimes = [
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
        ];

        // Add morning slots
        morningTimes.forEach(time => {
          newSlots.push({
            date: targetDate,
            time_slot: time,
            availability: true
          });
        });

        // Add afternoon slots
        afternoonTimes.forEach(time => {
          newSlots.push({
            date: targetDate,
            time_slot: time,
            availability: true
          });
        });

        if (newSlots.length > 0) {
          const { error: insertNewError } = await supabase
            .from('available_slots')
            .insert(newSlots);

          if (insertNewError) throw insertNewError;
          console.log(`[CronJob] Generated ${newSlots.length} new slots for ${targetDate}`);
        }
      } else {
        console.log(`[CronJob] Slots for ${targetDate} already exist, skipping`);
      }
    }

    console.log('[CronJob] Appointment slot rotation completed successfully!');
    return res.status(200).json({ 
      success: true, 
      message: 'Slot rotation completed'
    });

  } catch (error) {
    console.error('[CronJob] Error:', error.message);
    return res.status(500).json({ 
      error: error.message,
      details: error.details 
    });
  }
};
