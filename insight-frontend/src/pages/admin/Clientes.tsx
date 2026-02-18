import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface Cliente {
  id: string;
  nome: string;
  cor_primaria: string | null;
  status: string;
  created_at: string;
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('clientes').select('id, nome, cor_primaria, status, created_at').order('created_at', { ascending: false });
    setClientes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = clientes.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'cor_primaria', header: 'Cor', render: (v: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, background: v || '#666', border: '1px solid hsla(210,40%,98%,0.1)' }} />
        <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{v || '-'}</span>
      </div>
    )},
    { key: 'status', header: 'Status', render: (v: any) => (
      <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: v === 'ativo' ? 'hsla(142,71%,45%,0.1)' : 'hsla(210,40%,98%,0.05)', color: v === 'ativo' ? 'hsl(142 71% 45%)' : 'hsla(210,40%,98%,0.5)' }}>
        {v === 'ativo' ? 'Ativo' : 'Inativo'}
      </span>
    )},
    { key: 'created_at', header: 'Criado em', render: (v: any) => new Date(v).toLocaleDateString('pt-BR') },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>Clientes</h1>
          <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 14 }}>Gerencie os tenants da plataforma</p>
        </div>
      </div>
      <input placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
      {loading ? <p style={{ color: 'hsla(210,40%,98%,0.5)', padding: '48px 0', textAlign: 'center' }}>Carregando...</p> : <AdminTable columns={columns} data={filtered} />}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', maxWidth: 400, padding: '10px 16px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.1)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none', marginBottom: 24, boxSizing: 'border-box' };