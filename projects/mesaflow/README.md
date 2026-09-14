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

## Arquitetura MVP

- **Next.js App Router** — cliente, admin e KDS
- **Store JSON** — persistência local (`data/store.json` ou `/tmp` na Vercel)
- **SSE** — `/api/events` para atualização em tempo real
- **Multi-tenant** — `establishmentId` em todas as entidades

## Fluxos

1. QR → `/m/{slug}/{mesa}` → cardápio → carrinho → pedido
2. Pedido → painel admin (Kanban) + KDS por setor
3. Status atualiza → cliente vê timeline + SSE
4. Rodízio → rodadas com limite por configuração
