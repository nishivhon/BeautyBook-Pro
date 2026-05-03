import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/landpage'
import About from './pages/about'
import { Register } from './pages/register'
import { LogIn } from './pages/login'
import { logMagicLinksForTesting } from './services/magicLink'
import { AdminDashboard } from './pages/admin/admin_dashboard'
import { AdminDashboardServices } from './pages/admin/admin_services_dashboard'
import { AdminDashboardLiveStatus } from './pages/admin/admin_live_status_dashboard'
import { AdminDashboardStaffStatus } from './pages/admin/admin_staff_status_dashboard'
import SuperAdminDashboard from './pages/superadmin/super_admin_dashboard'
import SuperAdminUsersDashboard from './pages/superadmin/super_admin_users_dashboard'
import SuperAdminClientsDashboard from './pages/superadmin/super_admin_clients_dashboard'
import SuperAdminServicesDashboard from './pages/superadmin/super_admin_services_dashboard'
import SuperAdminLogsDashboard from './pages/superadmin/super_admin_logs_dashboard'
import SuperAdminSecurityDashboard from './pages/superadmin/super_admin_security_dashboard'
import SuperAdminLandingPageEditor from './pages/superadmin/super_admin_landpage_edit_dashboard'
import CustomerDashboard from './pages/customer/customer_dashboard'
import CustomerProfilePage from './pages/customer/customer_profile'
import CustomerHistoryPage from './pages/customer/customer_history'
import CustomerCouponsPage from './pages/customer/customer_coupons'
// Staff Dashboard routes hidden - all features moved to admin dashboard
// import StaffDashboard from './pages/staff/staff_dashboard'
// import StaffServices from './pages/staff/staff_service_dashboard'
// import StaffQueueDashboard from './pages/staff/staff_queue_dashboard'
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
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/operators/login" element={<LogIn />} />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/history"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/coupons"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerCouponsPage />
            </ProtectedRoute>
          }
        />
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
          path="/superadmin/clients"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminClientsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/services"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminServicesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/logs"
          element={
            <ProtectedRoute requiredRole="super admin">
              <SuperAdminLogsDashboard />
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
        {/* Staff Dashboard routes disabled - all features moved to admin dashboard */}
        {/* 
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/services"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/queue"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffQueueDashboard />
            </ProtectedRoute>
          }
        />
        */}
      </Routes>
    </Router>
  )
}

export default App