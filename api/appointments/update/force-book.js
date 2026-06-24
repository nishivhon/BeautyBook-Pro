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

const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
};

const normalizeServices = (services) => {
  if (!services) return [];
  if (Array.isArray(services)) return services;
  // allow single service object
  return [services];
};

const normalizeMinimalServices = (servicesArr) => {
  // Store minimal shape in DB (only name and category)
  return (servicesArr || []).map((svc) => {
    const name = svc?.name || svc?.title || svc?.service || String(svc || '').trim();
    const category = svc?.category || svc?.category_name || null;
    return { name, category };
  });
};

const toNumber = (v, fallback = 0) => {
  const n = typeof v === 'string' ? Number(v) : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      date,
      time,
      // accept either `name` or `customer_name`
      name,
      customer_name,
      customer_contact,
      email,
      phone,
      staff_assigned,
      assigned_staff,
      services,
      service_est_time,
      total_amount,
      total_price,
      status,
      // optional: allow passing in id to reuse a row (ignored if present)
    } = req.body || {};

    const assigned = assigned_staff || staff_assigned || null;
    const resolvedCustomerName = (name || customer_name || '').toString().trim();

    // Accept either `customer_contact` OR (`email` or `phone`) coming from frontend booking payload
    const resolvedCustomerContact =
      (customer_contact || '').toString().trim() ||
      (email || '').toString().trim() ||
      (phone || '').toString().replace(/\D/g, '').trim();

    if (!date) return res.status(400).json({ error: 'date is required' });
    if (!time) return res.status(400).json({ error: 'time is required' });
    if (!resolvedCustomerName) return res.status(400).json({ error: 'customer_name is required' });
    if (!assigned) return res.status(400).json({ error: 'assigned_staff is required' });
    if (!resolvedCustomerContact) return res.status(400).json({ error: 'customer_contact is required' });



    // Minimal normalization
    const servicesArr = normalizeMinimalServices(normalizeServices(services));
    const estMinutes = toNumber(service_est_time, 0);
    const price = toNumber(total_amount ?? total_price, 0);

    const supabase = getSupabase();

    // Always insert a NEW row
    const insertData = {
      date,
      time_slot: time,
      availability: false,
      customer_name: resolvedCustomerName,
      customer_contact: resolvedCustomerContact,
      assigned_staff: assigned,
      services: servicesArr,
      service_est_time: estMinutes,
      total_price: price,
      status: status || 'pending',
      reminder_sent: false,
      reminder_sent_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('available_slots')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('[ForceBook] insert error:', error);
      return res.status(500).json({ error: 'Failed to force-book slot', details: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Appointment row created (forced insert)',
      data,
    });
  } catch (err) {
    console.error('[ForceBook] unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message || String(err) });
  }
};

