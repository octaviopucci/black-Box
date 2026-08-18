# Backend CBX (Neon + Auth + Pix mensal)

## Status

| Camada | Estado |
|---|---|
| Prisma + Neon | Pronto |
| Auth (e-mail/senha) | Pronto — conta obrigatória no app real |
| API produtos | Pronto + limite por plano |
| Planos pagos | Starter / Premium / Empresarial / Ilimitado |
| Pix mensal | Pronto (Mercado Pago ou sandbox) |
| Upload de imagens | Pendente (URLs por enquanto) |
| Chat persistido | Pendente |
| App nativo / ads | Fora deste ciclo |

## Planos (mensalidade Pix, 30 dias)

| Plano | Preço | Anúncios ativos |
|---|---|---|
| Starter | R$ 19,90 | 5 |
| Premium | R$ 29,90 | 15 |
| Empresarial | R$ 79,90 | 50 |
| Empresarial Ilimitado | R$ 149,90 | Ilimitado |

Sem Pix confirmado no período → não publica.

## 1. Banco Neon

```bash
cd apps/cbx
cp .env.example .env
# DATABASE_URL + AUTH_SECRET
openssl rand -base64 32
npx prisma migrate deploy
npm run db:seed
```

Login demo após seed:
- Comprador (sem plano de venda): `ana.oliveira@gmail.com` / `cbx123456`
- Vendedor empresarial (assinatura seed): `carlos.mendes@outlook.com` / `cbx123456`

## 2. Modo servidor (app real)

```bash
cd apps/cbx
npm run dev
```

Fluxos:
- Cadastro / login → sessão
- Planos → gera QR Pix → webhook MP (ou botão demo) → 30 dias
- Publicar → exige assinatura ativa e vaga no limite

## 3. Mercado Pago

1. Crie aplicação em https://www.mercadopago.com.br/developers
2. `MP_ACCESS_TOKEN` no `.env`
3. Webhook: `https://SEU-DOMINIO/api/billing/webhook` (tópico Payments)

Sem token: Pix sandbox + **Já paguei (demo)**.

## 4. Demo Black Box (mocks)

```bash
npm run build:static
```

Raiz: `npm run build:cbx` continua estático em `/cbx`.

## 5. Deploy

Projeto Vercel separado (não `output: export`), env:
`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `MP_ACCESS_TOKEN`.

## Endpoints

- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`
- `GET|POST /api/products`
- `GET|PATCH|DELETE /api/products/[id]`
- `GET /api/categories` · `GET /api/me` · `GET /api/plans`
- `POST /api/billing/pix`
- `GET /api/billing/payments/[id]`
- `GET /api/billing/me`
- `POST /api/billing/webhook`
- `POST /api/billing/sandbox-confirm`
