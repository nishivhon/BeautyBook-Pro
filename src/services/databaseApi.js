// Database API service for fetching table schemas and information
const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

// Database API
export const databaseAPI = {
  // Get all public tables
  getAllTables: async () => {
    const response = await fetch(`${API_BASE_URL}/database/tables`);
    return handleResponse(response);
  },

  // Get specific tables schema and info
  getTablesInfo: async (tableNames) => {
    const params = new URLSearchParams();
    if (Array.isArray(tableNames)) {
      tableNames.forEach(name => params.append('tableNames', name));
    } else {
      params.append('tableNames', tableNames);
    }
    
    const response = await fetch(`${API_BASE_URL}/database/tables?${params.toString()}`);
    return handleResponse(response);
  },

  // Get table data with pagination and optional sorting
  getTableData: async (tableName, limit = 50, offset = 0, orderBy = null, orderDir = 'asc') => {
    const params = new URLSearchParams({
      tableName,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (orderBy) {
      params.append('orderBy', orderBy);
      params.append('orderDir', orderDir);
    }
    
    const response = await fetch(`${API_BASE_URL}/database/table-data?${params.toString()}`);
    return handleResponse(response);
  },
};
