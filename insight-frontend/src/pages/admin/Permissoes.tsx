import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface Permissao { id: string; usuario_nome?: string; usuario_email?: string; relatorio_nome?: string; }

export default function AdminPermissoes() {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('permissoes').select('id, usuario_id, relatorio_id, usuarios(nome, email), relatorios(nome)').order('id', { ascending: false });
    setPermissoes((data || []).map(p => ({
      id: p.id,
      usuario_nome: (p.usuarios as any)?.nome || '-',
      usuario_email: (p.usuarios as any)?.email || '-',
      relatorio_nome: (p.relatorios as any)?.nome || '-',
    })));
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  const filtered = permissoes.filter(p => (p.usuario_nome || '').toLowerCase().includes(search.toLowerCase()) || (p.relatorio_nome || '').toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'usuario_nome', header: 'Usuário', render: (_: any, row: any) => (
      <div><p style={{ fontWeight: 500 }}>{row.usuario_nome}</p><p style={{ fontSize: 12, color: 'hsla(210,40%,98%,0.4)' }}>{row.usuario_email}</p></div>
    )},
    { key: 'relatorio_nome', header: 'Relatório' },
    { key: 'id', header: 'ID', render: (v: any) => <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'hsla(210,40%,98%,0.4)' }}>{v}</span> },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>Permissões</h1>
      <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 14, marginBottom: 24 }}>Controle de acesso aos relatórios</p>
      <input placeholder="Buscar por usuário ou relatório..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
      {loading ? <p style={{ color: 'hsla(210,40%,98%,0.5)', padding: '48px 0', textAlign: 'center' }}>Carregando...</p> : <AdminTable columns={columns} data={filtered} />}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', maxWidth: 400, padding: '10px 16px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.1)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none', marginBottom: 24, boxSizing: 'border-box' };