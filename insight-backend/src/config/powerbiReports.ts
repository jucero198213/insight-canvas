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

  dre: {
    workspaceId: process.env.POWERBI_WORKSPACE_ID_DRE!,
    reportId: process.env.POWERBI_REPORT_ID_DRE!,
  },

  compras: {
    workspaceId: process.env.POWERBI_WORKSPACE_ID_COMPRAS!,
    reportId: process.env.POWERBI_REPORT_ID_COMPRAS!,
  },
};

