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
    const appointments = slots.map((slot, index) => {
      // Extract service name from services field (can be string or object)
      let serviceName = 'Service pending';
      
      if (slot.services) {
        if (typeof slot.services === 'string') {
          serviceName = slot.services; // Plain string like "Haircut"
        } else if (typeof slot.services === 'object') {
          // Handle JSONB object format
          if (slot.services.name) {
            serviceName = slot.services.name;
          } else if (Array.isArray(slot.services)) {
            serviceName = slot.services.map(s => s.name || s).join(', ');
          } else {
            serviceName = Object.values(slot.services)[0] || 'Service pending';
          }
        }
      }
      
      return {
        id: slot.id,
        number: index + 1,
        name: slot.customer_name || 'Unknown',
        contact: slot.customer_contact || 'N/A',
        service: serviceName,
        staff: slot.assigned_staff || 'Any available',
        date: slot.date,
        time: slot.time_slot,
        status: slot.status,
        availability: slot.availability,
        createdAt: slot.created_at,
        updatedAt: slot.updated_at
      };
    });

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
