import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'PATCH' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[UpdateHistories] Received request, method:', req.method);
    console.log('[UpdateHistories] Body:', req.body);
    
    let body = req.body;

    // Handle JSON body parsing if needed
    if (!body || (typeof body === 'string' && body.length === 0)) {
      console.log('[UpdateHistories] Body is empty, parsing from request');
      // For Vercel, try to parse from rawBody or use body-parser middleware
      if (req.rawBody) {
        body = JSON.parse(req.rawBody);
      } else {
        // Fallback: read from stream
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString('utf-8');
        console.log('[UpdateHistories] Raw body from stream:', rawBody);
        body = rawBody ? JSON.parse(rawBody) : {};
      }
    } else if (typeof body === 'string') {
      console.log('[UpdateHistories] Body is string, parsing:', body);
      body = JSON.parse(body);
    }

    console.log('[UpdateHistories] Final parsed body:', body);

    const { customerId, service, staff, price, date } = body;
    console.log('[UpdateHistories] Parsed data - customerId:', customerId, 'service:', service, 'staff:', staff, 'price:', price, 'date:', date);

    if (!customerId) {
      return res.status(400).json({ error: 'Missing required field: customerId' });
    }

    if (!service || !staff || price === undefined || !date) {
      return res.status(400).json({ error: 'Missing booking details: service, staff, price, date' });
    }

    // Fetch current customer data
    const { data: customer, error: fetchError } = await supabase
      .from('customers_accounts')
      .select('id, histories')
      .eq('id', customerId)
      .single();

    if (fetchError || !customer) {
      console.error('[UpdateHistories] Fetch error:', fetchError);
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log('[UpdateHistories] Found customer, current histories:', customer.histories);

    // Parse existing histories or initialize as empty array
    let historiesArray = [];
    if (customer.histories && typeof customer.histories === 'object') {
      historiesArray = Array.isArray(customer.histories) ? customer.histories : [customer.histories];
    } else if (typeof customer.histories === 'string') {
      try {
        historiesArray = JSON.parse(customer.histories);
        if (!Array.isArray(historiesArray)) {
          historiesArray = [historiesArray];
        }
      } catch {
        historiesArray = [];
      }
    }

    // Create new booking entry
    const bookingEntry = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      service: service,
      staff: staff,
      price: parseFloat(price),
      date: date,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Append to histories array
    historiesArray.push(bookingEntry);

    // Update customer record with new histories
    const { data: updated, error: updateError } = await supabase
      .from('customers_accounts')
      .update({ histories: historiesArray })
      .eq('id', customerId)
      .select();

    if (updateError) {
      console.error('[UpdateHistories] Update error:', updateError);
      return res.status(400).json({ error: 'Failed to update history', details: updateError.message });
    }

    console.log('[UpdateHistories] Successfully updated customer, new histories:', historiesArray);

    return res.status(200).json({
      success: true,
      message: 'Booking added to history',
      bookingEntry: bookingEntry,
    });
  } catch (err) {
    console.error('[UpdateHistories] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
