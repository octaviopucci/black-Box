import type { PrismaClient } from '@prisma/client'
import {
  ALL_PERMISSION_DEFINITIONS,
  GESTOR_PERMISSION_KEYS,
  PARCEIRO_PERMISSION_KEYS,
  type PermissionKey,
} from '@/lib/authorization/permissions'
import { DEFAULT_ROLES, ROLE_SLUGS } from '@/lib/authorization/roles'

type DbClient = Pick<PrismaClient, 'permission' | 'role' | 'rolePermission' | 'membershipRole'>

export async function seedPermissions(db: DbClient): Promise<Map<PermissionKey, string>> {
  const map = new Map<PermissionKey, string>()

  for (const def of ALL_PERMISSION_DEFINITIONS) {
    const permission = await db.permission.upsert({
      where: { key: def.key },
      create: { key: def.key, name: def.name, description: def.description },
      update: { name: def.name, description: def.description },
    })
    map.set(def.key, permission.id)
  }

  return map
}

export async function seedRolesForOrganization(
  db: DbClient,
  organizationId: string,
): Promise<Map<string, string>> {
  const roleMap = new Map<string, string>()

  for (const def of DEFAULT_ROLES) {
    const role = await db.role.upsert({
      where: {
        organizationId_slug: { organizationId, slug: def.slug },
      },
      create: {
        organizationId,
        slug: def.slug,
        name: def.name,
        description: def.description,
        status: 'ACTIVE',
      },
      update: {
        name: def.name,
        description: def.description,
      },
    })
    roleMap.set(def.slug, role.id)
  }

  return roleMap
}

async function assignPermissionsToRole(
  db: DbClient,
  roleId: string,
  permissionIds: string[],
): Promise<void> {
  for (const permissionId of permissionIds) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId, permissionId },
      },
      create: { roleId, permissionId },
      update: {},
    })
  }
}

function requireRoleId(roleMap: Map<string, string>, slug: string): string {
  const roleId = roleMap.get(slug)
  if (!roleId) {
    throw new Error(`Missing role "${slug}" for organization RBAC seed`)
  }
  return roleId
}

export async function seedRolePermissionsForOrganization(
  db: DbClient,
  organizationId: string,
  permissionMap: Map<PermissionKey, string>,
  roleMap?: Map<string, string>,
): Promise<void> {
  const roles = roleMap ?? (await seedRolesForOrganization(db, organizationId))

  const allPermissionIds = [...permissionMap.values()]
  await assignPermissionsToRole(db, requireRoleId(roles, ROLE_SLUGS.ADMIN), allPermissionIds)

  const gestorIds = GESTOR_PERMISSION_KEYS.map((k) => permissionMap.get(k)!)
  await assignPermissionsToRole(db, requireRoleId(roles, ROLE_SLUGS.GESTOR), gestorIds)

  const parceiroIds = PARCEIRO_PERMISSION_KEYS.map((k) => permissionMap.get(k)!)
  await assignPermissionsToRole(db, requireRoleId(roles, ROLE_SLUGS.PARCEIRO), parceiroIds)
}

export async function assignRoleToMembership(
  db: DbClient,
  membershipId: string,
  roleId: string,
): Promise<void> {
  await db.membershipRole.upsert({
    where: {
      membershipId_roleId: { membershipId, roleId },
    },
    create: { membershipId, roleId },
    update: {},
  })
}

export async function seedRbacForOrganization(
  db: DbClient,
  organizationId: string,
  bootstrapMembershipId?: string,
): Promise<void> {
  const permissionMap = await seedPermissions(db)
  const roleMap = await seedRolesForOrganization(db, organizationId)
  await seedRolePermissionsForOrganization(db, organizationId, permissionMap, roleMap)

  if (bootstrapMembershipId) {
    const roles = await db.role.findMany({
      where: { organizationId, slug: ROLE_SLUGS.ADMIN },
    })
    if (roles[0]) {
      await assignRoleToMembership(db, bootstrapMembershipId, roles[0].id)
    }
  }
}
