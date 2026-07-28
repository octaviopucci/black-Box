# Push para https://github.com/octaviopucci/black-Box

## Por que o agente não sobe sozinho

Mesmo com o Cursor em "todos os repositórios", **esta sessão Cloud Agent** só tem
token de instalação no repo onde foi iniciada:

- OK: `octaviopucci/cb-aqui`
- BLOQUEADO: `octaviopucci/black-Box` (push 403)

## Caminho mais rápido (no seu PC)

```bash
curl -fsSL https://raw.githubusercontent.com/octaviopucci/cb-aqui/cursor/maciel-motors-gestor-a08c/black-box/push-to-black-box.sh | bash
```

Ou clone manual:

```bash
git clone --branch cursor/maciel-motors-gestor-a08c --depth 1 https://github.com/octaviopucci/cb-aqui.git
cd cb-aqui/black-box
git init -b main
git add .
git commit -m "feat: Black Box — portal + Maciel Motors Gestor"
git remote add origin https://github.com/octaviopucci/black-Box.git
git push -u origin main
```

## Alternativa: Cloud Agent no black-Box

Abra um Cloud Agent **já no repo `black-Box`** e peça para importar a pasta
`black-box/` da branch `cursor/maciel-motors-gestor-a08c` do `cb-aqui`.

## Vercel (depois do push)

1. https://vercel.com/new → Import **black-Box**
2. Project Name: **Black Box**
3. Framework: Other
4. Build Command: `npm run build`
5. Output Directory: `dist`

- Portal: `/`
- Maciel Motors: `/maciel-motors/`
- Login: `admin` / `MacielMotors123`
