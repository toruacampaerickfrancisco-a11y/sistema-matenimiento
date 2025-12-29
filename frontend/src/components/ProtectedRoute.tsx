import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole, PermissionModule, PermissionAction } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  // Nuevas propiedades para permisos granulares
  requiredModule?: PermissionModule;
  requiredAction?: PermissionAction;
  requiredPermissions?: Array<{module: PermissionModule, action: PermissionAction}>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  requiredModule,
  requiredAction,
  requiredPermissions
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { hasPermission, hasPermissions, loading: permissionsLoading } = usePermissions();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación y permisos
  if (isLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado y está en login, redirigir al inicio
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Verificación de permisos granulares
  if (isAuthenticated && user) {
    // Si se especifica un módulo y acción específicos
    if (requiredModule && requiredAction) {
      if (!hasPermission(requiredModule, requiredAction)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }

    // Si se especifican múltiples permisos (todos deben cumplirse)
    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!hasPermissions(requiredPermissions)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }

    // Verificación de roles (fallback para compatibilidad)
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return <>{children}</>;
};