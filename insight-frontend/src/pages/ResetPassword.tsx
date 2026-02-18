import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
      } else {
        const timeout = setTimeout(() => {
          navigate('/login');
        }, 3000);
        return () => clearTimeout(timeout);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setHasSession(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError('Senha deve ter no mínimo 8 caracteres'); return; }
    if (password !== confirmPassword) { setError('As senhas não coincidem'); return; }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('Erro ao atualizar senha');
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError('Erro ao atualizar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'hsla(142,71%,45%,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(142 71% 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 12 }}>Senha atualizada!</h2>
          <p style={{ color: 'hsla(210,40%,98%,0.6)', marginBottom: 32 }}>Sua senha foi alterada com sucesso.</p>
          <button onClick={() => navigate('/login')} style={styles.submitBtn}>Ir para o login</button>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div style={styles.page}>
        <p style={{ color: 'hsla(210,40%,98%,0.5)' }}>Verificando link de recuperação...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Nova senha</h2>
        <p style={{ color: 'hsla(210,40%,98%,0.5)', marginBottom: 24 }}>Digite sua nova senha abaixo</p>

        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: 'hsla(0,70%,50%,0.15)', border: '1px solid hsla(0,70%,50%,0.3)', color: 'hsl(0 80% 70%)', fontSize: 13 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={styles.label}>Nova senha</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" disabled={isSubmitting} autoComplete="new-password" style={styles.input} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'hsla(210,40%,98%,0.5)', cursor: 'pointer' }}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'hsla(210,40%,98%,0.4)', marginTop: 4 }}>Mínimo 8 caracteres</p>
          </div>

          <div>
            <label style={styles.label}>Confirmar nova senha</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" disabled={isSubmitting} autoComplete="new-password" style={styles.input} />
          </div>

          <button type="submit" disabled={isSubmitting} style={{ ...styles.submitBtn, marginTop: 8, opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Atualizando...' : 'Atualizar senha'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(222 47% 11%)', padding: 32, fontFamily: "'Inter', system-ui, sans-serif" },
  label: { display: 'block', fontSize: 14, fontWeight: 500, color: 'hsla(210,40%,98%,0.8)', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid hsla(210,40%,98%,0.2)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  submitBtn: { width: '100%', padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', color: 'hsl(210 40% 98%)', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
};