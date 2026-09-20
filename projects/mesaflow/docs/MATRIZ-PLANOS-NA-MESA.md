# NA MESA — Matriz comercial de planos (fonte para Dev Head + entitlements)

> **Data:** 2026-09-20 (rev. limites Octavio)  
> **Produto:** NA MESA (código MesaFlow)  
> **Posicionamento:** entrada já entrega operação completa; Premium/Custom = escala. Nunca nomear concorrentes.

---

## 1. Planos

| Plano | Preço anual | Promessa |
|-------|-------------|----------|
| **Essencial** | R$ 997 | Operação completa na mesa, escala pequena |
| **Premium** | R$ 1.997 | Escala média + mais equipe no salão |
| **Custom** | a partir de R$ 2.997 | Ilimitado / sob medida |

---

## 2. Limites inclusos + add-ons (DECIDIDO)

### Garçons (`feature.waiter_access` + `limit.waiters` + `addons.waiters`)

| Plano | Inclusos | Add-on extra | Preço add-on |
|-------|----------|--------------|--------------|
| Essencial | **1** | sim | **R$ 50 / garçom / ano** |
| Premium | **10** | sim | **R$ 30 / garçom / ano** |
| Custom | **ilimitado** | — | — |

- `waiter_access = true` em **todos** os planos (Essencial já inclui 1).
- `limit.waiters` efetivo = inclusos + `addonWaiters` comprados/liberados na platform.
- Custom: `limit.waiters = null` (∞).

### Mesas (`limit.tables` + `addons.tables`)

| Plano | Inclusas | Add-on extra | Preço add-on |
|-------|----------|--------------|--------------|
| Essencial | **10** | sim | **R$ 70 / mesa / ano** |
| Premium | **35** | sim | **R$ 50 / mesa / ano** |
| Custom | **ilimitado** | — | — |

Efetivo: `limit.tables = inclusas + addonTables` (Custom = null).

### Platform Admin — obrigatório
Por estabelecimento, permitir:
- **Liberar +N mesas** (grava `planOverrides.addonTables`)
- **Liberar +N garçons** (grava `planOverrides.addonWaiters`)
- Mostrar: plano · inclusos · add-ons · usados · teto efetivo · preço de referência do add-on (metadata, não billing automático ainda)
- Opcional: toggle override manual de feature flags

Billing Stripe pode vir depois; por agora add-on = **liberação operacional** na platform (com preço exibido para o time comercial).

---

## 3. Outros limites recomendados entre planos

| Recurso | Essencial | Premium | Custom | Entitlement | Nota |
|---------|-----------|---------|--------|-------------|------|
| **Staff admin** (OWNER/MANAGER/KITCHEN/COUNTER, excl. WAITER) | **3** | **15** | ∞ | `limit.staff_users` | Evita Essencial com time enorme |
| **Estabelecimentos / contrato** | **1** | **1** | ∞ / negociado | `limit.establishments` | Multi-loja = Custom ou upsell |
| **Setores KDS** | **3** | **8** | ∞ | `limit.kds_sectors` | Cozinha/bar/balcão… |
| **Produtos no cardápio** | **150** | **500** | ∞ | `limit.products` | Protege store JSON |
| **Pedidos / mês (soft)** | soft 3k | soft 15k | ∞ | `limit.orders_month_soft` | Só alerta platform, não bloqueia no MVP |
| **Relatórios avançados / export** | ❌ | ✅ | ✅ | `feature.advanced_reports` | |
| **Integrações** (iFood etc. futuro) | ❌ | ✅ | ✅ | `feature.integrations` | Flag agora; connectors depois |
| **Multi-unidade** | ❌ | ❌ | ✅ | `feature.multi_unit` | |
| **Prioridade suporte** (comercial) | padrão | prioritário | dedicado | — | Fora do código |

### Core (todos os planos = true)
`guest_menu`, `guest_orders`, `guest_bill_request`, `split_bill`, `rodizio`, `admin`, `thermal_print`, `order_alerts`, `kds`, `table_cockpit`, `catalog_import`, `product_media`, `waiter_access`

---

## 4. Defaults técnicos

```ts
essencial: {
  features: { waiter_access: true, advanced_reports: false, integrations: false, multi_unit: false, /* core true */ },
  limits: { tables: 10, waiters: 1, staff_users: 3, establishments: 1, kds_sectors: 3, products: 150 },
  addonPricesAnnual: { table: 70, waiter: 50 },
},
premium: {
  features: { waiter_access: true, advanced_reports: true, integrations: true, multi_unit: false },
  limits: { tables: 35, waiters: 10, staff_users: 15, establishments: 1, kds_sectors: 8, products: 500 },
  addonPricesAnnual: { table: 50, waiter: 30 },
},
custom: {
  features: { waiter_access: true, advanced_reports: true, integrations: true, multi_unit: true },
  limits: { tables: null, waiters: null, staff_users: null, establishments: null, kds_sectors: null, products: null },
  addonPricesAnnual: { table: null, waiter: null },
},
```

Efetivo:
```
effectiveWaiters = limits.waiters == null ? null : limits.waiters + (overrides.addonWaiters ?? 0)
effectiveTables  = limits.tables  == null ? null : limits.tables  + (overrides.addonTables  ?? 0)
```

---

## 5. Aceite

- [ ] Essencial: 1º garçom OK; 2º bloqueia até +addon
- [ ] Premium: 10º OK; 11º bloqueia até +addon
- [ ] Custom: sem teto
- [ ] Mesas: 10 / 35 / ∞ idem
- [ ] Platform: campos **+ mesas** e **+ garçons** por lojista
- [ ] UI mostra usados/teto; API é a fonte da verdade
- [ ] Preços de add-on visíveis na platform (metadata)
