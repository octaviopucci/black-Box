# Octávio Pucci Tattoo

Site **criado do zero** a partir exclusivamente do Instagram [@octaviopuccitattoo](https://www.instagram.com/octaviopuccitattoo/).

- Visual: flash sheet editorial (papel claro, serif + mono, vermelho tatuagem)
- Conteúdo: captions e imagens em `public/instagram/meta.json`
- **Sem** referência a `apps/octavio-pucci` ou outros demos do monorepo

## Dev

```bash
npm install
npm run dev
```

## Build / Netlify

```bash
npm run build   # export estático → out/
```

```bash
# .env.local — opcional
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/55...
```

## Deploy preview

```bash
bash ../../.cursor/skills/frontend/netlify-preview/references/deploy.sh projects/octavio-pucci-tattoo --slug octaviopuccitattoo
```

(Adaptar publish dir para `out/` — ver `netlify.toml`.)
