/**
 * Staff/Stylist API Client
 * Handles all API calls related to staff and stylist management
 */

const API_BASE_URL = 'http://localhost:5000/api/staffs';

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
 */
export const fetchStaffWithAnyOption = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/with-any`);
    if (!response.ok) {
      throw new Error('Failed to fetch staff');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching staff with any option:', error);
    throw error;
  }
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
