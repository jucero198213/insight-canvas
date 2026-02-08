import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Portal from "./pages/Portal";
import Login from "./pages/Login";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // ou spinner, se quiser
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* 🔑 Ponto de entrada */}
      <Route path="/" element={<Navigate to="/portal" replace />} />

      {/* 🔐 Login */}
      <Route path="/login" element={<Login />} />

      {/* 🔒 Portal protegido */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <Portal />
          </ProtectedRoute>
        }
      />

      {/* ❌ Qualquer rota inválida */}
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
}
