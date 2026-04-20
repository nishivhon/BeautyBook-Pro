import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status } = req.body;

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
