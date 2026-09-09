# Deploy — iPhone Imports (site + gestor + API)

Projeto unificado em `projects/iphone-imports/`:

| Parte | URL em produção |
|-------|-----------------|
| Loja | `https://loja-iphoneimports.vercel.app/` |
| Gestor | `https://loja-iphoneimports.vercel.app/gestor/` |
| API | `https://loja-iphoneimports.vercel.app/api/iphone-imports` |

## Vercel — checklist (loja-iphoneimports)

### 1. Git (Settings → Git) ✅
- Repositório: `octaviopucci/black-Box`
- Branch de produção: `main`

### 2. Build (Settings → Build and Deployment) — **obrigatório**
| Campo | Valor |
|-------|-------|
| **Root Directory** | `projects/iphone-imports` |
| Framework Preset | Other |
| Build Command | `npm run vercel-build` |
| Output Directory | `out` |
| Install Command | `npm ci --include=dev && npm --prefix gestor ci --include=dev` |

> Sem o Root Directory correto, o Vercel usa o `vercel.json` do monorepo (errado).

### 3. Domínio
- `loja-iphoneimports.vercel.app`

### 4. Variáveis de ambiente (Settings → Environment Variables)
| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `BLOB_READ_WRITE_TOKEN` | Recomendado | Persiste estoque entre reinícios da API |
| `NEXT_PUBLIC_STORE_SLUG` | Não | Padrão: `iphone-imports` |

### 5. Após conectar o Git
O Vercel dispara deploy automático no próximo push à `main`.
Para forçar agora: **Deployments → Redeploy** no último commit.

### 6. Validar deploy
```bash
curl https://loja-iphoneimports.vercel.app/api/iphone-imports/health
# Deve retornar: "slug":"iphone-imports", "products":37, "inventory":37
```

O `vercel.json` do projeto já configura API serverless e SPA do gestor.

## Build local

```bash
cd projects/iphone-imports
npm ci --include=dev
npm --prefix gestor ci --include=dev
npm run vercel-build
```

Saída: `out/` (loja + `out/gestor/`) + `api/dist/handler.cjs`

## Login do gestor (loja única)

| Campo | Valor |
|-------|-------|
| Usuário | `admin` |
| Senha | `adminimports123` |
| Código da loja | `iphone-imports` |

O catálogo do site é populado automaticamente com os 37 produtos do seed.
Alterações no estoque pelo gestor refletem na loja em até 15 segundos.

## Testes

```bash
npm run test:api   # 13 testes estoque ↔ catálogo
```
