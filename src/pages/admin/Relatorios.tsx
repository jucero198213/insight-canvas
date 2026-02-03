import { useState } from 'react';
import { mockRelatorios, mockClientes } from '@/data/mockData';
import { RelatorioPowerBI } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { RelatorioFormModal } from '@/components/admin/RelatorioFormModal';

export default function AdminRelatorios() {
  const [relatorios] = useState<RelatorioPowerBI[]>(mockRelatorios);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getClienteName = (clienteId: string) => {
    return mockClientes.find(c => c.id_cliente === clienteId)?.nome_cliente || '-';
  };

  const columns = [
    { key: 'nome_relatorio', header: 'Nome do Relatório' },
    { 
      key: 'id_cliente', 
      header: 'Cliente',
      render: (value: string) => getClienteName(value)
    },
    { 
      key: 'report_id', 
      header: 'Report ID',
      render: (value: string) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{value}</span>
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
  ];

  const filteredRelatorios = relatorios.filter(r =>
    r.nome_relatorio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Relatórios Power BI</h1>
          <p className="text-muted-foreground">Gerencie os relatórios embedados</p>
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

      <DataTable
        columns={columns}
        data={filteredRelatorios}
        onView={(row) => toast.info(`Visualizando: ${row.nome_relatorio}`)}
        onEdit={(row) => toast.info(`Editando: ${row.nome_relatorio}`)}
        onDelete={(row) => toast.error(`Excluir: ${row.nome_relatorio}`)}
      />

      <RelatorioFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
