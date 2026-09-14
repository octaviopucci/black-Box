---
name: store-template
description: >-
  Replicar lojas e-commerce (gestor + estoque → site) sem refazer o motor.
  Use ao criar nova loja, documentar deploy Blob/Vercel, ou explicar o fluxo
  estoque→vitrine. Invocar com /store-template ou pedidos de nova loja.
---

# Store template — loja replicável

## Antes de qualquer coisa

1. Leia [docs/store-template/MOTOR-CONTRATO.md](../../../docs/store-template/MOTOR-CONTRATO.md) — **não altere** `catalog.ts`, `sync.ts` nem a regra estoque→site sem motivo forte.
2. Deploy: [docs/store-template/DEPLOY-CHECKLIST.md](../../../docs/store-template/DEPLOY-CHECKLIST.md)

## Criar nova loja irmã

```bash
npm run new:store -- --slug <slug> --name "<Nome>" --whatsapp <5511...>
```

- Template base: `projects/w-tube`
- Registro: `projects/iphone-imports/sibling-stores.json`
- Build deploy: `projects/iphone-imports/scripts/build-sibling-stores.mjs`

## O que personalizar depois

| Área | Arquivos |
|------|----------|
| Catálogo seed | `src/data/products.ts`, `categories.ts`, `images.ts` |
| Marca | `src/config/store.ts`, `globals.css`, `public/brand/` |
| Credenciais | `DEPLOY.md` gerado + Vercel env |

## Motor (intocável)

```
Gestor persist → PUT /db → Blob
Site poll → GET /catalog → published + available > 0
```

## Lojas existentes

| Slug | Path | Blob |
|------|------|------|
| iphone-imports | `/` | `iphone-imports/store.json` |
| w-tube | `/w-tube` | `w-tube/store.json` |
