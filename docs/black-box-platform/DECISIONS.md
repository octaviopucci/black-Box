# Decisões arquiteturais — Black Box Platform

> Decisões que **devem ser preservadas** em toda implementação futura.

## Entidades distintas

| Par incorreto | Regra |
|---------------|-------|
| Lead = Customer | Lead preserva origem, interações, score. Customer nasce após venda confirmada. |
| Product = Offer | Product é catálogo; Offer é condição comercial temporal. Sale registra Offer. |
| Sale = Payment | Venda pode existir em DRAFT/PENDING antes do pagamento. |
| Sale = Commission | Commission tem ciclo próprio: PENDING → APPROVED → AVAILABLE → PAID. |
| CRM = Produção | Pipelines separados (comercial vs operacional). |

## Autorização

- Authentication ≠ Authorization.
- RBAC centralizado: `User → Role → Permission` (formato `module.action`).
- Toda requisição autenticada carrega: `organization_id`, `user_id`, `roles`, `permissions`.
- Parceiro: escopo = `organization_id` + `partner_id` (determinado pelo backend, nunca pelo query param).
- DTOs diferentes por papel quando necessário — não esconder dados sensíveis via CSS.

## Multi-tenancy

```
Usuário pertence à organização?
  → Possui permissão?
  → Pode acessar este recurso?
  → Recurso pertence à organização?
  → Recurso está no escopo do usuário?
```

## Financeiro

- Comissão aplicada à venda = **snapshot** no momento da transação (`commission_rule_snapshot`).
- Não recalcular vendas antigas quando regra comercial mudar.
- Entidades financeiras não usam soft delete — usam estados (CANCELLED, REFUNDED).
- Mudanças de valor exigem auditoria com before/after.

## Formulários

- Form + FormField + versionamento.
- FormSubmission preserva `form_version`.
- Brief usa token seguro para URL pública (sem expor IDs internos).

## Stack recomendada

| Camada | Tecnologia |
|--------|------------|
| Banco | PostgreSQL, UUIDs, migrations versionadas |
| Backend | Modular monolith por domínio (`/modules/*`) |
| Frontend | Mobile-first, orientado por próxima ação |
| Arquivos | Object storage (não no PostgreSQL) |
| Auth | Sessão/token seguro, hash forte de senha |

## Fora do MVP

Gateway, checkout, Pix automático, WhatsApp API, IA, scraping, microserviços, BI avançado, contabilidade, app nativo.

## Riscos mitigados

| Risco | Mitigação |
|-------|-----------|
| CRM genérico demais | Só fluxos comerciais necessários |
| Comissão dependente do produto atual | Snapshot na Sale |
| Isolamento entre parceiros | Autorização server-side + testes IDOR |
| Formulários rígidos | Form builder com versionamento |
| MVP grande demais | Excluir integrações não essenciais |
| Financeiro virando ERP | Financeiro operacional apenas |
