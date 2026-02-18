import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/landing/Footer';

export default function Termos() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(222 47% 11%)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ background: 'hsl(217 91% 15%)', borderBottom: '1px solid hsla(210,40%,98%,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'hsl(210 40% 98%)' }}>AnalyticsPro</span>
          </div>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'hsla(210,40%,98%,0.7)', fontSize: 14, cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Voltar
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 32 }}>Termos de Uso</h1>
        <p style={{ color: 'hsla(210,40%,98%,0.5)', marginBottom: 32 }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        {[
          { title: '1. Aceitação dos Termos', text: 'Ao acessar e utilizar a plataforma AnalyticsPro, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.' },
          { title: '2. Descrição do Serviço', text: 'O AnalyticsPro é uma plataforma SaaS (Software as a Service) que oferece serviços de analytics e visualização de dados através de dashboards Power BI integrados. Nosso serviço permite que empresas distribuam relatórios e insights de dados de forma segura para seus usuários autorizados.' },
          { title: '3. Cadastro e Conta', text: 'Para utilizar nossos serviços, é necessário criar uma conta através de um processo de cadastro autorizado. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.' },
          { title: '4. Uso Aceitável', text: 'Você concorda em utilizar a plataforma apenas para fins legítimos e de acordo com estes termos. É proibido compartilhar credenciais com terceiros, tentar acessar áreas não autorizadas, utilizar a plataforma para fins ilegais ou interferir no funcionamento da plataforma.' },
          { title: '5. Propriedade Intelectual', text: 'Todo o conteúdo, software e tecnologia disponibilizados através da plataforma são de propriedade do AnalyticsPro ou de seus licenciadores. Os relatórios e dados específicos de cada cliente permanecem de propriedade do respectivo cliente.' },
          { title: '6. Limitação de Responsabilidade', text: 'O AnalyticsPro não se responsabiliza por danos indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso da plataforma. Nossa responsabilidade está limitada ao valor pago pelo serviço contratado.' },
          { title: '7. Modificações dos Termos', text: 'Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas aos usuários com antecedência razoável.' },
          { title: '8. Contato', text: 'Para dúvidas sobre estes termos, entre em contato através do e-mail: contato@analyticspro.com.br ou telefone: (19) 98297-1573.' },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 12 }}>{section.title}</h2>
            <p style={{ fontSize: 15, color: 'hsla(210,40%,98%,0.7)', lineHeight: 1.7 }}>{section.text}</p>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}