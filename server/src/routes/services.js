import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [services] = await connection.query(
      'SELECT * FROM services ORDER BY category, name'
    );
    connection.release();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get services by category
router.get('/category/:category', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [services] = await connection.query(
      'SELECT * FROM services WHERE category = ? ORDER BY name',
      [req.params.category]
    );
    connection.release();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [services] = await connection.query(
      'SELECT * FROM services WHERE id = ?',
      [req.params.id]
    );
    connection.release();

    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(services[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

export default router;
