# Deploy — MesaFlow

MesaFlow é publicado no projeto Vercel **loja-iphoneimports** (mesmo host do iPhone Imports / W-Tube / Pucci Motors).

## URLs em produção

| Experiência | URL |
|-------------|-----|
| Landing | `https://loja-iphoneimports.vercel.app/mesaflow/` |
| Cliente Mesa 08 | `https://loja-iphoneimports.vercel.app/mesaflow/m/ponto-do-sabor/mesa-8` |
| Admin (lojista) | `https://loja-iphoneimports.vercel.app/mesaflow/admin/login` |
| Platform (NA MESA ops) | `https://loja-iphoneimports.vercel.app/mesaflow/platform/login` |
| KDS Cozinha | `https://loja-iphoneimports.vercel.app/mesaflow/kds/sec_cozinha` |
| API | `https://loja-iphoneimports.vercel.app/api/mesaflow/health` |

**Host alternativo (bedois):** substitua o domínio por `https://bedois.vercel.app` — paths idênticos (`/mesaflow/platform/login`, etc.).

**Login demo lojista (somente dev / `MESAFLOW_ALLOW_DEMO_SEED=1`):** `owner@pontodosabor.com` / `demo123`  
**Login platform owner (produção):** obrigatório `MESAFLOW_PLATFORM_OWNER_EMAIL` + `MESAFLOW_PLATFORM_OWNER_PASSWORD`

### OTP em produção

| Variável | Uso |
|----------|-----|
| `MESAFLOW_EVOLUTION_URL` + `MESAFLOW_EVOLUTION_API_KEY` + `MESAFLOW_EVOLUTION_INSTANCE` | OTP real via WhatsApp |
| `MESAFLOW_OTP_BYPASS_CODE=off` | Desativa bypass fixo quando Evolution não está configurado |

Sem Evolution **e** sem `off` explícito, produção **não** expõe código bypass na API (fail-closed).

> **Custo zero:** não contrate Evolution/WhatsApp nesta rodada — use `MESAFLOW_OTP_BYPASS_CODE=off` + `MESAFLOW_DEV_SKIP_OTP` desligado em prod, ou configure Evolution só quando o lojista já tiver instância própria.

## Como o deploy funciona

1. `projects/iphone-imports/scripts/build-mesaflow.mjs` — export estático em `out/mesaflow/`
2. `api/mesaflow.js` — serverless handler com store + pedidos
3. `vercel-build` do iphone-imports inclui o passo MesaFlow automaticamente
4. Push em `main` dispara `.github/workflows/iphone-imports-deploy.yml`

## Domínio `ponto-do-sabor.vercel.app`

Se você tem um projeto Vercel separado nesse domínio, **não use Output Directory = `public`**.  
Opções:

- **Recomendado:** aponte o domínio para o deploy em `loja-iphoneimports` (alias/custom domain)
- **Alternativa:** projeto separado com Root Directory = `projects/mesaflow`, Framework = Next.js, sem output directory manual

## Persistência (Blob)

O MesaFlow **reutiliza o Blob já conectado** ao projeto `loja-iphoneimports`.
Não crie um store novo se a Vercel retornar limite de uso.

| Arquivo no Blob | API | Acesso |
|-----------------|-----|--------|
| `mesaflow/store.json` | `/api/mesaflow` | compartilhado |
| `w-tube/store.json` | `/api/w-tube` | compartilhado |
| `iphone-imports/store.json` | `/api/iphone-imports` | compartilhado |

Validar após deploy:

```bash
curl https://loja-iphoneimports.vercel.app/api/mesaflow/health
# ok: true · blob: true
```

Se `blob: false`, siga o passo 4 de `projects/iphone-imports/DEPLOY.md` (conectar
Blob ou adicionar `BLOB_READ_WRITE_TOKEN`).

### Fallback: Upstash Redis (quando o Blob estiver suspenso)

Se o health retornar `persist.blob: false` e `This store has been suspended`, os pedidos
**não chegam ao restaurante** (cada instância serverless tem memória própria).

1. Vercel → projeto **loja-iphoneimports** → **Storage** → **Create Database** → **Upstash Redis**
2. **Connect to Project** → marque Production + Preview
3. Redeploy — a Vercel injeta `UPSTASH_REDIS_REST_URL`/`TOKEN` **ou** `KV_REST_API_URL`/`TOKEN`
4. Valide: `curl .../api/mesaflow/health` → `shared: true` e `storage.redis.configured: true`

> Se conectou o Upstash mas `redis.configured: false`, o deploy está antigo ou as variáveis
> não chegaram na function `api/mesaflow.js` — faça **Redeploy** após conectar.

Alternativa: criar um **Blob store novo** (não suspenso) e adicionar `BLOB_READ_WRITE_TOKEN` manualmente.

## Verificação local

```bash
npm run dev:mesaflow          # http://localhost:3010 (API em /api/*)
node projects/iphone-imports/scripts/build-mesaflow.mjs  # simula build de produção
```
