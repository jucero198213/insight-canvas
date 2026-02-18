 import { useState, useEffect } from 'react';
 import { supabase } from '@/lib/safeSupabaseClient';
 import { DataTable } from '@/components/admin/DataTable';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Plus, Search, Loader2 } from 'lucide-react';
 import { toast } from 'sonner';
 import { UsuarioFormModal } from '@/components/admin/UsuarioFormModal';
 
 interface Usuario {
   id: string;
   email: string;
   nome: string;
   cliente_id: string;
   status: string;
   created_at: string;
   cliente_nome?: string;
   role?: string;
 }
 
 export default function AdminUsuarios() {
   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [isModalOpen, setIsModalOpen] = useState(false);
 
   const fetchUsuarios = async () => {
     try {
       setIsLoading(true);
       
       const { data: usuariosData, error: usuariosError } = await supabase
         .from('usuarios')
         .select(`
           id,
           email,
           nome,
           cliente_id,
           status,
           created_at,
           clientes (
             nome
           )
         `)
         .order('created_at', { ascending: false });
 
       if (usuariosError) {
         console.error('Error fetching usuarios:', usuariosError);
         toast.error('Erro ao carregar usuários');
         return;
       }
 
       const { data: rolesData } = await supabase
         .from('user_roles')
         .select('user_id, role');
 
       const rolesMap = new Map(rolesData?.map(r => [r.user_id, r.role]) || []);
 
       const formattedUsuarios: Usuario[] = (usuariosData || []).map(u => ({
         id: u.id,
         email: u.email,
         nome: u.nome,
         cliente_id: u.cliente_id,
         status: u.status,
         created_at: u.created_at,
         cliente_nome: (u.clientes as { nome: string } | null)?.nome || '-',
         role: rolesMap.get(u.id) || 'user',
       }));
 
       setUsuarios(formattedUsuarios);
     } catch (err) {
       console.error('Error:', err);
       toast.error('Erro ao carregar usuários');
     } finally {
       setIsLoading(false);
     }
   };
 
   useEffect(() => {
     fetchUsuarios();
   }, []);
 
   const handleDelete = async (row: Usuario) => {
     if (!confirm(`Tem certeza que deseja excluir o usuário "${row.nome}"?`)) {
       return;
     }
 
     try {
       const response = await supabase.functions.invoke('manage-users', {
         body: { usuario_id: row.id },
       });
 
       if (response.error) {
         throw new Error(response.error.message);
       }
 
       toast.success(`Usuário "${row.nome}" excluído com sucesso`);
       fetchUsuarios();
     } catch (err) {
       console.error('Delete error:', err);
       toast.error('Erro ao excluir usuário');
     }
   };
 
   const columns = [
     { key: 'nome', header: 'Nome' },
     { key: 'email', header: 'E-mail' },
     { key: 'cliente_nome', header: 'Cliente' },
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
       key: 'created_at',
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
         <Button variant="hero" onClick={() => setIsModalOpen(true)}>
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
 
       {isLoading ? (
         <div className="flex items-center justify-center py-12">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
       ) : (
         <DataTable
           columns={columns}
           data={filteredUsuarios}
           onView={(row) => toast.info(`Visualizando: ${row.nome}`)}
           onEdit={(row) => toast.info(`Editando: ${row.nome}`)}
           onDelete={handleDelete}
         />
       )}
 
       <UsuarioFormModal 
         open={isModalOpen} 
         onOpenChange={setIsModalOpen} 
         onSuccess={fetchUsuarios}
       />
     </div>
   );
 }
