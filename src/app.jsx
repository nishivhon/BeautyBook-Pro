import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/landpage'
import { Register } from './pages/register'
import { LogIn } from './pages/login'
import { logMagicLinksForTesting } from './services/magicLink'
import { AdminDashboard } from './pages/admin/admin_dashboard'
import { AdminDashboardServices } from './pages/admin/admin_services_dashboard'
import { AdminDashboardLiveStatus } from './pages/admin/admin_live_status_dashboard'
import { AdminDashboardStaffStatus } from './pages/admin/admin_staff_status_dashboard'
import SuperAdminDashboard from './pages/superadmin/super_admin_dashboard'
import SuperAdminUsersDashboard from './pages/superadmin/super_admin_users_dashboard'
import SuperAdminDatabaseDashboard from './pages/superadmin/super_admin_database_dashboard'
import SuperAdminSecurityDashboard from './pages/superadmin/super_admin_security_dashboard'
import SuperAdminLandingPageEditor from './pages/superadmin/super_admin_landpage_edit_dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  useEffect(() => {
    // Log magic links for testing on app load
    logMagicLinksForTesting()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/landpage" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
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
        <Route
          path="/superadmin/security"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminSecurityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/landing-page"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminLandingPageEditor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App