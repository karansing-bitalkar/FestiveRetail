import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: Role;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to={`/dashboard/${user?.role}`} replace />;
  return <>{children}</>;
}
