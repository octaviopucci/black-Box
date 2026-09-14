# Contrato do motor — loja com estoque → site automático

Este documento descreve a **parte que não deve ser refeita** ao abrir uma nova loja.
Visual, categorias, nicho e textos podem mudar; o fluxo abaixo permanece igual.

## Regra de ouro

> **Produto publicado + unidade de estoque `available` = aparece no site.**

Sem estoque disponível, o produto **some da vitrine** (continua no gestor).

## Fluxo completo

```
┌─────────────┐     persist()      ┌──────────────┐     Blob / disco
│   Gestor    │ ─────────────────► │  PUT /db     │ ─────────────────► store.json
│  (Vite SPA) │                    │  (API)       │
└─────────────┘                    └──────────────┘
       ▲                                    │
       │ login + sync                       │ GET /catalog/:slug
       │                                    ▼
┌─────────────┐     poll 15s         ┌──────────────┐
│   Site      │ ◄─────────────────── │ buildPublic  │
│  (Next.js)  │                    │ Catalog()    │
└─────────────┘                    └──────────────┘
```

### 1. Cadastro no gestor

| Entidade | O que é | Onde |
|----------|---------|------|
| **Produto** | Ficha: nome, preço, fotos, `published` | `db.products` |
| **Unidade** | Item físico no estoque | `db.inventory` |
| **Categoria** | Agrupamento na vitrine | `db.categories` |

**Importante:** cadastrar só o produto **não** coloca na loja. É preciso **adicionar unidade** em Estoque com status `available`.

### 2. Persistência (`gestor/src/services/sync.ts`)

- Toda alteração chama `persist(db)` → `PUT /api/<slug>/db`
- API grava em **Vercel Blob** (`<slug>/store.json`) com fallback em `/tmp` local
- Versão otimista: conflito de versão retorna erro para o gestor re-sync

### 3. Catálogo público (`api/_*/catalog.ts`)

Função `buildPublicCatalog(db)`:

1. Filtra unidades `status === 'available'` em lojas ativas
2. Para cada produto com `published === true`:
   - `stockQuantity =` contagem de unidades disponíveis
   - Se `stockQuantity > 0` → entra na listagem
3. Retorna JSON para o site (`/catalog/<slug>`)

### 4. Site (`CatalogProvider` + `catalog-api.ts`)

- Busca `/api/<slug>/catalog/<slug>` ao carregar e a cada ~15s
- Mescla catálogo live com seed estático (`src/data/products.ts`) por slug
- Páginas de produto usam dados live quando disponíveis

### 5. Venda / baixa de estoque

- Gestor marca unidade como `sold` → deixa de contar como `available`
- Na próxima leitura do catálogo, produto pode **sumir** se não houver outras unidades

## Endpoints da API (por loja)

| Método | Rota | Uso |
|--------|------|-----|
| `GET` | `/health` | Diagnóstico Blob + contagem |
| `GET` | `/catalog/:storeSlug` | Vitrine do site |
| `GET` | `/product/:productSlug/:storeSlug` | Página de produto |
| `POST` | `/auth/login` | Login do gestor |
| `GET` | `/db` | Carregar banco (autenticado) |
| `PUT` | `/db` | Salvar banco (autenticado) |
| `POST` | `/init` | Seed inicial (`force: true` restaura seed) |

## Arquivos sagrados (não alterar sem motivo forte)

| Arquivo | Responsabilidade |
|---------|------------------|
| `api/_*/catalog.ts` | Regra estoque → vitrine |
| `api/_*/store.ts` | Persistência Blob + auth de sessão |
| `gestor/src/services/sync.ts` | Sync gestor ↔ API |
| `src/components/catalog/CatalogProvider.tsx` | Hidratação live no site |
| `src/lib/catalog-api.ts` | Cliente HTTP do catálogo |

## O que pode mudar por loja / nicho

- `src/config/store.ts` — nome, WhatsApp, URLs
- `src/data/{products,categories,images}.ts` — catálogo seed
- `src/app/globals.css` — cores e tema
- Campos extras na unidade de estoque (IMEI, tamanho, placa) — **sem mudar** a regra `available` → vitrine
- Textos institucionais, hero, logo

## O que NÃO fazer

- Re-seed em produção (`POST /init` com `force: true`) sem backup — **apaga** customizações do gestor
- `PUT /db` vazio — zera o catálogo (já aconteceu em debug)
- Duplicar `catalog.ts` com regra diferente por loja — use uma cópia só se o contrato for o mesmo

## Referência rápida — status de unidade

| Status | Aparece no site? |
|--------|------------------|
| `available` | Sim (se produto publicado) |
| `sold` | Não |
| `reserved` | Não |
| `maintenance` | Não |

## Lojas no monorepo hoje

| Loja | Path site | API | Blob |
|------|-----------|-----|------|
| iPhone Imports | `/` | `/api/iphone-imports` | `iphone-imports/store.json` |
| W-Tube | `/w-tube` | `/api/w-tube` | `w-tube/store.json` |

Novas lojas no mesmo deploy seguem o padrão W-Tube (path prefix + Blob separado). Ver `DEPLOY-CHECKLIST.md` e `npm run new:store`.
