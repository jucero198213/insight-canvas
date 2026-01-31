// Multi-tenant SaaS Data Types

export interface Cliente {
  id_cliente: string;
  nome_cliente: string;
  logo_url: string | null;
  cor_primaria: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
}

export interface Usuario {
  id_usuario: string;
  id_cliente: string;
  email: string;
  nome: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  role?: 'admin' | 'user';
}

// New authenticated user type (from Azure Entra)
export interface AuthenticatedUser {
  id: string;
  email: string;
  nome: string;
  cliente_id: string;
  cliente_nome?: string;
  roles: string[];
  is_admin: boolean;
}

export interface RelatorioPowerBI {
  id_relatorio: string;
  id_cliente: string;
  workspace_id: string;
  report_id: string;
  dataset_id: string;
  nome_relatorio: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
}

export interface PermissaoUsuarioRelatorio {
  id_permissao: string;
  id_usuario: string;
  id_relatorio: string;
}

export interface LogAcesso {
  id_log: string;
  id_usuario: string;
  id_cliente: string;
  id_relatorio: string | null;
  tipo_evento: 'login' | 'logout' | 'acesso_relatorio';
  data_hora_acesso: string;
  ip_origem: string;
}

export interface TenantConfig {
  nome: string;
  logo_url: string | null;
  cor_primaria: string;
  cor_secundaria?: string;
}

export interface EmbedConfig {
  accessToken: string;
  embedUrl: string;
  reportId: string;
  tokenExpiry: string;
}
