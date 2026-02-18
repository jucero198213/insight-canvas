import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/landing/Footer';

const plans = [
  {
    id: 'essencial',
    name: 'Essencial',
    description: 'Para pequenas equipes e primeiros projetos de analytics.',
    featured: false,
    features: [
      '1 cliente (tenant)',
      'Até 10 usuários',
      'Até 5 relatórios Power BI',
      'Power BI Embedded integrado',
      'Controle de permissões por usuário',
      'Autenticação segura gerenciada',
    ],
    cta: 'Começar Agora',
  },
  {
    id: 'profissional',
    name: 'Profissional',
    description: 'Para empresas que precisam escalar analytics com controle e segurança.',
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
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para operações críticas e alto volume de dados.',
    featured: false,
    baseText: 'Tudo do Profissional +',
    features: [
      'Clientes ilimitados',
      'Usuários ilimitados',
      'Relatórios ilimitados',
      'Power BI Embedded dedicado',
      'Isolamento avançado de dados',
      'SLA e suporte dedicado',
      'SSO corporativo opcional',
    ],
    cta: 'Falar com Especialista',
  },
];

export default function Solucoes() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(222 47% 11%)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(180deg, hsl(217 91% 15%) 0%, hsl(222 47% 11%) 100%)',
        paddingBottom: 64,
      }}>
        <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
          </button>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            border: '1px solid hsla(210,40%,98%,0.3)', background: 'transparent',
            color: 'hsl(210 40% 98%)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Voltar
          </button>
        </nav>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'hsla(210,40%,98%,0.1)', borderRadius: 999,
            padding: '6px 16px', marginBottom: 24,
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
            <span style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.8)' }}>Modelo SaaS Enterprise</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 16, lineHeight: 1.1 }}>
            Planos flexíveis para escalar seus dados com{' '}
            <span style={{ backgroundImage: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>segurança</span>
          </h1>
          <p style={{ fontSize: 18, color: 'hsla(210,40%,98%,0.7)', maxWidth: 640, margin: '0 auto' }}>
            Escolha o plano ideal para acessar e distribuir dashboards Power BI de forma profissional, segura e escalável.
          </p>
        </div>
      </header>

      {/* Plans */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              position: 'relative',
              padding: 32, borderRadius: 16,
              background: plan.featured ? 'hsla(187,92%,41%,0.05)' : 'hsla(210,40%,98%,0.03)',
              border: plan.featured ? '2px solid hsl(187 92% 41%)' : '1px solid hsla(210,40%,98%,0.1)',
              display: 'flex', flexDirection: 'column',
            }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))',
                    color: 'hsl(210 40% 98%)', fontSize: 13, fontWeight: 600, padding: '6px 16px', borderRadius: 999,
                  }}>{plan.badge}</span>
                </div>
              )}
              <h3 style={{ fontSize: 24, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 8, textAlign: 'center' }}>{plan.name}</h3>
              <p style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.6)', textAlign: 'center', marginBottom: 24 }}>{plan.description}</p>

              {plan.baseText && (
                <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(187 92% 41%)', marginBottom: 12 }}>{plan.baseText}</p>
              )}

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(142 71% 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.7)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.id === 'essencial' ? navigate('/login') : undefined}
                style={{
                  marginTop: 24, width: '100%', padding: '14px 24px', borderRadius: 10, border: 'none',
                  background: plan.featured
                    ? 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))'
                    : 'hsla(210,40%,98%,0.1)',
                  color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                }}
              >{plan.cta}</button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 14 }}>
            Os planos podem ser ajustados conforme a necessidade da sua empresa.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid hsla(210,40%,98%,0.08)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 12 }}>
          Ainda tem dúvidas sobre qual plano escolher?
        </h2>
        <p style={{ color: 'hsla(210,40%,98%,0.6)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Nossa equipe está pronta para entender suas necessidades e indicar a melhor solução.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '14px 32px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))',
            color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}>Solicitar Acesso</button>
          <button style={{
            padding: '14px 32px', borderRadius: 10,
            border: '1px solid hsla(210,40%,98%,0.3)', background: 'transparent',
            color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}>Falar com Consultor</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}