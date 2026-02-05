import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthRedirector } from "@/components/auth/AuthRedirector";
 import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Portal from "./pages/Portal";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClientes from "./pages/admin/Clientes";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminRelatorios from "./pages/admin/Relatorios";
import AdminPermissoes from "./pages/admin/Permissoes";
import AdminLogs from "./pages/admin/Logs";
import Solucoes from "./pages/Solucoes";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Suporte from "./pages/Suporte";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TenantProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthRedirector />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/solucoes" element={<Solucoes />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/suporte" element={<Suporte />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
               <Route path="/portal" element={
                 <ProtectedRoute>
                   <Portal />
                 </ProtectedRoute>
               } />
              
              {/* Admin Routes */}
               <Route path="/admin" element={
                 <ProtectedRoute requireAdmin>
                   <AdminLayout />
                 </ProtectedRoute>
               }>
                <Route index element={<AdminDashboard />} />
                <Route path="clientes" element={<AdminClientes />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
                <Route path="relatorios" element={<AdminRelatorios />} />
                <Route path="permissoes" element={<AdminPermissoes />} />
                <Route path="logs" element={<AdminLogs />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </TenantProvider>
  </QueryClientProvider>
);

export default App;
