import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const slug = process.argv[2]
if (!slug) {
  console.error('Usage: node scripts/publish-project-site.mjs <slug>')
  process.exit(1)
}

const root = process.cwd()
const source = join(root, 'projects', slug, 'out')
const target = join(root, 'public', slug)

if (!existsSync(source)) {
  throw new Error(`projects/${slug}/out não encontrado — rode build:${slug}`)
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
cpSync(source, target, { recursive: true })

console.log(`public/${slug} atualizado`)
