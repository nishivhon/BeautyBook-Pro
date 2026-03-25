import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/landpage'
import { Register } from './pages/register'
import { LogIn } from './pages/login'
import { AdminDashboard } from './pages/admin/admin_dashboard'
import { AdminDashboardServices } from './pages/admin/admin_services_dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
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
      </Routes>
    </Router>
  )
}

export default App