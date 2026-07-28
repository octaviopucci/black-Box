# Maciel Motors Gestor

Sistema profissional de gestão para concessionárias e revendas de veículos.

## Stack

- React 18 + TypeScript + Vite
- TailwindCSS
- React Router DOM
- React Hook Form + Zod
- Lucide React + Framer Motion + Recharts
- Persistência LocalStorage (JSON)

## Desenvolvimento

```bash
cd maciel-motors-gestor
npm install
npm run dev
```

## Build / Netlify

```bash
npm run build
```

Publicar a pasta `dist`. O arquivo `netlify.toml` já está configurado.

## Acesso inicial

O sistema inicia **zerado** (sem veículos, vendas, despesas, clientes ou histórico).
Os usuários padrão permanecem para o primeiro login:

- Usuário: `admin`
- Senha: `MacielMotors123`

Também: `maciel` / `maciel123`

Dados de demonstração podem ser carregados opcionalmente em **Backup → Restaurar backup demo**.
