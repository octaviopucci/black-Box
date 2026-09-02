# Deploy StudioClownTattoo (Netlify)

Site standalone na raiz do domínio Netlify (sem `/estudio-clow/`).

Domínio permanente: **https://estudio-clow-tattoo.netlify.app**  
Senha HTTP Basic: **Site** (usuário: `site`)

## Opção A — CLI (com token)

Configure `NETLIFY_AUTH_TOKEN` no ambiente (Netlify → Applications → Personal access token).

```bash
cd projects/estudio-clow-tattoo
npm ci
NEXT_BASE_PATH= npm run build
npx netlify-cli deploy --dir=out --prod --auth "$NETLIFY_AUTH_TOKEN" --site-name estudio-clow-tattoo
```

Ou use o script do monorepo:

```bash
bash .cursor/skills/frontend/netlify-preview/references/deploy.sh projects/estudio-clow-tattoo --slug estudio-clow-tattoo
```

(Requer adaptação: projeto Next.js publica em `out/`, não `dist/`.)

## Opção B — Git conectado (recomendado)

1. [Netlify](https://app.netlify.com) → Add new site → Import from Git
2. Repositório: `octaviopucci/black-Box`
3. **Branch:** `cursor/estudio-clow-perf-192e` (ou `main` após merge)
4. **Base directory:** `projects/estudio-clow-tattoo`
5. Build command e publish directory já vêm do `netlify.toml`
6. Deploy

## Black Box (Vercel)

No monorepo: https://blckbox.vercel.app/estudio-clow/
