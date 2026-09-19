import { validatePlatformSession } from "./platform-store";
import { isMarceloLikeEstablishment } from "./seed-marcelo-lanches";
import { readAdminSessionToken, readPlatformSessionToken } from "./staff-auth-request";
import { validateActiveSession } from "./store";

export type CatalogImportAuth =
  | { kind: "admin"; establishmentId: string }
  | { kind: "platform" }
  | { kind: "secret" };

export function catalogImportSecretAuthorized(req: Request): boolean {
  const secret = process.env.MESAFLOW_CATALOG_IMPORT_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("x-mesaflow-import-secret") === secret;
}

function requireAdmin(req: Request) {
  const auth = validateActiveSession(readAdminSessionToken(req));
  return auth && (auth.user.role === "OWNER" || auth.user.role === "MANAGER") ? auth : null;
}

function requirePlatformOwner(req: Request) {
  return validatePlatformSession(readPlatformSessionToken(req));
}

export function resolveCatalogImportAuth(req: Request): CatalogImportAuth | null {
  const admin = requireAdmin(req);
  if (admin) {
    if (!isMarceloLikeEstablishment(admin.establishment)) return null;
    return { kind: "admin", establishmentId: admin.establishment.id };
  }
  if (requirePlatformOwner(req)) return { kind: "platform" };
  if (catalogImportSecretAuthorized(req)) return { kind: "secret" };
  return null;
}

export function resolveCatalogImportEstablishmentId(
  auth: CatalogImportAuth,
  body: { establishmentId?: string },
): string | undefined {
  if (auth.kind === "admin") {
    if (body.establishmentId && body.establishmentId !== auth.establishmentId) {
      return undefined;
    }
    return auth.establishmentId;
  }
  return body.establishmentId;
}
