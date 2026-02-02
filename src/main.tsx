import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMsal } from "@/lib/msal-config";

// Initialize MSAL BEFORE React renders to capture redirect response
// This must happen before React Router touches the URL
initializeMsal()
  .then(() => {
    console.info("[Main] MSAL initialized, rendering app...");
  })
  .catch((err) => {
    console.error("[Main] MSAL initialization error:", err);
  })
  .finally(() => {
    // Always render the app, even if MSAL fails
    createRoot(document.getElementById("root")!).render(<App />);
  });
