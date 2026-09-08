# Black Box — Revenue Operating System

> **Status:** Especificação arquitetural — **NÃO IMPLEMENTAR** a partir deste documento sem missão de execução dedicada.

![Black Box logo](./assets/logo.jpg)

## O que é

Sistema Operacional de Vendas e Operação para Parceiros Comerciais. Permite que vendedores externos encontrem oportunidades, gerenciem leads, vendam serviços digitais, acompanhem comissões e monitorem a execução dos projetos vendidos.

**Não é:** clone de Kiwify, checkout, afiliados tradicional, ERP, CRM genérico ou contabilidade.

**Posicionamento:**

```
Aquisição → Vendas → Transação → Onboarding → Produção → Relacionamento → Inteligência
```

## Documentos

| Arquivo | Conteúdo |
|---------|----------|
| [SPECIFICATION.md](./SPECIFICATION.md) | Blueprint técnico completo (108 seções) |
| [MISSIONS.md](./MISSIONS.md) | Grafo de dependências, ondas paralelas, 15 missões |
| [MISSION-TEMPLATE.md](./MISSION-TEMPLATE.md) | Template obrigatório antes de executar cada missão |
| [missions/](./missions/) | Briefs preenchidos por missão (`NN-slug.md`) |
| [DECISIONS.md](./DECISIONS.md) | Decisões arquiteturais que não podem ser violadas |

## Princípio arquitetural

**Modular monolith multi-tenant** — uma aplicação principal, módulos de domínio separados, PostgreSQL, RBAC centralizado, isolamento por organização.

## Núcleo do produto (MVP)

O ciclo que define o MVP funcional:

```
LEAD → VENDA → PAGAMENTO → COMISSÃO → BRIEFING → PRODUÇÃO → ENTREGA → UPSELL
```

## Regras críticas (resumo)

1. **Lead ≠ Customer** — preservar histórico; Customer é nova etapa do relacionamento.
2. **Product ≠ Offer** — catálogo vs condição comercial; Sale registra a Offer usada.
3. **Sale ≠ Payment** — venda pode existir antes da confirmação de pagamento.
4. **Sale ≠ Commission** — comissão com entidade própria, estados e auditoria.
5. **CRM comercial ≠ pipeline de produção** — dois domínios distintos.
6. **Multi-tenancy no backend** — nunca confiar em IDs enviados pelo frontend para escopo.
7. **Snapshots financeiros** — comissão congelada no momento da venda.
8. **Form versioning** — submissões preservam versão do formulário.

## Como usar nas próximas missões

Cada missão no Cursor deve:

1. Copiar [MISSION-TEMPLATE.md](./MISSION-TEMPLATE.md) → `missions/NN-slug.md` e **preencher todas as seções**.
2. Implementar **um domínio específico** (ver [MISSIONS.md](./MISSIONS.md)).
3. Respeitar entidades e relacionamentos desta arquitetura.
4. Incluir migrations, validações, testes e autorização server-side.
5. **Não** duplicar regras de negócio nem mover autorização para o frontend.
6. Preservar auditoria em operações financeiras e de permissão.
7. Validar contra o [fluxo end-to-end](./MISSIONS.md#definição-de-pronto-mvp) quando a missão fizer parte do caminho crítico.

## Relação com este monorepo

Hoje este repositório (`black-box`) hospeda portal institucional, demos de clientes e APIs auxiliares. A plataforma descrita aqui é um **produto futuro** — blueprint para implementação em missões separadas, possivelmente em diretório dedicado (ex.: `platform/` ou repositório próprio).
