import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { Footer } from '@/components/landing/Footer';

export default function Termos() {
  const { tenant } = useTenant();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary/95 backdrop-blur-sm border-b border-sidebar-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">{tenant.nome}</span>
            </div>
            <Button variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Termos de Uso</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-lg">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma {tenant.nome}, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Descrição do Serviço</h2>
            <p>
              O {tenant.nome} é uma plataforma SaaS (Software as a Service) que oferece serviços de analytics e visualização de dados através de dashboards Power BI integrados. Nosso serviço permite que empresas distribuam relatórios e insights de dados de forma segura para seus usuários autorizados.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Cadastro e Conta</h2>
            <p>
              Para utilizar nossos serviços, é necessário criar uma conta através de um processo de cadastro autorizado. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Uso Aceitável</h2>
            <p>
              Você concorda em utilizar a plataforma apenas para fins legítimos e de acordo com estes termos. É proibido:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Compartilhar credenciais de acesso com terceiros não autorizados</li>
              <li>Tentar acessar áreas ou dados não autorizados</li>
              <li>Utilizar a plataforma para fins ilegais ou não autorizados</li>
              <li>Interferir ou interromper o funcionamento da plataforma</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo, software e tecnologia disponibilizados através da plataforma são de propriedade do {tenant.nome} ou de seus licenciadores. Os relatórios e dados específicos de cada cliente permanecem de propriedade do respectivo cliente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Limitação de Responsabilidade</h2>
            <p>
              O {tenant.nome} não se responsabiliza por danos indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso da plataforma. Nossa responsabilidade está limitada ao valor pago pelo serviço contratado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas aos usuários com antecedência razoável. O uso continuado da plataforma após modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato através do e-mail: contato@analyticspro.com.br ou telefone: (19) 98297-1573.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
