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
    const { name, service_name, category, description, meta, price, available, availability, est_time, estimated_time } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    // Get the actual service to see what columns exist
    const { data: existingService, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingService) {
      console.error(`[Services:Update] Service not found ID ${id}:`, fetchError);
      return res.status(404).json({ error: 'Service not found', details: fetchError?.message });
    }

    console.log(`[Services:Update] Existing service:`, Object.keys(existingService));
    
    const serviceName = name || service_name;
    const serviceAvailability = availability !== undefined ? availability : available;
    const serviceEstimatedTime = estimated_time !== undefined ? estimated_time : est_time;

    if (!serviceName || !category || price === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: name/service_name, category, price' 
      });
    }

    // Build update data with only fields that exist in the schema
    const updateData = {};
    
    // Handle name field - try both 'name' and 'service_name'
    if ('name' in existingService) {
      updateData.name = serviceName;
    } else if ('service_name' in existingService) {
      updateData.service_name = serviceName;
    }
    
    // Add other fields if they exist
    if ('category' in existingService) updateData.category = category;
    if ('description' in existingService) updateData.description = description || meta || '';
    if ('price' in existingService) updateData.price = parseFloat(price) || 0;
    if ('est_time' in existingService) updateData.est_time = serviceEstimatedTime !== undefined && serviceEstimatedTime !== '' ? parseInt(serviceEstimatedTime, 10) : null;
    if ('estimated_time' in existingService) updateData.estimated_time = serviceEstimatedTime !== undefined && serviceEstimatedTime !== '' ? parseInt(serviceEstimatedTime, 10) : null;
    if ('availability' in existingService) updateData.availability = serviceAvailability !== false;
    if ('available' in existingService) updateData.available = serviceAvailability !== false;

    console.log(`[Services:Update] Updating service ID: ${id}`, updateData);

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
