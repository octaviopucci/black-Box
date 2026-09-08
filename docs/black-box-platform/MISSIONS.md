# Roadmap de implementação — Black Box Platform

> Sequência recomendada para reduzir dependências circulares. Cada item = uma missão Cursor independente.

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

## Missão 02 — Autenticação e Organization

- Login, sessão, usuários, tenant
- **Depends-on:** 01

## Missão 03 — RBAC

- Roles, permissions, autorização server-side
- **Depends-on:** 02

## Missão 04 — Parceiros

- Cadastro, ativação, perfil, produtos autorizados
- **Depends-on:** 03

## Missão 05 — Leads

- CRUD, busca, filtros, atividades
- **Depends-on:** 04

## Missão 06 — Opportunities + CRM

- Pipeline comercial, estágios, follow-up, score básico
- **Depends-on:** 05

## Missão 07 — Produtos + Ofertas

- Catálogo, preço, comissão, materiais básicos
- **Depends-on:** 04

## Missão 08 — Sales

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
| MVP-2 Aquisição | 05–06 | Lead, Opportunity, Activity, FollowUp, pipeline |
| MVP-3 Catálogo | 07 | Product, Offer, PartnerProduct, materiais |
| MVP-4 Venda | 08–09 | Sale, Payment, Customer, Commission |
| MVP-5 Briefing | 10 | Form, FormField, Brief, FormSubmission |
| MVP-6 Produção | 11 | Project, ProjectEvent |
| MVP-7 Acompanhamento | 12–13 | Dashboards, notificações |

## Pós-MVP

**Fase 1:** Form builder completo, ranking, metas, upsell, relatórios, e-mail, CSV import.

**Fase 2:** WhatsApp, e-mail automatizado, scripts, scoring avançado, automações, recorrência.

**Fase 3:** IA de vendas, agente comercial, previsão, churn, descoberta automática.
