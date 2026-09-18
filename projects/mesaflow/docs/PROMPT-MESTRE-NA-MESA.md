# PROMPT MESTRE — NA MESA / MesaFlow

> **Caminho canônico:** `projects/mesaflow/docs/PROMPT-MESTRE-NA-MESA.md`  
> **App:** `projects/mesaflow` · deploy via `projects/iphone-imports`  
> **Regra:** evoluir incrementalmente — não reescrever. Não quebrar `/admin` nem `/platform`.

---

## Objetivo de sucesso

Operação real de mesa **ponta a ponta**, mobile-first:

```text
QR → sessão guest → pedido → KDS → conta (parcial/total) → pagamento → encerrar
```

Painel operador completo (lojista + garçom/cozinha) + platform admin SaaS intacto.

---

## Restrições técnicas

| Restrição | Detalhe |
|-----------|---------|
| Static export | `output: export` em produção — **sem** rotas dinâmicas `[id]` sem `generateStaticParams` |
| Platform detail | `/platform/merchants/detail?id=` (query param) |
| Permissões | Backend autoriza — não só esconder botões |
| Modelo de dados | Estender store se fechamento individual exigir — sem gambiarra UI |
| Deploy API | Rotas espelhadas em `projects/iphone-imports/api/_mesaflow/handler.ts` |

---

## Fases de execução

### FASE 1 — Auditoria

Produzir `docs/AUDIT-OPERACIONAL.md`:

- Estrutura existente vs gaps
- Riscos e bloqueadores
- O que reutilizar (store, guest, cockpit, platform)

### FASE 2 — Fundação operacional (obrigatório neste PR)

| Requisito | Critério de pronto |
|-----------|-------------------|
| Responsividade crítica | Cliente + admin usáveis em 320–428px |
| Zoom mobile | Viewport + inputs legíveis (≥16px touch) |
| Navegação KDS | Setores, auth, voltar ao admin |
| Estados da mesa | LIVRE → OCUPADA → AGUARDANDO_PAGAMENTO → LIVRE |
| Sessão / participantes | OTP/mock join, `/guest/me`, contagem na mesa |
| Conta / fechamento | SELF, SELECTED, TABLE + `CLOSING_REQUESTED` |
| Pagamentos | Cockpit staff: splits → pagamento → confirm → settle |
| Bill seguro | Sessão guest obrigatória |

Arquitetura: **mesa → sessão → participantes → pedidos → comanda → conta → pagamentos**.

### FASE 3 — Máximo viável sem estourar qualidade

| Requisito | Critério de pronto |
|-----------|-------------------|
| Notificações acionáveis | Feed admin + `actionUrl` cockpit |
| Garçons + QR ativação | Role WAITER + `POST /admin/tables/:id/activate` |
| Permissões backend | KDS, orders, operations, dashboard por role |
| Cadastro estabelecimento | Signup + provision sem regressão |
| Dashboard operacional | Métricas + mesas ativas + alertas |

### FASE 4 — Fundação integrações

| Requisito | Critério de pronto |
|-----------|-------------------|
| UI conectores | Catálogo iFood/Rappi/WhatsApp/ERP/webhook |
| Providers stub | Connect local sem parceiro real |
| Webhook | POST de teste para URL configurada |

### FASE 5 — Polish

- KDS: participante no ticket, som se `soundNotifications`
- Comanda guest: estados de fechamento visíveis
- Platform mobile nav (bottom bar)

---

## Fluxos obrigatórios (aceite)

### Cliente

1. Escanear QR → contexto mesa
2. Join (OTP ou mock demo)
3. Cardápio → carrinho → pedido (preço server-side)
4. Acompanhar status pedidos
5. Comanda: consumo próprio + total mesa agregado
6. Pedir conta: SELF / TABLE / SELECTED
7. Cancelar fechamento enquanto staff não confirmou
8. Sair após pagamento confirmado

### Staff

1. Login `/admin` (roles: OWNER, MANAGER, WAITER, KITCHEN, COUNTER)
2. Ativar mesa antes do primeiro guest (opcional)
3. KDS: fila por setor, avançar status
4. Cockpit: divisão itens, registrar pagamento, settle
5. Controle operacional: mesas ativas, kick, force-clear

### Platform

1. Login `/platform`
2. Dashboard SaaS
3. Merchants list + detail `?id=` — suspend/activate

---

## Papéis (RBAC)

| Role | Acesso mínimo |
|------|----------------|
| OWNER / MANAGER | Tudo no tenant |
| WAITER | Pedidos, mesas, QR, operações, cockpit (leitura/pagamento conforme decisão) |
| KITCHEN / COUNTER | KDS + dashboard operacional |
| PLATFORM_OWNER | `/platform` apenas |

---

## Testes obrigatórios

```bash
npm --prefix projects/mesaflow run test:admin
npm --prefix projects/mesaflow run test:guest
npm --prefix projects/mesaflow run test:closing
npm --prefix projects/mesaflow run test:payment
npm --prefix projects/mesaflow run test:platform
npm --prefix projects/mesaflow run test:guest-closing
npm --prefix projects/mesaflow run build
node projects/iphone-imports/scripts/build-mesaflow.mjs
```

---

## Documentos relacionados

- `docs/AUDIT-OPERACIONAL.md` — gap analysis deste ciclo
- `docs/AUDIT-PRE-PHASE-0.md` — decisões identidade/fechamento
- `HANDOFF.md` — contexto produto/comercial

---

## Decisões em aberto (usuário)

1. OTP obrigatório no tenant demo?
2. WAITER registra pagamento no cockpit?
3. Notificar alvos em fechamento SELECTED?
4. Provedor WhatsApp produção?
5. Billing/limites de mesa por plano?
