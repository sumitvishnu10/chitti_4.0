import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy loading components for code splitting
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DeviceMonitor = lazy(() => import('./pages/DeviceMonitor'));
const SensorMonitoring = lazy(() => import('./pages/SensorMonitoring'));
const EventLogs = lazy(() => import('./pages/EventLogs'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Notifications = lazy(() => import('./pages/Notifications'));
const SystemHealth = lazy(() => import('./pages/SystemHealth'));
const Settings = lazy(() => import('./pages/Settings'));
const LiveCamera = lazy(() => import('./pages/LiveCamera'));

// Loader during code-split component fetching
const LazyLoader = () => (
  <div className="w-full h-[60vh] flex flex-col items-center justify-center">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#4CAF50] animate-spin"></div>
      <div className="absolute inset-1.5 rounded-full border-b-2 border-l-2 border-[#2E7D32] animate-spin animate-reverse"></div>
    </div>
    <p className="mt-4 text-xs text-slate-500 font-bold tracking-widest uppercase animate-pulse">
      Retrieving Dashboard Node...
    </p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LazyLoader />}>
      <Routes>
        
        {/* Public Authentication Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="live-camera" element={<LiveCamera />} />
          <Route path="device-monitor" element={<DeviceMonitor />} />
          <Route path="sensor-monitoring" element={<SensorMonitoring />} />
          <Route path="event-logs" element={<EventLogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="system-health" element={<SystemHealth />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}

export default App;
