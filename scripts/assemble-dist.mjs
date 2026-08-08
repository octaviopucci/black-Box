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
const pradoDist = join(root, 'apps', 'dr-marcelo-prado', 'dist')
const harmonieDist = join(root, 'apps', 'clinica-harmonie', 'dist')
const pucciDist = join(root, 'apps', 'octavio-pucci', 'dist')
const naDist = join(root, 'apps', 'na-veiculos', 'dist')
const matsubaraDist = join(root, 'apps', 'clinica-matsubara', 'dist')
const danielleDist = join(root, 'apps', 'danielle-matsubara', 'dist')
const glDist = join(root, 'apps', 'gl-locacoes', 'dist')
const cbxDist = join(root, 'apps', 'cbx', 'out')
const pavDist = join(root, 'apps', 'protocolo-pav', 'dist')

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
if (!existsSync(pradoDist)) {
  throw new Error('apps/dr-marcelo-prado/dist não encontrado — rode build:prado')
}
if (!existsSync(harmonieDist)) {
  throw new Error('apps/clinica-harmonie/dist não encontrado — rode build:harmonie')
}
if (!existsSync(pucciDist)) {
  throw new Error('apps/octavio-pucci/dist não encontrado — rode build:pucci')
}
if (!existsSync(naDist)) {
  throw new Error('apps/na-veiculos/dist não encontrado — rode build:na')
}
if (!existsSync(matsubaraDist)) {
  throw new Error('apps/clinica-matsubara/dist não encontrado — rode build:matsubara')
}
if (!existsSync(danielleDist)) {
  throw new Error('apps/danielle-matsubara/dist não encontrado — rode build:danielle')
}
if (!existsSync(glDist)) {
  throw new Error('apps/gl-locacoes/dist não encontrado — rode build:gl')
}
if (!existsSync(cbxDist)) {
  throw new Error('apps/cbx/out não encontrado — rode build:cbx')
}
if (!existsSync(pavDist)) {
  throw new Error('apps/protocolo-pav/dist não encontrado — rode build:pav')
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
  mkdirSync(join(target, 'dr-marcelo-prado'), { recursive: true })
  cpSync(pradoDist, join(target, 'dr-marcelo-prado'), { recursive: true })
  mkdirSync(join(target, 'clinica-harmonie'), { recursive: true })
  cpSync(harmonieDist, join(target, 'clinica-harmonie'), { recursive: true })
  mkdirSync(join(target, 'octavio-pucci'), { recursive: true })
  cpSync(pucciDist, join(target, 'octavio-pucci'), { recursive: true })
  mkdirSync(join(target, 'na-veiculos'), { recursive: true })
  cpSync(naDist, join(target, 'na-veiculos'), { recursive: true })
  mkdirSync(join(target, 'clinica-matsubara'), { recursive: true })
  cpSync(matsubaraDist, join(target, 'clinica-matsubara'), { recursive: true })
  mkdirSync(join(target, 'danielle-matsubara'), { recursive: true })
  cpSync(danielleDist, join(target, 'danielle-matsubara'), { recursive: true })
  mkdirSync(join(target, 'gl-locacoes'), { recursive: true })
  cpSync(glDist, join(target, 'gl-locacoes'), { recursive: true })
  mkdirSync(join(target, 'cbx'), { recursive: true })
  cpSync(cbxDist, join(target, 'cbx'), { recursive: true })
  mkdirSync(join(target, 'protocolo-pav'), { recursive: true })
  cpSync(pavDist, join(target, 'protocolo-pav'), { recursive: true })
  const pixWeb = join(root, 'apps', 'pix-gateway', 'web')
  mkdirSync(join(target, 'pix'), { recursive: true })
  cpSync(pixWeb, join(target, 'pix'), { recursive: true })
}

publish(out)
// Vercel no celular usa Output Directory padrão "public" — espelha o dist.
publish(publicOut)

console.log('publicado em dist/ e public/ (portal + apps + /pix/)')
