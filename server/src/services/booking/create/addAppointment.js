import { querySupabase, upsertSupabase } from '../../../db/supabaseClient.js';

/**
 * Create a new appointment from registration data
 * @param {Object} appointmentData - The appointment details
 * @param {string} appointmentData.name - Customer name
 * @param {string} appointmentData.email - Customer email
 * @param {string} appointmentData.phone - Customer phone number
 * @param {string} appointmentData.date - Appointment date (YYYY-MM-DD)
 * @param {string} appointmentData.time - Appointment time (HH:MM:SS)
 * @param {string} appointmentData.service - Service name/type
 * @param {string} appointmentData.staff_assigned - Staff/stylist name
 * @returns {Promise<Object>} Created appointment with ID
 */
export const addAppointment = async (appointmentData) => {
  try {
    const { name, email, phone, date, time, service, staff_assigned } = appointmentData;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !service || !staff_assigned) {
      throw new Error('Missing required appointment fields');
    }

    // Use upsertSupabase for INSERT operation
    await upsertSupabase('appointments', {
      name,
      email,
      phone,
      date,
      time,
      service,
      staff_assigned,
      status: 'pending', // Default status
    });

    // Fetch the newly created appointment
    const result = await querySupabase('appointments', {
      select: 'id, name, email, phone, date, time, service, staff_assigned, status, created_at',
      filter: { email },
      limit: 1,
      order: 'created_at.desc',
    });

    const appointment = result[0] || null;

    if (appointment) {
      return appointment;
    } else {
      throw new Error('Appointment created but could not be retrieved');
    }
  } catch (error) {
    throw error;
  }
};
