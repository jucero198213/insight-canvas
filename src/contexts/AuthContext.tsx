import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAzureAuth, AuthUser } from '@/hooks/useAzureAuth';
import { initializeMsal } from '@/lib/msal-config';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { loginWithAzure, logoutFromAzure, silentLogin, error, setError } = useAzureAuth();

  // Initialize MSAL and check for existing session
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeMsal();
        setIsInitialized(true);

        // Check for existing Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Validate session and get user info from backend
          const { data } = await supabase.functions.invoke("azure-auth", {
            body: { action: "get-user" },
          });

          if (data?.success && data.user) {
            setUser(data.user);
          } else {
            // Session invalid, clear it
            await supabase.auth.signOut();
          }
        } else {
          // Try silent Azure login
          const result = await silentLogin();
          if (result.success && result.user) {
            setUser(result.user);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session) {
          // Fetch user data on sign in
          setTimeout(async () => {
            const { data } = await supabase.functions.invoke("azure-auth", {
              body: { action: "get-user" },
            });
            if (data?.success && data.user) {
              setUser(data.user);
            }
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [silentLogin]);

  const login = async (): Promise<boolean> => {
    if (!isInitialized) {
      setError("Sistema de autenticação não inicializado");
      return false;
    }

    setIsLoading(true);
    try {
      const result = await loginWithAzure();
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      
      if (result.requiresRegistration) {
        setError(result.error || "Usuário não cadastrado no sistema");
      } else if (result.error) {
        setError(result.error);
      }
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin ?? false,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
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
