import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import PowerBIReport from '../components/PowerBIEmbed';

interface Relatorio {
  id: string;
  nome: string;
  descricao: string | null;
  report_id: string;
  dataset_id: string | null;
  cliente_id: string;
  status: string;
}

function deriveReportKey(nome: string): string {
  const lower = nome.toLowerCase();
  if (lower.includes('dre')) return 'dre';
  if (lower.includes('compra')) return 'compras';
  return 'financeiro';
}

export default function Portal() {
  const { user, isAuthenticated, isAdmin, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<Relatorio[]>([]);
  const [selectedReport, setSelectedReport] = useState<Relatorio | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAuthenticated) return;

    const fetchReports = async () => {
      try {
        setIsLoading(true);
        if (isAdmin) {
          const { data, error } = await supabase
            .from('relatorios')
            .select('*')
            .eq('status', 'ativo')
            .order('nome');
          if (error) throw error;
          setReports(data || []);
        } else {
          const { data: permissoes, error: permError } = await supabase
            .from('permissoes')
            .select('relatorio_id');
          if (permError) throw permError;
          const reportIds = permissoes?.map((p: any) => p.relatorio_id) || [];
          if (reportIds.length > 0) {
            const { data, error } = await supabase
              .from('relatorios')
              .select('*')
              .in('id', reportIds)
              .eq('status', 'ativo')
              .order('nome');
            if (error) throw error;
            setReports(data || []);
          } else {
            setReports([]);
          }
        }
      } catch (error: any) {
        console.error('[Portal] Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const filteredReports = reports.filter(r =>
    r.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p style={{ color: 'hsla(210,40%,98%,0.5)', marginTop: 16 }}>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={styles.logoIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: 'hsl(210 40% 98%)', margin: 0 }}>{user.cliente_nome || 'Analytics Pro'}</h1>
              <p style={{ fontSize: 13, color: 'hsla(210,40%,98%,0.5)', margin: 0 }}>Portal de Analytics</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isAdmin && (
              <button onClick={() => navigate('/admin')} style={styles.adminBtn} className="hide-mobile">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                Administração
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid hsla(210,40%,98%,0.1)' }}>
              <div className="hide-mobile" style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'hsl(210 40% 98%)', margin: 0 }}>{user.nome}</p>
                <p style={{ fontSize: 12, color: 'hsla(210,40%,98%,0.5)', margin: 0 }}>{user.email}</p>
              </div>
              <div style={styles.avatar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        {/* Search & View Toggle */}
        <div style={styles.toolbar}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsla(210,40%,98%,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              placeholder="Buscar relatórios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.viewToggle}>
            <button onClick={() => setViewMode('grid')} style={{ ...styles.viewBtn, background: viewMode === 'grid' ? 'hsla(210,40%,98%,0.1)' : 'transparent' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <button onClick={() => setViewMode('list')} style={{ ...styles.viewBtn, background: viewMode === 'list' ? 'hsla(210,40%,98%,0.1)' : 'transparent' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Seus Relatórios</h2>
          <p style={{ color: 'hsla(210,40%,98%,0.5)', fontSize: 15, margin: 0 }}>
            {isLoading ? 'Carregando...' : `${filteredReports.length} relatório${filteredReports.length !== 1 ? 's' : ''} disponíve${filteredReports.length !== 1 ? 'is' : 'l'}`}
          </p>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: 16, background: 'hsla(210,40%,98%,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsla(210,40%,98%,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Nenhum relatório encontrado</h3>
            <p style={{ color: 'hsla(210,40%,98%,0.5)', maxWidth: 400 }}>
              {searchQuery
                ? 'Tente uma busca diferente ou limpe o filtro.'
                : 'Você ainda não possui relatórios atribuídos. Entre em contato com o administrador.'}
            </p>
          </div>
        ) : (
          <div style={viewMode === 'grid'
            ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }
            : { display: 'flex', flexDirection: 'column' as const, gap: 16 }
          }>
            {filteredReports.map((report) => (
              <div key={report.id} style={styles.reportCard}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={styles.reportIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                    background: report.status === 'ativo' ? 'hsla(142,71%,45%,0.1)' : 'hsla(210,40%,98%,0.05)',
                    color: report.status === 'ativo' ? 'hsl(142 71% 45%)' : 'hsla(210,40%,98%,0.5)',
                  }}>
                    {report.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>{report.nome}</h3>
                {report.descricao && (
                  <p style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.5)', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{report.descricao}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'hsla(210,40%,98%,0.4)', marginBottom: 16 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Atualizado recentemente</span>
                </div>
                <button onClick={() => setSelectedReport(report)} style={styles.openReportBtn}>
                  Abrir Relatório
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* PowerBI Embed Modal */}
      {selectedReport && (
        <div style={styles.modal}>
          <div style={styles.modalHeader}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'hsl(210 40% 98%)', margin: 0 }}>{selectedReport.nome}</h2>
              {selectedReport.descricao && (
                <p style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.5)', margin: '4px 0 0' }}>{selectedReport.descricao}</p>
              )}
            </div>
            <button onClick={() => setSelectedReport(null)} style={styles.closeBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <PowerBIReport reportKey={deriveReportKey(selectedReport.nome)} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        input:focus {
          border-color: hsl(187 92% 41%) !important;
          box-shadow: 0 0 0 2px hsla(187,92%,41%,0.2) !important;
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'hsl(222 47% 8%)', fontFamily: "'Inter', system-ui, sans-serif" },
  loadingContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'hsl(222 47% 8%)' },
  header: { position: 'sticky', top: 0, zIndex: 40, background: 'hsla(222,47%,10%,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid hsla(210,40%,98%,0.08)' },
  headerInner: { maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoIcon: { width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  adminBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.1)', background: 'transparent', color: 'hsl(210 40% 98%)', fontSize: 14, cursor: 'pointer' },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: 'hsla(187,92%,41%,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { background: 'none', border: 'none', color: 'hsla(210,40%,98%,0.5)', cursor: 'pointer', padding: 4 },
  main: { maxWidth: 1280, margin: '0 auto', padding: '32px 24px' },
  toolbar: { display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' as const },
  searchInput: { width: '100%', padding: '12px 12px 12px 48px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.1)', background: 'hsla(210,40%,98%,0.05)', color: 'hsl(210 40% 98%)', fontSize: 15, outline: 'none', boxSizing: 'border-box' as const },
  viewToggle: { display: 'flex', alignItems: 'center', gap: 4, background: 'hsla(210,40%,98%,0.05)', borderRadius: 10, padding: 4 },
  viewBtn: { padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', color: 'hsla(210,40%,98%,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  reportCard: { padding: 24, borderRadius: 16, background: 'hsla(210,40%,98%,0.03)', border: '1px solid hsla(210,40%,98%,0.08)', transition: 'all 0.3s' },
  reportIcon: { width: 56, height: 56, borderRadius: 12, background: 'hsla(187,92%,41%,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  openReportBtn: { width: '100%', padding: '12px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', color: 'hsl(210 40% 98%)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  modal: { position: 'fixed', inset: 0, zIndex: 50, background: 'hsl(222 47% 8%)', display: 'flex', flexDirection: 'column' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid hsla(210,40%,98%,0.08)', background: 'hsla(222,47%,10%,0.9)' },
  closeBtn: { background: 'none', border: 'none', color: 'hsla(210,40%,98%,0.6)', cursor: 'pointer', padding: 8 },
};
