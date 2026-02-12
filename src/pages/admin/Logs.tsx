import { useEffect, useState } from 'react';
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
  ip_origem: string | null;
  created_at: string;
  usuario_nome?: string;
  cliente_nome?: string;
  relatorio_nome?: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogAcesso[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('logs_acesso')
      .select('id, tipo_evento, ip_origem, created_at, usuario_id, cliente_id, relatorio_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error('Erro ao carregar logs');
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setLogs([]);
      setLoading(false);
      return;
    }

    // Fetch related names
    const usuarioIds = [...new Set(data.map(l => l.usuario_id))];
    const clienteIds = [...new Set(data.map(l => l.cliente_id))];
    const relatorioIds = [...new Set(data.map(l => l.relatorio_id).filter(Boolean))] as string[];

    const [{ data: usuarios }, { data: clientes }, { data: relatorios }] = await Promise.all([
      supabase.from('usuarios').select('id, nome').in('id', usuarioIds),
      supabase.from('clientes').select('id, nome').in('id', clienteIds),
      relatorioIds.length > 0
        ? supabase.from('relatorios').select('id, nome').in('id', relatorioIds)
        : Promise.resolve({ data: [] as { id: string; nome: string }[] }),
    ]);

    const usuarioMap = new Map((usuarios || []).map(u => [u.id, u.nome]));
    const clienteMap = new Map((clientes || []).map(c => [c.id, c.nome]));
    const relatorioMap = new Map((relatorios || []).map(r => [r.id, r.nome]));

    setLogs(data.map(l => ({
      ...l,
      usuario_nome: usuarioMap.get(l.usuario_id) || '-',
      cliente_nome: clienteMap.get(l.cliente_id) || '-',
      relatorio_nome: l.relatorio_id ? relatorioMap.get(l.relatorio_id) || '-' : '-',
    })));

    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const user = log.usuario_nome?.toLowerCase() || '';
    const cliente = log.cliente_nome?.toLowerCase() || '';
    return (
      user.includes(searchQuery.toLowerCase()) ||
      cliente.includes(searchQuery.toLowerCase())
    );
  });

  const handleExport = async () => {
    const exportData = filteredLogs.map(log => ({
      'Data/Hora': new Date(log.created_at).toLocaleString('pt-BR'),
      'Usuário': log.usuario_nome || '-',
      'Cliente': log.cliente_nome || '-',
      'Evento': log.tipo_evento,
      'Relatório': log.relatorio_nome || '-',
      'IP': log.ip_origem || '-',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Logs');
    XLSX.writeFile(wb, `logs_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success('Logs exportados com sucesso');
  };

  const columns = [
    {
      key: 'created_at',
      header: 'Data/Hora',
      render: (v: string) => new Date(v).toLocaleString('pt-BR'),
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
    },
    {
      key: 'relatorio_nome',
      header: 'Relatório',
    },
    {
      key: 'ip_origem',
      header: 'IP',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Logs de Acesso</h1>
          <p className="text-muted-foreground">Auditoria e monitoramento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLogs} disabled={refreshing}>
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Button variant="outline" onClick={handleExport}>
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

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={filteredLogs} />
      )}
    </div>
  );
}
