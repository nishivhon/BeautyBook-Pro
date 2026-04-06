import express from 'express';
import { getAllAppointments, getAppointmentById, getAppointmentsByUserId, getAppointmentsByStylistId, getAppointmentsByDateRange } from '../services/booking/create/appointmentService.js';

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    console.log('[Appointments] Fetching all appointments');
    const appointments = await getAllAppointments();
    res.json(appointments);
  } catch (error) {
    console.error('[Appointments] Error fetching all appointments:', error.message);
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

// Get appointments by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    console.log(`[Appointments] Fetching appointments for user ${req.params.userId}`);
    const appointments = await getAppointmentsByUserId(req.params.userId);
    res.json(appointments);
  } catch (error) {
    console.error('[Appointments] Error fetching appointments by user:', error.message);
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

// Get appointments by stylist ID
router.get('/stylist/:stylistId', async (req, res) => {
  try {
    console.log(`[Appointments] Fetching appointments for stylist ${req.params.stylistId}`);
    const appointments = await getAppointmentsByStylistId(req.params.stylistId);
    res.json(appointments);
  } catch (error) {
    console.error('[Appointments] Error fetching appointments by stylist:', error.message);
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`[Appointments] Fetching appointment ID: ${req.params.id}`);
    const appointment = await getAppointmentById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('[Appointments] Error fetching appointment by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch appointment', details: error.message });
  }
});

export default router;
