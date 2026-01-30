import { useState } from 'react';
import { mockPermissoes, mockUsuarios, mockRelatorios } from '@/data/mockData';
import { PermissaoUsuarioRelatorio } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPermissoes() {
  const [permissoes] = useState<PermissaoUsuarioRelatorio[]>(mockPermissoes);
  const [searchQuery, setSearchQuery] = useState('');

  const getUserName = (id: string) => {
    return mockUsuarios.find(u => u.id_usuario === id)?.nome || '-';
  };

  const getUserEmail = (id: string) => {
    return mockUsuarios.find(u => u.id_usuario === id)?.email || '-';
  };

  const getReportName = (id: string) => {
    return mockRelatorios.find(r => r.id_relatorio === id)?.nome_relatorio || '-';
  };

  const columns = [
    { 
      key: 'id_usuario', 
      header: 'Usuário',
      render: (value: string) => (
        <div>
          <p className="font-medium">{getUserName(value)}</p>
          <p className="text-xs text-muted-foreground">{getUserEmail(value)}</p>
        </div>
      )
    },
    { 
      key: 'id_relatorio', 
      header: 'Relatório',
      render: (value: string) => getReportName(value)
    },
    {
      key: 'id_permissao',
      header: 'ID Permissão',
      render: (value: string) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{value}</span>
      )
    }
  ];

  const filteredPermissoes = permissoes.filter(p => {
    const userName = getUserName(p.id_usuario).toLowerCase();
    const reportName = getReportName(p.id_relatorio).toLowerCase();
    return userName.includes(searchQuery.toLowerCase()) || 
           reportName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Permissões</h1>
          <p className="text-muted-foreground">Controle de acesso aos relatórios</p>
        </div>
        <Button variant="hero">
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

      <DataTable
        columns={columns}
        data={filteredPermissoes}
        onDelete={(row) => toast.error(`Remover permissão: ${row.id_permissao}`)}
      />
    </div>
  );
}
