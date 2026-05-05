import { createClient } from '@supabase/supabase-js';

/**
 * End-of-day cron job to sync staff statistics from available_slots to staffs table
 * Calculates total_clients and done_clients for each staff member
 * 
 * This job:
 * 1. Counts total bookings for each staff (total_clients)
 * 2. Counts completed bookings for each staff (done_clients)
 * 3. Updates the staffs table with these counts
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

    console.log('[SyncDailyStats] Starting daily staff statistics sync at', phtDate.toISOString(), '(Philippine Time)');

    // Get all staff
    const { data: staff, error: staffError } = await supabase
      .from('staffs')
      .select('id, names');

    if (staffError) {
      console.error('[SyncDailyStats] Error fetching staff:', staffError);
      return res.status(500).json({ error: 'Failed to fetch staff', details: staffError.message });
    }

    console.log(`[SyncDailyStats] Found ${staff?.length || 0} staff members`);

    // For each staff member, calculate total_clients and done_clients
    const updates = [];

    for (const s of staff) {
      try {
        // Count total bookings for this staff (total_clients)
        const { count: totalBookings, error: totalError } = await supabase
          .from('available_slots')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names);

        if (totalError) {
          console.warn(`[SyncDailyStats] Error counting total for ${s.names}:`, totalError);
          continue;
        }

        // Count done/completed bookings for this staff (done_clients)
        // Assuming status is 'done' or 'completed' for finished bookings
        const { count: doneBookings, error: doneError } = await supabase
          .from('available_slots')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_staff', s.names)
          .eq('status', 'done');

        if (doneError) {
          console.warn(`[SyncDailyStats] Error counting done for ${s.names}:`, doneError);
          // Continue with total count even if done count fails
        }

        const totalCount = totalBookings || 0;
        const doneCount = doneBookings || 0;

        console.log(`[SyncDailyStats] Staff: ${s.names} | Total: ${totalCount} | Done: ${doneCount}`);

        // Update the staffs table
        const { error: updateError } = await supabase
          .from('staffs')
          .update({
            total_clients: totalCount,
            done_clients: doneCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', s.id);

        if (updateError) {
          console.error(`[SyncDailyStats] Error updating ${s.names}:`, updateError);
          continue;
        }

        updates.push({
          staffId: s.id,
          staffName: s.names,
          totalClients: totalCount,
          doneClients: doneCount,
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
