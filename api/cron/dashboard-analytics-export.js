import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';

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

const parseServices = (servicesValue) => {
  if (!servicesValue) return [];
  if (Array.isArray(servicesValue)) return servicesValue;

  if (typeof servicesValue === 'string') {
    try {
      const parsed = JSON.parse(servicesValue);
      return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
    } catch {
      return [];
    }
  }

  if (typeof servicesValue === 'object') return [servicesValue];
  return [];
};

const getWalkInRevenue = (row) => {
  const services = parseServices(row.services);
  return services.reduce((sum, item) => {
    const price = Number(item?.price);
    return Number.isFinite(price) ? sum + price : sum;
  }, 0);
};

const hasAppointmentBookingData = (row) => {
  const customerName = String(row?.customer_name || '').trim();
  const customerContact = String(row?.customer_contact || '').trim();
  const assignedStaff = String(row?.assigned_staff || '').trim();
  const services = parseServices(row?.services);
  const totalPrice = Number(row?.total_price || 0);

  return (
    customerName.length > 0 ||
    customerContact.length > 0 ||
    assignedStaff.length > 0 ||
    services.length > 0 ||
    (Number.isFinite(totalPrice) && totalPrice > 0)
  );
};

const hasWalkInBookingData = (row) => {
  const customerName = String(row?.customer_name || '').trim();
  const services = parseServices(row?.services);
  return customerName.length > 0 || services.length > 0;
};

const clampSheetName = (name) => {
  const safe = String(name ?? 'Sheet');
  return safe.length > 31 ? safe.slice(0, 31) : safe;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: 'Server misconfigured', details: 'Missing Supabase configuration' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    const today = getPhtDateString();
    const defaultStartDate = `${today.slice(0, 7)}-01`;
    const queryStartDate = String(req.query?.fromDate || req.query?.startDate || '').trim();
    const queryEndDate = String(req.query?.toDate || req.query?.endDate || '').trim();
    const startDate = /^\d{4}-\d{2}-\d{2}$/.test(queryStartDate) ? queryStartDate : defaultStartDate;
    const endDate = /^\d{4}-\d{2}-\d{2}$/.test(queryEndDate) ? queryEndDate : today;

    const startDateObj = new Date(`${startDate}T00:00:00+08:00`);
    const endDateObj = new Date(`${endDate}T00:00:00+08:00`);
    const todayObj = new Date(`${today}T00:00:00+08:00`);

    const yesterdayObj = new Date(todayObj);
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterday = getPhtDateString(yesterdayObj);

    const includeToday = startDate <= today && endDate >= today;
    const lastAppointmentDate = endDate < today ? endDate : yesterday;

    const appointmentPastPromise = startDate <= lastAppointmentDate
      ? supabase
          .from('appointment_logs')
          .select('date, total_price, customer_name, customer_contact, assigned_staff, services')
          .gte('date', startDate)
          .lte('date', lastAppointmentDate)
      : Promise.resolve({ data: [], error: null });

    const [appointmentPastResult, appointmentTodayResult, walkInResult] = await Promise.all([
      appointmentPastPromise,
      includeToday
        ? supabase
            .from('available_slots')
            .select('date, total_price, customer_name, customer_contact, assigned_staff, services, status')
            .in('status', ['pending', 'current', 'done'])
            .eq('date', today)
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('walk_in_logs')
        .select('date, services, customer_name')
        .gte('date', startDate)
        .lte('date', endDate),
    ]);


    if (appointmentPastResult.error) {
      return res.status(500).json({ error: 'Failed to fetch appointment_logs', details: appointmentPastResult.error.message });
    }
    if (appointmentTodayResult.error) {
      return res.status(500).json({ error: 'Failed to fetch available_slots', details: appointmentTodayResult.error.message });
    }
    if (walkInResult.error) {
      return res.status(500).json({ error: 'Failed to fetch walk_in_logs', details: walkInResult.error.message });
    }

    // Prepare per-day sheet data
    const sheets = {};
    for (let cursor = new Date(startDateObj); cursor <= endDateObj; cursor.setDate(cursor.getDate() + 1)) {
      const date = getPhtDateString(cursor);
      sheets[date] = {
        appointmentRows: [],
        walkInRows: [],
      };
    }

    const appointmentRows = [
      ...(appointmentPastResult.data || []),
      ...(appointmentTodayResult.data || []),
    ];

    for (const row of appointmentRows) {
      if (!hasAppointmentBookingData(row)) continue;
      const dateKey = row.date;
      if (!sheets[dateKey]) continue;

      sheets[dateKey].appointmentRows.push({
        date: row.date || '',
        customer_name: row.customer_name || '',
        customer_contact: row.customer_contact || '',
        assigned_staff: row.assigned_staff || '',
        services: Array.isArray(row.services) ? JSON.stringify(row.services) : (row.services || ''),
        total_price: row.total_price ?? '',
      });
    }

    for (const row of walkInResult.data || []) {
      if (!hasWalkInBookingData(row)) continue;
      const dateKey = row.date;
      if (!sheets[dateKey]) continue;

      sheets[dateKey].walkInRows.push({
        date: row.date || '',
        customer_name: row.customer_name || '',
        services: Array.isArray(row.services) ? JSON.stringify(row.services) : (row.services || ''),
        total_price: row.total_price ?? getWalkInRevenue(row),
      });
    }

    // Create workbook with one sheet per day
    const workbook = xlsx.utils.book_new();

    for (const [date, payload] of Object.entries(sheets)) {
      const parseServicesForColumns = (servicesValue) => {
        // servicesValue is JSON-stringified array (we store it that way)
        let parsed = servicesValue;
        if (typeof servicesValue === 'string') {
          try {
            parsed = JSON.parse(servicesValue);
          } catch {
            parsed = [];
          }
        }
        const arr = Array.isArray(parsed) ? parsed : [];

        const categorySet = new Set();
        const serviceSet = new Set();

        for (const s of arr) {
          const category = s?.category;
          const name = s?.name || s?.title;
          if (category) categorySet.add(String(category));
          if (name) serviceSet.add(String(name));
        }

        return {
          categories: Array.from(categorySet).join(', '),
          services: Array.from(serviceSet).join(', '),
        };
      };

      // Appointments section as table
      // Appointment table (will occupy columns A-H)
      const appointmentTable = [
        // Title row (row 1) should NOT affect filter header row (row 2)
        ['Appointments', '', '', '', '', '', '', ''], // 9 columns to match the final merged layout
        ['type', 'date', 'customer name', 'customer contact', 'assigned staff', 'service categories', 'service names', 'total price'],
        ...payload.appointmentRows.map((r) => {
          const { categories, services } = parseServicesForColumns(r.services);
          return [
            'appointment',
            r.date,
            r.customer_name,
            r.customer_contact,
            r.assigned_staff,
            categories,
            services,
            r.total_price,
          ];
        }),
      ];

      // Walk-ins table (will occupy columns J-Q)
      const walkInTable = [
        // Title row placeholders so that filters remain on row 2
        ['Walk-ins', '', '', '', '', '', '', '', '', ''], // 9 columns to match the final merged layout
        ['type', 'date', 'customer name', 'customer contact', 'assigned staff', 'service categories', 'service names', 'total price'],
        ...payload.walkInRows.map((r) => {
          const { categories, services } = parseServicesForColumns(r.services);
          return [
            'walk-in',
            r.date,
            r.customer_name,
            '',
            '',
            categories,
            services,
            r.total_price,
          ];
        }),
      ];




      // Merge into a single sheet array side-by-side.
      // Requirement: walk-ins MUST start at column J (10th column).
      // Appointment table has 8 columns, so we insert 1 empty spacer column between them.
      // Final layout per row: [8 appointment cols] + [1 spacer] + [8 walk-in cols]
      const maxRows = Math.max(appointmentTable.length, walkInTable.length);
      const sheetMatrix = Array.from({ length: maxRows }, (_, idx) => {
        const aRow = appointmentTable[idx] || [];
        const wRow = walkInTable[idx] || [];
        const spacer = [''];
        return [...aRow, ...spacer, ...wRow];
      });

      // Add computed Total Price at the bottom of the lowest populated row.
      // Requirement: compute total for appointments and walk-ins.
      const appointmentTotalPrice = (payload.appointmentRows || []).reduce(
        (sum, r) => sum + (Number(r?.total_price || 0) || 0),
        0
      );

      const walkInTotalPrice = (payload.walkInRows || []).reduce(
        (sum, r) => sum + (Number(r?.total_price || 0) || 0),
        0
      );

      const grandTotalPrice = appointmentTotalPrice + walkInTotalPrice;

      // Append a summary row. Put appointment total under appointment total price column (H)
      // and walk-in total under walk-in total price column (Q).
      // Column mapping: appointment A-H (0..7), spacer I (8), walk-in J-Q (9..16)
      // Total price indices: appointment total price = H => 7, walk-in total price = Q => 16
      const summaryRow = Array.from({ length: 17 }, () => '');
      summaryRow[7] = appointmentTotalPrice;
      summaryRow[16] = walkInTotalPrice;

      sheetMatrix.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      sheetMatrix.push(['', '', '', '', '', '', 'Total Revenue', appointmentTotalPrice, '', '', '', '', '', '', '', 'Total Revenue', walkInTotalPrice]);
      sheetMatrix.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      sheetMatrix.push(['Grand Total', grandTotalPrice, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);



      const worksheet = xlsx.utils.aoa_to_sheet(sheetMatrix);
      xlsx.utils.book_append_sheet(workbook, worksheet, clampSheetName(date));
    }

    const buf = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const filename = `dashboard_analytics_${startDate}_to_${endDate}_appointment_logs.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(buf);
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}

