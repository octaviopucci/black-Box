# Deploy — MesaFlow

MesaFlow é publicado no projeto Vercel **loja-iphoneimports** (mesmo host do iPhone Imports / W-Tube / Pucci Motors).

## URLs em produção

| Experiência | URL |
|-------------|-----|
| Landing | `https://loja-iphoneimports.vercel.app/mesaflow/` |
| Cliente Mesa 08 | `https://loja-iphoneimports.vercel.app/mesaflow/m/ponto-do-sabor/mesa-8` |
| Admin | `https://loja-iphoneimports.vercel.app/mesaflow/admin` |
| KDS Cozinha | `https://loja-iphoneimports.vercel.app/mesaflow/kds/sec_cozinha` |
| API | `https://loja-iphoneimports.vercel.app/api/mesaflow/health` |

**Login demo:** `owner@pontodosabor.com` / `demo123`

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

## Verificação local

```bash
npm run dev:mesaflow          # http://localhost:3010 (API em /api/*)
node projects/iphone-imports/scripts/build-mesaflow.mjs  # simula build de produção
```
