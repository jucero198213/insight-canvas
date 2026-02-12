import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthRedirector } from "@/components/auth/AuthRedirector";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Login from "@/pages/Login";

import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Portal from "@/pages/Portal";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClientes from "@/pages/admin/Clientes";
import AdminUsuarios from "@/pages/admin/Usuarios";
import AdminRelatorios from "@/pages/admin/Relatorios";
import AdminPermissoes from "@/pages/admin/Permissoes";
import AdminLogs from "@/pages/admin/Logs";
import NotFound from "@/pages/NotFound";

export default function AuthenticatedRoutes() {
  return (
    <AuthProvider>
      <AuthRedirector />
      <Routes>
        
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
    </AuthProvider>
  );
}
