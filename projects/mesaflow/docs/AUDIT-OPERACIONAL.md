# MesaFlow — Auditoria operacional (NA MESA)

> **Data:** 2026-09-18  
> **Base:** `main` (inclui `/platform` com merchants/detail?id=)  
> **Escopo:** mapa existente vs gaps + plano de entrega por fases deste PR

---

## Sumário executivo

O MesaFlow já possui arquitetura sólida **mesa → sessão → participantes → pedidos → comanda → pagamentos → encerrar**, com store JSON/Blob, guest OTP, cockpit staff e platform admin SaaS.

Este PR evolui incrementalmente a **operação real ponta a ponta** (QR → pedido → KDS → conta → pagamento → encerrar), sem reescrever o produto nem quebrar `/admin` ou `/platform`.

---

## 1. O que existe (reutilizar)

| Área | Status | Paths principais |
|------|--------|------------------|
| QR → mesa | ✅ | `guest.ts`, `/api/guest/*`, `/m/{slug}/{table}` |
| Guest OTP + participação | ✅ | `guest.ts`, `identity-crypto.ts` |
| Pedidos server-side pricing | ✅ | `order-resolve.ts`, `POST /orders` |
| KDS por setor | ✅ | `kds-view.tsx`, `/kds/[sector]` |
| Admin cockpit (splits, pagamentos, settle) | ✅ | `store-operations.ts`, `/admin/tables/cockpit` |
| Fechamento staff (confirm + settle) | ✅ | `confirmClosingRequest`, `settleCommand` |
| Platform admin | ✅ | `/platform`, `/platform/merchants/detail?id=` |
| Cadastro estabelecimento | ✅ | `provision.ts`, `/admin/signup` |
| Notificações in-app | ✅ | `store.notifications`, dashboard admin |
| Testes lib | ✅ | `test:admin`, `test:guest`, `test:closing`, `test:payment`, `test:platform` |

---

## 2. Gaps identificados (pré-PR)

| Gap | Risco | Prioridade |
|-----|-------|------------|
| `POST /bill` sem sessão guest | Abuso / spam conta | P0 |
| Fechamento parcial (SELF/SELECTED) só em tipos/docs | UX mesa compartilhada | P0 |
| `CLOSING_REQUESTED` nunca setado no guest | Pedidos durante fechamento | P0 |
| KDS via `/admin/dashboard` (OWNER/MANAGER only) | Cozinha quebrada | P0 |
| WAITER role inutilizável | Operação de salão | P1 |
| Integrações UI-only | Sem fundação webhook | P2 |
| Viewport/zoom mobile | Acessibilidade iOS | P1 |
| SSE não usado (polling 4s) | Latência operacional | P2 (aceito) |

---

## 3. Entregas deste PR por fase

### FASE 1 — Auditoria

- Este documento (`AUDIT-OPERACIONAL.md`).

### FASE 2 — Fundação operacional

| Item | Entrega |
|------|---------|
| Responsividade / zoom mobile | `viewport` em `layout.tsx`, `text-size-adjust`, inputs ≥16px |
| KDS autenticado | `GET /api/kds/queue` + roles KITCHEN/COUNTER/OWNER/MANAGER |
| Navegação KDS | Abas de setor no header, login prompt se 401 |
| Fechamento guest | `POST /guest/closing/request`, `/cancel`, `/status` |
| Escopos SELF / SELECTED / TABLE | `guest-closing.ts` + UI `closing-sheet.tsx` |
| Bill autenticado | `POST /bill` exige sessão guest (legado → TABLE) |
| Bloqueio pedidos em closing | Já existia em `POST /orders`; reforçado com status real |

### FASE 3 — Operação ampliada

| Item | Entrega |
|------|---------|
| Permissões backend | `requireDashboard`, WAITER em orders GET/PATCH, KDS queue |
| Nav admin por role | `admin-shell.tsx` filtra rotas por OWNER/MANAGER/WAITER/KITCHEN/COUNTER |
| Notificações acionáveis | Já existiam no dashboard; novos eventos `closing.requested` |
| Cadastro estabelecimento | Mantido (`provision.ts`) — sem regressão |
| Dashboard operacional | WAITER/KITCHEN acessam dashboard resumido via API |

### FASE 4 — Fundação integrações

| Item | Entrega |
|------|---------|
| Connect stub | `POST/DELETE /admin/integrations/{provider}/connect` |
| Webhook test | `POST /admin/integrations/webhook/test` |
| UI | `/admin/integrations` com formulário webhook + stub iFood/Rappi/ERP |

### FASE 5 — Polish

- KDS: nome participante no ticket, layout mobile
- Comanda guest: banner CLOSING_REQUESTED + cancelar
- Contagem participantes na mesa

---

## 4. Riscos remanescentes (pós-PR)

| Item | Notas |
|------|-------|
| Realtime | Polling 4s — SSE exige infra dedicada |
| SELECTED multi-mesa | Staff confirma no cockpit; guest não vota |
| Integrações reais | iFood/Rappi/ERP permanecem stub |
| Concorrência Blob LWW | Mitigação ETag parcial — ver `AUDIT-PRE-PHASE-0.md` |
| Push/som configurável | KDS beep básico; `soundNotifications` setting ainda não wired |
| Audit log UI | Eventos gravados; sem tela admin |

---

## 5. Decisões que precisam do usuário

1. **OTP obrigatório em demo** — manter skip em `ponto-do-sabor` ou forçar OTP em staging?
2. **WAITER pode registrar pagamento?** — hoje COUNTER/OWNER/MANAGER no cockpit; waiter só pedidos/KDS.
3. **Política SELECTED** — alvos são notificados in-app ou só staff vê no cockpit?
4. **Provedor WhatsApp produção** — Meta Cloud vs Z-API vs mock.
5. **Planos/limites mesa** — signup cria N mesas fixas; billing R$997+ ainda não integrado.

---

## 6. Como validar

```bash
npm --prefix projects/mesaflow ci --include=dev
npm --prefix projects/mesaflow run test:admin
npm --prefix projects/mesaflow run test:guest
npm --prefix projects/mesaflow run test:closing
npm --prefix projects/mesaflow run test:payment
npm --prefix projects/mesaflow run test:platform
npm --prefix projects/mesaflow run test:guest-closing
npm --prefix projects/mesaflow run build
node projects/iphone-imports/scripts/build-mesaflow.mjs
```

Fluxo manual sugerido:

1. `/m/ponto-do-sabor/mesa-8` → join → pedido → KDS cozinha (login `garcom@` ou `owner@`)
2. Comanda → pedir conta (SELF ou TABLE) → admin cockpit → pagamento → settle
3. `/platform` → merchants list/detail intactos

---

## 7. Referências

- Produto/decisões fechadas: `docs/AUDIT-PRE-PHASE-0.md`
- Identidade WhatsApp: `docs/AUDIT-WHATSAPP-IDENTITY.md`
- Handoff: `HANDOFF.md`
