import { getSlotsByStatus } from '../utils/slotManager.js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Slots] Fetching all available slots for today');
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch all available slots for today (status = 'pending' means not yet served)
    const slots = await getSlotsByStatus('pending', today, today);

    console.log(`[Slots] Found ${slots.length} available slots for today`);

    // Return slots in simple format
    const formattedSlots = slots.map((slot) => {
      return {
        id: slot.id,
        assigned_staff: slot.assigned_staff || 'Any available',
        time_slot: slot.time_slot,
        date: slot.date,
        customer_name: slot.customer_name,
        services: slot.services
      };
    });

    res.status(200).json(formattedSlots);
  } catch (error) {
    console.error('[Slots] Error:', error);
    res.status(500).json({ error: 'Failed to fetch slots', details: error.message });
  }
};
