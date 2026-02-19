import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section style={{
      padding: '96px 0', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, hsl(217 91% 15%) 0%, hsl(222 47% 11%) 100%)',
    }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 500, height: 500, background: 'hsl(187 92% 41%)', borderRadius: '50%', filter: 'blur(48px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 400, height: 400, background: 'hsl(199 89% 48%)', borderRadius: '50%', filter: 'blur(48px)' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 24 }}>
            Pronto para transformar seus dados em{' '}
            <span style={{
              backgroundImage: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>vantagem competitiva?</span>
          </h2>
          <p style={{ fontSize: 20, color: 'hsla(210,40%,98%,0.7)', marginBottom: 40, maxWidth: 640, margin: '0 auto 40px' }}>
            Entre em contato e descubra como nossa plataforma pode revolucionar 
            a forma como sua empresa consome analytics.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 64 }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
                color: 'hsl(210 40% 98%)', fontSize: 18, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 20px hsla(187,92%,41%,0.3)', transition: 'transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Começar Agora
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <button
              onClick={() => navigate('/solucoes')}
              style={{
                padding: '14px 32px', borderRadius: 10,
                border: '1px solid hsla(210,40%,98%,0.3)', background: 'transparent',
                color: 'hsl(210 40% 98%)', fontSize: 18, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'hsla(210,40%,98%,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Conhecer Planos
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 32, color: 'hsla(210,40%,98%,0.6)' }}>
            <a href="mailto:contato@analyticspro.com.br" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'hsl(210 40% 98%)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'hsla(210,40%,98%,0.6)'; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              contato@analyticspro.com
            </a>
            <a href="tel:(19)98297-1573" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'hsl(210 40% 98%)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'hsla(210,40%,98%,0.6)'; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +55 (11) 99999-9999
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
