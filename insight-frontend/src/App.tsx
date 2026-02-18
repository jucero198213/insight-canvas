import {
  Routes,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import PowerBIReport from "./components/PowerBIEmbed";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import Solucoes from "./pages/Solucoes";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Suporte from "./pages/Suporte";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClientes from "./pages/admin/Clientes";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminRelatorios from "./pages/admin/Relatorios";
import AdminPermissoes from "./pages/admin/Permissoes";
import AdminLogs from "./pages/admin/Logs";

function ReportPage() {
  const { reportKey } = useParams();
  const location = useLocation();

  const isEmbed = location.pathname.startsWith("/embed");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: isEmbed ? 0 : "10px",
        background: isEmbed ? "#000" : "#1e1e1e",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <PowerBIReport reportKey={reportKey || "financeiro"} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />

        {/* Institutional pages */}
        <Route path="/solucoes" element={<Solucoes />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/suporte" element={<Suporte />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Portal */}
        <Route path="/portal" element={<Portal />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clientes" element={<AdminClientes />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="relatorios" element={<AdminRelatorios />} />
          <Route path="permissoes" element={<AdminPermissoes />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>

        {/* Power BI reports */}
        <Route path="/relatorios/:reportKey" element={<ReportPage />} />
        <Route path="/embed/:reportKey" element={<ReportPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}