import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { RelatorioPowerBI } from '@/types';
import { mockRelatorios, mockPermissoes } from '@/data/mockData';
import { ReportCard } from '@/components/portal/ReportCard';
import { PowerBIEmbed } from '@/components/portal/PowerBIEmbed';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  LogOut, 
  User, 
  Settings,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Portal() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { tenant } = useTenant();
  const navigate = useNavigate();

  const [reports, setReports] = useState<RelatorioPowerBI[]>([]);
  const [selectedReport, setSelectedReport] = useState<RelatorioPowerBI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Filter reports based on user permissions
    if (user) {
      const userPermissions = mockPermissoes.filter(p => p.id_usuario === user.id);
      const allowedReportIds = userPermissions.map(p => p.id_relatorio);
      
      // Admin sees all reports for their client
      const filteredReports = isAdmin 
        ? mockRelatorios.filter(r => r.id_cliente === user.cliente_id)
        : mockRelatorios.filter(r => allowedReportIds.includes(r.id_relatorio));
      
      setReports(filteredReports);
    }
  }, [isAuthenticated, user, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredReports = reports.filter(r => 
    r.nome_relatorio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{tenant.nome}</h1>
                <p className="text-sm text-muted-foreground">Portal de Analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin')}
                  className="hidden md:flex"
                >
                  <Settings className="w-4 h-4" />
                  Administração
                </Button>
              )}
              
              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground">{user.nome}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar relatórios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Seus Relatórios</h2>
          <p className="text-muted-foreground">
            {filteredReports.length} relatório{filteredReports.length !== 1 ? 's' : ''} disponíve{filteredReports.length !== 1 ? 'is' : 'l'}
          </p>
        </div>

        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-muted-foreground max-w-md">
              {searchQuery 
                ? 'Tente uma busca diferente ou limpe o filtro.'
                : 'Você ainda não possui relatórios atribuídos. Entre em contato com o administrador.'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredReports.map((report, index) => (
              <div key={report.id_relatorio} style={{ animationDelay: `${index * 0.05}s` }}>
                <ReportCard report={report} onOpen={setSelectedReport} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Power BI Embed Modal */}
      {selectedReport && (
        <PowerBIEmbed 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
}
