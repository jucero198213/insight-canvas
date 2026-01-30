import { useState } from 'react';
import { mockClientes } from '@/data/mockData';
import { Cliente } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { ClienteFormModal } from '@/components/admin/ClienteFormModal';

const columns = [
  { key: 'nome_cliente', header: 'Nome do Cliente' },
  { 
    key: 'cor_primaria', 
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
    key: 'data_criacao',
    header: 'Criado em',
    render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
  }
];

export default function AdminClientes() {
  const [clientes] = useState<Cliente[]>(mockClientes);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClientes = clientes.filter(c =>
    c.nome_cliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Clientes</h1>
          <p className="text-muted-foreground">Gerencie os tenants da plataforma</p>
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

      <DataTable
        columns={columns}
        data={filteredClientes}
        onView={(row) => toast.info(`Visualizando: ${row.nome_cliente}`)}
        onEdit={(row) => toast.info(`Editando: ${row.nome_cliente}`)}
        onDelete={(row) => toast.error(`Excluir: ${row.nome_cliente}`)}
      />

      <ClienteFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
