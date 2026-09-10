/**
 * Builda W-Tube com base /w-tube e copia para out/w-tube/ do deploy iphone-imports.
 *
 * Next com basePath gera HTML em w-tube/out/ (raiz), não em w-tube/out/w-tube/.
 * Assets referenciam /w-tube/_next/... — copiamos tudo para iphone-imports/out/w-tube/.
 */
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const iphoneRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const wtubeRoot = join(iphoneRoot, '..', 'w-tube')
const wtubeSiteOut = join(wtubeRoot, 'out')
const deployTarget = join(iphoneRoot, 'out', 'w-tube')

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', ...opts })
}

function copySiteToDeploy() {
  if (!existsSync(wtubeSiteOut)) {
    console.error('w-tube/out não encontrado — verifique o build do site')
    process.exit(1)
  }

  rmSync(deployTarget, { recursive: true, force: true })
  mkdirSync(deployTarget, { recursive: true })

  for (const entry of readdirSync(wtubeSiteOut)) {
    const src = join(wtubeSiteOut, entry)
    const dest = join(deployTarget, entry)
    cpSync(src, dest, { recursive: true })
  }
}

console.log('→ W-Tube: gerando seed...')
run('npx tsx scripts/generate-seed-data.mjs', { cwd: wtubeRoot })

console.log('→ W-Tube: build site (base /w-tube)...')
run('npm run build', {
  cwd: wtubeRoot,
  env: { ...process.env, NEXT_BASE_PATH: '/w-tube', NEXT_PUBLIC_BASE_PATH: '/w-tube' },
})

console.log('→ W-Tube: build gestor (base /w-tube/gestor/)...')
run('npm --prefix gestor run build', {
  cwd: wtubeRoot,
  env: { ...process.env, VITE_BASE: '/w-tube/gestor/' },
})

const gestorDist = join(wtubeRoot, 'gestor', 'dist')
if (!existsSync(gestorDist)) {
  console.error('w-tube/gestor/dist não encontrado')
  process.exit(1)
}

console.log('→ W-Tube: copiando site para out/w-tube/...')
copySiteToDeploy()
cpSync(gestorDist, join(deployTarget, 'gestor'), { recursive: true })

if (!existsSync(join(deployTarget, 'index.html'))) {
  console.error('out/w-tube/index.html não gerado — cópia do site falhou')
  process.exit(1)
}
if (!existsSync(join(deployTarget, '_next'))) {
  console.error('out/w-tube/_next não gerado — assets do Next ausentes')
  process.exit(1)
}

console.log('→ W-Tube: bundle API...')
await esbuild.build({
  entryPoints: [join(wtubeRoot, 'api/_w-tube/handler.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: join(iphoneRoot, 'api/w-tube.js'),
  format: 'cjs',
  sourcemap: true,
  loader: { '.json': 'json' },
})

const siteFiles = readdirSync(deployTarget).length
console.log(`✓ W-Tube em out/w-tube/ (${siteFiles} entradas) + api/w-tube.js`)
