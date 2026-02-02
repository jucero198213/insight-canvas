import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Centralizes post-auth redirect logic.
 * - After Microsoft redirect returns to origin (/), we send authenticated users to /portal (or /admin).
 * - Also keeps /login from showing "Autenticando..." forever once user is already authenticated.
 */
export function AuthRedirector() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;

    const path = location.pathname;
    const shouldRedirect = path === "/" || path === "/login";
    if (!shouldRedirect) return;

    navigate(isAdmin ? "/admin" : "/portal", { replace: true });
  }, [isAuthenticated, isAdmin, isLoading, location.pathname, navigate]);

  return null;
}
