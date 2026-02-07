import { Routes, Route, Navigate, useParams } from "react-router-dom";
import PowerBIReport from "./components/PowerBIEmbed";

function ReportPage() {
  const { reportKey } = useParams();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <PowerBIReport reportKey={reportKey || "financeiro"} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/relatorios/financeiro" />} />

      {/* Rota interna (uso normal) */}
      <Route path="/relatorios/:reportKey" element={<ReportPage />} />

      {/* 🔥 NOVA rota pública para iframe (Lovable) */}
      <Route path="/embed/:reportKey" element={<ReportPage />} />
    </Routes>
  );
}
