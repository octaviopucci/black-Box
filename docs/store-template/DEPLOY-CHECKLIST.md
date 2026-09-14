# Checklist de deploy — nova loja

Use após `npm run new:store` ou ao subir manualmente uma loja irmã (padrão W-Tube).

## 1. Repositório e build local

- [ ] `npm run new:store -- --slug <slug> --name "<Nome>" --whatsapp <5511...>` executado
- [ ] `npm --prefix projects/<slug> ci --include=dev`
- [ ] `npm --prefix projects/<slug>/gestor ci --include=dev`
- [ ] `npm run dev:<slug>` — site abre em `http://localhost:3000/<slug>`
- [ ] `npm run dev:<slug>-gestor` — gestor em `http://localhost:5173/<slug>/gestor/`
- [ ] `npm --prefix projects/iphone-imports run vercel-build` passa sem erro

## 2. Vercel — projeto `loja-iphoneimports`

### Variáveis de ambiente (Settings → Environment Variables)

| Variável | Obrigatória | Notas |
|----------|-------------|-------|
| `BLOB_STORE_ID` | Sim | Ex.: `store_NmkVR0FiBSrWBma9` — **uma** store Blob para o projeto |
| `BLOB_READ_WRITE_TOKEN` | Sim* | Ou token por loja se configurado em `store.ts` |
| `IPHONE_IMPORTS_JWT_SECRET` | Sim | Sessão gestor loja raiz |
| `W_TUBE_JWT_SECRET` | Se W-Tube | Uma por loja irmã: `<SLUG_ENV>_JWT_SECRET` |
| `<SLUG>_JWT_SECRET` | Nova loja | Gerada no `store.manifest.json` / `DEPLOY.md` da loja |

\* Em produção Vercel, OIDC Blob costuma suprir o token — confira `/api/<slug>/health` → `blob: true`.

### Após o deploy

- [ ] `GET https://<dominio>/api/<slug>/health` → `ok: true`, `blob: true`
- [ ] `GET https://<dominio>/api/<slug>/catalog/<slug>` → lista produtos com estoque
- [ ] Site `https://<dominio>/<slug>/` carrega vitrine
- [ ] Gestor `https://<dominio>/<slug>/gestor/` — login com credenciais do `DEPLOY.md`

## 3. Seed inicial em produção

Só na **primeira** subida ou se o Blob estiver vazio:

```bash
curl -X POST "https://<dominio>/api/<slug>/init" \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

⚠️ `force: true` **sobrescreve** dados do gestor. Use só na primeira vez ou para reset controlado.

- [ ] Health mostra `products` > 0 após init
- [ ] Gestor: logout + login após primeiro deploy com JWT novo

## 4. Gestor — fluxo de validação (motor)

- [ ] Cadastrar produto → **Publicado**
- [ ] Estoque → adicionar unidade → status **Disponível**
- [ ] Site atualiza em até ~15s (ou refresh)
- [ ] Marcar unidade como **Vendida** → produto some da vitrine (se era a última unidade)

## 5. Rewrites Vercel (gerados pelo `new:store`)

O script adiciona em `projects/iphone-imports/vercel.json`:

- Function `api/<slug>.js`
- Rewrites `/api/<slug>`, `/<slug>`, `/<slug>/gestor`, `/<slug>/produto/:slug`

- [ ] Conferir se rewrites não conflitam com paths existentes
- [ ] Redeploy após alterar `vercel.json`

## 6. Domínio customizado (opcional)

- [ ] DNS apontando para Vercel
- [ ] `siteUrl` em `src/config/store.ts` atualizado
- [ ] WhatsApp e links institucionais revisados

## 7. Pós-go-live

- [ ] Trocar senha admin do gestor (hoje em seed; ideal mover para env no futuro)
- [ ] Substituir produtos/categorias seed pelos reais via gestor
- [ ] Fotos dos produtos conferidas na vitrine

## Diagnóstico rápido

| Sintoma | Causa provável |
|---------|----------------|
| Site vazio, gestor ok | Produtos sem unidade `available` |
| Gestor não salva | JWT expirado / `BLOB_STORE_ID` ausente |
| `blob: false` no health | Env Blob na Vercel + redeploy |
| 404 no gestor | Rewrite `/<slug>/gestor` faltando |
| Produto não some após venda | Unidade não marcada `sold` ou cache — aguardar poll |

## Arquivos gerados por loja

| Arquivo | Conteúdo |
|---------|----------|
| `projects/<slug>/store.manifest.json` | Identidade, paths, env vars |
| `projects/<slug>/DEPLOY.md` | Credenciais iniciais + URLs desta loja |
