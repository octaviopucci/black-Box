import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const source = join(root, 'projects', 'dra-laila-correa', 'out')
const target = join(root, 'public', 'dra-laila-correa')

if (!existsSync(source)) {
  throw new Error('projects/dra-laila-correa/out não encontrado — rode build:dra-laila-correa')
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
cpSync(source, target, { recursive: true })

console.log('public/dra-laila-correa atualizado')
