import axios from "axios";
import { getPowerBIAccessToken } from "./powerbiAuth";
import { powerbiReports } from "../config/powerbiReports";

export async function generateEmbedToken(reportKey: string) {
  const reportConfig = powerbiReports[reportKey];

  if (!reportConfig) {
    throw new Error("Relatório não encontrado");
  }

  const accessToken = await getPowerBIAccessToken();

  const url = `https://api.powerbi.com/v1.0/myorg/groups/${reportConfig.workspaceId}/reports/${reportConfig.reportId}/GenerateToken`;

  const response = await axios.post(
    url,
    {
      accessLevel: "View",
    },
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
  };
}
