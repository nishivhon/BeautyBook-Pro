import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { name, category, description, meta, price, available } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    console.log(`[Services:Update] Updating service ID: ${id}`, { name, category, price });

    // Validate required fields
    if (!name || !category || price === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, category, price' 
      });
    }

    // Prepare update data - handle both 'description' and 'meta' field names
    const updateData = {
      name: name,
      category,
      description: description || meta || '',
      price: parseFloat(price) || 0,
      availability: available !== false // Default to true if not specified
    };

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`[Services:Update] Update error for ID ${id}:`, error);
      return res.status(400).json({ error: 'Failed to update service', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    console.log(`[Services:Update] Successfully updated service ${id}`);
    return res.status(200).json({ 
      message: 'Service updated successfully', 
      service: data[0] 
    });

  } catch (error) {
    console.error(`[Services:Update] Unexpected error:`, error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
