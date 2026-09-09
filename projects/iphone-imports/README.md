# iPhone Imports — E-commerce

Loja de iPhones, smartphones, acessórios e eletrônicos com checkout via WhatsApp.

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zustand · Lucide React

## Comandos

```bash
npm install --include=dev
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Configuração da loja

Edite `src/config/store.ts`:

| Campo | Descrição |
|-------|-----------|
| `whatsapp` | Número com DDI (ex: `5511999999999`) |
| `instagram` / `instagramUrl` | Perfil Instagram |
| `topBarMessage` | Texto da barra superior |
| `promoBarMessage` | Texto da barra promocional |
| `siteUrl` | URL do site (SEO/sitemap) |

## Produtos e preços

- **Produtos:** `src/data/products.ts`
- **Categorias:** `src/data/categories.ts`
- **Imagens:** URLs centralizadas em `products.ts` — substitua pelas fotos da loja

## Imagens externas

| Domínio | Origem |
|---------|--------|
| `store.storeimages.cdn-apple.com` | CDN oficial Apple (press/store) |
| `images.unsplash.com` | Placeholders de acessórios genéricos |

Configure `remotePatterns` em `next.config.ts` ao adicionar novos domínios.
