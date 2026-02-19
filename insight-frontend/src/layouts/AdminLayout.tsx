import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BarChart3Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);
const LayoutDashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const Building2Icon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const FileTextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);
const ClipboardListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
);

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboardIcon },
  { path: '/admin/clientes', label: 'Clientes', icon: Building2Icon },
  { path: '/admin/usuarios', label: 'Usuários', icon: UsersIcon },
  { path: '/admin/relatorios', label: 'Relatórios', icon: FileTextIcon },
  { path: '/admin/permissoes', label: 'Permissões', icon: ShieldIcon },
  { path: '/admin/logs', label: 'Logs', icon: ClipboardListIcon },
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
              <BarChart3Icon />
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
                <span style={styles.navIcon}><item.icon /></span>
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
