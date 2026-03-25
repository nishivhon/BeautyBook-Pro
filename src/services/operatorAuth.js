/**
 * Operator Authentication Utility
 * 
 * Handles login, logout, and session management for operators
 * (admin, staff, super admin)
 */

// Define valid operator roles
export const OPERATOR_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  SUPER_ADMIN: 'super admin'
};

/**
 * Login operator
 * Stores user data in localStorage
 * 
 * @param {string} email - Operator email
 * @param {string} password - Operator password
 * @param {string} role - Operator role (admin, staff, super admin)
 * @returns {boolean} - Success status
 */
export const loginOperator = (email, password, role = OPERATOR_ROLES.STAFF) => {
  try {
    // Validate inputs
    if (!email || !password) {
      console.error('Email and password are required');
      return false;
    }

    // Create user object
    const operatorUser = {
      email,
      role,
      loginTime: new Date().toISOString(),
      token: generateToken() // Simple token generation
    };

    // Store in localStorage
    localStorage.setItem('operator_user', JSON.stringify(operatorUser));
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

/**
 * Logout operator
 * Clears user data from localStorage
 */
export const logoutOperator = () => {
  try {
    localStorage.removeItem('operator_user');
    localStorage.removeItem('operator_token');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Get current operator session
 * @returns {object|null} - Operator user object or null
 */
export const getOperatorSession = () => {
  try {
    const user = localStorage.getItem('operator_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
};

/**
 * Check if operator is authenticated
 * @returns {boolean}
 */
export const isOperatorAuthenticated = () => {
  const user = getOperatorSession();
  return user !== null && user.email !== undefined;
};

/**
 * Check if operator has specific role
 * @param {string|string[]} roles - Role or array of roles to check
 * @returns {boolean}
 */
export const hasOperatorRole = (roles) => {
  const user = getOperatorSession();
  if (!user) return false;

  const rolesToCheck = Array.isArray(roles) ? roles : [roles];
  return rolesToCheck.includes(user.role?.toLowerCase());
};

/**
 * Simple token generation (for demo purposes)
 * In production, this should come from backend
 * @returns {string}
 */
const generateToken = () => {
  return `operator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate operator credentials
 * Currently a mock validation - connect to API for real validation
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} - User data if valid
 */
export const validateOperatorCredentials = async (email, password) => {
  // TODO: Replace with actual API call to backend
  // This is a mock implementation for demonstration
  
  try {
    // Mock operator database
    const operators = [
      { email: 'admin@beautybook.pro', password: 'admin123', role: OPERATOR_ROLES.SUPER_ADMIN },
      { email: 'staff@beautybook.pro', password: 'staff123', role: OPERATOR_ROLES.STAFF },
    ];

    const operator = operators.find(op => op.email === email && op.password === password);
    
    if (operator) {
      return {
        success: true,
        data: {
          email: operator.email,
          role: operator.role
        }
      };
    } else {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
