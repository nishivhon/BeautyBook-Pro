import { createClient } from '@supabase/supabase-js';
import { bookSlot } from '../utils/slotManager.js';
import { findStaffScheduleConflict, getServiceDurationMinutes, resolveStaffLabel } from '../utils/staffConflict.js';

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

function getCurrentDateTimeParts() {
  const now = new Date();
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);

  return { date, time };
}

function isPastOrCurrentSlot(dateStr, time24) {
  if (!dateStr || !time24) return false;
  const { date: currentDate, time: currentTime } = getCurrentDateTimeParts();
  return dateStr === currentDate && time24 <= currentTime;
}

function resolvePreferredContact(notifPrefValue, fallbackEmail, fallbackPhone) {
  const normalizedEmail = typeof fallbackEmail === 'string' ? fallbackEmail.trim().toLowerCase() : '';
  const normalizedPhone = typeof fallbackPhone === 'string' ? fallbackPhone.replace(/\D/g, '') : '';
  const notifPref = String(notifPrefValue || '').trim();

  if (!notifPref) {
    return normalizedEmail || normalizedPhone;
  }

  const lower = notifPref.toLowerCase();
  if (lower === 'email') {
    return normalizedEmail || normalizedPhone;
  }
  if (lower === 'sms' || lower === 'phone') {
    return normalizedPhone || normalizedEmail;
  }

  if (notifPref.includes('@')) {
    return notifPref.toLowerCase();
  }

  const notifPhone = notifPref.replace(/\D/g, '');
  return notifPhone || normalizedEmail || normalizedPhone;
}

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, date, time, service, services, staff_assigned, total_amount, service_est_time } = req.body;

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

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    // Convert time to 24-hour format for slot booking
    const time24 = convertTo24HourFormat(time);

    if (isPastOrCurrentSlot(date, time24)) {
      return res.status(400).json({
        error: 'Selected time is no longer available. Please choose a later time.'
      });
    }
    
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPhone = typeof phone === 'string' ? phone.replace(/\D/g, '') : '';

    // Use notif_pref from customer account when available; fallback to request contact.
    let customerContact = normalizedEmail || normalizedPhone;
    let customerAccount = null;

    if (normalizedEmail || normalizedPhone) {
      let customerLookup = supabase.from('customers_accounts').select('id, notif_pref').limit(1);

      if (normalizedEmail) {
        customerLookup = customerLookup.eq('email', normalizedEmail);
      } else {
        customerLookup = customerLookup.eq('phone', normalizedPhone);
      }

      const { data: customerRows, error: customerLookupError } = await customerLookup;
      if (customerLookupError) {
        console.warn('[Appointments] Customer notif_pref lookup failed:', customerLookupError.message);
      } else {
        customerAccount = (customerRows && customerRows[0]) || null;
        customerContact = resolvePreferredContact(customerAccount?.notif_pref, normalizedEmail, normalizedPhone);
      }
    }

    // Format services as array of objects
    const formattedServices = servicesArray.map(svc => 
      typeof svc === 'string' ? { name: svc } : svc
    );

    // Normalize services to minimal shape to store in DB (only name and category)
    const minimalServices = formattedServices.map((svc) => {
      const name = svc?.name || svc?.title || svc?.service || String(svc || '').trim();
      const category = svc?.category || svc?.category_name || null;
      return { name, category };
    });

    const totalDurationMinutes = Number(service_est_time) || getServiceDurationMinutes(formattedServices);
    const resolvedStaff = resolveStaffLabel(staff_assigned);

    // If a coupon code was provided, check the customer's coupons_used to ensure it hasn't been used already
    const couponCode = String(req.body?.coupon?.code || req.body?.coupon?.id || '').trim().toUpperCase();
    if (couponCode && (email || phone)) {
      try {
        let customerQuery = supabase.from('customers_accounts').select('id, coupons_used').limit(1);
        if (normalizedEmail) customerQuery = customerQuery.eq('email', normalizedEmail);
        else if (normalizedPhone) customerQuery = customerQuery.eq('phone', normalizedPhone);

        const { data: customerRows, error: customerFetchError } = await customerQuery;
        if (!customerFetchError && customerRows && customerRows.length > 0) {
          const customer = customerRows[0];
          const couponsUsed = Array.isArray(customer.coupons_used) ? customer.coupons_used : [];
          const matching = couponsUsed.find(c => String(c?.code || '').toUpperCase() === couponCode);
          if (matching && matching.used) {
            return res.status(409).json({ error: 'Coupon has already been used by this customer' });
          }
        }
      } catch (err) {
        console.warn('[Appointments] Warning: could not verify coupon usage for customer:', err?.message || err);
        // don't block booking on verification failure, we'll try marking it later
      }
    }

    const conflict = await findStaffScheduleConflict({
      supabase,
      date,
      startTime: time24,
      durationMinutes: totalDurationMinutes,
      staff: resolvedStaff,
    });

    if (conflict) {
      return res.status(409).json({
        error: 'Stylist is already booked for part of the selected time window.',
        conflict,
      });
    }

    // Book the slot with customer info, staff, and services
    const slotBooked = await bookSlot(
      date, 
      time24, 
      name, 
      customerContact,
      resolvedStaff,
      minimalServices,
      totalDurationMinutes,
      total_amount
    );
    
    if (!slotBooked) {
      console.warn('[Appointments] Failed to book slot - it may already be taken');
      return res.status(400).json({ error: 'Time slot is no longer available. Please select another time.' });
    }

    // Best-effort: mark the selected coupon as used in the customer account
    if (couponCode && (email || phone)) {
      let customerQuery = supabase.from('customers_accounts').select('id, coupons_used');
      if (normalizedEmail) {
        customerQuery = customerQuery.eq('email', normalizedEmail);
      } else if (normalizedPhone) {
        customerQuery = customerQuery.eq('phone', normalizedPhone);
      }

      const { data: customerRows, error: customerFetchError } = await customerQuery.limit(1);

      if (customerFetchError) {
        console.warn('[Appointments] Failed to load customer for coupon update:', customerFetchError.message);
      } else if (customerRows && customerRows.length > 0) {
        const customer = customerRows[0];
        const couponsUsed = Array.isArray(customer.coupons_used) ? customer.coupons_used : [];
        const updatedCoupons = couponsUsed.map((coupon) => {
          const currentCode = String(coupon?.code || '').toUpperCase();
          return currentCode === couponCode
            ? { ...coupon, claimed: true, used: true }
            : coupon;
        });

        const matchingCouponIndex = updatedCoupons.findIndex((coupon) => String(coupon?.code || '').toUpperCase() === couponCode);
        if (matchingCouponIndex !== -1) {
          const { error: updateCouponError } = await supabase
            .from('customers_accounts')
            .update({ coupons_used: updatedCoupons })
            .eq('id', customer.id);

          if (updateCouponError) {
            console.warn('[Appointments] Coupon use update failed:', updateCouponError.message);
          } else {
            console.log(`[Appointments] Marked coupon ${couponCode} as used for customer ${customer.id}`);
          }
        } else {
          console.warn(`[Appointments] Coupon ${couponCode} not found in customer coupons_used`);
        }
      }
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
        services: minimalServices,
        staff_assigned: resolvedStaff
      }
    });
  } catch (error) {
    console.error(`[Appointments] Error creating appointment: ${error.message}`);
    res.status(500).json({ error: 'Failed to create appointment', details: error.message });
  }
};
