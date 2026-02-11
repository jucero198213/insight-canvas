# Guia de Configuração de Deploy - Insight Canvas

Este documento descreve as configurações necessárias para o deploy do frontend na **Vercel** e do backend na **Render**.

## 1. Backend (Render)

No painel da Render, crie um **Web Service** conectado ao seu repositório.

### Configurações de Build:
- **Root Directory:** `insight-backend`
- **Build Command:** `npm install && npm run build` (ou `npm install` se usar `ts-node-dev`)
- **Start Command:** `node dist/index.js` (ou `npm run dev` para teste rápido)

### Variáveis de Ambiente (Environment Variables):
| Variável | Descrição |
|----------|-----------|
| `PORT` | `3333` (ou a porta de sua preferência) |
| `POWERBI_TENANT_ID` | ID do seu locatário Azure/Power BI |
| `POWERBI_CLIENT_ID` | Client ID (Application ID) do Azure AD |
| `POWERBI_CLIENT_SECRET` | Client Secret do Azure AD |
| `POWERBI_WORKSPACE_ID` | ID do Workspace do Power BI |
| `POWERBI_REPORT_ID_FINANCEIRO` | ID do Relatório Financeiro |
| `POWERBI_REPORT_ID_DRE` | ID do Relatório DRE |
| `POWERBI_REPORT_ID_COMPRAS` | ID do Relatório de Compras |

---

## 2. Frontend (Vercel)

No painel da Vercel, crie um novo projeto conectado ao seu repositório.

### Configurações de Build:
- **Root Directory:** `.` (Raiz do projeto)
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`

### Variáveis de Ambiente (Environment Variables):
| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave anônima/pública do Supabase |
| `VITE_API_URL` | **URL gerada pela Render** (ex: `https://insight-backend.onrender.com`) |

---

## 3. Notas Importantes
- O backend está configurado para aceitar requisições CORS de qualquer subdomínio `.vercel.app` e `.lovable.app`.
- Certifique-se de que o usuário no portal tenha o nome do relatório condizente com as chaves (ex: conter "DRE" ou "Compra") para o mapeamento automático de tokens.
