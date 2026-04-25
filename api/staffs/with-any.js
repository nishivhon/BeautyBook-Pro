import { createClient } from '@supabase/supabase-js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    );

    console.log('[Staffs] Fetching staff with any available option');
    
    const { data: staff, error } = await supabase
      .from('staffs')
      .select('*')
      .order('names', { ascending: true });

    if (error) {
      console.error('[Staffs] Supabase error:', error);
      throw error;
    }

    console.log(`[Staffs] Found ${staff?.length || 0} staff members`);

    // Transform staff data and add "Any available" option
    const transformedStaff = (staff || []).map(s => ({
      id: s.id,
      names: s.names,
      status: s.status,
      category_specialty: s.category_specialty,
      in_service: s.in_service,
      unavailable: s.status !== 'avail',
    }));

    res.status(200).json({
      any: {
        id: 'any',
        isAny: true,
        names: 'Any available stylist',
        unavailable: false
      },
      staff: transformedStaff
    });
  } catch (error) {
    console.error(`[Staffs] Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
  }
};
