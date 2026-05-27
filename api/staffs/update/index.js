import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const normalizeCategorySpecialty = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(item => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return value;
};

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, names, category_specialty, employment, clock_in, clock_out, walk_in, status, in_service, total_clients, done_clients } = req.body;
    const normalizedSpecialties = category_specialty !== undefined
      ? normalizeCategorySpecialty(category_specialty)
      : undefined;
    const normalizedInService = typeof in_service === 'string' ? in_service.trim().toLowerCase() : in_service;
    const normalizedStatus = typeof status === 'string' ? status.trim().toLowerCase() : status;
    const shouldDisableWalkIn = normalizedInService === 'in-service' || normalizedStatus === 'in service';

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

    const { data: existingStaff, error: existingStaffError } = await supabase
      .from('staffs')
      .select('status, in_service')
      .eq('id', id)
      .single();

    if (existingStaffError) {
      console.error('[Staffs:Update] Failed to read existing staff record:', existingStaffError);
      return res.status(400).json({ error: 'Failed to read staff record', details: existingStaffError.message });
    }

    const existingInService = typeof existingStaff?.in_service === 'string' ? existingStaff.in_service.trim().toLowerCase() : '';
    const existingStatus = typeof existingStaff?.status === 'string' ? existingStaff.status.trim().toLowerCase() : '';
    const isCurrentlyInService = existingInService === 'in-service' || existingStatus === 'in service';
    const isClockOutRequest = clock_out !== undefined && clock_out !== null && String(clock_out).trim() !== '';

    if (isClockOutRequest && isCurrentlyInService) {
      return res.status(400).json({
        error: 'Cannot clock out while staff is in service',
        details: 'Complete the current service before clocking out.'
      });
    }

    console.log(`[Staffs:Update] Updating staff ID: ${id}`, { names, category_specialty: normalizedSpecialties, employment, clock_in, clock_out, walk_in, status, in_service, total_clients, done_clients, shouldDisableWalkIn });

    // Build update object with only provided fields
    const updateData = {};
    if (names !== undefined) updateData.names = names;
    if (normalizedSpecialties !== undefined) updateData.category_specialty = normalizedSpecialties;
    if (employment !== undefined) updateData.employment = employment;
    if (clock_in !== undefined) updateData.clock_in = clock_in;
    if (clock_out !== undefined) updateData.clock_out = clock_out;
    if (walk_in !== undefined) updateData.walk_in = shouldDisableWalkIn ? false : walk_in;
    if (status !== undefined) updateData.status = status;
    if (in_service !== undefined) updateData.in_service = in_service;
    if (shouldDisableWalkIn) updateData.walk_in = false;
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
