# LP Gestor

Sistema de gestão de estoque e operação para lojas de veículos.

**Produção:** [lpgestor.com.br](https://lpgestor.com.br)

## URLs

| Página | Caminho |
|--------|---------|
| App | `/` |
| Login | `/login` |
| Cadastro de loja | `/cadastro` |
| API | `/api/lp-motors/*` |

## Desenvolvimento

```bash
npm install
npm run dev
```

Para API local com Blob/sync, use [Vercel CLI](https://vercel.com/docs/cli):

```bash
npx vercel dev
```

## Deploy (Vercel)

1. Importe este repositório na [Vercel](https://vercel.com/new)
2. Framework: **Other** (build `npm run vercel-build`, output `dist`)
3. Variáveis de ambiente:
   - `BLOB_STORE_ID` — Vercel Blob (Storage → Create → connect)
   - Opcional: `LP_MOTORS_PLACAFIP_TOKEN` — consulta placa→FIPE
4. Domínio: **lpgestor.com.br** (ver [DOMAIN.md](./DOMAIN.md))

## Credenciais demo (seed local)

- `admin` / `LPMotors123`

Em produção, cada loja se cadastra em `/cadastro`.

## Origem

Extraído do monorepo [black-Box](https://github.com/octaviopucci/black-Box) (`apps/lp-motors-gestor` + `api/lp-motors`).
