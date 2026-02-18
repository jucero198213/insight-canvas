import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/landing/Footer';

export default function Privacidade() {
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
        <h1 style={{ fontSize: 36, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 32 }}>Política de Privacidade</h1>
        <p style={{ color: 'hsla(210,40%,98%,0.5)', marginBottom: 32 }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        {[
          { title: '1. Introdução', content: 'A AnalyticsPro está comprometida em proteger a privacidade e os dados pessoais de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).' },
          { title: '2. Dados Coletados', content: 'Coletamos dados de identificação (nome, e-mail, empresa), dados de acesso (logs de login, horários, IP), dados de uso (relatórios acessados, interações com dashboards) e dados técnicos (dispositivo, navegador, sistema operacional).' },
          { title: '3. Finalidade do Tratamento', content: 'Utilizamos seus dados para fornecer acesso à plataforma, autenticar usuários, garantir segurança, gerar logs de auditoria, melhorar nossos serviços e comunicar atualizações.' },
          { title: '4. Base Legal', content: 'O tratamento de dados é realizado com base em execução de contrato, cumprimento de obrigações legais, legítimo interesse da empresa e consentimento do titular quando aplicável.' },
          { title: '5. Compartilhamento de Dados', content: 'Seus dados podem ser compartilhados com provedores de infraestrutura em nuvem (Microsoft Azure), serviços de autenticação e autoridades competentes quando exigido por lei. Não comercializamos dados com terceiros para marketing.' },
          { title: '6. Segurança dos Dados', content: 'Implementamos criptografia em trânsito e em repouso, controle de acesso baseado em funções, monitoramento de segurança, backups regulares e isolamento de dados entre clientes (multi-tenant).' },
          { title: '7. Seus Direitos', content: 'Conforme a LGPD, você tem direito a confirmar existência de tratamento, acessar seus dados, corrigir dados incompletos, solicitar anonimização ou eliminação, revogar consentimento e solicitar portabilidade.' },
          { title: '8. Contato', content: 'Para exercer seus direitos: contato@analyticspro.com.br | (19) 98297-1573.' },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 12 }}>{section.title}</h2>
            <p style={{ fontSize: 15, color: 'hsla(210,40%,98%,0.7)', lineHeight: 1.7 }}>{section.content}</p>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}