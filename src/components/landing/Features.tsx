import { 
  BarChart3, 
  Shield, 
  Users, 
  Palette, 
  Database, 
  Lock,
  Globe,
  Layers
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Dashboards Power BI totalmente integrados com visualizações interativas e em tempo real.',
  },
  {
    icon: Shield,
    title: 'Acesso Seguro',
    description: 'Autenticação própria com controle centralizado de credenciais e sessões.',
  },
  {
    icon: Users,
    title: 'Gestão de Usuários',
    description: 'Controle granular de permissões por usuário e por relatório com isolamento de dados.',
  },
  {
    icon: Palette,
    title: 'White-Label',
    description: 'Personalize cores, logo e identidade visual para cada cliente da sua plataforma.',
  },
  {
    icon: Database,
    title: 'Multi-Tenant',
    description: 'Arquitetura SaaS com isolamento total de dados entre diferentes clientes.',
  },
  {
    icon: Lock,
    title: 'Auditoria Completa',
    description: 'Logs detalhados de todos os acessos para compliance e análise de uso.',
  },
  {
    icon: Globe,
    title: 'Acesso Simplificado',
    description: 'Usuários acessam relatórios sem precisar de conta Microsoft ou licença Power BI.',
  },
  {
    icon: Layers,
    title: 'Escalabilidade',
    description: 'Infraestrutura cloud preparada para crescimento com alta disponibilidade.',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Recursos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tudo que você precisa para{' '}
            <span className="gradient-text">escalar seu BI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma completa para distribuir analytics de forma segura e escalável
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl glass-card hover:shadow-elevated transition-all duration-300 animate-fade-in-up hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
