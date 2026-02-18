import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/clientes', label: 'Clientes', icon: '🏢' },
  { path: '/admin/usuarios', label: 'Usuários', icon: '👥' },
  { path: '/admin/relatorios', label: 'Relatórios', icon: '📈' },
  { path: '/admin/permissoes', label: 'Permissões', icon: '🔐' },
  { path: '/admin/logs', label: 'Logs', icon: '📋' },
];

export default function AdminLayout() {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(222 47% 8%)' }}>
        <p style={{ color: 'hsla(210,40%,98%,0.5)' }}>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin || !user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'hsl(222 47% 8%)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, minHeight: '100vh', position: 'fixed', top: 0, left: 0,
        background: 'hsl(217 91% 12%)', borderRight: '1px solid hsla(210,40%,98%,0.08)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid hsla(210,40%,98%,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
              <p style={{ fontSize: 11, color: 'hsla(210,40%,98%,0.4)', margin: 0 }}>Administração</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8, border: 'none',
                background: isActive ? 'hsla(187,92%,41%,0.15)' : 'transparent',
                color: isActive ? 'hsl(187 92% 41%)' : 'hsla(210,40%,98%,0.6)',
                fontSize: 14, fontWeight: isActive ? 600 : 400, cursor: 'pointer',
                marginBottom: 4, textAlign: 'left',
              }}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid hsla(210,40%,98%,0.08)' }}>
          <button onClick={() => navigate('/portal')} style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: 'hsla(210,40%,98%,0.5)', fontSize: 13, cursor: 'pointer', textAlign: 'left', marginBottom: 4,
          }}>← Voltar ao Portal</button>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: 'hsla(0,70%,60%,0.8)', fontSize: 13, cursor: 'pointer', textAlign: 'left',
          }}>Sair</button>
          <div style={{ marginTop: 12, padding: '8px 12px' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'hsl(210 40% 98%)', margin: 0 }}>{user.nome}</p>
            <p style={{ fontSize: 11, color: 'hsla(210,40%,98%,0.4)', margin: 0 }}>{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 260, flex: 1, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}