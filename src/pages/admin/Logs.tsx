import { useState } from 'react';
import { mockLogs, mockUsuarios, mockRelatorios, mockClientes } from '@/data/mockData';
import { LogAcesso } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, RefreshCw } from 'lucide-react';

export default function AdminLogs() {
  const [logs] = useState<LogAcesso[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');

  const getUserName = (id: string) => {
    return mockUsuarios.find(u => u.id_usuario === id)?.nome || '-';
  };

  const getClienteName = (id: string) => {
    return mockClientes.find(c => c.id_cliente === id)?.nome_cliente || '-';
  };

  const getReportName = (id: string | null) => {
    if (!id) return '-';
    return mockRelatorios.find(r => r.id_relatorio === id)?.nome_relatorio || '-';
  };

  const columns = [
    {
      key: 'data_hora_acesso',
      header: 'Data/Hora',
      render: (value: string) => (
        <span className="text-sm">{new Date(value).toLocaleString('pt-BR')}</span>
      )
    },
    { 
      key: 'id_usuario', 
      header: 'Usuário',
      render: (value: string) => getUserName(value)
    },
    { 
      key: 'id_cliente', 
      header: 'Cliente',
      render: (value: string) => getClienteName(value)
    },
    {
      key: 'tipo_evento',
      header: 'Evento',
      render: (value: string) => {
        const eventLabels: Record<string, { label: string; color: string }> = {
          login: { label: 'Login', color: 'bg-info/10 text-info' },
          logout: { label: 'Logout', color: 'bg-muted text-muted-foreground' },
          acesso_relatorio: { label: 'Acesso Relatório', color: 'bg-accent/10 text-accent' },
        };
        const event = eventLabels[value] || { label: value, color: 'bg-muted text-muted-foreground' };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.color}`}>
            {event.label}
          </span>
        );
      }
    },
    { 
      key: 'id_relatorio', 
      header: 'Relatório',
      render: (value: string | null) => getReportName(value)
    },
    { 
      key: 'ip_origem', 
      header: 'IP',
      render: (value: string) => (
        <span className="font-mono text-xs">{value}</span>
      )
    },
  ];

  const filteredLogs = logs.filter(l => {
    const userName = getUserName(l.id_usuario).toLowerCase();
    const clienteName = getClienteName(l.id_cliente).toLowerCase();
    return userName.includes(searchQuery.toLowerCase()) || 
           clienteName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Logs de Acesso</h1>
          <p className="text-muted-foreground">Auditoria e monitoramento de atividades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por usuário ou cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
      />
    </div>
  );
}
