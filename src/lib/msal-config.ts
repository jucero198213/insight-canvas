import { Configuration, LogLevel, PublicClientApplication, BrowserAuthError } from "@azure/msal-browser";

// Azure Entra External ID Configuration
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_ENTRA_CLIENT_ID || "7dc948cd-49c3-4240-9655-9ea6082084bb",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_ENTRA_TENANT_ID || "8a55c57d-4aef-466b-9a36-e78099c46210"}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error("[MSAL]", message);
            return;
          case LogLevel.Warning:
            console.warn("[MSAL]", message);
            return;
          case LogLevel.Info:
            console.info("[MSAL]", message);
            return;
          case LogLevel.Verbose:
            console.debug("[MSAL]", message);
            return;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Login request scopes
export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

// Singleton MSAL instance - created once at module load
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialization state
let initializationPromise: Promise<void> | null = null;
let isInitialized = false;

/**
 * Initialize MSAL with retry logic for timeout errors
 * Must be called before any authentication operations
 */
export async function initializeMsal(retryCount = 0): Promise<void> {
  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise;
  }

  // Return immediately if already initialized
  if (isInitialized) {
    return Promise.resolve();
  }

  const MAX_RETRIES = 2;
  const RETRY_DELAY = 1000;

  initializationPromise = (async () => {
    try {
      console.info("[MSAL] Starting initialization...");
      
      // Initialize the MSAL instance
      await msalInstance.initialize();
      console.info("[MSAL] Instance initialized successfully");
      
      // Handle any pending redirect responses
      const response = await msalInstance.handleRedirectPromise();
      if (response) {
        console.info("[MSAL] Redirect login response received");
      }
      
      isInitialized = true;
      console.info("[MSAL] Initialization complete");
    } catch (error) {
      console.error("[MSAL] Initialization error:", error);
      
      // Reset promise so we can retry
      initializationPromise = null;
      
      // Check if it's a timeout error and we can retry
      if (
        error instanceof BrowserAuthError &&
        error.errorCode === "monitor_window_timeout" &&
        retryCount < MAX_RETRIES
      ) {
        console.warn(`[MSAL] Timeout error, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return initializeMsal(retryCount + 1);
      }
      
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Check if MSAL is initialized
 */
export function isMsalInitialized(): boolean {
  return isInitialized;
}

/**
 * Reset initialization state (for testing/error recovery)
 */
export function resetMsalInitialization(): void {
  initializationPromise = null;
  isInitialized = false;
}
