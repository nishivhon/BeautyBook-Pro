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

  const { email, phone, status, statuses, days } = req.query;

  if (!email && !phone) {
    return res.status(400).json({ error: 'Either email or phone parameter is required' });
  }

  const requestedStatuses = Array.isArray(statuses)
    ? statuses
    : String(statuses || status || 'pending')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

  const uniqueStatuses = [...new Set(requestedStatuses)].filter(Boolean);
  const applyRecentWindow = uniqueStatuses.includes('done') && Number.isFinite(Number(days)) && Number(days) > 0;
  const recentDays = applyRecentWindow ? Number(days) : 0;
  const sinceIso = applyRecentWindow
    ? new Date(Date.now() - recentDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  try {
    console.log(`[AppointmentsByCustomer] Fetching appointments for email: ${email}, phone: ${phone}`);

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

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

    // Fetch all services to build a category, price and est_time lookup map
    const { data: allServices, error: servicesError } = await supabase
      .from('services')
      .select('name, category, price, est_time');

    if (servicesError) {
      console.warn('[AppointmentsByCustomer] Warning: Could not fetch services:', servicesError.message);
    }

    // Build service name -> category and price maps
    const serviceMap = {};
    const servicePriceMap = {};
    const serviceEstMap = {};
    if (allServices && Array.isArray(allServices)) {
      allServices.forEach(svc => {
        if (svc.name) {
          const key = svc.name.toLowerCase().trim();
          serviceMap[key] = svc.category || 'General';
          servicePriceMap[key] = typeof svc.price === 'number' ? svc.price : Number(svc.price) || 0;
          serviceEstMap[key] = Number(svc.est_time) || 0;
        }
      });
      console.log('[AppointmentsByCustomer] Service map:', serviceMap);
    }
    console.log(`[AppointmentsByCustomer] Built service map with ${Object.keys(serviceMap).length} services`);

    // Build query to find appointments by customer contact and requested status set
    let appointmentsQuery = supabase
      .from('available_slots')
      .select('id, date, time_slot, customer_name, customer_contact, assigned_staff, services, status, service_est_time, total_price, updated_at')
      .order('date', { ascending: true });

    if (uniqueStatuses.length > 0) {
      appointmentsQuery = appointmentsQuery.in('status', uniqueStatuses);
    }

    if (sinceIso) {
      appointmentsQuery = appointmentsQuery.gte('updated_at', sinceIso);
    }

    const { data: allAppointments, error } = await appointmentsQuery;

    if (error) {
      console.error('[AppointmentsByCustomer] Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
    }

    console.log(`[AppointmentsByCustomer] Found ${allAppointments?.length || 0} total appointments for statuses: ${uniqueStatuses.join(', ')}`);

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
          serviceName = parsed.name || parsed.title || parsed.service || 'Service';
          // prefer category from slot payload when available
          if (parsed.category) serviceCategory = parsed.category;
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
            serviceName = parsed.name || parsed.title || parsed.service || 'Service';
            if (parsed.category) serviceCategory = parsed.category;
            console.log(`[AppointmentsByCustomer] Apt ${idx} array parsed as JSON, serviceName:`, serviceName);
          } catch {
            serviceName = firstService;
            console.log(`[AppointmentsByCustomer] Apt ${idx} array treated as string, serviceName:`, serviceName);
          }
        } else if (typeof firstService === 'object') {
          serviceName = firstService.name || firstService.title || firstService.service || 'Service';
          if (firstService.category) serviceCategory = firstService.category;
          console.log(`[AppointmentsByCustomer] Apt ${idx} array object, serviceName:`, serviceName);
        }
      } else if (typeof apt.services === 'object' && apt.services !== null) {
        // Handle single object
        serviceName = apt.services.name || apt.services.title || apt.services.service || 'Service';
        if (apt.services.category) serviceCategory = apt.services.category;
        console.log(`[AppointmentsByCustomer] Apt ${idx} single object, serviceName:`, serviceName);
      }
      
      // Look up category from service name in the services table map,
      // but prefer any category found in the slot payload (serviceCategory may already be set above)
      const serviceNameLower = serviceName.toLowerCase().trim();
      serviceCategory = serviceCategory || serviceMap[serviceNameLower] || 'General';
      console.log(`[AppointmentsByCustomer] Apt ${idx} lookup "${serviceNameLower}" -> category: "${serviceCategory}"`);
      console.log(`[AppointmentsByCustomer] Apt ${idx} Available keys in map:`, Object.keys(serviceMap));
      
      // Determine price: prefer explicit slot total_price, then explicit service price in services payload, else lookup from services table
      let price = 0;
      if (apt.total_price) {
        price = Number(apt.total_price) || 0;
      }
      try {
        if (!price && Array.isArray(apt.services) && apt.services.length > 0) {
          const first = apt.services[0];
          if (typeof first === 'object' && first.price !== undefined) {
            price = Number(first.price) || 0;
          } else if (typeof first === 'string') {
            // try parse JSON
            try {
              const parsedFirst = JSON.parse(first);
              if (parsedFirst && parsedFirst.price !== undefined) price = Number(parsedFirst.price) || 0;
            } catch {}
          }
        } else if (!price && typeof apt.services === 'object' && apt.services !== null && apt.services.price !== undefined) {
          price = Number(apt.services.price) || 0;
        }
      } catch (e) {
        // ignore
      }

      // fallback: lookup price by name from services table
      if (!price) {
        const lookupKey = String(serviceName || '').toLowerCase().trim();
        price = servicePriceMap[lookupKey] || 0;
      }

      // Determine estimated time in minutes: prefer slot.service_est_time then services table est_time
      const lookupKey = String(serviceName || '').toLowerCase().trim();
      let estMinutes = Number(apt.service_est_time) || 0;
      if (!estMinutes) {
        estMinutes = serviceEstMap[lookupKey] || 0;
      }

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
        duration: estMinutes ? `${estMinutes} min` : '1 hour',
        price: Number(price) || 0,
        service_est_time: estMinutes,
        cancelled: false,
        updated_at: apt.updated_at || null,
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
