# Gestor — W-Tube

Painel administrativo integrado ao mesmo deploy do site (`iphoneimports.vercel.app/gestor`).

## URLs

| Ambiente | Loja | Gestor | API |
|----------|------|--------|-----|
| Produção | `/` | `/gestor/` | `/api/w-tube` |
| Dev local | `:3000` | `:5173/gestor/` | via `vercel dev` ou proxy |

## Desenvolvimento

```bash
# Na pasta projects/w-tube
npm run dev          # loja
npm run dev:gestor   # gestor (porta 5173)
```

## Testes da API (estoque ↔ site)

```bash
npm run test:api
```
