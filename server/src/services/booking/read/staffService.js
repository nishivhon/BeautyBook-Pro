import { querySupabase } from '../../../db/supabaseClient.js';

/**
 * Fetch all staff/stylists
 */
export const getAllStaff = async () => {
  try {
    const result = await querySupabase('staffs', {
      select: 'id, names, status',
      order: 'names.asc',
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch staff by ID
 */
export const getStaffById = async (id) => {
  try {
    const result = await querySupabase('staffs', {
      select: 'id, names, status',
      filter: { id },
      limit: 1,
    });
    const staff = result[0] || null;
    return staff;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch available staff (status = "avail")
 */
export const getAvailableStaff = async () => {
  try {
    const result = await querySupabase('staffs', {
      select: 'id, names, status',
      filter: { status: 'avail' },
      order: 'names.asc',
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all staff with availability info
 * Automatically adds "Any available" option at the beginning
 */
export const getStaffWithAnyOption = async () => {
  try {
    const staff = await getAllStaff();
    
    // Transform to include necessary fields for frontend
    const transformed = staff.map(s => ({
      id: s.id,
      names: s.names,
      status: s.status,
      unavailable: s.status !== 'avail',
    }));
    
    return transformed;
  } catch (error) {
    throw error;
  }
};
