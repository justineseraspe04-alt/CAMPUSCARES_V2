import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { AuthProvider } from './context/AuthContext';
// Admin
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { Donations as AdminDonations } from './pages/admin/Donations';
import { PendingDonations as AdminPendingDonations } from './pages/admin/PendingDonations';
import { Requests as AdminRequests } from './pages/admin/Requests';
import { Notifications as AdminNotifications } from './pages/admin/Notifications';
import { Inventory as AdminInventory } from './pages/admin/Inventory';
import { Distributions as AdminDistributions } from './pages/admin/Distributions';
import { Logs as AdminLogs } from './pages/admin/Logs';
import { DesignSystem as AdminDesignSystem } from './pages/admin/DesignSystem';
// Donor
import { Dashboard as DonorDashboard } from './pages/donor/Dashboard';
import { Donate as DonorDonate } from './pages/donor/Donate';
import { History as DonorHistory } from './pages/donor/History';
import { Notifications as DonorNotifications } from './pages/donor/Notifications';
// Recipient
import { Dashboard as RecipientDashboard } from './pages/recipient/Dashboard';
import { Inventory as RecipientInventory } from './pages/recipient/Inventory';
import { Request as RecipientRequest } from './pages/recipient/Request';
import { History as RecipientHistory } from './pages/recipient/History';
import { Recommendations as RecipientRecommendations } from './pages/recipient/Recommendations';
import { Notifications as RecipientNotifications } from './pages/recipient/Notifications';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations/pending"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPendingDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/distributions"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDistributions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/design-system"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDesignSystem />
              </ProtectedRoute>
            }
          />

          {/* Donor Routes */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DONOR']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/donate"
            element={
              <ProtectedRoute allowedRoles={['DONOR']}>
                <DonorDonate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/history"
            element={
              <ProtectedRoute allowedRoles={['DONOR']}>
                <DonorHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/notifications"
            element={
              <ProtectedRoute allowedRoles={['DONOR']}>
                <DonorNotifications />
              </ProtectedRoute>
            }
          />

          {/* Recipient Routes */}
          <Route
            path="/recipient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['RECIPIENT']}>
                <RecipientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/inventory"
            element={
              <ProtectedRoute allowedRoles={['RECIPIENT']}>
                <RecipientInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/request"
            element={
              <ProtectedRoute allowedRoles={['RECIPIENT']}>
                <RecipientRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/history"
            element={
              <ProtectedRoute allowedRoles={['RECIPIENT']}>
                <RecipientHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/recommendations"
            element={
              <ProtectedRoute allowedRoles={['RECIPIENT']}>
                <RecipientRecommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/notifications"
            element={
              <ProtectedRoute allowedRoles={['RECIPIENT']}>
                <RecipientNotifications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
