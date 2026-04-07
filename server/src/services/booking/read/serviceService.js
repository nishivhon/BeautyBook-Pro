import { querySupabase } from '../../../db/supabaseClient.js';

/**
 * Fetch all services grouped by category
 */
export const getAllServices = async () => {
  try {
    const result = await querySupabase('services', {
      select: 'id, category, service_name, description, price, est_time, availability',
      order: 'category.asc,service_name.asc',
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch services by category
 */
export const getServicesByCategory = async (category) => {
  try {
    const result = await querySupabase('services', {
      select: 'id, category, service_name, description, price, est_time, availability',
      filter: { category },
      order: 'service_name.asc',
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch single service by ID
 */
export const getServiceById = async (id) => {
  try {
    const result = await querySupabase('services', {
      select: 'id, category, service_name, description, price, est_time, availability',
      filter: { id },
      limit: 1,
    });
    const service = result[0] || null;
    return service;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all unique categories
 */
export const getServiceCategories = async () => {
  try {
    const result = await querySupabase('services', {
      select: 'category',
      order: 'category.asc',
    });
    // Remove duplicates
    const categories = [...new Set(result.map(row => row.category))];
    return categories;
  } catch (error) {
    throw error;
  }
};
