import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAzureAuth, AuthUser } from '@/hooks/useAzureAuth';
import { initializeMsal, isMsalInitialized } from '@/lib/msal-config';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isMsalReady: boolean;
  error: string | null;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMsalReady, setIsMsalReady] = useState(false);
  const initStarted = useRef(false);
  const { loginWithAzure, logoutFromAzure, silentLogin, error, setError } = useAzureAuth();

  // Initialize MSAL once on mount
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initStarted.current) return;
    initStarted.current = true;

    const initialize = async () => {
      try {
        console.info("[AuthContext] Starting MSAL initialization...");
        
        // Initialize MSAL with retry logic
        await initializeMsal();
        setIsMsalReady(true);
        console.info("[AuthContext] MSAL ready");

        // Check for existing Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          console.info("[AuthContext] Existing Supabase session found, validating...");
          
          // Validate session and get user info from backend
          const { data } = await supabase.functions.invoke("azure-auth", {
            body: { action: "get-user" },
          });

          if (data?.success && data.user) {
            setUser(data.user);
            console.info("[AuthContext] Session validated, user:", data.user.email);
          } else {
            // Session invalid, clear it
            console.warn("[AuthContext] Session invalid, signing out");
            await supabase.auth.signOut();
          }
        } else if (isMsalInitialized()) {
          // Try silent Azure login only if MSAL is ready and no Supabase session
          console.info("[AuthContext] No Supabase session, attempting silent Azure login...");
          const result = await silentLogin();
          if (result.success && result.user) {
            setUser(result.user);
            console.info("[AuthContext] Silent login successful:", result.user.email);
          } else {
            console.info("[AuthContext] Silent login not available:", result.error);
          }
        }
      } catch (err) {
        console.error("[AuthContext] Initialization error:", err);
        // Still mark as ready so user can attempt manual login
        setIsMsalReady(true);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.info("[AuthContext] Auth state changed:", event, !!session);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session) {
          // Defer Supabase call to avoid deadlock
          setTimeout(async () => {
            try {
              const { data } = await supabase.functions.invoke("azure-auth", {
                body: { action: "get-user" },
              });
              if (data?.success && data.user) {
                setUser(data.user);
                console.info("[AuthContext] User loaded after sign in:", data.user.email);
              }
            } catch (err) {
              console.error("[AuthContext] Error fetching user after sign in:", err);
            }
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [silentLogin]);

  const login = async (): Promise<boolean> => {
    if (!isMsalReady) {
      setError("Sistema de autenticação ainda está carregando. Por favor, aguarde.");
      return false;
    }

    setIsLoading(true);
    try {
      console.info("[AuthContext] Starting login...");
      const result = await loginWithAzure();
      
      if (result.success && result.user) {
        setUser(result.user);
        console.info("[AuthContext] Login successful:", result.user.email);
        return true;
      }
      
      if (result.requiresRegistration) {
        setError(result.error || "Usuário não cadastrado no sistema");
      } else if (result.error) {
        setError(result.error);
      }
      
      return false;
    } catch (err) {
      console.error("[AuthContext] Login error:", err);
      setError(err instanceof Error ? err.message : "Erro no login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logoutFromAzure();
      setUser(null);
      console.info("[AuthContext] Logout complete");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin ?? false,
    isLoading,
    isMsalReady,
    error,
    login,
    logout,
    clearError,
  };

  console.debug("[AuthContext] State:", { 
    isAuthenticated: !!user, 
    isLoading, 
    isMsalReady, 
    userEmail: user?.email 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
