# NA MESA — Matriz comercial de planos (fonte para Dev Head + entitlements)

> **Data:** 2026-09-20  
> **Produto:** NA MESA (código MesaFlow)  
> **Uso:** colar no Dev Head ChatGPT + base para entitlements no backend  
> **Posicionamento:** o plano de entrada já entrega o que o mercado costuma vender como “premium” (operação de mesa + kit + suporte próximo). Nunca nomear concorrentes.

---

## 1. Resumo dos planos

| Plano | Preço anual | Para quem | Promessa |
|-------|-------------|-----------|----------|
| **Essencial** | R$ 997 | 1 unidade, até ~10 mesas, começar operação digital | Operação completa na mesa sem complexidade |
| **Premium** | R$ 1.997 | Casa com mais mesas / equipe / ritmo | Escala + garçons no app + operação avançada |
| **Custom** | a partir de R$ 2.997 | Rede, operação complexa, necessidades sob medida | Tudo Premium + limites/customizações negociadas |

### Upsells (comercial — fora do core software por enquanto)
- Mesa adicional: +R$ 70/ano (Essencial) · +R$ 50/ano (Premium)
- Estabelecimento adicional (Premium+): +R$ 500/ano
- Packs de mesas (ex.: +25 mesas)
- Kit físico / artes / implantação assistida (serviço)

---

## 2. Matriz de features (o que DEVE entrar em cada plano)

Legenda: ✅ incluso · 🔢 com limite · ⚙️ sob config/override · ❌ não incluso · 🧩 só Custom (negociado)

### 2.1 Operação do cliente (guest / QR)

| Feature | Essencial | Premium | Custom | Entitlement sugerido |
|---------|-----------|---------|--------|----------------------|
| Cardápio digital + QR por mesa | ✅ | ✅ | ✅ | `feature.guest_menu` |
| Pedidos na mesa (GUEST) | ✅ | ✅ | ✅ | `feature.guest_orders` |
| Carrinho, adicionais, variantes, bumps | ✅ | ✅ | ✅ | (core) |
| Comer aqui / para viagem | ✅ | ✅ | ✅ | (core) |
| Acompanhar status do pedido | ✅ | ✅ | ✅ | (core) |
| Pedir conta (guest) | ✅ | ✅ | ✅ | `feature.guest_bill_request` |
| Fechamento por pessoa (se existir no produto) | ✅ | ✅ | ✅ | `feature.split_bill` |
| Rodízio / rodadas | ✅ | ✅ | ✅ | `feature.rodizio` |
| Sem app nativo (PWA web) | ✅ | ✅ | ✅ | (core) |

### 2.2 Operação do restaurante (admin)

| Feature | Essencial | Premium | Custom | Entitlement sugerido |
|---------|-----------|---------|--------|----------------------|
| Admin lojista (produtos, mesas, pedidos) | ✅ | ✅ | ✅ | `feature.admin` |
| Kanban de pedidos + detalhe | ✅ | ✅ | ✅ | (core) |
| Comanda térmica / impressão | ✅ | ✅ | ✅ | `feature.thermal_print` |
| Alerta sonoro + banner novo pedido | ✅ | ✅ | ✅ | `feature.order_alerts` |
| KDS por setor | ✅ | ✅ | ✅ | `feature.kds` |
| Cockpit de mesa (splits/settle) | ✅ | ✅ | ✅ | `feature.table_cockpit` |
| QR download / lote | ✅ | ✅ | ✅ | (core) |
| Import cardápio (seed/catalog) | ✅ | ✅ | ✅ | `feature.catalog_import` |
| Upload foto de produto | ✅ | ✅ | ✅ | `feature.product_media` |
| Multi-usuário staff (OWNER/MANAGER/KITCHEN/COUNTER) | 🔢 3 | 🔢 10 | 🔢 ∞ / negociado | `limit.staff_users` |
| Relatórios avançados / export | ❌ | ✅ | ✅ | `feature.advanced_reports` |
| Integrações iFood/Rappi/ERP (quando existirem) | ❌ | ⚙️ | ✅ | `feature.integrations` |

### 2.3 Garçom (acesso operacional mobile)

| Feature | Essencial | Premium | Custom | Entitlement sugerido |
|---------|-----------|---------|--------|----------------------|
| Acesso de garçom (`/waiter`) | ❌ | ✅ | ✅ | `feature.waiter_access` |
| Nº de garçons ativos | 0 | **5** | **ilimitado*** | `limit.waiters` |
| Pedidos `source=WAITER` na mesma sessão | — | ✅ | ✅ | (com waiter_access) |
| Solicitar conta pelo garçom | — | ✅ | ✅ | permissão RBAC |
| Fechar conta pelo garçom | — | ❌ default | ⚙️ | permissão RBAC |
| Atribuição de mesas | — | ✅ opcional | ✅ | (core waiter) |
| QR/código de ativação | — | ✅ | ✅ | (core waiter) |

\* Custom: default ilimitado; pode travar via override.

### 2.4 Escala / tenant

| Feature | Essencial | Premium | Custom | Entitlement sugerido |
|---------|-----------|---------|--------|----------------------|
| Nº de mesas | **10** | ilimitado | ilimitado* | `limit.tables` |
| Estabelecimentos no mesmo contrato | **1** | **1** (+upsell) | **N negociado** | `limit.establishments` |
| Multi-unidade / rede | ❌ | ❌ (upsell) | ✅ | `feature.multi_unit` |

### 2.5 Platform / governança (lado NA MESA)

| Feature | Essencial | Premium | Custom | Notas |
|---------|-----------|---------|--------|-------|
| Cadastro + aprovação platform | ✅ | ✅ | ✅ | Já existe |
| Visível no Platform Admin (plano, limites, uso) | ✅ | ✅ | ✅ | Mostrar waiters used/limit |
| Overrides manuais de entitlement | ⚙️ | ⚙️ | ⚙️ | Só platform owner |
| SLA / suporte dedicado | Self + próximo | Prioritário | Dedicado | Comercial (não código) |
| Kit físico incluso (comercial) | Kit base | Kit + implantação assistida | Sob medida | Fora do software |

### 2.6 Segurança / LGPD / infra (todos)

| Feature | Todos os planos |
|---------|-----------------|
| Auth staff + cookies HttpOnly | ✅ |
| Isolamento multi-tenant | ✅ |
| LGPD MVP (consent, DSR) | ✅ |
| Persistência compartilhada (Blob/Redis) | ✅ |
| Audit log (ações relevantes) | ✅ |

---

## 3. Defaults técnicos a implementar (`platform-entitlements`)

```ts
essencial: {
  features: {
    guest_menu: true,
    guest_orders: true,
    guest_bill_request: true,
    split_bill: true,
    rodizio: true,
    admin: true,
    thermal_print: true,
    order_alerts: true,
    kds: true,
    table_cockpit: true,
    catalog_import: true,
    product_media: true,
    waiter_access: false,
    advanced_reports: false,
    integrations: false,
    multi_unit: false,
  },
  limits: {
    tables: 10,
    waiters: 0,
    staff_users: 3,
    establishments: 1,
  },
},
premium: {
  features: {
    // tudo do essencial +
    waiter_access: true,
    advanced_reports: true,
    integrations: true, // flag on; connectors podem ser stub até existirem
    multi_unit: false,
  },
  limits: {
    tables: null,      // ilimitado
    waiters: 5,
    staff_users: 10,
    establishments: 1,
  },
},
custom: {
  features: {
    // tudo premium +
    multi_unit: true,
    integrations: true,
  },
  limits: {
    tables: null,
    waiters: null,
    staff_users: null,
    establishments: null, // negociado via override
  },
},
```

**Enforcement mínimo obrigatório (já parcialmente existe):**
1. `feature.waiter_access` + `limit.waiters` — criar/login garçom  
2. `limit.tables` — criar mesa  
3. `limit.staff_users` — criar usuário staff não-WAITER  
4. `limit.establishments` / `feature.multi_unit` — quando multi-loja existir  
5. Features “off” → API retorna 403 com mensagem de plano (não só esconder botão)

**Overrides:** `establishment.planOverrides` continua podendo ligar/desligar feature e alterar limites (Platform Admin).

---

## 4. Copy comercial (sem nomear rivais)

- **Essencial:** “Entrada completa: operação de mesa, cardápio, KDS, conta e kit — o que muitos só liberam no plano alto.”
- **Premium:** “Para casa que precisa de escala e equipe no salão: mesas sem teto prático + até 5 garçons no celular.”
- **Custom:** “Rede ou operação complexa: limites e integrações sob medida, com suporte dedicado.”

---

## 5. Prompt curto para o Dev Head

```
Você é o Dev Head do NA MESA.
Use a MATRIZ-PLANOS-NA-MESA como fonte da verdade comercial.
Não invente limites fora dela.
Priorize entitlements enforced no backend (tables, waiters, staff_users, feature flags).
Essencial deve continuar forte (operação completa); Premium diferencia por escala + garçons; Custom por negociação/overrides.
Nunca nomear concorrentes.
```

---

## 6. Critérios de aceite (entitlements)

- [ ] Essencial não cria garçom nem faz login WAITER  
- [ ] Premium cria até 5 garçons ativos; o 6º falha no backend  
- [ ] Custom sem teto de garçons (salvo override)  
- [ ] Essencial não cria a 11ª mesa  
- [ ] Premium/Custom criam mesas sem limite de plano  
- [ ] Platform Admin mostra plano, features, used/limit waiters (e tables)  
- [ ] Override platform consegue liberar waiter no Essencial para 1 cliente piloto  
- [ ] UI esconde CTAs sem permissão de plano, mas a proteção real é na API  

---

*Matriz proposta para alinhamento produto ↔ código. Ajustar números comerciais se o Octavio mudar preço/pacote; manter keys de entitlement estáveis.*
