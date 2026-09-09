# Deploy na Netlify — iPhone Imports (sem ZIP)

> **Não use ZIP baixado de link externo.** Antivírus costumam marcar builds Next.js (muitos arquivos `.js`) como falso positivo. O site é só HTML/CSS/JS estático — não há executáveis.

## Opção recomendada — Netlify + GitHub

1. Acesse [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Conecte o repositório **black-Box** no GitHub
3. Escolha o branch `cursor/iphone-imports-ecommerce-bbb9` (ou `main` após merge do PR)
4. Configure:

| Campo | Valor |
|-------|--------|
| **Base directory** | `projects/iphone-imports` |
| **Build command** | `npm ci && npm run build` |
| **Publish directory** | `out` |
| **Node version** | 22 |

5. Deploy. Cada push no branch refaz o build automaticamente.

## Opção 2 — Build no seu computador

```bash
git clone https://github.com/octaviopucci/black-Box.git
cd black-Box/projects/iphone-imports
npm install
npm run build
```

A pasta `out/` é o site pronto. No Netlify Drop, arraste **só essa pasta** (gerada por você — não baixe ZIP de terceiros).

## Opção 3 — Netlify CLI

```bash
cd projects/iphone-imports
npm ci && npm run build
npx netlify-cli deploy --prod --dir=out
```

## Depois do deploy

Edite `src/config/store.ts` (WhatsApp, Instagram, etc.), commit e push — o Netlify rebuilda sozinho se estiver ligado ao Git.
