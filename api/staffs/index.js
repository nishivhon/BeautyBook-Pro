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
      .select('id, names, status, category_specialty')
      .order('id', { ascending: true });

    if (error) {
      console.error('[Staffs] Query error:', error);
      return res.status(500).json({ error: 'Database query failed', details: error.message });
    }

    console.log(`[Staffs] Found ${staff?.length || 0} staff members`);

    // Manually create JSON to avoid serialization issues
    const jsonString = JSON.stringify(staff || []);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(jsonString));
    res.status(200).send(jsonString);
  } catch (error) {
    console.error(`[Staffs] Exception: ${error.message}`);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
