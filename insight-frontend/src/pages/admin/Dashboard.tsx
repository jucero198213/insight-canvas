import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface LogRecente {
  id: string;
  tipo_evento: string;
  created_at: string;
  usuario_nome?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ clientes: 0, usuarios: 0, relatorios: 0, acessos: 0 });
  const [logs, setLogs] = useState<LogRecente[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const today = new Date().toISOString().split('T')[0];
    const [{ count: c }, { count: u }, { count: r }, { count: l }] = await Promise.all([
      supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
      supabase.from('relatorios').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
      supabase.from('logs_acesso').select('*', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00`),
    ]);
    setStats({ clientes: c || 0, usuarios: u || 0, relatorios: r || 0, acessos: l || 0 });

    const { data } = await supabase.from('logs_acesso').select('id, tipo_evento, created_at, usuario_id').order('created_at', { ascending: false }).limit(5);
    if (data && data.length > 0) {
      const ids = [...new Set(data.map(d => d.usuario_id))];
      const { data: usuarios } = await supabase.from('usuarios').select('id, nome').in('id', ids);
      const map = new Map((usuarios || []).map(u => [u.id, u.nome]));
      setLogs(data.map(d => ({ id: d.id, tipo_evento: d.tipo_evento, created_at: d.created_at, usuario_nome: map.get(d.usuario_id) || '-' })));
    }
  };

  const statCards = [
    { label: 'Clientes Ativos', value: stats.clientes, emoji: '🏢' },
    { label: 'Usuários Ativos', value: stats.usuarios, emoji: '👥' },
    { label: 'Relatórios Ativos', value: stats.relatorios, emoji: '📈' },
    { label: 'Acessos Hoje', value: stats.acessos, emoji: '⚡' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'hsla(210,40%,98%,0.5)', marginBottom: 32 }}>Visão geral do sistema</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ padding: 24, borderRadius: 16, background: 'hsla(210,40%,98%,0.03)', border: '1px solid hsla(210,40%,98%,0.08)' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.emoji}</div>
            <p style={{ fontSize: 32, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.5)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 16, background: 'hsla(210,40%,98%,0.03)', border: '1px solid hsla(210,40%,98%,0.08)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 20 }}>Atividade Recente</h3>
        {logs.length === 0 ? (
          <p style={{ color: 'hsla(210,40%,98%,0.4)' }}>Nenhuma atividade recente</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'hsl(187 92% 41%)' }} />
                <div>
                  <p style={{ fontSize: 14, color: 'hsl(210 40% 98%)' }}>
                    <strong>{log.usuario_nome}</strong> — {log.tipo_evento}
                  </p>
                  <p style={{ fontSize: 12, color: 'hsla(210,40%,98%,0.4)' }}>{new Date(log.created_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}