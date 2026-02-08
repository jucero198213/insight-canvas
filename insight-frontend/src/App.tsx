import {
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import PowerBIReport from "./components/PowerBIEmbed";

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
      {!isEmbed && (
        <div style={{ marginBottom: "10px" }}>
          {/* espaço para toolbar futura */}
        </div>
      )}

      <div style={{ width: "100%", height: "100%" }}>
        <PowerBIReport reportKey={reportKey || "financeiro"} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/relatorios/financeiro" />} />

      {/* Uso interno */}
      <Route path="/relatorios/:reportKey" element={<ReportPage />} />

      {/* Uso externo (Lovable / iframe) */}
      <Route path="/embed/:reportKey" element={<ReportPage />} />
    </Routes>
  );
}
