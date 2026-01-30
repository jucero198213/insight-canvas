import { StatsCard } from '@/components/admin/StatsCard';
import { mockClientes, mockUsuarios, mockRelatorios, mockLogs } from '@/data/mockData';
import { Building2, Users, FileText, Activity, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const activeClients = mockClientes.filter(c => c.status === 'ativo').length;
  const activeUsers = mockUsuarios.filter(u => u.status === 'ativo').length;
  const activeReports = mockRelatorios.filter(r => r.status === 'ativo').length;
  const recentLogs = mockLogs.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Building2}
          label="Clientes Ativos"
          value={activeClients}
          change="+12%"
          trend="up"
        />
        <StatsCard
          icon={Users}
          label="Usuários Ativos"
          value={activeUsers}
          change="+8%"
          trend="up"
        />
        <StatsCard
          icon={FileText}
          label="Relatórios Ativos"
          value={activeReports}
          change="+5%"
          trend="up"
        />
        <StatsCard
          icon={Activity}
          label="Acessos Hoje"
          value={recentLogs}
          trend="neutral"
        />
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Relatórios Mais Acessados</h3>
              <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
            </div>
          </div>
          <div className="space-y-4">
            {mockRelatorios.slice(0, 4).map((report, index) => (
              <div key={report.id_relatorio} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium text-foreground">{report.nome_relatorio}</span>
                </div>
                <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100) + 20} acessos</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Atividade Recente</h3>
              <p className="text-sm text-muted-foreground">Últimos eventos</p>
            </div>
          </div>
          <div className="space-y-4">
            {mockLogs.slice(0, 4).map((log) => {
              const user = mockUsuarios.find(u => u.id_usuario === log.id_usuario);
              return (
                <div key={log.id_log} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{user?.nome}</span> realizou {log.tipo_evento}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.data_hora_acesso).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
