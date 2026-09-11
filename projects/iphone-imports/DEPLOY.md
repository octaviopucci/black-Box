# Deploy — iPhone Imports (site + gestor + API)

Projeto unificado em `projects/iphone-imports/`:

| Parte | URL em produção |
|-------|-----------------|
| Loja iPhone Imports | `https://loja-iphoneimports.vercel.app/` |
| Gestor iPhone Imports | `https://loja-iphoneimports.vercel.app/gestor/` |
| API iPhone Imports | `https://loja-iphoneimports.vercel.app/api/iphone-imports` |
| Loja W-Tube | `https://loja-iphoneimports.vercel.app/w-tube` |
| Gestor W-Tube | `https://loja-iphoneimports.vercel.app/w-tube/gestor/` |
| API W-Tube | `https://loja-iphoneimports.vercel.app/api/w-tube` |

## Vercel — checklist (loja-iphoneimports)

### 1. Git (Settings → Git) ✅
- Repositório: `octaviopucci/black-Box`
- Branch de produção: `main`

### 2. Build (Settings → Build and Deployment) — **obrigatório**
| Campo | Valor |
|-------|-------|
| **Root Directory** | `projects/iphone-imports` |
| Framework Preset | Other |
| Build Command | *(deixar vazio — vem do `vercel.json` do projeto)* |
| Output Directory | *(deixar vazio — vem do `vercel.json`)* |
| Install Command | *(deixar vazio — vem do `vercel.json`)* |
| **Ignored Build Step** | *(deixar vazio — vem do `vercel.json` do projeto)* |

> **Erro comum:** `bash scripts/vercel-ignore-build.sh: No such file or directory`  
> O dashboard está com Ignored Build Step manual apontando para o script da **raiz do monorepo**.  
> **Correção:** Settings → Build → limpe o campo *Ignored Build Step* (o `projects/iphone-imports/vercel.json` já define `ignoreCommand`).  
> Confirme também **Root Directory** = `projects/iphone-imports`.

Depois de alterar o Root Directory: **Deployments → Redeploy** no **último commit da `main`** (não redeploy de commit antigo).

> No log deve aparecer `npm --prefix gestor ci` antes do build. Se o commit for antigo (ex. `4fb2b18`), o gestor não instala deps e o build falha.

### 3. Domínio
- `loja-iphoneimports.vercel.app`

### 4. Variáveis de ambiente (Settings → Environment Variables)
| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `BLOB_READ_WRITE_TOKEN` | Recomendado | Persiste estoque entre reinícios da API |
| `NEXT_PUBLIC_STORE_SLUG` | Não | Padrão: `iphone-imports` |

### 5. Após conectar o Git
O Vercel dispara deploy automático no próximo push à `main`.
Para forçar agora: **Deployments → Redeploy** no último commit.

### 6. Validar deploy
```bash
curl https://loja-iphoneimports.vercel.app/api/iphone-imports/health
# Deve retornar: "slug":"iphone-imports", "products":37, "inventory":37

curl https://loja-iphoneimports.vercel.app/api/w-tube/health
# Deve retornar: "slug":"w-tube"
```

O build gera `out/` (iPhone Imports + `out/gestor/`), `out/w-tube/` (W-Tube + gestor) e os bundles `api/iphone-imports.js` + `api/w-tube.js`.
Config: `outputDirectory: out` + auto-detect `api/iphone-imports.js` + `rewrites`.
**Não use `functions` apontando para `.js` gerado** — o Vercel valida antes do build.
**Não use `api/iphone-imports.ts` sem bundle** — causa `FUNCTION_INVOCATION_FAILED` em produção.

## Build local

```bash
cd projects/iphone-imports
npm ci --include=dev
npm --prefix gestor ci --include=dev
npm run vercel-build
```

Saída: `out/` (loja + `out/gestor/`) + `api/dist/handler.cjs`

## Login do gestor

### iPhone Imports

| Campo | Valor |
|-------|-------|
| Usuário | `admin` |
| Senha | `adminimports123` |
| Código da loja | `iphone-imports` |

### W-Tube (`/w-tube/gestor/`)

| Campo | Valor |
|-------|-------|
| Usuário | `admin` |
| Senha | `wtubeadmin123` |
| Código da loja | `w-tube` |

O catálogo do site é populado automaticamente com os 37 produtos do seed.
Alterações no estoque pelo gestor refletem na loja em até 15 segundos.

## Testes

```bash
npm run test:api   # 13 testes estoque ↔ catálogo
```
