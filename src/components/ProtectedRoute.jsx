import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Secures routes that require operator authentication.
 * Only allows access for: admin, staff, super admin
 * 
 * Usage:
 * <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>} />
 * <Route path="/staff/dashboard" element={<ProtectedRoute requiredRole="staff"><Dashboard /></ProtectedRoute>} />
 * <Route path="/protected" element={<ProtectedRoute><Component /></ProtectedRoute>} /> (allows all operators)
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Get user data from localStorage (set after successful login)
  const user = JSON.parse(localStorage.getItem('operator_user') || 'null');
  
  // Allowed roles for operators
  const ALLOWED_ROLES = ['admin', 'staff', 'super admin'];
  
  // Check if user exists and has valid role
  const isAuthenticated = user && ALLOWED_ROLES.includes(user.role?.toLowerCase());
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/operators/login" replace />;
  }
  
  // If a specific role is required, check for it
  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    // Redirect to home if user doesn't have the required role
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
