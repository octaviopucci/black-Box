# Black Box

Plataforma de hospedagem e demonstração de projetos para clientes.

Quando o cliente ainda não tem infraestrutura própria, o projeto fica aqui com domínio/hospedagem da Black Box (Vercel).

## Projetos publicados

| Projeto | Caminho | Status |
|---------|---------|--------|
| **Maciel Motors Gestor** | [/maciel-motors/](/maciel-motors/) | Ativo |

Login inicial Maciel: `admin` / `MacielMotors123` (sistema inicia zerado)

## Stack

- Portal Black Box (React + Vite + TypeScript)
- Apps de cliente em `apps/`
- Deploy unificado na **Vercel**

## Desenvolvimento

```bash
# Portal
npm run dev:portal

# Maciel Motors (isolado)
npm run dev:maciel

# Build completo (igual Vercel)
npm run build
```

## Criar o repositório GitHub + Vercel

1. No GitHub, crie um repositório vazio chamado **`black-box`** (org/usuário `octaviopucci`).
2. Depois rode:

```bash
cd /caminho/para/black-box
git init
git add .
git commit -m "feat: Black Box — portal + Maciel Motors Gestor"
git branch -M main
git remote add origin https://github.com/octaviopucci/black-box.git
git push -u origin main
```

3. Na Vercel: **Add New Project** → importe `black-box` →
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node: 20.x

4. Domínio: use o `*.vercel.app` ou aponte um domínio custom (ex.: `blackbox.seudominio.com`).

## Adicionar um novo cliente/projeto

1. Coloque o app em `apps/nome-do-cliente`
2. Ajuste `scripts/assemble-dist.mjs` e `vercel.json` para o novo path
3. Cadastre o card no portal (`portal/src/data/projects.ts`)
4. Commit + push → Vercel publica
