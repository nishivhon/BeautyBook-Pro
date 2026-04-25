import { bookSlot } from '../utils/slotManager.js';

// Convert 12-hour format to 24-hour format
function convertTo24HourFormat(time12) {
  if (!time12) return '';
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, date, time, service, services, staff_assigned } = req.body;

  // Validate: name, date, time, staff_assigned are required
  // AND at least one of email or phone is required
  if (!name || !date || !time || !staff_assigned) {
    return res.status(400).json({ error: 'Missing required fields: name, date, time, staff_assigned' });
  }

  if (!email && !phone) {
    return res.status(400).json({ error: 'At least one contact method (email or phone) is required' });
  }

  // Support both 'service' (single) and 'services' (array)
  const servicesArray = services || (service ? [service] : []);
  
  if (servicesArray.length === 0) {
    return res.status(400).json({ error: 'At least one service is required' });
  }

  try {
    console.log(`[Appointments] Creating new appointment for: ${name}`);
    
    // Convert time to 24-hour format for slot booking
    const time24 = convertTo24HourFormat(time);
    
    // Use email or phone as contact (whichever is provided, prioritize email)
    const customerContact = email || phone;

    // Format services as array of objects
    const formattedServices = servicesArray.map(svc => 
      typeof svc === 'string' ? { name: svc } : svc
    );

    // Book the slot with customer info, staff, and services
    const slotBooked = await bookSlot(
      date, 
      time24, 
      name, 
      customerContact,
      staff_assigned,
      formattedServices
    );
    
    if (!slotBooked) {
      console.warn('[Appointments] Failed to book slot - it may already be taken');
      return res.status(400).json({ error: 'Time slot is no longer available. Please select another time.' });
    }

    console.log(`[Appointments] Appointment successfully booked for ${name} on ${date} at ${time}`);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      booking: {
        name,
        contact: customerContact,
        date,
        time,
        services: formattedServices,
        staff_assigned
      }
    });
  } catch (error) {
    console.error(`[Appointments] Error creating appointment: ${error.message}`);
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
};
