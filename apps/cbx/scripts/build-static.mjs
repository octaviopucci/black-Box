import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Builds a static export for Black Box (/cbx/) by temporarily moving API routes
 * and auth config outside `src/` (TypeScript still typechecks renamed folders
 * under `src/`, which breaks the static build).
 */
const root = process.cwd()
const hideRoot = join(root, '.cbx-static-hide')
const apiDir = join(root, 'src', 'app', 'api')
const apiHidden = join(hideRoot, 'api')
const authFile = join(root, 'src', 'auth.ts')
const authHidden = join(hideRoot, 'auth.ts')

let movedApi = false
let movedAuth = false

try {
  mkdirSync(hideRoot, { recursive: true })

  if (existsSync(apiDir)) {
    if (existsSync(apiHidden)) rmSync(apiHidden, { recursive: true, force: true })
    renameSync(apiDir, apiHidden)
    movedApi = true
  }
  if (existsSync(authFile)) {
    if (existsSync(authHidden)) rmSync(authHidden, { force: true })
    renameSync(authFile, authHidden)
    movedAuth = true
  }

  execSync('next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      CBX_STATIC: '1',
      NEXT_BASE_PATH: process.env.NEXT_BASE_PATH || '/cbx',
      NEXT_PUBLIC_USE_API: '0',
    },
  })
} finally {
  if (movedApi && existsSync(apiHidden)) {
    if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true })
    renameSync(apiHidden, apiDir)
  }
  if (movedAuth && existsSync(authHidden)) {
    if (existsSync(authFile)) rmSync(authFile, { force: true })
    renameSync(authHidden, authFile)
  }
  try {
    rmSync(hideRoot, { recursive: true, force: true })
  } catch {
    // ignore cleanup errors
  }
}
