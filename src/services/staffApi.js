/**
 * Staff/Stylist API Client
 * Handles all API calls related to staff and stylist management
 */

const API_BASE_URL = '/api/staffs';

/**
 * Fetch all staff members
 */
export const fetchAllStaff = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch staff');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all staff:', error);
    throw error;
  }
};

/**
 * Fetch all staff with "Any available" option included
 * Returns: { any: {...}, staff: [...] }
 *
 * Implements a short in-memory cache and in-flight dedupe so multiple
 * components requesting staff in quick succession won't trigger duplicate
 * network requests or cause constant "Loading stylists..." flashes.
 */
let _staffCache = null;
let _staffCacheTs = 0;
let _staffInflight = null;
const STAFF_CACHE_TTL = 60 * 1000; // 60 seconds

export const fetchStaffWithAnyOption = async () => {
  try {
    const now = Date.now();

    // Return cached value when fresh
    if (_staffCache && (now - _staffCacheTs) < STAFF_CACHE_TTL) {
      return _staffCache;
    }

    // If there's an inflight request, return the same promise
    if (_staffInflight) return _staffInflight;

    _staffInflight = (async () => {
      const response = await fetch(`${API_BASE_URL}/with-any`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await response.json();
      _staffCache = data;
      _staffCacheTs = Date.now();
      _staffInflight = null;
      return data;
    })();

    return _staffInflight;
  } catch (error) {
    console.error('Error fetching staff with any option:', error);
    _staffInflight = null;
    throw error;
  }
};

/**
 * Clear in-memory staff cache (useful when staff list changes on server)
 */
export const clearStaffCache = () => {
  _staffCache = null;
  _staffCacheTs = 0;
};

/**
 * Fetch only available staff
 */
export const fetchAvailableStaff = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available staff');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available staff:', error);
    throw error;
  }
};

/**
 * Fetch single staff by ID
 * @param {number} staffId - Staff ID
 */
export const fetchStaffById = async (staffId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${staffId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch staff');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching staff ${staffId}:`, error);
    throw error;
  }
};
