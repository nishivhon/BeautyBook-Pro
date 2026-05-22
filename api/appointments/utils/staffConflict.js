const PHT_TIME_ZONE = 'Asia/Manila';

const GENERIC_STAFF_LABELS = new Set([
  'any',
  'any available',
  'any available stylist',
]);

function normalizeText(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function resolveStaffLabel(staff) {
  if (!staff) {
    return '';
  }

  if (typeof staff === 'string' || typeof staff === 'number') {
    return String(staff).trim();
  }

  if (typeof staff === 'object') {
    return String(
      staff.name ||
      staff.names ||
      staff.full_name ||
      staff.staff_name ||
      staff.label ||
      staff.display_name ||
      staff.id ||
      staff.staff_id ||
      ''
    ).trim();
  }

  return String(staff).trim();
}

export function isGenericStaffLabel(staffLabel) {
  return GENERIC_STAFF_LABELS.has(normalizeText(staffLabel));
}

export function getPhtDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PHT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getPhtTimeString(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: PHT_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function parseTimeToMinutes(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    const timeValue = getPhtTimeString(value);
    const [hours, minutes] = timeValue.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  if (raw.includes('T') || raw.includes('-')) {
    const parsedDate = new Date(raw);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parseTimeToMinutes(parsedDate);
    }
  }

  const timeMatch = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?$/);
  if (!timeMatch) {
    return null;
  }

  let hours = Number.parseInt(timeMatch[1], 10);
  const minutes = Number.parseInt(timeMatch[2], 10);
  const period = timeMatch[3]?.toUpperCase() || null;

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return (hours * 60) + minutes;
}

export function getServiceDurationMinutes(services = []) {
  if (!Array.isArray(services)) {
    return 0;
  }

  return services.reduce((total, service) => {
    if (!service || typeof service !== 'object') {
      return total;
    }

    const duration =
      service.est_time ??
      service.estimated_time ??
      service.duration_minutes ??
      service.duration ??
      service.minutes ??
      service.time ??
      0;

    const numericDuration = Number(duration);
    return total + (Number.isFinite(numericDuration) ? numericDuration : 0);
  }, 0);
}

function getRowStartMinutes(row) {
  if (!row) {
    return null;
  }

  if (row.time_slot) {
    return parseTimeToMinutes(row.time_slot);
  }

  if (row.created_at) {
    return parseTimeToMinutes(row.created_at);
  }

  return null;
}

function getRowDurationMinutes(row) {
  if (!row) {
    return 0;
  }

  const slotServiceDuration = Number(row.service_est_time);
  if (Number.isFinite(slotServiceDuration) && slotServiceDuration > 0) {
    return slotServiceDuration;
  }

  const durationFromServices = getServiceDurationMinutes(row.services);
  if (durationFromServices > 0) {
    return durationFromServices;
  }

  const fallbackDuration =
    row.total_duration_minutes ??
    row.duration_minutes ??
    row.est_time ??
    row.estimated_time ??
    row.duration ??
    0;

  const numericDuration = Number(fallbackDuration);
  return Number.isFinite(numericDuration) ? numericDuration : 0;
}

function normalizeRowStaff(rowStaff) {
  return normalizeText(resolveStaffLabel(rowStaff));
}

function buildConflictPayload(row, source) {
  const startMinutes = getRowStartMinutes(row);
  const durationMinutes = getRowDurationMinutes(row);

  return {
    source,
    id: row?.id || null,
    date: row?.date || null,
    staff: resolveStaffLabel(row?.assigned_staff),
    startTime: row?.time_slot || row?.created_at || null,
    durationMinutes,
    startMinutes,
    endMinutes: Number.isFinite(startMinutes) ? startMinutes + durationMinutes : null,
    status: row?.status || null,
  };
}

export async function findStaffScheduleConflict({ supabase, date, startTime, durationMinutes, staff }) {
  const staffLabel = resolveStaffLabel(staff);
  const normalizedStaff = normalizeText(staffLabel);

  if (!supabase || !date || !startTime || !durationMinutes || !normalizedStaff || isGenericStaffLabel(staffLabel)) {
    return null;
  }

  const requestedStartMinutes = parseTimeToMinutes(startTime);
  if (!Number.isFinite(requestedStartMinutes)) {
    return null;
  }

  const requestedEndMinutes = requestedStartMinutes + Number(durationMinutes);

  const [{ data: slots, error: slotsError }, { data: walkIns, error: walkInsError }] = await Promise.all([
    supabase
      .from('available_slots')
      .select('id, date, time_slot, assigned_staff, services, service_est_time, availability, status, created_at')
      .eq('date', date)
      .order('time_slot', { ascending: true }),
    supabase
      .from('walk_in_logs')
      .select('id, date, created_at, assigned_staff, services, availability, status')
      .eq('date', date)
      .order('created_at', { ascending: true }),
  ]);

  if (slotsError) {
    throw new Error(`Failed to inspect existing appointments: ${slotsError.message}`);
  }

  if (walkInsError) {
    throw new Error(`Failed to inspect walk-ins: ${walkInsError.message}`);
  }

  const activeRows = [
    ...(Array.isArray(slots) ? slots : []).map((row) => ({ ...row, source: 'appointment' })),
    ...(Array.isArray(walkIns) ? walkIns : []).map((row) => ({ ...row, source: 'walk-in' })),
  ];

  for (const row of activeRows) {
    const rowStatus = String(row.status || '').trim().toLowerCase();
    const rowIsActive = row.availability === false || rowStatus === 'pending' || rowStatus === 'current';

    if (!rowIsActive) {
      continue;
    }

    const rowStaffLabel = normalizeRowStaff(row.assigned_staff);
    if (!rowStaffLabel || rowStaffLabel !== normalizedStaff) {
      continue;
    }

    const rowStartMinutes = getRowStartMinutes(row);
    const rowDurationMinutes = getRowDurationMinutes(row);

    if (!Number.isFinite(rowStartMinutes) || rowDurationMinutes <= 0) {
      continue;
    }

    const rowEndMinutes = rowStartMinutes + rowDurationMinutes;
    const overlaps = requestedStartMinutes < rowEndMinutes && requestedEndMinutes > rowStartMinutes;

    if (overlaps) {
      return buildConflictPayload(row, row.source);
    }
  }

  return null;
}