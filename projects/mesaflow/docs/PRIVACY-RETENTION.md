# NA MESA — Retenção de dados (LGPD)

> **Versão:** 2026-09-18 · alinhado a `PRIVACY_POLICY_VERSION`

## Períodos

| Dado | Retenção | Ação |
|------|----------|------|
| OTP challenges (expirados/consumidos) | 24 h após expiração | Purge automático (`purgeStaleData`) |
| Sessões guest (`clientSessions`) revogadas/expiradas | 90 dias | Purge |
| `revokedGuestTokenHashes` | 90 dias | Purge |
| Participações guest `CLOSED` | 90 dias após `closedAt` | Anonimização + purge de telefone |
| Pedidos históricos (operacional) | Enquanto contrato lojista ativo | Anonimizados quando titular exerce exclusão |
| Contas staff / platform | Enquanto contrato ativo | Exclusão via DSR admin |

## Job / helper

`src/lib/data-retention.ts` → `purgeStaleData(store)` é invocado no hydrate do store (serverless e dev).

## Multi-instância

Purge roda por instância no hydrate (zero custo extra). Job cron com lock fica para fase futura (ADR-001) — sem vendor novo agora.

## Custo

Tudo no store JSON/Blob/Redis **já existente** no projeto bedois — nenhum serviço pago adicionado.
