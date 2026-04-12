import { seedAvailableSlots } from './utils/seedSlots.js';

/**
 * API endpoint to trigger slot seeding
 * Can be called by n8n, cron jobs, or manual requests
 * 
 * POST /api/appointments/seed-slots
 * 
 * Headers (optional):
 * - Authorization: Bearer YOUR_SECRET_KEY (for security)
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Slots seeded successfully",
 *   "count": 60
 * }
 */
export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Add security check with API key
  const apiKey = req.headers.authorization?.split(' ')[1];
  const validKey = process.env.SEED_SLOTS_API_KEY;

  if (validKey && apiKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized - invalid API key' });
  }

  try {
    console.log('[SeedSlotsAPI] Seeding available slots (triggered from n8n or external source)');
    
    const result = await seedAvailableSlots();

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to seed slots',
        details: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Slots seeded successfully',
      count: result.count
    });

  } catch (error) {
    console.error('[SeedSlotsAPI] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to seed slots',
      details: error.message 
    });
  }
};
