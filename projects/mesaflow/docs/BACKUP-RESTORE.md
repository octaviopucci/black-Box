# MesaFlow — Backup e restore

> Zero custo: scripts locais + Vercel Blob existente. Teste trimestral recomendado.

## Backup

```bash
cd projects/mesaflow
export BLOB_READ_WRITE_TOKEN=...   # ou MESAFLOW_BLOB_READ_WRITE_TOKEN
export BLOB_STORE_ID=...           # se usar OIDC
node scripts/backup-store.mjs --out backups/mesaflow-$(date +%F).json
```

Sem Blob configurado, o script usa `data/store.json` ou `MESAFLOW_DATA`.

## Restore (staging / dev)

```bash
node scripts/restore-store.mjs --file backups/mesaflow-YYYY-MM-DD.json --dry-run
node scripts/restore-store.mjs --file backups/mesaflow-YYYY-MM-DD.json
```

Em **produção**, restore exige `MESAFLOW_RESTORE_CONFIRM=1` após validar o JSON em ambiente de teste.

## Teste trimestral (checklist)

1. Rodar backup e verificar tamanho > 0 e JSON válido.
2. Restaurar em instância de preview / `MESAFLOW_DATA` temporário.
3. Validar login admin, guest OTP (mock), um pedido de teste.
4. Apagar instância de teste; registrar data no runbook.

## Retenção sugerida

- Manter últimos 4 backups trimestrais off-repo (Drive criptografado ou bucket dedicado).
- Nunca commitar backups com PII no git.
