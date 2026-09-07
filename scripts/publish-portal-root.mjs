import { cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const portalDist = join(root, 'portal', 'dist')
const publicOut = join(root, 'public')

if (!existsSync(portalDist)) {
  throw new Error('portal/dist não encontrado — rode npm run build:portal')
}

if (!existsSync(publicOut)) {
  throw new Error('public/ não encontrado — monorepo precisa de public/ com demos')
}

const items = ['index.html', 'favicon.png', '_redirects', 'assets', 'brand']

for (const item of items) {
  const src = join(portalDist, item)
  if (!existsSync(src)) continue
  cpSync(src, join(publicOut, item), { recursive: true })
}

console.log('Portal publicado na raiz de public/ (index + assets + brand)')
