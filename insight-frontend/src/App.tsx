import {
  Routes,
  Route,
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
      <div style={{ width: "100%", height: "100%" }}>
        <PowerBIReport reportKey={reportKey || "financeiro"} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* NÃO REDIRECIONA ROOT */}
      <Route path="/relatorios/:reportKey" element={<ReportPage />} />
      <Route path="/embed/:reportKey" element={<ReportPage />} />

      {/* Fallback simples */}
      <Route
        path="*"
        element={
          <div style={{ padding: 40 }}>
            <h1>AnalyticsPro</h1>
            <p>Aplicação de relatórios</p>
          </div>
        }
      />
    </Routes>
  );
}
