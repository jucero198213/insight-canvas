import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'hsl(222 47% 11%)', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <h1 style={{ fontSize: 72, fontWeight: 700, color: 'hsl(187 92% 41%)', marginBottom: 8 }}>404</h1>
      <p style={{ fontSize: 20, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Página não encontrada</p>
      <p style={{ color: 'hsla(210,40%,98%,0.5)', marginBottom: 32 }}>A página que você procura não existe.</p>
      <button onClick={() => navigate('/')} style={{
        padding: '12px 24px', borderRadius: 10, border: 'none',
        background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))',
        color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
      }}>Voltar ao início</button>
    </div>
  );
}