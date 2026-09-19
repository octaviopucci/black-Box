# MesaFlow

SaaS multi-tenant de **garçom digital + pedidos em tempo real** via QR Code na mesa.

## Demo — Ponto do Sabor

| Experiência | URL |
|-------------|-----|
| Landing | `/` |
| Cliente (Mesa 08) | `/m/ponto-do-sabor/mesa-8` |
| Admin (lojista) | `/admin` |
| **Platform admin (SaaS)** | `/platform` |
| KDS Cozinha | `/kds/sec_cozinha` |
| KDS Balcão | `/kds/sec_balcao` |

**Login lojista (restaurante demo):** `owner@pontodosabor.com` / `demo123`

**Login platform owner (Octavio — operação NA MESA):** `octavio@namesa.io` / `namesa-platform-dev`  
Em produção, defina `MESAFLOW_PLATFORM_OWNER_EMAIL` e `MESAFLOW_PLATFORM_OWNER_PASSWORD`.

> `/admin` = painel do **restaurante** (mesas, pedidos, cardápio).  
> `/platform` = painel do **dono da plataforma** (lojistas clientes, métricas SaaS).

## Dev

```bash
npm --prefix projects/mesaflow ci --include=dev
npm run dev:mesaflow
```

Porta padrão: **3010**

## Deploy (Vercel)

O deploy de produção é integrado ao projeto `projects/iphone-imports`, sob
`/mesaflow`. O script `projects/iphone-imports/scripts/build-mesaflow.mjs`
exporta o site e empacota a API.

### Persistência obrigatória

Cadastros, sessões, cardápios e mesas são persistidos em Vercel Blob no arquivo
`mesaflow/store.json` (mesmo store compartilhado do projeto).

**Não é necessário criar um Blob Store novo.** Reutilize o store já conectado ao
projeto `loja-iphoneimports` (`BLOB_STORE_ID` / `BLOB_READ_WRITE_TOKEN`), o
mesmo usado por W-Tube e iPhone Imports.

1. Confirme que o projeto já tem Blob conectado (ver `projects/iphone-imports/DEPLOY.md`).
2. Faça redeploy — o MesaFlow usa automaticamente `BLOB_STORE_ID` ou
   `BLOB_READ_WRITE_TOKEN`.
3. Valide: `GET /api/mesaflow/health` deve retornar `blob: true`.

Opcional: variáveis dedicadas `MESAFLOW_BLOB_STORE_ID` /
`MESAFLOW_BLOB_READ_WRITE_TOKEN` só se quiser isolar em outro store (exige
cota disponível na Vercel).

Sem Blob configurado, a API falha fechada e não grava dados em `/tmp`.

### Import cardápio Marcelo Lanches

O seed **não roda no deploy**. Após publicar, importe uma vez:

1. **Painel lojista** — login OWNER/MANAGER em Marcelo Lanches → **Produtos** → *Importar cardápio Marcelo Lanches*
2. **Painel plataforma** — login platform owner → detalhe do lojista → *Importar cardápio Marcelo Lanches*
3. **Script local** (Blob):

```bash
cd projects/mesaflow
export BLOB_READ_WRITE_TOKEN="…"
npm run seed:marcelo          # lojista já cadastrado
npm run seed:marcelo -- --create   # cria estabelecimento se faltar
```

4. **API autenticada** (sem secret): `POST /api/mesaflow/admin/catalog/import-marcelo` com sessão admin, ou `POST /api/mesaflow/platform/merchants/:id/import-marcelo-catalog` com sessão platform owner. Opcional: header `x-mesaflow-import-secret` quando `MESAFLOW_CATALOG_IMPORT_SECRET` estiver definido.

Detalhes de deploy NA MESA: `projects/iphone-imports/DEPLOY-NA-MESA.md`.

## Arquitetura MVP

- **Next.js App Router** — cliente, admin e KDS
- **Store JSON** — arquivo local em desenvolvimento e Vercel Blob privado em produção
- **SSE** — `/api/events` para atualização em tempo real
- **Multi-tenant** — `establishmentId` em todas as entidades

## Fluxos

1. QR → `/m/{slug}/{mesa}` → cardápio → carrinho → pedido
2. Pedido → painel admin (Kanban) + KDS por setor
3. Status atualiza → cliente vê timeline + SSE
4. Rodízio → rodadas com limite por configuração
