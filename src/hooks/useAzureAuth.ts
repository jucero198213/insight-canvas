import { useState, useCallback } from "react";
import { msalInstance, loginRequest, isMsalInitialized } from "@/lib/msal-config";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticationResult } from "@azure/msal-browser";

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  cliente_id: string;
  cliente_nome?: string;
  roles: string[];
  is_admin: boolean;
}

interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  requiresRegistration?: boolean;
  registrationData?: {
    azure_oid: string;
    email: string;
    name: string;
  };
}

export function useAzureAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initiate login via redirect (not popup)
   * The result will be handled by handleRedirectPromise in AuthContext
   */
  const loginWithAzure = useCallback(async (): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);

    if (!isMsalInitialized()) {
      const errorMsg = "Sistema de autenticação não inicializado. Aguarde ou recarregue a página.";
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }

    try {
      console.info("[Auth] Initiating Azure login redirect...");
      
      // Use redirect instead of popup - this will navigate away from the page
      // Note: This may throw timeout errors in some sandboxed environments
      // but the redirect should still work
      msalInstance.loginRedirect({
        ...loginRequest,
        prompt: "select_account",
      });
      
      // This code may or may not execute - page should redirect to Microsoft
      // The timeout error is expected in iframe/sandboxed environments
      return { success: false, error: "Redirecting to Microsoft..." };
    } catch (err: unknown) {
      console.error("[Auth] Login redirect error:", err);
      
      // Check if this is a timeout error - the redirect may still work
      if (err instanceof Error && 'errorCode' in err) {
        const msalError = err as { errorCode: string; subError?: string };
        if (msalError.errorCode === "timed_out" || msalError.subError === "redirect_bridge_timeout") {
          console.warn("[Auth] Redirect timeout - this is expected in sandboxed environments. Redirect should still proceed.");
          // Don't show error to user - redirect might still work
          return { success: false, error: "Redirecionando..." };
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : "Falha ao iniciar login";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Process the authentication result from redirect
   * Called by AuthContext after handleRedirectPromise returns a result
   */
  const processAuthResult = useCallback(async (authResult: AuthenticationResult): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!authResult?.idToken) {
        throw new Error("No ID token in authentication result");
      }

      console.info("[Auth] Processing redirect result, calling backend...");

      // Call edge function to validate token and get/create user
      const { data, error: functionError } = await supabase.functions.invoke("azure-auth", {
        body: {
          action: "login",
          id_token: authResult.idToken,
          access_token: authResult.accessToken,
        },
      });

      if (functionError) {
        console.error("[Auth] Edge function error:", functionError);
        throw new Error(functionError.message || "Authentication failed");
      }

      console.info("[Auth] Backend response:", { 
        success: data?.success, 
        hasUser: !!data?.user, 
        hasToken: !!data?.session_token 
      });

      if (!data.success) {
        if (data.error === "registration_required") {
          return {
            success: false,
            requiresRegistration: true,
            registrationData: {
              azure_oid: data.azure_oid,
              email: data.email,
              name: data.name,
            },
            error: data.message,
          };
        }
        throw new Error(data.error || "Authentication failed");
      }

      // Set Supabase session with the token from backend
      if (data.session_token) {
        console.info("[Auth] Setting Supabase session...");
        
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session_token,
          refresh_token: data.refresh_token || "",
        });

        if (sessionError) {
          console.error("[Auth] Failed to set Supabase session:", sessionError);
          throw new Error("Failed to create local session");
        }

        console.info("[Auth] Supabase session created successfully");
      }

      console.info("[Auth] Login complete:", data.user?.email);
      
      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      console.error("[Auth] Process auth result error:", err);
      const errorMessage = err instanceof Error ? err.message : "Falha no login";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutFromAzure = useCallback(async (): Promise<void> => {
    try {
      console.info("[Auth] Logging out...");
      
      // Sign out from Supabase first
      await supabase.auth.signOut();
      console.info("[Auth] Supabase session cleared");

      // Sign out from Azure via redirect
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await msalInstance.logoutRedirect({
          account: accounts[0],
          postLogoutRedirectUri: window.location.origin,
        });
      }
    } catch (err) {
      console.error("[Auth] Logout error:", err);
    }
  }, []);

  const silentLogin = useCallback(async (): Promise<LoginResult> => {
    try {
      console.info("[Auth] Attempting silent token acquisition...");
      
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        console.info("[Auth] No cached Azure accounts found");
        return { success: false, error: "No active Azure session" };
      }

      // Try silent token acquisition
      const silentResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      if (!silentResponse?.idToken) {
        console.warn("[Auth] Silent acquisition returned no token");
        return { success: false, error: "Failed to acquire token silently" };
      }

      console.info("[Auth] Silent token acquired, validating with backend...");

      // Validate with backend
      const { data, error: functionError } = await supabase.functions.invoke("azure-auth", {
        body: {
          action: "login",
          id_token: silentResponse.idToken,
        },
      });

      if (functionError || !data.success) {
        console.warn("[Auth] Backend validation failed:", data?.error || functionError);
        return { success: false, error: data?.error || "Session validation failed" };
      }

      // Set Supabase session
      if (data.session_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session_token,
          refresh_token: data.refresh_token || "",
        });

        if (sessionError) {
          console.error("[Auth] Failed to set session after silent login:", sessionError);
          return { success: false, error: "Failed to create session" };
        }
      }

      console.info("[Auth] Silent login successful:", data.user?.email);
      return { success: true, user: data.user };
    } catch (err) {
      console.error("[Auth] Silent login failed:", err);
      return { success: false, error: "Silent login failed" };
    }
  }, []);

  return {
    loginWithAzure,
    processAuthResult,
    logoutFromAzure,
    silentLogin,
    isLoading,
    error,
    setError,
  };
}
