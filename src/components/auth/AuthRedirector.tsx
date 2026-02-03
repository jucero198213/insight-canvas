import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Component that handles automatic redirects based on authentication state:
 * - Authenticated users on public pages (/, /login, /forgot-password) are redirected to /portal
 * - Handles post-login navigation
 */
export function AuthRedirector() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait for auth to be ready
    if (isLoading) return;

    // Public routes where authenticated users should be redirected
    const publicRoutes = ['/', '/login', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (isAuthenticated && isPublicRoute) {
      // Redirect authenticated users to appropriate dashboard
      const redirectTo = isAdmin ? '/admin' : '/portal';
      console.info('[AuthRedirector] Redirecting authenticated user to:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, isAdmin, location.pathname, navigate]);

  // This component doesn't render anything
  return null;
}
