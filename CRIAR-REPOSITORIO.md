# Como criar o repositório GitHub + Vercel

Este ambiente **não consegue criar** o repositório `black-box` na sua conta GitHub
(token do agente sem permissão `createRepository`).

## 1. Crie o repositório (2 minutos)

1. Abra: https://github.com/new
2. Owner: **octaviopucci**
3. Repository name: **`black-box`**
4. Visibility: Private (recomendado) ou Public
5. **Não** marque README / .gitignore / license (repo vazio)
6. Create repository

## 2. Avise aqui com a URL

Exemplo: `https://github.com/octaviopucci/black-box`

Com o repo criado, o push é:

```bash
cd black-box
git init -b main   # se ainda não tiver git
git add .
git commit -m "feat: Black Box — portal + Maciel Motors Gestor"
git remote add origin https://github.com/octaviopucci/black-box.git
git push -u origin main
```

## 3. Conecte na Vercel (projeto “Black Box”)

1. https://vercel.com/new
2. Import **black-box**
3. Project Name: **Black Box**
4. Framework Preset: **Other**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Deploy

URLs esperadas:
- Portal: `https://seu-projeto.vercel.app/`
- Maciel Motors: `https://seu-projeto.vercel.app/maciel-motors/`
- Login Maciel: `admin` / `admin123`
