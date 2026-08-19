# Deploy Clínica Mussi Estética (Netlify)

Site standalone na raiz do domínio Netlify (sem `/clinica-mussi-estetica/`).

## Opção A — CLI (rápido para testar)

```bash
cd apps/clinica-mussi-estetica
npm ci
VITE_BASE=/ npm run build
npx netlify-cli login
npx netlify-cli deploy --dir=dist --prod
```

Deploy anônimo (preview temporário, ~60 min):

```bash
npx netlify-cli deploy --dir=dist --allow-anonymous
```

## Opção B — Git conectado

1. [Netlify](https://app.netlify.com) → Add new site → Import from Git
2. Repositório: `octaviopucci/black-Box`
3. **Branch:** `cursor/clinica-mussi-estetica-b3fe` (ou `main` após merge)
4. **Base directory:** `apps/clinica-mussi-estetica`
5. Build command e publish directory já vêm do `netlify.toml`
6. Deploy

## Black Box (Vercel)

No monorepo, o path continua sendo `/clinica-mussi-estetica/` em https://blckbox.vercel.app/clinica-mussi-estetica/
