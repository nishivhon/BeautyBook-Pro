import { createClient } from '@supabase/supabase-js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create a fresh Supabase client for this request
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    );

    console.log('[Staffs] Fetching all staff from Supabase');
    
    const { data: staff, error } = await supabase
      .from('staffs')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('[Staffs] Supabase error:', error);
      throw error;
    }

    console.log(`[Staffs] Found ${staff?.length || 0} staff members`);

    res.status(200).json(staff || []);
  } catch (error) {
    console.error(`[Staffs] Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
  }
};
