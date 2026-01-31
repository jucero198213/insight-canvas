import { useState, useCallback } from "react";
import { msalInstance, loginRequest } from "@/lib/msal-config";
import { supabase } from "@/integrations/supabase/client";

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

  const loginWithAzure = useCallback(async (clienteId?: string): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use popup for login (better UX than redirect)
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      
      if (!loginResponse?.idToken) {
        throw new Error("No ID token received from Azure");
      }

      console.log("Azure login successful, validating with backend...");

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
          refresh_token: "", // Will be refreshed by Supabase
        });
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      console.error("Azure login error:", err);
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
