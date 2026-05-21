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
    
    // Set password change date on first login (for admin/super admin only)
    if (['admin', 'super admin'].includes(role?.toLowerCase())) {
      if (!localStorage.getItem('last_password_change_date')) {
        setPasswordChangeDate();
      }
    }
    
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
      { email: 'admin@beautybook.pro', password: 'admin123', role: OPERATOR_ROLES.ADMIN },
      { email: 'staff@beautybook.pro', password: 'staff123', role: OPERATOR_ROLES.STAFF },
      { email: 'superadmin@beautybook.pro', password: 'superadmin123', role: OPERATOR_ROLES.SUPER_ADMIN },
      { email: 'customer@beautybook.pro', password: 'customer123', role: 'customer' }, // Temporary customer account
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

/**
 * Check if password reminder is needed (15 days for admin/super admin)
 * Returns true if password hasn't been changed in 15+ days
 * 
 * @returns {boolean} - True if reminder is needed
 */
export const isPasswordReminderNeeded = () => {
  try {
    const user = getOperatorSession();
    
    // Only for admin and super admin
    if (!user || !['admin', 'super admin'].includes(user.role?.toLowerCase())) {
      return false;
    }

    const lastPasswordChangeDate = localStorage.getItem('last_password_change_date');
    
    // If no last password change date stored, don't show reminder yet
    if (!lastPasswordChangeDate) {
      return false;
    }

    const lastChange = new Date(lastPasswordChangeDate);
    const now = new Date();
    const daysSinceChange = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));

    // Show reminder after 15 days
    return daysSinceChange >= 15;
  } catch (error) {
    console.error('Password reminder check error:', error);
    return false;
  }
};

/**
 * Set password change date (call this when password is successfully changed)
 */
export const setPasswordChangeDate = () => {
  try {
    const now = new Date().toISOString();
    localStorage.setItem('last_password_change_date', now);
    return true;
  } catch (error) {
    console.error('Password change date setting error:', error);
    return false;
  }
};

/**
 * Get days until password change is recommended (shows how many days until 15 days)
 * 
 * @returns {number|null} - Days remaining or null if no reminder
 */
export const getDaysSincePasswordChange = () => {
  try {
    const lastPasswordChangeDate = localStorage.getItem('last_password_change_date');
    
    if (!lastPasswordChangeDate) {
      return null;
    }

    const lastChange = new Date(lastPasswordChangeDate);
    const now = new Date();
    const daysSinceChange = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));

    return daysSinceChange;
  } catch (error) {
    console.error('Days since password change calculation error:', error);
    return null;
  }
};
