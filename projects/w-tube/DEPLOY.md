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

## Blob

Use o mesmo `BLOB_READ_WRITE_TOKEN` do projeto `loja-iphoneimports` (store separado: `w-tube/store.json`).
