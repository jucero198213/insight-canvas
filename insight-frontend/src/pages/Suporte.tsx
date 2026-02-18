import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/landing/Footer';

const supportOptions = [
  { title: 'E-mail', description: 'Envie sua dúvida ou solicitação', contact: 'contato@analyticspro.com.br', action: 'mailto:contato@analyticspro.com.br' },
  { title: 'Telefone', description: 'Fale diretamente com nossa equipe', contact: '(19) 98297-1573', action: 'tel:+5519982971573' },
  { title: 'Horário', description: 'Segunda a Sexta', contact: '09:00 às 18:00', action: null },
];

const faqItems = [
  { q: 'Como faço para acessar meus relatórios?', a: 'Após o login, você será direcionado ao portal onde todos os relatórios autorizados estarão disponíveis. Clique em qualquer relatório para visualizá-lo.' },
  { q: 'Esqueci minha senha, o que fazer?', a: 'Na tela de login, clique em "Esqueceu a senha?" e siga as instruções enviadas para seu e-mail cadastrado.' },
  { q: 'Posso solicitar novos relatórios?', a: 'Sim, entre em contato com nossa equipe comercial para solicitar novos relatórios ou dashboards personalizados.' },
];

export default function Suporte() {
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

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: 'hsl(210 40% 98%)', marginBottom: 12 }}>Suporte</h1>
          <p style={{ fontSize: 18, color: 'hsla(210,40%,98%,0.6)', maxWidth: 600, margin: '0 auto' }}>
            Estamos aqui para ajudar. Entre em contato através dos canais abaixo.
          </p>
        </div>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 64 }}>
          {supportOptions.map((opt, i) => (
            <div key={i} style={{
              padding: 24, borderRadius: 16, textAlign: 'center',
              background: 'hsla(210,40%,98%,0.03)', border: '1px solid hsla(210,40%,98%,0.08)',
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 4 }}>{opt.title}</h3>
              <p style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.5)', marginBottom: 16 }}>{opt.description}</p>
              {opt.action ? (
                <a href={opt.action} style={{ fontSize: 16, fontWeight: 600, color: 'hsl(187 92% 41%)', textDecoration: 'none' }}>{opt.contact}</a>
              ) : (
                <span style={{ fontSize: 16, fontWeight: 600, color: 'hsl(210 40% 98%)' }}>{opt.contact}</span>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'hsl(210 40% 98%)', textAlign: 'center', marginBottom: 32 }}>Perguntas Frequentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700, margin: '0 auto' }}>
          {faqItems.map((faq, i) => (
            <div key={i} style={{
              padding: 24, borderRadius: 12,
              background: 'hsla(210,40%,98%,0.03)', border: '1px solid hsla(210,40%,98%,0.08)',
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>{faq.q}</h4>
              <p style={{ fontSize: 14, color: 'hsla(210,40%,98%,0.6)', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Extra CTA */}
        <div style={{ marginTop: 64, textAlign: 'center', padding: 32, borderRadius: 16, background: 'hsla(187,92%,41%,0.05)', border: '1px solid hsla(187,92%,41%,0.2)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: 'hsl(210 40% 98%)', marginBottom: 8 }}>Precisa de ajuda especializada?</h3>
          <p style={{ color: 'hsla(210,40%,98%,0.6)', marginBottom: 24 }}>Nossa equipe está pronta para ajudar com implementações e suporte técnico avançado.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <a href="mailto:contato@analyticspro.com.br" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, hsl(187 92% 41%), hsl(199 89% 48%))',
              color: 'hsl(210 40% 98%)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>Enviar E-mail</a>
            <a href="tel:+5519982971573" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              border: '1px solid hsla(210,40%,98%,0.3)', background: 'transparent',
              color: 'hsl(210 40% 98%)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>Ligar Agora</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}