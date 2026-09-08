# Roadmap de implementação — Black Box Platform

> Sequência recomendada para reduzir dependências circulares. Cada item = uma missão Cursor independente.

## Grafo de dependências

```
01 Fundação
 ↓
02 Auth + Organization
 ↓
03 RBAC + Authorization
 ↓
04 Partners
 ├───────────────┐
 ↓               ↓
05 Leads         07 Products + Offers
 ↓               │
06 CRM           │
 └───────┬───────┘
         ↓
       08 Sales + Customer
         ↓
       09 Commissions
         ↓
       10 Forms + Briefs
         ↓
       11 Projects
         ↓
       12 Dashboards
         ↓
       13 Notifications
         ↓
       14 Audit
         ↓
       15 Hardening
```

## Ondas paralelas (após Missão 04)

Depois da **Missão 04 — Partners**, duas trilhas são **independentes** e podem ser desenvolvidas simultaneamente por agentes distintos:

```
              ┌── 05 Leads → 06 CRM ──┐
04 Partners ──┤                         ├── 08 Sales + Customer
              └── 07 Products + Offers ─┘
```

| Onda | Missões | Condição |
|------|---------|----------|
| **A** (sequencial) | 01 → 02 → 03 → 04 | Fundação + auth + RBAC + parceiros |
| **B** (paralelo) | 05 → 06 **e** 07 | Trilha comercial **ou** catálogo — `Files:` disjuntos |
| **C** (convergência) | 08 | Requer 06 **e** 07 concluídas |
| **D** (sequencial) | 09 → 10 → 11 → 12 → 13 → 14 → 15 | Transação → produção → observabilidade |

**Regra vibe-coding:** só paralelizar quando não há dependência direta/transitiva **e** os conjuntos `Files:` são disjuntos. Trilhas B não tocam nos mesmos módulos (`/modules/leads` vs `/modules/products`).

## Definição de pronto (MVP)

O MVP só está funcional quando este fluxo completo funciona de ponta a ponta:

```
ADMIN cadastra parceiro
  → PARCEIRO entra, gerencia lead, CRM, registra venda
  → ADMIN confirma pagamento
  → Sistema calcula comissão + gera briefing
  → CLIENTE preenche briefing (link público)
  → EQUIPE cria projeto, produz, entrega
  → PARCEIRO acompanha venda, projeto e comissão
```

---

## Missão 01 — Fundação técnica

- Projeto, banco, migrations, ambiente, arquitetura de módulos
- **Depends-on:** none

## Missão 02 — Auth + Organization

- Login, sessão, usuários, tenant
- **Depends-on:** 01

## Missão 03 — RBAC + Authorization

- Roles, permissions, autorização server-side
- **Depends-on:** 02

## Missão 04 — Parceiros

- Cadastro, ativação, perfil, produtos autorizados
- **Depends-on:** 03

## Missão 05 — Leads

- CRUD, busca, filtros, atividades
- **Depends-on:** 04

## Missão 06 — CRM

- Pipeline comercial, estágios, follow-up, score básico (Opportunities + Activities)
- **Depends-on:** 05
- **Paralelo com:** 07 (após 04)

## Missão 07 — Products + Offers

- Catálogo, preço, comissão, materiais básicos, PartnerProduct
- **Depends-on:** 04
- **Paralelo com:** 05 → 06 (trilha comercial)

## Missão 08 — Sales + Customer

- Registrar venda, customer, confirmação manual
- **Depends-on:** 06, 07 (convergência das duas trilhas)

## Missão 09 — Commissions

- Cálculo, estados, pagamento manual
- **Depends-on:** 08

## Missão 10 — Forms + Briefs

- Formulário, campos, vínculo produto, link público, submissão
- **Depends-on:** 08

## Missão 11 — Projects

- Criação, status, responsável, prazo, histórico (ProjectEvent)
- **Depends-on:** 10

## Missão 12 — Dashboards

- Parceiro (ação-first) + admin (KPIs, funil)
- **Depends-on:** 06, 08, 09, 11

## Missão 13 — Notifications

- Eventos internos, leitura/não leitura
- **Depends-on:** 08, 10, 11

## Missão 14 — Auditoria

- Logs de ações, eventos financeiros, permissões
- **Depends-on:** 03, 08, 09

## Missão 15 — Hardening

- Segurança (IDOR, cross-tenant, privilege escalation), performance, testes E2E, backup, deploy
- **Depends-on:** 12, 13, 14

---

## Fases MVP (agrupamento)

| Fase | Missões | Escopo |
|------|---------|--------|
| MVP-1 Fundação | 01–03 | Org, User, Auth, RBAC, layout base |
| MVP-2 Aquisição | 05–06 | Lead, Opportunity, Activity, FollowUp, pipeline *(paralelo com MVP-3)* |
| MVP-3 Catálogo | 07 | Product, Offer, PartnerProduct, materiais *(paralelo com MVP-2)* |
| MVP-4 Venda | 08–09 | Sale, Payment, Customer, Commission |
| MVP-5 Briefing | 10 | Form, FormField, Brief, FormSubmission |
| MVP-6 Produção | 11 | Project, ProjectEvent |
| MVP-7 Acompanhamento | 12–13 | Dashboards, notificações |

## Pós-MVP

**Fase 1:** Form builder completo, ranking, metas, upsell, relatórios, e-mail, CSV import.

**Fase 2:** WhatsApp, e-mail automatizado, scripts, scoring avançado, automações, recorrência.

**Fase 3:** IA de vendas, agente comercial, previsão, churn, descoberta automática.
