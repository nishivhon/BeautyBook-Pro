import { addAppointment } from '../../server/src/services/booking/create/addAppointment.js';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, date, time, service, staff_assigned } = req.body;

  if (!name || !email || !phone || !date || !time || !service || !staff_assigned) {
    return res.status(400).json({ error: 'Missing required appointment fields' });
  }

  try {
    console.log(`[Appointments] Creating new appointment for: ${name}`);

    const appointment = await addAppointment({
      name,
      email,
      phone,
      date,
      time,
      service,
      staff_assigned
    });

    console.log(`[Appointments] Successfully created appointment with ID: ${appointment.id}`);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error(`[Appointments] Error creating appointment: ${error.message}`);
    res.status(400).json({ error: 'Failed to create appointment', details: error.message });
  }
};
