# MesaFlow — Segunda auditoria pré-Fase 0

> **Status:** aprovada como gate de implementação  
> **Base:** `docs/AUDIT-WHATSAPP-IDENTITY.md` + decisões de produto fechadas em 2026-09-16  
> **Escopo:** análise apenas — **nenhum código alterado**  
> **Objetivo:** validar arquitetura antes da Fase 0 (hardening)

---

## Sumário executivo

A primeira auditoria mapeou o MVP atual (mesa por QR, sem identidade de cliente, APIs abertas, Blob público com dados sensíveis). As **decisões de produto abaixo estão fechadas** e substituem os itens marcados como `DECISÃO NECESSÁRIA` na auditoria anterior.

Esta segunda análise responde **15 perguntas obrigatórias** sobre o código existente e define **bloqueadores** que devem ser resolvidos antes de introduzir telefone, OTP, `ClientSession` ou `GuestParticipation` em produção.

**Princípio reforçado:**

| Camada | Responsabilidade |
|--------|------------------|
| QR | Identifica **mesa** (capacidade de entrada) |
| WhatsApp OTP | Prova **pessoa** (verificação pontual) |
| `GuestParticipation` | Representa **consumo** na comanda |
| `ClientSession` | Representa **acesso técnico** (descartável) |
| Backend | **Autorização** e transições de estado |
| Cliente | **Solicita** fechamento |
| Staff | **Confirma** fechamento e encerra comanda/mesa |

---

## 1. Registro de decisões fechadas

### 1.1 Identidade e participação

| # | Decisão | Regra |
|---|---------|-------|
| D1 | Telefone ≠ identidade permanente | WhatsApp é só verificação/recuperação; entidade de negócio = `GuestParticipation` |
| D2 | Mesmo telefone, mesas diferentes | **Permitido** — participações independentes (`gp_A` mesa 08, `gp_B` mesa 12) |
| D3 | Mesmo telefone, mesma comanda | **Uma** participação `OPEN` ou `CLOSING_REQUESTED`; recuperar existente após OTP; nunca duplicar |
| D4 | Fechar navegador | **Não** encerra participação |
| D5 | `ClientSession` descartável | Pode expirar/revogar/recriar/multi-dispositivo; participação persiste |
| D10 | Reentrada após `CLOSED` | **Nunca** ressuscitar `gp` antiga; criar **nova** `GuestParticipation` se houver nova comanda/consumo |

**Lookup de participação por telefone:** usar `phoneLookupHash` (HMAC), nunca telefone puro como chave.

```text
phoneLookupHash = HMAC-SHA256(PHONE_LOOKUP_SECRET, establishmentId + ":" + e164)
```

Índice composto lógico: `(commandId, phoneLookupHash, status IN (OPEN, CLOSING_REQUESTED))`.

### 1.2 Fechamento

| # | Decisão | Regra |
|---|---------|-------|
| D6 | Solicitação ≠ fechamento | Cliente cria `ClosingRequest`; staff executa `CONFIRM_CLOSING` / `SETTLE` |
| D7 | `REQUEST_CLOSE_SELF` | Participação → `CLOSING_REQUESTED` **imediatamente**; **sem** novos pedidos; `CANCEL_CLOSING` → `OPEN` enquanto staff não confirmou |
| D8 | `REQUEST_CLOSE_SELECTED` | Staff confirma; participantes selecionados **notificados**, sem voto/aprovação individual |
| D9 | `REQUEST_CLOSE_TABLE` | Não fecha mesa automaticamente; staff `CONFIRM`/`SETTLE` → participações `CLOSED` → `Command.FECHADA` → `Table.LIVRE` |
| D16 | Admin é autoridade | Guest **nunca** pode setar `CLOSED`, `FECHADA`, `LIVRE` diretamente |
| D17 | Pedido durante closing | Em `CLOSING_REQUESTED`: **bloqueado** criar pedidos; pode ver consumo/status e cancelar solicitação |

### 1.3 Privacidade e telefone

| # | Decisão | Regra |
|---|---------|-------|
| D11 | Visibilidade guest | Cada um vê **só** seus pedidos/consumo/status; mesa pode mostrar agregados (`N participantes`, `total mesa`) |
| D12 | Armazenamento de telefone | `phoneCiphertext` + `phoneLookupHash` + `phoneDisplay`; **nunca** telefone puro em store público |
| D13 | OTP | Preferir `HMAC(serverSecret, challengeId + code)` em vez de bcrypt; TTL, uso único, rate limit, sem log |

### 1.4 Persistência (bloqueador)

| # | Decisão | Regra |
|---|---------|-------|
| D14 | Blob público | **Inadequado** para PII, sessões, OTP, hashes admin; separar **Operational Store** vs **Private Identity/Security Store** |
| D15 | Exposição atual | `passwordHash` e `Session.token` em `mesaflow/store.json` público — **corrigir antes** de qualquer dado de cliente |

---

## 2. Modelo de dados revisado (pós-decisões)

### 2.1 Cadeia de entidades

```text
WhatsApp OTP
     ↓
GuestParticipation  (consumo; persiste até STAFF_CONFIRM_CLOSING)
     ↓
ClientSession       (acesso técnico; 1..N por participação)
     ↓
Order / RodizioRound
```

`Command` permanece container financeiro da **mesa** (comanda). `Table` permanece entidade física com `qrToken`.

### 2.2 GuestParticipation (revisado)

```typescript
interface GuestParticipation {
  id: string;                         // gp_
  establishmentId: string;
  commandId: string;
  tableId: string;

  phoneCiphertext: string;            // AES-256-GCM, chave em env (não no Blob público)
  phoneLookupHash: string;            // HMAC determinístico — lookup sem telefone puro
  phoneDisplay: string;               // "+55 ** *****-1234"

  displayName?: string;
  participantIndex: number;

  status: "OPEN" | "CLOSING_REQUESTED" | "CLOSED";

  joinedAt: string;
  verifiedAt: string;
  closingRequestedAt?: string;
  closedAt?: string;
  closedByUserId?: string;            // staff

  orderCount: number;
  lastOrderAt?: string;
}
```

**Invariantes:**

- Máximo **uma** participação `OPEN | CLOSING_REQUESTED` por `(commandId, phoneLookupHash)`.
- `CLOSED` é **terminal** para o cliente (sem transição de volta).
- Telefone **não** é PK; `id` opaco é PK.

### 2.3 ClientSession (revisado)

```typescript
interface ClientSession {
  id: string;                         // cs_
  guestParticipationId: string;
  tokenHash: string;                  // SHA-256 do token opaco — nunca token puro
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
  revokedAt?: string;
  userAgentHash?: string;
  ipHash?: string;
}
```

Cookie: `mf_cs=<opaque>` · `HttpOnly; Secure; SameSite=Lax`.

### 2.4 OtpChallenge (revisado)

```typescript
interface OtpChallenge {
  id: string;                         // otp_
  establishmentId: string;
  commandId: string;
  tableId: string;
  phoneLookupHash: string;            // não armazenar E.164 puro
  codeHash: string;                   // HMAC(OTP_SECRET, challengeId + ":" + code)
  purpose: "JOIN" | "RECOVER";
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  consumedAt?: string;
  sentAt: string;
  resendCount: number;
  ipHash?: string;
}
```

### 2.5 ClosingRequest (revisado)

```typescript
interface ClosingRequest {
  id: string;                         // clr_
  establishmentId: string;
  commandId: string;
  requestedByGuestParticipationId: string;
  scope: "SELF" | "SELECTED" | "TABLE";
  targetGuestParticipationIds: string[];
  status: "PENDING" | "CANCELLED" | "CONFIRMED" | "SETTLED";
  createdAt: string;
  cancelledAt?: string;
  confirmedAt?: string;
  confirmedByUserId?: string;
  settledAt?: string;
  settledByUserId?: string;
}
```

**Nota:** `REQUEST_CLOSE_SELECTED` coloca alvos em `CLOSING_REQUESTED` e notifica; confirmação é **só** staff (`CONFIRM_CLOSING`).

### 2.6 Order (campos novos)

```typescript
interface Order {
  // ...existentes
  guestParticipationId: string;       // obrigatório pós-migração
  idempotencyKey?: string;            // dedup de POST
}
```

---

## 3. Máquinas de estado revisadas

### 3.1 GuestParticipation

```text
OPEN
  │
  ├─ REQUEST_CLOSE_* ──▶ CLOSING_REQUESTED
  │                           │
  │                           ├─ CANCEL_CLOSING (cliente) ──▶ OPEN
  │                           │
  │                           └─ STAFF CONFIRM_CLOSING ──▶ CLOSED (irreversível p/ cliente)
  │
  └─ STAFF encerramento admin ──▶ CLOSED
```

**Durante `CLOSING_REQUESTED`:** `POST /orders` → **403**; leitura permitida.

### 3.2 Command

```text
ABERTA
  │
  ├─ (participação entra / staff abre mesa) — permanece ABERTA
  │
  ├─ REQUEST_CLOSE_TABLE pendente OU N participações em CLOSING_REQUESTED
  │       └──▶ FECHANDO (derivável ou persistido — ver §3.4)
  │
  └─ STAFF SETTLE ──▶ FECHADA
```

Substituir `PAGAMENTO_SOLICITADO` por `FECHANDO` na evolução do modelo (ou mapear 1:1 na migração).

### 3.3 Table

```text
LIVRE
  │
  └─ primeira participação OPEN ou staff ocupa ──▶ OCUPADA
         │
         └─ closing/pagamento pendente ──▶ AGUARDANDO_FECHAMENTO (ou derivado)
                │
                └─ STAFF SETTLE ──▶ LIVRE (+ limpar commandId ativo)
```

### 3.4 Estados derivados vs persistidos

| Estado | Recomendação |
|--------|--------------|
| `Command.FECHANDO` | **Persistir** — staff precisa filtrar comandas em encerramento no dashboard |
| `Table.AGUARDANDO_FECHAMENTO` | **Derivar** de `ClosingRequest PENDING` + `Command.FECHANDO` — evita drift com `AGUARDANDO_PAGAMENTO` atual |
| `guestCount` em Command | **Remover** uso decorativo; substituir por `count(participations where status != CLOSED)` |

---

## 4. Visibilidade do consumo

### 4.1 Guest (`/me`, `/me/orders`, `/me/closing`)

| Dado | Visível |
|------|---------|
| Próprios pedidos e totais | ✓ |
| Próprio status de participação | ✓ |
| Própria solicitação de fechamento | ✓ |
| Pedidos de outros por nome/produto | ✗ |
| Telefone de outros | ✗ |
| Agregado mesa (`3 participantes`, `total R$ X`) | ✓ opcional por tenant |

### 4.2 Staff (admin)

Visão completa: participantes, pedidos, consumo, fechamento, telefone mascarado (reveal com audit para completo).

### 4.3 KDS

| Campo | KDS |
|-------|-----|
| Pedido, itens, obs, setor, status | ✓ |
| `displayName` ou `Participante N` | ✓ |
| Telefone | ✗ |
| Totais financeiros da mesa | ✗ |

---

## 5. Segunda auditoria — 15 perguntas obrigatórias

### 5.1 Onde `Command` mistura mesa e cobrança

**Hoje** (`store.ts`):

| Acoplamento | Onde | Problema |
|-------------|------|----------|
| `Table.commandId` | ponteira única mesa→comanda ativa | Ao criar nova comanda, comanda anterior fica órfã |
| `getOrOpenCommand()` | `menu` GET, `POST /orders`, rodízio | **Write-on-read** — carregar cardápio ocupa mesa |
| `requestBill()` | `POST /bill` sem auth | Muda `Command` + `Table` sem participação nem staff |
| `Command.guestCount` | fixo `2` na criação | Não reflete participantes reais |
| Pedidos filtrados por `command.id` atual | `handler.ts` menu | Após bill request, cliente perde visão de pedidos antigos |

**Direção pós-decisões:**

- `Command` = ciclo financeiro da mesa (correto como container).
- `Table` = QR + status físico; **não** deve abrir comanda no GET.
- Abertura de `Command` = evento explícito: **primeira `GuestParticipation` verificada** ou **ação staff** (`OPEN_TABLE`).
- `requestBill` atual → substituir por `ClosingRequest` com escopos; **nunca** fechar comanda só com `tableId`/`commandId` do cliente.

---

### 5.2 Onde remover criação automática de comanda

**Remover `getOrOpenCommand` de:**

| Local | Arquivo |
|-------|---------|
| `GET /menu/{slug}/{table}` | `handler.ts`, `app/api/menu/.../route.ts` |
| Polling do cliente (4s) | indireto via menu GET |

**Manter criação explícita em:**

| Gatilho | Função proposta |
|---------|-----------------|
| OTP verify → nova participação | `openCommandForTableIfNeeded(table)` |
| Staff "abrir mesa" | `adminOpenTable(tableId)` |
| Migração de mesa já `OCUPADA` com `commandId` | compat legado |

**`GET /menu` sem comanda aberta:** retorna catálogo + contexto mesa (`table`, `establishment`, `commandStatus: null`) — **sem** pedidos, **sem** mutação.

---

### 5.3 Migração de pedidos antigos

| Cenário | Estratégia |
|---------|------------|
| Pedidos sem `guestParticipationId` | Atribuir `gp_legacy_{commandId}` sintético por comanda, status `CLOSED`, `displayName: "Legado"` |
| Comandas `ABERTA` em produção | Manter; novos guests exigem OTP; pedidos novos **exigem** `guestParticipationId` real |
| Comandas `PAGAMENTO_SOLICITADO` | Mapear para `FECHANDO`; staff faz `SETTLE` no novo fluxo |
| Demo `ponto-do-sabor` | Flag `otpRequired: false` em dev **ou** participante demo auto-criado (não em produção) |
| Histórico admin | Admin vê pedidos legados agregados por comanda; guest API não expõe legado a novos clientes |

**Script de migração (Fase 0):** uma passagem no store adicionando `guestParticipationId` e participações sintéticas onde `commandId` tem orders.

---

### 5.4 Autenticação do KDS

**Estado atual:** `kds-view.tsx` chama `GET /admin/dashboard?slug=` **sem Bearer** → 401 em produção. Roles `KITCHEN`/`COUNTER` existem mas não são usadas.

**Proposta:**

```text
POST /kds/auth/login     → { establishmentSlug, pin ou email+senha, sectorId }
GET  /kds/queue          → Bearer KDS token, escopo sectorId + establishmentId
PATCH /kds/orders/:id      → mesmo token, só status operacional do setor
```

| Aspecto | Regra |
|---------|-------|
| Token | JWT ou session opaca, TTL 12h, role `KITCHEN` \| `COUNTER` |
| Escopo | `establishmentId` + `sectorId` do token — **ignorar** `slug` na query |
| Dados | Projeção KDS: sem telefone, sem totais financeiros globais |
| UI | Tela de login KDS dedicada; não reutilizar cookie admin |

**Fase 0 mínimo:** proteger `PATCH /orders/:id` com auth KDS **ou** staff; até lá, KDS permanece quebrado em produção — tratar como blocker de hardening.

---

### 5.5 Como proteger SSE

**Estado atual:**

- `events.ts` — bus in-memory por instância serverless (não compartilhado).
- `app/api/events/route.ts` — sem auth, só `establishmentId` na query.
- Deploy unificado (`build-mesaflow.mjs`) **remove** rotas API Next; handler Vercel **não** expõe `/events`.
- Cliente usa **polling 4s** (`use-realtime.ts`).

**Recomendação:**

| Fase | Abordagem |
|------|-----------|
| Fase 0 | Manter **polling autenticado** (`GET /guest/me` ou endpoint leve com cookie) — compatível serverless |
| Se SSE voltar | Token assinado de curta duração (`?channelToken=`) vinculado a `establishmentId` + exp; validar no handshake; **nunca** só `establishmentId` |
| Produção Vercel | Não depender de conexão long-lived cross-instance sem backend dedicado (Redis pub/sub) |

---

### 5.6 Como eliminar preços enviados pelo cliente

**Hoje:** `createOrder` (`store.ts:826`) aceita `OrderItem[]` com `unitPrice`, `variantDelta`, `addons[].price` do body. `cart-context.tsx` monta preços no cliente.

**Fase 0 — função obrigatória:**

```typescript
resolveOrderLines(
  establishmentId: string,
  input: { productId, qty, variantId?, addonSelections?, notes? }[]
): OrderItem[]
```

| Validação | Ação |
|-----------|------|
| `productId` ∈ catálogo do tenant | 400 se não |
| `variantId` ∈ `product.variants` | recalcular delta |
| addons ∈ `product.addons` | recalcular preço |
| `qty` > 0, limite máximo | 400 |
| produto inativo / setor errado | 400 |
| rodízio | regras por `guestParticipationId` |

**API:** `POST /orders` body **sem** campos de preço; rejeitar com 400 se `unitPrice` presente (breaking intencional).

---

### 5.7 Cross-tenant

**Modelo:** um `MesaFlowStore` / Blob para todos os tenants — isolamento só por `establishmentId` na aplicação.

**Falhas atuais:**

| Rota | Gap |
|------|-----|
| `GET /orders` sem filtro | todos os pedidos de todos os tenants |
| `GET/PATCH /orders/:id` | qualquer ID global |
| `POST /rodizio/round` | `rodizioId` sem checar `rodizio.establishmentId === est.id` |

**Regra Fase 0:** todo handler deriva `establishmentId` de **sessão** (admin, KDS, guest) — nunca confiar em `establishmentId`/`slug`/`commandId` do body para autorização.

**Admin:** já correto (session → establishment). **Guest (futuro):** session → participation → establishment. **KDS:** token → establishment + sector.

---

### 5.8 IDOR em pedidos, comandas e mesas

| Recurso | Vetor atual | Mitigação |
|---------|-------------|-----------|
| `Order` | `GET/PATCH /orders/:id` sem auth | Exigir auth; guest só se `order.guestParticipationId === session.participationId`; staff só mesmo tenant |
| `Command` | `commandId` no menu JSON | Guest só acessa command da própria participação; não aceitar `commandId` no body |
| `Table` | `qrToken` 64 hex — segredo compartilhado | Manter entropia; QR só inicia fluxo OTP; pedidos exigem sessão |
| `GuestParticipation` | (futuro) | Só `GET /guest/me`; admin lista por `commandId` com Bearer |
| `ClosingRequest` | (futuro) | Guest só cancela própria; staff confirma com role |

**Lista de pedidos:** substituir `GET /orders` global por `GET /guest/me/orders` (cookie) e `GET /admin/orders?commandId=` (Bearer).

---

### 5.9 Separar armazenamento público de dados privados

**Bloqueador confirmado:** `mesaflow/store.json` com `access: "public"` contém `users.passwordHash`, `sessions.token`, e em breve PII.

**Arquitetura proposta:**

```text
┌─────────────────────────────┐     ┌──────────────────────────────────┐
│ Operational Store (privado) │     │ Identity/Security Store (privado) │
│ Blob access: private        │     │ Blob access: private              │
├─────────────────────────────┤     ├──────────────────────────────────┤
│ establishments, products,   │     │ users, sessions (admin),          │
│ tables, commands, orders,   │     │ clientSessions, otpChallenges,    │
│ participations (sem phone   │     │ phoneCiphertext vault, auditEvents│
│  ciphertext), notifications │     │                                   │
└─────────────────────────────┘     └──────────────────────────────────┘
```

| Dado | Store |
|------|-------|
| `phoneCiphertext` | Identity (nunca operational público) |
| `phoneLookupHash` | Identity ou operational sem ciphertext |
| `phoneDisplay` | Operational (mascarado) |
| Admin `passwordHash` | Identity — **migrar imediatamente** |
| `ClientSession.tokenHash` | Identity |
| Catálogo, pedidos operacionais | Operational |

**Fase 0 mínimo (sem split completo):** trocar Blob para **`access: "private"`** + fetch via credencial server-side; mover `users`/`sessions` para arquivo separado privado. Split completo pode ser Fase 0b.

**Participação no operational store:** armazenar só `phoneDisplay`, `phoneLookupHash` (hash não reversível), **não** ciphertext junto do catálogo se operational vazar.

---

### 5.10 Concorrência no Blob

**Padrão atual:** hydrate → mutate in-memory → `put(..., allowOverwrite: true)` — **last-write-wins**.

| Risco | Cenário |
|-------|---------|
| Lost update | Dois `POST /orders` simultâneos |
| Dupla participação | Dois OTP verify simultâneos mesmo telefone/comanda |
| Dupla comanda | Duas aberturas de mesa simultâneas |

**Mitigações (escalonadas):**

| Nível | Mecanismo |
|-------|-----------|
| Fase 0 | `If-Match` / ETag no Blob; retry com re-hydrate (3x) |
| Fase 0 | **Idempotency** + checagem lógica antes de insert |
| Fase 1 | Fila serializada por `establishmentId` ou `commandId` (Vercel KV / Redis) |
| Fase 2 | Postgres com transações |

**Participação duplicada:** antes de `insert`, `findOpenParticipation(commandId, phoneLookupHash)`; se existir, retornar existente (decisão D3). Em corrida, segunda escrita deve falhar na re-leitura pós-ETag.

---

### 5.11 Idempotência

| Operação | Chave | Comportamento |
|----------|-------|---------------|
| `POST /orders` | Header `Idempotency-Key` (UUID) + `guestParticipationId` | Se key já usada, retornar mesmo `orderId` |
| OTP request | `(establishmentId, tableId, phoneLookupHash, purpose)` ativo | Invalidar challenges anteriores; um challenge ativo |
| OTP verify | `challengeId` + `consumedAt` | Segundo verify com mesmo challenge → 409 |
| `REQUEST_CLOSE_*` | `(participationId, scope, targets hash)` pendente | Não duplicar `ClosingRequest PENDING` idêntico |
| `CONFIRM_CLOSING` | `(closingRequestId, staffUserId)` | Segundo confirm → 200 idempotente (já CLOSED) |
| `SETTLE` command | `commandId` | Se já `FECHADA`, 200 sem efeito |

Armazenar tabela `idempotencyRecords` com TTL 24h no Identity store ou operational.

---

### 5.12 Duas participações simultâneas (mesmo telefone, mesma comanda)

**Fluxo seguro:**

```text
POST /guest/otp/verify
  → phoneLookupHash = HMAC(...)
  → existing = findParticipation(commandId, phoneLookupHash, [OPEN, CLOSING_REQUESTED])
  → if existing: create ClientSession → existing; message "Você já está nesta mesa"
  → else: create GuestParticipation + ClientSession
```

**Concorrência:** duas requests paralelas — ambas passam `find` vazio — **duas inserts**.

**Mitigação:** após insert, re-read store; se count > 1 para mesma chave lógica, **merge** (manter mais antiga, revogar duplicata) ou falhar retry. Com ETag, segunda write falha e retry encontra a primeira.

**Índice lógico obrigatório:** `participationIndex[(commandId, phoneLookupHash)] → gpId` em memória durante request; persistido como scan até ter DB.

---

### 5.13 Duas comandas simultâneas (mesma mesa)

**Causa atual:** `getOrOpenCommand` cria nova comanda se status ≠ `ABERTA` (ex.: após bill).

**Regra nova:**

- Uma mesa tem **no máximo uma** `Command` em `ABERTA | FECHANDO` por vez.
- `openCommandForTable` usa: se `table.commandId` aponta para comanda não-terminal, reutilizar; senão criar **só** se não existir outra ativa para `tableId` (scan `commands`).

**Concorrência:** lock lógico `tableId` na escrita ou conditional: `if (!hasActiveCommand(tableId)) create`.

---

### 5.14 `CLOSED` irreversível pelo cliente

| Vetor | Bloqueio |
|-------|----------|
| API guest seta status | Nenhum endpoint aceita `status` no body |
| Reutilizar `gp` CLOSED | `findOpenParticipation` ignora CLOSED; verify cria **nova** gp |
| Cookie de sessão antiga | `ClientSession` vinculada a gp CLOSED → 401 + fluxo nova participação |
| `CANCEL_CLOSING` após CONFIRM | Handler rejeita se status já `CLOSED` |
| Pedidos após CLOSED | `createOrder` exige `participation.status === OPEN` |

Staff pode ter `REOPEN` operacional (nova comanda + novas participações) — fora do escopo guest.

---

### 5.15 Auditoria de fechamento administrativo

**Toda** ação staff que altera fechamento gera `AuditEvent`:

| Evento | `type` |
|--------|--------|
| Confirmar fechamento participante | `closing.confirmed` |
| Cancelar fechamento (staff) | `closing.cancelled_by_staff` |
| Settle comanda | `command.settled` |
| Reabrir mesa | `command.reopened` |
| Ver telefone completo | `privacy.phone_revealed` |
| Revogar sessão cliente | `session.revoked` |

```typescript
interface AuditEvent {
  id: string;
  establishmentId: string;
  type: string;
  actorType: "STAFF" | "SYSTEM";
  actorUserId?: string;
  targetType: "participation" | "command" | "closing_request" | ...;
  targetId: string;
  metadata: Record<string, unknown>; // sem PII, sem OTP
  createdAt: string;
}
```

Retenção sugerida: 90 dias (decisão operacional ainda aberta).

---

## 6. Mapa de vulnerabilidades × decisões

| ID | Achado atual | Relação com decisões | Prioridade Fase 0 |
|----|--------------|----------------------|-------------------|
| S1 | APIs sem auth | D16, D17, §5.7–5.8 | P0 |
| S2 | Preços do cliente | §5.6 | P0 |
| S8 | Blob público + hashes | D14, D15, §5.9 | **Bloqueador** |
| A3 | Dupla comanda | §5.13, D9 | P0 |
| O1 | Bill abre nova comanda | D6–D9, D17 | P0 |
| O3 | KDS sem auth | §5.4 | P0 |
| A5 | LWW Blob | §5.10–5.12 | P1 |
| — | Sem GuestParticipation | D1–D5 | Fase 1+ |

---

## 7. Plano de Fase 0 revisado (pré-WhatsApp)

Somente após esta auditoria. **Ordem obrigatória:**

### 0a — Bloqueadores de persistência (antes de PII)

1. Blob **private** (ou split operational/identity).
2. Migrar `users` + `sessions` admin para store privado.
3. ETag/retry no flush.

### 0b — Hardening API (sem OTP ainda)

1. Remover `getOrOpenCommand` do GET menu.
2. `resolveOrderLines` server-side; rejeitar preços no body.
3. Fechar `GET/PATCH /orders` anônimos; rotas autenticadas por papel.
4. Auth KDS mínima.
5. Corrigir `requestBill` → não criar nova comanda; preparar stub `ClosingRequest` (opcional em 0b, obrigatório antes Fase 4).
6. Migração `guestParticipationId` legado em pedidos existentes.
7. Guards: `participation.status` para pedidos (stub `OPEN` legado para pedidos antigos).

### 0c — Verificação

- Testes de IDOR, repricing, cross-tenant, concorrência simulada.
- `/health` com diagnóstico Blob sem vazar store.
- Demo `ponto-do-sabor` funcional com fluxo legado ou participante sintético.

**Fase 1+:** OTP, `GuestParticipation` real, `ClientSession`, fechamento completo.

---

## 8. Decisões ainda abertas (não bloqueiam Fase 0)

| # | Tema | Notas |
|---|------|-------|
| 1 | Provedor WhatsApp | Meta Cloud vs Z-API vs mock dev |
| 2 | Retenção de dados | Sugestão 90 dias pós CLOSED |
| 3 | Timeout participação OPEN | Alerta admin vs auto-close |
| 4 | Transferência entre mesas | Staff move `gp`? |
| 5 | Troca de número mid-meal | Re-OTP + merge? |
| 6 | OTP obrigatório em demo | Flag por tenant |
| 7 | Cobrança rodízio | Na entrada vs no fechamento |
| 8 | `REOPEN` comanda | Nova command sempre vs reativar |

---

## 9. Referências de código (estado atual)

| Tema | Arquivo |
|------|---------|
| Domínio / persistência | `projects/mesaflow/src/lib/store.ts` |
| Tipos | `projects/mesaflow/src/lib/types.ts` |
| API produção | `projects/iphone-imports/api/_mesaflow/handler.ts` |
| Carrinho / preços cliente | `projects/mesaflow/src/contexts/cart-context.tsx` |
| KDS | `projects/mesaflow/src/components/kds/kds-view.tsx` |
| Polling | `projects/mesaflow/src/hooks/use-realtime.ts` |
| SSE (não deployado) | `projects/mesaflow/src/app/api/events/route.ts` |
| Bill legado | `store.ts:requestBill`, `handler.ts POST /bill` |
| Build deploy | `projects/iphone-imports/scripts/build-mesaflow.mjs` |

---

## 10. Critérios de saída da Fase 0

- [ ] Nenhum dado sensível em Blob público
- [ ] `POST /orders` sem preços no body; servidor recalcula
- [ ] Rotas de pedido sem IDOR cross-tenant
- [ ] GET menu não cria comanda
- [ ] KDS autenticado e sem telefone
- [ ] Pedidos legados migrados com `guestParticipationId` sintético
- [ ] Documentação de API guest/admin atualizada
- [ ] Testes automatizados para repricing e auth gates

**Somente então** iniciar Fase 1 (modelo `GuestParticipation` + OTP mock).

---

*Documento gerado a partir do código em `main` + PR #194 (health Blob). Primeira auditoria: `AUDIT-WHATSAPP-IDENTITY.md`.*
