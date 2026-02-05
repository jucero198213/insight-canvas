import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { RelatorioFormModal } from '@/components/admin/RelatorioFormModal';

interface Relatorio {
  id: string;
  nome: string;
  cliente_id: string;
  status: string;
  report_id: string;
  created_at: string;
  cliente_nome?: string;
}

export default function AdminRelatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRelatorios = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('relatorios')
        .select(`
          id,
          nome,
          cliente_id,
          status,
          report_id,
          created_at,
          clientes (
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar relatórios:', error);
        toast.error('Erro ao carregar relatórios');
        return;
      }

      const formatted: Relatorio[] = (data || []).map(r => ({
        id: r.id,
        nome: r.nome,
        cliente_id: r.cliente_id,
        status: r.status,
        report_id: r.report_id,
        created_at: r.created_at,
        cliente_nome: (r.clientes as { nome: string } | null)?.nome || '-',
      }));

      setRelatorios(formatted);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, []);

  const columns = [
    { key: 'nome', header: 'Nome do Relatório' },
    { key: 'cliente_nome', header: 'Cliente' },
    {
      key: 'report_id',
      header: 'Report ID',
      render: (value: string) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === 'ativo'
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {value === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      key: 'created_at',
      header: 'Criado em',
      render: (value: string) =>
        new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  const filteredRelatorios = relatorios.filter(r =>
    r.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Relatórios Power BI
          </h1>
          <p className="text-muted-foreground">
            Gerencie os relatórios embedados
          </p>
        </div>
        <Button variant="hero" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Relatório
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar relatórios..."
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
        <DataTable
          columns={columns}
          data={filteredRelatorios}
          onView={(row) => toast.info(`Visualizando: ${row.nome}`)}
          onEdit={(row) => toast.info(`Editando: ${row.nome}`)}
          onDelete={(row) => toast.error(`Excluir: ${row.nome}`)}
        />
      )}

      <RelatorioFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchRelatorios}
      />
    </div>
  );
}
