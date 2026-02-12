import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: 'hsl(217 91% 20%)', padding: '48px 0',
      borderTop: '1px solid hsl(215 25% 30%)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Top row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32, fontSize: 14, color: 'hsla(210,40%,98%,0.7)' }}>
              <a href="mailto:contato@analyticspro.com.br" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'hsl(210 40% 98%)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'hsla(210,40%,98%,0.7)'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                contato@analyticspro.com.br
              </a>
              <a href="tel:+5519982971573" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'hsl(210 40% 98%)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'hsla(210,40%,98%,0.7)'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                (19) 98297-1573
              </a>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            borderTop: '1px solid hsla(210,40%,98%,0.1)', paddingTop: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, color: 'hsla(210,40%,98%,0.6)' }}>
              <a href="/termos" onClick={e => { e.preventDefault(); navigate('/termos'); }} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'hsl(210 40% 98%)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'hsla(210,40%,98%,0.6)'; }}
              >Termos de Uso</a>
              <a href="/privacidade" onClick={e => { e.preventDefault(); navigate('/privacidade'); }} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'hsl(210 40% 98%)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'hsla(210,40%,98%,0.6)'; }}
              >Privacidade</a>
              <a href="/suporte" onClick={e => { e.preventDefault(); navigate('/suporte'); }} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'hsl(210 40% 98%)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'hsla(210,40%,98%,0.6)'; }}
              >Suporte</a>
            </div>
            <p style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.4)' }}>
              © {new Date().getFullYear()} AnalyticsPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
