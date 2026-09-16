# Migrar para nova conta Vercel

Use este guia quando a conta antiga atingir limite de Blob ou precisar trocar de time.

## O que o agente já fez no repo

- `vercel` como devDependency (CLI via `npx vercel`)
- `npm run setup:vercel-plugin` — instala o plugin Vercel no Cursor
- Este guia + seção em `projects/iphone-imports/DEPLOY.md`

## O que só você pode fazer (5–10 min, no browser)

### 1. Nova conta Vercel + GitHub

1. [vercel.com](https://vercel.com) → login na **nova conta**
2. **Add New… → Project** → importar `octaviopucci/black-Box`
3. **Root Directory:** `projects/iphone-imports` (obrigatório)
4. Framework: **Other** — deixe Build/Output vazios (vem do `vercel.json`)
5. Deploy

### 2. Blob (obrigatório para gestores + MesaFlow)

1. Projeto → **Storage** → **Create** → **Blob**
2. Nome sugerido: `loja-iphoneimports-blob`
3. **Connect to Project** → marque Production + Preview + Development
4. Se `/health` continuar `blob: false`: Storage → Blob → Settings → token Read-Write → env `BLOB_READ_WRITE_TOKEN` no projeto → Redeploy

### 3. Deploy hook no GitHub

1. Vercel → projeto → **Settings → Git → Deploy Hooks** → criar hook (branch `main`)
2. GitHub → `octaviopucci/black-Box` → **Settings → Secrets → Actions**
3. Atualizar `VERCEL_DEPLOY_HOOK` com a URL do hook novo

### 4. Cursor + CLI local (Mac)

```bash
cd black-Box
npm ci
npm run setup:vercel-plugin   # ou no chat: /add-plugin vercel
npx vercel login
cd projects/iphone-imports && npx vercel link
```

### 5. Validar

Substitua `SEU-PROJETO` pelo domínio `.vercel.app` do novo projeto:

```bash
curl https://SEU-PROJETO.vercel.app/api/iphone-imports/health
curl https://SEU-PROJETO.vercel.app/api/w-tube/health
curl https://SEU-PROJETO.vercel.app/api/mesaflow/health
# blob: true em todas (após PR #192 mergeado na main)
```

## Token para automação (opcional)

Se quiser que agentes usem o CLI sem browser:

1. Vercel → **Settings → Tokens** → criar token
2. Exportar localmente: `export VERCEL_TOKEN=...` (não commitar)
3. `cd projects/iphone-imports && npx vercel link --yes`
