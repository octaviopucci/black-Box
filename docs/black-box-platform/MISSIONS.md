# Roadmap de implementação — Black Box Platform

> Sequência recomendada para reduzir dependências circulares. Cada item = uma missão Cursor independente.
>
> **Template de missão:** [MISSION-TEMPLATE.md](./MISSION-TEMPLATE.md) — preencher antes de implementar.

## Grafo de dependências

```
                         ┌── 05 Leads ──→ 06 CRM ──┐
01 Fundação              │                         │
      ↓                  │                         │
02 Auth + Organization   │                         │
      ↓                  │                         │
03 RBAC + Authorization  │                         │
      ↓                  │                         │
04 Partners ─────────────┤                         ├──→ 08 Sales + Customer
                         │                         │
                         └── 07 Products + Offers ─┘
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

Depois da **Missão 04 — Partners**, duas trilhas são **independentes**:

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

**Regra vibe-coding:** só paralelizar quando não há dependência direta/transitiva **e** os conjuntos `Files:` são disjuntos.

---

## Definição de pronto (MVP)

Fluxo end-to-end que define o MVP funcional:

```
ADMIN
  ↓
cadastra/ativa PARCEIRO
  ↓
PARCEIRO
  ↓
cria LEAD
  ↓
cria OPPORTUNITY
  ↓
move no PIPELINE
  ↓
registra VENDA
  ↓
ADMIN confirma PAGAMENTO
  ↓
COMMISSION calculada
  ↓
BRIEF gerado
  ↓
CLIENTE acessa LINK PÚBLICO
  ↓
envia BRIEFING
  ↓
EQUIPE cria PROJECT
  ↓
produção
  ↓
entrega
  ↓
PARCEIRO acompanha
  ├── venda
  ├── comissão
  └── projeto
```

---

## Índice de missões

| # | Missão | Depends-on | Paralelo |
|---|--------|------------|----------|
| 01 | [Fundação técnica](#missão-01--fundação-técnica) | — | — |
| 02 | [Auth + Organization](#missão-02--auth--organization) | 01 | — |
| 03 | [RBAC + Authorization](#missão-03--rbac--authorization) | 02 | — |
| 04 | [Partners](#missão-04--partners) | 03 | — |
| 05 | [Leads](#missão-05--leads) | 04 | 07 |
| 06 | [CRM](#missão-06--crm) | 05 | 07 |
| 07 | [Products + Offers](#missão-07--products--offers) | 04 | 05→06 |
| 08 | [Sales + Customer](#missão-08--sales--customer) | 06, 07 | — |
| 09 | [Commissions](#missão-09--commissions) | 08 | — |
| 10 | [Forms + Briefs](#missão-10--forms--briefs) | 08 | — |
| 11 | [Projects](#missão-11--projects) | 10 | — |
| 12 | [Dashboards](#missão-12--dashboards) | 06, 08, 09, 11 | — |
| 13 | [Notifications](#missão-13--notifications) | 08, 10, 11 | — |
| 14 | [Audit](#missão-14--audit) | 03, 08, 09 | — |
| 15 | [Hardening](#missão-15--hardening) | 12, 13, 14 | — |

Briefs individuais: `missions/NN-slug.md` *(criar a partir do template antes de executar)*.

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

## Missão 04 — Partners

- Cadastro, ativação, perfil, produtos autorizados
- **Depends-on:** 03

## Missão 05 — Leads

- CRUD, busca, filtros, atividades
- **Depends-on:** 04
- **Paralelo com:** 07

## Missão 06 — CRM

- Pipeline comercial, estágios, follow-up, score básico (Opportunities + Activities)
- **Depends-on:** 05
- **Paralelo com:** 07

## Missão 07 — Products + Offers

- Catálogo, preço, comissão, materiais básicos, PartnerProduct
- **Depends-on:** 04
- **Paralelo com:** 05 → 06

## Missão 08 — Sales + Customer

- Registrar venda, customer, confirmação manual
- **Depends-on:** 06, 07

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

## Missão 14 — Audit

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
