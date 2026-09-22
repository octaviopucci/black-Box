# NA MESA — Auditoria de features de salão (read-only)

**Data:** 2026-09-22  
**Escopo:** `projects/mesaflow` — código de produto, rotas, handlers, entitlements e copy da landing.  
**Marca pública:** NA MESA (código interno: MesaFlow)

> **Nenhum código de produto foi alterado nesta auditoria.** Apenas este documento foi adicionado.

---

## 1. Resumo executivo

A base operacional **mesa → sessão guest (OTP) → pedidos → KDS por setor → comanda/conta → fechamento → pagamento → settle** está implementada e alinhada com a maior parte das afirmações do owner. Os principais gaps confirmados batem com o ground truth: **chamar garçom**, **taxa de serviço**, **transferência entre mesas**, **balcão como modo operacional**, **webhook/PDV real** e **modo comanda standalone** não existem como produto completo.

Pontos onde o **código diverge levemente** do owner ou da landing:

- Existe `operationMode: "comanda"` no admin, mas continua **amarrado a mesa/QR** — não é operação comanda-first.
- **Divisão de conta** existe em duas camadas distintas (escopo de fechamento guest vs. split por item no cockpit staff); a landing mistura as duas.
- **KDS** tem rotas/UI separadas, mas **auth compartilhada** com staff (`/admin/login`), sem login de parede dedicado.
- **Impressão** existe (58 mm via browser), mas **manual por pedido** — não roteada por setor.

---

## 2. Tabela principal — ground truth vs. código

| # | Feature | Owner claim | Code status | Evidência | Notas (como funciona) |
|---|---------|-------------|-------------|-----------|------------------------|
| 1 | **Ver conta** | YES | **CONFIRMED EXISTS** | `src/components/customer/customer-app.tsx` (tab `comanda`); `GET /api/guest/me` (`src/app/api/guest/me/route.ts`); `GET /api/guest/table-context`; `src/lib/guest-payment.ts` | Guest autenticado vê linhas de pedido, “Seu total”, total da mesa (se aplicável), status de fechamento/pagamento. Totais split-aware via `buildClosingSummary` + `OrderItemSplit`, mas UI prioriza `consumptionTotal` (soma de pedidos) no headline. |
| 2 | **Pedir conta** | YES | **CONFIRMED EXISTS** | `ClosingSheet` (`src/components/customer/closing-sheet.tsx`); `POST /api/guest/closing/request` (`src/app/api/guest/closing/request/route.ts`); `src/lib/guest-closing.ts` (`requestGuestClosing`); legacy `POST /api/bill` → scope `TABLE` | Guest escolhe escopo (`SELF` / `SELECTED` / `TABLE`), cria `ClosingRequest`, marca participação(ões) `CLOSING_REQUESTED`, notifica staff (`notifyStaff`), bloqueia novos pedidos. Cancel: `POST /api/guest/closing/cancel`. |
| 3 | **Chamar garçom** | NO | **MISSING** | Busca em `src/app/api/guest/**`, `src/components/customer/**` — sem handler, botão ou tipo de notificação | Única menção guest: copy de erro “peça ajuda ao garçom” em `customer-app.tsx`. Staff pode pedir conta via garçom (`POST /api/admin/tables/[id]/request-account`, `src/lib/waiter-store.ts`) — não é feature guest. |
| 4 | **Taxa de serviço %** | NO | **MISSING** | `src/lib/types.ts` — sem campo em `Establishment`, `Command`, `Order`, `ClosingRequest`; `src/lib/closing.ts`, `src/lib/accounting.ts` somam só itens | Owner: “later, selectable at closing; house decides”. Nada no modelo nem na UI guest/admin cockpit. |
| 5 | **Dividir conta** | PARTIAL | **PARTIAL** | **Por pessoa (fechamento):** `ClosingScope` `SELF`/`SELECTED`/`TABLE` — `src/lib/types.ts`, `closing-sheet.tsx`, `guest-closing.ts`. **Por item:** `OrderItemSplit` + `PUT /api/admin/commands/[commandId]/splits` + cockpit UI (`src/app/admin/tables/cockpit/page.tsx`) | Guest “Dividir com pessoas selecionadas” = fechar junto com subset de participantes, **não** atribuir itens. Split por item é **staff-only** no cockpit. Flag `split_bill` em `platform-entitlements.ts` não é enforced nas rotas guest. |
| 6 | **Transferir item entre mesas** | NO | **MISSING** | Sem API/handler `transfer`, `moveItem` ou mutação cross-table em `src/` | `assignTableToWaiter` (`waiter-store.ts`) move garçom↔mesa, não itens. Docs (`AUDIT-PRE-PHASE-0.md`) listam como questão aberta. |
| 7 | **Fechamento parcial (item/cliente)** | YES | **PARTIAL** | **Por cliente:** fluxo completo guest→staff — `ClosingRequest` scopes, `confirmClosingRequest` / `settleCommand` em `src/lib/store-operations.ts`, cockpit. **Por item:** `OrderItemSplit` + cockpit splits (staff) | Owner YES confere para **por participante** (`SELF`, `SELECTED`). Por **item** existe no backend/admin, sem UI guest. |
| 8 | **Modo comanda** | NO | **PARTIAL** | `operation-modes.ts` (`value: "comanda"`); admin `PATCH /api/admin/settings`; guest join exige `comandaNumber` quando mode=comanda (`src/lib/guest.ts` `requireComandaIfNeeded`, `customer-app.tsx`) | **Contradiz parcialmente** owner “NO”: há setting e campo `GuestParticipation.comandaNumber`, mas fluxo continua **mesa/QR-first** (`Command.tableId`). Não há entidade comanda independente de mesa. |
| 9 | **Mesas** | YES | **CONFIRMED EXISTS** | Admin: `/admin/tables`, `/admin/tables/cockpit`, `/admin/qrcodes`; Guest: `/m/[slug]/[table]`; API CRUD ` /api/admin/tables/*`; `src/lib/store.ts`, `store-operations.ts`; limit `tables` em `platform-entitlements.ts` | Ciclo completo: CRUD, QR, ativação staff, cockpit (pagamentos/splits/settle), guest menu por token. |
| 10 | **Balcão** | NO | **PARTIAL** | Setor KDS `kind: "BALCAO"` (`types.ts`, `seed.ts`); role `COUNTER`; rota `/kds/sec_balcao` | **Sem modo balcão operacional:** `Order.source` inclui `"BALCAO"` mas runtime só usa `"MESA"` / `"RODIZIO"`. Balcão = setor KDS + role, não POS de balcão. |
| 11 | **KDS separado** | YES | **CONFIRMED EXISTS** | Páginas `/kds/[sector]` (`src/app/kds/[sector]/page.tsx`); `KdsView` (`src/components/kds/kds-view.tsx`); `GET /api/kds/queue` + `src/lib/kds-queue.ts` (filtro por `sectorId`) | UI e fila **separadas do admin shell**. Auth: `requireKds()` reutiliza cookie staff (`credentials: "include"`) — login em `/admin/login`, não terminal KDS dedicado. |
| 12 | **Impressão de comanda** | YES (não por setor) | **CONFIRMED EXISTS** | `OrderPrintView` + `printOrderComanda()` (`src/components/admin/order-print.tsx`); botão “Imprimir” em `order-detail-panel.tsx` quando status `ACEITO` | Impressão **browser 58 mm**, manual por pedido no admin. **Não** auto-print por setor/KDS; sem ESC/POS. Flag `thermal_print` existe mas não gateia o botão. |
| 13 | **Webhook / PDV real** | NO | **PARTIAL** | UI `/admin/integrations`; `testWebhookStub()` (`store-operations.ts` ~716); providers stub (`ifood`, `rappi`, `erp`, `webhook`) | Apenas POST de teste `mesaflow.test`. iFood/Rappi/ERP = “connected” local. Sem dispatch em eventos reais (`order.created`, pagamento). `integrations` gated Premium/Custom. |
| 14 | **Tablet** | Custom, negociado | **PARTIAL** | PWA `public/manifest.webmanifest`; layout responsivo admin/KDS/guest; plano Custom em `landing-data.ts` | Funciona em tablet via web responsiva + PWA. **Sem** modo tablet/garçom dedicado, SKU ou entitlement específico — alinhado a “custom only, negotiated”. |

---

## 3. Entitlements e planos (referência)

Fonte: `src/lib/platform-entitlements.ts`, `docs/MATRIZ-PLANOS-NA-MESA.md`

| Feature key | Essencial | Premium | Custom | Enforced em runtime? |
|-------------|-----------|---------|--------|----------------------|
| `guest_bill_request` | ✓ | ✓ | ✓ | **Não** nas rotas guest |
| `split_bill` | ✓ | ✓ | ✓ | **Não** nas rotas guest/splits |
| `thermal_print` | ✓ | ✓ | ✓ | **Não** no botão imprimir |
| `kds` | ✓ | ✓ | ✓ | Sim (acesso KDS via role) |
| `waiter_access` | ✓ | ✓ | ✓ | Sim (`canCreateWaiter`, login garçom) |
| `integrations` | ✗ | ✓ | ✓ | Sim (`requireFeature` em connect) |
| `table_cockpit` | ✓ | ✓ | ✓ | Sim (nav/admin) |

Limites: mesas, garçons, staff_users, kds_sectors — enforced via `canCreateTable`, `canCreateWaiter`, etc.

---

## 4. Bonus finds — capacidades relacionadas de salão

| Capability | Status | Evidência | Notas |
|------------|--------|-----------|-------|
| **Guest QR / cardápio** | EXISTS | `/m/[slug]/[table]`, `CustomerApp`, `GET /api/menu/[slug]/[table]`, OTP ` /api/guest/otp/*` | Fluxo principal do produto. |
| **Waiter app** | EXISTS | `/waiter/login`, `/waiter/table`, `/waiter/orders`; `waiter-shell.tsx`; `POST /api/admin/orders` (origin WAITER); `waiter-store.ts` | Garçom fixo/temporário; pedidos na mesma comanda que guests; `waiter_access` entitlement. |
| **Admin operacional** | EXISTS | `/admin/dashboard`, `/admin/orders`, `/admin/tables/cockpit`, `/admin/operations` | Kanban, cockpit pagamento, kick guest, force-clear mesa. |
| **Consumo por participante** | EXISTS | `GET /api/guest/me` → `consumptionTotal`, `itemTotal`; `guest-orders-cache.ts` `consumptionTotalFor` | Identidade via OTP + `GuestParticipation`. |
| **Ajustes / correções** | PARTIAL | Cancel pedido garçom (`cancelStaffOrder`, perm `order.cancel`); void pagamento (`voidPayment`); kick guest (`POST /admin/guests/[id]/kick`); force-clear mesa | Sem desconto percentual, sem ajuste de preço por item no guest. |
| **Rodízio** | EXISTS | Tab `rodizio` em `customer-app.tsx`; feature `rodizio` nos planos | Modo operacional separado de mesa à la carte. |
| **Realtime / alertas** | EXISTS | `use-realtime.ts`, `order-alert-sound.ts`, KDS polling | Sincronização cliente/cozinha/salão. |
| **Platform SaaS** | EXISTS | `/platform/*`, merchants, plan overrides | Gestão multi-lojista NA MESA. |

---

## 5. Landing — riscos de overpromise

Copy em `src/components/landing/` vs. código:

| Copy | Arquivo | Risco | Realidade no código |
|------|---------|-------|---------------------|
| “Divisão de conta inteligente — **cada um paga o seu, seleciona itens** ou fecha a mesa” | `feature-highlights.tsx` | **Alto** | Guest seleciona **pessoas** para fechar (`SELECTED`), não itens. Split por item = staff no cockpit. |
| “Conta separada se quiser: **por pessoa ou o que sobrou**” | `landing-data.ts` (`HOW_IT_WORKS_STEPS`) | **Médio** | Por pessoa sim (`SELF`/`SELECTED`). “O que sobrou” implica split por item — só staff. |
| FAQ: “dá pra **amarrar impressão** conforme a montagem da casa” | `landing-data.ts` | **Médio** | Só `window.print()` manual no admin; sem roteamento por setor/impressora. |
| Premium: “**Relatórios e integrações**” | `landing-data.ts` | **Médio** | Integrações são **stub**; webhook só teste. Relatórios: `advanced_reports` Premium+. |
| Hero: “Pedido na mesa **sem fila no balcão**” | `hero-section.tsx` | **Baixo** | Marketing de benefício, não claim de módulo balcão — ok se entendido como copy, confunde se cliente espera modo balcão. |
| “Comanda e sessão por mesa” | `feature-highlights.tsx` | **Baixo** | Correto — comanda = `Command` ligada à mesa. |

Admin UI de integrações já mitiga: “conectores stub sem credenciais reais” (`src/app/admin/integrations/page.tsx`).

---

## 6. Ordem segura de build (recomendações — não implementado)

Prioridade sugerida com base em gaps, risco de landing e dependências:

1. **Alinhar copy da landing** com capacidades reais (divisão por item vs. por pessoa; integrações stub).
2. **Taxa de serviço %** — campo em settings + cálculo em `buildClosingSummary` + UI cockpit no settle (owner: casa decide).
3. **Enforcement de entitlements** — `guest_bill_request`, `split_bill`, `thermal_print` nas rotas correspondentes.
4. **Divisão por item (guest ou staff UX)** — fechar gap entre promise “seleciona itens” e cockpit-only.
5. **Impressão por setor** — auto-print ou fila por `sectorId` no KDS (owner: “not by sector yet”).
6. **Chamar garçom** — notificação leve guest → dashboard/waiter (owner: NO hoje; demanda comum).
7. **Webhook outbound real** — eventos idempotentes (`order.created`, `closing.confirmed`, `command.settled`) antes de PDV.
8. **Modo comanda standalone** — só se produto decidir contrariar owner “NO” atual; exigiria desacoplar `Command` de `tableId`.
9. **Balcão / transferência entre mesas** — após modelo operacional definido; hoje sem fundação.
10. **KDS auth de parede** — PIN/terminal separado (melhoria ops, não feature salão guest).
11. **Tablet garçom** — pacote Custom: layout + entitlement + possivelmente hardware — negociado.

---

## 7. Rotas rápidas (mapa de auditoria)

```
Guest:     /m/[slug]/[table]     /m/live
           GET  /api/guest/me
           POST /api/guest/closing/request|cancel
           GET  /api/menu/[slug]/[table]

Waiter:    /waiter/table         /waiter/orders
           POST /api/admin/tables/[id]/request-account

Admin:     /admin/tables         /admin/tables/cockpit
           /admin/integrations   /admin/operations

KDS:       /kds/[sector]         GET /api/kds/queue?sector=

Print:     order-detail-panel → order-print (admin, status ACEITO)
```

---

## 8. Declaração

- **Nenhum código de aplicação/produto foi modificado.**
- **Nenhum deploy foi realizado.**
- Única alteração permitida: este arquivo `docs/AUDIT-SALAO-FEATURES.md`.
