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

      console.info("[Auth] Azure login successful, validating with backend...");

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
        throw new Error(functionError.message || "Authentication failed");
      }

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

      // Set Supabase session if we got a token
      if (data.session_token) {
        await supabase.auth.setSession({
          access_token: data.session_token,
          refresh_token: "",
        });
      }

      console.info("[Auth] Login complete");
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
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Sign out from Azure (clear MSAL cache)
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await msalInstance.logoutPopup({
          account: accounts[0],
          postLogoutRedirectUri: window.location.origin,
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  const silentLogin = useCallback(async (): Promise<LoginResult> => {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        return { success: false, error: "No active Azure session" };
      }

      // Try silent token acquisition
      const silentResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      if (!silentResponse?.idToken) {
        return { success: false, error: "Failed to acquire token silently" };
      }

      // Validate with backend
      const { data, error: functionError } = await supabase.functions.invoke("azure-auth", {
        body: {
          action: "login",
          id_token: silentResponse.idToken,
        },
      });

      if (functionError || !data.success) {
        return { success: false, error: data?.error || "Session validation failed" };
      }

      if (data.session_token) {
        await supabase.auth.setSession({
          access_token: data.session_token,
          refresh_token: "",
        });
      }

      return { success: true, user: data.user };
    } catch (err) {
      console.error("Silent login failed:", err);
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
