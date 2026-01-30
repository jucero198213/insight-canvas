import { useState } from 'react';
import { mockUsuarios, mockClientes } from '@/data/mockData';
import { Usuario } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsuarios() {
  const [usuarios] = useState<Usuario[]>(mockUsuarios);
  const [searchQuery, setSearchQuery] = useState('');

  const getClienteName = (id: string) => {
    return mockClientes.find(c => c.id_cliente === id)?.nome_cliente || '-';
  };

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { 
      key: 'id_cliente', 
      header: 'Cliente',
      render: (value: string) => getClienteName(value)
    },
    {
      key: 'role',
      header: 'Perfil',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'admin' 
            ? 'bg-accent/10 text-accent' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {value === 'admin' ? 'Administrador' : 'Usuário'}
        </span>
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

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Button variant="hero">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredUsuarios}
        onView={(row) => toast.info(`Visualizando: ${row.nome}`)}
        onEdit={(row) => toast.info(`Editando: ${row.nome}`)}
        onDelete={(row) => toast.error(`Excluir: ${row.nome}`)}
      />
    </div>
  );
}
