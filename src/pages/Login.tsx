import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const { tenant } = useTenant();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal');
    }
  }, [isAuthenticated, navigate]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogin = async () => {
    setIsLoginInProgress(true);
    clearError();

    try {
      const success = await login();
      if (success) {
        toast.success('Login realizado com sucesso!');
        navigate('/portal');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoginInProgress(false);
    }
  };

  const loading = isLoading || isLoginInProgress;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-info rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-accent-foreground" />
            </div>
            <span className="text-3xl font-bold text-primary-foreground">{tenant.nome}</span>
          </div>

          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Bem-vindo ao seu{' '}
            <span className="gradient-text">Portal de Analytics</span>
          </h1>
          <p className="text-xl text-primary-foreground/70 max-w-md">
            Acesse seus dashboards Power BI de forma segura e personalizada.
          </p>

          <div className="mt-12 flex items-center gap-3 text-primary-foreground/60">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm">Autenticação segura via Microsoft Entra ID</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            className="mb-8 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">{tenant.nome}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Entrar</h2>
            <p className="text-muted-foreground">
              Clique no botão abaixo para autenticar com sua conta Microsoft
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleLogin} 
            variant="hero" 
            size="xl" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <svg 
                  className="w-5 h-5 mr-2" 
                  viewBox="0 0 21 21" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                Entrar com Microsoft
              </>
            )}
          </Button>

          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Autenticação Empresarial
                </p>
                <p className="text-xs text-muted-foreground">
                  Utilize sua conta corporativa Microsoft para acessar o portal. 
                  Suas credenciais são verificadas diretamente pelo Microsoft Entra ID.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Problemas para acessar?{' '}
            <a href="/suporte" className="text-accent hover:underline">
              Fale com o suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
