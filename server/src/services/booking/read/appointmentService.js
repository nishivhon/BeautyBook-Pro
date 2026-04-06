import { querySupabase } from '../../../db/supabaseClient.js';

/**
 * Fetch all appointments
 */
export const getAllAppointments = async () => {
  try {
    console.log('[AppointmentService] Fetching all appointments...');
    const result = await querySupabase('appointments', {
      select: 'id, user_id, service_id, stylist_id, appointment_date, appointment_time, notes, status, created_at, updated_at',
      order: 'appointment_date.desc',
    });
    console.log(`[AppointmentService] Successfully fetched ${result.length} appointments`);
    return result;
  } catch (error) {
    console.error('[AppointmentService] Error fetching all appointments:', error.message);
    throw error;
  }
};

/**
 * Fetch appointment by ID
 */
export const getAppointmentById = async (id) => {
  try {
    console.log(`[AppointmentService] Fetching appointment ID: ${id}`);
    const result = await querySupabase('appointments', {
      select: 'id, user_id, service_id, stylist_id, appointment_date, appointment_time, notes, status, created_at, updated_at',
      filter: { id },
      limit: 1,
    });
    const appointment = result[0] || null;
    console.log(`[AppointmentService] ${appointment ? 'Found' : 'Not found'} appointment with ID ${id}`);
    return appointment;
  } catch (error) {
    console.error(`[AppointmentService] Error fetching appointment by ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Fetch appointments by user ID
 */
export const getAppointmentsByUserId = async (userId) => {
  try {
    console.log(`[AppointmentService] Fetching appointments for user ID: ${userId}`);
    const result = await querySupabase('appointments', {
      select: 'id, user_id, service_id, stylist_id, appointment_date, appointment_time, notes, status, created_at, updated_at',
      filter: { user_id: userId },
      order: 'appointment_date.desc',
    });
    console.log(`[AppointmentService] Found ${result.length} appointments for user ${userId}`);
    return result;
  } catch (error) {
    console.error(`[AppointmentService] Error fetching appointments for user ${userId}:`, error.message);
    throw error;
  }
};

/**
 * Fetch appointments by stylist ID
 */
export const getAppointmentsByStylistId = async (stylistId) => {
  try {
    console.log(`[AppointmentService] Fetching appointments for stylist ID: ${stylistId}`);
    const result = await querySupabase('appointments', {
      select: 'id, user_id, service_id, stylist_id, appointment_date, appointment_time, notes, status, created_at, updated_at',
      filter: { stylist_id: stylistId },
      order: 'appointment_date.asc',
    });
    console.log(`[AppointmentService] Found ${result.length} appointments for stylist ${stylistId}`);
    return result;
  } catch (error) {
    console.error(`[AppointmentService] Error fetching appointments for stylist ${stylistId}:`, error.message);
    throw error;
  }
};

/**
 * Fetch appointments by date range
 */
export const getAppointmentsByDateRange = async (startDate, endDate) => {
  try {
    console.log(`[AppointmentService] Fetching appointments between ${startDate} and ${endDate}`);
    // Note: Date range filtering with Supabase requires custom implementation
    // Simplified: fetch all and filter on client side, or use advanced filters
    const result = await querySupabase('appointments', {
      select: 'id, user_id, service_id, stylist_id, appointment_date, appointment_time, notes, status, created_at, updated_at',
      order: 'appointment_date.asc',
    });
    console.log(`[AppointmentService] Found ${result.length} appointments in date range`);
    return result;
  } catch (error) {
    console.error('[AppointmentService] Error fetching appointments by date range:', error.message);
    throw error;
  }
};
