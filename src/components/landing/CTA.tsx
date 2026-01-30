import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 hero-gradient relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-info rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Pronto para transformar seus dados em{' '}
            <span className="gradient-text">vantagem competitiva?</span>
          </h2>
          <p className="text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            Entre em contato e descubra como nossa plataforma pode revolucionar 
            a forma como sua empresa consome analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline-light" size="xl" onClick={() => navigate('/solucoes')}>
              Conhecer Planos
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/60">
            <a href="mailto:contato@analyticspro.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Mail className="w-5 h-5" />
              contato@analyticspro.com
            </a>
            <a href="tel:+5511999999999" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Phone className="w-5 h-5" />
              +55 (11) 99999-9999
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
