import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const publicOut = join(root, 'public')
const portalDist = join(root, 'portal', 'dist')
const estudioClowDist = join(root, 'projects', 'estudio-clow-tattoo', 'out')

if (!existsSync(portalDist)) {
  throw new Error('portal/dist não encontrado — rode build:portal')
}
if (!existsSync(estudioClowDist)) {
  throw new Error('projects/estudio-clow-tattoo/out não encontrado — rode build:estudio-clow')
}

cpSync(portalDist, publicOut, { recursive: true })

rmSync(join(publicOut, 'estudio-clow'), { recursive: true, force: true })
mkdirSync(join(publicOut, 'estudio-clow'), { recursive: true })
cpSync(estudioClowDist, join(publicOut, 'estudio-clow'), { recursive: true })

console.log('public/ atualizado (portal + estudio-clow)')
