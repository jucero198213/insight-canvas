export type PowerBIReportKey =
  | "financeiro"
  | "dre"
  | "compras";

export type PowerBIReportConfig = {
  workspaceId: string;
  reportId: string;
  datasetId?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${name}`);
  }

  return value;
}

export const powerbiReports: Record<string, PowerBIReportConfig> = {
  financeiro: {
    workspaceId: process.env.POWERBI_WORKSPACE_ID!,
    reportId: process.env.POWERBI_REPORT_ID_FINANCEIRO!,
    datasetId: process.env.POWERBI_DATASET_ID_FINANCEIRO,
  },

  dre: {
    workspaceId: process.env.POWERBI_WORKSPACE_ID!,
    reportId: process.env.POWERBI_REPORT_ID_DRE!,
    datasetId: process.env.POWERBI_DATASET_ID_DRE,
  },

  compras: {
    workspaceId: process.env.POWERBI_WORKSPACE_ID!,
    reportId: process.env.POWERBI_REPORT_ID_COMPRAS!,
    datasetId: process.env.POWERBI_DATASET_ID_COMPRAS,
  },
};
