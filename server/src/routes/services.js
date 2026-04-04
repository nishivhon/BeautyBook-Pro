import express from 'express';
import { getAllServices, getServicesByCategory, getServiceById, getServiceCategories } from '../services/serviceService.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    console.error('[Services] Error fetching all services:', error.message);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

// Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await getServiceCategories();
    res.json(categories);
  } catch (error) {
    console.error('[Services] Error fetching categories:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// Get services by category - MUST be after /categories/list to avoid route conflict
router.get('/category/:category', async (req, res) => {
  try {
    console.log(`[Services] Fetching services for category: ${req.params.category}`);
    const services = await getServicesByCategory(req.params.category);
    console.log(`[Services] Found ${services.length} services`);
    res.json(services);
  } catch (error) {
    console.error('[Services] Error fetching services by category:', error.message);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('[Services] Error fetching service by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch service', details: error.message });
  }
});

export default router;
