import { querySupabase } from '../db/supabaseClient.js';

/**
 * Fetch all services grouped by category
 */
export const getAllServices = async () => {
  try {
    console.log('[ServiceService] Fetching all services...');
    const result = await querySupabase('services', {
      select: 'id, category, service_name, description, price, est_time, availability',
      order: 'category.asc,service_name.asc',
    });
    console.log(`[ServiceService] Successfully fetched ${result.length} services`);
    return result;
  } catch (error) {
    console.error('[ServiceService] Error fetching all services:', error.message);
    throw error;
  }
};

/**
 * Fetch services by category
 */
export const getServicesByCategory = async (category) => {
  try {
    console.log(`[ServiceService] Fetching services for category: ${category}`);
    const result = await querySupabase('services', {
      select: 'id, category, service_name, description, price, est_time, availability',
      filter: { category },
      order: 'service_name.asc',
    });
    console.log(`[ServiceService] Found ${result.length} services in category ${category}`);
    return result;
  } catch (error) {
    console.error(`[ServiceService] Error fetching services by category ${category}:`, error.message);
    throw error;
  }
};

/**
 * Fetch single service by ID
 */
export const getServiceById = async (id) => {
  try {
    console.log(`[ServiceService] Fetching service ID: ${id}`);
    const result = await querySupabase('services', {
      select: 'id, category, service_name, description, price, est_time, availability',
      filter: { id },
      limit: 1,
    });
    const service = result[0] || null;
    console.log(`[ServiceService] ${service ? 'Found' : 'Not found'} service with ID ${id}`);
    return service;
  } catch (error) {
    console.error(`[ServiceService] Error fetching service by ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get all unique categories
 */
export const getServiceCategories = async () => {
  try {
    console.log('[ServiceService] Fetching all categories...');
    const result = await querySupabase('services', {
      select: 'category',
      order: 'category.asc',
    });
    // Remove duplicates
    const categories = [...new Set(result.map(row => row.category))];
    console.log(`[ServiceService] Found ${categories.length} categories:`, categories);
    return categories;
  } catch (error) {
    console.error('[ServiceService] Error fetching service categories:', error.message);
    throw error;
  }
};
