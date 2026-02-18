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
      <div style={styles.loading}>
        <p style={styles.loadingText}>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin || !user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoBlock}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              📊
            </div>
            <div>
              <span style={styles.logoTitle}>AnalyticsPro</span>
              <p style={styles.logoSubtitle}>Administração</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map(item => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={styles.bottom}>
          <button style={styles.secondaryBtn} onClick={() => navigate('/portal')}>
            ← Voltar ao Portal
          </button>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Sair
          </button>

          <div style={styles.userBox}>
            <p style={styles.userName}>{user.nome}</p>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0B1220',
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  sidebar: {
    width: 260,
    minHeight: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    background: '#0F172A',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
  },

  logoBlock: {
    padding: '22px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },

  logoTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#F1F5F9',
  },

  logoSubtitle: {
    fontSize: 11,
    color: 'rgba(241,245,249,0.4)',
    margin: 0,
  },

  nav: {
    flex: 1,
    padding: '16px 12px',
  },

  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 12px',
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: 'rgba(241,245,249,0.6)',
    fontSize: 14,
    cursor: 'pointer',
    marginBottom: 6,
    textAlign: 'left',
    transition: 'all .18s ease',
  },

  navItemActive: {
    background: 'rgba(59,130,246,0.15)',
    color: '#60A5FA',
    fontWeight: 600,
  },

  navIcon: {
    fontSize: 16,
  },

  bottom: {
    padding: '16px 12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },

  secondaryBtn: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: 'rgba(241,245,249,0.5)',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: 4,
  },

  logoutBtn: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: '#f87171',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left',
  },

  userBox: {
    marginTop: 12,
    padding: '8px 12px',
  },

  userName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#F1F5F9',
    margin: 0,
  },

  userEmail: {
    fontSize: 11,
    color: 'rgba(241,245,249,0.4)',
    margin: 0,
  },

  main: {
    marginLeft: 260,
    flex: 1,
    padding: 32,
    background: '#0B1220',
  },

  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0B1220',
  },

  loadingText: {
    color: 'rgba(241,245,249,0.5)',
  },
};
