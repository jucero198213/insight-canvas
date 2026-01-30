import { BarChart3 } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';

export function Footer() {
  const { tenant } = useTenant();

  return (
    <footer className="bg-primary py-12 border-t border-sidebar-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">{tenant.nome}</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-primary-foreground/60">
            <a href="#" className="hover:text-primary-foreground transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Suporte</a>
          </div>

          <p className="text-sm text-primary-foreground/40">
            © {new Date().getFullYear()} {tenant.nome}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
