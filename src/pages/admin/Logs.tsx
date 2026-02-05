import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/admin/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface LogAcesso {
  id: string;
  usuario_id: string;
  cliente_id: string;
  relatorio_id: string | null;
  tipo_evento: string;
  ip_origem: string;
  created_at: string;
  usuario_nome?: string;
  cliente_nome?: string;
  relatorio_nome?: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogAcesso[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('logs')
        .select(`
          id,
          usuario_id,
          cliente_id,
          relatorio_id,
          tipo_evento,
          ip_origem,
          created_at,
          usuarios (
            nome
          ),
          clientes (
            nome
          ),
          relatorios (
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar logs:', error);
        toast.error('Erro ao carregar logs');
        return;
      }

      const formatted: LogAcesso[] = (data || []).map(l => ({
        id: l.id,
        usuario_id: l.usuario_id,
        cliente_id: l.cliente_id,
        relatorio_id: l.relatorio_id,
        tipo_evento: l.tipo_evento,
        ip_origem: l.ip_origem,
        created_at: l.created_at,
        usuario_nome: (l.usuarios as { nome: string } | null)?.nome || '-',
        cliente_nome: (l.clientes as { nome: string } | null)?.nome || '-',
        relatorio_nome: (l.relatorios as { nome: string } | null)?.nome || '-',
      }));

      setLogs(formatted);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchLogs();
    setIsRefreshing(false);
    toast.success('Logs atualizados com sucesso!');
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      const exportData = filteredLogs.map(log => ({
        'Data/Hora': new Date(log.created_at).toLocaleString('pt-BR'),
        'Usuário': log.usuario_nome,
        'Cliente': log.cliente_nome,
        'Evento':
          log.tipo_evento === 'login' ? 'Login' :
          log.tipo_evento === 'logout' ? 'Logout' :
          log.tipo_evento === 'acesso_relatorio' ? 'Acesso Relatório' :
          log.tipo_evento,
        'Relatório': log.relatorio_nome,
        'IP Origem': log.ip_origem,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws['!cols'] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 25 },
        { wch: 18 },
        { wch: 30 },
        { wch: 15 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Logs de Acesso');

      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `logs_acesso_${date}.xlsx`);

      toast.success('Logs exportados com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao exportar logs');
    } finally {
      setIsExporting(false);
    }
  }, [logs]);

  const columns = [
    {
      key: 'created_at',
      header: 'Data/Hora',
      render: (value: string) =>
        new Date(value).toLocaleString('pt-BR'),
    },
    {
      key: 'usuario_nome',
      header: 'Usuário',
    },
    {
      key: 'cliente_nome',
      header: 'Cliente',
    },
    {
      key: 'tipo_evento',
      header: 'Evento',
      render: (value: string) => {
        const map: Record<string, string> = {
          login: 'Login',
          logout: 'Logout',
          acesso_relatorio: 'Acesso Relatório',
        };
        return map[value] || value;
      },
    },
    {
      key: 'relatorio_nome',
      header: 'Relatório',
    },
    {
      key: 'ip_origem',
      header: 'IP',
      render: (value: string) => (
        <span className="font-mono text-xs">{value}</span>
      ),
    },
  ];

  const filteredLogs = logs.filter(l =>
    l.usuario_nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.cliente_nome?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Logs de Acesso
          </h1>
          <p className="text-muted-foreground">
            Auditoria e monitoramento de atividades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Atualizar
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={filteredLogs} />
      )}
    </div>
  );
}
