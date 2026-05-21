import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

// Convert 24-hour time format to 12-hour format
function convertTo12HourFormat(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, phone } = req.query;

  if (!email && !phone) {
    return res.status(400).json({ error: 'Either email or phone parameter is required' });
  }

  try {
    console.log(`[AppointmentsByCustomer] Fetching appointments for email: ${email}, phone: ${phone}`);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    console.log(`[AppointmentsByCustomer] Supabase URL: ${supabaseUrl ? 'loaded' : 'MISSING'}`);
    console.log(`[AppointmentsByCustomer] Supabase Key: ${supabaseKey ? 'loaded' : 'MISSING'}`);

    if (!supabaseUrl || !supabaseKey) {
      console.error('[AppointmentsByCustomer] Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    console.log(`[AppointmentsByCustomer] Client created successfully`);

    // Fetch all services to build a category lookup map
    const { data: allServices, error: servicesError } = await supabase
      .from('services')
      .select('service_name, category');

    if (servicesError) {
      console.warn('[AppointmentsByCustomer] Warning: Could not fetch services:', servicesError.message);
    }

    // Build service name -> category map
    const serviceMap = {};
    if (allServices && Array.isArray(allServices)) {
      allServices.forEach(svc => {
        if (svc.service_name) {
          serviceMap[svc.service_name.toLowerCase().trim()] = svc.category || 'General';
        }
      });
      console.log('[AppointmentsByCustomer] Service map:', serviceMap);
    }
    console.log(`[AppointmentsByCustomer] Built service map with ${Object.keys(serviceMap).length} services`);

    // Build query to find pending appointments by customer contact
    // First, try to fetch all pending appointments and filter locally for reliability
    const { data: allAppointments, error } = await supabase
      .from('available_slots')
      .select('id, date, time_slot, customer_name, customer_contact, assigned_staff, services, status')
      .eq('status', 'pending')
      .order('date', { ascending: true });

    if (error) {
      console.error('[AppointmentsByCustomer] Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
    }

    console.log(`[AppointmentsByCustomer] Found ${allAppointments?.length || 0} total pending appointments`);

    // Filter appointments by matching email or phone
    const filteredAppointments = (allAppointments || []).filter(apt => {
      const contact = (apt.customer_contact || '').toLowerCase();
      const emailMatch = email && contact.includes(email.toLowerCase());
      const phoneMatch = phone && contact.includes(phone.toLowerCase());
      return emailMatch || phoneMatch;
    });

    console.log(`[AppointmentsByCustomer] Filtered to ${filteredAppointments.length} matching appointments`);

    const appointments = filteredAppointments;

    // Format appointments for display
    const formattedAppointments = appointments.map((apt, idx) => {
      // Determine if customer_contact is email or phone
      const isEmail = apt.customer_contact?.includes('@');
      
      // Extract service name and category from various formats
      let serviceName = 'Service';
      let serviceCategory = 'General';
      
      console.log(`[AppointmentsByCustomer] Apt ${idx} raw services:`, apt.services, `(type: ${typeof apt.services})`);
      
      if (typeof apt.services === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(apt.services);
          serviceName = parsed.name || parsed.service || 'Service';
          console.log(`[AppointmentsByCustomer] Apt ${idx} parsed as JSON, serviceName:`, serviceName);
        } catch {
          // If not JSON, treat as plain string
          serviceName = apt.services;
          console.log(`[AppointmentsByCustomer] Apt ${idx} treated as string, serviceName:`, serviceName);
        }
      } else if (Array.isArray(apt.services) && apt.services.length > 0) {
        // Handle array of objects or strings
        const firstService = apt.services[0];
        if (typeof firstService === 'string') {
          try {
            const parsed = JSON.parse(firstService);
            serviceName = parsed.name || parsed.service || 'Service';
            console.log(`[AppointmentsByCustomer] Apt ${idx} array parsed as JSON, serviceName:`, serviceName);
          } catch {
            serviceName = firstService;
            console.log(`[AppointmentsByCustomer] Apt ${idx} array treated as string, serviceName:`, serviceName);
          }
        } else if (typeof firstService === 'object') {
          serviceName = firstService.name || firstService.service || 'Service';
          console.log(`[AppointmentsByCustomer] Apt ${idx} array object, serviceName:`, serviceName);
        }
      } else if (typeof apt.services === 'object' && apt.services !== null) {
        // Handle single object
        serviceName = apt.services.name || apt.services.service || 'Service';
        console.log(`[AppointmentsByCustomer] Apt ${idx} single object, serviceName:`, serviceName);
      }
      
      // Look up category from service name in the services table map
      const serviceNameLower = serviceName.toLowerCase().trim();
      serviceCategory = serviceMap[serviceNameLower] || 'General';
      console.log(`[AppointmentsByCustomer] Apt ${idx} lookup "${serviceNameLower}" -> category: "${serviceCategory}"`);
      console.log(`[AppointmentsByCustomer] Apt ${idx} Available keys in map:`, Object.keys(serviceMap));
      
      return {
        id: apt.id,
        date: apt.date,
        time: convertTo12HourFormat(apt.time_slot),
        time_24: apt.time_slot,
        service: serviceName,
        category: serviceCategory,
        stylist: apt.assigned_staff || 'Unassigned',
        customerName: apt.customer_name,
        customerContact: apt.customer_contact,
        email: isEmail ? apt.customer_contact : '',
        phone: !isEmail ? apt.customer_contact : '',
        status: apt.status,
        refNo: apt.id.toString().padStart(8, '0'),
        duration: '1 hour', // Default duration
        price: 0, // Will be populated if service data is available
        cancelled: false,
      };
    });

    console.log(`[AppointmentsByCustomer] Returning ${formattedAppointments.length} formatted appointments`);
    res.status(200).json({
      success: true,
      count: formattedAppointments.length,
      appointments: formattedAppointments,
    });
  } catch (err) {
    console.error('[AppointmentsByCustomer] Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
