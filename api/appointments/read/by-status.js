import { getSlotsByStatus } from '../utils/slotManager.js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ error: 'Status parameter is required' });
  }

  const validStatuses = ['pending', 'current', 'done', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }

  try {
    console.log(`[Appointments] Fetching appointments with status: ${status}`);
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch slots by status for today
    const slots = await getSlotsByStatus(status, today, today);

    console.log(`[Appointments] Found ${slots.length} appointments with status: ${status}`);

    // Transform slots to appointment format for admin dashboard
    const appointments = slots.map((slot, index) => ({
      id: slot.id,
      number: index + 1,
      name: slot.customer_name || 'Unknown',
      contact: slot.customer_contact || 'N/A',
      service: Array.isArray(slot.services) 
        ? slot.services.map(s => s.name || s).join(', ')
        : 'Service pending',
      staff: slot.assigned_staff || 'Any available',
      date: slot.date,
      time: slot.time_slot,
      status: slot.status,
      availability: slot.availability,
      createdAt: slot.created_at,
      updatedAt: slot.updated_at
    }));

    res.status(200).json({
      success: true,
      status: status,
      date: today,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error(`[Appointments] Error fetching appointments:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch appointments', 
      details: error.message 
    });
  }
};
