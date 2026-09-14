/**
 * Builda todas as lojas irmãs listadas em sibling-stores.json
 * e copia para out/<slug>/ no deploy host (iphone-imports).
 */
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(hostRoot, '..', '..')
const manifestPath = join(hostRoot, 'sibling-stores.json')

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', ...opts })
}

async function buildSibling({ slug, projectDir, apiBundle, apiModuleDir }) {
  const projectRoot = join(repoRoot, projectDir)
  const siteOut = join(projectRoot, 'out')
  const deployTarget = join(hostRoot, 'out', slug)
  const basePath = `/${slug}`
  const gestorBase = `${basePath}/gestor/`

  if (!existsSync(projectRoot)) {
    console.error(`✗ Projeto não encontrado: ${projectRoot}`)
    process.exit(1)
  }

  console.log(`\n→ ${slug}: gerando seed...`)
  run('npx tsx scripts/generate-seed-data.mjs', { cwd: projectRoot })

  console.log(`→ ${slug}: build site (base ${basePath})...`)
  run('npm run build', {
    cwd: projectRoot,
    env: {
      ...process.env,
      NEXT_BASE_PATH: basePath,
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
  })

  console.log(`→ ${slug}: build gestor (base ${gestorBase})...`)
  run('npm --prefix gestor run build', {
    cwd: projectRoot,
    env: { ...process.env, VITE_BASE: gestorBase },
  })

  const gestorDist = join(projectRoot, 'gestor', 'dist')
  if (!existsSync(gestorDist)) {
    console.error(`✗ ${slug}/gestor/dist não encontrado`)
    process.exit(1)
  }

  if (!existsSync(siteOut)) {
    console.error(`✗ ${slug}/out não encontrado`)
    process.exit(1)
  }

  console.log(`→ ${slug}: copiando para out/${slug}/...`)
  rmSync(deployTarget, { recursive: true, force: true })
  mkdirSync(deployTarget, { recursive: true })

  for (const entry of readdirSync(siteOut)) {
    cpSync(join(siteOut, entry), join(deployTarget, entry), { recursive: true })
  }
  cpSync(gestorDist, join(deployTarget, 'gestor'), { recursive: true })

  if (!existsSync(join(deployTarget, 'index.html'))) {
    console.error(`✗ out/${slug}/index.html ausente`)
    process.exit(1)
  }

  const handlerEntry = join(projectRoot, apiModuleDir, 'handler.ts')
  if (!existsSync(handlerEntry)) {
    console.error(`✗ Handler não encontrado: ${handlerEntry}`)
    process.exit(1)
  }

  console.log(`→ ${slug}: bundle API → ${apiBundle}...`)
  await esbuild.build({
    entryPoints: [handlerEntry],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: join(hostRoot, apiBundle),
    format: 'cjs',
    sourcemap: true,
    loader: { '.json': 'json' },
  })

  console.log(`✓ ${slug} pronto (out/${slug}/ + ${apiBundle})`)
}

for (const sibling of manifest.siblings) {
  await buildSibling(sibling)
}

console.log(`\n✓ ${manifest.siblings.length} loja(s) irmã(s) buildada(s)`)
