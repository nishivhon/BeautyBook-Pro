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

  const buildWeeklyGraph = ({ startDate, endDate, appointmentRows = [], walkInRows = [] }) => {
    const start = createLocalDateFromISO(startDate);
    const end = createLocalDateFromISO(endDate);

    if (!start || !end) return [];

    const buckets = [];
    const bucketMap = new Map();

    for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, 1)) {
      const dateKey = formatISODate(cursor);
      const label = cursor.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const bucket = {
        date: dateKey,
        label,
        monthDay,
        appointments: 0,
        walkIns: 0,
        revenue: 0,
      };

      buckets.push(bucket);
      bucketMap.set(dateKey, bucket);
    }

    const applyAppointment = (row) => {
      const dateKey = extractRowDate(row);
      if (!dateKey || !bucketMap.has(dateKey)) return;

      const bucket = bucketMap.get(dateKey);
      const status = String(row?.status || '').trim().toLowerCase();
      const hasTotalPrice = row?.total_price !== null && row?.total_price !== undefined && String(row?.total_price).trim() !== '';

      if (status === 'done' && hasTotalPrice) {
        bucket.appointments += 1;
        bucket.revenue += toNumber(row?.total_price);
      }
    };

    const applyWalkIn = (row) => {
      const dateKey = extractRowDate(row);
      if (!dateKey || !bucketMap.has(dateKey)) return;

      const bucket = bucketMap.get(dateKey);
      bucket.walkIns += 1;
      bucket.revenue += extractWalkInServicesPrice(row?.services);
    };

    appointmentRows.forEach(applyAppointment);
    walkInRows.forEach(applyWalkIn);

    return buckets.map(({ date, label, monthDay, appointments, walkIns, revenue }) => ({
      date,
      label,
      monthDay,
      appointments,
      walkIns,
      revenue: Number(revenue.toFixed(2)),
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
        const graphStartDate = parseDateInput(req.query.graphStartDate) || null;
        const graphEndDate = parseDateInput(req.query.graphEndDate) || null;

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

        let weeklyGraph = [];
        if (graphStartDate && graphEndDate) {
          const [graphAppointmentResult, graphWalkInResult] = await Promise.all([
            supabase
              .from('appointment_logs')
              .select('*')
              .gte('date', graphStartDate)
              .lte('date', graphEndDate),
            supabase
              .from('walk_in_logs')
              .select('*')
              .gte('date', graphStartDate)
              .lte('date', graphEndDate),
          ]);

          if (graphAppointmentResult.error) {
            return res.status(500).json({ error: 'Failed to fetch graph appointment_logs summary', details: graphAppointmentResult.error.message });
          }

          if (graphWalkInResult.error) {
            return res.status(500).json({ error: 'Failed to fetch graph walk_in_logs summary', details: graphWalkInResult.error.message });
          }

          weeklyGraph = buildWeeklyGraph({
            startDate: graphStartDate,
            endDate: graphEndDate,
            appointmentRows: Array.isArray(graphAppointmentResult.data) ? graphAppointmentResult.data : [],
            walkInRows: Array.isArray(graphWalkInResult.data) ? graphWalkInResult.data : [],
          });
        }

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
          weeklyGraph,
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
