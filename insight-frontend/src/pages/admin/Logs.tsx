import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface LogAcesso { id: string; tipo_evento: string; ip_origem: string | null; created_at: string; usuario_nome?: string; cliente_nome?: string; relatorio_nome?: string; }

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogAcesso[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase.from('logs_acesso').select('id, tipo_evento, ip_origem, created_at, usuario_id, cliente_id, relatorio_id').order('created_at', { ascending: false });
    if (!data || data.length === 0) { setLogs([]); setLoading(false); return; }

    const uIds = [...new Set(data.map(l => l.usuario_id))];
    const cIds = [...new Set(data.map(l => l.cliente_id))];
    const rIds = [...new Set(data.map(l => l.relatorio_id).filter(Boolean))] as string[];

    const [{ data: us }, { data: cs }, { data: rs }] = await Promise.all([
      supabase.from('usuarios').select('id, nome').in('id', uIds),
      supabase.from('clientes').select('id, nome').in('id', cIds),
      rIds.length > 0 ? supabase.from('relatorios').select('id, nome').in('id', rIds) : Promise.resolve({ data: [] as any[] }),
    ]);

    const uMap = new Map((us || []).map(u => [u.id, u.nome]));
    const cMap = new Map((cs || []).map(c => [c.id, c.nome]));
    const rMap = new Map((rs || []).map(r => [r.id, r.nome]));

    setLogs(data.map(l => ({ id: l.id, tipo_evento: l.tipo_evento, ip_origem: l.ip_origem, created_at: l.created_at, usuario_nome: uMap.get(l.usuario_id) || '-', cliente_nome: cMap.get(l.cliente_id) || '-', relatorio_nome: l.relatorio_id ? rMap.get(l.relatorio_id) || '-' : '-' })));
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);
  const filtered = logs.filter(l => (l.usuario_nome || '').toLowerCase().includes(search.toLowerCase()) || (l.cliente_nome || '').toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'created_at', header: 'Data/Hora', render: (v: any) => new Date(v).toLocaleString('pt-BR') },
    { key: 'usuario_nome', header: 'Usuário' },
    { key: 'cliente_nome', header: 'Cliente' },
    { key: 'tipo_evento', header: 'Evento' },
    { key: 'relatorio_nome', header: 'Relatório' },
    { key: 'ip_origem', header: 'IP', render: (v: any) => v || '-' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>Logs de Acesso</h1>
          <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 14 }}>Auditoria e monitoramento</p>
        </div>
        <button onClick={fetchLogs} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid hsla(210,40%,98%,0.2)', background: 'transparent', color: 'hsl(210 40% 98%)', fontSize: 13, cursor: 'pointer' }}>🔄 Atualizar</button>
      </div>
      <input placeholder="Buscar por usuário ou cliente..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
      {loading ? <p style={{ color: 'hsla(210,40%,98%,0.5)', padding: '48px 0', textAlign: 'center' }}>Carregando...</p> : <AdminTable columns={columns} data={filtered} />}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', maxWidth: 400, padding: '10px 16px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.1)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none', marginBottom: 24, boxSizing: 'border-box' };