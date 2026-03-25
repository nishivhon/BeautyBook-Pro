/**
 * Magic Link Authentication Utility
 * 
 * Generates and validates magic links for operator access
 * Only super admin can generate magic links
 */

/**
 * Generate a magic link token
 * @param {string} email - Operator email
 * @returns {string} - Magic token
 */
export const generateMagicToken = (email = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return btoa(`${email}|${timestamp}|${random}`).replace(/=/g, '');
};

/**
 * Validate magic link token
 * @param {string} token - Magic token from URL
 * @returns {boolean} - Valid or not
 */
export const validateMagicToken = (token) => {
  if (!token) return false;
  
  try {
    // Decode token
    const decoded = atob(token);
    const parts = decoded.split('|');
    
    // Token format: email|timestamp|random
    if (parts.length !== 3) return false;
    
    const timestamp = parseInt(parts[1]);
    const now = Date.now();
    
    // Token expires after 24 hours
    const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in ms
    
    return (now - timestamp) < TOKEN_EXPIRY;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * Get email from magic token
 * @param {string} token - Magic token
 * @returns {string|null} - Email or null
 */
export const getEmailFromToken = (token) => {
  try {
    const decoded = atob(token);
    const email = decoded.split('|')[0];
    return email || null;
  } catch (error) {
    return null;
  }
};

/**
 * List of temporary magic links for testing
 * Format: { token: string, email: string, role: string, createdAt: date }
 * 
 * SUPER ADMIN will create these via admin dashboard
 * For now, these are development/test tokens
 */
export const TEMPORARY_MAGIC_LINKS = [
  {
    token: 'YWRtaW5AYmVhdXR5Ym9vay5wcm98MTc0NTYwMDAwMDB8YWJjZGVmMTIz',
    email: 'admin@beautybook.pro',
    role: 'super admin',
    createdAt: new Date(2026, 2, 25),
    expiresAt: new Date(2026, 3, 25),
    description: '🔐 Super Admin Test Link'
  },
  {
    token: 'c3RhZmZAYmVhdXR5Ym9vay5wcm98MTc0NTYwMDAwMDB8eHl6OTg3NjU0',
    email: 'staff@beautybook.pro',
    role: 'staff',
    createdAt: new Date(2026, 2, 25),
    expiresAt: new Date(2026, 3, 25),
    description: '✂️ Staff Test Link'
  }
];

/**
 * Verify if magic link is valid (for testing/demo)
 * In production, this would query a database
 */
export const isMagicLinkValid = (token) => {
  // Check if token is in temporary list
  const tempLink = TEMPORARY_MAGIC_LINKS.find(link => link.token === token);
  
  if (tempLink) {
    // Check expiration
    return new Date() <= tempLink.expiresAt;
  }
  
  // Fallback to timestamp-based validation
  return validateMagicToken(token);
};

/**
 * Get magic link info (email, role) from token
 */
export const getMagicLinkInfo = (token) => {
  const tempLink = TEMPORARY_MAGIC_LINKS.find(link => link.token === token);
  
  if (tempLink) {
    return {
      email: tempLink.email,
      role: tempLink.role
    };
  }
  
  // Try to extract from token
  const email = getEmailFromToken(token);
  return email ? { email, role: 'staff' } : null;
};
