import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import React, { Suspense } from "react";

import Index from "./pages/Index";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Suporte from "./pages/Suporte";
import Solucoes from "./pages/Solucoes";
import NotFound from "./pages/NotFound";

// Lazy-load auth-dependent routes so supabase client.ts is NOT evaluated
// during initial module load (prevents crash when env vars are missing)
const AuthenticatedApp = React.lazy(() => import("./components/auth/AuthenticatedRoutes"));

const queryClient = new QueryClient();

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TenantProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - NO supabase dependency */}
            <Route path="/" element={<Index />} />
            <Route path="/solucoes" element={<Solucoes />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/suporte" element={<Suporte />} />

            {/* Auth-dependent routes - lazy loaded with error boundary */}
            <Route path="/*" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <AuthenticatedApp />
                </Suspense>
              </ErrorBoundary>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TenantProvider>
  </QueryClientProvider>
);

export default App;
