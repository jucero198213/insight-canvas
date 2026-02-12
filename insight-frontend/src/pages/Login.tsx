import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar autenticação real
    navigate('/portal');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, hsl(217 91% 15%) 0%, hsl(222 47% 11%) 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 420, padding: 40, borderRadius: 16,
        background: 'hsla(0,0%,100%,0.05)', backdropFilter: 'blur(12px)',
        border: '1px solid hsla(210,40%,98%,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>AnalyticsPro</h1>
          <p style={{ color: 'hsla(210,40%,98%,0.6)', fontSize: 14 }}>Acesse sua conta para visualizar seus relatórios</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'hsla(210,40%,98%,0.8)', marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="seu@email.com"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '1px solid hsla(210,40%,98%,0.2)', background: 'hsla(210,40%,98%,0.05)',
                color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'hsla(210,40%,98%,0.8)', marginBottom: 6 }}>Senha</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '1px solid hsla(210,40%,98%,0.2)', background: 'hsla(210,40%,98%,0.05)',
                color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button type="submit" style={{
            marginTop: 8, padding: '12px 24px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
            color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Entrar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'hsl(187 92% 41%)', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
