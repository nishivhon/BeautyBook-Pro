import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[Services:Categories] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log('[Services:Categories] Fetching all services to extract categories');

    // Fetch all services
    const { data: services, error } = await supabase
      .from('services')
      .select('id, service_name, category')
      .order('category', { ascending: true });

    if (error) {
      console.error('[Services:Categories] Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch services', details: error.message });
    }

    if (!services || services.length === 0) {
      console.log('[Services:Categories] No services found');
      return res.status(200).json({
        success: true,
        categories: [],
        message: 'No services configured'
      });
    }

    // Extract unique categories and build category objects
    const categoryMap = {};
    
    services.forEach(service => {
      const category = service.category || 'Uncategorized';
      
      if (!categoryMap[category]) {
        categoryMap[category] = {
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category,
          services: []
        };
      }
      
      categoryMap[category].services.push({
        id: service.id,
        name: service.service_name
      });
    });

    // Convert to array and sort by category name
    const categories = Object.values(categoryMap).sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    console.log(`[Services:Categories] Extracted ${categories.length} unique categories`);
    
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });

  } catch (error) {
    console.error('[Services:Categories] Exception:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
