# Backend CBX (Neon + Prisma + Auth)

## Status

| Camada | Estado |
|---|---|
| Prisma schema | Pronto |
| Auth (e-mail/senha) | Pronto |
| API produtos/categorias | Pronto |
| Seed a partir dos mocks | Pronto |
| Upload de imagens | Pendente (usar URLs por enquanto) |
| Chat realtime | Pendente |
| Pagamentos Premium | Pendente |
| AdMob | Pendente (nativo) |

## 1. Criar banco no Neon

1. https://console.neon.tech → New Project
2. Copie a connection string
3. Em `apps/cbx/`:

```bash
cp .env.example .env
# edite DATABASE_URL e AUTH_SECRET
openssl rand -base64 32   # cole em AUTH_SECRET
```

## 2. Migrar + seed

```bash
cd apps/cbx
npx prisma migrate dev --name init
npm run db:seed
```

Login demo após seed:
- **e-mail:** `ana.oliveira@gmail.com`
- **senha:** `cbx123456`

## 3. Rodar em modo servidor (API ligada)

```bash
cd apps/cbx
npm run dev
# NEXT_PUBLIC_USE_API=1 automático (sem CBX_STATIC / NEXT_BASE_PATH)
```

Fluxos reais:
- Cadastro → `POST /api/auth/register`
- Login → Auth.js credentials
- Publicar anúncio → `POST /api/products` (persistido; aparece em outros devices)

## 4. Demo estática Black Box (mocks)

```bash
npm run build:static
# gera out/ com NEXT_BASE_PATH=/cbx (sem API)
```

Na raiz do monorepo: `npm run build:cbx` usa o build estático.

## 5. Deploy da API

O Black Box atual publica só arquivos estáticos. Para backend real:

**Opção A (recomendada):** projeto Vercel separado apontando para `apps/cbx` (sem `output: export`), com env `DATABASE_URL` + `AUTH_SECRET`.

**Opção B:** manter `/cbx` estático no Black Box e API em subdomínio `api.cbx...`.

## Endpoints

- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`
- `GET|POST /api/products`
- `GET|PATCH|DELETE /api/products/[id]`
- `GET /api/categories`
- `GET /api/me`
