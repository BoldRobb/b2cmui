import { Navigate } from 'react-router-dom';
import { apiToken } from '../../api/ApiToken';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}: RoleProtectedRouteProps) {
  const isAuthenticated = apiToken.isAuthenticated();
  const isAdmin = apiToken.isAdmin();
  const userRole = isAdmin ? 'admin' : 'client';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}