import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPath, normalizeRole } from '../utils/authUtils';
import { AccessDenied } from './AccessDenied';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = normalizeRole(user.role);
    const permitted = allowedRoles
      .map((r) => normalizeRole(r))
      .filter(Boolean)
      .includes(userRole);

    if (!permitted) {
      const prefix = location.pathname.split('/')[1];
      const rolePrefix =
        userRole === 'ADMIN'
          ? 'admin'
          : userRole === 'DONOR'
            ? 'donor'
            : userRole === 'RECIPIENT'
              ? 'recipient'
              : '';

      if (rolePrefix && prefix !== rolePrefix) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
      }

      return <AccessDenied />;
    }
  }

  return <>{children}</>;
}
