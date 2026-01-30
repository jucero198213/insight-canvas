import { ArrowLeft, BarChart3, Mail, Phone, Clock, MessageCircle, FileText, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenant } from '@/contexts/TenantContext';
import { Footer } from '@/components/landing/Footer';

export default function Suporte() {
  const { tenant } = useTenant();
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: Mail,
      title: 'E-mail',
      description: 'Envie sua dúvida ou solicitação',
      contact: 'contato@analyticspro.com.br',
      action: 'mailto:contato@analyticspro.com.br',
    },
    {
      icon: Phone,
      title: 'Telefone',
      description: 'Fale diretamente com nossa equipe',
      contact: '(19) 98297-1573',
      action: 'tel:+5519982971573',
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      description: 'Segunda a Sexta',
      contact: '09:00 às 18:00',
      action: null,
    },
  ];

  const faqItems = [
    {
      icon: HelpCircle,
      question: 'Como faço para acessar meus relatórios?',
      answer: 'Após o login, você será direcionado ao portal onde todos os relatórios autorizados estarão disponíveis. Clique em qualquer relatório para visualizá-lo.',
    },
    {
      icon: MessageCircle,
      question: 'Esqueci minha senha, o que fazer?',
      answer: 'Na tela de login, clique em "Esqueci minha senha" e siga as instruções enviadas para seu e-mail cadastrado.',
    },
    {
      icon: FileText,
      question: 'Posso solicitar novos relatórios?',
      answer: 'Sim, entre em contato com nossa equipe comercial para solicitar novos relatórios ou dashboards personalizados.',
    },
  ];

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
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Suporte</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar. Entre em contato com nossa equipe de suporte através dos canais abaixo.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {supportOptions.map((option, index) => (
            <Card key={index} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {option.action ? (
                  <a 
                    href={option.action} 
                    className="text-lg font-semibold text-accent hover:underline"
                  >
                    {option.contact}
                  </a>
                ) : (
                  <span className="text-lg font-semibold text-foreground">{option.contact}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">{item.question}</CardTitle>
                      <CardDescription className="mt-2">{item.answer}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-accent/5 to-info/5 border-accent/20 max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">Precisa de ajuda especializada?</h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe de especialistas está pronta para ajudar com implementações, customizações e suporte técnico avançado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="mailto:contato@analyticspro.com.br">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar E-mail
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:+5519982971573">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar Agora
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
