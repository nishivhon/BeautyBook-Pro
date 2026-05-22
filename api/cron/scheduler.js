/**
 * Appointment slot rotation scheduler
 * Runs daily at midnight using node-cron
 * 
 * Usage:
 *   npm install node-cron
 *   node api/cron/scheduler.js
 */

import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * Rotate appointment slots
 */
async function rotateAppointmentSlots() {
  try {
    console.log('[Scheduler] Starting appointment slot rotation at', new Date().toISOString());
    
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Move past slots to appointment_logs
    const { data: pastSlots, error: fetchError } = await supabase
      .from('available_slots')
      .select('*')
      .lt('slot_date', today);

    if (fetchError) throw fetchError;

    if (pastSlots && pastSlots.length > 0) {
      const { error: insertError } = await supabase
        .from('appointment_logs')
        .insert(
          pastSlots.map(slot => ({
            staff_id: slot.staff_id,
            service_id: slot.service_id,
            slot_date: slot.slot_date,
            start_time: slot.start_time,
            end_time: slot.end_time,
            status: slot.status || 'pending',
            client_name: slot.client_name,
            client_phone: slot.client_phone,
            client_email: slot.client_email,
            notes: slot.notes
          }))
        );

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('available_slots')
        .delete()
        .lt('slot_date', today);

      if (deleteError) throw deleteError;

      console.log(`[Scheduler] ✓ Moved ${pastSlots.length} past slots to appointment_logs`);
    }

    // Generate new slots for tomorrow
    const { data: existingTomorrow } = await supabase
      .from('available_slots')
      .select('id')
      .eq('slot_date', tomorrow);

    if (!existingTomorrow || existingTomorrow.length === 0) {
      const { data: staffs } = await supabase.from('staffs').select('id');
      const { data: services } = await supabase.from('services').select('id, estimated_time');

      const newSlots = [];
      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
          
          for (const staff of staffs || []) {
            for (const service of services || []) {
              const slotMinutes = service.estimated_time || 30;
              const endHour = Math.floor((hour * 60 + minute + slotMinutes) / 60);
              const endMinute = (hour * 60 + minute + slotMinutes) % 60;
              const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;

              newSlots.push({
                staff_id: staff.id,
                service_id: service.id,
                slot_date: tomorrow,
                start_time: startTime,
                end_time: endTime,
                status: 'pending'
              });
            }
          }
        }
      }

      if (newSlots.length > 0) {
        const { error: insertNewError } = await supabase
          .from('available_slots')
          .insert(newSlots);

        if (insertNewError) throw insertNewError;
        console.log(`[Scheduler] ✓ Generated ${newSlots.length} new slots for ${tomorrow}`);
      }
    }

    console.log('[Scheduler] ✓ Slot rotation completed successfully!\n');

  } catch (error) {
    console.error('[Scheduler] Error:', error.message);
  }
}

/**
 * Sync daily staff statistics
 */
async function syncDailyStaffStats() {
  try {
    // Convert UTC to Philippine Time (UTC+8)
    const now = new Date();
    const phtDate = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    console.log('[Scheduler] Starting daily staff statistics sync at', phtDate.toISOString(), '(Philippine Time)');

    const staff_list = await supabase
      .from('staffs')
      .select('id, names');

    if (staff_list.error) throw staff_list.error;

    const updates = [];

    for (const s of staff_list.data || []) {
      try {
        // Count total bookings for this staff
        const { count: totalBookings, error: totalError } = await supabase
          .from('available_slots')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names);

        // Count done/completed bookings for this staff
        const { count: doneBookings, error: doneError } = await supabase
          .from('available_slots')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names)
          .eq('status', 'done');

        const totalCount = totalBookings || 0;
        const doneCount = doneBookings || 0;

        // Update the staffs table
        const { error: updateError } = await supabase
          .from('staffs')
          .update({
            total_clients: totalCount,
            done_clients: doneCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', s.id);

        if (!updateError) {
          updates.push({ name: s.names, total: totalCount, done: doneCount });
          console.log(`[Scheduler] ✓ Updated ${s.names}: total=${totalCount}, done=${doneCount}`);
        }
      } catch (err) {
        console.error(`[Scheduler] Error updating ${s.names}:`, err.message);
      }
    }

    console.log(`[Scheduler] ✓ Daily stats sync completed for ${updates.length} staff members\n`);

  } catch (error) {
    console.error('[Scheduler] Error syncing daily stats:', error.message);
  }
}

// Schedule: Run at midnight Philippine Time every day (4:00 PM UTC = 12:00 AM PHT)
// Format: minute, hour, day-of-month, month, day-of-week
// PHT is UTC+8, so 12:00 AM PHT = 4:00 PM UTC (16:00)
cron.schedule('0 16 * * *', rotateAppointmentSlots);

// Schedule: Run at midnight Philippine Time every day (4:00 PM UTC = 12:00 AM PHT)
// PHT is UTC+8, so 12:00 AM PHT = 4:00 PM UTC (16:00)
cron.schedule('0 16 * * *', syncDailyStaffStats);

console.log('[Scheduler] Appointment slot rotation scheduled for daily at 12:00 AM Philippine Time (4:00 PM UTC)');
console.log('[Scheduler] Daily staff stats sync scheduled for daily at 12:00 AM Philippine Time (4:00 PM UTC)');
console.log('[Scheduler] Waiting for jobs...\n');
