import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const { success } = await login(email, password);
    if (success) {
      navigate('/portal');
    }
  };

  const inputStyle = (disabled: boolean) => ({
    width: '100%',
    padding: '10px 14px 10px 40px',
    borderRadius: 8,
    border: '1px solid hsla(210,40%,98%,0.2)',
    background: 'hsla(210,40%,98%,0.05)',
    color: 'hsl(210 40% 98%)',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    opacity: disabled ? 0.6 : 1,
  });

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 16,
    height: 16,
    color: 'hsla(210,40%,98%,0.5)',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left Panel - Decorative */}
      <div style={{
        display: 'none',
        width: '50%',
        background: 'linear-gradient(180deg, hsl(217 91% 15%) 0%, hsl(222 47% 11%) 100%)',
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 64px',
      }} className="left-panel">
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: 80, left: 40, width: 288, height: 288,
          background: 'hsl(187 92% 41%)', borderRadius: '50%',
          filter: 'blur(120px)', opacity: 0.1,
        }} />
        <div style={{
          position: 'absolute', bottom: 80, right: 40, width: 384, height: 384,
          background: 'hsl(199 89% 48%)', borderRadius: '50%',
          filter: 'blur(120px)', opacity: 0.1,
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px -10px hsla(187,92%,41%,0.3)',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 16, lineHeight: 1.2 }}>
            Bem-vindo ao seu{' '}
            <span style={{
              background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Portal de Analytics</span>
          </h1>
          <p style={{ fontSize: 18, color: 'hsla(210,40%,98%,0.7)', maxWidth: 400 }}>
            Acesse seus dashboards Power BI de forma segura e personalizada.
          </p>

          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 12, color: 'hsla(210,40%,98%,0.6)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <span style={{ fontSize: 14 }}>Acesso seguro gerenciado pela plataforma</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: 'hsl(222 47% 11%)',
      }}>
        <div style={{ width: '100%', maxWidth: 448 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none',
              color: 'hsla(210,40%,98%,0.5)', fontSize: 14,
              cursor: 'pointer', marginBottom: 32, padding: '8px 0',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Voltar ao início
          </button>

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ display: 'none', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Entrar</h2>
            <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 14 }}>
              Digite suas credenciais para acessar o portal
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: 24, padding: '12px 16px', borderRadius: 8,
              background: 'hsla(0,70%,50%,0.15)', border: '1px solid hsla(0,70%,50%,0.3)',
              color: 'hsl(0 80% 70%)', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'hsla(210,40%,98%,0.8)', marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                  style={inputStyle(isLoading)}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: 'hsla(210,40%,98%,0.8)' }}>Senha</label>
                <Link to="/forgot-password" style={{ fontSize: 13, color: 'hsl(187 92% 41%)', textDecoration: 'none' }}>
                  Esqueceu a senha?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  style={{ ...inputStyle(isLoading), paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'hsla(210,40%,98%,0.5)', cursor: 'pointer', padding: 0,
                  }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" x2="23" y1="1" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} style={{
              marginTop: 8, padding: '12px 24px', borderRadius: 10, border: 'none',
              background: isLoading ? 'hsl(187 50% 35%)' : 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
              color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s', opacity: isLoading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isLoading ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Entrando...
                </>
              ) : 'Entrar'}
            </button>
          </form>

          {/* Security notice */}
          <div style={{
            marginTop: 32, padding: 16, borderRadius: 12,
            background: 'hsla(210,40%,98%,0.03)', border: '1px solid hsla(210,40%,98%,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>Acesso Controlado</p>
                <p style={{ fontSize: 12, color: 'hsla(210,40%,98%,0.5)', lineHeight: 1.5 }}>
                  O acesso é gerenciado pelo administrador da sua empresa. Se você ainda não possui credenciais, entre em contato com seu administrador.
                </p>
              </div>
            </div>
          </div>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'hsla(210,40%,98%,0.5)' }}>
            Problemas para acessar?{' '}
            <Link to="/suporte" style={{ color: 'hsl(187 92% 41%)', textDecoration: 'none' }}>
              Fale com o suporte
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 1024px) {
          .left-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
        @media (max-width: 1023px) {
          .left-panel { display: none !important; }
          .mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
