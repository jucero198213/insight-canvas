import { useState, useCallback } from "react";
import { msalInstance, loginRequest, isMsalInitialized } from "@/lib/msal-config";
import { supabase } from "@/integrations/supabase/client";
import { BrowserAuthError } from "@azure/msal-browser";

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

const MAX_LOGIN_RETRIES = 2;
const RETRY_DELAY = 1500;

export function useAzureAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithAzure = useCallback(async (clienteId?: string, retryCount = 0): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);

    // Check MSAL initialization
    if (!isMsalInitialized()) {
      const errorMsg = "Sistema de autenticação não inicializado. Aguarde ou recarregue a página.";
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }

    try {
      console.info("[Auth] Starting Azure login popup...");
      
      // Use popup for login
      const loginResponse = await msalInstance.loginPopup({
        ...loginRequest,
        prompt: "select_account",
      });
      
      if (!loginResponse?.idToken) {
        throw new Error("No ID token received from Azure");
      }

      console.info("[Auth] Azure popup successful, got idToken");
      console.info("[Auth] Calling backend to validate token and create session...");

      // Call edge function to validate token and get/create user
      const { data, error: functionError } = await supabase.functions.invoke("azure-auth", {
        body: {
          action: "login",
          id_token: loginResponse.idToken,
          access_token: loginResponse.accessToken,
          cliente_id: clienteId,
        },
      });

      if (functionError) {
        console.error("[Auth] Edge function error:", functionError);
        throw new Error(functionError.message || "Authentication failed");
      }

      console.info("[Auth] Backend response:", { success: data?.success, hasUser: !!data?.user, hasToken: !!data?.session_token });

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
        console.info("[Auth] Setting Supabase session with backend token...");
        
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: data.session_token,
          refresh_token: data.refresh_token || "",
        });

        if (sessionError) {
          console.error("[Auth] Failed to set Supabase session:", sessionError);
          throw new Error("Failed to create local session");
        }

        console.info("[Auth] Supabase session created successfully:", !!sessionData.session);
      } else {
        console.warn("[Auth] No session_token received from backend");
      }

      console.info("[Auth] Login complete, user:", data.user?.email);
      
      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      console.error("[Auth] Login error:", err);
      
      // Handle timeout errors with retry
      if (
        err instanceof BrowserAuthError &&
        (err.errorCode === "monitor_window_timeout" || err.errorCode === "popup_window_error") &&
        retryCount < MAX_LOGIN_RETRIES
      ) {
        console.warn(`[Auth] Popup timeout, retrying (${retryCount + 1}/${MAX_LOGIN_RETRIES})...`);
        setIsLoading(false);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return loginWithAzure(clienteId, retryCount + 1);
      }
      
      // User cancelled popup
      if (err instanceof BrowserAuthError && err.errorCode === "user_cancelled") {
        setError(null);
        setIsLoading(false);
        return { success: false, error: "Login cancelado pelo usuário" };
      }
      
      const errorMessage = err instanceof Error ? err.message : "Falha no login";
      setError(errorMessage);
      setIsLoading(false);
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

      // Sign out from Azure (clear MSAL cache)
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await msalInstance.logoutPopup({
          account: accounts[0],
          postLogoutRedirectUri: window.location.origin,
        });
        console.info("[Auth] MSAL logout complete");
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
    logoutFromAzure,
    silentLogin,
    isLoading,
    error,
    setError,
  };
}
