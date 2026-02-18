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
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 36,
  },

  card: {
    padding: 24,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(6px)',
    transition: 'all .2s ease',
  },

  cardEmoji: {
    fontSize: 26,
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 30,
    fontWeight: 700,
    color: '#F1F5F9',
    marginBottom: 4,
  },

  cardLabel: {
    fontSize: 13,
    color: 'rgba(241,245,249,0.5)',
  },

  activityBox: {
    padding: 24,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  activityTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: '#F1F5F9',
    marginBottom: 18,
  },

  emptyText: {
    color: 'rgba(241,245,249,0.4)',
  },

  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },

  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#22d3ee',
    marginTop: 6,
  },

  activityText: {
    fontSize: 14,
    color: '#F1F5F9',
  },

  activityDate: {
    fontSize: 12,
    color: 'rgba(241,245,249,0.4)',
  },
};
