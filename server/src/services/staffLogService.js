export const archiveDailyStaffLogs = async (supabase, phtDate = new Date()) => {
  const archiveDate = phtDate.toISOString().split('T')[0];

  const { data: staffs, error: staffError } = await supabase
    .from('staffs')
    .select('id, names, clock_in, clock_out, total_clients, done_clients, total_walk_in');

  if (staffError) {
    throw staffError;
  }

  const rows = (staffs || []).map((staff) => ({
    staff_id: String(staff.id),
    staff_name: staff.names,
    date: archiveDate,
    clock_in: staff.clock_in || null,
    clock_out: staff.clock_out || null,
    total_clients: Number(staff.total_clients) || 0,
    done_clients: Number(staff.done_clients) || 0,
    total_walk_in: Number(staff.total_walk_in) || 0,
  }));

  if (rows.length === 0) {
    return { archived: 0, rows: [] };
  }

  const { error: upsertError } = await supabase
    .from('staff_logs')
    .upsert(rows, { onConflict: 'staff_id,date' });

  if (upsertError) {
    throw upsertError;
  }

  return { archived: rows.length, rows };
};