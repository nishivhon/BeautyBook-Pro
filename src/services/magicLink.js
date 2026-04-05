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
 * 
 * IMPORTANT: These tokens are regenerated dynamically with fresh timestamps
 * on component mount to ensure they don't expire.
 */
export const TEMPORARY_MAGIC_LINKS = (() => {
  // Generate fresh tokens with current timestamps
  const now = Date.now();
  
  const adminToken = btoa(`admin@beautybook.pro|${now}|abcdef123xyz`).replace(/=/g, '');
  const superAdminToken = btoa(`superadmin@beautybook.pro|${now}|superadmin456xyz`).replace(/=/g, '');
  const staffToken = btoa(`staff@beautybook.pro|${now}|xyz987654abc`).replace(/=/g, '');
  
  return [
    {
      token: adminToken,
      email: 'admin@beautybook.pro',
      role: 'admin',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      description: '🔐 Admin Test Link'
    },
    {
      token: superAdminToken,
      email: 'superadmin@beautybook.pro',
      role: 'super admin',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      description: '👑 Super Admin Test Link'
    },
    {
      token: staffToken,
      email: 'staff@beautybook.pro',
      role: 'staff',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      description: '✂️ Staff Test Link'
    }
  ];
})();

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
 * Get test magic link URLs for current session
 * These are regenerated with fresh timestamps on each app load
 * 
 * @returns {array} - Array of { email, role, url, token }
 */
export const getTestMagicLinks = () => {
  const baseUrl = `${window.location.origin}/operators/login`;
  
  return TEMPORARY_MAGIC_LINKS.map(link => ({
    email: link.email,
    role: link.role,
    token: link.token,
    url: `${baseUrl}?token=${link.token}`,
    description: link.description
  }));
};

/**
 * Log test magic links to console for easy access
 * Call this from your app initialization
 */
export const logMagicLinksForTesting = () => {
  const links = getTestMagicLinks();
  console.group('🔐 BeautyBook Pro - Magic Links for Testing');
  console.log('These links are regenerated with fresh timestamps on each app load.');
  console.log('');
  
  links.forEach(link => {
    console.log(`%c${link.description}`, 'color: #dd901d; font-weight: bold; font-size: 12px;');
    console.log(`Email: ${link.email}`);
    console.log(`Password: ${link.email === 'admin@beautybook.pro' ? 'admin123' : link.email === 'superadmin@beautybook.pro' ? 'superadmin123' : 'staff123'}`);
    console.log(`Full URL: ${link.url}`);
    console.log('');
  });
  
  console.groupEnd();
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
