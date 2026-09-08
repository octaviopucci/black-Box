/**
 * Central permission catalog — Mission 03.
 * Future missions add keys here; authorization engine stays unchanged.
 */
export const PERMISSIONS = {
  // Organization
  ORGANIZATION_READ: 'organization.read',
  ORGANIZATION_UPDATE: 'organization.update',

  // Users (internal)
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',

  // Authorization / RBAC management
  AUTHORIZATION_ROLE_READ: 'authorization.role.read',
  AUTHORIZATION_ROLE_CREATE: 'authorization.role.create',
  AUTHORIZATION_ROLE_UPDATE: 'authorization.role.update',
  AUTHORIZATION_ROLE_ASSIGN_PERMISSION: 'authorization.role.assign_permission',
  AUTHORIZATION_MEMBERSHIP_ASSIGN_ROLE: 'authorization.membership.assign_role',
  AUTHORIZATION_MEMBERSHIP_REMOVE_ROLE: 'authorization.membership.remove_role',

  // Commercial (future modules — gates ready)
  PARTNER_READ: 'partner.read',
  PARTNER_CREATE: 'partner.create',
  PARTNER_UPDATE: 'partner.update',
  PARTNER_ACTIVATE: 'partner.activate',
  PRODUCT_READ: 'product.read',
  PRODUCT_CREATE: 'product.create',
  PRODUCT_UPDATE: 'product.update',
  OFFER_READ: 'offer.read',
  OFFER_CREATE: 'offer.create',
  OFFER_UPDATE: 'offer.update',
  LEAD_READ: 'lead.read',
  LEAD_CREATE: 'lead.create',
  OPPORTUNITY_READ: 'opportunity.read',
  OPPORTUNITY_CREATE: 'opportunity.create',
  SALE_READ: 'sale.read',
  SALE_CREATE: 'sale.create',
  COMMISSION_READ: 'commission.read',
  PROJECT_READ: 'project.read',
} as const

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ALL_PERMISSION_DEFINITIONS: Array<{
  key: PermissionKey
  name: string
  description: string
}> = [
  { key: PERMISSIONS.ORGANIZATION_READ, name: 'Read organization', description: 'View organization details' },
  { key: PERMISSIONS.ORGANIZATION_UPDATE, name: 'Update organization', description: 'Modify organization settings' },
  { key: PERMISSIONS.USER_READ, name: 'Read users', description: 'View users in organization' },
  { key: PERMISSIONS.USER_UPDATE, name: 'Update users', description: 'Modify users in organization' },
  { key: PERMISSIONS.AUTHORIZATION_ROLE_READ, name: 'Read roles', description: 'View roles and permissions' },
  { key: PERMISSIONS.AUTHORIZATION_ROLE_CREATE, name: 'Create roles', description: 'Create new roles' },
  { key: PERMISSIONS.AUTHORIZATION_ROLE_UPDATE, name: 'Update roles', description: 'Modify roles' },
  { key: PERMISSIONS.AUTHORIZATION_ROLE_ASSIGN_PERMISSION, name: 'Assign role permissions', description: 'Manage role-permission mappings' },
  { key: PERMISSIONS.AUTHORIZATION_MEMBERSHIP_ASSIGN_ROLE, name: 'Assign membership roles', description: 'Assign roles to memberships' },
  { key: PERMISSIONS.AUTHORIZATION_MEMBERSHIP_REMOVE_ROLE, name: 'Remove membership roles', description: 'Remove roles from memberships' },
  { key: PERMISSIONS.PARTNER_READ, name: 'Read partners', description: 'View partner data' },
  { key: PERMISSIONS.PARTNER_CREATE, name: 'Create partners', description: 'Create partners' },
  { key: PERMISSIONS.PARTNER_UPDATE, name: 'Update partners', description: 'Modify partner data' },
  { key: PERMISSIONS.PARTNER_ACTIVATE, name: 'Activate partners', description: 'Activate or deactivate partners' },
  { key: PERMISSIONS.PRODUCT_READ, name: 'Read products', description: 'View product catalog' },
  { key: PERMISSIONS.PRODUCT_CREATE, name: 'Create products', description: 'Create products' },
  { key: PERMISSIONS.PRODUCT_UPDATE, name: 'Update products', description: 'Modify products' },
  { key: PERMISSIONS.OFFER_READ, name: 'Read offers', description: 'View commercial offers' },
  { key: PERMISSIONS.OFFER_CREATE, name: 'Create offers', description: 'Create offers' },
  { key: PERMISSIONS.OFFER_UPDATE, name: 'Update offers', description: 'Modify offers' },
  { key: PERMISSIONS.LEAD_READ, name: 'Read leads', description: 'View leads' },
  { key: PERMISSIONS.LEAD_CREATE, name: 'Create leads', description: 'Create leads' },
  { key: PERMISSIONS.OPPORTUNITY_READ, name: 'Read opportunities', description: 'View opportunities' },
  { key: PERMISSIONS.OPPORTUNITY_CREATE, name: 'Create opportunities', description: 'Create opportunities' },
  { key: PERMISSIONS.SALE_READ, name: 'Read sales', description: 'View sales' },
  { key: PERMISSIONS.SALE_CREATE, name: 'Create sales', description: 'Create sales' },
  { key: PERMISSIONS.COMMISSION_READ, name: 'Read commissions', description: 'View commissions' },
  { key: PERMISSIONS.PROJECT_READ, name: 'Read projects', description: 'View projects' },
]

/** Permissions granted to GESTOR (explicit, not all) */
export const GESTOR_PERMISSION_KEYS: PermissionKey[] = [
  PERMISSIONS.ORGANIZATION_READ,
  PERMISSIONS.USER_READ,
  PERMISSIONS.USER_UPDATE,
  PERMISSIONS.PARTNER_READ,
  PERMISSIONS.PARTNER_CREATE,
  PERMISSIONS.PARTNER_UPDATE,
  PERMISSIONS.PARTNER_ACTIVATE,
  PERMISSIONS.PRODUCT_READ,
  PERMISSIONS.PRODUCT_CREATE,
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.OFFER_READ,
  PERMISSIONS.OFFER_CREATE,
  PERMISSIONS.OFFER_UPDATE,
  PERMISSIONS.LEAD_READ,
  PERMISSIONS.LEAD_CREATE,
  PERMISSIONS.OPPORTUNITY_READ,
  PERMISSIONS.OPPORTUNITY_CREATE,
  PERMISSIONS.SALE_READ,
  PERMISSIONS.SALE_CREATE,
  PERMISSIONS.COMMISSION_READ,
  PERMISSIONS.PROJECT_READ,
]

/** Permissions granted to PARCEIRO (commercial only) */
export const PARCEIRO_PERMISSION_KEYS: PermissionKey[] = [
  PERMISSIONS.PRODUCT_READ,
  PERMISSIONS.OFFER_READ,
  PERMISSIONS.LEAD_READ,
  PERMISSIONS.LEAD_CREATE,
  PERMISSIONS.OPPORTUNITY_READ,
  PERMISSIONS.OPPORTUNITY_CREATE,
  PERMISSIONS.SALE_READ,
  PERMISSIONS.SALE_CREATE,
  PERMISSIONS.COMMISSION_READ,
  PERMISSIONS.PROJECT_READ,
]

/** Roles that PARCEIRO cannot assign (privilege escalation guard) */
export const PRIVILEGED_ROLE_SLUGS = ['admin', 'gestor'] as const
