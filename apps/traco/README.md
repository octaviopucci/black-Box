# traço

Studio de pintura digital inspirado no Procreate, com **IA integrada por seleção**.

## Diferencial

Selecione com laço, retângulo, elipse ou uma camada inteira e peça alterações em linguagem natural:

- “deixe mais quente”
- “transforme em esboço”
- “remova o conteúdo”
- “glow neon”

Sem `OPENAI_API_KEY`, a demo IA roda localmente (efeitos inteligentes por prompt). Com a chave na Vercel, a API `/api/traco` tenta edição live via OpenAI Images.

## Stack

- React + Vite + TypeScript + Tailwind
- Canvas 2D (camadas, pincéis, seleção)
- Persistência em `localStorage`
- API opcional em `/api/traco`

## Dev

```bash
npm run dev:traco
# http://localhost:5173
```

## Build (path Black Box)

```bash
npm run build:traco
```

Publicado em `/traco/`.
