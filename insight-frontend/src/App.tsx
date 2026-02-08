import {
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import PowerBIReport from "./components/PowerBIEmbed";
import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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
      <PowerBIReport reportKey={reportKey || "financeiro"} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Entrada padrão SEMPRE vai para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Portal protegido */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <div /> {/* Portal real já está em outro arquivo */}
          </ProtectedRoute>
        }
      />

      {/* Relatórios (só acessíveis se autenticado) */}
      <Route
        path="/relatorios/:reportKey"
        element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        }
      />

      {/* Embed público controlado */}
      <Route path="/embed/:reportKey" element={<ReportPage />} />
    </Routes>
  );
}
