import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  fallback = <div className="flex justify-center items-center h-screen">Access Denied</div> 
}) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen">Please log in</div>;
  }

  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return fallback;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
