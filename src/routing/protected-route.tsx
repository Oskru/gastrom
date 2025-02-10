import { Outlet, useNavigate } from 'react-router-dom';
import { isExpired } from 'react-jwt';
import { useEffect } from 'react';
import { useAuth } from '../hooks/use-auth.ts';

export default function ProtectedRoute() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || isExpired(token)) {
      logout();
    }
  }, [token, navigate, logout]);

  // If authenticated, render the child routes
  return <Outlet />;
}
