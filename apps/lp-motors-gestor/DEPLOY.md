# Deploy — LP Motors Gestor

## Credenciais iniciais

- **Login:** `admin` / `LPMotors123`
- **Gerente:** `gerente` / `gerente123`

## Netlify (app isolado)

```bash
cd apps/lp-motors-gestor
npm ci
npm run build
```

Publique a pasta `dist`.

## Monorepo Vercel

```bash
npm run build:lp-motors
npm run build:lp-motors-x
```

Rotas:

- `/lp-motors/`
- `/lp-motors-x/`
- `/api/lp-motors/*` — sync multi-dispositivo

Não altera o Maciel Motors (`/maciel-motors/`), que continua sendo publicado em paralelo.

Para sync em produção, configure `BLOB_READ_WRITE_TOKEN` (mesmo padrão do PIX Gateway — faixa gratuita do Vercel Blob).
