import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import { Role } from '@/types';

interface Props {
  children: ReactNode;
  role: Role;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== role) {
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }

  return <>{children}</>;
}
