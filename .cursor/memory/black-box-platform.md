---
type: architecture
title: Black Box Platform — Revenue Operating System
---

# Black Box Platform

Produto futuro: Sistema Operacional de Vendas e Operação para Parceiros Comerciais.

## Status

**Especificação apenas — NÃO IMPLEMENTAR** sem missão dedicada.

Blueprint em `docs/black-box-platform/`:
- `README.md` — índice e regras críticas
- `SPECIFICATION.md` — spec completa (108 seções)
- `MISSIONS.md` — grafo, ondas paralelas, fluxo E2E, 15 missões
- `MISSION-TEMPLATE.md` — template obrigatório (CONTEXT → FINAL VERIFICATION)
- `missions/` — briefs preenchidos por missão
- `DECISIONS.md` — decisões que não podem ser violadas

## Arquitetura

Modular monolith multi-tenant. PostgreSQL, UUIDs, RBAC centralizado, object storage.

## Núcleo MVP

```
LEAD → VENDA → PAGAMENTO → COMISSÃO → BRIEFING → PRODUÇÃO → ENTREGA → UPSELL
```

## Regras críticas

Lead≠Customer, Product≠Offer, Sale≠Payment, Sale≠Commission, CRM≠Produção, multi-tenancy no backend, commission snapshot na venda.

## Relação com monorepo atual

Este repo (`black-box`) hoje = portal + demos clientes + **`platform/`** (Mission 01 foundation). Business modules come in missions 02+.

## Grafo de missões

01→02→03→04 sequencial. Após 04: trilhas **05→06** (comercial) e **07** (catálogo) em paralelo → convergem em **08 Sales**.

## Primeira missão recomendada

Missão 01 — Fundação técnica (projeto, banco, migrations, módulos).
