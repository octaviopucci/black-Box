# Especificação Técnica — Black Box Platform

**Plataforma de Vendas e Operação para Parceiros Comerciais**

- **Versão:** Arquitetura inicial
- **Status:** Especificação — NÃO IMPLEMENTAR
- **Objetivo:** Blueprint técnico para futuras missões de implementação no Cursor

---

## 1. Visão arquitetural

### 1.1 Objetivo do produto

Sistema Operacional de Vendas e Operação para Parceiros Comerciais: vendedores externos encontram oportunidades, gerenciam leads, vendem serviços digitais, acompanham comissões e execução dos projetos vendidos.

**Não é:** clone de Kiwify, checkout, afiliados tradicional, ERP, CRM genérico, contabilidade.

**Posicionamento:** Aquisição → Vendas → Transação → Onboarding → Produção → Relacionamento → Inteligência

---

## 2. Princípio arquitetural

**Modular monolith multi-tenant:**

- Uma aplicação principal
- Módulos de domínio bem separados
- Banco relacional (PostgreSQL)
- APIs internas por domínio
- Autorização centralizada
- Isolamento por organização
- Possibilidade de extração futura de serviços

### 2.1 Por que não microserviços no MVP?

Complexidade prematura: múltiplos deploys, comunicação entre serviços, observabilidade distribuída, consistência transacional difícil, auth entre serviços, custo operacional. Volume inicial não justifica.

---

## 3. Status da arquitetura

| Estado | Conteúdo |
|--------|----------|
| **EXISTE** | Visão, modelo comercial, requisitos, perfis, módulos desejados, fluxos, segurança, MVP preliminar |
| **PRECISA SER CRIADO** | Banco, backend, frontend, auth, RBAC, CRM, oportunidades, produtos, vendas, comissões, briefings, projetos, dashboards, auditoria, notificações, financeiro operacional |
| **RECOMENDADO** | Modular monolith, PostgreSQL, UUIDs, REST, RBAC, RLS/equivalente, object storage, eventos internos, testes, logs estruturados, migrations |
| **FUTURO** | IA, scraping, WhatsApp, e-mail, push, gateway, checkout, split, previsões, agente comercial |

---

## 4. Camadas de negócio

| Layer | Responsabilidade |
|-------|------------------|
| 1 — Aquisição | Lead, Opportunity, origem, scoring, prospecção, atividades |
| 2 — Vendas | CRM, pipeline, produtos, ofertas, scripts, propostas, follow-ups |
| 3 — Transação | Sale, Payment, Commission, regras, confirmação |
| 4 — Onboarding | Brief, Form, FormField, FormSubmission |
| 5 — Produção | Project, ProjectEvent, arquivos, responsáveis, status, prazo |
| 6 — Relacionamento | Customer, histórico, produtos comprados, UpsellOpportunity |
| 7 — Inteligência | Analytics, scoring, recomendações, IA (futuro) |

---

## 5. Módulos do sistema

| Módulo | Responsabilidade |
|--------|------------------|
| Identity & Access | Usuários, auth, orgs, papéis, permissões, sessões |
| Partners | Parceiros, cadastro, produtos autorizados, regras comerciais |
| Leads & Opportunities | Leads, oportunidades, origem, score, atribuição |
| CRM | Pipeline, atividades, follow-ups, interações, estágios |
| Sales Enablement | Produtos, ofertas, scripts, materiais, objeções, FAQs |
| Sales | Vendas, valores, descontos, status |
| Finance | Pagamentos, comissões, receitas, despesas, fluxo operacional |
| Briefing & Forms | Formulários, campos, versões, submissões, uploads |
| Projects | Produção, responsáveis, prazos, histórico, entrega |
| Customers | Cadastro, histórico, compras, LTV |
| Upsell | Produtos comprados/não comprados, recomendações |
| Notifications | In-app, eventos, leitura |
| Goals & Ranking | Metas, progresso, ranking, métricas |
| Reporting | KPIs, dashboards, funis, conversão |
| Audit | Histórico de ações, mudanças, contexto |

---

## 6. Modelo de entidades

```
Organization
 ├── Users
 ├── Partners
 ├── Leads
 ├── Opportunities
 ├── Customers
 ├── Products
 ├── Offers
 ├── Sales
 ├── Payments
 ├── Commissions
 ├── Projects
 ├── Forms
 ├── Materials
 └── AuditLogs
```

---

## 7–33. Entidades principais

### Organization

Tenant. Campos: `id`, `name`, `legal_name`, `document`, `status`, `settings`, timestamps. Toda entidade operacional tem `organization_id`.

### User

Tipos: admin, gestor, equipe, parceiro. Um usuário, múltiplos papéis via RBAC. `Organization 1:N User`, `User N:N Role`.

### Role / Permission

Papéis: ADMIN, GESTOR, FINANCEIRO, COMERCIAL, PRODUÇÃO, SUPORTE, PARCEIRO. Permissões atômicas: `MODULE + ACTION` (ex.: `leads.view`, `sales.approve`).

### Partner

`User 1:1 Partner`. Campos: `partner_code`, `status`, `commission_settings`, `metadata`.

### Lead

Pessoa/empresa prospectada. Campos: contato, endereço, segmento, presença digital, `source`, `owner_partner_id`, `score`, `score_explanation`, `status`, `last_interaction_at`, `next_action_at`.

### Opportunity

Possibilidade comercial concreta. `Lead 1:N Opportunity`, `Partner 1:N Opportunity`, `Product 0:N Opportunity`. Campos: `estimated_value`, `status`, `score`, `next_action_at`.

### Customer

Cliente após venda confirmada. Preserva referência ao Lead. `Customer 1:N Sale/Project/UpsellOpportunity`.

### Product

Serviço comercial. Campos: `slug`, `base_price`, `commission_default`, `commission_type`, `recurring`, `delivery_deadline`, conteúdo comercial (`benefits`, `objections`, `arguments`).

### Offer

Condição comercial temporal. `Product → Offer`. Sale registra Offer usada.

### PartnerProduct

Autorização parceiro-produto. Comissão congelada na venda — não recalcular histórico.

### Sale

Entidade central. Campos: amounts, `commission_rule_snapshot`, `status`, `payment_status`. Estados: DRAFT, PENDING_CONFIRMATION, CONFIRMED, CANCELLED, REFUNDED.

### Payment

Entidade própria mesmo manual no MVP. Futuro: gateway, webhooks.

### Commission

Estados: PENDING → APPROVED → AVAILABLE → PAID → CANCELLED. Histórico de transições.

### Brief / Form / FormField / FormSubmission

Briefing dinâmico por produto. Form versionado. Submission preserva `form_version`. Brief com token seguro para URL pública.

Tipos de campo: TEXT, TEXTAREA, PHONE, EMAIL, NUMBER, SELECT, MULTISELECT, CHECKBOX, UPLOAD, IMAGE, URL, DATE, ADDRESS.

### Project / ProjectEvent

Estados: WAITING_BRIEFING → BRIEF_RECEIVED → IN_PRODUCTION → IN_REVIEW → WAITING_CUSTOMER → APPROVED → DELIVERED → FINISHED.

### Activity / FollowUp

Interações comerciais. Canais: WHATSAPP, PHONE, EMAIL, INSTAGRAM, OTHER. FollowUp: PENDING, COMPLETED, CANCELLED, OVERDUE.

### UpsellOpportunity

Estados: SUGGESTED, CONTACTED, NEGOTIATING, SOLD, DISMISSED.

### SalesMaterial, Goal, Notification, AuditLog

Conforme campos na spec original — materiais por produto, metas por métrica, notificações in-app, auditoria com before/after.

---

## 34. Estrutura de relacionamentos

```
Organization
├── Users → Roles → Permissions
├── Partners → PartnerProducts → Products
├── Leads → Opportunities, Activities, FollowUps
├── Customers → Sales → Payments, Commissions
│              → Projects → Brief
│              → UpsellOpportunities
├── Products → Offers, Forms, SalesMaterials
├── Projects → ProjectEvents
├── Goals, Notifications, AuditLogs
```

---

## 35–36. Pipelines

**CRM comercial:** NEW → CONTACT_STARTED → CONVERSING → PROPOSAL_SENT → NEGOTIATION → WON (ou LOST)

**Operacional:** WAITING_BRIEFING → BRIEF_RECEIVED → IN_PRODUCTION → IN_REVIEW → WAITING_CUSTOMER → APPROVED → DELIVERED → FINISHED

---

## 37. Regras de transição automática

| Evento | Efeitos |
|--------|---------|
| Sale CONFIRMED | Customer criado/atualizado, Commission criada, Brief criado, Notification |
| FormSubmission | Brief SUBMITTED, Notification interna, Project pode ser criado |
| Project criado | WAITING_BRIEFING (ou BRIEF_RECEIVED se briefing completo) |

---

## 38–41. Regras críticas

1. Lead ≠ Customer
2. Product ≠ Offer
3. Sale ≠ Payment
4. Commission ≠ Sale (entidade própria)

---

## 42. Lead scoring

Score numérico + `score_explanation` estruturada. Versionável futuramente (ScoringRule, ScoringResult). MVP: lógica simples no domínio de oportunidades.

---

## 43. Script inteligente

MVP: conteúdo configurável com variáveis (`{{nome}}`, `{{empresa}}`, etc.). Futuro: IA personalizada. Não implementar IA no MVP.

---

## 44–46. Briefing dinâmico

Product → Form Template → Brief Instance → Customer Submission. Token seguro: aleatório, validade, revogável, sem IDs internos expostos.

---

## 47–48. Dashboards

**Parceiro (ação-first):** follow-ups, propostas, briefings, oportunidades → vendas, comissão → novos leads, upsells → metas, ranking.

**Admin:** KPIs (vendas, faturamento, comissão, parceiros, conversão, LTV, projetos). Funil: LEADS → OPPORTUNITIES → PROPOSALS → SALES → PROJECTS → CUSTOMERS → UPSELLS.

---

## 49–51. Permissões e multi-tenancy

RBAC: `User → Role → Permission`. Restrições de parceiro documentadas na spec original.

Contexto por requisição: `organization_id`, `user_id`, `roles`, `permissions`. Backend determina escopo — nunca confiar em `?partner_id=` do frontend.

---

## 52–54. Banco de dados

PostgreSQL, UUIDs, FKs, timestamps, índices, constraints, migrations, soft delete seletivo. Índices em: `organization_id`, `partner_id`, `status`, datas, FKs principais.

---

## 55–57. Frontend

Estrutura admin e parceiro conforme spec. Mobile-first, cards, ações rápidas, CTA evidente.

---

## 58–60. Backend e API

Organização por domínio em `/modules/*`. Cada módulo: controller, service, domain, repository, validation, authorization.

Operações não-CRUD: `POST /sales/{id}/confirm`, `/commissions/{id}/approve`, `/briefs/{id}/send`, `/projects/{id}/transition`, etc.

---

## 61–62. Transações e idempotência

Confirmação de venda = operação transacional única (Sale + Customer + Commission + Brief + Notification). Idempotência em confirmação, comissão, briefing, pagamentos futuros.

---

## 63. Arquivos

Object storage. Entidades guardam URL/chave, MIME, tamanho, metadata.

---

## 64–65. Notificações e auditoria

MVP: in-app only. Eventos: NEW_LEAD, SALE_CONFIRMED, BRIEF_SUBMITTED, COMMISSION_PAID, etc. Auditoria rigorosa em financeiro e permissões.

---

## 66. Dados sensíveis

Parceiro não vê: custo, margem, despesas, dados de outros parceiros. DTOs por papel.

---

## 67. Estados principais

Documentados por entidade: Opportunity, Sale, Commission, Brief, Project (ver seções 35–36 e entidades).

---

## 68–72. Fluxos principais

**Loop central:** Partner → Opportunity → Lead → Activity → FollowUp → CRM → Sale → Payment → Customer → Commission → Brief → Project → Delivery → Upsell → New Sale

Fluxos detalhados de venda, financeiro, briefing e upsell conforme spec original.

---

## 73. MVP realista

| Fase | Escopo |
|------|--------|
| MVP-1 | Organization, User, Partner, Role, Permission, auth, RBAC, layout |
| MVP-2 | Lead, Opportunity, Activity, FollowUp, pipeline, dashboard básico |
| MVP-3 | Product, Offer, PartnerProduct, materiais |
| MVP-4 | Sale, Payment, Customer, Commission |
| MVP-5 | Form, FormField, Brief, FormSubmission, link público |
| MVP-6 | Project, ProjectEvent |
| MVP-7 | Dashboard parceiro, notificações básicas |

---

## 74. Fora do MVP

Gateway, checkout, Pix automático, cartão, split, scraping, APIs externas, IA, agente, previsões, contabilidade, BI avançado, app nativo, microserviços.

---

## 75–77. Pós-MVP

Fase 1: form builder, ranking, metas, upsell, relatórios, e-mail, CSV.
Fase 2: WhatsApp, automações, scoring avançado, recorrência.
Fase 3: IA, agente, previsão, descoberta automática.

---

## 78–81. Financeiro, recorrência, ranking, métricas

Financeiro operacional (receitas, despesas, comissões, contas). Product com flags de recorrência sem motor de assinatura no MVP. Ranking derivado de dados transacionais. Métricas: conversão, ticket médio, comissão, LTV.

---

## 82–86. Segurança

Auth segura, hash forte, RBAC server-side, validação, cross-tenant protection, rate limiting, auditoria, uploads validados. Soft delete seletivo. Auditoria financeira com before/after.

---

## 87–95. Dependências, testes, deploy

MVP: frontend, backend, PostgreSQL, auth, object storage, migrations, deploy. Testes: unitários (regras), integração (fluxos), autorização (IDOR, cross-tenant), E2E (fluxo principal). Ambientes: dev, staging, production. Backups testados.

---

## 96–99. UX

Mobile-first para parceiro. Princípio "próxima ação". Busca global e CSV import = pós-MVP.

---

## 100. Regras de negócio (11 regras)

1. Parceiro só vende produtos autorizados
2. Venda registra produto e oferta
3. Comissão = snapshot no momento da venda
4. Pagamento manual confirma estado financeiro
5. Venda confirmada gera comissão
6. Venda confirmada gera briefing do produto
7. Briefing completo pode gerar projeto
8. Projeto pertence ao cliente, associado ao parceiro
9–11. Cliente pode ter múltiplas vendas, projetos e upsells

---

## 101–102. Riscos e decisões preservadas

9 riscos arquiteturais com mitigações. 10 decisões fundamentais (ver [DECISIONS.md](./DECISIONS.md)).

---

## 103. Ordem de implementação

15 missões — ver [MISSIONS.md](./MISSIONS.md).

---

## 104. Definição de pronto

Fluxo admin → parceiro → admin → cliente → equipe → parceiro funcional de ponta a ponta.

---

## 105. O que não fazer primeiro

Landing sofisticada, ranking, IA, scraping, automações, WhatsApp, checkout, BI, microserviços. Começar pelo motor transacional.

---

## 106–108. Arquitetura futura e conclusão

Evolução para AI Engine, Lead Discovery, Automation, Payment Gateway, WhatsApp, Analytics — núcleo permanece Organization → Partner → Lead → Opportunity → Sale → Customer → Brief → Project → Upsell.

**Princípio:** Construir pequeno na superfície, correto no núcleo. Prioridade = ciclo LEAD → VENDA → PAGAMENTO → COMISSÃO → BRIEFING → PRODUÇÃO → ENTREGA → UPSELL impecável.

---

## Classificação final

| | |
|---|---|
| **EXISTE** | Visão, modelo, requisitos, fluxos, módulos conceituais, perfis |
| **PRECISA SER CRIADO** | Aplicação completa |
| **RECOMENDADO** | Modular monolith, PostgreSQL, multi-tenancy, RBAC, snapshots, auditoria, mobile-first |
| **FUTURO** | Gateway, WhatsApp, IA, automações avançadas |

---

## Princípio de execução

Cada missão futura: um domínio, respeitar entidades, migrations, validações, testes, multi-tenancy, auditoria. **Esta missão termina na arquitetura — nenhum código de produção sem missão independente.**
