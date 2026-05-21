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
    console.log('[Services:Create] Full request body:', JSON.stringify(req.body, null, 2));
    
    const { service_name, name, category, description, price, availability, available, est_time, estimated_time } = req.body;
    const serviceName = service_name || name; // Support both field names
    const serviceAvailability = availability !== undefined ? availability : (available !== false);
    const serviceEstimatedTime = estimated_time !== undefined ? estimated_time : est_time;

    console.log('[Services:Create] Parsed values:', { serviceName, category, price, serviceAvailability, serviceEstimatedTime });

    // Validate required fields
    if (!serviceName || !category) {
      console.error('[Services:Create] Validation failed:', { serviceName, category });
      return res.status(400).json({ 
        error: 'Missing required fields: name/service_name, category',
        received: { serviceName, category }
      });
    }
    
    // Price can be 0 or a valid number, but must be provided
    if (price === undefined || price === '' || price === null) {
      console.error('[Services:Create] Price validation failed:', { price });
      return res.status(400).json({ 
        error: 'Price is required and must be a number',
        received: { price }
      });
    }
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      console.error('[Services:Create] Price is not a valid number:', { price, parsedPrice });
      return res.status(400).json({ 
        error: 'Price must be a valid number',
        received: { price }
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
    insertData.price = parsedPrice; // Use the validated parsed price
    // Use provided estimated_time, or default to 0
    insertData.est_time = serviceEstimatedTime && serviceEstimatedTime !== '' ? parseInt(serviceEstimatedTime, 10) : 0;
    
    // Handle availability field - must always provide a value
    if (sampleService && sampleService.length > 0) {
      if ('availability' in sampleService[0]) {
        insertData.availability = serviceAvailability !== false;
      } else if ('available' in sampleService[0]) {
        insertData.available = serviceAvailability !== false;
      }
    } else {
      insertData.availability = serviceAvailability !== false;
    }

    console.log('[Services:Create] Insert data:', insertData);

    const { data, error } = await supabase
      .from('services')
      .insert([insertData])
      .select();

    if (error) {
      console.error('[Services:Create] Insert error:', error);
      return res.status(400).json({ 
        error: 'Failed to create service', 
        details: error.message,
        code: error.code,
        insertData: insertData
      });
    }

    if (!data || data.length === 0) {
      console.error('[Services:Create] No data returned from insert');
      return res.status(400).json({ 
        error: 'Failed to create service',
        details: 'No data returned after insert',
        insertData: insertData
      });
    }

    console.log('[Services:Create] Successfully created new service:', data[0].id);
    return res.status(201).json(data[0]);
  } catch (error) {
    console.error('[Services:Create] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack
    });
  }
};
