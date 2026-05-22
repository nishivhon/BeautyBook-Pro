import { createClient } from '@supabase/supabase-js';
import { archiveDailyStaffLogs } from '../../server/src/services/staffLogService.js';

export default async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    );

    const now = new Date();
    const phtDate = new Date(now.getTime() + (8 * 60 * 60 * 1000));

    const result = await archiveDailyStaffLogs(supabase, phtDate);

    return res.status(200).json({
      success: true,
      message: 'Daily staff logs archived successfully',
      archived: result.archived,
      date: phtDate.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('[ArchiveDailyStaffLogs] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to archive staff logs',
      error: error.message,
    });
  }
};