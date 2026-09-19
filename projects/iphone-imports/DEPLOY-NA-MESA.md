# Deploy NA MESA — build enxuto (somente MesaFlow)

Projeto Vercel dedicado à operação **NA MESA** (MesaFlow). Não carrega iPhone Imports, W-Tube, Pucci Motors nem lojas irmãs no build.

> **Outros projetos Vercel** (bedois, loja-iphoneimports, etc.) devem continuar com `npm run vercel-build` — **não altere** o `vercel.json` padrão nem o build completo.

## O que o build enxuto produz

| Artefato | Path |
|----------|------|
| Landing NA MESA (raiz) | `/` → `out/index.html` |
| Site MesaFlow | `/mesaflow/**` → `out/mesaflow/**` |
| API | `/api/mesaflow*` → `api/mesaflow.js` |

Rotas críticas preservadas: `/mesaflow/admin/*`, `/mesaflow/platform/*`, `/mesaflow/m/*`, `/mesaflow/kds/*`.

## Configuração Vercel — projeto NA MESA apenas

### 1. Git

- Repositório: `octaviopucci/black-Box`
- Branch de produção: `main`

### 2. Build (Settings → Build and Deployment)

| Campo | Valor |
|-------|-------|
| **Root Directory** | `projects/iphone-imports` |
| Framework Preset | Other |
| **Build Command** | `npm run vercel-build:mesaflow` |
| **Install Command** | `npm ci --include=dev` |
| Output Directory | *(vazio — usar `vercel.mesaflow.json` ou dashboard)* |
| Ignored Build Step | *(vazio — ou copiar de `vercel.mesaflow.json`)* |

> **Importante:** limpe overrides antigos de Install Command que instalavam `gestor`, `w-tube`, etc. O build enxuto instala deps do host (`esbuild`, `tsx`) e o script `build-mesaflow.mjs` faz `npm ci` dentro de `projects/mesaflow`.

### 3. Config enxuta (`vercel.mesaflow.json`)

O repositório inclui `projects/iphone-imports/vercel.mesaflow.json` — mesmas rewrites MesaFlow do deploy completo, **sem** redirects/APIs de iphone-imports.

**Opção A (recomendada):** no dashboard Vercel, cole manualmente os campos de `vercel.mesaflow.json` (functions + rewrites + outputDirectory) se o projeto não ler o arquivo automaticamente.

**Opção B:** mantenha `vercel.json` completo no repo; só o Build/Install Command muda. Rewrites MesaFlow continuam válidos; paths de iphone/w-tube retornam 404 (aceitável se o domínio é só NA MESA).

### 4. Variáveis de ambiente

Mesmas do MesaFlow em produção — ver `projects/mesaflow/DEPLOY.md`:

- Blob / Redis para persistência
- `MESAFLOW_PLATFORM_OWNER_EMAIL` + `MESAFLOW_PLATFORM_OWNER_PASSWORD`
- Evolution (OTP WhatsApp), se aplicável

### 5. Validar após deploy

```bash
curl https://<seu-dominio-na-mesa>/api/mesaflow/health
# ok: true

curl -I https://<seu-dominio-na-mesa>/mesaflow/admin/login
curl -I https://<seu-dominio-na-mesa>/mesaflow/platform/login
```

### 6. Testar Aprovar lojista

1. Login em `/mesaflow/platform/login`
2. Abrir lojista **pending**
3. Clicar **Aprovar** — deve retornar 200 (sem `ETag mismatch`)
4. Lojista consegue login em `/mesaflow/admin/login`

## Build local

```bash
cd projects/iphone-imports
npm ci --include=dev
npm run vercel-build:mesaflow
```

Saída esperada: `out/mesaflow/**`, `out/index.html` (landing NA MESA), `api/mesaflow.js` com patch `allowUnconditionalOverwrite`.

## Comparação

| Script | Quando usar |
|--------|-------------|
| `npm run vercel-build` | bedois, loja-iphoneimports — deploy multi-produto |
| `npm run vercel-build:mesaflow` | Projeto Vercel NA MESA — só MesaFlow |

O script completo **não foi alterado**; projetos existentes seguem iguais.

## Cardápio Marcelo Lanches (import one-shot)

Após deploy com Blob saudável (`GET /api/mesaflow/health` → `blob: true`), importe o cardápio completo (9 categorias, ~50 produtos, variantes “c/ fritas”, acréscimos como addons):

### Opção A — script local (recomendado)

Na máquina com token Blob do projeto NA MESA:

```bash
cd projects/mesaflow
export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_…"   # ou MESAFLOW_BLOB_READ_WRITE_TOKEN
npm ci --include=dev
npm run seed:marcelo
# Cria o estabelecimento se ainda não existir:
npm run seed:marcelo -- --create
# Simular sem gravar:
npm run seed:marcelo -- --dry-run
```

O script localiza o lojista cujo slug/nome contém **marcelo** (ex.: `marcelo-lanches`), substitui **somente** categorias/produtos desse estabelecimento e persiste em `mesaflow/operational.json` + `mesaflow/identity.json` no Blob.

### Opção B — UI após redeploy (recomendado)

1. **Lojista:** login OWNER/MANAGER → `/mesaflow/admin/products` → botão **Importar cardápio Marcelo Lanches**
2. **Plataforma:** login platform owner → `/mesaflow/platform/merchants/detail?id=<establishmentId>` → **Importar cardápio Marcelo Lanches**

### Opção C — API autenticada

Com cookie/sessão admin (OWNER/MANAGER do Marcelo) ou platform owner:

```bash
# Lojista autenticado (cookie mf_as ou Bearer)
curl -X POST "https://<dominio>/api/mesaflow/admin/catalog/import-marcelo" \
  -H "Content-Type: application/json" \
  -b "mf_as=<token>" \
  -d '{}'

# Platform owner
curl -X POST "https://<dominio>/api/mesaflow/platform/merchants/<establishmentId>/import-marcelo-catalog" \
  -H "Content-Type: application/json" \
  -b "mf_ps=<token>" \
  -d '{}'
```

Body opcional: `{"establishmentId":"est_…","createIfMissing":true}` no endpoint admin (secret ou platform).

### Opção D — secret para scripts

Defina `MESAFLOW_CATALOG_IMPORT_SECRET` no projeto Vercel e chame:

```bash
curl -X POST "https://<dominio>/api/mesaflow/admin/catalog/import-marcelo" \
  -H "Content-Type: application/json" \
  -H "x-mesaflow-import-secret: $MESAFLOW_CATALOG_IMPORT_SECRET" \
  -d '{"createIfMissing":true}'
```

### Banner de persistência

Com Blob configurado e funcionando, o admin **não** exibe mais o aviso “Pedidos não estão sendo compartilhados…”. O banner só aparece se Blob/Redis não estiverem configurados **ou** se a última gravação falhou (`blobError` no health/dashboard).
