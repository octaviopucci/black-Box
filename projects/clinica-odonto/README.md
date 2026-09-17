# Odonto Studio

Landing page para clínica odontológica — Next.js standalone, criada via Black Box `/agency-site`.

## Dev

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Personalizar

Edite `src/data/site.ts` — nome, WhatsApp, endereço, tratamentos, FAQ e depoimentos.

## Deploy

Importe esta pasta no Vercel ou conecte um repo dedicado:

```bash
vercel --cwd projects/clinica-odonto
```

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4 + shadcn/ui
- Framer Motion
- TypeScript
