import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // If ID provided, get single service; otherwise get all
    if (id) {
      console.log(`[Services:Read] Fetching service ID: ${id}`);

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`[Services:Read] Fetch error for ID ${id}:`, error);
        return res.status(400).json({ error: 'Failed to fetch service', details: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Service not found' });
      }

      console.log(`[Services:Read] Successfully fetched service ${id}`);
      return res.status(200).json(data);
    } else {
      // Get all services
      console.log('[Services:Read] Fetching all services');

      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('[Services:Read] Supabase error:', error);
        throw error;
      }

      console.log(`[Services:Read] Found ${services?.length || 0} services`);
      return res.status(200).json(services || []);
    }

  } catch (error) {
    console.error('[Services:Read] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
