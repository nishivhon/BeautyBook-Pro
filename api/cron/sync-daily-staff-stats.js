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
  if (!['GET', 'POST'].includes(req.method)) {
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
    console.log('[SyncDailyStats] Resetting all staff rows in a single update');

    const resetData = {
      total_clients: 0,
      done_clients: 0,
      total_walk_in: 0,
      clock_in: null,
      clock_out: null,
      status: 'off',
      in_service: null,
      walk_in: false
    };

    const { data: resetRows, error: resetError } = await supabase
      .from('staffs')
      .update(resetData)
      .not('id', 'is', null)
      .select('id, names');

    if (resetError) {
      console.error('[SyncDailyStats] Error resetting staff rows:', resetError);
      return res.status(500).json({ error: 'Failed to reset staff rows', details: resetError.message });
    }

    const resetCount = Array.isArray(resetRows) ? resetRows.length : 0;
    console.log(`[SyncDailyStats] Completed reset for ${resetCount} staff members`);

    res.status(200).json({
      success: true,
      message: 'Daily staff statistics reset completed',
      staffUpdated: resetCount,
      updates: resetRows || []
    });

  } catch (error) {
    console.error(`[SyncDailyStats] Exception:`, error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
