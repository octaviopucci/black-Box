# Deploy — iPhone Imports (site + gestor + API)

Projeto unificado em `projects/iphone-imports/`:

| Parte | URL em produção |
|-------|-----------------|
| Loja | `https://loja-iphoneimports.vercel.app/` |
| Gestor | `https://loja-iphoneimports.vercel.app/gestor/` |
| API | `https://loja-iphoneimports.vercel.app/api/iphone-imports` |

## Vercel (recomendado)

1. Projeto Vercel com **Root Directory** = `projects/iphone-imports`
2. Domínio: `loja-iphoneimports.vercel.app`
3. Variáveis de ambiente (opcional):
   - `BLOB_READ_WRITE_TOKEN` — persistência na nuvem (recomendado em produção)
   - `NEXT_PUBLIC_STORE_SLUG` — slug da loja no catálogo (padrão: `iphone-imports`)

O `vercel.json` já configura build, API serverless e SPA do gestor.

## Build local

```bash
cd projects/iphone-imports
npm ci --include=dev
npm --prefix gestor ci --include=dev
npm run vercel-build
```

Saída: `out/` (loja + `out/gestor/`) + `api/dist/handler.cjs`

## Login do gestor (loja única)

| Campo | Valor |
|-------|-------|
| Usuário | `admin` |
| Senha | `adminimports123` |
| Código da loja | `iphone-imports` |

O catálogo do site é populado automaticamente com os 37 produtos do seed.
Alterações no estoque pelo gestor refletem na loja em até 15 segundos.

## Testes

```bash
npm run test:api   # 13 testes estoque ↔ catálogo
```
