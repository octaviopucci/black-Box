import { entitlementSummary } from "@/lib/platform-entitlements";
import { readAdminSessionToken } from "@/lib/staff-auth-request";
import { getStore, publicEstablishment, publicUser, validateSession } from "@/lib/store";
import { publicWaiterPermissions } from "@/lib/waiter-permissions";
import { publicWaiterUser } from "@/lib/waiter-store";

export async function GET(req: Request) {
  const auth = validateSession(readAdminSessionToken(req));
  if (!auth) return Response.json({ error: "Sessão inválida." }, { status: 401 });
  const store = getStore();
  const user =
    auth.user.role === "WAITER"
      ? publicWaiterUser(auth.user)
      : { ...publicUser(auth.user), permissions: publicWaiterPermissions(auth.user) };
  return Response.json({
    user,
    establishment: publicEstablishment(auth.establishment),
    entitlements: entitlementSummary(auth.establishment, store),
  });
}
