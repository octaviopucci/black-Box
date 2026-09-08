import { prisma } from '@/lib/db'
import { forbiddenError, notFoundError, validationError, conflictError } from '@/lib/errors'
import { slugifyOrganizationName } from '@/modules/organization/domain/slug'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { ROLE_SLUGS } from '@/lib/authorization/roles'

function assertRoleInTenant(role: { organizationId: string }, ctx: AuthorizationContext) {
  if (role.organizationId !== ctx.organization.id) {
    throw notFoundError()
  }
}

function assertMembershipInTenant(
  membership: { organizationId: string } | null,
  ctx: AuthorizationContext,
) {
  if (!membership || membership.organizationId !== ctx.organization.id) {
    throw notFoundError()
  }
}

export async function listRoles(ctx: AuthorizationContext) {
  return prisma.role.findMany({
    where: { organizationId: ctx.organization.id },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function createRole(
  ctx: AuthorizationContext,
  input: { name: string; slug?: string; description?: string },
) {
  const slug = slugifyOrganizationName(input.slug ?? input.name)
  if (!slug) throw validationError('Invalid role slug')

  try {
    return await prisma.role.create({
      data: {
        organizationId: ctx.organization.id,
        name: input.name.trim(),
        slug,
        description: input.description?.trim(),
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
      },
    })
  } catch {
    throw conflictError('SLUG_ALREADY_EXISTS', 'Role slug already exists in this organization')
  }
}

export async function updateRole(
  ctx: AuthorizationContext,
  roleId: string,
  input: { name?: string; description?: string; status?: 'ACTIVE' | 'INACTIVE' },
) {
  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) throw notFoundError()
  assertRoleInTenant(role, ctx)

  return prisma.role.update({
    where: { id: roleId },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description.trim() } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
    },
  })
}

export async function assignPermissionToRole(
  ctx: AuthorizationContext,
  roleId: string,
  permissionKey: string,
) {
  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) throw notFoundError()
  assertRoleInTenant(role, ctx)

  const permission = await prisma.permission.findUnique({ where: { key: permissionKey } })
  if (!permission) throw notFoundError('Permission not found')

  try {
    await prisma.rolePermission.create({
      data: { roleId, permissionId: permission.id },
    })
  } catch {
    throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Permission already assigned to role')
  }

  return { roleId, permissionKey }
}

export async function removePermissionFromRole(
  ctx: AuthorizationContext,
  roleId: string,
  permissionId: string,
) {
  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) throw notFoundError()
  assertRoleInTenant(role, ctx)

  await prisma.rolePermission.deleteMany({
    where: { roleId, permissionId },
  })

  return { ok: true }
}

export async function assignRoleToMembership(
  ctx: AuthorizationContext,
  membershipId: string,
  roleId: string,
) {
  const membership = await prisma.organizationMembership.findUnique({ where: { id: membershipId } })
  assertMembershipInTenant(membership, ctx)

  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) throw notFoundError()
  assertRoleInTenant(role, ctx)

  // Only ADMIN members can assign privileged roles
  if (role.slug === ROLE_SLUGS.ADMIN || role.slug === ROLE_SLUGS.GESTOR) {
    const callerIsAdmin = ctx.roles.some((r) => r.slug === ROLE_SLUGS.ADMIN)
    if (!callerIsAdmin) {
      throw forbiddenError()
    }
  }

  try {
    await prisma.membershipRole.create({
      data: { membershipId, roleId },
    })
  } catch {
    throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Role already assigned to membership')
  }

  return { membershipId, roleId }
}

export async function removeRoleFromMembership(
  ctx: AuthorizationContext,
  membershipId: string,
  roleId: string,
) {
  const membership = await prisma.organizationMembership.findUnique({ where: { id: membershipId } })
  assertMembershipInTenant(membership, ctx)

  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) throw notFoundError()
  assertRoleInTenant(role, ctx)

  await prisma.membershipRole.deleteMany({
    where: { membershipId, roleId },
  })

  return { ok: true }
}

export async function getRoleById(ctx: AuthorizationContext, roleId: string) {
  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) throw notFoundError()
  assertRoleInTenant(role, ctx)
  return role
}
