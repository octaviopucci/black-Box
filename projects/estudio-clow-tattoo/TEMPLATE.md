# Template — Site Premium Tatuador

Base: `projects/estudio-clow-tattoo/` (Next.js 16, static export, Netlify).

Referência live: https://estudio-clow-tattoo.netlify.app

## O que muda por cliente

| Área | Arquivo / local | Briefing |
|------|-----------------|----------|
| Logo, fotos, galeria | `public/` + `src/data/site.ts` | Drive `00–03` |
| WhatsApp, Instagram, endereço, mapa | `src/data/site.ts` | Seção 2, 4 |
| Textos PT | `src/i18n/locales/pt.ts` | Seções 5–12 |
| Textos EN / FR | `src/i18n/locales/en.ts`, `fr.ts` | Seção 3 — **só se contratado**; definir `i18nLocales` em `site.ts` |
| Cores | `src/app/globals.css` (`--paper`, `--ink`, …) | Seção 1 |
| Meta SEO | `src/app/layout.tsx` | Seção 16 |
| Senha preview | `public/_headers` | Seção 15 |
| Deploy | Netlify site ID / workflow | Seção 15 |

## Checklist de adaptação (dev)

1. Receber briefing + Drive
2. Baixar assets → `public/hero/`, `public/logo/`, etc.
3. Atualizar `site.ts` (urls, gallery categories, heroRoll)
4. Preencher `pt.ts` (copiar textos do briefing)
5. Traduzir `en.ts` / `fr.ts` **somente se contratado** — e adicionar idiomas em `site.ts` → `i18nLocales`
6. Ajustar cores em `globals.css` se necessário
7. `npm ci && NEXT_BASE_PATH= npm run build`
8. Deploy Netlify + domínio do cliente

## Documentos para o cliente

- [`docs/BRIEFING-CLIENTE-TATUADOR.md`](docs/BRIEFING-CLIENTE-TATUADOR.md) — formulário completo
- [`docs/MENSAGEM-ENVIO-CLIENTE.md`](docs/MENSAGEM-ENVIO-CLIENTE.md) — texto WhatsApp/e-mail

## Comandos

```bash
cd projects/estudio-clow-tattoo
npm ci
NEXT_BASE_PATH= npm run build
# Deploy
export NETLIFY_CONFIG_DIR=~/.config/netlify
npx netlify-cli deploy --dir=out --prod --site=<SITE_ID>
```
