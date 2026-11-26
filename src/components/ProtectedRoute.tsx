import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Chuyển sang /login và lưu lại location hiện tại vào state để quay lại sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
