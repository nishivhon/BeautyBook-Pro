import express from 'express';
import { getAllUsers, getUserById, getUserByEmail } from '../services/userService.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    console.log('[Users] Fetching all users');
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('[Users] Error fetching all users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`[Users] Fetching user ID: ${req.params.id}`);
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('[Users] Error fetching user by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Get user by email
router.get('/search/email', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }
    console.log(`[Users] Fetching user by email: ${email}`);
    const user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('[Users] Error fetching user by email:', error.message);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

export default router;
