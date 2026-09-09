# Deploy na Netlify — iPhone Imports

## Opção 1 — Arrastar e soltar (mais rápido)

1. Baixe o ZIP **`iphone-imports-netlify-site.zip`** (pasta `out` já compilada).
2. Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
3. Arraste o ZIP ou a pasta descompactada para a área de upload.
4. Pronto — o site ficará no ar em segundos.

## Opção 2 — Projeto completo (build na Netlify)

1. Baixe o ZIP **`iphone-imports-projeto.zip`**.
2. No Netlify: **Add new site → Deploy manually** ou conecte um repositório Git.
3. Se fizer upload manual do projeto:
   - **Build command:** `npm ci && npm run build`
   - **Publish directory:** `out`
   - **Node version:** 22

## Depois do deploy

Edite `src/config/store.ts` (WhatsApp, Instagram, etc.) e faça novo build/upload.
