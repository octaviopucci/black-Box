# Octávio Pucci Tattoo

Landing premium para [@octaviopuccitattoo](https://www.instagram.com/octaviopuccitattoo/) — Next.js standalone, pronta para exportar do monorepo Black Box.

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

## WhatsApp

Defina o link do WhatsApp (mesmo da bio do Instagram):

```bash
# .env.local
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/5515999999999
```

Sem a variável, o CTA aponta para o perfil do Instagram.

## Assets

Imagens e copy extraídos do feed público via `instagram-extract` skill — ver `public/instagram/meta.json`.

## Deploy

Importe esta pasta na Vercel ou conecte um repo dedicado do cliente.