# Diagnóstico técnico — Central de Publicações (LP Gestor)

**Escopo:** análise do código em produção (branch `lpgestor-release`, layout standalone em `src/`).  
**Data:** set/2026  
**Status:** somente diagnóstico — nenhuma implementação realizada.

---

## Sumário

1. [Arquivos relevantes](#1-arquivos-relevantes-encontrados)
2. [Modelo atual de veículo](#2-modelo-atual-de-veículo)
3. [Fluxo de alteração de status](#3-fluxo-atual-de-alteração-de-status)
4. [Fluxo de publicação no site](#4-fluxo-atual-de-publicação-no-site)
5. [Banco / Blob](#5-banco--blob--persistência)
6. [Frontend — onde adicionar](#6-onde-adicionar-no-frontend)
7. [Auditoria](#7-auditoria--reutilizar-o-existente)
8. [Arquitetura modular de publishers](#8-arquitetura-modular-de-publishers-futuro)
9. [APIs / endpoints futuros](#9-apis--endpoints-futuros-necessários)
10. [Riscos](#10-riscos-de-quebrar-produção)
11. [Plano de implementação](#11-plano-de-implementação-em-etapas-pequenas)
12. [Resumo executivo](#12-resumo-executivo)

---

## 1. Arquivos relevantes encontrados

### Modelo e domínio

| Arquivo | Papel |
|---------|--------|
| `src/types/index.ts` | `Vehicle`, `VehicleStatus`, `Database`, `AuditLog`, `Settings`, `OrgSettings`, `HistoryEvent` |
| `src/utils/constants.ts` | Labels de status, categorias |
| `src/utils/finance.ts` | `normalizeStatus()`, `isActiveStock()` |
| `src/services/database.ts` | Persistência localStorage, `DB_VERSION = 7`, `migrateVehicle()`, `normalizeDatabase()` |
| `src/data/seed.ts` | Dados demo |

### Veículos (CRUD + status)

| Arquivo | Papel |
|---------|--------|
| `src/services/vehicles.ts` | `create`, `update`, `remove`, `setStatus`, `list`, filtros |
| `src/services/auth.ts` | `persist()`, `auditService`, `historyService` |
| `src/services/sync.ts` | Push/pull Blob (`GET/PUT /api/lp-motors/db`) |
| `src/context/AppContext.tsx` | Wrappers expostos ao UI |
| `src/components/vehicles/VehicleForm.tsx` | Cadastro/edição |
| `src/components/vehicles/VehicleTable.tsx` | Listagem estoque |
| `src/components/vehicles/PhotoGallery.tsx` | Upload fotos (base64) |
| `src/utils/images.ts` | Compressão JPEG |
| `src/pages/VehicleDetailsPage.tsx` | Detalhe + abas + troca de status |
| `src/pages/StockPage.tsx` | Estoque interno |
| `src/pages/ReportsPage.tsx` | Relatórios por status |

### API e nuvem

| Arquivo | Papel |
|---------|--------|
| `api/lp-motors.ts` | Handler único (auth, FIPE, placa, `GET/PUT /db`) |
| `api/_lp-motors/store.ts` | Blob `lp-motors/store.json`, multi-tenant |
| `api/_lp-motors/tenant.ts` | `buildEmptyStoreDatabase()` |
| `api/_lp-motors/fipe.ts` | Consultas FIPE/placa |
| `vercel.json` | Rewrites SPA + API |

### UI / rotas / config

| Arquivo | Papel |
|---------|--------|
| `src/App.tsx` | Rotas protegidas |
| `src/layouts/AppLayout.tsx` | Nav lateral |
| `src/pages/SettingsPage.tsx` | Identidade + nuvem + brand |
| `src/pages/AuditPage.tsx` | Auditoria |
| `src/layouts/ProtectedRoute.tsx` | Auth guard |

> **Monorepo (`main`):** os mesmos arquivos ficam em `apps/lp-motors-gestor/src/` + `api/` na raiz.

---

## 2. Modelo atual de veículo

### Interface `Vehicle` (`src/types/index.ts`)

Campos úteis para publicação (já existem — **sem segundo cadastro**):

| Grupo | Campos |
|-------|--------|
| Identificação | `marca`, `modelo`, `versao`, `ano`, `anoModelo`, `categoria`, `cor`, `codigoInterno` |
| Mídia | `fotos: string[]` (base64 JPEG), `fotoPrincipal: number` (índice) |
| Preço | `precoAnunciado`, `precoMinimo`, `precoFipe`, `valorCompra` |
| Texto | `observacoes`, `observacoesCompra` |
| Local | `cidade`, `estado`, `quilometragem` |
| Mecânica | `combustivel`, `cambio`, `portas`, `motor` |
| Workflow | `status`, `consignado`, `archived`, `draft` |
| Meta | `id`, `organizationId`, timestamps |

**Não existe hoje:** campos de canal, URL externa, ID de post, flag `publicadoNoSite`, etc.

### Status (`VehicleStatus`)

Fluxo operacional atual (não binário DISPONÍVEL/VENDIDO):

```
negociacao → comprado → documentacao → preparacao → pronto → anunciado
                                                      ↓
                                              reservado → vendido → entregue
                                                      ↓
                                                 cancelado
```

Legados migrados em `normalizeStatus()` (`finance.ts`):

| Legado | Mapeia para |
|--------|---------------|
| `disponivel` | `pronto` |
| `oficina` | `preparacao` |
| `financiado` | `reservado` |
| `consignado` | `anunciado` |

**Mapeamento para regras futuras de automação:**

| Regra desejada | Status LP Gestor equivalente |
|----------------|------------------------------|
| “Disponível para venda / publicar” | `pronto`, `anunciado` (e legado `disponivel`) |
| “Reservado” | `reservado` |
| “Vendido / retirar” | `vendido`, `entregue`, `cancelado` |

### Fotos

- Até **15 fotos** por veículo, comprimidas (`images.ts`: max 1280px, ~450KB base64 cada).
- Armazenadas **dentro do JSON do banco** (`Database.vehicles[].fotos`), não em Blob separado.
- Implicação: payloads grandes no sync; publicadores precisam **gerar assets derivados** (URLs, captions) sem duplicar fotos inteiras no registro de publicação.

---

## 3. Fluxo atual de alteração de status

```
VehicleDetailsPage (dropdown status)
    → AppContext.updateVehicle(id, { status })
    → vehicleService.update(id, patch)
        → statusHistory.unshift({ de, para, usuario, createdAt })
        → historyService.add(type: 'status_change')
        → auditService.log('vehicle.update', ...)
        → persist(db)
            → saveDatabase(localStorage)
            → cloudSync.schedulePush(db)  [debounce 600ms]
                → PUT /api/lp-motors/db
```

**Ponto de extensão natural:** hook pós-`update` quando `patch.status !== prev.status` — hoje só grava histórico; **não dispara nenhuma publicação**.

`vehicleService.setStatus()` é wrapper de `update()`.

---

## 4. Fluxo atual de publicação no site

### Achado crítico

**Não existe site/estoque público implementado neste codebase.**

- Não há rota pública de catálogo (`/loja/{slug}`, `/estoque-publico`, etc.).
- Não há endpoint `GET /api/lp-motors/public/...`.
- `Organization.slug` é usado para **login multi-dispositivo**, não para vitrine.
- “Showroom” = tema visual do app gestor (`brand.atmosfera: 'showroom'`).
- `HistoryEventType: 'publicado'` = evento na **timeline interna** (“Anúncio publicado — Jeep…”), não integração real.

### Visibilidade “de estoque” hoje (só interno)

`isActiveStock()` em `finance.ts`:

```typescript
!archived && !draft && status ∉ { vendido, entregue, cancelado }
```

Relatório “disponíveis” filtra ainda: `pronto | anunciado | disponivel`.

**Conclusão:** a Central de Publicações precisará **criar** o canal “Site” (vitrine pública) quase do zero, reutilizando dados do veículo — não reutilizar lógica de publicação web existente (porque não há).

---

## 5. Banco / Blob — persistência

### Estrutura global (`api/_lp-motors/store.ts`)

```json
{
  "organizations": { "orgId": { "id", "name", "slug", "createdAt" } },
  "users": { ... },
  "databases": {
    "orgId": {
      "version": 7,
      "updatedAt": "...",
      "data": { /* Database */ }
    }
  },
  "tokens": { ... }
}
```

Blob: `lp-motors/store.json` (privado, overwrite).

### `Database` por loja (`DB_VERSION = 7`)

Arrays existentes: `vehicles`, `sales`, `expenses`, `settings`, `history`, `statusHistory`, `priceHistory`, `auditLogs`, etc.

**Padrão de evolução seguro:**

1. Subir `DB_VERSION` → `8`
2. Em `normalizeDatabase()` / `migrateVehicle()`, defaults para campos novos
3. Arrays novos opcionais com `[]` default — **lojas antigas continuam funcionando**

### Estrutura mínima recomendada (nova)

```typescript
// Em Database (nível org) — configuração
publicationChannels: PublicationChannelConfig[]   // canais + credenciais (refs)
publicationRules: PublicationAutomationRule[]   // when status → actions

// Em Database (nível org) — histórico global
publicationLogs: PublicationLog[]               // auditoria rica de publicações

// Por veículo (opcional, denormalizado para UI rápida)
Vehicle.publications?: Record<ChannelId, VehiclePublicationState>
```

#### `VehiclePublicationState` (por canal, por veículo)

```typescript
{
  channelId: 'site' | 'instagram' | ...
  mode: 'automatic' | 'assisted' | 'unavailable'
  status: 'draft' | 'pending' | 'published' | 'failed' | 'removed'
  externalId?: string          // ID no canal (post, listing)
  externalUrl?: string
  lastAttemptAt?: string
  lastError?: string
  preparedPayload?: PreparedPost // texto, hashtags, ordem fotos — modo assistido
}
```

#### `PublicationAutomationRule` (por loja)

```typescript
{
  id: string
  enabled: boolean
  trigger: { type: 'status'; value: VehicleStatus }  // ex.: anunciado, vendido
  actions: Array<{
    channelId: ChannelId
    action: 'publish' | 'unpublish' | 'update' | 'hide'
  }>
}
```

#### `PublicationChannelConfig` (por loja)

```typescript
{
  id: ChannelId
  enabled: boolean
  connected: boolean
  connectionMode: 'automatic' | 'assisted' | 'unavailable'
  // credenciais: preferir server-side env ou OAuth tokens no store global
}
```

**Por que separar de `Vehicle` principal:**

- Evita inflar cada veículo com histórico longo
- Permite logs e retries sem re-sync de fotos
- Compatível com sync monolítico atual

---

## 6. Onde adicionar no frontend

### Recomendação: abordagem em 3 camadas

#### A) Aba **“Publicações”** em `VehicleDetailsPage` — Prioridade 1

**Por quê:** publicação é **por veículo**; usuário já está no contexto certo.

Onde: `src/pages/VehicleDetailsPage.tsx` — hoje abas `visao | compra | custos | documentos | preparacao | historico | financeiro | venda`.

Conteúdo da aba:

- Status por canal (Site, Instagram, WhatsApp…)
- Botões: Publicar / Preparar / Remover
- Preview do conteúdo gerado (texto + fotos)
- Link externo quando publicado
- Log recente daquele veículo

#### B) Rota **`/publicacoes`** — Central geral — Prioridade 2

**Por quê:** visão operacional (“o que falta publicar”, fila, erros).

Conteúdo sugerido:

- Filtros: status veículo, canal, estado publicação
- KPIs: X prontos não publicados no site, Y falhas Instagram
- Ações em lote (futuro)

Onde registrar:

- `src/App.tsx` — nova rota protegida
- `src/layouts/AppLayout.tsx` — grupo “Operação” ou “Principal”
- Nova page: `src/pages/PublicationsPage.tsx`

#### C) **`/configuracoes`** — automações e canais — Prioridade 3

**Por quê:** regras são **por loja**, não por veículo.

Onde: `src/pages/SettingsPage.tsx` — nova seção após “Nuvem”:

- **Canais conectados** (OAuth / tokens / modo assistido)
- **Automações por status** (matriz status × canal × ação)
- Toggle master “Automação ativa”

`Settings.org` (`OrgSettings`) hoje só tem alertas/KPIs — **não misturar**; criar `Settings.publications` ou arrays no `Database` raiz.

### Arquitetura frontend recomendada

```
src/services/publications/
  index.ts              // orchestrator
  types.ts              // ChannelId, modes, states
  content-builder.ts    // monta texto/imagem a partir de Vehicle
  automation.ts         // avalia rules on status change
  publishers/
    types.ts            // interface Publisher
    site.publisher.ts
    instagram.publisher.ts
    whatsapp.publisher.ts
    stub.publisher.ts   // unavailable
```

Hook único em `vehicleService.update()` **ou** wrapper em `AppContext.updateVehicle()` para disparar automação (preferir service layer para consistência).

---

## 7. Auditoria — reutilizar o existente

### Sistema atual

- `auditService.log(db, action, entityType, entityId, detail)` em `auth.ts`
- Cap **2000** entradas (`auditLogs[]`)
- UI: `/auditoria`

Ações veículo hoje: `vehicle.create`, `vehicle.update`, `vehicle.delete`.

### Eventos sugeridos (mesmo `auditService`)

| action | entityType | Quando |
|--------|------------|--------|
| `publication.started` | `publication` | Início publish |
| `publication.completed` | `publication` | Sucesso |
| `publication.failed` | `publication` | Erro (detail = mensagem) |
| `publication.removed` | `publication` | Unpublish |
| `publication.automation.triggered` | `automation_rule` | Regra disparou |
| `publication.automation.skipped` | `automation_rule` | Canal indisponível |
| `publication.channel.connected` | `channel` | OAuth OK |
| `publication.channel.disconnected` | `channel` | Desconectou |
| `publication.rule.updated` | `automation_rule` | Config alterada |

**Complemento:** `publicationLogs[]` dedicado (detalhe técnico, payload hash, retry count) + `auditLogs` para UX humana — mesmo padrão de `history` vs `auditLogs`.

Timeline do veículo (`historyService`): tipos novos opcionais `publicacao_canal`, `remocao_canal`.

---

## 8. Arquitetura modular de publishers (futuro)

```typescript
// src/services/publications/publishers/types.ts
export type PublisherMode = 'automatic' | 'assisted' | 'unavailable'

export interface PublishContext {
  vehicle: Vehicle
  organization: Organization
  settings: Settings
  channelConfig: PublicationChannelConfig
}

export interface PublishResult {
  ok: boolean
  mode: PublisherMode
  externalId?: string
  externalUrl?: string
  preparedContent?: PreparedPost   // modo assistido: clipboard / deep link
  error?: string
}

export interface ChannelPublisher {
  id: ChannelId
  getMode(config): PublisherMode
  publish(ctx: PublishContext): Promise<PublishResult>
  unpublish(ctx: PublishContext): Promise<PublishResult>
  update?(ctx: PublishContext): Promise<PublishResult>
}
```

Registro central:

```typescript
const registry = new Map<ChannelId, ChannelPublisher>([
  ['site', sitePublisher],
  ['instagram', instagramPublisher],
  ['whatsapp', whatsAppPublisher],
  // ...
])
```

### Modos de operação

| Modo | Comportamento |
|------|---------------|
| **AUTOMÁTICO** | `publish()` chama API oficial; persiste `externalId` |
| **ASSISTIDO** | `publish()` retorna `preparedContent` + deep link; usuário conclui manualmente |
| **INDISPONÍVEL** | stub retorna `mode: 'unavailable'` |

Novos canais = **novo arquivo publisher** + registro — sem reescrever Central.

---

## 9. APIs / endpoints futuros necessários

### Hoje (existentes — reutilizar)

| Endpoint | Uso |
|----------|-----|
| `PUT /api/lp-motors/db` | Sync config + estados publicação (fase 1) |
| `GET /api/lp-motors/db` | Pull multi-dispositivo |

### Novos (recomendados por fase)

| Fase | Endpoint | Motivo |
|------|----------|--------|
| 2 | `GET /api/lp-motors/public/{slug}/vehicles` | Site público (sem auth) |
| 2 | `GET /api/lp-motors/public/{slug}/vehicles/{id}` | Detalhe público |
| 3 | `POST /api/lp-motors/publications/execute` | Jobs server-side (tokens secretos) |
| 3 | `POST /api/lp-motors/webhooks/{channel}` | Callbacks Meta, etc. |
| 4 | Cron Vercel `/api/lp-motors/cron/retry-publications` | Retry falhas |

**Fase 1 pode ser 100% client-side** (assisted + site manual) com sync Blob — menor risco.

**Fase 2+ exige server-side** para:

- Esconder tokens OAuth
- Publicação automática Instagram/Facebook
- Webhooks

---

## 10. Riscos de quebrar produção

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| `DB_VERSION` bump sem migration | **Alta** | Defaults em `normalizeDatabase()`; testar loja v7 → v8 |
| Sync monolítico (fotos + logs) | **Média** | Logs compactos; não embedar imagens em `publicationLogs` |
| Last-write-wins no `PUT /db` | **Média** | Publicação server-side futura; ou merge parcial |
| Automação no client (aba fechada) | **Alta** | Fase 1: automação só com app aberto; Fase 3: cron server |
| Credenciais OAuth no JSON sync | **Crítica** | Tokens só server-side ou Blob separado por org |
| Confundir `anunciado` com “publicado no site” | **Média** | UX clara; canal Site independente do status operacional |
| Payload Blob grande | **Média** | Monitorar; fotos já são gargalo existente |
| Duplicar cadastro veículo | **Baixa** | Central só lê `Vehicle`; proibido segundo form |
| Regressão CRUD veículo | **Alta** | Hook publicação **após** persist; try/catch isolado |
| Branch `main` vs `lpgestor-release` divergentes | **Média** | Implementar na release; sync monorepo depois |

---

## 11. Plano de implementação em etapas pequenas

### Etapa 0 — Alinhamento (zero código)

- Mapear status operacionais → gatilhos de automação com lojistas
- Confirmar que **Site público ainda não existe** — definir MVP do canal Site

### Etapa 1 — Fundação de dados (baixo risco)

- `DB_VERSION = 8`
- Tipos + migrations defaults
- Arrays vazios: `publicationChannels`, `publicationRules`, `publicationLogs`
- Campo opcional `Vehicle.publications`
- **Zero UI** — só garantir sync não quebra lojas existentes

### Etapa 2 — Content Builder + modo ASSISTIDO (valor rápido)

- `content-builder.ts`: texto + fotos a partir do `Vehicle`
- Aba “Publicações” no veículo: preview + “Copiar texto” + “Abrir WhatsApp/Instagram”
- Canais stub `unavailable` exceto **Assistido manual**
- Auditoria: `publication.started/completed`

### Etapa 3 — Central `/publicacoes`

- Lista veículos × canais × status publicação
- Filtros e indicadores “pendente / falhou”

### Etapa 4 — Canal **Site** (primeiro automático real)

- Endpoint público `GET /public/{slug}/vehicles`
- Regra: status ∈ `{ pronto, anunciado }` + não `archived/draft` → visível
- `vendido/reservado` → ocultar conforme config
- Publisher `sitePublisher` modo `automatic`

### Etapa 5 — Configurações `/configuracoes`

- UI canais + matriz automação status → ação
- `publicationRules` persistidas por loja
- Hook em `vehicleService.update` quando status muda

### Etapa 6 — Automação server-side (opcional)

- `POST /publications/execute` + cron retry
- Tokens fora do Database client

### Etapa 7 — Conectores externos

- Instagram / Facebook / Marketplace (API onde existir)
- WhatsApp Business (templates assistidos ou API)
- TikTok (provavelmente assistido inicialmente)

---

## 12. Resumo executivo

| Pergunta | Resposta |
|----------|----------|
| Dá para reutilizar cadastro existente? | **Sim** — `Vehicle` já tem fotos, preço, descrição, status |
| Existe publicação web hoje? | **Não** — só status `anunciado` e histórico interno |
| Onde encaixar a Central? | Aba no veículo + rota `/publicacoes` + config em `/configuracoes` |
| Onde persistir? | Estender `Database` v8 + opcional `Vehicle.publications` |
| API hoje para veículos? | **Nenhuma REST** — só sync `GET/PUT /db` |
| Auditoria? | **Reutilizar** `auditService` + log dedicado `publicationLogs` |
| Arquitetura publishers? | Interface `ChannelPublisher` + registry modular |
| Maior risco? | Migration Blob + automação client-side + secrets no sync |

---

## Próximo passo sugerido

Validar juntos o **MVP do canal Site** (Etapa 4) e o **mapeamento exato status → ações**, já que o LP Gestor usa fluxo granular (`pronto` / `anunciado`) em vez de um único “DISPONÍVEL”.
