import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';

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
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema"
      />

      {/* Stats */}
      <div style={styles.grid}>
        {statCards.map(s => (
          <div key={s.label} style={styles.card}>
            <div style={styles.cardEmoji}>{s.emoji}</div>
            <p style={styles.cardValue}>{s.value}</p>
            <p style={styles.cardLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Atividade */}
      <div style={styles.activityBox}>
        <h3 style={styles.activityTitle}>Atividade Recente</h3>

        {logs.length === 0 ? (
          <p style={styles.emptyText}>Nenhuma atividade recente</p>
        ) : (
          <div style={styles.activityList}>
            {logs.map(log => (
              <div key={log.id} style={styles.activityItem}>
                <div style={styles.dot} />
                <div>
                  <p style={styles.activityText}>
                    <strong>{log.usuario_nome}</strong> — {log.tipo_evento}
                  </p>
                  <p style={styles.activityDate}>
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 22,
    marginBottom: 40,
  },

  card: {
    padding: 26,
    borderRadius: 22,
    background: `
      linear-gradient(180deg, rgba(17,24,39,0.95), rgba(17,24,39,0.65))
    `,
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: `
      0 10px 30px rgba(0,0,0,0.35),
      inset 0 1px rgba(255,255,255,0.04)
    `,
    backdropFilter: 'blur(10px)',
    transition: 'all .25s cubic-bezier(.4,0,.2,1)',
    position: 'relative',
    overflow: 'hidden',
  },

  cardEmoji: {
    fontSize: 26,
    marginBottom: 10,
    opacity: 0.9,
  },

  cardValue: {
    fontSize: 32,
    fontWeight: 600, // mais elegante que 700
    color: '#F9FAFB',
    marginBottom: 4,
    letterSpacing: '-0.02em',
    textShadow: '0 0 18px rgba(59,130,246,0.25)', // glow sutil
  },

  cardLabel: {
    fontSize: 13,
    color: 'rgba(229,231,235,0.55)',
    letterSpacing: '-0.01em',
  },

  activityBox: {
    padding: 26,
    borderRadius: 22,
    background: `
      linear-gradient(180deg, rgba(17,24,39,0.85), rgba(17,24,39,0.6))
    `,
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: `
      0 8px 25px rgba(0,0,0,0.3),
      inset 0 1px rgba(255,255,255,0.04)
    `,
  },

  activityTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: '#F9FAFB',
    marginBottom: 20,
    letterSpacing: '-0.01em',
  },

  emptyText: {
    color: 'rgba(229,231,235,0.4)',
    fontSize: 14,
  },

  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#38BDF8',
    marginTop: 6,
    boxShadow: '0 0 10px rgba(56,189,248,0.6)',
  },

  activityText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 1.4,
  },

  activityDate: {
    fontSize: 12,
    color: 'rgba(229,231,235,0.45)',
    marginTop: 2,
  },
};
