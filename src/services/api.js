// API service for making requests to the backend server
const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

// Appointments API
export const appointmentsAPI = {
  // Get all appointments
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    return handleResponse(response);
  },

  // Get appointment by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`);
    return handleResponse(response);
  },

  // Create new appointment
  create: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  },

  // Update appointment
  update: async (id, appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  },

  // Delete appointment
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Services API
export const servicesAPI = {
  // Get all services
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/services`);
    return handleResponse(response);
  },

  // Get services by category
  getByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/services/category/${category}`);
    return handleResponse(response);
  },

  // Get service by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    return handleResponse(response);
  },
};

// Users API
export const usersAPI = {
  // Get all users
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse(response);
  },

  // Get user by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return handleResponse(response);
  },

  // Create new user
  create: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Update user
  update: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};
