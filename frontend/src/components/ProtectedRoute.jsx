import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1118] flex flex-col justify-center items-center tech-grid">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Animated Spinner with Custom Green Color */}
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#4CAF50] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[#2E7D32] animate-spin animate-reverse"></div>
          <span className="text-[#4CAF50] font-bold text-xs tracking-widest animate-pulse">CHITTI</span>
        </div>
        <div className="mt-6 text-[#CBD5E1] text-sm font-medium tracking-wide animate-pulse">
          Establishing Secure IoT Session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
