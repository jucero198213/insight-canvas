// Multi-tenant SaaS Data Types
// Updated to match database schema

export interface Cliente {
  id: string;
  nome: string;
  logo_url: string | null;
  cor_primaria: string;
  status: 'ativo' | 'inativo';
  workspace_id?: string; // Power BI workspace ID
  created_at: string;
  updated_at: string;
}

export interface Usuario {
  id: string;
  auth_user_id: string;
  cliente_id: string;
  email: string;
  nome: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

// Authenticated user from session
export interface AuthenticatedUser {
  id: string;
  email: string;
  nome: string;
  cliente_id: string;
  cliente_nome?: string;
  roles: string[];
  is_admin: boolean;
}

export interface Relatorio {
  id: string;
  cliente_id: string;
  nome: string;
  descricao?: string;
  report_id: string; // Power BI report ID
  dataset_id?: string; // Power BI dataset ID
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export interface Permissao {
  id: string;
  usuario_id: string;
  relatorio_id: string;
  created_at: string;
}

export interface LogAcesso {
  id: string;
  usuario_id: string;
  cliente_id: string;
  relatorio_id: string | null;
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

// ============================================
// Legacy types for backward compatibility with mock data
// These will be removed once we migrate to real database
// ============================================

/** @deprecated Use Cliente instead */
export interface ClienteLegacy {
  id_cliente: string;
  nome_cliente: string;
  logo_url: string | null;
  cor_primaria: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
}

/** @deprecated Use Usuario instead */
export interface UsuarioLegacy {
  id_usuario: string;
  id_cliente: string;
  email: string;
  nome: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  role?: 'admin' | 'user';
}

/** @deprecated Use Relatorio instead */
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

/** @deprecated Use Permissao instead */
export interface PermissaoUsuarioRelatorio {
  id_permissao: string;
  id_usuario: string;
  id_relatorio: string;
}

/** @deprecated Use LogAcesso instead */
export interface LogAcessoLegacy {
  id_log: string;
  id_usuario: string;
  id_cliente: string;
  id_relatorio: string | null;
  tipo_evento: 'login' | 'logout' | 'acesso_relatorio';
  data_hora_acesso: string;
  ip_origem: string;
}
