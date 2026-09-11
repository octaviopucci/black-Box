# W-Tube — path no deploy iPhone Imports

W-Tube roda **no mesmo projeto Vercel** que a iPhone Imports, sob o prefixo `/w-tube`.

| Parte | URL |
|-------|-----|
| Loja | `https://loja-iphoneimports.vercel.app/w-tube/` |
| Gestor | `https://loja-iphoneimports.vercel.app/w-tube/gestor/` |
| API | `https://loja-iphoneimports.vercel.app/api/w-tube/health` |

## Build

Incluído no `vercel-build` de `projects/iphone-imports/` via `scripts/build-w-tube.mjs`.

```bash
cd projects/iphone-imports
npm run vercel-build
```

## Login gestor

| Campo | Valor |
|-------|--------|
| Usuário | `admin` |
| Senha | `wtubeadmin123` |
| Loja | `w-tube` |

## Dev local (path /w-tube)

```bash
# Site
cd projects/w-tube
NEXT_BASE_PATH=/w-tube npm run dev

# Gestor
VITE_BASE=/w-tube/gestor/ npm run dev:gestor
```

## Blob (obrigatório para sync gestor → site)

Sem Blob, cada instância serverless da API perde os dados do gestor.

1. Vercel → projeto **loja-iphoneimports** → **Storage** → **Blob** → Create
2. Conectar ao projeto
3. Confirme `BLOB_READ_WRITE_TOKEN` em Environment Variables

Store separado: `w-tube/store.json` (iPhone Imports usa `iphone-imports/store.json`).

Validar após configurar:

```bash
curl https://loja-iphoneimports.vercel.app/api/w-tube/health
# blob: true
```
