export { PERMISSIONS, ALL_PERMISSION_DEFINITIONS, GESTOR_PERMISSION_KEYS, PARCEIRO_PERMISSION_KEYS } from './permissions'
export type { PermissionKey } from './permissions'
export { ROLE_SLUGS, DEFAULT_ROLES } from './roles'
export type { RoleSlug } from './roles'
export type { AuthorizationContext } from './types'
export { getAuthorizationContext, requireAuthorizationContext, clearAuthorizationCacheForTests } from './context'
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  hasRole,
  requireRole,
} from './gates'
export {
  resolvePartnerDataScope,
  buildOpportunityPartnerFilter,
  assertOpportunityInPartnerScope,
} from './partner-scope'
export type { PartnerDataScope } from './partner-scope'
