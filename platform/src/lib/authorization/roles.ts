export const ROLE_SLUGS = {
  ADMIN: 'admin',
  GESTOR: 'gestor',
  PARCEIRO: 'parceiro',
} as const

export type RoleSlug = (typeof ROLE_SLUGS)[keyof typeof ROLE_SLUGS]

export const DEFAULT_ROLES: Array<{
  slug: RoleSlug
  name: string
  description: string
}> = [
  { slug: ROLE_SLUGS.ADMIN, name: 'Admin', description: 'Full access within organization' },
  { slug: ROLE_SLUGS.GESTOR, name: 'Gestor', description: 'Internal operational access' },
  { slug: ROLE_SLUGS.PARCEIRO, name: 'Parceiro', description: 'External commercial partner access' },
]
