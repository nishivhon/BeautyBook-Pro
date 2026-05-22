import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[Staffs] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log('[Staffs] Fetching all staff from Supabase');
    
    const { data: staff, error } = await supabase
      .from('staffs')
      .select('id, names, status, category_specialty, employment, clock_in, clock_out, walk_in, done_clients, in_service, total_walk_in')
      .order('id', { ascending: true });

    if (error) {
      console.error('[Staffs] Query error:', error);
      return res.status(500).json({ error: 'Database query failed', details: error.message });
    }

    console.log(`[Staffs] Found ${staff?.length || 0} staff members`);

    // Calculate total_clients and done_clients for each staff member from available_slots table
    const staffWithCounts = await Promise.all(staff.map(async (s) => {
      try {
        // Count total bookings for this staff
        const { count: totalBookings, error: totalError } = await supabase
          .from('available_slots')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_staff', s.names);

        if (totalError) {
          console.warn(`[Staffs] Error counting total bookings for ${s.names}:`, totalError);
        }

        // Count done/completed bookings for this staff
        const { count: doneBookings, error: doneError } = await supabase
          .from('available_slots')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_staff', s.names)
          .eq('status', 'done');

        if (doneError) {
          console.warn(`[Staffs] Error counting done bookings for ${s.names}:`, doneError);
        }

        const totalCount = totalBookings || 0;
        const doneCount = doneBookings || 0;

        console.log(`[Staffs] Staff: "${s.names}", Total: ${totalCount}, Done: ${doneCount}`);

        return {
          ...s,
          total_clients: totalCount,
          done_clients: doneCount,
          total_walk_in: s.total_walk_in || 0
        };
      } catch (err) {
        console.error(`[Staffs] Exception counting for ${s.names}:`, err);
        return { ...s, total_clients: 0, done_clients: 0 };
      }
    }));

    console.log('[Staffs] Calculated total_clients and done_clients from available_slots');

    // Manually create JSON to avoid serialization issues
    const jsonString = JSON.stringify(staffWithCounts || []);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(jsonString));
    res.status(200).send(jsonString);
  } catch (error) {
    console.error(`[Staffs] Exception: ${error.message}`);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
