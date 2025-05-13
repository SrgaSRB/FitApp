import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();

  const expirationTime = token ? (jwtDecode<JwtPayload>(token).exp || 0) * 1000 : 0;


  if (!token || expirationTime < Date.now()) {
    localStorage.removeItem('token'); 
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;