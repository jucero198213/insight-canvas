import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface Usuario { id: string; nome: string; email: string; status: string; created_at: string; cliente_nome?: string; role?: string; }

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('usuarios').select('id, email, nome, cliente_id, status, created_at, clientes(nome)').order('created_at', { ascending: false });
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const rolesMap = new Map((roles || []).map(r => [r.user_id, r.role]));
    setUsuarios((data || []).map(u => ({ id: u.id, email: u.email, nome: u.nome, status: u.status, created_at: u.created_at, cliente_nome: (u.clientes as any)?.nome || '-', role: rolesMap.get(u.id) || 'user' })));
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  const filtered = usuarios.filter(u => u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { key: 'cliente_nome', header: 'Cliente' },
    { key: 'role', header: 'Perfil', render: (v: any) => <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: v === 'admin' ? 'hsla(187,92%,41%,0.1)' : 'hsla(210,40%,98%,0.05)', color: v === 'admin' ? 'hsl(187 92% 41%)' : 'hsla(210,40%,98%,0.5)' }}>{v === 'admin' ? 'Admin' : 'Usuário'}</span> },
    { key: 'status', header: 'Status', render: (v: any) => <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: v === 'ativo' ? 'hsla(142,71%,45%,0.1)' : 'hsla(210,40%,98%,0.05)', color: v === 'ativo' ? 'hsl(142 71% 45%)' : 'hsla(210,40%,98%,0.5)' }}>{v === 'ativo' ? 'Ativo' : 'Inativo'}</span> },
    { key: 'created_at', header: 'Criado em', render: (v: any) => new Date(v).toLocaleDateString('pt-BR') },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>Usuários</h1>
      <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 14, marginBottom: 24 }}>Gerencie os usuários do sistema</p>
      <input placeholder="Buscar usuários..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
      {loading ? <p style={{ color: 'hsla(210,40%,98%,0.5)', padding: '48px 0', textAlign: 'center' }}>Carregando...</p> : <AdminTable columns={columns} data={filtered} />}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', maxWidth: 400, padding: '10px 16px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.1)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none', marginBottom: 24, boxSizing: 'border-box' };