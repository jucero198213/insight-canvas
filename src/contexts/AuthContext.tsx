import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAzureAuth, AuthUser } from '@/hooks/useAzureAuth';
import { isMsalInitialized, getRedirectResult, clearRedirectResult } from '@/lib/msal-config';

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

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: number | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = window.setTimeout(() => reject(new Error(`${label}_timeout`)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer !== undefined) window.clearTimeout(timer);
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMsalReady, setIsMsalReady] = useState(false);
  const initStarted = useRef(false);
  const { loginWithAzure, processAuthResult, logoutFromAzure, silentLogin, error, setError } = useAzureAuth();

  // Handle redirect result and session on mount
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initStarted.current) return;
    initStarted.current = true;

    const initialize = async () => {
      try {
        console.info("[AuthContext] Starting authentication check...");
        
        // MSAL should already be initialized by main.tsx
        // Check if there's a pending redirect result
        const redirectResult = getRedirectResult();
        const msalReady = isMsalInitialized();

        // Important: never block UI indefinitely if MSAL init flag is false for any reason.
        // main.tsx already attempts to initialize MSAL before rendering.
        setIsMsalReady(true);
        console.info("[AuthContext] MSAL ready:", msalReady, "redirect result:", !!redirectResult);

        // If we have a redirect result, process it first
        if (redirectResult && (redirectResult.idToken || redirectResult.accessToken)) {
          console.info("[AuthContext] Processing redirect login result...");
          try {
            // Never allow a hung backend call to freeze the UI.
            const result = await withTimeout(
              processAuthResult(redirectResult),
              15000,
              "process_redirect"
            );
            clearRedirectResult(); // Clear after processing
            
            if (result.success && result.user) {
              setUser(result.user);
              console.info("[AuthContext] Redirect login successful:", result.user.email);
              setIsLoading(false);
              return; // Done - user is authenticated via redirect
            } else if (result.requiresRegistration) {
              setError(result.error || "Usuário não cadastrado no sistema");
            } else if (result.error) {
              setError(result.error);
            }
          } catch (processError) {
            console.error("[AuthContext] Error processing redirect result:", processError);
            setError(processError instanceof Error ? processError.message : "Erro ao processar login");
          } finally {
            // Critical: ALWAYS clear the cached redirect result to avoid loops.
            clearRedirectResult();
          }
          // Always clear loading after processing redirect, even on error
          setIsLoading(false);
          return;
        }

        // Check for existing Supabase session
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          "get_session"
        );
        
        if (session?.access_token) {
          console.info("[AuthContext] Existing Supabase session found, validating...");
          
          // Validate session and get user info from backend
          const { data } = await withTimeout(
            supabase.functions.invoke("azure-auth", {
              body: { action: "get-user" },
            }),
            8000,
            "get_user"
          );

          if (data?.success && data.user) {
            setUser(data.user);
            console.info("[AuthContext] Session validated, user:", data.user.email);
          } else {
            // Session invalid, clear it
            console.warn("[AuthContext] Session invalid, signing out");
            await withTimeout(supabase.auth.signOut(), 8000, "sign_out");
          }
        } else if (msalReady) {
          // Try silent Azure login only if MSAL is ready and no Supabase session
          console.info("[AuthContext] No Supabase session, attempting silent Azure login...");
          const result = await withTimeout(silentLogin(), 8000, "silent_login");
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
              const { data } = await withTimeout(
                supabase.functions.invoke("azure-auth", {
                  body: { action: "get-user" },
                }),
                8000,
                "get_user_after_signin"
              );
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
  }, [processAuthResult, silentLogin, setError]);

  const login = async (): Promise<boolean> => {
    if (!isMsalReady) {
      setError("Sistema de autenticação ainda está carregando. Por favor, aguarde.");
      return false;
    }

    setIsLoading(true);
    try {
      console.info("[AuthContext] Starting login redirect...");
      // This will redirect to Microsoft - page will navigate away
      await loginWithAzure();
      // If we get here, redirect was initiated
      return false; // Will complete after redirect back
    } catch (err) {
      console.error("[AuthContext] Login error:", err);
      setError(err instanceof Error ? err.message : "Erro no login");
      setIsLoading(false);
      return false;
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
