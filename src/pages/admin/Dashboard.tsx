import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/admin/StatsCard';
import {
  Building2,
  Users,
  FileText,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';

interface TopRelatorio {
  nome: string;
  total: number;
}

interface LogRecente {
  id: string;
  tipo_evento: string;
  created_at: string;
  usuario_nome?: string;
  relatorio_nome?: string;
}

export default function AdminDashboard() {
  const [clientesAtivos, setClientesAtivos] = useState(0);
  const [usuariosAtivos, setUsuariosAtivos] = useState(0);
  const [relatoriosAtivos, setRelatoriosAtivos] = useState(0);
  const [acessosHoje, setAcessosHoje] = useState(0);
  const [topRelatorios, setTopRelatorios] = useState<TopRelatorio[]>([]);
  const [logsRecentes, setLogsRecentes] = useState<LogRecente[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    await Promise.all([
      fetchStats(),
      fetchTopRelatorios(),
      fetchLogsRecentes(),
    ]);
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    const [{ count: c }, { count: u }, { count: r }, { count: l }] =
      await Promise.all([
        supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase.from('relatorios').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase
          .from('logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', `${today}T00:00:00`)
      ]);

    setClientesAtivos(c || 0);
    setUsuariosAtivos(u || 0);
    setRelatoriosAtivos(r || 0);
    setAcessosHoje(l || 0);
  };

  const fetchTopRelatorios = async () => {
    const { data } = await supabase.rpc('top_relatorios_30_dias');

    if (!data) return;

    setTopRelatorios(
      data.map((r: any) => ({
        nome: r.nome,
        total: r.total,
      }))
    );
  };

  const fetchLogsRecentes = async () => {
    const { data } = await supabase
      .from('logs')
      .select(`
        id,
        tipo_evento,
        created_at,
        usuarios ( nome ),
        relatorios ( nome )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!data) return;

    setLogsRecentes(
      data.map(l => ({
        id: l.id,
        tipo_evento: l.tipo_evento,
        created_at: l.created_at,
        usuario_nome: (l.usuarios as any)?.nome || '-',
        relatorio_nome: (l.relatorios as any)?.nome || '-',
      }))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Building2}
          label="Clientes Ativos"
          value={clientesAtivos}
          trend="up"
        />
        <StatsCard
          icon={Users}
          label="Usuários Ativos"
          value={usuariosAtivos}
          trend="up"
        />
        <StatsCard
          icon={FileText}
          label="Relatórios Ativos"
          value={relatoriosAtivos}
          trend="up"
        />
        <StatsCard
          icon={Activity}
          label="Acessos Hoje"
          value={acessosHoje}
          trend="neutral"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Relatórios */}
        <div className="p-6 rounded-2xl glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Relatórios Mais Acessados
              </h3>
              <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
            </div>
          </div>

          <div className="space-y-4">
            {topRelatorios.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {i + 1}. {r.nome}
                </span>
                <span className="text-sm text-muted-foreground">
                  {r.total} acessos
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Logs Recentes */}
        <div className="p-6 rounded-2xl glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Atividade Recente
              </h3>
              <p className="text-sm text-muted-foreground">Últimos eventos</p>
            </div>
          </div>

          <div className="space-y-4">
            {logsRecentes.map(log => (
              <div key={log.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">
                      {log.usuario_nome}
                    </span>{' '}
                    realizou {log.tipo_evento}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
