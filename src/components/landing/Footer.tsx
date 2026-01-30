import { BarChart3, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';

export function Footer() {
  const { tenant } = useTenant();

  return (
    <footer className="bg-primary py-12 border-t border-sidebar-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-8">
          {/* Top row - Logo and Contact */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">{tenant.nome}</span>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-primary-foreground/70">
              <a 
                href="mailto:contato@analyticspro.com.br" 
                className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                contato@analyticspro.com.br
              </a>
              <a 
                href="tel:+5519982971573" 
                className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                (19) 98297-1573
              </a>
            </div>
          </div>

          {/* Middle row - Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-primary-foreground/10 pt-6">
            <div className="flex items-center gap-8 text-sm text-primary-foreground/60">
              <Link to="/termos" className="hover:text-primary-foreground transition-colors">Termos de Uso</Link>
              <Link to="/privacidade" className="hover:text-primary-foreground transition-colors">Privacidade</Link>
              <Link to="/suporte" className="hover:text-primary-foreground transition-colors">Suporte</Link>
            </div>

            <p className="text-sm text-primary-foreground/40">
              © {new Date().getFullYear()} {tenant.nome}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
