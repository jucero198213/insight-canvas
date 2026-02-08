import {
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import PowerBIReport from "./components/PowerBIEmbed";
import { useAuth } from "@/contexts/AuthContext";

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
      {!isEmbed && <div style={{ marginBottom: "10px" }} />}

      <div style={{ width: "100%", height: "100%" }}>
        <PowerBIReport reportKey={reportKey || "financeiro"} />
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Entrada principal */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/portal" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Relatórios internos (NUNCA públicos) */}
      <Route
        path="/relatorios/:reportKey"
        element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        }
      />

      {/* Embed técnico (iframe) */}
      <Route path="/embed/:reportKey" element={<ReportPage />} />
    </Routes>
  );
}
