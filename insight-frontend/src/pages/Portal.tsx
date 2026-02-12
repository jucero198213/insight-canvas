import { useNavigate } from 'react-router-dom';

export default function Portal() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, hsl(217 91% 15%) 0%, hsl(222 47% 11%) 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 12 }}>Portal do Cliente</h1>
        <p style={{ color: 'hsla(210,40%,98%,0.6)', fontSize: 16, marginBottom: 32 }}>
          Seus relatórios e dashboards estarão disponíveis aqui.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
            color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
