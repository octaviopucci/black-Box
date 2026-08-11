# LP Motors Gestor

Sistema profissional de gestão de estoque e operação para lojas de veículos.

## Stack

- React 18 + TypeScript + Vite
- TailwindCSS (design system próprio LP)
- React Router DOM
- Persistência local + sincronização multi-dispositivo via API (`/api/lp-motors`)
- Vercel Blob (quando `BLOB_READ_WRITE_TOKEN` estiver configurado) — custo zero na faixa gratuita
- Schema SQL preparado para Supabase/PostgreSQL em `supabase/schema.sql`

## Desenvolvimento

```bash
npm run dev:lp-motors
# ou
cd apps/lp-motors-gestor && npm install && npm run dev
```

## Acesso inicial

- Usuário: `admin`
- Senha: `LPMotors123`

Também: `gerente` / `gerente123`

Dados de demonstração: **Backup → Restaurar backup demo**.

## Multi-dispositivo

No login, o sistema tenta sincronizar com `/api/lp-motors`.

- **Sem Blob** (`"blob": false` no health): a UI mostra **“Só neste aparelho”** — PC e celular não compartilham dados.
- **Com Blob** (`BLOB_READ_WRITE_TOKEN` + redeploy): status **“Sincronizado”** — mesma conta, mesma base.

Checklist completo: [`DEPLOY.md`](./DEPLOY.md).

## Build

```bash
npm run build:lp-motors
```

Publicado em `/lp-motors/` (e variante interativa em `/lp-motors-x/`).

Produto **independente** do Maciel Motors Gestor (`/maciel-motors/`). Cada um tem app, branding, dados e URLs próprios.

## Consulta FIPE / Placa

Tela `/fipe` no estilo PlacaFIPE:

- busca por placa (Mercosul ou antiga);
- cascata FIPE gratuita (tipo → marca → modelo → ano) via `/api/lp-motors/fipe/*` (Parallelum);
- estimativa de IPVA por UF;
- aplicar valor no veículo do estoque.

Para ativar identificação automática placa→marca/modelo, configure na Vercel:

- `LP_MOTORS_PLATE_API_URL` — ex.: `https://seu-provedor/placa/{plate}`
- `LP_MOTORS_PLATE_API_TOKEN` — opcional
- `FIPE_API_TOKEN` — opcional (aumenta limite Parallelum)
