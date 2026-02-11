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

export const powerbiReports: Record<PowerBIReportKey, PowerBIReportConfig> = {
  financeiro: {
    workspaceId: requireEnv("POWERBI_WORKSPACE_ID_FINANCEIRO"),
    reportId: requireEnv("POWERBI_REPORT_ID_FINANCEIRO"),
  },

  dre: {
    workspaceId: requireEnv("POWERBI_WORKSPACE_ID_DRE"),
    reportId: requireEnv("POWERBI_REPORT_ID_DRE"),
  },

  compras: {
    workspaceId: requireEnv("POWERBI_WORKSPACE_ID_COMPRAS"),
    reportId: requireEnv("POWERBI_REPORT_ID_COMPRAS"),
  },
};
