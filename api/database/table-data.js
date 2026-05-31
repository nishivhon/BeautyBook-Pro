import { createClient } from '@supabase/supabase-js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const parseDateInput = (value) => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
  };

  const createLocalDateFromISO = (value) => {
    const parsed = parseDateInput(value);
    if (!parsed) return null;

    const [year, month, day] = parsed.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatISODate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const addDays = (date, amount) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  };

  const getMondayStart = (date) => {
    const start = new Date(date);
    const dayOfWeek = start.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    start.setDate(start.getDate() + offset);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const extractRowDate = (row) => {
    if (!row?.date) return null;
    const parsed = createLocalDateFromISO(row.date);
    return parsed ? formatISODate(parsed) : null;
  };

  const extractWalkInServicesPrice = (servicesValue) => {
    if (!servicesValue) return 0;

    let services = servicesValue;
    if (typeof servicesValue === 'string') {
      try {
        services = JSON.parse(servicesValue);
      } catch (error) {
        return 0;
      }
    }

    if (Array.isArray(services)) {
      return services.reduce((sum, item) => sum + toNumber(item?.price), 0);
    }

    if (typeof services === 'object') {
      return toNumber(services?.price);
    }

    return 0;
  };

  const normalizeServiceEntries = (servicesValue) => {
    if (!servicesValue) return [];

    let services = servicesValue;
    if (typeof servicesValue === 'string') {
      try {
        services = JSON.parse(servicesValue);
      } catch (error) {
        return [];
      }
    }

    if (Array.isArray(services)) {
      return services
        .map((item) => {
          if (!item) return null;
          if (typeof item === 'string') {
            return { name: item, category: 'Uncategorized' };
          }

          const name = item?.name || item?.title || item?.service || '';
          const category = item?.category || item?.category_name || 'Uncategorized';
          return name ? { name, category } : null;
        })
        .filter(Boolean);
    }

    if (typeof services === 'object') {
      const name = services?.name || services?.title || services?.service || '';
      const category = services?.category || services?.category_name || 'Uncategorized';
      return name ? [{ name, category }] : [];
    }

    if (typeof services === 'string' && services.trim()) {
      return [{ name: services.trim(), category: 'Uncategorized' }];
    }

    return [];
  };

  const buildServiceMetrics = (rows = []) => {
    const categoryMap = new Map();

    rows.forEach((row) => {
      const services = normalizeServiceEntries(row?.services);
      services.forEach((service) => {
        const categoryName = String(service.category || 'Uncategorized').trim() || 'Uncategorized';
        const serviceName = String(service.name || 'Service').trim() || 'Service';
        const categoryEntry = categoryMap.get(categoryName) || { category: categoryName, totalBooked: 0, serviceCounts: new Map() };

        categoryEntry.totalBooked += 1;
        categoryEntry.serviceCounts.set(serviceName, (categoryEntry.serviceCounts.get(serviceName) || 0) + 1);
        categoryMap.set(categoryName, categoryEntry);
      });
    });

    return Array.from(categoryMap.values())
      .map((entry) => {
        let topServiceName = '';
        let topServiceCount = 0;

        entry.serviceCounts.forEach((count, name) => {
          if (count > topServiceCount || (count === topServiceCount && name.localeCompare(topServiceName) < 0)) {
            topServiceName = name;
            topServiceCount = count;
          }
        });

        return {
          category: entry.category,
          totalBooked: entry.totalBooked,
          topService: topServiceName
            ? { name: topServiceName, count: topServiceCount }
            : null,
        };
      })
      .sort((left, right) => left.category.localeCompare(right.category));
  };

  const normalizeStaffName = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  };

  const buildStaffMetrics = ({ appointmentRows = [], walkInRows = [] }) => {
    const staffMap = new Map();

    const getBucket = (staffName) => {
      const normalizedName = normalizeStaffName(staffName) || 'Unassigned';
      if (!staffMap.has(normalizedName)) {
        staffMap.set(normalizedName, {
          staff: normalizedName,
          appointments: 0,
          walkIns: 0,
          revenue: 0,
        });
      }

      return staffMap.get(normalizedName);
    };

    appointmentRows.forEach((row) => {
      const status = String(row?.status || '').trim().toLowerCase();
      const hasTotalPrice = row?.total_price !== null && row?.total_price !== undefined && String(row?.total_price).trim() !== '';

      if (status !== 'done' || !hasTotalPrice) return;

      const bucket = getBucket(row?.assigned_staff || row?.staff || row?.staff_name);
      bucket.appointments += 1;
      bucket.revenue += toNumber(row?.total_price);
    });

    walkInRows.forEach((row) => {
      const bucket = getBucket(row?.assigned_staff || row?.staff || row?.staff_name);
      bucket.walkIns += 1;
      bucket.revenue += extractWalkInServicesPrice(row?.services);
    });

    return Array.from(staffMap.values())
      .map((entry) => ({
        ...entry,
        revenue: Number(entry.revenue.toFixed(2)),
      }))
      .sort((left, right) => {
        if (right.revenue !== left.revenue) return right.revenue - left.revenue;
        if (right.appointments !== left.appointments) return right.appointments - left.appointments;
        if (right.walkIns !== left.walkIns) return right.walkIns - left.walkIns;
        return left.staff.localeCompare(right.staff);
      });
  };

  const buildReportGraph = ({ startDate, endDate, appointmentRows = [], walkInRows = [] }) => {
    const start = createLocalDateFromISO(startDate);
    const end = createLocalDateFromISO(endDate);

    if (!start || !end) {
      return { mode: 'daily', points: [] };
    }

    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
    const mode = totalDays > 14 ? 'weekly' : 'daily';
    const bucketSize = mode === 'weekly' ? 7 : 1;
    const buckets = [];

    for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, bucketSize)) {
      const bucketStart = new Date(cursor);
      const bucketEnd = new Date(cursor);
      bucketEnd.setDate(bucketEnd.getDate() + bucketSize - 1);

      if (bucketEnd > end) {
        bucketEnd.setTime(end.getTime());
      }

      const labelFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
      const rangeLabel = `${labelFormatter.format(bucketStart)} - ${labelFormatter.format(bucketEnd)}`;

      buckets.push({
        startDate: formatISODate(bucketStart),
        endDate: formatISODate(bucketEnd),
        date: formatISODate(bucketStart),
        label: mode === 'weekly'
          ? bucketStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : bucketStart.toLocaleDateString('en-US', { weekday: 'short' }),
        monthDay: mode === 'weekly'
          ? rangeLabel
          : bucketStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        appointments: 0,
        walkIns: 0,
        revenue: 0,
      });
    }

    const getBucketIndex = (rowDate) => {
      const current = createLocalDateFromISO(rowDate);
      if (!current) return -1;

      const diffDays = Math.floor((current.getTime() - start.getTime()) / 86400000);
      if (diffDays < 0) return -1;

      return mode === 'weekly' ? Math.floor(diffDays / 7) : diffDays;
    };

    const applyAppointment = (row) => {
      const bucketIndex = getBucketIndex(extractRowDate(row));
      if (bucketIndex < 0 || bucketIndex >= buckets.length) return;

      const status = String(row?.status || '').trim().toLowerCase();
      const hasTotalPrice = row?.total_price !== null && row?.total_price !== undefined && String(row?.total_price).trim() !== '';

      if (status === 'done' && hasTotalPrice) {
        buckets[bucketIndex].appointments += 1;
        buckets[bucketIndex].revenue += toNumber(row?.total_price);
      }
    };

    const applyWalkIn = (row) => {
      const bucketIndex = getBucketIndex(extractRowDate(row));
      if (bucketIndex < 0 || bucketIndex >= buckets.length) return;

      buckets[bucketIndex].walkIns += 1;
      buckets[bucketIndex].revenue += extractWalkInServicesPrice(row?.services);
    };

    appointmentRows.forEach(applyAppointment);
    walkInRows.forEach(applyWalkIn);

    return {
      mode,
      points: buckets.map(({ date, label, monthDay, appointments, walkIns, revenue, startDate: bucketStartDate, endDate: bucketEndDate }) => ({
        date,
        label,
        monthDay,
        rangeLabel: monthDay,
        startDate: bucketStartDate,
        endDate: bucketEndDate,
        appointments,
        walkIns,
        revenue: Number(revenue.toFixed(2)),
      })),
    };
  };

  const buildDailyReport = ({ startDate, endDate, appointmentRows = [], walkInRows = [] }) => {
    const start = createLocalDateFromISO(startDate);
    const end = createLocalDateFromISO(endDate);

    if (!start || !end) {
      return [];
    }

    const days = [];
    for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, 1)) {
      days.push({
        date: formatISODate(cursor),
        label: cursor.toLocaleDateString('en-US', { weekday: 'short' }),
        monthDay: cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rangeLabel: cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        appointments: 0,
        walkIns: 0,
        revenue: 0,
      });
    }

    const getDayIndex = (rowDate) => {
      const current = createLocalDateFromISO(rowDate);
      if (!current) return -1;

      const diffDays = Math.floor((current.getTime() - start.getTime()) / 86400000);
      if (diffDays < 0 || diffDays >= days.length) return -1;
      return diffDays;
    };

    appointmentRows.forEach((row) => {
      const dayIndex = getDayIndex(extractRowDate(row));
      if (dayIndex < 0) return;

      const status = String(row?.status || '').trim().toLowerCase();
      const hasTotalPrice = row?.total_price !== null && row?.total_price !== undefined && String(row?.total_price).trim() !== '';

      if (status === 'done' && hasTotalPrice) {
        days[dayIndex].appointments += 1;
        days[dayIndex].revenue += toNumber(row?.total_price);
      }
    });

    walkInRows.forEach((row) => {
      const dayIndex = getDayIndex(extractRowDate(row));
      if (dayIndex < 0) return;

      days[dayIndex].walkIns += 1;
      days[dayIndex].revenue += extractWalkInServicesPrice(row?.services);
    });

    return days.map((entry) => ({
      ...entry,
      revenue: Number(entry.revenue.toFixed(2)),
    }));
  };

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    );

      const summary = String(req.query.summary || '').trim();

      if (summary === 'superadmin-dashboard') {
        const startDate = parseDateInput(req.query.startDate) || parseDateInput(req.query.endDate) || new Date().toISOString().slice(0, 10);
        const endDate = parseDateInput(req.query.endDate) || startDate;
        if (startDate > endDate) {
          return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
        }

        const [appointmentResult, walkInResult] = await Promise.all([
          supabase
            .from('appointment_logs')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate),
          supabase
            .from('walk_in_logs')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate),
        ]);

        if (appointmentResult.error) {
          return res.status(500).json({ error: 'Failed to fetch appointment_logs summary', details: appointmentResult.error.message });
        }

        if (walkInResult.error) {
          return res.status(500).json({ error: 'Failed to fetch walk_in_logs summary', details: walkInResult.error.message });
        }

        const appointmentRows = Array.isArray(appointmentResult.data) ? appointmentResult.data : [];
        const walkInRows = Array.isArray(walkInResult.data) ? walkInResult.data : [];
        const bookedRows = [...appointmentRows, ...walkInRows];

        const graphResult = buildReportGraph({
          startDate,
          endDate,
          appointmentRows,
          walkInRows,
        });
        const dailyReport = buildDailyReport({
          startDate,
          endDate,
          appointmentRows,
          walkInRows,
        });

        const successfulAppointmentRows = appointmentRows.filter((row) => {
          const status = String(row?.status || '').trim().toLowerCase();
          const hasTotalPrice = row?.total_price !== null && row?.total_price !== undefined && String(row?.total_price).trim() !== '';
          return status === 'done' && hasTotalPrice;
        });

        // Appointments: count only successful rows and use total_price from appointment_logs.
        const appointmentRevenue = successfulAppointmentRows.reduce((sum, row) => sum + toNumber(row?.total_price), 0);
        // Walk-ins: use services JSON price values from walk_in_logs.
        const walkInRevenue = walkInRows.reduce((sum, row) => sum + extractWalkInServicesPrice(row?.services), 0);
        const totalRevenue = appointmentRevenue + walkInRevenue;

        return res.status(200).json({
          summary: 'superadmin-dashboard',
          range: { startDate, endDate },
          appointments: successfulAppointmentRows.length,
          walkIns: walkInRows.length,
          revenue: Number(totalRevenue.toFixed(2)),
          serviceMetrics: buildServiceMetrics(bookedRows),
          staffMetrics: buildStaffMetrics({
            appointmentRows: successfulAppointmentRows,
            walkInRows,
          }),
          graphMode: graphResult.mode,
          weeklyGraph: graphResult.points,
          dailyReport,
        });
      }

    const { tableName, limit = 50, offset = 0, orderBy = null, orderDir = 'asc' } = req.query;

    if (!tableName) {
      return res.status(400).json({ error: 'tableName query parameter is required' });
    }

    console.log(`[Database] Fetching data from ${tableName} (limit: ${limit}, offset: ${offset}, orderBy: ${orderBy})`);

    // Build query
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact' });

    // Add ordering if specified
    if (orderBy) {
      query = query.order(orderBy, { ascending: orderDir === 'asc' });
    }

    // Fetch data with pagination
    const { data, error, count } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error(`[Database] Error fetching data from ${tableName}:`, error);
      return res.status(500).json({ 
        error: `Failed to fetch data from ${tableName}`, 
        details: error.message 
      });
    }

    console.log(`[Database] Got ${data?.length || 0} rows from ${tableName}`);

    res.status(200).json({
      tableName,
      data: data || [],
      total: count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

  } catch (error) {
    console.error(`[Database] Error:`, error.message);
    res.status(500).json({ error: 'Failed to fetch table data', details: error.message });
  }
};
