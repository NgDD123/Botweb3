// src/components/pages/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './trade.css'

const ProtectedRoute = () => {
  const { user, hasPaid } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!hasPaid) {
    return <Navigate to="/checkout" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
