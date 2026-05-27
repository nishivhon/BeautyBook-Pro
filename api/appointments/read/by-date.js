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
  if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials');
  return createClient(supabaseUrl, supabaseKey);
}

export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query parameter is required (YYYY-MM-DD)' });

  try {
    const supabase = getSupabaseClient();

    // Fetch active/pending slots for the date (booked or pending)
    const { data: slots, error: slotsError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('date', date)
      .or(`status.eq.pending,status.eq.current,availability.eq.false`)
      .order('time_slot', { ascending: true });

    if (slotsError) {
      console.error('[by-date] Error fetching available_slots:', slotsError);
      return res.status(500).json({ error: 'Failed to read available_slots', details: slotsError.message });
    }

    // Fetch appointment_logs for the date (archived/moved slots)
    const { data: logs, error: logsError } = await supabase
      .from('appointment_logs')
      .select('*')
      .eq('date', date)
      .order('time_slot', { ascending: true });

    if (logsError) {
      console.error('[by-date] Error fetching appointment_logs:', logsError);
      return res.status(500).json({ error: 'Failed to read appointment_logs', details: logsError.message });
    }

    // Normalize rows into a common appointment shape
    const normalizeRow = (row, source = 'slot') => {
      // Row may have services as JSON or string; service_est_time may exist
      let serviceEst = Number(row.service_est_time || row.service_est_time_minutes || 0) || 0;

      // Try to compute est from services array if not present
      if (!serviceEst && row.services) {
        try {
          const sv = typeof row.services === 'string' ? JSON.parse(row.services) : row.services;
          if (Array.isArray(sv)) {
            serviceEst = sv.reduce((sum, s) => {
              const v = Number(s?.est_time ?? s?.duration ?? s?.duration_minutes ?? 0) || 0;
              return sum + v;
            }, 0);
          }
        } catch (e) {
          // ignore parse errors
        }
      }

      return {
        id: row.id,
        staff: row.assigned_staff || row.staff || null,
        time: row.time_slot || row.time || null,
        date: row.date || null,
        service_est_time: Number(serviceEst) || 0,
        status: row.status || null,
        source,
        raw: row,
      };
    };

    const appointments = [];

    if (Array.isArray(slots)) {
      for (const s of slots) {
        if (s.assigned_staff) appointments.push(normalizeRow(s, 'slot'));
      }
    }

    if (Array.isArray(logs)) {
      for (const l of logs) {
        if (l.assigned_staff) appointments.push(normalizeRow(l, 'log'));
      }
    }

    res.status(200).json({ success: true, date, count: appointments.length, appointments });
  } catch (error) {
    console.error('[by-date] Unexpected error:', error.message);
    res.status(500).json({ error: 'Unexpected server error', details: error.message });
  }
};
