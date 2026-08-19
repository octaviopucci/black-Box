# Deploy Marcenaria Noé (Netlify)

Site standalone na raiz do domínio Netlify.

## Opção A — CLI (rápido)

```bash
cd apps/marcenaria-noe
npm ci
VITE_BASE=/ npm run build
npx netlify-cli login
npx netlify-cli deploy --dir=dist --prod
```

Preview anônimo (~60 min):

```bash
npx netlify-cli deploy --dir=dist --allow-anonymous
```

## Opção B — Git conectado

1. [Netlify](https://app.netlify.com) → Add new site → Import from Git
2. Repositório: `octaviopucci/black-Box`
3. **Base directory:** `apps/marcenaria-noe`
4. Build command e publish directory já vêm do `netlify.toml`
5. Deploy
