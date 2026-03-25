import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Secures routes that require operator authentication.
 * Only allows access for: admin, staff, super admin
 * 
 * Usage:
 * <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export const ProtectedRoute = ({ children }) => {
  // Get user data from localStorage (set after successful login)
  const user = JSON.parse(localStorage.getItem('operator_user') || 'null');
  
  // Allowed roles for operators
  const ALLOWED_ROLES = ['admin', 'staff', 'super admin'];
  
  // Check if user exists and has valid role
  const isAuthorized = user && ALLOWED_ROLES.includes(user.role?.toLowerCase());
  
  if (!isAuthorized) {
    // Redirect to login if not authenticated/authorized
    return <Navigate to="/operators/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
