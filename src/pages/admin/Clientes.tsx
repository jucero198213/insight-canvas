import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ClienteFormModal } from '@/components/admin/ClienteFormModal';

interface Cliente {
  id: string;
  nome: string;
  cor: string;
  status: string;
  created_at: string;
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClientes = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome, cor, status, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        toast.error('Erro ao carregar clientes');
        return;
      }

      setClientes(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const columns = [
    { key: 'nome', header: 'Nome do Cliente' },
    {
      key: 'cor',
      header: 'Cor',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md border"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm font-mono">{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'ativo'
            ? 'bg-success/10 text-success'
            : 'bg-muted text-muted-foreground'
        }`}>
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

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os tenants da plataforma
          </p>
        </div>
        <Button variant="hero" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredClientes}
          onView={(row) => toast.info(`Visualizando: ${row.nome}`)}
          onEdit={(row) => toast.info(`Editando: ${row.nome}`)}
          onDelete={(row) => toast.error(`Excluir: ${row.nome}`)}
        />
      )}

      <ClienteFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchClientes}
      />
    </div>
  );
}
