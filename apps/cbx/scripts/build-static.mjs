import { execSync } from 'node:child_process'
import { existsSync, renameSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Builds a static export for Black Box (/cbx/) by temporarily hiding API routes
 * (incompatible with `output: 'export'`).
 */
const root = process.cwd()
const apiDir = join(root, 'src', 'app', 'api')
const hiddenDir = join(root, 'src', 'app', '_api_hidden_for_static')
const authFile = join(root, 'src', 'auth.ts')
const authHidden = join(root, 'src', '_auth_hidden_for_static.ts')

let movedApi = false
let movedAuth = false

try {
  if (existsSync(apiDir)) {
    renameSync(apiDir, hiddenDir)
    movedApi = true
  }
  if (existsSync(authFile)) {
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
  if (movedApi && existsSync(hiddenDir)) renameSync(hiddenDir, apiDir)
  if (movedAuth && existsSync(authHidden)) renameSync(authHidden, authFile)
}
