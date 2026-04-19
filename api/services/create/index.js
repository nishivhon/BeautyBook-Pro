import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { service_name, name, category, description, price, availability } = req.body;
    const serviceName = service_name || name; // Support both field names

    console.log('[Services:Create] Creating new service:', { serviceName, category, price });

    // Validate required fields
    if (!serviceName || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields: name/service_name, category' 
      });
    }

    const insertData = {
      name: serviceName,
      category,
      description: description || '',
      price: parseFloat(price) || 0,
      availability: availability !== false // Default to true
    };

    const { data, error } = await supabase
      .from('services')
      .insert([insertData])
      .select();

    if (error) {
      console.error('[Services:Create] Insert error:', error);
      return res.status(400).json({ error: 'Failed to create service', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ error: 'Failed to create service' });
    }

    console.log('[Services:Create] Successfully created new service:', data[0].id);
    return res.status(201).json(data[0]);
  } catch (error) {
    console.error('[Services:Create] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
