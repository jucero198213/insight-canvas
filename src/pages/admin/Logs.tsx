import { useState, useCallback } from 'react';
import { mockLogs, mockUsuarios, mockRelatorios, mockClientes } from '@/data/mockData';
import { LogAcessoLegacy } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogAcessoLegacy[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // In production, this would fetch fresh data from the database
    setLogs([...mockLogs]); // Reset to mock data (simulating refresh)
    setIsRefreshing(false);
    toast.success('Logs atualizados com sucesso!');
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    
    try {
      // Prepare data for export with filtered results
      const exportData = filteredLogs.map(log => ({
        'Data/Hora': new Date(log.data_hora_acesso).toLocaleString('pt-BR'),
        'Usuário': getUserName(log.id_usuario),
        'Cliente': getClienteName(log.id_cliente),
        'Evento': log.tipo_evento === 'login' ? 'Login' : 
                  log.tipo_evento === 'logout' ? 'Logout' : 
                  log.tipo_evento === 'acesso_relatorio' ? 'Acesso Relatório' : log.tipo_evento,
        'Relatório': getReportName(log.id_relatorio),
        'IP Origem': log.ip_origem,
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // Data/Hora
        { wch: 25 }, // Usuário
        { wch: 25 }, // Cliente
        { wch: 18 }, // Evento
        { wch: 30 }, // Relatório
        { wch: 15 }, // IP
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Logs de Acesso');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `logs_acesso_${date}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      toast.success(`Arquivo "${filename}" exportado com sucesso!`);
    } catch (error) {
      toast.error('Erro ao exportar logs. Tente novamente.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [filteredLogs]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Logs de Acesso</h1>
          <p className="text-muted-foreground">Auditoria e monitoramento de atividades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Atualizar
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
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
