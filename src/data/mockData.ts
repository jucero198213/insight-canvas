import { Cliente, Usuario, RelatorioPowerBI, PermissaoUsuarioRelatorio, LogAcesso } from '@/types';

export const mockClientes: Cliente[] = [
  {
    id_cliente: 'client-1',
    nome_cliente: 'Empresa ABC',
    logo_url: null,
    cor_primaria: '#0d3b66',
    status: 'ativo',
    data_criacao: '2024-01-15T10:00:00Z',
  },
  {
    id_cliente: 'client-2',
    nome_cliente: 'Tech Corp',
    logo_url: null,
    cor_primaria: '#059669',
    status: 'ativo',
    data_criacao: '2024-02-20T14:30:00Z',
  },
  {
    id_cliente: 'client-3',
    nome_cliente: 'Global Industries',
    logo_url: null,
    cor_primaria: '#7c3aed',
    status: 'inativo',
    data_criacao: '2024-03-10T09:15:00Z',
  },
];

export const mockUsuarios: Usuario[] = [
  {
    id_usuario: '1',
    id_cliente: 'client-1',
    email: 'admin@analyticspro.com',
    nome: 'Administrador',
    status: 'ativo',
    data_criacao: '2024-01-15T10:00:00Z',
    role: 'admin',
  },
  {
    id_usuario: '2',
    id_cliente: 'client-1',
    email: 'joao.silva@empresaabc.com',
    nome: 'João Silva',
    status: 'ativo',
    data_criacao: '2024-01-20T11:00:00Z',
    role: 'user',
  },
  {
    id_usuario: '3',
    id_cliente: 'client-1',
    email: 'maria.santos@empresaabc.com',
    nome: 'Maria Santos',
    status: 'ativo',
    data_criacao: '2024-02-05T09:00:00Z',
    role: 'user',
  },
  {
    id_usuario: '4',
    id_cliente: 'client-2',
    email: 'carlos.tech@techcorp.com',
    nome: 'Carlos Tech',
    status: 'ativo',
    data_criacao: '2024-02-25T15:00:00Z',
    role: 'user',
  },
];

export const mockRelatorios: RelatorioPowerBI[] = [
  {
    id_relatorio: 'report-1',
    id_cliente: 'client-1',
    workspace_id: 'ws-001',
    report_id: 'pbi-report-001',
    dataset_id: 'ds-001',
    nome_relatorio: 'Dashboard Financeiro',
    descricao: 'Visão consolidada de receitas, despesas e fluxo de caixa',
    status: 'ativo',
  },
  {
    id_relatorio: 'report-2',
    id_cliente: 'client-1',
    workspace_id: 'ws-001',
    report_id: 'pbi-report-002',
    dataset_id: 'ds-002',
    nome_relatorio: 'Análise de Vendas',
    descricao: 'Performance de vendas por região e produto',
    status: 'ativo',
  },
  {
    id_relatorio: 'report-3',
    id_cliente: 'client-1',
    workspace_id: 'ws-001',
    report_id: 'pbi-report-003',
    dataset_id: 'ds-003',
    nome_relatorio: 'KPIs Operacionais',
    descricao: 'Indicadores chave de performance operacional',
    status: 'ativo',
  },
  {
    id_relatorio: 'report-4',
    id_cliente: 'client-2',
    workspace_id: 'ws-002',
    report_id: 'pbi-report-004',
    dataset_id: 'ds-004',
    nome_relatorio: 'Dashboard Tech Metrics',
    descricao: 'Métricas de desenvolvimento e infraestrutura',
    status: 'ativo',
  },
];

export const mockPermissoes: PermissaoUsuarioRelatorio[] = [
  { id_permissao: 'perm-1', id_usuario: '2', id_relatorio: 'report-1' },
  { id_permissao: 'perm-2', id_usuario: '2', id_relatorio: 'report-2' },
  { id_permissao: 'perm-3', id_usuario: '3', id_relatorio: 'report-1' },
  { id_permissao: 'perm-4', id_usuario: '3', id_relatorio: 'report-3' },
  { id_permissao: 'perm-5', id_usuario: '4', id_relatorio: 'report-4' },
];

export const mockLogs: LogAcesso[] = [
  {
    id_log: 'log-1',
    id_usuario: '2',
    id_cliente: 'client-1',
    id_relatorio: 'report-1',
    tipo_evento: 'acesso_relatorio',
    data_hora_acesso: '2024-03-15T14:30:00Z',
    ip_origem: '192.168.1.100',
  },
  {
    id_log: 'log-2',
    id_usuario: '2',
    id_cliente: 'client-1',
    id_relatorio: null,
    tipo_evento: 'login',
    data_hora_acesso: '2024-03-15T14:25:00Z',
    ip_origem: '192.168.1.100',
  },
];
