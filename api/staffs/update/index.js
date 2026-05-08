import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, names, category_specialty, employment, clock_in, clock_out, walk_in, status, in_service, total_clients, done_clients } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Staff ID is required' });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[Staffs:Update] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log(`[Staffs:Update] Updating staff ID: ${id}`, { names, category_specialty, employment, clock_in, clock_out, walk_in, status, in_service, total_clients, done_clients });

    // Build update object with only provided fields
    const updateData = {};
    if (names !== undefined) updateData.names = names;
    if (category_specialty !== undefined) updateData.category_specialty = category_specialty;
    if (employment !== undefined) updateData.employment = employment;
    if (clock_in !== undefined) updateData.clock_in = clock_in;
    if (clock_out !== undefined) updateData.clock_out = clock_out;
    if (walk_in !== undefined) updateData.walk_in = walk_in;
    if (status !== undefined) updateData.status = status;
    if (in_service !== undefined) updateData.in_service = in_service;
    if (total_clients !== undefined) updateData.total_clients = total_clients;
    if (done_clients !== undefined) updateData.done_clients = done_clients;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabase
      .from('staffs')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`[Staffs:Update] Query error:`, error);
      return res.status(400).json({ error: 'Failed to update staff', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    console.log(`[Staffs:Update] Successfully updated staff ${id}`);
    return res.status(200).json({ 
      message: 'Staff updated successfully', 
      staff: data[0] 
    });

  } catch (error) {
    console.error(`[Staffs:Update] Exception:`, error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
