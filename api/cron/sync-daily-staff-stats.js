import { createClient } from '@supabase/supabase-js';

/**
 * End-of-day cron job to sync staff statistics from appointment sources to staffs table
 * Calculates total_clients, done_clients, and total_walk_in for each staff member
 *
 * This job:
 * 1. Counts total bookings for each staff from available_slots (total_clients)
 * 2. Counts same-day walk-ins for each staff from walk_in_logs (total_walk_in)
 * 3. Counts completed bookings for each staff from available_slots and walk_in_logs (done_clients)
 * 4. Updates the staffs table with these counts
 */
export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('[SyncDailyStats] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    );

    // Convert UTC to Philippine Time (UTC+8)
    const now = new Date();
    const phtDate = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    const today = phtDate.toISOString().split('T')[0];

    console.log('[SyncDailyStats] Starting daily staff statistics sync at', phtDate.toISOString(), '(Philippine Time)');
    console.log('[SyncDailyStats] Counting walk-in logs for date:', today);

    // Get all staff
    const { data: staff, error: staffError } = await supabase
      .from('staffs')
      .select('id, names');

    if (staffError) {
      console.error('[SyncDailyStats] Error fetching staff:', staffError);
      return res.status(500).json({ error: 'Failed to fetch staff', details: staffError.message });
    }

    console.log(`[SyncDailyStats] Found ${staff?.length || 0} staff members`);

    // For each staff member, calculate total_clients, done_clients, and total_walk_in
    const updates = [];

    for (const s of staff) {
      try {
        // Count total bookings for this staff from available_slots
        const { count: totalBookings, error: totalError } = await supabase
          .from('available_slots')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names);

        if (totalError) {
          console.warn(`[SyncDailyStats] Error counting total for ${s.names}:`, totalError);
          continue;
        }

        // Count same-day walk-in logs for this staff
        const { count: walkInTotalBookings, error: walkInTotalError } = await supabase
          .from('walk_in_logs')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names)
          .eq('date', today);

        if (walkInTotalError) {
          console.warn(`[SyncDailyStats] Error counting walk-ins for ${s.names}:`, walkInTotalError);
        }

        // Count done/completed bookings for this staff from available_slots
        const { count: doneBookings, error: doneError } = await supabase
          .from('available_slots')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names)
          .eq('status', 'done');

        if (doneError) {
          console.warn(`[SyncDailyStats] Error counting done for ${s.names}:`, doneError);
          // Continue with total count even if done count fails
        }

        // Count same-day walk-in logs that are done for this staff
        const { count: walkInDoneBookings, error: walkInDoneError } = await supabase
          .from('walk_in_logs')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names)
          .eq('date', today)
          .eq('status', 'done');

        if (walkInDoneError) {
          console.warn(`[SyncDailyStats] Error counting walk-in done for ${s.names}:`, walkInDoneError);
        }

        const totalCount = totalBookings || 0;
        const doneCount = (doneBookings || 0) + (walkInDoneBookings || 0);
        const totalWalkInCount = walkInTotalBookings || 0;

        console.log(`[SyncDailyStats] Staff: ${s.names} | Total: ${totalCount} | Done: ${doneCount} | Walk-ins today: ${totalWalkInCount} | Walk-in done today: ${walkInDoneBookings || 0}`);

        // Update the staffs table and reset end-of-day staff state
        const { error: updateError } = await supabase
          .from('staffs')
          .update({
            total_clients: 0,
            done_clients: 0,
            total_walk_in: 0,
            clock_in: null,
            clock_out: null,
            status: 'off',
            in_service: null,
            walk_in: false
          })
          .eq('id', s.id);

        if (updateError) {
          console.error(`[SyncDailyStats] Error updating ${s.names}:`, updateError);
          continue;
        }

        updates.push({
          staffId: s.id,
          staffName: s.names,
          totalClients: 0,
          doneClients: 0,
          totalWalkIn: 0,
          success: true
        });

      } catch (err) {
        console.error(`[SyncDailyStats] Exception processing ${s.names}:`, err);
      }
    }

    console.log(`[SyncDailyStats] Completed sync for ${updates.length} staff members`);

    res.status(200).json({
      success: true,
      message: 'Daily staff statistics sync completed',
      staffUpdated: updates.length,
      updates: updates
    });

  } catch (error) {
    console.error(`[SyncDailyStats] Exception:`, error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
