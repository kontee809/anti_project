import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLayout from './components/Layout/PageLayout';
import MapPage from './pages/MapPage';
import ReportFloodPage from './pages/ReportFloodPage';
import SupportRequestPage from './pages/SupportRequestPage';
import ManagementPage from './pages/ManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/report" element={<ReportFloodPage />} />
          <Route path="/support" element={<SupportRequestPage />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="/management/users" element={<UserManagementPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
