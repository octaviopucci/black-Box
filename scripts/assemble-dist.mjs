import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const out = join(root, 'dist')
const publicOut = join(root, 'public')
const portalDist = join(root, 'portal', 'dist')
const macielDist = join(root, 'apps', 'maciel-motors-gestor', 'dist')
const macielXDist = join(root, 'apps', 'maciel-motors-gestor', 'dist-x')
const porthalDist = join(root, 'apps', 'porthal-imoveis', 'dist')
const marcioDist = join(root, 'apps', 'marcio-mariano', 'dist')
const sogovDist = join(root, 'apps', 'sogov', 'dist')
const dnaDist = join(root, 'apps', 'clinica-dna', 'dist')

if (!existsSync(portalDist)) throw new Error('portal/dist não encontrado — rode build:portal')
if (!existsSync(macielDist)) throw new Error('apps/maciel-motors-gestor/dist não encontrado — rode build:maciel')
if (!existsSync(macielXDist)) {
  throw new Error('apps/maciel-motors-gestor/dist-x não encontrado — rode build:maciel-x')
}
if (!existsSync(porthalDist)) {
  throw new Error('apps/porthal-imoveis/dist não encontrado — rode build:porthal')
}
if (!existsSync(marcioDist)) {
  throw new Error('apps/marcio-mariano/dist não encontrado — rode build:marcio')
}
if (!existsSync(sogovDist)) {
  throw new Error('apps/sogov/dist não encontrado — rode build:sogov')
}
if (!existsSync(dnaDist)) {
  throw new Error('apps/clinica-dna/dist não encontrado — rode build:dna')
}

function publish(target) {
  rmSync(target, { recursive: true, force: true })
  mkdirSync(target, { recursive: true })
  cpSync(portalDist, target, { recursive: true })
  mkdirSync(join(target, 'maciel-motors'), { recursive: true })
  cpSync(macielDist, join(target, 'maciel-motors'), { recursive: true })
  mkdirSync(join(target, 'maciel-motors-x'), { recursive: true })
  cpSync(macielXDist, join(target, 'maciel-motors-x'), { recursive: true })
  mkdirSync(join(target, 'porthal-imoveis'), { recursive: true })
  cpSync(porthalDist, join(target, 'porthal-imoveis'), { recursive: true })
  mkdirSync(join(target, 'marcio-mariano'), { recursive: true })
  cpSync(marcioDist, join(target, 'marcio-mariano'), { recursive: true })
  mkdirSync(join(target, 'sogov'), { recursive: true })
  cpSync(sogovDist, join(target, 'sogov'), { recursive: true })
  mkdirSync(join(target, 'clinica-dna'), { recursive: true })
  cpSync(dnaDist, join(target, 'clinica-dna'), { recursive: true })
}

publish(out)
// Vercel no celular usa Output Directory padrão "public" — espelha o dist.
publish(publicOut)

console.log('publicado em dist/ e public/ (portal + /maciel-motors/ + /maciel-motors-x/ + /porthal-imoveis/ + /marcio-mariano/ + /sogov/ + /clinica-dna/)')
