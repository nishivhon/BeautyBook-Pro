import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

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
    const queryStartDate = String(req.query?.fromDate || req.query?.startDate || '').trim();
    const queryEndDate = String(req.query?.toDate || req.query?.endDate || '').trim();
    const defaultStartDate = shiftDateString(today, -6);
    const startDate = /^\d{4}-\d{2}-\d{2}$/.test(queryStartDate) ? queryStartDate : defaultStartDate;
    const endDate = /^\d{4}-\d{2}-\d{2}$/.test(queryEndDate) ? queryEndDate : today;

    // Parse possible multiple staffName query params. Supports repeated params or comma-separated.
    const rawStaffNames = req.query?.staffName;
    let staffNames = [];
    if (Array.isArray(rawStaffNames)) {
      staffNames = rawStaffNames.map((v) => String(v).trim()).filter(Boolean);
    } else if (rawStaffNames) {
      staffNames = String(rawStaffNames).split(',').map((v) => v.trim()).filter(Boolean);
    }

    let query = supabase
      .from('staff_logs')
      .select('date, staff_name, clock_in, clock_out, total_clients, total_walk_in, done_clients')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('staff_name', { ascending: true });

    if (staffNames.length > 0) {
      query = query.in('staff_name', staffNames);
    }

    const { data: rows, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch staff logs', details: error.message });
    }

    const workbook = XLSX.utils.book_new();

    // If specific staff names were requested, create one sheet per staff
    if (staffNames.length > 0) {
      staffNames.forEach((staffName) => {
        const rowsForStaff = (rows || []).filter(r => String(r.staff_name || '').trim() === String(staffName).trim());
        const worksheetRows = (rowsForStaff || []).map((row) => ({
          date: row.date || '',
          staff_name: row.staff_name || '',
          clock_in: row.clock_in || '',
          clock_out: row.clock_out || '',
          total_clients: row.total_clients ?? 0,
          total_walk_in: row.total_walk_in ?? 0,
          done_clients: row.done_clients ?? 0,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetRows, {
          header: ['date', 'staff_name', 'clock_in', 'clock_out', 'total_clients', 'total_walk_in', 'done_clients'],
        });

        const lastRow = Math.max(worksheetRows.length + 1, 2);
        worksheet['!autofilter'] = { ref: `A1:G${lastRow}` };

        // sanitize sheet name (Excel sheet name max 31 chars, cannot contain some chars)
        const safeName = String(staffName).replace(/[\\/:*?\[\]]/g, '').slice(0, 28) || 'Staff';
        XLSX.utils.book_append_sheet(workbook, worksheet, safeName);
      });
    } else {
      const worksheetRows = (rows || []).map((row) => ({
        date: row.date || '',
        staff_name: row.staff_name || '',
        clock_in: row.clock_in || '',
        clock_out: row.clock_out || '',
        total_clients: row.total_clients ?? 0,
        total_walk_in: row.total_walk_in ?? 0,
        done_clients: row.done_clients ?? 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetRows, {
        header: ['date', 'staff_name', 'clock_in', 'clock_out', 'total_clients', 'total_walk_in', 'done_clients'],
      });

      const lastRow = Math.max(worksheetRows.length + 1, 2);
      worksheet['!autofilter'] = { ref: `A1:G${lastRow}` };

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Logs');
    }

    const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filenameSuffix = staffNames.length > 0 ? staffNames.map(n => n.replace(/\s+/g,'_')).join('__') : `${startDate}_to_${endDate}`;
    const filename = `staff_logs_${filenameSuffix}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(xlsxBuffer);
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}