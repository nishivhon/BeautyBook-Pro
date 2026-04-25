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
    const { service_name, name, category, description, price, availability, available, est_time, estimated_time } = req.body;
    const serviceName = service_name || name; // Support both field names
    const serviceAvailability = availability !== undefined ? availability : (available !== false);
    const serviceEstimatedTime = estimated_time !== undefined ? estimated_time : est_time;

    console.log('[Services:Create] Creating new service:', { serviceName, category, price });

    // Validate required fields
    if (!serviceName || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields: name/service_name, category' 
      });
    }

    // Try to fetch a service to see what columns exist in the schema
    const { data: sampleService } = await supabase
      .from('services')
      .select('*')
      .limit(1);

    // Build insert data - only include fields that exist in the schema
    let insertData = {};
    
    // Determine which name column to use
    if (sampleService && sampleService.length > 0) {
      if ('name' in sampleService[0]) {
        insertData.name = serviceName;
      } else if ('service_name' in sampleService[0]) {
        insertData.service_name = serviceName;
      }
    } else {
      // Default to 'name' if we can't determine schema
      insertData.name = serviceName;
    }

    insertData.category = category;
    if (description) insertData.description = description;
    if (price !== undefined && price !== '') insertData.price = parseFloat(price) || 0;
    if (serviceEstimatedTime !== undefined && serviceEstimatedTime !== '') insertData.est_time = parseInt(serviceEstimatedTime, 10);
    
    // Handle availability field
    if (sampleService && sampleService.length > 0) {
      if ('availability' in sampleService[0]) {
        insertData.availability = serviceAvailability;
      } else if ('available' in sampleService[0]) {
        insertData.available = serviceAvailability;
      }
    } else {
      insertData.availability = serviceAvailability;
    }

    console.log('[Services:Create] Insert data:', insertData);

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
