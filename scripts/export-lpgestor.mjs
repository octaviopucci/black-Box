#!/usr/bin/env node
/**
 * Exporta LP Motors Gestor como repositório standalone (lpgestor.com.br).
 * Uso: node scripts/export-lpgestor.mjs [pasta-destino]
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dest = process.argv[2] || join(root, 'lpgestor')
const app = join(root, 'apps', 'lp-motors-gestor')

const COPY_FILES = [
  'index.html',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'tailwind.config.js',
  'postcss.config.js',
  'vitest.config.ts',
  '.oxlintrc.json',
]

const COPY_DIRS = ['src', 'public']

const gitDir = join(dest, '.git')
const hadGit = existsSync(gitDir)
if (existsSync(dest)) {
  if (hadGit) {
    const tmpGit = join(root, '.lpgestor-git-tmp')
    rmSync(tmpGit, { recursive: true, force: true })
    cpSync(gitDir, tmpGit, { recursive: true })
    rmSync(dest, { recursive: true, force: true })
    mkdirSync(dest, { recursive: true })
    cpSync(tmpGit, gitDir, { recursive: true })
    rmSync(tmpGit, { recursive: true, force: true })
  } else {
    rmSync(dest, { recursive: true, force: true })
    mkdirSync(dest, { recursive: true })
  }
} else {
  mkdirSync(dest, { recursive: true })
}

for (const f of COPY_FILES) {
  cpSync(join(app, f), join(dest, f))
}

for (const d of COPY_DIRS) {
  cpSync(join(app, d), join(dest, d), { recursive: true })
}

mkdirSync(join(dest, 'api'), { recursive: true })
cpSync(join(root, 'api', 'lp-motors.ts'), join(dest, 'api', 'lp-motors.ts'))
cpSync(join(root, 'api', '_lp-motors'), join(dest, 'api', '_lp-motors'), { recursive: true })

const appPkg = JSON.parse(readFileSync(join(app, 'package.json'), 'utf8'))

writeFileSync(
  join(dest, 'package.json'),
  JSON.stringify(
    {
      name: 'lpgestor',
      private: true,
      version: '1.0.0',
      description: 'LP Gestor — sistema de gestão de estoque para lojas de veículos',
      type: 'module',
      engines: { node: '22.x' },
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
        lint: 'oxlint',
        test: 'vitest run',
        'vercel-build': 'npm run build',
      },
      dependencies: {
        ...appPkg.dependencies,
        '@vercel/blob': '^2.8.0',
        '@vercel/node': '^5.3.0',
      },
      devDependencies: appPkg.devDependencies,
    },
    null,
    2,
  ) + '\n',
)

writeFileSync(
  join(dest, 'vercel.json'),
  JSON.stringify(
    {
      buildCommand: 'npm run vercel-build',
      outputDirectory: 'dist',
      framework: null,
      installCommand: 'npm install',
      redirects: [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'www.lpgestor.com.br' }],
          destination: 'https://lpgestor.com.br/:path*',
          permanent: true,
        },
      ],
      functions: {
        'api/lp-motors.ts': {
          memory: 512,
          maxDuration: 30,
          includeFiles: 'api/_lp-motors/**',
        },
      },
      rewrites: [
        { source: '/api/lp-motors', destination: '/api/lp-motors?path=health' },
        { source: '/api/lp-motors/(.*)', destination: '/api/lp-motors?path=$1' },
        { source: '/((?!api(?:/|$)|assets(?:/|$)|favicon\\.svg$).*)', destination: '/index.html' },
      ],
      headers: [
        {
          source: '/(.*)',
          headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
        },
      ],
    },
    null,
    2,
  ) + '\n',
)

writeFileSync(
  join(dest, '.gitignore'),
  `# deps & build
node_modules
dist
dist-ssr
dist-domain
dist-x
*.local

# logs
*.log

# editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
`,
)

writeFileSync(
  join(dest, 'README.md'),
  `# LP Gestor

Sistema de gestão de estoque e operação para lojas de veículos.

**Produção:** [lpgestor.com.br](https://lpgestor.com.br)

## URLs

| Página | Caminho |
|--------|---------|
| App | \`/\` |
| Login | \`/login\` |
| Cadastro de loja | \`/cadastro\` |
| API | \`/api/lp-motors/*\` |

## Desenvolvimento

\`\`\`bash
npm install
npm run dev
\`\`\`

Para API local com Blob/sync, use [Vercel CLI](https://vercel.com/docs/cli):

\`\`\`bash
npx vercel dev
\`\`\`

## Deploy (Vercel)

1. Importe este repositório na [Vercel](https://vercel.com/new)
2. Framework: **Other** (build \`npm run vercel-build\`, output \`dist\`)
3. Variáveis de ambiente:
   - \`BLOB_STORE_ID\` — Vercel Blob (Storage → Create → connect)
   - Opcional: \`LP_MOTORS_PLACAFIP_TOKEN\` — consulta placa→FIPE
4. Domínio: **lpgestor.com.br** (ver [DOMAIN.md](./DOMAIN.md))

## Credenciais demo (seed local)

- \`admin\` / \`LPMotors123\`

Em produção, cada loja se cadastra em \`/cadastro\`.

## Origem

Extraído do monorepo [black-Box](https://github.com/octaviopucci/black-Box) (\`apps/lp-motors-gestor\` + \`api/lp-motors\`).
`,
)

// Vite proxy for local dev without vercel dev
const vitePath = join(dest, 'vite.config.ts')
let vite = readFileSync(vitePath, 'utf8')
if (!vite.includes('proxy')) {
  vite = vite.replace(
    '  server: {\n    host: true,\n    allowedHosts: true,\n  },',
    `  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api/lp-motors': {
        target: process.env.VITE_API_PROXY || 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },`,
  )
  writeFileSync(vitePath, vite)
}

writeFileSync(
  join(dest, 'DOMAIN.md'),
  `# Domínio — lpgestor.com.br

## 1. Vercel — novo projeto

1. [vercel.com/new](https://vercel.com/new) → Import **octaviopucci/lpgestor**
2. Framework: **Other**
3. Build: \`npm run vercel-build\` · Output: \`dist\`
4. **Settings → Domains** → Add \`lpgestor.com.br\` e \`www.lpgestor.com.br\`
5. **Storage → Blob** → conectar ao projeto (\`BLOB_STORE_ID\`)

## 2. Hostinger — DNS

| Tipo | Nome | Valor |
|------|------|--------|
| **A** | \`@\` | \`76.76.21.21\` |
| **CNAME** | \`www\` | \`cname.vercel-dns.com\` |

Apague AAAA conflitantes no \`@\`. Salve e aguarde propagação.

## 3. Validar

\`\`\`bash
curl -s https://lpgestor.com.br/api/lp-motors/health
\`\`\`

Esperado: \`"blob": true\`
`,
)

writeFileSync(
  join(dest, 'GITHUB-SETUP.md'),
  `# Publicar no GitHub (5 minutos)

O código já está pronto localmente. Falta **criar o repositório vazio** na sua conta e fazer o push.

## Passo 1 — Criar repo vazio

Abra (já preenche nome e descrição):

**https://github.com/new?name=lpgestor&description=LP+Gestor+%E2%80%94+gest%C3%A3o+de+estoque+para+lojas+de+ve%C3%ADculos**

- Owner: **octaviopucci**
- Public
- **Não** marque README, .gitignore nem license (repo vazio)

Clique em **Create repository**.

## Passo 2 — Push do código local

\`\`\`bash
cd lpgestor
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/octaviopucci/lpgestor.git
git push -u origin main
\`\`\`

## Passo 3 — Vercel (projeto novo)

1. https://vercel.com/new → import **octaviopucci/lpgestor**
2. Framework: **Other** · Build: \`npm run vercel-build\` · Output: \`dist\`
3. **Storage → Blob** → conectar ao projeto
4. **Settings → Domains** → \`lpgestor.com.br\` e \`www.lpgestor.com.br\`

Ver [DOMAIN.md](./DOMAIN.md) para DNS Hostinger.

## Atualizar depois (sync do monorepo)

\`\`\`bash
node scripts/publish-lpgestor.mjs
\`\`\`
`,
)

writeFileSync(
  join(dest, 'DEPLOY.md'),
  `# Deploy — LP Gestor (standalone)

Repositório dedicado para **lpgestor.com.br**. Não depende do monorepo black-Box.

## Vercel (recomendado)

1. Importe este repo na Vercel
2. Env: \`BLOB_STORE_ID\` (Vercel Blob conectado)
3. Domínio: ver [DOMAIN.md](./DOMAIN.md)

## Variáveis opcionais

| Variável | Uso |
|----------|-----|
| \`LP_MOTORS_PLACAFIP_TOKEN\` | Placa → FIPE automático |
| \`LP_MOTORS_PLATE_API_TOKEN\` | Consulta placa alternativa |

## Health

\`\`\`bash
curl -s https://lpgestor.com.br/api/lp-motors/health
\`\`\`
`,
)

console.log(`Exportado para ${dest}`)
