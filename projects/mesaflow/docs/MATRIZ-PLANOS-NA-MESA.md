# NA MESA — Matriz de planos (rev. Octavio 2026-09-20 b)

> **Produto:** NA MESA (código MesaFlow)  
> **Posicionamento:** entrada já entrega operação completa; Premium/Custom = escala. Nunca nomear concorrentes.

---

## Staff (o que é)

Usuários do **painel/KDS** com login próprio, **exceto garçom**:
OWNER, MANAGER, KITCHEN, COUNTER (e afins).
Garçom conta em `limit.waiters`, **não** em `limit.staff_users`.

---

## Limites

| Recurso | Essencial | Premium | Custom |
|---------|-----------|---------|--------|
| Garçons | 1 · +R$50/ano | 10 · +R$30/ano | ∞ |
| Mesas | 10 · +R$70/ano | 35 · +R$50/ano | ∞ |
| Staff (sem garçom) | 3 | 15 | ∞ |
| Estabelecimentos | 1 | até **3** · +R$397/ano cada extra | ∞ |
| Setores KDS | 3 | 8 | ∞ |
| Produtos cardápio | **sem limite** | **sem limite** | **sem limite** |
| Relatórios avançados | não | sim | sim |
| Integrações | não | sim | sim |
| Multi-unidade | não | **sim** | sim |
| waiter_access | sim | sim | sim |

### Estabelecimentos Premium
- Incluso: 1
- Máximo: 3
- Add-on: R$397/estabelecimento/ano (2º e 3º)
- Platform Admin libera `addonEstablishments` (teto efetivo ≤ 3 no Premium)

### Produtos
`limit.products = null` em todos — **sem enforcement**.

---

## Defaults técnicos

```ts
essencial: {
  features: { waiter_access: true, advanced_reports: false, integrations: false, multi_unit: false },
  limits: { tables: 10, waiters: 1, staff_users: 3, establishments: 1, kds_sectors: 3 },
  addonPricesAnnual: { table: 70, waiter: 50, establishment: null },
},
premium: {
  features: { waiter_access: true, advanced_reports: true, integrations: true, multi_unit: true },
  limits: { tables: 35, waiters: 10, staff_users: 15, establishments: 1, kds_sectors: 8 },
  addonPricesAnnual: { table: 50, waiter: 30, establishment: 397 },
},
custom: {
  features: { waiter_access: true, advanced_reports: true, integrations: true, multi_unit: true },
  limits: { all null },
  addonPricesAnnual: { all null },
},
```

Efetivo:
```
effectiveWaiters = included.waiters + addonWaiters
effectiveTables  = included.tables  + addonTables
effectiveEstablishments = min(included.establishments + addonEstablishments, planMax)  // Premium max 3
```

---

## Aceite

- [ ] Essencial: 1º garçom OK; 2º bloqueia até +addon
- [ ] Premium: 10º garçom OK; 11º bloqueia até +addon
- [ ] Custom: sem teto
- [ ] Mesas: 10 / 35 / ∞ idem
- [ ] Premium: até 3 estabelecimentos com add-on R$397
- [ ] Staff exclui WAITER
- [ ] Produtos sem limite em todos os planos
- [ ] Platform: campos + mesas, + garçons, + estabelecimentos (Premium)
- [ ] multi_unit: false / true / true
