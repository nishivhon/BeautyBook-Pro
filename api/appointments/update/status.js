import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status, staffName } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'ID and status are required' });
  }

  const validStatuses = ['pending', 'current', 'done', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[UpdateStatus] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log(`[UpdateStatus] Updating appointment ${id} to status: ${status}`);

    // Update appointment status
    const { data, error } = await supabase
      .from('available_slots')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[UpdateStatus] Update error:', error);
      return res.status(500).json({ error: 'Failed to update status', details: error.message });
    }

    console.log(`[UpdateStatus] Successfully updated appointment ${id}`);

    // Update staff in_service based on status
    if (staffName) {
      console.log(`[UpdateStatus] Processing staff update for: ${staffName}`);
      let staffInServiceValue = 'avail'; // default for 'done'
      
      if (status === 'current') {
        staffInServiceValue = 'in-service';
        console.log(`[UpdateStatus] Setting staff ${staffName} in_service to 'in-service'`);
      } else if (status === 'done') {
        staffInServiceValue = 'avail';
        console.log(`[UpdateStatus] Setting staff ${staffName} in_service to 'avail'`);
      }
      
      if (status === 'current' || status === 'done') {
        console.log(`[UpdateStatus] Querying staff table for name = '${staffName}'`);
        const { data: staffData, error: staffError } = await supabase
          .from('staffs')
          .update({ in_service: staffInServiceValue })
          .eq('names', staffName)
          .select();

        if (staffError) {
          console.error('[UpdateStatus] Staff update error:', staffError);
          console.error('[UpdateStatus] Error details:', staffError.message, staffError.code);
        } else {
          console.log(`[UpdateStatus] Staff update response:`, staffData);
          if (staffData && staffData.length > 0) {
            console.log(`[UpdateStatus] Successfully updated staff ${staffName} in_service to ${staffInServiceValue}`);
          } else {
            console.warn(`[UpdateStatus] No staff found with name: ${staffName}`);
          }
        }
      }
    } else {
      console.log(`[UpdateStatus] No staff name provided, skipping staff update`);
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      appointment: data?.[0] || null
    });
  } catch (error) {
    console.error(`[UpdateStatus] Exception: ${error.message}`);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
