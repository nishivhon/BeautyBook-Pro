import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Appointment id is required' });
  }

  try {
    console.log(`[CancelAppointment] Cancelling appointment id: ${id}`);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[CancelAppointment] Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    console.log(`[CancelAppointment] Step 1: Fetching appointment slot with id: ${id}`);
    const { data: slot, error: fetchError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('[CancelAppointment] Error fetching slot:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch appointment', details: fetchError.message });
    }

    if (!slot) {
      console.error('[CancelAppointment] Slot not found');
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log('[CancelAppointment] Step 2: Resetting appointment slot to defaults');
    const { data: updatedSlot, error: updateError } = await supabase
      .from('available_slots')
      .update({
        availability: true,
        customer_name: null,
        customer_contact: null,
        assigned_staff: null,
        services: [],
        total_price: 0,
        cancellations: (slot.cancellations || 0) + 1,
        status: null,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[CancelAppointment] Error resetting slot:', updateError);
      return res.status(500).json({ error: 'Failed to reset appointment', details: updateError.message });
    }

    console.log('[CancelAppointment] Step 3: Successfully cancelled and reset appointment');
    console.log('[CancelAppointment] Updated slot:', updatedSlot);

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled and slot reset',
      data: updatedSlot,
    });
  } catch (err) {
    console.error('[CancelAppointment] Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
