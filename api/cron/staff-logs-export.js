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

const shiftDateString = (dateString, dayOffset) => {
  const sourceDate = new Date(`${dateString}T00:00:00+08:00`);
  sourceDate.setDate(sourceDate.getDate() + dayOffset);
  return getPhtDateString(sourceDate);
};

const csvEscape = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
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
    const startDate = shiftDateString(today, -6);

    const { data: rows, error } = await supabase
      .from('staff_logs')
      .select('date, staff_name, clock_in, clock_out, total_clients, total_walk_in, done_clients')
      .gte('date', startDate)
      .lte('date', today)
      .order('date', { ascending: true })
      .order('staff_name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch staff logs', details: error.message });
    }

    const header = ['date', 'staff_name', 'clock_in', 'clock_out', 'total_clients', 'total_walk_in', 'done_clients'];
    const csvLines = [header.join(',')];

    for (const row of rows || []) {
      csvLines.push([
        csvEscape(row.date),
        csvEscape(row.staff_name),
        csvEscape(row.clock_in),
        csvEscape(row.clock_out),
        csvEscape(row.total_clients),
        csvEscape(row.total_walk_in),
        csvEscape(row.done_clients),
      ].join(','));
    }

    const csv = csvLines.join('\r\n');
    const filename = `staff_logs_last_7_days_${today}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}