import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const { tenant } = useTenant();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between py-6 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">{tenant.nome}</span>
          </div>
          <Button 
            variant="outline-light" 
            size="lg"
            onClick={() => navigate('/login')}
          >
            Acessar Portal
            <ArrowRight className="w-4 h-4" />
          </Button>
        </nav>

        <div className="max-w-4xl mx-auto text-center pt-20">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-primary-foreground/80">Plataforma Enterprise de Analytics</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Dados transformados em{' '}
            <span className="gradient-text">decisões estratégicas</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Acesse dashboards Power BI de forma segura e personalizada. 
            Uma plataforma SaaS completa para sua empresa transformar dados em insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
              Acessar Portal
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline-light" size="xl">
              Conhecer Soluções
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          {[
            {
              icon: BarChart3,
              title: 'Power BI Embedded',
              description: 'Relatórios interativos integrados diretamente na sua aplicação',
            },
            {
              icon: Shield,
              title: 'Segurança Enterprise',
              description: 'Autenticação Azure AD B2C com isolamento total de dados',
            },
            {
              icon: Zap,
              title: 'Multi-Tenant',
              description: 'Personalize a experiência para cada cliente com white-label',
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300 animate-fade-in-up hover:scale-[1.02]"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">{feature.title}</h3>
              <p className="text-primary-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
