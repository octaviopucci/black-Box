import { publicPlatformUser, validatePlatformSession } from "@/lib/platform-store";
import { readPlatformSessionToken } from "@/lib/staff-auth-request";

export async function GET(req: Request) {
  const auth = validatePlatformSession(readPlatformSessionToken(req));
  if (!auth) return Response.json({ error: "Sessão inválida." }, { status: 401 });
  return Response.json({ user: publicPlatformUser(auth.user), expiresAt: auth.expiresAt });
}
