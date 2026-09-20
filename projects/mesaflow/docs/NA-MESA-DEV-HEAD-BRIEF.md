# NA MESA — Brief atualizado para Dev Head

> **Gerado em:** 2026-09-20  
> **Base:** `main` do monorepo `octaviopucci/black-Box` + PRs #220–#243  
> **Paths canônicos:** `projects/mesaflow/` (app) · `projects/iphone-imports/` (host Vercel)  
> **Audiência:** agente "dev head" no ChatGPT — documento autossuficiente, sem histórico de chat

---

## 1. Resumo executivo

**NA MESA** (código interno: **MesaFlow**) é um SaaS multi-tenant de **garçom digital + operação de mesa** para restaurantes presenciais (lanchonetes, padarias, bares, cafeterias, rodízios). Não é um cardápio PDF: vende **operação na mesa** — QR → sessão guest → pedido → KDS → conta → pagamento → encerramento — com **kit físico** (QR adesivos, display A6, guia da mesa) como diferencial comercial.

**Posicionamento:** operação + ticket + menos garçom; concorrentes (Goomer, Anota AI, etc.) focam totem/cardápio; NA MESA foca **mesa + rodízio + kit + painel operacional**.

**Modelo comercial (HANDOFF):** planos anuais Essencial R$ 997 · Premium R$ 1.997 · Custom a partir R$ 2.997; upsells de mesas/estabelecimentos. Planos existem em tipos/UI (`platform-plans.ts`) — **sem billing real** (Stripe ausente).

**Estado atual (veredito):** **MVP operacional apto para piloto controlado** (1–5 restaurantes, baixa concorrência de escrita). **Não apto para escala comercial** (dezenas de lojas, milhares de req/dia) sem migrar persistência JSON monolítica para DB transacional (ADR-001). Ver `docs/PRODUCTION-READINESS.md`.

**Deploy produção:** projeto Vercel dedicado **NA MESA** (build enxuto `vercel-build:mesaflow`) ou host compartilhado `loja-iphoneimports` / `bedois.vercel.app` sob `/mesaflow/`. Landing NA MESA pode servir na **raiz** `/` no projeto dedicado (PR #224).

**Demo tenant:** slug `ponto-do-sabor`, mesa demo `/m/ponto-do-sabor/mesa-8`. Logins demo documentados em README (rotacionar em prod via env).

---

## 2. Arquitetura e deploy

### Monorepo

| Caminho | Papel |
|---------|-------|
| `projects/mesaflow/` | Fonte Next.js App Router — guest, admin, platform, KDS |
| `projects/iphone-imports/` | Host de deploy Vercel — static export + API serverless |
| `projects/iphone-imports/out/mesaflow/` | Site estático exportado (`basePath: /mesaflow`) |
| `projects/iphone-imports/out/index.html` | Landing NA MESA na raiz (projeto dedicado) |
| `projects/iphone-imports/api/_mesaflow/handler.ts` | **Fonte** da API produção (~1385 linhas) |
| `projects/iphone-imports/api/mesaflow.js` | **Artefato** esbuild (CJS, node20) — deployado |
| `projects/iphone-imports/vercel.json` | Deploy multi-produto (iphone, w-tube, pucci, mesaflow) |
| `projects/iphone-imports/vercel.mesaflow.json` | Config enxuta só NA MESA |
| `projects/iphone-imports/scripts/build-mesaflow.mjs` | Pipeline build + bundle handler |
| `projects/iphone-imports/scripts/vercel-build-mesaflow-only.mjs` | Entry build NA MESA |

### Stack técnica

- **Frontend:** Next.js 16, React 19, Tailwind 4, static export em prod (`MESAFLOW_STATIC_EXPORT=1`)
- **API dev:** rotas em `projects/mesaflow/src/app/api/**/route.ts` (porta 3010, `npm run dev:mesaflow`)
- **API prod:** handler monolítico em `/api/mesaflow/*` via rewrites Vercel
- **Persistência:** JSON monolítico `MesaFlowStore` — memória → flush → Redis (opcional) → Vercel Blob → disco `/tmp` fallback
- **Mídia produto:** Vercel Blob público em `mesaflow/media/{establishmentId}/...`
- **Multi-tenant:** isolamento lógico por `establishmentId` em todas as entidades
- **Realtime:** polling ~4s (`useRealtime`); SSE `/api/events` **só dev** — ausente no handler prod

### Pipeline build (`build-mesaflow.mjs`)

1. `npm ci` em `projects/mesaflow/`
2. Stash temporário de `src/app/api` (permite static export)
3. Build com `NEXT_BASE_PATH=/mesaflow`, `NEXT_PUBLIC_API_PREFIX=mesaflow`
4. Restore API routes
5. Copia `mesaflow/out/` → `iphone-imports/out/mesaflow/`
6. `ensureCleanUrlIndexes` (compat `cleanUrls: true`)
7. esbuild `handler.ts` → `api/mesaflow.js`
8. Copia landing para `out/index.html` (projeto NA MESA)

### Rewrites Vercel (API)

```
/api/mesaflow           → /api/mesaflow?path=health
/api/mesaflow/(.*)      → /api/mesaflow?path=$1
```

Handler resolve `req.query.path` → rota interna (`/admin/orders`, `/guest/otp/request`, etc.).

### Rewrites estáticos (SPA)

| Origem | Destino | Nota |
|--------|---------|------|
| `/mesaflow` | `/mesaflow/index` | Landing produto |
| `/mesaflow/admin/*` | mesmo path | Admin SPA |
| `/mesaflow/platform/*` | mesmo path | Platform owner |
| `/mesaflow/m/:slug/:table` | `/mesaflow/m/live` | QR → client parser |
| `/mesaflow/kds/:sector` | `/mesaflow/kds/live` | KDS sectors |

### Comandos canônicos

```bash
# Dev
npm --prefix projects/mesaflow ci --include=dev
npm run dev:mesaflow                    # porta 3010

# Build local (simula deploy)
cd projects/iphone-imports && npm ci --include=dev
npm run vercel-build:mesaflow           # NA MESA only (~23s)
npm run vercel-build                    # multi-produto completo

# Testes
npm --prefix projects/mesaflow run test:admin
npm --prefix projects/mesaflow run test:guest
npm --prefix projects/mesaflow run test:platform
npm --prefix projects/mesaflow run test:security

# Health prod
curl https://<dominio>/api/mesaflow/health
```

### Docs de deploy

- `projects/mesaflow/DEPLOY.md` — persistência Blob, env vars
- `projects/iphone-imports/DEPLOY-NA-MESA.md` — projeto Vercel dedicado NA MESA
- `projects/iphone-imports/DEPLOY.md` — host multi-produto

---

## 3. Papéis e superfícies (rotas)

### Guest / cardápio / mesa

| Rota (dev) | Rota prod | Arquivo | Função |
|------------|-----------|---------|--------|
| `/m/{slug}/{table}` | `/mesaflow/m/{slug}/{table}` → live | `src/app/m/[slug]/[table]/page.tsx` | Menu + carrinho (`CustomerApp`) |
| `/m/live` | `/mesaflow/m/live` | `src/app/m/live/page.tsx` | Parser dinâmico slug/mesa |
| — | — | `src/components/customer/customer-app.tsx` | UI principal guest |

**Fluxo:** QR → contexto mesa → OTP WhatsApp (Evolution) ou mock demo → cookie `mf_cs` → cardápio → carrinho → checkout (comer aqui/viagem) → pedido → timeline status → comanda → pedir conta (SELF/SELECTED/TABLE) → sair.

### Admin lojista (`/admin`)

| Rota | Função |
|------|--------|
| `/admin` | Visão geral — KPIs, alertas, persist banner |
| `/admin/login` | Login staff (Turnstile opt-in) |
| `/admin/signup` | Cadastro estabelecimento |
| `/admin/pending` | Aguardando aprovação platform |
| `/admin/orders` | Kanban pedidos + detalhe + impressão térmica |
| `/admin/products` | CRUD produtos/categorias, upload foto, import Marcelo |
| `/admin/tables` | CRUD mesas, status, QR |
| `/admin/tables/cockpit?tableId=` | Cockpit — splits, pagamentos, settle |
| `/admin/qrcodes` | QR download/impressão |
| `/admin/operations` | Piso — mesas ativas, kick guest, force-clear |
| `/admin/settings` | Config estabelecimento, senha |
| `/admin/integrations` | Conectores stub (iFood/Rappi/ERP/webhook) |

**Layout gate:** `src/app/admin/layout.tsx` — não autenticado → login; `platformStatus !== active` → `/admin/pending`.

**Roles:** `OWNER`, `MANAGER` (write); `WAITER`, `KITCHEN`, `COUNTER` (escopo operacional/KDS). Guards: `src/app/api/admin/_shared.ts`.

### Platform owner (`/platform`)

| Rota | Função |
|------|--------|
| `/platform` | Dashboard SaaS |
| `/platform/login` | Login platform owner |
| `/platform/merchants` | Lista lojistas |
| `/platform/merchants/detail?id=` | Detalhe — plano, status, aprovar/suspender, import cardápio |

**Cookie:** `mf_ps`. Guard: `src/app/api/platform/_shared.ts` → `requirePlatformOwner`.

### KDS / cozinha

| Rota | Setores | Componente |
|------|---------|------------|
| `/kds/{sector}` | `sec_cozinha`, `sec_balcao`, `sec_bar`, `live` | `src/components/kds/kds-view.tsx` |
| API | `GET /kds/queue?sector=` | `src/lib/kds-queue.ts` |

Som configurável via `establishment.settings.soundNotifications`. Auth: roles KITCHEN/COUNTER/OWNER/MANAGER.

### Marketing / legal

| Rota | Função |
|------|--------|
| `/` | Landing comercial NA MESA |
| `/privacidade` | Política LGPD estática |

### API — grupos principais (dev + handler prod espelhado)

- **Health:** `GET /health`
- **Auth merchant:** `/auth/login`, `/logout`, `/register`, `/me`
- **Auth platform:** `/platform/auth/*`
- **Guest:** `/guest/table-context`, `/guest/me`, OTP, closing, DSR
- **Pedidos:** `GET|POST /orders`, `PATCH /orders/[id]`, `POST /rodizio/round`, `POST /bill`
- **Admin:** dashboard, products, categories, tables, cockpit, payments, settle, media upload, catalog import
- **Platform:** dashboard, merchants CRUD, import catalog

**Divergências dev vs prod:** `GET /events` (SSE) e `GET /auth/signup-config` existem só em dev — **não** no handler embarcado.

---

## 4. O que JÁ TEM (inventário)

### Onboarding e governança SaaS

- [x] **Cadastro aberto** por padrão + **aprovação manual** platform (`platformStatus: pending → active`) — PR #225
- [x] Modo **invite-only** opcional (`MESAFLOW_SIGNUP_INVITE_ONLY=1` + `MESAFLOW_SIGNUP_INVITE_CODE`)
- [x] **Planos** Essencial/Premium/Custom em tipos, UI platform e limites declarados (`platform-plans.ts`; limite 10 mesas Essencial — **não enforced** no backend)
- [x] Platform: listar, detalhar, aprovar, suspender, rejeitar lojistas
- [x] Provision automático pós-signup (`provision.ts`) — categorias/setores/produtos exemplo

### Cardápio e produtos

- [x] Categorias com **emoji**, sort order, CRUD admin
- [x] Produtos: preço, descrição, setor (COZINHA/BALCÃO/BAR…), vitrine vs sob demanda
- [x] **Variantes** (priceDelta aditivo — corrigido PR #236)
- [x] **Adicionais** (addons com qty/max)
- [x] **Order bumps** (`bumpProductIds`) — acréscimos inline no sheet com +/- (PRs #239–#242)
- [x] **Combos** via tags + seed Marcelo Lanches
- [x] **Upsell** (`upsellProductIds`)
- [x] Upload foto produto (Blob, 4MB, JPEG/PNG/WebP/GIF) — PR #226
- [x] Import cardápio **Marcelo Lanches** (~50 produtos, 9 categorias) — UI admin, UI platform, script `seed:marcelo`, API autenticada
- [x] Pricing **server-side** (`order-math.ts`, `lineUnitPrice`, bumps como addons na linha)

### Pedidos e operação

- [x] Status: NOVO → ACEITO → EM_PREPARO → PRONTO → ENTREGUE / CANCELADO
- [x] **Aceitar** pedido no admin + avançar status
- [x] **Comanda térmica 58mm** — impressão browser ao aceitar (`order-print.tsx`, PRs #237, #243)
- [x] **Comer aqui / para viagem** (`OrderServiceType`)
- [x] Kanban admin + detalhe com carrossel itens (PR #237)
- [x] **Alerta sonoro global** admin — banner amarelo + sino + Web Notifications (PRs #239–#241)
- [x] Notificações in-app admin com `actionUrl` cockpit
- [x] **Rodízio** — rodadas, limites, intervalo mínimo (`Rodizio`, `RodizioRound`)
- [x] Operações piso: mesas ativas, kick guest, force-clear
- [x] **Cockpit mesa:** splits, pagamentos, confirm, settle
- [x] Fechamento guest: SELF / SELECTED / TABLE + cancelamento antes confirmação staff
- [x] OTP guest via Evolution API ou mock/bypass dev
- [x] Sessão guest HttpOnly cookie `mf_cs` + participantes por comanda
- [x] QR único por mesa (64 hex prod) + regenerar + imprimir lote (`qrcodes/page.tsx`)

### KDS

- [x] Fila por setor, nome participante no ticket
- [x] Avançar status
- [x] Som se `soundNotifications`
- [x] Polling 4s

### Admin analytics

- [x] Dashboard Visão geral — KPIs hoje/7d/30d (`admin-dashboard.ts`, cache 15s, PR #236 perf)
- [x] Banner persistência quando Blob/Redis ausente ou flush falhou

### Segurança / LGPD (pacote #220 + docs)

- [x] bcrypt cost 12 + migração SHA-256 legado
- [x] Tokens HMAC admin/guest/platform + `timingSafeEqual`
- [x] **Fail-closed secrets** em prod (`production-secrets.ts`)
- [x] Telefone cifrado AES-256-GCM + lookup HMAC
- [x] Cookies HttpOnly `mf_as` / `mf_ps` staff
- [x] CSP + security headers (`security-headers.ts`)
- [x] Rate limit in-memory login/register/OTP (`rate-limit.ts`)
- [x] Turnstile opt-in (login/register/OTP)
- [x] Política privacidade `/privacidade` + consentimento guest/signup (`privacyConsent`)
- [x] DSR export/delete guest + admin OWNER (`privacy-dsr.ts`)
- [x] Retention purge 90d (`data-retention.ts`)
- [x] Health público mínimo; diagnóstico com `MESAFLOW_HEALTH_SECRET`
- [x] Demo QR `mesa-N` bloqueado em prod (`demo-qr.ts`)
- [x] Audit log append-only (`audit-log.ts`) — **sem UI**
- [x] Scripts backup/restore Blob (`scripts/backup-store.mjs`, `restore-store.mjs`)

### Deploy / infra

- [x] Static export + handler espelhado
- [x] Build enxuto NA MESA (`vercel-build:mesaflow`, `vercel.mesaflow.json`) — incorporado via #231
- [x] Landing NA MESA na raiz + favicon centralizado (#224)
- [x] Aprovação lojista persiste Blob com retry ETag/overwrite (#227–#231)
- [x] Categorias persistem no Blob (#233)
- [x] Banner persistência falso-positivo corrigido (#234)

### Seeds e demo

- [x] Tenant demo `ponto-do-sabor` (seed local; bloqueado em prod salvo `MESAFLOW_ALLOW_DEMO_SEED=1`)
- [x] Seed Marcelo Lanches completo (`seed-marcelo-lanches.ts`, `npm run seed:marcelo`)

### Arquivos-chave

| Área | Arquivos |
|------|----------|
| Store/persist | `src/lib/store.ts`, `blob-persistence.ts`, `redis-persistence.ts` |
| Auth | `admin-session-token.ts`, `guest-session-token.ts`, `platform-session-token.ts`, `guest.ts` |
| Pedidos | `store-operations.ts`, `order-math.ts`, `order-display.ts` |
| Platform | `platform-store.ts`, `platform-analytics.ts` |
| Handler prod | `projects/iphone-imports/api/_mesaflow/handler.ts` |
| Tipos | `src/lib/types.ts` |

---

## 5. O que está PARCIAL / pendente de merge

### PRs abertos (#220–#243)

| PR | Estado | Resumo |
|----|--------|--------|
| **#238** | **Draft aberto** | Sem foto stock + cardápio **emoji-first**; remove injeção Pexels no hydrate; `product-emoji.ts`; upload gracioso sem placeholder |
| **#232** | Aberto (dirty) | Admin Visão geral skeleton infinito no light deploy — unifica payload handler, GET skip flush, staffFetch timeout. **Parcialmente endereçado em #236** (`buildAdminDashboardPayload` no handler); PR ainda não mergeado |
| **#230** | Aberto (dirty) | Build Vercel enxuto — **conteúdo principal já em `main` via #231** (`vercel-build:mesaflow`, `vercel.mesaflow.json`, `DEPLOY-NA-MESA.md`); PR pode ser fechado como superseded |
| **#223** | Aberto (dirty) | Seed automático em store vazio + secrets não lançam 500 — **não mergeado**; `main` ainda fail-closed em secrets ausentes |

### Comportamento parcial no código atual (`main`)

| Item | Estado |
|------|--------|
| **Fotos produto sem upload** | Ainda injeta URLs stock Pexels via `migrateProductImages` / `product-images.ts` — **#238 draft corrige** |
| **Emoji-first cardápio** | Categorias têm emoji; produtos sem foto ainda mostram imagem stock — **#238** |
| **Upload foto** | Estrutura OK (`media-upload.ts`); depende Blob configurado; 503 se ausente |
| **SSE realtime prod** | Ausente — polling 4s everywhere |
| **Integrações** | UI + stubs; sem iFood/Rappi real |
| **Plan limits** | UI/tipos only; backend não bloqueia >10 mesas Essencial |
| **Billing** | Planos visíveis; sem Stripe/cobrança |
| **Password reset** | Ausente admin e platform |
| **Audit log UI** | Eventos gravados; sem tela |
| **Load test concorrente** | Não executado/documentado (checklist PRODUCTION-READINESS) |
| **Backup restore testado** | Script existe; restore trimestral não evidenciado |
| **HANDOFF.md** | Desatualizado (cita PR #192 aberto, API 500 Blob) — superseded por fixes posteriores |

### Avisos operacionais conhecidos

- **Banner "Pedidos não estão sendo compartilhados…"** — aparece se Blob/Redis não configurado **ou** último flush falhou (`persistStatus()` em `store.ts`)
- **Blob compartilhado** com iPhone Imports/W-Tube no mesmo projeto Vercel — separação lógica por path (`mesaflow/operational.json`, `mesaflow/identity.json`); limite Hobby de Blob stores
- **Landing #224** — raiz `/` no projeto NA MESA; em bedois multi-produto MesaFlow fica só em `/mesaflow/`

---

## 6. O que NÃO TEM (gaps)

### Ausente no código (não implementado)

| Gap | Notas |
|-----|-------|
| **DB transacional** (Postgres/Dynamo) | ADR-001 proposto; só stub `store-adapter.ts` |
| **Billing / Stripe** | Planos são metadado |
| **Enforcement limites plano** | Mesas/estabelecimentos |
| **App nativo iOS/Android** | Só web responsive |
| **Fiscal / NF-e / SAT** | Ausente |
| **Delivery marketplace** | Ausente |
| **Password reset** | Ausente |
| **Push notifications nativas** | Só Web Notifications browser |
| **SSE autenticado em prod** | Dev only |
| **Multi-idioma** | PT-BR only |
| **PWA install prompt** | manifest existe; fluxo install não productizado |
| **Monitoramento/APM/alertas** | Sem SLO formal |
| **Offboarding tenant completo** | DSR parcial; wipe total não |
| **Idempotency-Key POST /orders** | Ausente |
| **Termos de uso lojista integrados** | Só privacidade |

### Planejado em docs mas não built

- Migração Postgres Fase 1 (ADR-001) — 4–6 semanas eng. estimadas no doc, **não iniciada**
- Dual-write shadow JSON+Postgres — futuro
- Job cron retenção com lock distribuído — futuro
- Pentest externo — checklist P2
- Onboarding wizard pós-cadastro — HANDOFF backlog
- Kit físico operacional (fornecedor acrílico, artes PDF) — comercial, fora do software

### Riscos estruturais (não são "features faltando" — são blockers)

- **Last-write-wins** em JSON compartilhado serverless
- **O(N tenants)** hydrate/flush por request
- **Platform dashboard O(N × orders)** em analytics

---

## 7. Persistência, auth e segurança (estado atual)

### Persistência

```
Request → hydrate (mem cache → Redis? → Blob? → disk)
       → mutate in-memory MesaFlowStore
       → flush (operational.json + identity.json separados no Blob)
```

| Backend | Paths/keys | Quando |
|---------|------------|--------|
| Memória | `cache` em `store.ts` | Warm instance |
| Disco dev | `data/store.json` ou `MESAFLOW_DATA` | Local |
| Disco Vercel fallback | `/tmp/mesaflow-store.json` | Sem Blob — **fail-closed writes** |
| Vercel Blob | `mesaflow/operational.json`, `mesaflow/identity.json`, legacy `mesaflow/store.json` | Prod primary |
| Upstash Redis | `mesaflow:operational`, `mesaflow:identity`, `mesaflow:etags` | Opcional cache antes Blob |
| Mídia | `mesaflow/media/{establishmentId}/...` | Fotos produto (public) |

**Shared persistence:** `sharedPersistenceConfigured()` — Blob token ou Redis. Aprovação platform exige flush OK antes de 200 (`requireOperationalPersist`).

### Auth — três camadas

| Ator | Mecanismo | Cookie/header | TTL |
|------|-----------|---------------|-----|
| Guest | OTP → HMAC token | `mf_cs` HttpOnly | 24h |
| Staff | email/senha → HMAC | `mf_as` HttpOnly ou Bearer | 30d |
| Platform owner | email/senha → HMAC scope=platform | `mf_ps` HttpOnly | 30d |

**Produção:** secrets ausentes → **throw** (`production-secrets.ts`) — boot/login falha até configurar env (PR #223 propõe relaxar com fallback `/tmp` — **não mergeado**).

**OTP:** Evolution API (`MESAFLOW_EVOLUTION_*`) ou bypass dev (`MESAFLOW_DEV_SKIP_OTP`, `MESAFLOW_OTP_MOCK` — nunca em prod).

### Segurança aplicada

- RBAC backend 28/28 rotas admin protegidas
- Isolamento multi-tenant por token assinado (não input cliente)
- IDOR table-context corrigido (sessão ↔ mesa)
- Rate limit IP in-memory (login, register, OTP)
- CORS `*` no handler — revisar se necessário
- LGPD MVP: consent, DSR, retention purge; gaps enterprise (DPA, ROPA, offboarding total)

### Health

- Público: `{ ok, service, shared, blob, establishments }`
- Detalhado: requer header `X-Mesaflow-Health-Secret` = `MESAFLOW_HEALTH_SECRET`

---

## 8. PRs recentes (#220+)

| PR | Status | Entrega (1 linha) |
|----|--------|-------------------|
| **#220** | Merged | Pacote hardening zero-custo: CSP, cookies HttpOnly, senha forte, Turnstile, DSR, rate limit, audit log, health secret, demo QR block |
| **#221** | Merged | Platform deploy Vercel: cleanUrls admin/platform, verificação build, rate limit handler |
| **#222** | Merged | Soft-fail persist (Blob erro não derruba mutation) + platform seed sem Blob |
| **#223** | **Aberto** | Seed automático store vazio + secrets não-500 em prod |
| **#224** | Merged | NA MESA na raiz `/`, landing comercial, favicon centralizado |
| **#225** | Merged | Signup aberto + gate aprovação platform (`pending`) |
| **#226** | Merged | Fix upload foto produto admin (corpo multipart) |
| **#227** | Merged | Aprovação lojista persiste após hydrate |
| **#228** | Merged | Aprovação retorna 200 só após flush Blob |
| **#229** | Merged | Retry Blob ETag mismatch na aprovação |
| **#230** | **Aberto** (superseded) | Build Vercel enxuto — **já incorporado via #231** |
| **#231** | Merged | Aprovar nunca falha ETag + `vercel-build:mesaflow` + overwrite incondicional |
| **#232** | **Aberto** | Admin pages skeleton infinito light deploy — payload unificado handler |
| **#233** | Merged | Categorias persistem no Blob após criar admin |
| **#234** | Merged | Banner persistência falso-positivo + seed cardápio Marcelo |
| **#235** | Merged | Import Marcelo via sessão autenticada (sem só secret) |
| **#236** | Merged | Import platform + preço aditivo variantes/addons + Visão geral <1.3s |
| **#237** | Merged | Pacote UX pedidos: comanda térmica, detalhe carrossel, bumps, alertas, notificações |
| **#238** | **Draft aberto** | Sem foto stock + emoji-first cardápio |
| **#239** | Merged | Alertas admin globais + bumps no item + CTA fixo checkout |
| **#240** | Merged | Banner amarelo alertas + bumps inline sheet |
| **#241** | Merged | Sino novo pedido confiável (AudioContext unlock) |
| **#242** | Merged | Bumps +/- inline no sheet sem popup |
| **#243** | Merged | Comanda térmica 58mm sem overflow lateral |

---

## 9. Env vars (nomes)

### Secrets obrigatórios produção

```
MESAFLOW_IDENTITY_SECRET              # master fallback para todos secrets
MESAFLOW_ADMIN_SESSION_SECRET
MESAFLOW_CLIENT_SESSION_SECRET
MESAFLOW_PLATFORM_SESSION_SECRET
MESAFLOW_OTP_SECRET
MESAFLOW_PHONE_LOOKUP_SECRET
MESAFLOW_PHONE_CIPHER_SECRET
MESAFLOW_PLATFORM_OWNER_EMAIL
MESAFLOW_PLATFORM_OWNER_PASSWORD
```

### Persistência

```
BLOB_READ_WRITE_TOKEN                 # ou MESAFLOW_BLOB_READ_WRITE_TOKEN
BLOB_STORE_ID                         # ou MESAFLOW_BLOB_STORE_ID
UPSTASH_REDIS_REST_URL                # ou MESAFLOW_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN              # ou MESAFLOW_REDIS_REST_TOKEN
KV_REST_API_URL                       # alias Upstash
KV_REST_API_TOKEN
MESAFLOW_DATA                         # path disco local dev
```

### OTP / identidade

```
MESAFLOW_EVOLUTION_URL
MESAFLOW_EVOLUTION_API_KEY
MESAFLOW_EVOLUTION_INSTANCE
MESAFLOW_OTP_BYPASS_CODE
MESAFLOW_DEV_SKIP_OTP                 # dev only
MESAFLOW_OTP_MOCK                     # dev only
```

### Signup / flags

```
MESAFLOW_SIGNUP_INVITE_ONLY           # "1" = convite obrigatório
MESAFLOW_SIGNUP_INVITE_CODE
MESAFLOW_ALLOW_DEMO_SEED              # evitar em prod
MESAFLOW_CATALOG_IMPORT_SECRET
MESAFLOW_HEALTH_SECRET
MESAFLOW_RESTORE_CONFIRM              # script restore
```

### Build / deploy

```
MESAFLOW_STATIC_EXPORT                # "1" em build prod
NEXT_BASE_PATH                        # "/mesaflow" em prod
NEXT_PUBLIC_BASE_PATH
NEXT_PUBLIC_API_PREFIX                # "mesaflow"
MESAFLOW_API_PREFIX
VERCEL / VERCEL_ENV / VERCEL_OIDC_TOKEN / VERCEL_PROJECT_ID
NODE_ENV
```

### Turnstile (opt-in)

```
TURNSTILE_SITE_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

---

## 10. Débito técnico e riscos

| ID | Risco | Sev. | Evidência | Mitigação atual |
|----|-------|------|-----------|-----------------|
| R01 | Lost updates JSON LWW | **Crítico** | `blob-persistence.ts`, `redis-persistence.ts` | Retry ETag + merge approval; **não resolve concorrência geral** |
| R02 | Escala O(all tenants) | **Crítico** | hydrate/flush monolítico | Piloto only; ADR-001 |
| R03 | LGPD enterprise gaps | **Alto** | PRODUCTION-READINESS §2 | MVP consent/DSR OK; DPA/ROPA pendem |
| R04 | Rate limit in-memory | **Alto** | Não sobrevive cold start / multi-instance | Upstash Ratelimit futuro |
| R05 | Secrets ausentes → 500 | **Alto** | `production-secrets.ts` | Config obrigatória; #223 draft alternativa |
| R06 | Tokens legacy sessionStorage | **Médio** | Migração cookies incompleta em edge cases | HttpOnly primário |
| R07 | CORS `*` handler | **Médio** | `handler.ts` | Restrict origin |
| R08 | Health info disclosure | **Baixo** | Contagem establishments pública | Secret para detalhe |
| R09 | Blob Hobby limit shared | **Médio** | DEPLOY docs | Reutilizar store existente |
| R10 | HANDOFF/docs stale | **Baixo** | HANDOFF cita #192 | Atualizar docs (este brief) |
| R11 | Handler drift vs Next routes | **Médio** | 2 surfaces API | Todo new route → handler + verify script |
| R12 | PRs abertos dirty (#232,#223,#238) | **Médio** | GitHub | Merge ou fechar superseded |

**Ordem do que quebra primeiro em escala:** (1) race lost updates, (2) latência hydrate, (3) platform analytics O(N), (4) cold start JSON parse, (5) limites Vercel function timeout.

---

## 11. Backlog sugerido (P0/P1/P2)

### P0 — antes de vender volume ou >5 tenants

| Item | Objetivo verificável |
|------|---------------------|
| Merge **#238** (emoji-first, sem stock) | Produto sem foto → só emoji após reload; zero URL Pexels no store |
| Decisão **#223** (seed vs fail-closed) | Documentar: ou env secrets obrigatórios + Blob, ou merge seed auto com riscos |
| Validar `curl /api/mesaflow/health` → `shared: true, blob: true` | Checklist deploy NA MESA |
| **Load test** 10+ writes simultâneos | Documentar taxa perda; go/no-go escala JSON |
| Configurar **Evolution OTP** prod | OTP real WhatsApp; bypass off |
| Fechar/rebase **#232** ou confirmar #236 resolve skeleton | Visão geral carrega KPIs <5s pós-login light deploy |

### P1 — escala vendas / compliance

| Item | Objetivo verificável |
|------|---------------------|
| **ADR-001 Fase 1** — Postgres + Drizzle por `establishmentId` | Pedidos concorrentes sem lost update em teste |
| Rate limit **Redis**/Upstash (substituir in-memory) | 429 após N tentativas cross-instance |
| **Enforcement plano** Essencial 10 mesas | POST table #11 → 403 com mensagem plano |
| Monitoramento uptime + error rate persist | Alerta se flush fail > threshold |
| Backup restore **executado** trimestral | Runbook BACKUP-RESTORE.md evidenciado |
| Idempotency-Key POST `/orders` | Retry cliente não duplica pedido |
| Password reset admin | Fluxo email ou magic link |
| Billing Stripe (metadado plano → subscription) | Checkout anual Essencial funcional |

### P2 — polish / enterprise

| Item | Objetivo verificável |
|------|---------------------|
| SSE autenticado prod (substituir polling) | Latência update <1s KDS/admin |
| Audit log UI platform | Filtro por tenant/ação |
| Termos uso lojista + SLA | Aceite no signup |
| Integração iFood/Rappi real (1 provider) | Pedido inbound visível admin |
| PWA install + offline menu read | Lighthouse PWA pass |
| Pentest externo | Relatório sem críticos abertos |
| Offboarding tenant wipe | DELETE platform merchant → data purged 30d |
| Atualizar HANDOFF.md | Alinhado a este brief |

---

## 12. Notas para o Dev Head (como usar este brief)

### Contexto imediato

1. **Produto = NA MESA**, código = MesaFlow, host = `projects/iphone-imports`.
2. **Nunca quebrar** `/admin` nem `/platform` — static export exige rotas estáticas + query params (`?id=`).
3. **Toda rota API nova** precisa espelho em `projects/iphone-imports/api/_mesaflow/handler.ts` + rebuild `api/mesaflow.js` via `build-mesaflow.mjs`.
4. **Persistência compartilhada** é requisito prod — sem Blob/Redis os dados morrem em `/tmp` serverless.

### Ordem de leitura no repo

1. Este brief
2. `docs/PROMPT-MESTRE-NA-MESA.md` — fases produto
3. `docs/PRODUCTION-READINESS.md` — due diligence honesta
4. `docs/HARDENING-ZERO-COST.md` — o que já entrou
5. `projects/iphone-imports/DEPLOY-NA-MESA.md` — deploy dedicado

### Antes de implementar

- Rodar testes: `test:admin`, `test:guest`, `test:platform`, `test:security`
- Simular build: `npm run vercel-build:mesaflow` em `iphone-imports`
- Validar health pós-deploy
- Preferir **mudanças cirúrgicas** — store JSON é sensível a regressões de persist

### Prompt inicial sugerido para o Dev Head

```
Você é dev head do NA MESA (MesaFlow). Leia o brief em
projects/mesaflow/docs/NA-MESA-DEV-HEAD-BRIEF.md.

Stack: Next static export + serverless handler JSON store.
Deploy: projects/iphone-imports, build vercel-build:mesaflow.

Prioridade atual: [escolher item P0 do §11].
Restrição: espelhar APIs no handler.ts; não quebrar admin/platform.
```

### Domínios / URLs (a confirmar por ambiente)

- Multi-produto: `https://bedois.vercel.app/mesaflow/`
- Projeto NA MESA dedicado: domínio próprio com `/` landing + `/mesaflow/*` app
- API: `/api/mesaflow/health` em ambos

### Contatos demo (rotacionar prod)

- Lojista demo: `owner@pontodosabor.com` (senha em README)
- Platform: `octavio@namesa.io` (override via `MESAFLOW_PLATFORM_OWNER_*`)

---

*Brief factual derivado do código e docs em `main` (commit até PR #243). Itens marcados "a confirmar" dependem de config Vercel/env do deploy alvo.*
