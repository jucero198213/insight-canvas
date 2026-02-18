import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface Relatorio { id: string; nome: string; report_id: string; status: string; created_at: string; cliente_nome?: string; }

export default function AdminRelatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('relatorios').select('id, nome, report_id, status, created_at, clientes(nome)').order('created_at', { ascending: false });
    setRelatorios((data || []).map(r => ({ id: r.id, nome: r.nome, report_id: r.report_id, status: r.status, created_at: r.created_at, cliente_nome: (r.clientes as any)?.nome || '-' })));
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  const filtered = relatorios.filter(r => r.nome.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'cliente_nome', header: 'Cliente' },
    { key: 'report_id', header: 'Report ID', render: (v: any) => <span style={{ fontSize: 11, fontFamily: 'monospace', background: 'hsla(210,40%,98%,0.05)', padding: '2px 8px', borderRadius: 4 }}>{v}</span> },
    { key: 'status', header: 'Status', render: (v: any) => <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: v === 'ativo' ? 'hsla(142,71%,45%,0.1)' : 'hsla(210,40%,98%,0.05)', color: v === 'ativo' ? 'hsl(142 71% 45%)' : 'hsla(210,40%,98%,0.5)' }}>{v === 'ativo' ? 'Ativo' : 'Inativo'}</span> },
    { key: 'created_at', header: 'Criado em', render: (v: any) => new Date(v).toLocaleDateString('pt-BR') },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>Relatórios Power BI</h1>
      <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 14, marginBottom: 24 }}>Gerencie os relatórios embedados</p>
      <input placeholder="Buscar relatórios..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
      {loading ? <p style={{ color: 'hsla(210,40%,98%,0.5)', padding: '48px 0', textAlign: 'center' }}>Carregando...</p> : <AdminTable columns={columns} data={filtered} />}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', maxWidth: 400, padding: '10px 16px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.1)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none', marginBottom: 24, boxSizing: 'border-box' };