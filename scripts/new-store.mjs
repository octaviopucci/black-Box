#!/usr/bin/env node
/**
 * Cria uma nova loja irmã (padrão W-Tube) sem alterar o motor estoque→site.
 *
 * Uso:
 *   npm run new:store -- --slug moda-bella --name "Moda Bella" --whatsapp 5511999887766
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  applyReplacements,
  generateAdminPassword,
  shouldProcessFile,
  slugToApiFolder,
  slugToEnvPrefix,
  slugToOrgId,
  validateSlug,
} from './store-template/lib.mjs'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const deployHost = join(repoRoot, 'projects/iphone-imports')
const templateDir = join(repoRoot, 'projects/w-tube')
const siblingManifestPath = join(deployHost, 'sibling-stores.json')
const rootPkgPath = join(repoRoot, 'package.json')
const hostPkgPath = join(deployHost, 'package.json')
const hostVercelPath = join(deployHost, 'vercel.json')

const EXCLUDE_DIRS = new Set(['node_modules', 'out', '.next', 'dist', '.git'])

function parseArgs(argv) {
  const args = { dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dry-run') args.dryRun = true
    else if (a === '--slug') args.slug = argv[++i]
    else if (a === '--name') args.name = argv[++i]
    else if (a === '--whatsapp') args.whatsapp = argv[++i]
    else if (a === '--help' || a === '-h') args.help = true
  }
  return args
}

function printHelp() {
  console.log(`
Cria nova loja irmã (mesmo deploy Vercel que iPhone Imports).

Uso:
  npm run new:store -- --slug <slug> --name "<Nome>" --whatsapp <5511...>

Flags:
  --slug       Identificador kebab-case (obrigatório)
  --name       Nome da loja (obrigatório)
  --whatsapp   WhatsApp com DDI (obrigatório)
  --dry-run    Simula sem escrever arquivos
  --help       Esta ajuda

Docs: docs/store-template/README.md
`)
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (EXCLUDE_DIRS.has(entry)) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

function copyProject(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    filter: (path) => {
      const parts = path.split('/')
      return !parts.some((p) => EXCLUDE_DIRS.has(p))
    },
  })
}

function patchTextFiles(projectRoot, pairs) {
  const files = walk(projectRoot)
  for (const file of files) {
    if (!shouldProcessFile(file)) continue
    const original = readFileSync(file, 'utf8')
    const updated = applyReplacements(original, pairs)
    if (updated !== original) writeFileSync(file, updated)
  }
}

function renameApiFolder(projectRoot, slug) {
  const from = join(projectRoot, 'api/_w-tube')
  const to = join(projectRoot, slugToApiFolder(slug))
  if (existsSync(from)) renameSync(from, to)
}

function writeStoreManifest(projectRoot, config) {
  writeFileSync(join(projectRoot, 'store.manifest.json'), JSON.stringify(config, null, 2) + '\n')
}

function writeDeployDoc(projectRoot, config) {
  const doc = `# Deploy — ${config.name}

Gerado por \`npm run new:store\`. Checklist completo: [docs/store-template/DEPLOY-CHECKLIST.md](../../docs/store-template/DEPLOY-CHECKLIST.md)

## URLs (produção)

| Área | Path |
|------|------|
| Site | \`/${config.slug}/\` |
| Gestor | \`/${config.slug}/gestor/\` |
| API | \`/api/${config.slug}/\` |
| Health | \`/api/${config.slug}/health\` |

## Credenciais iniciais (gestor)

| Campo | Valor |
|-------|-------|
| Usuário | \`admin\` |
| Senha | \`${config.adminPassword}\` |
| Loja (login) | \`${config.slug}\` |

⚠️ Troque a senha após o primeiro acesso.

## Variáveis Vercel sugeridas

| Variável | Valor |
|----------|-------|
| \`${config.envPrefix}_JWT_SECRET\` | (gere um segredo forte) |
| \`BLOB_STORE_ID\` | Mesmo do projeto (já configurado) |

Blob path: \`${config.slug}/store.json\`

## Dev local

\`\`\`bash
npm run dev:${config.slug}
npm run dev:${config.slug}-gestor
\`\`\`

## Seed produção (só primeira vez)

\`\`\`bash
curl -X POST "https://<dominio>/api/${config.slug}/init" \\
  -H "Content-Type: application/json" \\
  -d '{"force": true}'
\`\`\`
`
  writeFileSync(join(projectRoot, 'DEPLOY.md'), doc)
}

function registerSibling(config, dryRun) {
  const manifest = JSON.parse(readFileSync(siblingManifestPath, 'utf8'))
  if (manifest.siblings.some((s) => s.slug === config.slug)) {
    throw new Error(`Loja "${config.slug}" já está em sibling-stores.json`)
  }

  const entry = {
    slug: config.slug,
    name: config.name,
    projectDir: `projects/${config.slug}`,
    apiBundle: `api/${config.slug}.js`,
    apiModuleDir: slugToApiFolder(config.slug),
  }

  if (dryRun) {
    console.log('[dry-run] Adicionaria sibling:', entry)
    return
  }

  manifest.siblings.push(entry)
  writeFileSync(siblingManifestPath, JSON.stringify(manifest, null, 2) + '\n')
}

function patchHostVercel(config, dryRun) {
  const vercel = JSON.parse(readFileSync(hostVercelPath, 'utf8'))
  const slug = config.slug
  const fnKey = `api/${slug}.js`

  if (!vercel.functions[fnKey]) {
    vercel.functions[fnKey] = { memory: 512, maxDuration: 30 }
  }

  const rewritePairs = [
    { source: `/api/${slug}`, destination: `/api/${slug}?path=health` },
    { source: `/api/${slug}/(.*)`, destination: `/api/${slug}?path=$1` },
    { source: `/${slug}`, destination: `/${slug}/index.html` },
    { source: `/${slug}/gestor`, destination: `/${slug}/gestor/index.html` },
    { source: `/${slug}/gestor/((?!assets/).*)`, destination: `/${slug}/gestor/index.html` },
    { source: `/${slug}/produto/:slug`, destination: `/${slug}/produto/__live__.html` },
  ]

  for (const rw of rewritePairs) {
    const exists = vercel.rewrites.some((r) => r.source === rw.source)
    if (!exists) vercel.rewrites.push(rw)
  }

  const installSuffix = `&& npm --prefix ../${slug} ci --include=dev && npm --prefix ../${slug}/gestor ci --include=dev`
  if (!vercel.installCommand.includes(`../${slug}`)) {
    vercel.installCommand += ` ${installSuffix}`
  }

  if (dryRun) {
    console.log('[dry-run] Atualizaria vercel.json (function + rewrites + install)')
    return
  }

  writeFileSync(hostVercelPath, JSON.stringify(vercel, null, 2) + '\n')
}

function patchHostPackageJson(config, dryRun) {
  const pkg = JSON.parse(readFileSync(hostPkgPath, 'utf8'))
  const buildCmd = pkg.scripts['vercel-build'] || ''

  if (!buildCmd.includes('build-sibling-stores.mjs')) {
    pkg.scripts['vercel-build'] = buildCmd.replace(
      'node scripts/build-w-tube.mjs',
      'node scripts/build-sibling-stores.mjs',
    )
  }

  if (dryRun) {
    console.log('[dry-run] vercel-build → build-sibling-stores.mjs')
    return
  }

  writeFileSync(hostPkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function patchRootPackageJson(config, dryRun) {
  const pkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'))
  const slug = config.slug
  const scriptKey = `dev:${slug}`
  const gestorKey = `dev:${slug}-gestor`

  pkg.scripts[scriptKey] =
    `NEXT_BASE_PATH=/${slug} NEXT_PUBLIC_BASE_PATH=/${slug} npm --prefix projects/${slug} run dev`
  pkg.scripts[gestorKey] =
    `VITE_BASE=/${slug}/gestor/ npm --prefix projects/${slug}/gestor run dev`

  if (dryRun) {
    console.log(`[dry-run] scripts: ${scriptKey}, ${gestorKey}`)
    return
  }

  writeFileSync(rootPkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    return
  }

  const slug = args.slug?.trim()
  const name = args.name?.trim()
  const whatsapp = args.whatsapp?.replace(/\D/g, '')

  if (!slug || !name || !whatsapp) {
    console.error('Erro: --slug, --name e --whatsapp são obrigatórios.\n')
    printHelp()
    process.exit(1)
  }

  validateSlug(slug)

  const projectRoot = join(repoRoot, 'projects', slug)
  if (existsSync(projectRoot)) {
    console.error(`Erro: projects/${slug} já existe.`)
    process.exit(1)
  }

  const adminPassword = generateAdminPassword()
  const envPrefix = slugToEnvPrefix(slug)
  const orgId = slugToOrgId(slug)

  const replacements = [
    ['api/_w-tube', slugToApiFolder(slug)],
    ['/api/w-tube', `/api/${slug}`],
    ['api/w-tube', `api/${slug}`],
    ['W_TUBE_JWT_SECRET', `${envPrefix}_JWT_SECRET`],
    ['w-tube-loja-iphoneimports-session-v1', `${slug}-loja-session-v1`],
    ['w-tube/store.json', `${slug}/store.json`],
    ['/tmp/w-tube-store.json', `/tmp/${slug}-store.json`],
    ['./data/w-tube-store.json', `./data/${slug}-store.json`],
    ['org_w_tube', orgId],
    ['wtubeadmin123', adminPassword],
    ['W-Tube — Matriz', `${name} — Matriz`],
    ['W-Tube', name],
    ['w-tube', slug],
    ['w_tube', slug.replace(/-/g, '_')],
    ['NEXT_PUBLIC_STORE_SLUG || "w-tube"', `NEXT_PUBLIC_STORE_SLUG || "${slug}"`],
    ['FALLBACK_SLUGS = ["w-tube"]', `FALLBACK_SLUGS = ["${slug}"]`],
    ['"/w-tube"', `"/${slug}"`],
    ["'/w-tube'", `'/${slug}'`],
    ['`/w-tube`', `\`/${slug}\``],
    ['NEXT_BASE_PATH=/w-tube', `NEXT_BASE_PATH=/${slug}`],
    ['VITE_BASE=/w-tube/gestor/', `VITE_BASE=/${slug}/gestor/`],
    ['5511999999999', whatsapp],
  ]

  const manifest = {
    slug,
    name,
    vertical: 'general',
    whatsapp,
    orgId,
    adminPassword,
    envPrefix,
    paths: {
      basePath: `/${slug}`,
      api: `/api/${slug}`,
      gestor: `/${slug}/gestor`,
      blob: `${slug}/store.json`,
    },
    createdAt: new Date().toISOString(),
  }

  console.log(`\nNova loja: ${name} (${slug})`)
  if (args.dryRun) console.log('Modo: dry-run\n')

  if (!args.dryRun) {
    console.log('→ Copiando template w-tube...')
    copyProject(templateDir, projectRoot)
    renameApiFolder(projectRoot, slug)
    console.log('→ Aplicando substituições...')
    patchTextFiles(projectRoot, replacements)
    writeStoreManifest(projectRoot, manifest)
    writeDeployDoc(projectRoot, manifest)
  } else {
    console.log(`→ Copiaria ${relative(repoRoot, templateDir)} → projects/${slug}/`)
  }

  console.log('→ Registrando no deploy host...')
  registerSibling(manifest, args.dryRun)
  patchHostVercel(manifest, args.dryRun)
  patchHostPackageJson(manifest, args.dryRun)
  patchRootPackageJson(manifest, args.dryRun)

  console.log(`
✓ Loja ${args.dryRun ? '(simulada)' : 'criada'}: projects/${slug}/

Próximos passos:
  1. Edite produtos/categorias em projects/${slug}/src/data/
  2. npm --prefix projects/${slug} ci --include=dev
  3. npm run dev:${slug}
  4. Siga docs/store-template/DEPLOY-CHECKLIST.md

Gestor (após deploy): admin / ${adminPassword} / loja: ${slug}
`)
}

main()
