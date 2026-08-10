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

No login, o sistema tenta sincronizar com `/api/lp-motors`. Com Blob configurado no deploy Vercel, a mesma conta vê os mesmos dados em qualquer dispositivo.

## Build

```bash
npm run build:lp-motors
```

Publicado em `/lp-motors/` (e variante interativa em `/lp-motors-x/`).
URLs legadas `/maciel-motors/` redirecionam automaticamente.
