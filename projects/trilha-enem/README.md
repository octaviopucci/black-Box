# Trilha ENEM

Story-quiz funnel para vender app de estudos ENEM — correção de questões, redação com feedback e simulados.

Criado via Black Box `/agency-site` + padrão story-quiz (funil narrativo).

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

## Configurar

Edite `src/data/site.ts`:

- `ctaWhatsApp` — link WhatsApp real
- `signupUrl` / checkouts em `plans[].checkout`

Copy do funil: `src/data/quiz.ts`.

## Deploy

Importe esta pasta no Vercel ou `vercel --cwd projects/trilha-enem`.

Projeto standalone — não entra no `assemble-dist` do monorepo Black Box.
