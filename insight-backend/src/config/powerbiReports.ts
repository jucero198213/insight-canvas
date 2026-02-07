export type PowerBIReportConfig = {
  workspaceId: string;
  reportId: string;
  datasetId?: string;
};

export const powerbiReports: Record<string, PowerBIReportConfig> = {
  financeiro: {
    workspaceId: process.env.POWERBI_WORKSPACE_ID!,
    reportId: process.env.POWERBI_REPORT_ID!,
  },

  // Exemplos futuros:
  // operacional: {
  //   workspaceId: process.env.POWERBI_WORKSPACE_ID_OPERACIONAL!,
  //   reportId: process.env.POWERBI_REPORT_ID_OPERACIONAL!,
  // },

  // comercial: {
  //   workspaceId: process.env.POWERBI_WORKSPACE_ID_COMERCIAL!,
  //   reportId: process.env.POWERBI_REPORT_ID_COMERCIAL!,
  // },
};
