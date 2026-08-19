# Deploy Studio Laís Felicia (Netlify)

Site standalone na raiz do domínio Netlify (sem `/lais-felicia/`).

## Opção A — CLI (rápido para testar)

```bash
cd apps/lais-felicia
npm ci
VITE_BASE=/ npm run build
npx netlify-cli login
npx netlify-cli deploy --dir=dist --prod
```

## Opção B — Git conectado

1. [Netlify](https://app.netlify.com) → Add new site → Import from Git
2. Repositório: `octaviopucci/black-Box`
3. **Base directory:** `apps/lais-felicia`
4. Build command e publish directory já vêm do `netlify.toml`
5. Deploy

## Vídeo scroll-scrub

- Arquivo: `public/hero-scrub.mp4` (sem áudio)
- Reprocessar: `./scripts/prepare-hero-video.sh caminho/do/video.mp4`

## Black Box (Vercel)

No monorepo, o path continua sendo `/lais-felicia/` em https://blckbox.vercel.app/lais-felicia/
