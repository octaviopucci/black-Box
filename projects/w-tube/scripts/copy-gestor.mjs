import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'gestor', 'dist')
const target = join(root, 'out', 'gestor')

if (!existsSync(source)) {
  console.error('gestor/dist não encontrado — rode build:gestor primeiro')
  process.exit(1)
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
cpSync(source, target, { recursive: true })
console.log('out/gestor atualizado')
