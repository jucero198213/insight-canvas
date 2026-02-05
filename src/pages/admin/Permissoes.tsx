import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PermissaoFormModal } from '@/components/admin/PermissaoFormModal';

interface Permissao {
  id: string;
  usuario_id: string;
  relatorio_id: string;
  usuario_nome?: string;
  usuario_email?: string;
  relatorio_nome?: string;
}

export default function AdminPermissoes() {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPermissoes = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('permissoes')
        .select(`
          id,
          usuario_id,
          relatorio_id,
          usuarios (
            nome,
            email
          ),
          relatorios (
            nome
          )
        `)
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro ao buscar permissões:', error);
        toast.error('Erro ao carregar permissões');
        return;
      }

      const formatted: Permissao[] = (data || []).map(p => ({
        id: p.id,
        usuario_id: p.usuario_id,
        relatorio_id: p.relatorio_id,
        usuario_nome: (p.usuarios as { nome: string } | null)?.nome || '-',
        usuario_email: (p.usuarios as { email: string } | null)?.email || '-',
        relatorio_nome: (p.relatorios as { nome: string } | null)?.nome || '-',
      }));

      setPermissoes(formatted);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar permissões');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissoes();
  }, []);

  const columns = [
    {
      key: 'usuario_nome',
      header: 'Usuário',
      render: (_: any, row: Permissao) => (
        <div>
          <p className="font-medium">{row.usuario_nome}</p>
          <p className="text-xs text-muted-foreground">
            {row.usuario_email}
          </p>
        </div>
      )
    },
    {
      key: 'relatorio_nome',
      header: 'Relatório'
    },
    {
      key: 'id',
      header: 'ID Permissão',
      render: (value: string) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {value}
        </span>
      )
    }
  ];

  const filteredPermissoes = permissoes.filter(p =>
    p.usuario_nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.relatorio_nome?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Permissões
          </h1>
          <p className="text-muted-foreground">
            Controle de acesso aos relatórios
          </p>
        </div>
        <Button variant="hero" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Nova Permissão
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por usuário ou relatório..."
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
          data={filteredPermissoes}
          onDelete={(row) =>
            toast.error(`Remover permissão: ${row.id}`)
          }
        />
      )}

      <PermissaoFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchPermissoes}
      />
    </div>
  );
}
