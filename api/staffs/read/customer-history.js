import { createClient } from '@supabase/supabase-js';

const getPhtDateString = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
};

const getRange = (range = 'all') => {
  const endDate = getPhtDateString(new Date());

  if (range === 'today') return { startDate: endDate, endDate };

  if (range === 'week') {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return { startDate: getPhtDateString(start), endDate };
  }

  if (range === 'month') {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return { startDate: getPhtDateString(start), endDate };
  }

  return { startDate: null, endDate: null };
};

const parseServicesValue = (servicesValue) => {
  if (!servicesValue) return [];

  let services = servicesValue;
  if (typeof servicesValue === 'string') {
    try {
      services = JSON.parse(servicesValue);
    } catch (error) {
      return [];
    }
  }

  const toServiceEntry = (item) => {
    if (!item) return null;
    if (typeof item === 'string') {
      const name = item.trim();
      return name ? { category: 'Uncategorized', name, price: null } : null;
    }

    if (typeof item === 'object') {
      const name = String(item.name || item.title || item.service || '').trim();
      const category = String(item.category || item.category_name || 'Uncategorized').trim() || 'Uncategorized';
      const price = item.price !== undefined && item.price !== null ? Number(item.price) : null;
      return name ? { category, name, price: Number.isFinite(price) ? price : null } : null;
    }

    return null;
  };

  if (Array.isArray(services)) {
    return services.map(toServiceEntry).filter(Boolean);
  }

  const single = toServiceEntry(services);
  return single ? [single] : [];
};

const extractServicesPrice = (servicesValue) => {
  const services = parseServicesValue(servicesValue);
  if (!services.length) return null;

  const prices = services
    .map((item) => Number(item.price))
    .filter((price) => Number.isFinite(price));

  if (!prices.length) return null;
  return prices.reduce((sum, price) => sum + price, 0);
};

const formatServiceSummary = (servicesValue, fallbackService = null) => {
  const services = parseServicesValue(servicesValue);
  if (services.length) {
    return services
      .map((item) => `${item.category}: ${item.name}`)
      .join(' • ');
  }

  return fallbackService || null;
};

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const staffName = String(req.query.staffName || '').trim();
    const range = String(req.query.range || 'all').trim();
    const { startDate, endDate } = getRange(range);

    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    // If Supabase config is missing, return demo data so the modal can render in dev without env changes
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      const isoToday = getPhtDateString(new Date());
      const demo = [
        {
          id: 'demo-1', source: 'appointment', rawId: null, staff: 'Carlos Reyes', customer: 'Demo Customer A',
          date: isoToday, time: '10:00 - 11:00', service: 'Hair Services: Hair Cut', services: [{ category: 'Hair Services', name: 'Hair Cut', price: 500 }], amount: 500, contact: '0912-345-6789', status: 'done', raw: {}
        },
        {
          id: 'demo-2', source: 'walkin', rawId: null, staff: 'Antonio Marquez', customer: 'Demo Customer B',
          date: isoToday, time: '11:30 - 12:00', service: 'Nails: Manicure', services: [{ category: 'Nails', name: 'Manicure', price: 300 }], amount: 300, contact: '0912-000-1111', status: 'done', raw: {}
        }
      ];

      // Apply staffName filter if provided
      let filtered = demo;
      if (staffName) filtered = filtered.filter(d => String(d.staff || '').toLowerCase().includes(String(staffName).toLowerCase()));

      // Apply range filter using startDate/endDate computed earlier
      if (startDate && endDate) {
        filtered = filtered.filter(d => (d.date >= startDate && d.date <= endDate));
      }

      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });


    // Build queries (filter by assigned_staff which stores staff names)
    const queries = [];

    // available_slots
    let availQuery = supabase.from('available_slots').select('*');
    if (staffName) availQuery = availQuery.eq('assigned_staff', staffName);
    if (startDate && endDate) availQuery = availQuery.gte('date', startDate).lte('date', endDate);
    queries.push(availQuery);

    // appointment_logs
    let apptQuery = supabase.from('appointment_logs').select('*');
    if (staffName) apptQuery = apptQuery.eq('assigned_staff', staffName);
    if (startDate && endDate) apptQuery = apptQuery.gte('date', startDate).lte('date', endDate);
    queries.push(apptQuery);

    // walk_in_logs
    let walkInQuery = supabase.from('walk_in_logs').select('*');
    if (staffName) walkInQuery = walkInQuery.eq('assigned_staff', staffName);
    if (startDate && endDate) walkInQuery = walkInQuery.gte('date', startDate).lte('date', endDate);
    queries.push(walkInQuery);

    const [availRes, apptRes, walkRes] = await Promise.all(queries.map(q => q));

    if (availRes.error) throw availRes.error;
    if (apptRes.error) throw apptRes.error;
    if (walkRes.error) throw walkRes.error;

    const availRows = Array.isArray(availRes.data) ? availRes.data : [];
    const apptRows = Array.isArray(apptRes.data) ? apptRes.data : [];
    const walkRows = Array.isArray(walkRes.data) ? walkRes.data : [];

    const normalize = (row, source) => {
      const date = row.date || row.slot_date || row.slotDate || null;
      const time = row.time_slot || (row.start_time && row.end_time ? `${row.start_time} - ${row.end_time}` : row.time) || null;
      const customer = row.customer_name || row.client_name || row.customer || null;
      const serviceSummary = formatServiceSummary(row.services, row.service || null);
      const amount = row.total_price || row.price || extractServicesPrice(row.services);
      const contact = row.customer_contact || row.client_phone || row.client_contact || row.customer_phone || null;
      return {
        id: `${source}-${row.id || Math.random().toString(36).slice(2, 9)}`,
        source,
        rawId: row.id || null,
        staff: row.assigned_staff || row.staff_name || null,
        customer,
        date,
        time,
        service: serviceSummary,
        serviceSummary,
        services: parseServicesValue(row.services),
        amount,
        contact,
        status: row.status || null,
        raw: row
      };
    };

    const all = [
      ...availRows.map(r => normalize(r, 'slot')),
      ...apptRows.map(r => normalize(r, 'appointment')),
      ...walkRows.map(r => normalize(r, 'walkin')),
    ];

    // Sort by date desc, then time desc
    all.sort((a, b) => {
      if (a.date === b.date) return (b.time || '').localeCompare(a.time || '');
      return (b.date || '').localeCompare(a.date || '');
    });

    return res.status(200).json({ success: true, count: all.length, data: all });
  } catch (error) {
    console.error('[CustomerHistory] Error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error', details: String(error.message || error) });
  }
};
