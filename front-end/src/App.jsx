import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/Layout/PageLayout';
import MapPage from './pages/MapPage';
import ReportFloodPage from './pages/ReportFloodPage';
import SupportRequestPage from './pages/SupportRequestPage';
import ManagementPage from './pages/ManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RescueManagementPage from './pages/RescueManagementPage';
import StationManagementPage from './pages/StationManagementPage';
import FloodManagementPage from './pages/FloodManagementPage';
import RainfallManagementPage from './pages/RainfallManagementPage';
import StationDetailPage from './pages/StationDetailPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes without Navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes inside PageLayout (Navbar + Map) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PageLayout />}>
              <Route path="/" element={<MapPage />} />
              <Route path="/stations/:id" element={<StationDetailPage />} />
              <Route path="/report" element={<ReportFloodPage />} />
              <Route path="/support" element={<SupportRequestPage />} />
              
              {/* ADMIN Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/management" element={<ManagementPage />} />
                <Route path="/management/rescue" element={<RescueManagementPage />} />
                <Route path="/management/stations" element={<StationManagementPage />} />
                <Route path="/management/floods" element={<FloodManagementPage />} />
                <Route path="/management/rainfall" element={<RainfallManagementPage />} />
                <Route path="/management/users" element={<UserManagementPage />} />
              </Route>
            </Route>
          </Route>
          
          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
