# Octávio Pucci Tattoo Infinity

Landing page Next.js — estúdio de tatuagem em Capão Bonito, SP.

Criado via Black Box `/agency-site`.

## Setup

```bash
npm install
cp .env.example .env.local
# Edite NEXT_PUBLIC_WHATSAPP_NUMBER com o número real (5514...)
```

## Dev

```bash
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Deploy

Importe esta pasta na Vercel ou conecte um repo dedicado. Configure `NEXT_PUBLIC_WHATSAPP_NUMBER` nas Environment Variables.

## Personalizar

- Textos, serviços e depoimentos: `src/lib/site-config.ts`
- WhatsApp: `.env.local` → `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Cores da marca: `src/app/globals.css` (`--brand-*`)

## Handoff

Projeto standalone — copie `projects/octavio-pucci-tattoo/` para repo do cliente e remova do monorepo Black Box.
