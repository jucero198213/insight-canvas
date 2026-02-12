import {
  Routes,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import PowerBIReport from "./components/PowerBIEmbed";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Portal from "./pages/Portal";

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
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Auth & Portal */}
      <Route path="/login" element={<Login />} />
      <Route path="/portal" element={<Portal />} />

      {/* Rotas existentes — NÃO ALTERADAS */}
      <Route path="/relatorios/:reportKey" element={<ReportPage />} />
      <Route path="/embed/:reportKey" element={<ReportPage />} />
    </Routes>
  );
}
