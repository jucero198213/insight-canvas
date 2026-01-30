import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  BarChart3, 
  Check, 
  Crown, 
  Info,
  Shield, 
  Star, 
  Users, 
  Zap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'essencial',
    name: 'Essencial',
    description: 'Para pequenas equipes e primeiros projetos de analytics.',
    icon: Zap,
    featured: false,
    features: [
      '1 cliente (tenant)',
      'Até 10 usuários',
      'Até 5 relatórios Power BI',
      'Power BI Embedded (usuários externos)',
      'Controle de permissões por usuário',
      'Autenticação segura via Azure AD B2C',
    ],
    cta: 'Começar Agora',
    ctaVariant: 'outline' as const,
  },
  {
    id: 'profissional',
    name: 'Profissional',
    description: 'Para empresas que precisam escalar analytics com controle e segurança.',
    icon: Star,
    featured: true,
    badge: 'Recomendado',
    baseText: 'Tudo do Essencial +',
    features: [
      'Até 3 clientes (tenants)',
      'Até 50 usuários',
      'Até 20 relatórios Power BI',
      'White-label (logo e cores por cliente)',
      'Logs de acesso e auditoria',
      'Gestão completa de usuários',
      'Suporte prioritário',
    ],
    cta: 'Agendar Demo',
    ctaVariant: 'hero' as const,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para operações críticas e alto volume de dados.',
    icon: Crown,
    featured: false,
    baseText: 'Tudo do Profissional +',
    features: [
      'Clientes ilimitados',
      'Usuários ilimitados',
      'Relatórios ilimitados',
      'Power BI Embedded dedicado',
      'Isolamento avançado de dados',
      'SLA e suporte dedicado',
      'Customizações sob demanda',
    ],
    cta: 'Falar com Especialista',
    ctaVariant: 'accent' as const,
  },
];

export default function Solucoes() {
  const { tenant } = useTenant();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="hero-gradient">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">{tenant.nome}</span>
            </button>
            <Button 
              variant="outline-light" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </nav>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-primary-foreground/80">Modelo SaaS Enterprise</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 max-w-4xl mx-auto">
            Planos flexíveis para escalar seus dados com{' '}
            <span className="gradient-text">segurança</span>
          </h1>

          <p className="text-xl text-primary-foreground/70 max-w-3xl mx-auto">
            Escolha o plano ideal para acessar e distribuir dashboards Power BI 
            de forma profissional, segura e escalável.
          </p>
        </div>
      </header>

      {/* Plans Section */}
      <section className="py-20 -mt-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={plan.id}
                  className={`relative flex flex-col transition-all duration-300 hover:scale-[1.02] ${
                    plan.featured 
                      ? 'border-accent shadow-elevated ring-2 ring-accent/20 bg-gradient-to-b from-card to-accent/5' 
                      : 'border-border shadow-soft hover:shadow-elevated'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="btn-gradient text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      plan.featured ? 'btn-gradient' : 'bg-muted'
                    }`}>
                      <Icon className={`w-7 h-7 ${plan.featured ? 'text-accent-foreground' : 'text-foreground'}`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {plan.baseText && (
                      <p className="text-sm font-medium text-accent mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {plan.baseText}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.featured ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-sm text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button 
                      variant={plan.ctaVariant}
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (plan.id === 'essencial') {
                          navigate('/login');
                        }
                        // Other CTAs would open contact forms in production
                      }}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Flexibility Message */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Os planos podem ser ajustados conforme a necessidade da sua empresa.
            </p>
          </div>

          {/* Power BI Embedded Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground/70">
            <Info className="w-4 h-4" />
            <span>A capacidade do Power BI Embedded é dimensionada conforme o plano contratado.</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ainda tem dúvidas sobre qual plano escolher?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para entender suas necessidades e indicar a melhor solução 
            para distribuir seus dashboards Power BI com segurança.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button variant="default" size="lg" onClick={() => navigate('/portal')}>
                Acessar Portal
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="default" size="lg" onClick={() => navigate('/login')}>
                Solicitar Acesso
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            <Button variant="outline" size="lg">
              Falar com Consultor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 {tenant.nome}. Plataforma SaaS multi-tenant para distribuição segura de dashboards Power BI.</p>
        </div>
      </footer>
    </main>
  );
}

