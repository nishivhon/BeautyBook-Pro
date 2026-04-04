import { querySupabase } from '../db/supabaseClient.js';

/**
 * Fetch all staff/stylists
 */
export const getAllStaff = async () => {
  try {
    console.log('[StaffService] Fetching all staff...');
    const result = await querySupabase('staffs', {
      select: 'id, names, status',
      order: 'names.asc',
    });
    console.log(`[StaffService] Successfully fetched ${result.length} staff members`);
    return result;
  } catch (error) {
    console.error('[StaffService] Error fetching all staff:', error.message);
    throw error;
  }
};

/**
 * Fetch staff by ID
 */
export const getStaffById = async (id) => {
  try {
    console.log(`[StaffService] Fetching staff ID: ${id}`);
    const result = await querySupabase('staffs', {
      select: 'id, names, status',
      filter: { id },
      limit: 1,
    });
    const staff = result[0] || null;
    console.log(`[StaffService] ${staff ? 'Found' : 'Not found'} staff with ID ${id}`);
    return staff;
  } catch (error) {
    console.error(`[StaffService] Error fetching staff by ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Fetch available staff (status = "avail")
 */
export const getAvailableStaff = async () => {
  try {
    console.log('[StaffService] Fetching available staff...');
    const result = await querySupabase('staffs', {
      select: 'id, names, status',
      filter: { status: 'avail' },
      order: 'names.asc',
    });
    console.log(`[StaffService] Found ${result.length} available staff members`);
    return result;
  } catch (error) {
    console.error('[StaffService] Error fetching available staff:', error.message);
    throw error;
  }
};

/**
 * Fetch all staff with availability info
 * Automatically adds "Any available" option at the beginning
 */
export const getStaffWithAnyOption = async () => {
  try {
    console.log('[StaffService] Fetching staff with "Any available" option...');
    const staff = await getAllStaff();
    
    // Transform to include necessary fields for frontend
    const transformed = staff.map(s => ({
      id: s.id,
      names: s.names,
      status: s.status,
      unavailable: s.status !== 'avail',
    }));
    
    console.log('[StaffService] Returning staff list with "Any available" option');
    return transformed;
  } catch (error) {
    console.error('[StaffService] Error fetching staff with any option:', error.message);
    throw error;
  }
};
