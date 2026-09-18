# ADR-001 — Migrar persistência JSON para store transacional

> **Status:** Proposto (paper only) · **Data:** 2026-09-18  
> **Custo nesta rodada:** **zero** — nenhum Postgres/Neon/Redis pago provisionado. Só plano + `JsonStoreAdapter` stub.

## Contexto

O NA MESA persiste estado em documentos JSON monolíticos (Vercel Blob / Upstash Redis) com hydrate → mutate → flush por request. Sob concorrência serverless, **last-write-wins** pode perder pedidos e sessões (R01 na auditoria).

## Decisão (faseada)

1. **Agora:** manter JSON store; introduzir `MesaFlowStoreAdapter` (`src/lib/store-adapter.ts`) como seam de migração.
2. **Fase 1 (futura, opt-in):** Postgres + Drizzle — candidatos incluem free-tier (ex.: Neon) **somente se o lojista/ops optar**; desligado por default; nada provisionado agora.
3. **Fase 2:** filas webhook, analytics materializadas, read replicas.

## Stack candidata (referência — não implementada)

| Camada | Opção futura | Default hoje |
|--------|--------------|--------------|
| DB | Postgres (free-tier opt-in) | JSON Blob/Redis já no projeto |
| ORM | Drizzle | — |
| Deploy API | Mesmo handler `api/mesaflow.js` | ✅ |
| Frontend | Static export inalterado | ✅ |

## Riscos do JSON atual

- Lost updates em pico (duas instâncias flush simultâneo)
- Latência O(tamanho_total_store)
- Sem PITR/backup testado por tenant
- Purge LGPD compete com writes concorrentes

## Plano de migração (sem big-bang)

1. Dual-write shadow (JSON + Postgres) com compare job.
2. Read from Postgres, write dual.
3. Cutover por tenant flag (`establishment.storageBackend`).
4. Desligar JSON após 30d sem divergência.

## Interface

```typescript
interface MesaFlowStoreAdapter {
  hydrate(): Promise<MesaFlowStore>;
  flush(store: MesaFlowStore): Promise<void>;
  withTransaction<T>(establishmentId: string, fn: ...): Promise<T>;
}
```

Implementação atual: `JsonStoreAdapter` (delega a `store.ts`).

## Consequências

- **Positivo:** caminho claro para escala comercial; testes podem mockar adapter.
- **Negativo:** dual-write aumenta complexidade temporária; exige secrets `DATABASE_URL`.

## Fora de escopo deste ADR

- Migrar dados históricos automaticamente
- Sharding multi-região
