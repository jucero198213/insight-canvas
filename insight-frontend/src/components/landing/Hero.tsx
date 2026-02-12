import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, hsl(217 91% 15%) 0%, hsl(222 47% 11%) 100%)',
      overflow: 'hidden',
    }}>
      {/* Background blurs */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
        <div style={{
          position: 'absolute', top: 80, left: 40, width: 288, height: 288,
          background: 'hsl(187 92% 41%)', borderRadius: '50%', filter: 'blur(48px)',
          animation: 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: 80, right: 40, width: 384, height: 384,
          background: 'hsl(199 89% 48%)', borderRadius: '50%', filter: 'blur(48px)',
          animation: 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite', animationDelay: '2s',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600, background: 'hsla(187,92%,41%,0.3)', borderRadius: '50%', filter: 'blur(48px)',
        }} />
      </div>

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '128px 24px 80px' }}>
        {/* Nav */}
        <nav style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'hsl(210 40% 98%)', letterSpacing: '-0.02em' }}>AnalyticsPro</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 10,
              border: '1px solid hsla(210,40%,98%,0.3)', background: 'transparent',
              color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'hsla(210,40%,98%,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Acessar Portal
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </nav>

        {/* Content */}
        <div style={{ maxWidth: 896, margin: '0 auto', textAlign: 'center', paddingTop: 80 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'hsla(210,40%,98%,0.1)', backdropFilter: 'blur(8px)',
            border: '1px solid hsla(210,40%,98%,0.2)', borderRadius: 999,
            padding: '8px 16px', marginBottom: 32,
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 12.95 10H20a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11.05 14z"/></svg>
            <span style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.8)' }}>Plataforma Enterprise de Analytics</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 24, lineHeight: 1.1 }}>
            Dados transformados em{' '}
            <span style={{
              backgroundImage: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>decisões estratégicas</span>
          </h1>

          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'hsla(210,40%,98%,0.7)', marginBottom: 48, maxWidth: 768, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Acesse dashboards Power BI de forma segura e personalizada. 
            Uma plataforma SaaS completa para sua empresa transformar dados em insights.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
                color: 'hsl(210 40% 98%)', fontSize: 18, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 20px hsla(187,92%,41%,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Acessar Portal
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <button
              onClick={() => navigate('/solucoes')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 10,
                border: '1px solid hsla(210,40%,98%,0.3)', background: 'transparent',
                color: 'hsl(210 40% 98%)', fontSize: 18, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'hsla(210,40%,98%,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Conhecer Soluções
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 96, maxWidth: 1080, margin: '96px auto 0' }}>
          {[
            {
              title: 'Power BI Embedded',
              description: 'Relatórios interativos integrados diretamente na sua aplicação',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
              ),
            },
            {
              title: 'Acesso Seguro',
              description: 'Autenticação gerenciada pela plataforma com controle total de usuários',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
              ),
            },
            {
              title: 'Multi-Tenant',
              description: 'Personalize a experiência para cada cliente com white-label completo',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              ),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: 24, borderRadius: 16,
                background: 'hsla(210,40%,98%,0.05)', backdropFilter: 'blur(8px)',
                border: '1px solid hsla(210,40%,98%,0.1)',
                transition: 'all 0.3s', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'hsla(210,40%,98%,0.1)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'hsla(210,40%,98%,0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, transition: 'transform 0.3s',
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ color: 'hsla(210,40%,98%,0.6)', lineHeight: 1.5 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
