# Deploy — LP Gestor (standalone)

Repositório dedicado para **lpgestor.com.br**. Não depende do monorepo black-Box.

## Vercel (recomendado)

1. Importe este repo na Vercel
2. Env: `BLOB_STORE_ID` (Vercel Blob conectado)
3. Domínio: ver [DOMAIN.md](./DOMAIN.md)

## Variáveis opcionais

| Variável | Uso |
|----------|-----|
| `LP_MOTORS_PLACAFIP_TOKEN` | Placa → FIPE automático |
| `LP_MOTORS_PLATE_API_TOKEN` | Consulta placa alternativa |

## Health

```bash
curl -s https://lpgestor.com.br/api/lp-motors/health
```
