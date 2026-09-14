# Deploy — MesaFlow

MesaFlow é um app **Next.js completo** (páginas + API routes + SSE). Precisa de um **projeto Vercel separado** — não roda como site estático no `blckbox.vercel.app`.

## URLs sugeridas (após deploy)

| Experiência | URL |
|-------------|-----|
| Landing | `https://<projeto>.vercel.app/` |
| Cliente Mesa 08 | `https://<projeto>.vercel.app/m/ponto-do-sabor/mesa-8` |
| Admin | `https://<projeto>.vercel.app/admin` |
| KDS Cozinha | `https://<projeto>.vercel.app/kds/sec_cozinha` |

**Login demo:** `owner@pontodosabor.com` / `demo123`

## Checklist Vercel (5 min)

### 1. Novo projeto
1. [Vercel Dashboard](https://vercel.com/new) → Import `octaviopucci/black-Box`
2. **Root Directory:** `projects/mesaflow`
3. **Framework Preset:** Next.js
4. **Build Command:** *(deixar vazio — vem do `vercel.json`)*
5. **Output Directory:** *(deixar vazio — NÃO usar `public` nem `.next`)*
6. **Install Command:** *(deixar vazio — vem do `vercel.json`)*
7. Deploy

> **Erro comum:** `The Next.js output directory "public" was not found`  
> O dashboard está com **Output Directory** = `public` (preset “Other”).  
> **Correção:** Settings → Build → limpe **Output Directory** e mude **Framework** para **Next.js**. Redeploy.

### 2. Domínio (opcional)
- Sugestão: `mesaflow-ponto.vercel.app` ou `ponto-do-sabor.vercel.app`

### 3. Deploy automático no push em `main`
1. Projeto → **Settings** → **Deploy Hooks** → Create Hook (branch `main`)
2. GitHub → repo **black-Box** → **Settings** → **Secrets** → `MESAFLOW_VERCEL_DEPLOY_HOOK`
3. Push em `main` dispara `.github/workflows/mesaflow-deploy.yml`

### 4. Persistência de dados (produção)
Por padrão o store JSON vai para `/tmp` na Vercel (ephemeral). Para demo estável, configure depois:
- Vercel Blob ou KV para `store.json`
- Ou variável `MESAFLOW_DATA` apontando para storage persistente

## Verificação local

```bash
npm run dev:mesaflow
# http://localhost:3010
```

## CI

Workflow: `.github/workflows/mesaflow-deploy.yml` — valida `npm run vercel-build` em cada push em `main` que toca `projects/mesaflow/**`.
