import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const verifierToken = localStorage.getItem('ssu_verifier_token');

  if (!verifierToken) {
    return <Navigate to="/verifier/login" replace />;
  }

  return <>{children}</>;
};
