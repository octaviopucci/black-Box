# Deploy — iPhone Imports (site + gestor + API)

Projeto unificado em `projects/iphone-imports/`:

| Parte | URL em produção |
|-------|-----------------|
| Loja | `https://iphoneimports.vercel.app/` |
| Gestor | `https://iphoneimports.vercel.app/gestor/` |
| API | `https://iphoneimports.vercel.app/api/iphone-imports` |

## Vercel (recomendado)

1. Projeto Vercel com **Root Directory** = `projects/iphone-imports`
2. Domínio: `iphoneimports.vercel.app`
3. Variáveis de ambiente (opcional):
   - `BLOB_READ_WRITE_TOKEN` — persistência na nuvem (multi-dispositivo)
   - `NEXT_PUBLIC_STORE_SLUG` — slug da loja no catálogo (padrão: `iphone-imports`)

O `vercel.json` já configura build, API serverless e SPA do gestor.

## Build local

```bash
cd projects/iphone-imports
npm ci --include=dev
npm --prefix gestor ci --include=dev
npm run build:deploy
```

Saída: `out/` (loja + `out/gestor/`)

## Primeiro uso do gestor

1. Acesse `/gestor/cadastro`
2. Crie a loja (anote o **código/slug**)
3. Configure `NEXT_PUBLIC_STORE_SLUG` no Vercel com esse slug (se diferente de `iphone-imports`)
4. Cadastre produtos → adicione unidades no estoque → aparecem na loja automaticamente

## Testes

```bash
npm run test:api   # 13 testes estoque ↔ catálogo
```
