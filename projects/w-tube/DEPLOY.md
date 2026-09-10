# Deploy — W-Tube (site + gestor + API)

| Parte | URL em produção (subdomínio) |
|-------|------------------------------|
| Loja | `https://w-tube.vercel.app/` |
| Gestor | `https://w-tube.vercel.app/gestor/` |
| API | `https://w-tube.vercel.app/api/w-tube/health` |

## 1. Criar projeto no Vercel (subdomínio de teste)

1. [vercel.com/new](https://vercel.com/new) → importar repo `octaviopucci/black-Box`
2. **Project Name:** `w-tube` → subdomínio `w-tube.vercel.app`
3. **Root Directory:** `projects/w-tube`
4. Framework: **Other** (usa `vercel.json` do projeto)
5. Deixe Build / Output / Install vazios no painel (vêm do `vercel.json`)

## 2. Blob (persistência estoque + produtos)

1. Vercel → projeto **w-tube** → **Storage** → **Blob** → Create
2. Conectar ao projeto `w-tube`
3. Confirme `BLOB_READ_WRITE_TOKEN` em Environment Variables

## 3. Variáveis de ambiente

| Variável | Valor |
|----------|--------|
| `BLOB_READ_WRITE_TOKEN` | automático ao criar Blob |
| `NEXT_PUBLIC_STORE_SLUG` | `w-tube` |

## 4. Deploy

Push na `main` com alterações em `projects/w-tube/**` ou **Redeploy** manual.

Deploy hook (opcional): GitHub secret `W_TUBE_VERCEL_DEPLOY_HOOK` — ver workflow `w-tube-deploy.yml`.

## 5. Validar

```bash
curl https://w-tube.vercel.app/api/w-tube/health
# esperado: "slug":"w-tube", "blob":true

curl https://w-tube.vercel.app/api/w-tube/catalog/w-tube
```

## Login gestor

| Campo | Valor |
|-------|--------|
| URL | `https://w-tube.vercel.app/gestor/` |
| Usuário | `admin` |
| Senha | `wtubeadmin123` |
| Código da loja | `w-tube` |

## Build local

```bash
cd projects/w-tube
npm ci --include=dev
npm --prefix gestor ci --include=dev
npm run vercel-build
npm run test:api
```

## Paleta

Preto `#050505` + roxo `#9333ea` (site e gestor).
