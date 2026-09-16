# MesaFlow — Auditoria arquitetural: identidade, WhatsApp OTP e fechamento

> **Status:** base aprovada — ver decisões fechadas e gate de implementação em  
> **`docs/AUDIT-PRE-PHASE-0.md`** (segunda auditoria, 2026-09-16)  
> **Escopo:** `projects/mesaflow/`  
> **Data:** 2026-09-16

---

## Sumário executivo

O MesaFlow hoje é um **MVP operacional por mesa**, sem identidade de cliente. Qualquer pessoa com o `qrToken` da mesa pode ver a comanda inteira, criar pedidos com preços arbitrários e solicitar fechamento da mesa. Não existe participante, sessão de cliente, OTP nem fechamento por pessoa.

A proposta de WhatsApp OTP é **viável e necessária**, mas exige **novas entidades de domínio** e **correção de falhas de segurança pré-existentes** antes de qualquer integração com provedor de mensagens.

**Conceitos que devem permanecer separados:**

```
WhatsApp Identity (verificação pontual)
    ↓
GuestParticipation (pessoa na mesa, persiste até fechamento confirmado)
    ↓
ClientSession (dispositivo/navegador, pode expirar e ser recriada)
    ↓
Order / RodizioRound (consumo atribuído à participação)
```

---

## 1. Como o sistema funciona hoje

### 1.1 Modelo de dados atual

| Entidade | Papel | Vínculos |
|----------|-------|----------|
| `Establishment` | Tenant | `establishmentId` em tudo |
| `Table` | Mesa física | `qrToken` único, `commandId?`, `status` |
| `Command` | Comanda financeira da mesa | 1 por mesa ativa; `status`: ABERTA \| PAGAMENTO_SOLICITADO \| FECHADA |
| `Order` | Pedido | `tableId`, `commandId`; **sem guest** |
| `OrderItem` | Linha do pedido | preços vindos do cliente |
| `RodizioRound` | Rodada de rodízio | `commandId`, `tableId`; **sem guest** |
| `Session` | Sessão **admin** | `userId`, Bearer token, 30 dias |
| `User` | Staff (OWNER, MANAGER, KDS…) | email + senha |

**Não existem:** visitante, participante, sessão de cliente, OTP, telefone, fechamento parcial.

### 1.2 QR Code

- URL: `/mesaflow/m/{slug}/{qrToken}` → rewrite para `m/live` → `CustomerApp`
- `qrToken`: 32 bytes hex (`randomBytes`), único globalmente
- `findTableByQr(estId, token)`: valida token + mesa não INATIVA
- QR representa **estabelecimento + mesa** (via slug + token)
- QR **não** é sessão; é capacidade de **iniciar** acesso à mesa

### 1.3 Fluxo do cliente (hoje)

1. Escaneia QR → carrega `CustomerApp(slug, tableToken)`
2. `GET /menu/{slug}/{table}` → abre comanda se necessário (`getOrOpenCommand`)
3. Retorna **todos** os pedidos da comanda
4. Cliente monta carrinho (estado React local)
5. `POST /orders` com `{ slug, tableToken, items }` — **sem autenticação**
6. `POST /bill` com `{ slug, tableToken }` — fecha conta **da mesa inteira**
7. Polling 4s (`useRealtime`) recarrega menu

### 1.4 Comanda (`Command`)

```typescript
// getOrOpenCommand — store.ts:750
if (table.commandId && commands[table.commandId]?.status === "ABERTA")
  return existing;
// senão: cria NOVA comanda
```

**RISCOS OPERACIONAIS identificados:**

1. **Carregar o menu abre comanda** — visita passiva ocupa mesa.
2. **Após `PAGAMENTO_SOLICITADO`, novo pedido abre outra comanda** — comanda anterior fica órfã.
3. **`FECHADA` existe no tipo mas nunca é atribuída** — não há encerramento real.
4. `guestCount` fixo em `2` na criação; não reflete participantes reais.

### 1.5 Pedidos

- `createOrder` aceita `items` do body com `unitPrice`, `addons[].price` do cliente
- **Não há validação server-side** contra catálogo de produtos
- `GET /orders` e `PATCH /orders/:id` **sem autenticação**
- KDS chama `PATCH /orders/:id` sem Bearer

### 1.6 Rodízio

- `RodizioRound` por `commandId`; sem dono
- Limites (`maxItemsPerRound`, `maxRounds`, `minIntervalSec`) aplicados só no POST da rodada atual
- Não há contagem por pessoa
- `pricePerPerson` no modelo `Rodizio` **não é cobrado** em lugar nenhum

### 1.7 Fechamento de conta

- Única ação: `requestBill(tableId)` → `PAGAMENTO_SOLICITADO` + notificação admin
- Sem fechamento por pessoa, sem aprovação, sem `FECHADA`
- Cliente vê comanda **agregada de todos** na mesa

### 1.8 Admin / KDS

- Admin: Bearer + role OWNER \| MANAGER
- KDS: tenta `GET /admin/dashboard?slug=...` **sem token** → 401 em produção
- SSE `/events?establishmentId=` — sem auth; só `establishmentId` na query

### 1.9 Persistência

- JSON monolítico em `mesaflow/store.json` (Blob público compartilhado)
- `allowOverwrite: true` — sem controle de concorrência otimista
- Leitura/escrita por request serverless — risco de lost updates

### 1.10 Autenticação existente

| Ator | Mecanismo | Armazenamento |
|------|-----------|---------------|
| Admin | Bearer `Session.token` | `sessionStorage` + store |
| Cliente | **Nenhum** | — |

---

## 2. Onde a arquitetura atual é insuficiente

| Gap | Impacto |
|-----|---------|
| Sem participante | Impossível atribuir pedidos a pessoas |
| Sem verificação | Trotes, pedidos falsos, abuso |
| Sem sessão de cliente | Impossível autorizar ações no backend |
| Comanda = mesa inteira | Fechamento parcial inviável |
| Preços do cliente | Fraude financeira |
| APIs abertas | Manipulação cross-mesa/tenant |
| Sem máquina de estados de fechamento | Caos operacional |
| Rodízio sem guest | Cobrança/limites por pessoa impossíveis |
| `FECHADA` não implementada | Mesas/comandas nunca encerram corretamente |

---

## 3. Vulnerabilidades atuais (pré-WhatsApp)

### RISCO DE SEGURANÇA

| # | Vetor | Detalhe |
|---|-------|---------|
| S1 | Pedido sem auth | `POST /orders` só exige `slug` + `tableToken` |
| S2 | Manipulação de preço | `unitPrice`/`addons` do body aceitos sem recálculo |
| S3 | Listagem global | `GET /orders?establishmentId=` expõe pedidos |
| S4 | Status sem auth | `PATCH /orders/:id` altera qualquer pedido |
| S5 | Menu vaza pedidos | Todos os pedidos da comanda visíveis a qualquer visitante |
| S6 | QR compartilhável | Token na URL = segredo compartilhado; vazamento = acesso total |
| S7 | SSE aberto | Qualquer um com `establishmentId` recebe eventos |
| S8 | Blob público | `store.json` contém hashes de senha admin; telefones futuros seriam expostos |
| S9 | Cross-tenant | IDs previsíveis (`ord_`, `cmd_`) facilitam enumeração se auth falhar |

### RISCO ARQUITETURAL

| # | Problema |
|---|----------|
| A1 | `Session` (admin) reutiliza nome conceitual — confusão com sessão de cliente |
| A2 | `Command.guestCount` decorativo |
| A3 | Duas comandas por mesa após pedir conta |
| A4 | Polling disfarçado de realtime — ordem de eventos não garantida |
| A5 | Sem transações — corrida em writes concorrentes no Blob |

### RISCO OPERACIONAL

| # | Problema |
|---|----------|
| O1 | Pedir conta não bloqueia novos pedidos (abre nova comanda) |
| O2 | Impossível saber quem pediu o quê para cobrar |
| O3 | KDS potencialmente inoperante sem credenciais |
| O4 | Mesa nunca volta a LIVRE automaticamente |

---

## 4. Modelo de identidade proposto

### 4.1 Entidades novas

```
Establishment
  └── Table (qrToken)
        └── TableVisit (opcional: renomear/evoluir Command)
              └── GuestParticipation  ← núcleo da regra de negócio
                    └── ClientSession (1..N por participação)
                          └── Order / RodizioRound
```

**Recomendação:** manter `Command` como container financeiro da mesa (TableVisit) e adicionar `GuestParticipation` abaixo dele.

### 4.2 GuestParticipation (participação na mesa)

```typescript
interface GuestParticipation {
  id: string;                    // gp_
  establishmentId: string;
  commandId: string;
  tableId: string;

  phoneE164: string;             // armazenado cifrado ou HMAC-indexed
  phoneDisplay: string;          // "+55 ** *****-1234" — para admin

  displayName?: string;          // apelido opcional ("João", "Pessoa 2")
  participantIndex: number;      // 1, 2, 3… na mesa (UI)

  status: "OPEN" | "CLOSING_REQUESTED" | "CLOSED";

  verifiedAt: string;
  joinedAt: string;
  closingRequestedAt?: string;
  closedAt?: string;             // só quando restaurante confirma
  closedByUserId?: string;       // staff que fechou

  // antifraude / limites
  orderCount: number;
  lastOrderAt?: string;
}
```

**O que representa a pessoa:** `GuestParticipation` — não o telefone.

| Pergunta | Resposta proposta |
|----------|-------------------|
| Vínculo à mesa | `tableId` + `commandId` ativos |
| Vínculo ao estabelecimento | `establishmentId` |
| Vínculo aos pedidos | `Order.guestParticipationId` |
| Telefone = pessoa forever? | **Não.** Telefone identifica quem entrou; participação é o registro de consumo |
| Mesmo telefone, mesma mesa, reentrada | Reutiliza participação `OPEN` (não duplica João) |
| Mesmo telefone, duas mesas simultâneas | **DECISÃO NECESSÁRIA** (ver §20) |
| Fechar navegador | Participação permanece `OPEN` |
| Refresh / nova aba | `ClientSession` recupera participação |
| QR escaneado de novo | Fluxo de recuperação (cookie → participação; senão OTP leve) |

### 4.3 ClientSession (sessão técnica)

```typescript
interface ClientSession {
  id: string;                    // cs_
  guestParticipationId: string;
  tokenHash: string;             // nunca armazenar token puro
  userAgentHash?: string;
  ipHash?: string;
  createdAt: string;
  expiresAt: string;             // ex.: 24h sliding
  lastSeenAt: string;
  revokedAt?: string;
}
```

**Entrega ao cliente:** cookie `HttpOnly; Secure; SameSite=Lax` com token opaco (`mf_cs`).

- **Não** usar `localStorage` para credencial de cliente
- Múltiplas abas: mesma sessão (mesmo cookie)
- Troca de dispositivo: nova verificação se não houver mecanismo de recovery aprovado

### 4.4 OtpChallenge (verificação WhatsApp)

```typescript
interface OtpChallenge {
  id: string;                    // otp_
  establishmentId: string;
  tableId: string;
  phoneE164: string;
  codeHash: string;              // bcrypt/scrypt do código — NUNCA texto puro
  expiresAt: string;             // ex.: 5 min
  attempts: number;
  maxAttempts: number;           // ex.: 5
  consumedAt?: string;
  sentAt: string;
  resendCount: number;
  ipHash?: string;
  purpose: "JOIN_TABLE" | "RECOVER_PARTICIPATION";
}
```

### 4.5 ClosingRequest (solicitação de fechamento)

```typescript
interface ClosingRequest {
  id: string;                    // clr_
  establishmentId: string;
  commandId: string;
  requestedByGuestParticipationId: string;

  scope: "SELF" | "SELECTED" | "TABLE";
  targetGuestParticipationIds: string[];  // vazio = SELF; todos = TABLE

  status: "PENDING" | "ACKNOWLEDGED" | "CANCELLED" | "SETTLED";

  createdAt: string;
  acknowledgedAt?: string;
  settledAt?: string;
  settledByUserId?: string;

  notes?: string;
}
```

**Distinção crítica:**

| Ação | Quem | Efeito |
|------|------|--------|
| `REQUEST_CLOSING` | Cliente | Cria `ClosingRequest` + `participation.status = CLOSING_REQUESTED` (escopo definido) |
| `CONFIRM_CLOSING` | Staff (OWNER/MANAGER) | `participation.status = CLOSED` |
| `SETTLE_COMMAND` | Staff | Fecha comanda (`FECHADA`), mesa `LIVRE`, encerra participações restantes |

Solicitar fechamento da mesa **≠** autorizar pagamento **≠** encerrar consumo.

### 4.6 AuditEvent (recomendado)

```typescript
interface AuditEvent {
  id: string;
  establishmentId: string;
  type: AuditEventType;
  actorType: "GUEST" | "STAFF" | "SYSTEM";
  actorId?: string;
  targetType?: string;
  targetId?: string;
  metadata: Record<string, unknown>;  // SEM telefone completo
  ipHash?: string;
  createdAt: string;
}
```

---

## 5. Fluxo completo: QR → WhatsApp → pedido

```
┌─────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────────┐
│ QR scan │───▶│ Resolve mesa │───▶│ Tela welcome │───▶│ POST /guest/otp  │
└─────────┘    │ (sem auth)   │    │ Mesa 08      │    │ request          │
               └──────────────┘    └──────────────┘    └────────┬─────────┘
                                                                │
                    ┌───────────────────────────────────────────┘
                    ▼
         ┌────────────────────┐    ┌─────────────────────┐
         │ WhatsApp envia OTP │───▶│ POST /guest/otp/    │
         └────────────────────┘    │ verify              │
                                   └─────────┬───────────┘
                                             │
                    ┌────────────────────────┘
                    ▼
         ┌────────────────────────────┐
         │ Upsert GuestParticipation  │
         │ Create ClientSession       │
         │ Set-Cookie HttpOnly        │
         └─────────┬──────────────────┘
                   ▼
         ┌────────────────────┐    ┌──────────────┐
         │ Apelido opcional   │───▶│ Cardápio     │
         └────────────────────┘    └──────┬───────┘
                                          ▼
                                   POST /orders
                                   (Cookie obrigatório)
```

### Recuperação sem novo OTP (regra de domínio)

1. Request chega com cookie `mf_cs` válido → carrega `ClientSession` → `GuestParticipation`
2. Se cookie ausente mas telefone já verificado na mesa `OPEN`:
   - **Opção A (recomendada):** OTP de recuperação curto (4 dígitos, 1 tentativa/min)
   - **Opção B:** magic link WhatsApp (mais caro, melhor UX)
3. Se participação `CLOSED` → fluxo de nova entrada (nova participação após staff reabrir mesa)

**Não exigir OTP em:** refresh, nova aba, sessão técnica expirada com cookie válido renovável.

---

## 6. Fluxo de pedidos (proposto)

### Autorização backend

```text
ClientSession válida
  AND GuestParticipation.status === OPEN
  AND Command.status === ABERTA
  AND Establishment.open === true
  AND Table.status !== INATIVA
```

### Criação de pedido

1. Cliente envia `{ productId, qty, variantId?, addonIds?, notes? }` — **não** preços
2. Servidor resolve preços do catálogo
3. `Order.guestParticipationId = session.participationId`
4. `Order.commandId` derivado da participação (não do body)
5. Emit SSE `order.created`

### Visualização

| Recurso | Cliente vê |
|---------|------------|
| Próprios pedidos | Sempre |
| Pedidos de outros na mesa | **DECISÃO NECESSÁRIA** — default: só próprios; total da mesa opcional agregado |
| Comanda própria | Soma dos seus itens |
| Comanda da mesa | Somente totais se política permitir |

---

## 7. Fluxo de fechamento

### Tipos de solicitação

| Tipo | API | Efeito imediato pro cliente solicitante | Efeito nos demais |
|------|-----|----------------------------------------|-------------------|
| `REQUEST_CLOSE_SELF` | scope=SELF | `CLOSING_REQUESTED` | Nenhum |
| `REQUEST_CLOSE_SELECTED` | scope=SELECTED | solicitante + alvos → `CLOSING_REQUESTED` | **DECISÃO NECESSÁRIA** — alvos precisam ser notificados? |
| `REQUEST_CLOSE_TABLE` | scope=TABLE | Cria request TABLE; **não** fecha participações automaticamente | Notifica staff |

### Máquina de estados proposta

**GuestParticipation:**

```
OPEN ──(client REQUEST_CLOSE_*)──▶ CLOSING_REQUESTED ──(staff CONFIRM)──▶ CLOSED
  ▲                                        │
  └────────(staff CANCEL_CLOSING)──────────┘
```

**Command:**

```
ABERTA ──(qualquer REQUEST_CLOSE_TABLE ou N participações CLOSING)──▶ FECHANDO
FECHANDO ──(staff SETTLE ou todas participações CLOSED + pagamento)──▶ FECHADA
```

**Table:**

```
LIVRE ──(primeira participação OPEN)──▶ OCUPADA
OCUPADA ──(REQUEST_CLOSE_TABLE pendente)──▶ AGUARDANDO_PAGAMENTO (opcional)
AGUARDANDO_PAGAMENTO ──(SETTLE)──▶ LIVRE
```

### Novos pedidos durante `CLOSING_REQUESTED`

**DECISÃO NECESSÁRIA.** Alternativas:

| Opção | Prós | Contras |
|-------|------|---------|
| A) Bloquear novos pedidos do participante em CLOSING_REQUESTED | Simples | Cliente não corrige pedido |
| B) Permitir pedidos até staff confirmar | Flexível | Conflito com fechamento |
| C) Bloquear só após staff ACK | Balanceado | Mais estados |

**Recomendação inicial:** **C** — participante em `CLOSING_REQUESTED` pode pedir até staff `ACKNOWLEDGE`; depois bloqueado.

---

## 8. Cenário João (passo a passo)

| Etapa | Identidade | Participação | Sessão | Autorização | Estado conta |
|-------|------------|--------------|--------|-------------|--------------|
| 1. João escaneia QR | — | — | — | Só resolve mesa | Command ABERTA |
| 2. Verifica WhatsApp | phone verificado | `gp_joao` OPEN criada | `cs_1` cookie | pode pedir | OPEN |
| 3. Faz pedidos | — | orders → gp_joao | cs_1 | OK | OPEN |
| 4. Fecha navegador | — | gp_joao OPEN | cs_1 expira? | — | OPEN |
| 5. Maria entra | phone maria | `gp_maria` OPEN | `cs_2` | independente | ambos OPEN |
| 6. João retorna (cookie válido) | — | gp_joao OPEN | cs_1 renovada | OK | OPEN |
| 7. João escaneia QR de novo (sem cookie) | — | lookup phone+mesa | novo cs_3 após OTP recovery | OK | OPEN (mesmo gp_joao) |
| 8. João REQUEST_CLOSE_SELF | — | gp_joao CLOSING_REQUESTED | cs_3 | pedidos conforme política | CLOSING_REQUESTED |
| 9. João fecha navegador | — | gp_joao CLOSING_REQUESTED | — | — | CLOSING_REQUESTED |
| 10. Restaurante CONFIRM | — | gp_joao CLOSED | cs_3 revogada | sem pedidos | CLOSED |
| 11. João abre QR de novo | — | gp_joao CLOSED | — | **DECISÃO:** nova participação ou bloqueio | CLOSED |

### Casos adicionais

| Caso | Comportamento proposto |
|------|------------------------|
| João volta após CLOSED | Nova participação se mesa/comanda ativa; senão aguardar staff |
| João em outro dispositivo | OTP recovery → mesma participação OPEN |
| João em duas mesas simultâneas | **DECISÃO NECESSÁRIA** — default: permitir, participações independentes |
| Dois usam mesmo número | Segunda pessoa: **DECISÃO** — bloquear ou perguntar "continuar como João?" |
| Perde telefone | Staff resolve no admin (vincular/transferir/fechar) |
| Participação aberta 48h | Alerta admin + **DECISÃO** auto-close |
| Restaurante fecha mesa inteira | `SETTLE_COMMAND` → todas participações CLOSED |
| Restaurante fecha só João | `CONFIRM_CLOSING(gp_joao)` |
| Reabrir conta | Staff `REOPEN_COMMAND` → nova Command, participações novas |
| Desfazer fechamento | Só antes de CLOSED; `CANCEL_CLOSING` volta para OPEN |

---

## 9. WhatsApp / OTP — design seguro

| Parâmetro | Valor inicial | Notas |
|-----------|---------------|-------|
| Dígitos | 6 | Balanceamento UX/entropia (10^6 combinações) |
| Validade | 5 min | |
| Max tentativas/código | 5 | Depois invalida challenge |
| Cooldown reenvio | 60 s | Por telefone |
| Max OTP/telefone/hora | 3 | Ajustar por plano |
| Max OTP/IP/hora | 10 | |
| Max OTP/mesa/hora | 15 | Anti-bombardeio à mesa |
| Armazenamento | `hash(code + salt)` bcrypt cost 10 | Nunca texto puro |
| Invalidação | Novo request invalida challenges anteriores do mesmo phone+table | |

### Normalização de telefone

- E.164 obrigatório (`+5511999999999`)
- Biblioteca: `libphonenumber-js`
- Rejeitar fixo se política exigir móvel (WhatsApp)
- Validar país suportado

### Provedor WhatsApp

**DECISÃO NECESSÁRIA:** Meta Cloud API vs Z-API vs Twilio vs mock em dev.

---

## 10. Análise de abuso

| Ataque | Mitigação |
|--------|-----------|
| Spam OTP a terceiros | Rate limit + captcha após N + só enviar se mesa válida |
| Pedidos falsos | OTP + sessão + preços server-side |
| Bombardear estabelecimento | Rate limit por mesa/IP + alertas admin |
| Vários números | Limite participantes/mesa (ex.: 20) |
| Reutilizar sessão roubada | HttpOnly + rotação + bind UA/IP leve |
| Copiar URL/QR | QR só inicia fluxo; pedidos exigem sessão |
| Acessar pedido alheio | Filtrar por `guestParticipationId` da sessão |
| Manipular IDs no frontend | Backend deriva tudo da sessão |
| Chamar API direta | Cookie + CSRF token em mutações |
| Brute force OTP | Hash + max attempts + lockout |
| Enumeração de IDs | Tokens opacos; rate limit em 404 |

---

## 11. QR Code — decisão

| Opção | Recomendação |
|-------|--------------|
| QR = mesa + estabelecimento | **SIM** (atual, manter) |
| QR = sessão | **NÃO** — imprime físico, sessão é digital |
| QR assinado com expiração | Opcional fase 2; complexifica reimpressão |
| QR concede pedidos | **NÃO** — só `TABLE_ENTRY` |

---

## 12. Rodízio — impacto

Mudanças obrigatórias:

```typescript
interface RodizioRound {
  // ...existente
  guestParticipationId: string;
}

interface GuestParticipation {
  rodizioRoundCount: number;
  lastRodizioRoundAt?: string;
}
```

- Limites `maxRounds` / `minIntervalSec` **por participação**
- Cobrança `pricePerPerson` ao confirmar participação ou ao fechar
- Premium/addons vinculados ao `guestParticipationId`
- UI: "Sua rodada 2" vs "Rodada da mesa" (agregado admin only)

---

## 13. Admin — permissões propostas

| Ação | OWNER | MANAGER | KITCHEN/COUNTER |
|------|-------|---------|-----------------|
| Ver participantes | ✓ | ✓ | ✗ |
| Ver telefone mascarado | ✓ | ✓ | ✗ |
| Ver telefone completo | ✓ | opcional | ✗ |
| Bloquear participante | ✓ | ✓ | ✗ |
| Revogar sessão cliente | ✓ | ✓ | ✗ |
| Confirmar fechamento | ✓ | ✓ | ✗ |
| Fechar mesa (SETTLE) | ✓ | ✓ | ✗ |
| Reabrir mesa | ✓ | ✗ | ✗ |
| Cancelar pedido | ✓ | ✓ | setor próprio |
| Resolver conflito fechamento | ✓ | ✓ | ✗ |

---

## 14. Privacidade

| Onde | Regra |
|------|-------|
| Store/Blob | Telefone cifrado (AES-GCM) ou index HMAC; exibir mascarado |
| API cliente | Nunca telefone completo; apelido/índice para outros guests |
| API admin | Mascarado default; reveal com role + audit log |
| Logs | `phoneHash` apenas |
| SSE | Eventos sem PII; `guestParticipationId` opaco |
| Retenção | **DECISÃO NECESSÁRIA** — sugestão: 90 dias pós CLOSED |
| Backups | Mesmo nível do Blob |

---

## 15. Persistência — impacto

### Novas coleções no `MesaFlowStore`

```typescript
guestParticipations: Record<string, GuestParticipation>;
clientSessions: Record<string, ClientSession>;
otpChallenges: Record<string, OtpChallenge>;
closingRequests: Record<string, ClosingRequest>;
auditEvents: Record<string, AuditEvent>;  // ou ring buffer por tenant
```

### Campos novos em entidades existentes

```typescript
Order { guestParticipationId: string }
RodizioRound { guestParticipationId: string }
EstablishmentSettings {
  whatsappOtpEnabled: boolean;
  maxGuestsPerTable: number;
  // ...
}
```

### Migração

1. Pedidos existentes: `guestParticipationId = "legacy_anonymous"` ou null → tratados como "mesa" no admin
2. Comandas abertas: manter; novos guests só com OTP
3. Demo `ponto-do-sabor`: flag `requireOtp: false` em dev ou participante demo automático
4. Seeds: criar 2 participações demo na mesa 08

### Concorrência

**RISCO ARQUITETURAL:** JSON + overwrite sem ETag.

**Recomendação fase 1:** reintroduzir `ifMatch`/ETag no Blob.  
**Fase 2:** fila de writes ou DB (Postgres/Redis) se OTP volume crescer.

---

## 16. Compatibilidade

| Área | Estratégia |
|------|------------|
| Admin existente | Sem breaking; novas telas participantes |
| KDS | Adiciona coluna "Participante" no ticket; auth KDS separado |
| QR físicos impressos | Continuam funcionando (entram no fluxo OTP) |
| `mesa-8` demo | Manter; OTP desabilitável por tenant em dev |
| Estabelecimentos antigos | `whatsappOtpEnabled` default false → rollout gradual |

---

## 17. UX — fluxo cliente

```
QR → "Bem-vindo à Mesa 08" (logo restaurante)
   → "Confirme seu WhatsApp para pedir"
   → input telefone (máscara BR, 1 tela)
   → "Enviamos um código" (6 dígitos, auto-focus, auto-submit)
   → sucesso animado (< 2s)
   → "Como podemos te chamar?" (opcional, skip)
   → cardápio

Barra fixa: "Você · Mesa 08 · Participante 2"
```

**Meta:** primeira verificação < 30s; reentrada com cookie < 3s.

---

## 18. Recuperação de erros

| Situação | UX |
|----------|-----|
| OTP expirado | "Código expirado" + reenviar |
| Código errado | Tentativas restantes |
| Limite tentativas | Bloqueio 15 min + contatar garçom |
| WhatsApp não chegou | Reenviar após 60s + verificar número |
| Número errado | Voltar e corrigir |
| Sessão expirada | Recovery OTP silencioso se participação OPEN |
| Mesa fechada | "Esta mesa não está aceitando pedidos" |
| Participação CLOSED | "Conta encerrada. Chame o garçom." |

---

## 19. Rate limits (valores iniciais)

| Limite | Valor | Ajuste |
|--------|-------|--------|
| OTP / telefone / 1h | 3 | Por plano Essencial/Premium |
| OTP / IP / 1h | 10 | WAF Cloudflare |
| OTP / mesa / 1h | 20 | Alerta admin > 15 |
| Verify attempts / challenge | 5 | — |
| Resend cooldown | 60s | — |
| Pedidos / participação / 1h | 30 | Anti-spam |
| Join / IP / 10min | 5 | — |
| Participantes / mesa | 25 | Configurável |

---

## 20. DECISÕES NECESSÁRIAS (produto)

1. **Mesmo telefone em duas mesas simultâneas** — permitir vs bloquear
2. **Dois participantes com mesmo telefone na mesma mesa** — bloquear vs merge
3. **Novos pedidos durante CLOSING_REQUESTED** — opções A/B/C (§7)
4. **Reentrada após CLOSED** — nova participação automática vs exigir staff
5. **Visibilidade de pedidos alheios na mesa** — privado vs transparente
6. **REQUEST_CLOSE_SELECTED** — exige ack dos selecionados?
7. **Permanência máxima participação OPEN** — timeout? quantas horas?
8. **Provedor WhatsApp** — qual API/custo
9. **Transferência de participante** — staff pode mover consumo entre mesas?
10. **Troca de número** — fluxo de re-verificação mid-meal
11. **OTP obrigatório em demo/dev** — flag por tenant
12. **Cobrança rodízio** — por participação ao entrar vs ao fechar

---

## 21. API proposta (sem implementar)

### Entrada / identidade

| Endpoint | Auth | Descrição |
|----------|------|-----------|
| `GET /guest/table-context?slug&tableToken` | Nenhuma | Resolve mesa, status, se OTP required |
| `POST /guest/otp/request` | Nenhuma | `{ slug, tableToken, phoneE164 }` → envia OTP |
| `POST /guest/otp/verify` | Nenhuma | `{ challengeId, code }` → Set-Cookie + participação |
| `GET /guest/me` | Cookie | Participação + consumo próprio |
| `POST /guest/profile` | Cookie | `{ displayName? }` |
| `POST /guest/session/refresh` | Cookie | Renova sessão |
| `POST /guest/logout` | Cookie | Revoga sessão (**não** fecha participação) |

### Pedidos (alterados)

| Endpoint | Auth | Mudança |
|----------|------|---------|
| `POST /orders` | Cookie | Preços server-side; `guestParticipationId` derivado |
| `GET /orders/mine` | Cookie | Só pedidos próprios |
| `PATCH /orders/:id` | Cookie + staff | Cliente: cancelar próprio se NOVO |

### Fechamento

| Endpoint | Auth | Descrição |
|----------|------|-----------|
| `POST /guest/closing/request` | Cookie | `{ scope, targetIds? }` |
| `POST /guest/closing/cancel` | Cookie | Cancela própria solicitação |
| `GET /guest/closing/status` | Cookie | Estado da solicitação |
| `POST /admin/closing/:id/ack` | Bearer | Staff reconhece |
| `POST /admin/closing/:id/confirm` | Bearer | CONFIRM_CLOSING |
| `POST /admin/commands/:id/settle` | Bearer | FECHA comanda |

### Admin

| Endpoint | Descrição |
|----------|-----------|
| `GET /admin/participations?commandId` | Lista participantes |
| `POST /admin/participations/:id/block` | Bloqueia |
| `POST /admin/participations/:id/revoke-sessions` | Força re-OTP |

---

## 22. Checklist de testes (pré-produção)

- [ ] OTP happy path
- [ ] OTP expirado / errado / brute force
- [ ] Rate limits telefone/IP/mesa
- [ ] Reentrada com cookie após refresh
- [ ] Reentrada sem cookie, participação OPEN (recovery)
- [ ] Dois guests mesma mesa, pedidos isolados
- [ ] Fechamento SELF / SELECTED / TABLE
- [ ] Staff CONFIRM vs CANCEL
- [ ] Pedido durante CLOSING_REQUESTED (conforme decisão)
- [ ] Rodízio limites por pessoa
- [ ] Manipulação de preço rejeitada
- [ ] API sem cookie retorna 401
- [ ] Cross-tenant bloqueado
- [ ] Migração pedidos legados
- [ ] Concorrência: 2 pedidos simultâneos mesma participação
- [ ] QR regenerado invalida apenas entrada nova (não sessões ativas?)
- [ ] Privacidade: telefone não aparece para outros guests

---

## 23. O que ainda está sem definição

- Provedor e custo WhatsApp por OTP
- Política exata de pedidos durante fechamento
- Visibilidade social na mesa (ver pedidos dos outros)
- Mesmo número em múltiplas mesas
- Retenção LGPD de telefones
- Auth dedicado para KDS (role token de parede)
- Migração para DB relacional (escala)

---

## ARQUITETURA RECOMENDADA

```
                    ┌─────────────────────────────────────────┐
                    │           QR (slug + qrToken)          │
                    │         só inicia TABLE_ENTRY            │
                    └────────────────────┬────────────────────┘
                                         ▼
                              ┌─────────────────────┐
                              │   OtpChallenge       │
                              │   (hash, TTL, limits)│
                              └──────────┬──────────┘
                                         │ verify
                                         ▼
┌──────────┐    ┌──────────────────────────────────────────────┐
│ Command  │◀───│  GuestParticipation (OPEN → CLOSING → CLOSED) │
│ (mesa)   │    └───────────────┬──────────────────────────────┘
└────┬─────┘                    │
     │              ┌───────────▼───────────┐
     │              │   ClientSession        │
     │              │   HttpOnly cookie      │
     │              └───────────┬───────────┘
     │                          │
     ▼                          ▼
┌─────────┐              ┌───────────┐
│ Orders  │◀─────────────│  Client   │
│ Rounds  │  guestPartId  │  App      │
└────┬────┘              └───────────┘
     │
     ▼
┌──────────────┐     ┌─────────────┐     ┌──────────┐
│ ClosingRequest│────▶│ Staff CONFIRM│────▶│ CLOSED   │
└──────────────┘     └─────────────┘     └──────────┘
```

**Princípios:**

1. QR ≠ autorização
2. Telefone ≠ conta permanente
3. Participação persiste além do navegador
4. Sessão técnica é renovável
5. Fechamento efetivo = ação do restaurante
6. Backend deriva identidade da sessão, nunca do body
7. Preços sempre do catálogo
8. Auditoria em ações sensíveis

---

## PLANO DE IMPLEMENTAÇÃO

### Fase 0 — Hardening (pré-requisito, sem WhatsApp)

- [ ] Fechar APIs abertas (`GET/PATCH /orders`)
- [ ] Validação server-side de preços
- [ ] Corrigir `getOrOpenCommand` (não abrir comanda no GET menu; não duplicar após pagamento)
- [ ] Implementar `FECHADA` + fluxo staff básico
- [ ] Auth KDS (token de parede ou role)
- [ ] ETag no Blob

**Verificável:** testes de API negando acesso anônimo; comanda não duplica.

### Fase 1 — Modelo de dados + migração

- [ ] Tipos `GuestParticipation`, `ClientSession`, etc.
- [ ] Campos `guestParticipationId` em Order/Round
- [ ] Migração legado + seeds demo
- [ ] Feature flag `whatsappOtpEnabled`

### Fase 2 — Sessão de cliente (sem OTP ainda)

- [ ] Cookie HttpOnly + middleware de sessão
- [ ] Participação auto-criada em dev (`DEV_SKIP_OTP`)
- [ ] Pedidos vinculados à participação
- [ ] `GET /guest/me`, filtro de pedidos próprios

### Fase 3 — OTP (mock → produção)

- [ ] `OtpChallenge` + hash + rate limits
- [ ] Provider interface + mock dev
- [ ] Fluxo UI WhatsApp
- [ ] Recovery sem OTP quando cookie válido

### Fase 4 — Fechamento

- [ ] `ClosingRequest` + estados
- [ ] UI cliente (SELF / SELECTED / TABLE)
- [ ] Admin confirmar/cancelar/settle
- [ ] Regras de pedidos durante CLOSING

### Fase 5 — Rodízio por pessoa

- [ ] Limites por `guestParticipationId`
- [ ] Cobrança por pessoa
- [ ] KDS mostra participante

### Fase 6 — Antifraude + auditoria + privacidade

- [ ] `AuditEvent` stream
- [ ] Criptografia telefone
- [ ] Dashboard admin participantes
- [ ] Alertas abuso OTP

### Fase 7 — Produção WhatsApp

- [ ] Integrar provedor escolhido
- [ ] Monitoramento custo OTP
- [ ] Rollout gradual por tenant

---

## Próximo passo

**Aguardar decisões da §20** (especialmente política de fechamento e multi-mesa) antes de iniciar Fase 0.

Nenhum código de produto foi alterado nesta auditoria.
