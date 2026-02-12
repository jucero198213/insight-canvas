import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error tracking for production
window.onerror = function(message, source, lineno, colno, error) {
  console.error('[Global Error]', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = function(event) {
  console.error('[Unhandled Promise Rejection]', event.reason);
};

console.info('[Main] Initializing application...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] Root element not found!');
} else {
  createRoot(rootElement).render(<App />);
  console.info('[Main] Render triggered');
}
