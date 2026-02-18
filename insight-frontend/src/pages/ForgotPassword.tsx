import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Digite seu email'); return; }

    setIsSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      if (resetError) {
        setError('Erro ao enviar email de recuperação');
      } else {
        setEmailSent(true);
      }
    } catch {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'hsla(142,71%,45%,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(142 71% 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 12 }}>Email enviado!</h2>
          <p style={{ color: 'hsla(210,40%,98%,0.6)', marginBottom: 32 }}>
            Se o email <strong style={{ color: 'hsl(210 40% 98%)' }}>{email}</strong> estiver cadastrado, você receberá instruções para redefinir sua senha.
          </p>
          <button onClick={() => navigate('/login')} style={{ ...styles.submitBtn, background: 'hsla(210,40%,98%,0.1)' }}>
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'hsla(210,40%,98%,0.5)', fontSize: 14, cursor: 'pointer', marginBottom: 32 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Voltar ao login
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Recuperar senha</h2>
        <p style={{ color: 'hsla(210,40%,98%,0.5)', marginBottom: 24 }}>Digite seu email para receber instruções de recuperação</p>

        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: 'hsla(0,70%,50%,0.15)', border: '1px solid hsla(0,70%,50%,0.3)', color: 'hsl(0 80% 70%)', fontSize: 13 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'hsla(210,40%,98%,0.8)', marginBottom: 6 }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="seu@email.com" disabled={isSubmitting} autoComplete="email"
            style={styles.input}
          />
          <button type="submit" disabled={isSubmitting} style={{ ...styles.submitBtn, marginTop: 24, opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Enviando...' : 'Enviar email de recuperação'}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'hsla(210,40%,98%,0.5)' }}>
          Lembrou a senha?{' '}
          <Link to="/login" style={{ color: 'hsl(187 92% 41%)', textDecoration: 'none' }}>Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(222 47% 11%)', padding: 32, fontFamily: "'Inter', system-ui, sans-serif" },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid hsla(210,40%,98%,0.2)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  submitBtn: { width: '100%', padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
};