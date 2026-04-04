/**
 * Services API Client
 * Handles all API calls related to beauty services
 */

const API_BASE_URL = 'http://localhost:5000/api/services';

/**
 * Fetch all services
 */
export const fetchAllServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
};

/**
 * Fetch services by category
 * @param {string} category - Service category name
 */
export const fetchServicesByCategory = async (category) => {
  try {
    const encodedCategory = encodeURIComponent(category);
    const response = await fetch(`${API_BASE_URL}/category/${encodedCategory}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} services`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${category} services:`, error);
    throw error;
  }
};

/**
 * Fetch single service by ID
 * @param {number} serviceId - Service ID
 */
export const fetchServiceById = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${serviceId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching service ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Fetch all service categories
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
