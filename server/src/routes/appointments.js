import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [appointments] = await connection.query(
      `SELECT a.*, u.name as customer_name, u.email, u.phone,
              s.name as service_name, s.price, st.name as stylist_name
       FROM appointments a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN services s ON a.service_id = s.id
       LEFT JOIN stylists st ON a.stylist_id = st.id
       ORDER BY a.appointment_date DESC`
    );
    connection.release();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [appointments] = await connection.query(
      `SELECT a.*, u.name as customer_name, u.email, u.phone,
              s.name as service_name, s.price, st.name as stylist_name
       FROM appointments a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN services s ON a.service_id = s.id
       LEFT JOIN stylists st ON a.stylist_id = st.id
       WHERE a.id = ?`,
      [req.params.id]
    );
    connection.release();

    if (appointments.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointments[0]);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  const { user_id, service_id, stylist_id, appointment_date, appointment_time, notes } = req.body;

  if (!appointment_date || !appointment_time || !service_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO appointments (user_id, service_id, stylist_id, appointment_date, appointment_time, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'confirmed', NOW())`,
      [user_id || null, service_id, stylist_id || null, appointment_date, appointment_time, notes || null]
    );
    connection.release();

    res.status(201).json({
      id: result.insertId,
      message: 'Appointment created successfully'
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  const { appointment_date, appointment_time, status, notes } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      `UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = ?, notes = ? WHERE id = ?`,
      [appointment_date, appointment_time, status, notes, req.params.id]
    );
    connection.release();

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
