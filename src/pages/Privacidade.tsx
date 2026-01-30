import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { Footer } from '@/components/landing/Footer';

export default function Privacidade() {
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
        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-lg">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Introdução</h2>
            <p>
              A {tenant.nome} está comprometida em proteger a privacidade e os dados pessoais de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Dados Coletados</h2>
            <p>
              Coletamos os seguintes tipos de dados:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de identificação:</strong> nome, e-mail, empresa</li>
              <li><strong>Dados de acesso:</strong> logs de login, horários de acesso, IP de origem</li>
              <li><strong>Dados de uso:</strong> relatórios acessados, interações com dashboards</li>
              <li><strong>Dados técnicos:</strong> tipo de dispositivo, navegador, sistema operacional</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Finalidade do Tratamento</h2>
            <p>
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer acesso à plataforma e seus serviços</li>
              <li>Autenticar e autorizar usuários</li>
              <li>Garantir a segurança e integridade do sistema</li>
              <li>Gerar logs de auditoria e compliance</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Comunicar sobre atualizações e novidades do serviço</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Base Legal</h2>
            <p>
              O tratamento de dados é realizado com base em:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Execução de contrato de prestação de serviços</li>
              <li>Cumprimento de obrigações legais e regulatórias</li>
              <li>Legítimo interesse da empresa</li>
              <li>Consentimento do titular, quando aplicável</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Compartilhamento de Dados</h2>
            <p>
              Seus dados podem ser compartilhados com:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provedores de infraestrutura em nuvem (Microsoft Azure)</li>
              <li>Serviços de autenticação (Azure AD B2C)</li>
              <li>Autoridades competentes, quando exigido por lei</li>
            </ul>
            <p>
              Não comercializamos ou compartilhamos seus dados com terceiros para fins de marketing.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia em trânsito e em repouso</li>
              <li>Controle de acesso baseado em funções</li>
              <li>Monitoramento e logs de segurança</li>
              <li>Backups regulares</li>
              <li>Isolamento de dados entre clientes (multi-tenant)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Seus Direitos</h2>
            <p>
              Conforme a LGPD, você tem direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar anonimização ou eliminação de dados</li>
              <li>Revogar consentimento</li>
              <li>Solicitar portabilidade dos dados</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Retenção de Dados</h2>
            <p>
              Mantemos seus dados pelo período necessário para cumprir as finalidades descritas ou conforme exigido por lei. Logs de acesso são mantidos por período mínimo determinado por regulamentações aplicáveis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Contato</h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
            </p>
            <ul className="list-none space-y-1">
              <li><strong>E-mail:</strong> contato@analyticspro.com.br</li>
              <li><strong>Telefone:</strong> (19) 98297-1573</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
