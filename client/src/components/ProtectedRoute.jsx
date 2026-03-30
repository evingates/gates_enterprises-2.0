import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // If authenticated but wrong role, route them to appropriate dashboard
    return <Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
