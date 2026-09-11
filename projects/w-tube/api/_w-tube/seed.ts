import type { OrgDatabase } from './types'
import type { JsonStore } from './store'
import { hashPassword, issueToken } from './store'
import seedData from './seed-data.json'

export const STORE_SLUG = 'w-tube'
export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = 'wtubeadmin123'
export const ORG_ID = 'org_w_tube'
export const USER_ID = 'user_admin'

export function getSeedDatabase(): OrgDatabase {
  return JSON.parse(JSON.stringify(seedData)) as OrgDatabase
}

/** Garante a loja única W-Tube com catálogo e estoque iniciais. */
export async function ensureIphoneImportsStore(
  store: JsonStore,
  options?: { force?: boolean },
): Promise<{ created: boolean; products: number; inventory: number }> {
  const existing = store.findOrgBySlug(STORE_SLUG)
  const rec = existing ? store.data().databases[existing.id] : null
  const db = rec?.data as OrgDatabase | undefined

  // Só faz seed inicial quando a organização/DB ainda não existe.
  // Não re-seed por catálogo vazio — isso apagaria alterações do gestor.
  const needsSeed = options?.force || !existing || !rec || !db

  if (!needsSeed) {
    return {
      created: false,
      products: db!.products.length,
      inventory: db!.inventory.filter((u) => u.status === 'available').length,
    }
  }

  const seed = getSeedDatabase()
  const now = new Date().toISOString()

  const org = {
    id: ORG_ID,
    name: 'W-Tube',
    slug: STORE_SLUG,
    createdAt: existing?.createdAt || now,
  }

  store.data().organizations[ORG_ID] = org

  store.data().users[USER_ID] = {
    id: USER_ID,
    organizationId: ORG_ID,
    username: ADMIN_USERNAME,
    passwordHash: hashPassword(ADMIN_PASSWORD),
    nome: 'Administrador',
    role: 'admin',
    active: true,
  }

  store.data().databases[ORG_ID] = {
    version: (rec?.version || 0) + 1,
    updatedAt: now,
    data: seed,
  }

  store.markDirty()
  await store.persist()

  return {
    created: true,
    products: seed.products.length,
    inventory: seed.inventory.length,
  }
}

export function issueAdminToken(store: JsonStore): string {
  const token = issueToken()
  store.data().tokens[token] = {
    organizationId: ORG_ID,
    userId: USER_ID,
    createdAt: new Date().toISOString(),
  }
  store.markDirty()
  return token
}
