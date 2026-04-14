import { cleanupPastSlots } from './utils/seedSlots.js';

/**
 * API endpoint to manually trigger cleanup of past slots
 * Useful for testing or manual maintenance
 * 
 * POST /api/appointments/cleanup-past-slots
 * No body required
 */
export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[CleanupSlots] Manually triggered cleanup');
    
    const result = await cleanupPastSlots();

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to cleanup past slots',
        details: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Past slots cleaned up successfully'
    });

  } catch (error) {
    console.error('[CleanupSlots] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to cleanup past slots',
      details: error.message 
    });
  }
};
