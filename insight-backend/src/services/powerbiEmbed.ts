import { powerbiReports, PowerBIReportKey } from "../config/powerbiReports";

export async function generateEmbedToken(reportKey: string) {
  const key = reportKey as PowerBIReportKey;

  if (!powerbiReports[key]) {
    throw new Error(`Relatório inválido: ${reportKey}`);
  }

  const reportConfig = powerbiReports[key];

  const accessToken = await getPowerBIAccessToken();

  const url = `https://api.powerbi.com/v1.0/myorg/groups/${reportConfig.workspaceId}/reports/${reportConfig.reportId}/GenerateToken`;

  const response = await axios.post(
    url,
    { accessLevel: "View" },
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
    embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportConfig.reportId}`,
  };
}
