import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiToken } from '../../api/ApiToken';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = apiToken.getCurrentUser();
    if (!currentUser || !apiToken.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate]);

  if (!apiToken.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}