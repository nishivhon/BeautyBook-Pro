import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Book a time slot (mark as unavailable)
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format (24-hour)
 * @param {string} customerName - Customer's name
 * @param {string} customerContact - Customer's email or phone
 * @param {string} assignedStaff - Assigned staff member (optional, null for "Any available")
 * @param {Array} services - Array of service objects booked (optional)
 * @returns {Promise<boolean>} - True if booking successful
 */
export const bookSlot = async (date, time, customerName = null, customerContact = null, assignedStaff = null, services = []) => {
  try {
    const supabase = getSupabaseClient();
    console.log(`[SlotManager] Booking slot: ${date} ${time} for ${customerName} with staff: ${assignedStaff}`);

    const updateData = {
      availability: false, 
      customer_name: customerName,
      customer_contact: customerContact,
      assigned_staff: assignedStaff,
      services: services.length > 0 ? services : [],
      updated_at: new Date().toISOString() 
    };

    const { data, error } = await supabase
      .from('available_slots')
      .update(updateData)
      .eq('date', date)
      .eq('time_slot', time)
      .select();

    if (error) {
      console.error('[SlotManager] Error booking slot:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`[SlotManager] Slot not found: ${date} ${time}`);
      return false;
    }

    console.log(`[SlotManager] Slot booked successfully: ${date} ${time}`);
    return true;
  } catch (error) {
    console.error('[SlotManager] Error in bookSlot:', error.message);
    throw error;
  }
};

/**
 * Release a time slot (mark as available)
 * Used for cancellations
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format (24-hour)
 * @returns {Promise<boolean>} - True if release successful
 */
export const releaseSlot = async (date, time) => {
  try {
    const supabase = getSupabaseClient();
    console.log(`[SlotManager] Releasing slot: ${date} ${time}`);

    const { data, error } = await supabase
      .from('available_slots')
      .update({ 
        availability: true,
        assigned_staff: null,
        customer_name: null,
        customer_contact: null,
        services: [],
        updated_at: new Date().toISOString() 
      })
      .eq('date', date)
      .eq('time_slot', time)
      .select();

    if (error) {
      console.error('[SlotManager] Error releasing slot:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`[SlotManager] Slot not found: ${date} ${time}`);
      return false;
    }

    console.log(`[SlotManager] Slot released successfully: ${date} ${time}`);
    return true;
  } catch (error) {
    console.error('[SlotManager] Error in releaseSlot:', error.message);
    throw error;
  }
};

/**
 * Check if slot is available
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format (24-hour)
 * @returns {Promise<boolean>} - True if available
 */
export const isSlotAvailable = async (date, time) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('available_slots')
      .select('availability')
      .eq('date', date)
      .eq('time_slot', time)
      .single();

    if (error) {
      console.error('[SlotManager] Error checking slot availability:', error);
      return false;
    }

    return data?.availability ?? false;
  } catch (error) {
    console.error('[SlotManager] Error in isSlotAvailable:', error.message);
    return false;
  }
};

/**
 * Get all available slots for a date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} - Array of available slots
 */
export const getAvailableSlots = async (date) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('available_slots')
      .select('id, date, time_slot, availability')
      .eq('date', date)
      .eq('availability', true)
      .order('time_slot', { ascending: true });

    if (error) {
      console.error('[SlotManager] Error fetching available slots:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[SlotManager] Error in getAvailableSlots:', error.message);
    return [];
  }
};
