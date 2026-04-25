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

    console.log('[Services] Fetching all services from Supabase');
    
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('[Services] Supabase error:', error);
      throw error;
    }

    console.log(`[Services] Found ${services?.length || 0} services`);
    console.log('[Services] Sample service:', services?.[0]);

    res.status(200).json(services || []);
  } catch (error) {
    console.error(`[Services] Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
};
