# MesaFlow — Auditoria: Acesso operacional individual para garçons

> **Data:** 2026-09-20  
> **Escopo:** Fases 1–9 do prompt de garçons (NA MESA)  
> **Base:** `main` + evolução incremental em `projects/mesaflow/`

---

## Sumário executivo

O MesaFlow **não possui `TABLE_SESSION` como entidade**. A sessão operacional de mesa é modelada como **`Command` (comanda) + `GuestParticipation` + `ClientSession` (guest)**. Garçons reutilizam a **mesma comanda** — pedidos WAITER e GUEST compartilham `commandId`.

**Reutilizar:** role `WAITER`, auth staff (`mf_as`), `createOrder`, KDS, fechamento, notificações, audit log, platform plans metadata.

**Adaptar/criar:** CRUD garçons, permissões granulares, `orderOrigin` (GUEST/WAITER), POST pedido staff, área `/waiter` mobile, tokens QR ativação, entitlements `feature.waiter_access` + `limit.waiters`.

---

## 1. Autenticação e identidade

| Componente | Path | Reutilizar | Adaptar |
|------------|------|------------|---------|
| Staff login | `store.ts` → `loginUser`, `/api/auth/login` | ✅ email+senha bcrypt | Bloqueio `active=false`; rate limit PIN futuro |
| Session token | `admin-session-token.ts`, cookie `mf_as` | ✅ HMAC 30d | Garçom usa mesma stack |
| Guest session | `guest.ts`, cookie `mf_cs` | ✅ separado | Não misturar com garçom |
| Platform | `platform-store.ts` | ✅ intacto | — |
| User model | `types.ts` → `User` | ✅ `role: WAITER` | + `permissions`, `assignedTableIds`, activation |
| Staff CRUD | — | ❌ | **Novo** `/admin/waiters` + API |
| QR ativação | — | ❌ | **Novo** `WaiterActivationToken` |

### Roles existentes

`OWNER | MANAGER | KITCHEN | COUNTER | WAITER` — **reutilizar WAITER**, não criar STAFF paralelo.

### RBAC atual

Inline em `api/admin/_shared.ts`: `requireAdmin`, `requireStaff`, `requireDashboard`, `requireKds`. Sem registry de permissões.

**Gap:** `GET /admin/tables` usa `requireAdmin` — WAITER recebia 401. **Corrigido** com `GET /admin/tables/operational`.

---

## 2. Mesas e sessão (Command)

| Conceito | Tipo | Store key |
|----------|------|-----------|
| Mesa física | `Table` | `tables` |
| Sessão/comanda | `Command` | `commands` |
| Participante | `GuestParticipation` | `guestParticipations` |
| Link mesa↔comanda | `Table.commandId` | — |

**Lifecycle:** `LIVRE → OCUPADA → AGUARDANDO_PAGAMENTO → LIVRE` via `getOrOpenCommand`, guest join, closing, `settleCommand`.

**Ativação staff:** `activateTable()` — WAITER+ já permitido.

**Atribuição mesa (opcional):** `User.assignedTableIds` + histórico `TableAssignment`.

---

## 3. Pedidos

### Modelo anterior

```typescript
source: "MESA" | "RODIZIO" | "BALCAO"  // canal/modalidade
guestParticipationId: string           // autoria guest
```

### Extensão (autoria)

| Campo | GUEST | WAITER |
|-------|-------|--------|
| `orderOrigin` | `"GUEST"` | `"WAITER"` |
| `createdByUserId` | — | userId autenticado (backend) |
| `createdByRole` | — | `"WAITER"` |
| `waiterId` | — | = `createdByUserId` |
| `guestParticipationId` | sessão cliente | participação ativa ou `gp_service_{commandId}` |
| `commandId` | mesma comanda | mesma comanda |

**Canal** permanece em `source` (`MESA`/`RODIZIO`/`BALCAO`).

**Pipeline KDS:** inalterado — ticket exibe `MESA X · GARÇOM Nome` quando `orderOrigin=WAITER`.

**POST guest:** `/api/orders` — seta `orderOrigin=GUEST`.  
**POST staff:** `/api/admin/orders` — `requireWaiter` + deriva `waiterId` do token.

---

## 4. Conta / fechamento

| Fluxo | Path | Garçom |
|-------|------|--------|
| Guest closing | `guest-closing.ts` | — |
| Staff request | `requestAccountByStaff()` | `account.request` (default ✅) |
| Confirm/settle | `store-operations.ts` | `account.close` default ❌ (COUNTER+) |
| Cancel order | soft `CANCELADO` + metadata | `order.cancel` |

`ClosingRequest` estendido: `requestedByStaffUserId`, `requestedByStaffRole`.

---

## 5. Notificações e auditoria

| Sistema | Reutilizar |
|---------|------------|
| In-app | `store.notifications`, `notifyStaff()` |
| Audit | `appendAuditEvent()` com sanitização PII |

**Novos eventos:** `waiter.created`, `waiter.updated`, `waiter.deactivated`, `waiter.activation_token`, `waiter.activated`, `order.created` (staff), `account.requested`, `order.cancelled`, `waiter.table_assigned`.

---

## 6. Planos / entitlements

| Antes | Depois |
|-------|--------|
| `plan` metadata only | `platform-entitlements.ts` |
| Sem limites | `feature.waiter_access`, `limit.waiters` |
| — | `Establishment.planOverrides` para override platform |

Enforcement em `createWaiter()` e login WAITER.

---

## 7. Multi-tenant

Toda API valida `auth.establishment.id === resource.establishmentId`. Garçom do tenant A não acessa B.

---

## 8. O que NÃO fazer (confirmado)

- ❌ Segunda comanda/sessão para garçom
- ❌ `WaiterOrder` paralelo
- ❌ Confiar `waiterId` do frontend
- ❌ Senha no QR
- ❌ Auth paralela desnecessária

---

## 9. Mapa de entrega por fase

| Fase | Entrega |
|------|---------|
| 1 | Este documento |
| 2 | CRUD garçons admin, permissions, status ACTIVE/INACTIVE |
| 3 | Login `/waiter`, QR ativação token |
| 4 | UI mobile `/waiter` (mesas, pedidos, conta) |
| 5 | POST staff orders, KDS badge, admin origem |
| 6 | Permissões conta, request staff |
| 7 | Audit events, desativação, atribuição mesa |
| 8 | Entitlements + platform UI |
| 9 | `test:waiter` |

---

## 10. Decisões fechadas nesta implementação

1. **`orderOrigin`** separado de `source` (canal) — evita breaking change.
2. **Participação serviço** `gp_service_{commandId}` quando garçom pede sem guest.
3. **WAITER não settle/confirma closing** — default COUNTER+ (configurável via `account.close`).
4. **Login garçom** reutiliza `/api/auth/login` — redirect para `/waiter`.
5. **PIN** — estrutura `pinHash` + lock; UI opcional (senha principal).

---

## Referências

- `docs/AUDIT-OPERACIONAL.md`
- `docs/PROMPT-MESTRE-NA-MESA.md`
- `src/lib/types.ts`, `store.ts`, `store-operations.ts`
