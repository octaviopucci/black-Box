/**
 * Pucci Motors + LP Motors API/gestor no deploy host (loja-iphoneimports).
 * Site: out/pucci-motors/ · Gestor: out/b2-gestor/ · API: api/lp-motors.js
 */
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(hostRoot, '..', '..')
const pucciRoot = join(repoRoot, 'projects', 'pucci-motors')
const gestorRoot = join(repoRoot, 'apps', 'lp-motors-gestor')

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', ...opts })
}

function copyDir(src, dest) {
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    cpSync(join(src, entry), join(dest, entry), { recursive: true })
  }
}

console.log('\n→ pucci-motors: install + build site...')
run('npm ci --include=dev', { cwd: pucciRoot })
run('npm run build', {
  cwd: pucciRoot,
  env: {
    ...process.env,
    NEXT_BASE_PATH: '/pucci-motors',
    NEXT_PUBLIC_BASE_PATH: '/pucci-motors',
    NEXT_PUBLIC_LP_ORG_SLUG: 'pucci-motors',
  },
})

const siteOut = join(pucciRoot, 'out')
const siteTarget = join(hostRoot, 'out', 'pucci-motors')
if (!existsSync(join(siteOut, 'index.html'))) {
  console.error('✗ projects/pucci-motors/out/index.html ausente')
  process.exit(1)
}
console.log('→ pucci-motors: copiando para out/pucci-motors/...')
copyDir(siteOut, siteTarget)

console.log('\n→ b2-gestor: install + build...')
run('npm ci --include=dev', { cwd: gestorRoot })
run('npm run build', {
  cwd: gestorRoot,
  env: {
    ...process.env,
    VITE_BASE: '/b2-gestor/',
    VITE_APP_NAME: 'B2 Gestor',
    VITE_APP_SHORT: 'B2 Gestor',
    VITE_APP_DESCRIPTION:
      'B2 Gestor — Sistema profissional de gestão de estoque e operação para lojas de veículos',
    VITE_OUT_DIR: 'dist',
  },
})

const gestorDist = join(gestorRoot, 'dist')
const gestorTarget = join(hostRoot, 'out', 'b2-gestor')
if (!existsSync(join(gestorDist, 'index.html'))) {
  console.error('✗ apps/lp-motors-gestor/dist/index.html ausente')
  process.exit(1)
}
console.log('→ b2-gestor: copiando para out/b2-gestor/...')
copyDir(gestorDist, gestorTarget)

console.log('\n→ lp-motors: bundle API → api/lp-motors.js...')
await esbuild.build({
  entryPoints: [join(repoRoot, 'api', 'lp-motors.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: join(hostRoot, 'api', 'lp-motors.js'),
  format: 'cjs',
  sourcemap: true,
  loader: { '.json': 'json' },
  absWorkingDir: repoRoot,
  external: ['@vercel/blob', '@vercel/node'],
})

console.log('✓ Pucci Motors + LP Motors prontos no deploy host\n')
