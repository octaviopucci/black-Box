# Deploy OdontoMed (Netlify)

Site standalone na raiz do domínio Netlify (sem `/odontomed/`).

## Opção A — CLI (rápido)

```bash
cd apps/odontomed
npm ci
VITE_BASE=/ npm run build
npx netlify-cli login
npx netlify-cli deploy --dir=dist --prod
```

Preview anônimo (~60 min, sem login):

```bash
npx netlify-cli deploy --dir=dist --allow-anonymous
```

## Opção B — Git conectado (recomendado)

1. [Netlify](https://app.netlify.com) → Add new site → Import from Git
2. Repositório: `octaviopucci/black-Box`
3. **Branch:** `cursor/odontomed-landing-5657` (ou `main` após merge)
4. **Base directory:** `apps/odontomed`
5. Build command e publish directory já vêm do `netlify.toml`
6. Deploy

## Black Box (Vercel)

No monorepo, o path continua sendo `/odontomed/` em https://blckbox.vercel.app/odontomed/
