import axios from "axios";
import { getPowerBIAccessToken } from "./powerbiAuth";
import { powerbiReports, PowerBIReportKey } from "../config/powerbiReports";

export async function generateEmbedToken(reportKey: string) {
  const key = reportKey as PowerBIReportKey;

  if (!powerbiReports[key]) {
    throw new Error(`Relatório inválido: ${reportKey}`);
  }

  const reportConfig = powerbiReports[key];

  const accessToken = await getPowerBIAccessToken();

  const url = `https://api.powerbi.com/v1.0/myorg/groups/${reportConfig.workspaceId}/reports/${reportConfig.reportId}/GenerateToken`;

  // Prepara o corpo da requisição de token
  const requestBody: any = { accessLevel: "View" };
  
  // Se o datasetId estiver configurado, ele deve ser enviado para garantir o acesso aos dados
  if (reportConfig.datasetId) {
    requestBody.datasetId = reportConfig.datasetId;
  }

  const response = await axios.post(
    url,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return {
    ...response.data,
    reportId: reportConfig.reportId,
    // A URL de embed correta para o Power BI Embedded deve incluir o groupId (workspaceId)
    embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportConfig.reportId}&groupId=${reportConfig.workspaceId}`,
  };
}
