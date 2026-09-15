# MesaFlow

SaaS multi-tenant de **garçom digital + pedidos em tempo real** via QR Code na mesa.

## Demo — Ponto do Sabor

| Experiência | URL |
|-------------|-----|
| Landing | `/` |
| Cliente (Mesa 08) | `/m/ponto-do-sabor/mesa-8` |
| Admin | `/admin` |
| KDS Cozinha | `/kds/sec_cozinha` |
| KDS Balcão | `/kds/sec_balcao` |

**Login admin:** `owner@pontodosabor.com` / `demo123`

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

Cadastros, sessões, cardápios e mesas são persistidos em um **Vercel Blob
privado**. Não reutilize o Blob público dos catálogos.

1. Crie um Blob Store com acesso **Private** e conecte-o ao projeto de produção.
2. Configure `MESAFLOW_BLOB_STORE_ID` com o ID desse store.
3. OIDC da Vercel autentica as funções automaticamente. Fora da Vercel, use
   `MESAFLOW_BLOB_READ_WRITE_TOKEN`.

Sem um store privado configurado, a API falha fechada e não grava dados em
`/tmp`.

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
