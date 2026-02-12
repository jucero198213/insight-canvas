const features = [
  {
    title: 'Analytics Avançado',
    description: 'Dashboards Power BI totalmente integrados com visualizações interativas e em tempo real.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>,
  },
  {
    title: 'Acesso Seguro',
    description: 'Autenticação própria com controle centralizado de credenciais e sessões.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>,
  },
  {
    title: 'Gestão de Usuários',
    description: 'Controle granular de permissões por usuário e por relatório com isolamento de dados.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    title: 'White-Label',
    description: 'Personalize cores, logo e identidade visual para cada cliente da sua plataforma.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>,
  },
  {
    title: 'Multi-Tenant',
    description: 'Arquitetura SaaS com isolamento total de dados entre diferentes clientes.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>,
  },
  {
    title: 'Auditoria Completa',
    description: 'Logs detalhados de todos os acessos para compliance e análise de uso.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
  {
    title: 'Acesso Simplificado',
    description: 'Usuários acessam relatórios sem precisar de conta Microsoft ou licença Power BI.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  },
  {
    title: 'Escalabilidade',
    description: 'Infraestrutura cloud preparada para crescimento com alta disponibilidade.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 41%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/><path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/></svg>,
  },
];

export function Features() {
  return (
    <section style={{ padding: '96px 0', background: 'hsl(210 20% 98%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'hsla(187,92%,41%,0.1)', color: 'hsl(187 92% 41%)',
            borderRadius: 999, padding: '6px 16px', fontSize: 14, fontWeight: 500, marginBottom: 16,
          }}>
            Recursos
          </span>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'hsl(222 47% 11%)', marginBottom: 16 }}>
            Tudo que você precisa para{' '}
            <span style={{
              backgroundImage: 'linear-gradient(135deg, hsl(187 92% 41%) 0%, hsl(199 89% 48%) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>escalar seu BI</span>
          </h2>
          <p style={{ fontSize: 20, color: 'hsl(215 16% 47%)', maxWidth: 640, margin: '0 auto' }}>
            Uma plataforma completa para distribuir analytics de forma segura e escalável
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: 24, borderRadius: 16,
                background: 'hsla(0,0%,100%,0.8)', backdropFilter: 'blur(8px)',
                border: '1px solid hsla(214,32%,91%,0.5)',
                boxShadow: '0 2px 12px -2px hsla(217,91%,20%,0.08)',
                transition: 'all 0.3s', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 12px 40px -8px hsla(217,91%,20%,0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 12px -2px hsla(217,91%,20%,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'hsla(187,92%,41%,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, transition: 'background 0.3s',
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'hsl(222 47% 11%)', marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ color: 'hsl(215 16% 47%)', fontSize: 14, lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
