import { Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";

// Azure Entra External ID Configuration
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_ENTRA_CLIENT_ID || "7dc948cd-49c3-4240-9655-9ea6082084bb",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_ENTRA_TENANT_ID || "8a55c57d-4aef-466b-9a36-e78099c46210"}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage", // More secure than localStorage
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
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

// Create and export MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
export async function initializeMsal(): Promise<void> {
  try {
    await msalInstance.initialize();
    
    // Handle redirect promise (for redirect login flow)
    const response = await msalInstance.handleRedirectPromise();
    if (response) {
      console.log("Redirect login successful");
    }
  } catch (error) {
    console.error("MSAL initialization error:", error);
    throw error;
  }
}
