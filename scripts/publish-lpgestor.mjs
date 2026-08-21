#!/usr/bin/env node
/**
 * Exporta LP Gestor do monorepo e prepara commit no repo standalone local.
 * Uso: node scripts/publish-lpgestor.mjs
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dest = join(root, 'lpgestor')

execSync('node scripts/export-lpgestor.mjs', { cwd: root, stdio: 'inherit' })

if (!existsSync(join(dest, '.git'))) {
  execSync('git init -b main', { cwd: dest, stdio: 'inherit' })
}

try {
  execSync('git add -A', { cwd: dest, stdio: 'inherit' })
  execSync('git diff --cached --quiet', { cwd: dest, stdio: 'pipe' })
  console.log('Nenhuma alteração para commit.')
} catch {
  execSync('git commit -m "sync from black-Box"', { cwd: dest, stdio: 'inherit' })
}

console.log(`
Próximo passo (se o repo GitHub ainda não existe):
  Abra lpgestor/GITHUB-SETUP.md
`)
