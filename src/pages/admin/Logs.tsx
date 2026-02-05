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
  usuarios?: { nome: string };
  clientes?: { nome: string };
  relatorios?: { nome: string };
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
      .select(`
        id,
        tipo_evento,
        ip_origem,
        created_at,
        usuarios ( nome ),
        clientes ( nome ),
        relatorios ( nome )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error('Erro ao carregar logs');
    } else {
      setLogs(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const user = log.usuarios?.nome?.toLowerCase() || '';
    const cliente = log.clientes?.nome?.toLowerCase() || '';
    return (
      user.includes(searchQuery.toLowerCase()) ||
      cliente.includes(searchQuery.toLowerCase())
    );
  });

  const handleExport = async () => {
    const exportData = filteredLogs.map(log => ({
      'Data/Hora': new Date(log.created_at).toLocaleString('pt-BR'),
      'Usuário': log.usuarios?.nome || '-',
      'Cliente': log.clientes?.nome || '-',
      'Evento': log.tipo_evento,
      'Relatório': log.relatorios?.nome || '-',
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
      key: 'usuarios.nome',
      header: 'Usuário',
      render: (_: any, row: LogAcesso) => row.usuarios?.nome || '-',
    },
    {
      key: 'clientes.nome',
      header: 'Cliente',
      render: (_: any, row: LogAcesso) => row.clientes?.nome || '-',
    },
    {
      key: 'tipo_evento',
      header: 'Evento',
    },
    {
      key: 'relatorios.nome',
      header: 'Relatório',
      render: (_: any, row: LogAcesso) => row.relatorios?.nome || '-',
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
