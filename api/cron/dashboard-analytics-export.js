import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const MANILA_TIME_ZONE = 'Asia/Manila';

const getPhtDateString = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MANILA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date).reduce((accumulator, part) => {
    if (part.type !== 'literal') {
      accumulator[part.type] = part.value;
    }
    return accumulator;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const csvEscape = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const parseServices = (servicesValue) => {
  if (!servicesValue) return [];

  if (Array.isArray(servicesValue)) return servicesValue;

  if (typeof servicesValue === 'string') {
    try {
      const parsed = JSON.parse(servicesValue);
      return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
    } catch (error) {
      return [];
    }
  }

  if (typeof servicesValue === 'object') return [servicesValue];

  return [];
};

const getWalkInRevenue = (row) => {
  const services = parseServices(row.services);
  const total = services.reduce((sum, item) => {
    const price = Number(item?.price);
    return Number.isFinite(price) ? sum + price : sum;
  }, 0);

  return total;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: 'Server misconfigured', details: 'Missing Supabase configuration' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    const today = getPhtDateString();
    const startDate = `${today.slice(0, 7)}-01`;

    const [appointmentResult, walkInResult] = await Promise.all([
      supabase
        .from('appointment_logs')
        .select('date, total_price')
        .gte('date', startDate)
        .lte('date', today),
      supabase
        .from('walk_in_logs')
        .select('date, services')
        .gte('date', startDate)
        .lte('date', today),
    ]);

    if (appointmentResult.error) {
      return res.status(500).json({ error: 'Failed to fetch appointment_logs', details: appointmentResult.error.message });
    }

    if (walkInResult.error) {
      return res.status(500).json({ error: 'Failed to fetch walk_in_logs', details: walkInResult.error.message });
    }

    const dayMap = new Map();

    const startDateObj = new Date(`${startDate}T00:00:00+08:00`);
    const todayObj = new Date(`${today}T00:00:00+08:00`);

    for (let cursor = new Date(startDateObj); cursor <= todayObj; cursor.setDate(cursor.getDate() + 1)) {
      const date = getPhtDateString(cursor);
      dayMap.set(date, {
        date,
        total_appointments: 0,
        total_walkins: 0,
        total_revenue: 0,
      });
    }

    for (const row of appointmentResult.data || []) {
      const dateKey = row.date;
      if (!dayMap.has(dateKey)) continue;

      const current = dayMap.get(dateKey);
      current.total_appointments += 1;

      const price = Number(row.total_price);
      if (Number.isFinite(price)) {
        current.total_revenue += price;
      }
    }

    for (const row of walkInResult.data || []) {
      const dateKey = row.date;
      if (!dayMap.has(dateKey)) continue;

      const current = dayMap.get(dateKey);
      current.total_walkins += 1;
      current.total_revenue += getWalkInRevenue(row);
    }

    const rows = Array.from(dayMap.values()).map((row) => ({
      ...row,
      total_revenue: Number(row.total_revenue.toFixed(2)),
    }));

    const header = ['date', 'total_appointments', 'total_walkins', 'total_revenue'];
    const csvLines = [header.join(',')];

    for (const row of rows) {
      csvLines.push([
        csvEscape(row.date),
        csvEscape(row.total_appointments),
        csvEscape(row.total_walkins),
        csvEscape(row.total_revenue),
      ].join(','));
    }

    const csv = csvLines.join('\r\n');
    const filename = `dashboard_analytics_monthly_${today.slice(0, 7)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}