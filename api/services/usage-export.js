import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const normalizeServiceName = (value) => String(value || '').trim().toLowerCase();

const parseServicesValue = (servicesValue) => {
  if (!servicesValue) return [];

  let payload = servicesValue;

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (_error) {
      const fallback = payload.trim();
      return fallback ? [fallback] : [];
    }
  }

  if (Array.isArray(payload)) return payload;
  if (typeof payload === 'object') return [payload];

  return [];
};

const toServiceName = (serviceEntry) => {
  if (!serviceEntry) return null;

  if (typeof serviceEntry === 'string') {
    const name = serviceEntry.trim();
    return name || null;
  }

  if (typeof serviceEntry === 'object') {
    const candidate = serviceEntry.name || serviceEntry.title || serviceEntry.service || serviceEntry.service_name;
    const name = String(candidate || '').trim();
    return name || null;
  }

  return null;
};

const getPhtDateString = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date).reduce((accumulator, part) => {
    if (part.type !== 'literal') accumulator[part.type] = part.value;
    return accumulator;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
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

    const [servicesResult, appointmentResult, walkInResult] = await Promise.all([
      supabase.from('services').select('id, service_name, category, price'),
      supabase.from('appointment_logs').select('date, services'),
      supabase.from('walk_in_logs').select('date, services'),
    ]);

    if (servicesResult.error) {
      return res.status(500).json({ error: 'Failed to fetch services', details: servicesResult.error.message });
    }

    if (appointmentResult.error) {
      return res.status(500).json({ error: 'Failed to fetch appointment_logs', details: appointmentResult.error.message });
    }

    if (walkInResult.error) {
      return res.status(500).json({ error: 'Failed to fetch walk_in_logs', details: walkInResult.error.message });
    }

    const services = servicesResult.data || [];

    const usageByService = new Map();
    const serviceRows = services.map((row, index) => {
      const serviceName = String(row.service_name || '').trim();
      const normalizedName = normalizeServiceName(serviceName) || `service-id-${row.id || index}`;
      const price = Number(row.price);
      const unitPrice = Number.isFinite(price) ? price : 0;

      const safeName = serviceName || `Service ${index + 1}`;

      usageByService.set(normalizedName, {
        service_name: safeName,
        category: row.category || '',
        unit_price: Number(unitPrice.toFixed(2)),
        usage_count: 0,
      });

      return {
        key: normalizedName,
        displayName: safeName,
      };
    });

    const incrementUsage = (servicesValue) => {
      const entries = parseServicesValue(servicesValue);

      for (const entry of entries) {
        const serviceName = toServiceName(entry);
        if (!serviceName) continue;

        const normalizedName = normalizeServiceName(serviceName);
        const target = usageByService.get(normalizedName);
        if (!target) continue;

        target.usage_count += 1;
      }
    };

    for (const row of appointmentResult.data || []) {
      incrementUsage(row.services);
    }

    for (const row of walkInResult.data || []) {
      incrementUsage(row.services);
    }

    const rows = serviceRows.map(({ key, displayName }) => {
      const item = usageByService.get(key) || {
        service_name: displayName,
        category: '',
        unit_price: 0,
        usage_count: 0,
      };

      const totalRevenue = Number((item.unit_price * item.usage_count).toFixed(2));

      return {
        category: item.category,
        service_name: item.service_name,
        unit_price: Number(item.unit_price.toFixed(2)),
        usage_count: item.usage_count,
        total_revenue: totalRevenue,
      };
    });

    rows.sort((a, b) => {
      const categoryCompare = String(a.category || '').localeCompare(String(b.category || ''));
      if (categoryCompare !== 0) return categoryCompare;
      return String(a.service_name || '').localeCompare(String(b.service_name || ''));
    });

    const appointmentDates = (appointmentResult.data || []).map((row) => row?.date).filter(Boolean);
    const walkInDates = (walkInResult.data || []).map((row) => row?.date).filter(Boolean);
    const allDates = [...appointmentDates, ...walkInDates].sort();
    const defaultToday = getPhtDateString();
    const rangeStart = allDates[0] || defaultToday;
    const rangeEnd = allDates[allDates.length - 1] || defaultToday;

    const worksheetRows = [
      ['Date Range', `${rangeStart} to ${rangeEnd}`],
      ['Category', 'Service Name', 'Unit Price', 'Usage Count', 'Total Revenue'],
      ...rows.map((row) => [
        row.category || '',
        row.service_name || '',
        row.unit_price,
        row.usage_count,
        row.total_revenue,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetRows);
    const lastRow = Math.max(worksheetRows.length, 2);
    worksheet['!autofilter'] = { ref: `A2:E${lastRow}` };
    worksheet['!cols'] = [
      { wch: 22 },
      { wch: 28 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Services Usage');

    const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const dateStamp = new Date().toISOString().slice(0, 10);
    const filename = `services_usage_report_${dateStamp}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(xlsxBuffer);
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}