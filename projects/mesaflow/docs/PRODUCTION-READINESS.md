# NA MESA (MesaFlow) — Prontidão para Produção

> **Data:** 2026-09-18  
> **Path:** `projects/mesaflow`  
> **Escopo:** auditoria de due diligence para operação em **dezenas de restaurantes** com **centenas a milhares de usos/dia**  
> **Base de código:** `main` + correções críticas deste PR  
> **Audiência:** Octavio (produto) — decisão go/no-go comercial e operacional

---

## 1. Veredito executivo

### **Apto com ressalvas — não apto para escala comercial imediata**

O NA MESA tem **MVP operacional sólido** para piloto controlado (1–5 restaurantes, baixa concorrência de escrita): QR → OTP → pedido → KDS → pagamento → fechamento funciona ponta a ponta, com auth em rotas admin/guest na maioria dos fluxos e hardening parcial já aplicado (Blob privado, pricing server-side, sessão guest em pedidos).

**Porém, não está pronto para dezenas de tenants e milhares de requests/dia** sem risco material de perda de dados, falha de conformidade LGPD e abuso de autenticação. A arquitetura atual — **documento JSON monolítico compartilhado** (Blob/Redis) com **last-write-wins** entre instâncias serverless — é o blocker estrutural principal.

### O que impede “vender e operar com segurança” hoje

| Blocker | Impacto |
|---------|---------|
| Persistência monolítica + LWW | Pedidos/sessões podem ser sobrescritos sob carga concorrente |
| LGPD incompleta | Sem consentimento, política integrada, direitos do titular, retenção |
| Rate limiting ausente | Brute-force em login/OTP, spam de registro |
| ~~Platform admin ausente em produção~~ | ~~`/platform` UI 404 + APIs off no handler~~ — **corrigido neste PR** (rewrites Vercel + handler) |
| Secrets/credenciais default | Platform owner e demo com senhas conhecidas se env não sobrescrever |
| Monitoramento/DR/backups formais | Sem runbook, alertas, restore testado |

### O que **já** está em nível aceitável para piloto fechado

- Hashing bcrypt (cost 12) + upgrade de legacy SHA-256 no login
- Tokens HMAC com `timingSafeEqual` (admin, guest, platform)
- Isolamento admin multi-tenant via `auth.establishment.id` nas mutações
- Telefone cifrado (AES-256-GCM) + lookup HMAC
- QR como capability de mesa; pedidos exigem sessão guest verificada
- Split operational/identity no Blob (`private`)

### Correções aplicadas neste PR (críticas, localizadas)

1. **Secrets:** fail-closed em produção — sem fallback dev (`production-secrets.ts`)
2. **OTP bypass:** desativado por default em produção; código não exposto na API
3. **IDOR guest:** `table-context` exige que sessão corresponda à mesa solicitada
4. **SSE `/api/events`:** exige sessão staff do mesmo `establishmentId`
5. **OTP CSPRNG:** `randomInt` em vez de `Math.random`
6. **Testes de regressão:** `test:security`

### Recomendação de go-to-market

| Cenário | Veredito |
|---------|----------|
| Demo / 1–3 restaurantes piloto, tráfego baixo, Evolution OTP configurado, secrets fortes | **Pode operar** com monitoramento manual |
| Venda para dezenas de clientes, pico de jantar, SLA comercial | **Não apto** — exige Fase DB + LGPD + observabilidade |
| Due diligence investidor / enterprise | **Não apto** — documentar roadmap abaixo |

---

## 2. LGPD / privacidade

### 2.1 Base legal e finalidade

| Dado | Finalidade | Base legal sugerida | Status |
|------|------------|---------------------|--------|
| Telefone guest (OTP) | Verificação de identidade na mesa | Legítimo interesse + consentimento | ⚠️ Coleta sem UI de consentimento |
| Nome display guest | Identificação na comanda | Contrato/execução do serviço | ✅ Mínimo necessário |
| Pedidos / consumo | Operação do restaurante | Contrato com lojista | ✅ |
| E-mail/senha staff | Acesso admin | Contrato com lojista | ✅ |
| E-mail owner platform | Gestão SaaS | Contrato | ✅ |

**Gap crítico:** não há checkbox/link para política de privacidade antes da coleta de telefone (`customer-app.tsx`). Termos de uso do lojista também ausentes no fluxo guest.

### 2.2 Consentimento

- OTP request (`guest/otp/request`) coleta telefone sem registro de consentimento, timestamp ou versão da política.
- Registro de estabelecimento (`auth/register`) não exige aceite de termos NA MESA.
- **Recomendação:** modal pré-OTP com link para política + registro `{ acceptedAt, policyVersion }` em `GuestParticipation` ou audit log.

### 2.3 Minimização

**Implementado:**
- `phoneCiphertext` separado em identity store
- `phoneDisplay` mascarado (`+55 ** *****-1234`)
- `publicUser()` omite `passwordHash`

**Problemas:**
- JWT guest contém `phoneLookupHash` e `phoneDisplay` em payload base64 legível (`guest-session-token.ts:6-19`)
- `publicParticipation()` expõe `phoneDisplay` a co-participantes da mesa (`guest.ts:461-471`) — conflita com decisão D11 (cada um vê só seus dados)
- Token guest duplicado em `sessionStorage` (`guest-client-storage.ts`) — superfície XSS

### 2.4 Retenção

| Tipo | Política documentada | Implementada |
|------|---------------------|--------------|
| OTP challenges | TTL 5 min | Expiram na verificação; **permanecem no store** |
| Guest participations CLOSED | 90 dias (audit doc) | **Sem purge** |
| Orders históricos | Indefinido | Acumulam forever |
| `revokedGuestTokenHashes` | — | Cresce sem limite |
| Admin sessions legacy | TTL 30 dias | `purgeExpiredSessions` apenas admin |

### 2.5 Exclusão e portabilidade (Art. 18)

**Não implementado:**
- Endpoint ou job de anonimização/exclusão por titular (telefone)
- Offboarding de estabelecimento (wipe tenant)
- Exportação estruturada de dados do titular

Kick guest (`kickGuestParticipation`) fecha participação e revoga tokens, mas **não remove** `phoneCiphertext` nem pedidos históricos.

### 2.6 Cookies

| Cookie | Atributos | Dados |
|--------|-----------|-------|
| `mf_cs` (guest) | HttpOnly, SameSite=Lax, Secure em Vercel | Token de sessão |

Admin/platform usam Bearer em header (não cookie) — CSRF mitigado para admin, mas token em `sessionStorage` exposto a XSS.

### 2.7 Logs

- Sem evidência de log estruturado de PII em produção no código app.
- **Risco:** `mockCode` OTP retornado na API quando `MESAFLOW_OTP_MOCK=1` ou `MESAFLOW_DEV_SKIP_OTP=1` (`guest.ts:361-364`) — não deve estar ativo em prod.
- Health endpoint (`/api/mesaflow/health`) expõe diagnóstico de storage sem auth.

### 2.8 Subprocessadores

| Subprocessador | Função | Dados processados | DPA/ROPA |
|----------------|--------|-------------------|----------|
| **Vercel** | Hosting serverless, OIDC | Todo tráfego API | ⚠️ Não documentado no produto |
| **Vercel Blob** | Persistência JSON | Operational + identity (PII cifrado) | ⚠️ Mesmo projeto que iPhone Imports/W-Tube |
| **Upstash Redis** (opcional) | Cache store compartilhado | JSON completo | ⚠️ |
| **Evolution API / WhatsApp** (opcional) | Entrega OTP | Telefone E.164 | ⚠️ Depende config lojista |
| **Webhook URL do lojista** | Integração | Eventos operacionais | Subprocessador indicado pelo cliente |

**Nota:** Blob compartilhado no projeto `loja-iphoneimports` (`DEPLOY.md:37-41`) — separação lógica por path, mesma conta de storage/backups.

### 2.9 Dados: clientes finais vs lojistas

| Ator | Dados | Onde |
|------|-------|------|
| Cliente final (guest) | Telefone, nome, pedidos | `guestParticipations`, `orders`, `guestPhoneSecrets` |
| Lojista (staff) | E-mail, nome, role, senha hash | `users` (identity) |
| Platform owner | E-mail, senha hash | `platformUsers` (identity) |

Lojista acessa telefone mascarado na UI operations; platform analytics inclui **e-mail do owner** (`platform-analytics.ts:84-90`).

### 2.10 Exposição em QR/URLs

Formato: `/m/{slug}/{qrToken}` (`admin/qrcodes/page.tsx`)

- `slug` — identificador público do restaurante
- `qrToken` — secret de capability (64 hex em produção via `randomBytes(32)`)
- Demo seed usa tokens previsíveis (`mesa-8`) — **rotacionar antes de prod**

Com QR válido, atacante obtém menu + agregados da mesa (participantes, total) via `/api/menu/*` — by design, mas é information disclosure para mesas ocupadas.

---

## 3. Segurança de autenticação

### 3.1 Hashing de senhas

```4:6:projects/mesaflow/src/lib/crypto-utils.ts
export function hashPassword(password: string) {
  return hashSync(password, 12);
}
```

- bcrypt cost 12 ✅
- Legacy SHA-256 ainda aceito até primeiro login (`verifyPassword`) — migra automaticamente ✅
- Senha mínima 6 caracteres no registro — **fraca para produção**

### 3.2 JWT / sessões

| Tipo | Formato | TTL | Revogação |
|------|---------|-----|-----------|
| Admin | HMAC payload + sig | 30 dias | Legacy sessions; signed stateless |
| Guest | HMAC v2 claims | 24h | `revokedGuestTokenHashes` + CLOSED status |
| Platform | HMAC scope=platform | 30 dias | Apenas expiração |

Assinaturas verificadas com `timingSafeEqual` ✅

**Correção deste PR:** em `VERCEL_ENV=production`, secrets ausentes **lançam erro** — impede forge com fallback público do repo.

### 3.3 Expiração e reset

- Expiração enforced em parse de tokens ✅
- **Sem fluxo de reset de senha** (admin nem platform)
- Guest reentra via OTP na mesma comanda ✅

### 3.4 Brute-force

| Vetor | Proteção | Status |
|-------|----------|--------|
| Login admin | — | ❌ Sem rate limit |
| Login platform | — | ❌ Sem rate limit |
| OTP verify | 5 tentativas/challenge | ⚠️ Challenges ilimitados |
| Registro aberto | — | ❌ Spam de tenants |

### 3.5 Roles

| Role | Escopo | Guard |
|------|--------|-------|
| OWNER, MANAGER | Admin write | `requireAdmin` |
| COUNTER, WAITER, KITCHEN | Dashboard/KDS/ops | `requireDashboard`, `requireKds`, `requireStaff` |
| Platform owner | Cross-tenant | `requirePlatformOwner` |
| Guest | Própria participação | `validateClientSession` |

Matriz de rotas admin: **28/28 protegidas** (`admin/_shared.ts`).

### 3.6 Isolamento `/admin` vs `/platform` vs guest

- Tokens admin ≠ platform (testado em `platform.test.ts`) ✅
- Guest não acessa admin ✅
- ~~Platform APIs/UI off em produção~~ — **corrigido:** rewrites `/mesaflow/platform/*` em `vercel.json` + rotas `/platform/*` no handler serverless

---

## 4. Autorização multi-tenant

### 4.1 Modelo

Isolamento **lógico** via `establishmentId` em entidades dentro de um único `MesaFlowStore`. Não há partition física por tenant.

### 4.2 Admin — merchant A → merchant B

**Resultado dos testes de código:** bloqueado.

Padrão consistente:
```241:242:projects/mesaflow/src/lib/store-operations.ts
  if (!command || command.establishmentId !== establishmentId) {
    return invalid("Comanda não encontrada.", 404);
```

Session deriva tenant de token assinado, não de input do cliente.

**Gap defensivo (baixo):** `validateSession` não verifica `user.establishmentId === signed.establishmentId` — irrelevante enquanto emissão de token for consistente.

### 4.3 Guest — mesa A → mesa B

| Operação | Isolamento |
|----------|------------|
| POST /orders | ✅ `guestAuth.participation.tableId` |
| GET /guest/me | ✅ Filtra por `guestParticipationId` |
| Closing flows | ✅ Valida command/participation |
| GET /guest/table-context | ✅ **Corrigido neste PR** — 403 se sessão ≠ mesa |
| GET /menu/{slug}/{table} | Public com QR — by design |

### 4.4 Platform APIs

Cross-tenant **intencional** para platform owner. Protegido por `requirePlatformOwner`.

### 4.5 Testes

| Arquivo | Cobertura |
|---------|-----------|
| `admin-crud.test.ts` | FK cross-tenant em produto |
| `guest-session.test.ts` | Sessão, OTP, revoke |
| `platform.test.ts` | Suspend merchant, token separation |
| `security-auth.test.ts` (**novo**) | IDOR table-context, SSE auth, prod secrets |

**Faltam:** testes HTTP end-to-end com dois merchants + dois admin tokens.

---

## 5. Dados sensíveis

### 5.1 O que é persistido

| Store | Conteúdo | Local |
|-------|----------|-------|
| Operational | establishments, orders, commands, participations (metadata), products | Blob `operational.json` / Redis key |
| Identity | users, sessions, platformUsers, otpChallenges, phone ciphertext, password hashes | Blob `identity.json` / Redis key |
| Media | Imagens produto | Vercel Blob (path por establishment) |

### 5.2 Secrets em env (obrigatórios em produção)

```
MESAFLOW_IDENTITY_SECRET          # master fallback
MESAFLOW_ADMIN_SESSION_SECRET
MESAFLOW_CLIENT_SESSION_SECRET
MESAFLOW_PLATFORM_SESSION_SECRET
MESAFLOW_OTP_SECRET
MESAFLOW_PHONE_LOOKUP_SECRET
MESAFLOW_PHONE_CIPHER_SECRET
MESAFLOW_PLATFORM_OWNER_EMAIL
MESAFLOW_PLATFORM_OWNER_PASSWORD  # forte, único
MESAFLOW_EVOLUTION_*              # OTP real (ou MESAFLOW_OTP_BYPASS_CODE=off)
BLOB_READ_WRITE_TOKEN ou Redis Upstash
```

### 5.3 Tokens no client

| Token | Armazenamento | Risco |
|-------|---------------|-------|
| Admin | `sessionStorage` (`mesaflow_admin`) | XSS → takeover 30d |
| Platform | `sessionStorage` | Idem |
| Guest | HttpOnly cookie + `sessionStorage` backup | Redundância aumenta XSS |

### 5.4 QR codes

Secret de mesa (`qrToken`) — alta entropia em mesas provisionadas; demo previsível.

### 5.5 Logs com PII

Sem pipeline de logging auditável. OTP mock/bypass são os maiores riscos de vazamento via response body.

---

## 6. Superfície de ataque

| Vetor | Exposição | Mitigação atual | Gap |
|-------|-----------|-----------------|-----|
| **CSRF** | Guest cookie Lax | SameSite=Lax | Admin usa Bearer — OK |
| **XSS** | React default | Sem CSP documentada | Tokens em sessionStorage |
| **SSRF** | Webhook test (admin) | Admin-only | Admin comprometido → probe interno |
| **Path traversal** | Upload media | MIME whitelist 4MB, path scoped | OK |
| **Rate limit** | Login, OTP, register | — | ❌ Crítico |
| **CORS** | `Access-Control-Allow-Origin: *` no handler | Permite cross-origin API calls | Revisar se necessário |
| **Upload** | Admin only | Tipo/tamanho validados | OK |
| **Webhooks** | Outbound POST | URL do lojista | Sem retry/idempotency |
| **APIs guest públicas** | OTP request, table-context, menu | QR + OTP | Bypass OTP se Evolution off (corrigido em prod) |
| **SSE /events** | Dev route | Auth staff (**corrigido**) | Não deployado em handler prod |
| **Health** | Público | Diagnóstico storage | Information disclosure |
| **Registro aberto** | POST /auth/register | Cria tenant | Spam/abuse |

---

## 7. Escala

### 7.1 Modelo atual vs carga alvo

**Alvo:** dezenas de restaurantes × centenas–milhares req/dia (~0,01–1 req/s médio, picos 10–50 req/s no jantar).

**Arquitetura:** hydrate JSON completo → mutate → flush JSON completo por request.

### 7.2 O que quebra primeiro (ordem provável)

1. **Race conditions / lost updates** — duas instâncias serverless escrevem simultaneamente; Redis SET sem CAS; Blob ETag retry com mesmo body (LWW)
2. **Latência de hydrate/flush** — payload cresce com **todos** os tenants (~O(platform))
3. **Platform dashboard** — `platformDashboard` chama `dashboardAnalytics` por merchant — O(N × orders_total)
4. **Cold start + full JSON parse** — p99 sobe com tamanho do store
5. **Limites Vercel** — timeout function 10s/60s, payload 4.5MB response, Redis REST latency

### 7.3 Contenção identificada (sem lock)

- `createOrder` + `orderCounter` increment
- `joinGuestAtTable` dedup participação
- `getOrOpenCommand` abertura de comanda
- Flush concorrente operational + identity

### 7.4 Estimativa conservadora

| Tenants | Req/dia total | Veredito |
|---------|---------------|----------|
| 1–5 | < 5.000 | Piloto OK com Redis/Blob + monitoramento |
| 10–20 | 10.000–50.000 | Risco elevado de lost updates em pico |
| 30+ | 100.000+ | **Inadequado** sem banco transacional |

### 7.5 Plano de escala (blocker — não migrar agora)

**Fase 1 (4–6 semanas engenharia):**
- Postgres (Neon/Supabase) ou DynamoDB com partition key `establishmentId`
- Escritas transacionais por comanda/pedido
- Idempotency-Key em POST /orders e OTP verify

**Fase 2:**
- Sharded analytics (materialized views / nightly rollups)
- Queue para webhook delivery
- Read replicas ou cache por tenant

**Preservar:** static export do frontend (`output: export`); API permanece serverless separada.

---

## 8. Operação / venda

| Área | Status | Notas |
|------|--------|-------|
| **Backups** | ⚠️ Implícito Vercel Blob/Redis | Sem backup testado, sem PITR documentado |
| **Disaster recovery** | ❌ | Sem RTO/RPO definido; restore manual do JSON |
| **Monitoramento** | ❌ | Sem APM, alertas, SLO |
| **Audit log** | ⚠️ Parcial | `auditEvents` no store; sem `phone_revealed` etc. |
| **Onboarding** | ✅ | `provision.ts`, signup, QR generation |
| **Termos/privacidade** | ❌ | Não integrados ao produto |
| **Suporte multi-estabelecimento** | ⚠️ | Platform UI existe; backend prod incompleto |
| **Runbook incidentes** | ❌ | |
| **Billing/planos** | ⚠️ UI | `platform-plans.ts` — sem cobrança real |

### Deploy atual

- Static export → `loja-iphoneimports.vercel.app/mesaflow/`
- API → `api/mesaflow.js` handler (`projects/iphone-imports/api/_mesaflow/handler.ts`)
- Credenciais demo documentadas em `DEPLOY.md` — **remover/rotacionar antes de venda**

---

## 9. Matriz de riscos

| ID | Risco | Sev. | Prob. | Evidência | Remediação |
|----|-------|------|-------|-----------|------------|
| R01 | Lost updates concorrentes | **Crítico** | Alta em pico | `redis-persistence.ts:115`, `blob-persistence.ts:251-258` | Migrar para DB transacional |
| R02 | LGPD — sem consentimento/DSR | **Crítico** | Certa | Fluxo OTP sem UI legal | Política + consent + endpoints Art.18 |
| R03 | Rate limit ausente | **Crítico** | Alta | `auth/login/route.ts`, OTP routes | Upstash Ratelimit / Vercel Firewall |
| R04 | Secrets default em prod | **Crítico** | Média se env ok | `platform-store.ts:52-53`, `seed.ts:558` | Env obrigatório; fail-fast (**parcial fix**) |
| R05 | OTP bypass sem Evolution | **Crítico** | Baixa pós-fix | `otp-bypass.ts` | Evolution config ou `MESAFLOW_OTP_BYPASS_CODE=off` (**fix**) |
| R06 | Platform admin off em prod | **Alto** | Certa | handler.ts sem `/platform/*` | Rotear platform no handler ou deploy Next API |
| R07 | Registro aberto spam | **Alto** | Média | `auth/register/route.ts` | Invite-only ou captcha |
| R08 | Tokens admin em sessionStorage | **Alto** | Média (XSS) | `auth-context.tsx:70` | HttpOnly cookie ou CSP estrita |
| R09 | Guest phoneDisplay a co-mesa | **Alto** | Certa | `guest.ts:467` | Remover de `publicParticipation` |
| R10 | IDOR table-context | **Alto** | Certa | `guest-table-context.ts` | **Corrigido neste PR** |
| R11 | SSE events sem auth | **Alto** | Baixa (dev only) | `events/route.ts` | **Corrigido neste PR** |
| R12 | Health endpoint público | **Médio** | Média | `handler.ts` health block | Auth ou strip diagnostics |
| R13 | CORS `*` | **Médio** | Baixa | `handler.ts:111` | Restrict origin |
| R14 | Retenção infinita PII | **Médio** | Certa | Sem purge jobs | Job retenção 90d |
| R15 | Senha mín 6 chars | **Médio** | Média | `store.ts:493` | Mín 10 + complexidade |
| R16 | Analytics O(N) platform | **Médio** | Alta com escala | `platform-analytics.ts:196` | Pre-aggregate |
| R17 | Demo QR tokens previsíveis | **Médio** | Alta se seed em prod | `seed.ts:353` | Seed só dev; rotate QR |
| R18 | JWT guest resurrection | **Médio** | Baixa | `guest.ts:169-198` | Validar session store antes resurrect |
| R19 | Webhook SSRF | **Baixo** | Baixa | `store-operations.ts:733` | URL allowlist |
| R20 | OTP Math.random | **Baixo** | — | `identity-crypto.ts:70` | **Corrigido** (randomInt) |

---

## 10. Checklist go-live (ordenado)

### Blockers absolutos (P0)

- [ ] Configurar **todos** secrets de produção (ver §5.2); validar boot sem fallback dev
- [ ] Configurar **Evolution API** para OTP real **ou** `MESAFLOW_OTP_BYPASS_CODE=off`
- [ ] Rotacionar/remover credenciais demo (`demo123`, `namesa-platform-dev`, QR `mesa-*`)
- [ ] Implementar **rate limiting** em login, register, OTP request/verify
- [ ] Publicar **Política de Privacidade** + consentimento antes de coletar telefone
- [ ] Definir **retenção** e job de purge (90d pós-CLOSED mínimo)
- [ ] Validar persistência compartilhada: `curl .../health` → `shared: true`
- [ ] **Load test** concorrente (10+ writes simultâneos) — documentar taxa de perda
- [ ] Decisão go/no-go escala: aceitar piloto JSON **ou** iniciar migração DB antes de vender volume

### Alta prioridade (P1 — antes de escalar vendas)

- [x] Rotear **platform UI** (`vercel.json` rewrites) + **platform APIs** no handler de produção
- [ ] Endpoint/process de **exclusão LGPD** (titular + offboarding tenant)
- [ ] Remover `phoneDisplay` de dados visíveis a co-participantes
- [ ] Migrar tokens admin para HttpOnly cookie ou harden CSP
- [ ] Fechar registro aberto (invite code / aprovação manual)
- [ ] Monitoramento: uptime, error rate, persist failures, latency p99
- [ ] Backup restore **testado** do Blob/Redis
- [ ] Idempotency-Key em POST /orders
- [ ] Proteger ou restringir `/health` diagnostics

### Nice-to-have (P2)

- [ ] Reset de senha admin/platform
- [ ] SSE autenticado em produção (substituir polling 4s)
- [ ] Audit log completo (`phone_revealed`, admin actions)
- [ ] Termos de uso lojista + SLA
- [ ] Billing integrado (Stripe)
- [ ] CSP headers, HSTS
- [ ] Pen test externo

---

## Apêndice A — Correções deste PR

| Arquivo | Mudança |
|---------|---------|
| `src/lib/production-secrets.ts` | Fail-closed secrets em produção |
| `src/lib/otp-bypass.ts` | Bypass off por default em prod; hint sem código |
| `src/lib/guest-table-context.ts` | Validação sessão ↔ mesa |
| `src/app/api/guest/table-context/route.ts` | Usa helper centralizado |
| `src/app/api/events/route.ts` | Auth staff + establishment scope |
| `src/app/api/admin/_shared.ts` | `requireDashboardForEstablishment` |
| `src/lib/identity-crypto.ts` | OTP CSPRNG |
| `projects/iphone-imports/api/_mesaflow/handler.ts` | table-context IDOR fix; rotas `/platform/*` |
| `projects/iphone-imports/vercel.json` | Rewrites `/mesaflow/platform/*` (fix 404 em prod) |
| `projects/iphone-imports/scripts/build-mesaflow.mjs` | Verificação `platform/login.html` no artefato |
| `src/lib/security-auth.test.ts` | Regressão IDOR + auth |

## Apêndice B — Comandos de verificação

```bash
cd projects/mesaflow
npm ci --include=dev
npm run test:admin
npm run test:guest
npm run test:platform
npm run test:security
npm run build
```

## Apêndice C — Referências internas

- `docs/AUDIT-PRE-PHASE-0.md` — decisões D1–D17, blueprint LGPD/hardening
- `docs/AUDIT-OPERACIONAL.md` — gaps operacionais
- `docs/AUDIT-WHATSAPP-IDENTITY.md` — fluxo OTP/identidade
- `DEPLOY.md` — infra Vercel/Blob/Redis

---

*Documento gerado como due diligence honesta. NA MESA é vendável como piloto controlado; para operação comercial em escala, tratar R01–R03 como blockers de arquitetura e compliance.*
