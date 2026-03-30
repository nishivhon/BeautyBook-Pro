import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/landpage'
import { Register } from './pages/register'
import { LogIn } from './pages/login'
import { AuthCallback } from './pages/auth-callback'
import { AdminDashboard } from './pages/admin/admin_dashboard'
import { AdminDashboardServices } from './pages/admin/admin_services_dashboard'
import { AdminDashboardLiveStatus } from './pages/admin/admin_live_status_dashboard'
import { AdminDashboardStaffStatus } from './pages/admin/admin_staff_status_dashboard'
import SuperAdminDashboard from './pages/superadmin/super_admin_dashboard'
import SuperAdminUsersDashboard from './pages/superadmin/super_admin_users_dashboard'
import SuperAdminDatabaseDashboard from './pages/superadmin/super_admin_database_dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { logMagicLinksForTesting } from './services/magicLink'

function App() {
  useEffect(() => {
    // Log test magic links to console for easy access during development
    logMagicLinksForTesting();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/operators/login" element={<LogIn />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/services"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/live-status"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardLiveStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/staff-status"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardStaffStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/users"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminUsersDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/database"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminDatabaseDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App