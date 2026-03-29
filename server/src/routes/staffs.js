import express from 'express';
import { getAllStaff, getStaffById, getAvailableStaff, getStaffWithAnyOption } from '../services/staffService.js';

const router = express.Router();

// Get all staff
router.get('/', async (req, res) => {
  try {
    console.log('[Staffs] Fetching all staff');
    const staff = await getAllStaff();
    res.json(staff);
  } catch (error) {
    console.error('[Staffs] Error fetching all staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
  }
});

// Get all staff with "Any available" option
router.get('/with-any', async (req, res) => {
  try {
    console.log('[Staffs] Fetching staff with "Any available" option');
    const staff = await getStaffWithAnyOption();
    res.json({
      any: {
        id: 'any',
        isAny: true,
        initial: null,
        name: 'Any available stylist',
        unavailable: false,
      },
      staff: staff,
    });
  } catch (error) {
    console.error('[Staffs] Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
  }
});

// Get available staff only
router.get('/available', async (req, res) => {
  try {
    console.log('[Staffs] Fetching available staff');
    const staff = await getAvailableStaff();
    res.json(staff);
  } catch (error) {
    console.error('[Staffs] Error fetching available staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch available staff', details: error.message });
  }
});

// Get staff by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`[Staffs] Fetching staff ID: ${req.params.id}`);
    const staff = await getStaffById(req.params.id);
    
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    console.error('[Staffs] Error fetching staff by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
  }
});

export default router;
