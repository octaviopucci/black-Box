import { publicPlatformUser, validatePlatformSession } from "@/lib/platform-store";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const auth = validatePlatformSession(token);
  if (!auth) return Response.json({ error: "Sessão inválida." }, { status: 401 });
  return Response.json({ user: publicPlatformUser(auth.user), expiresAt: auth.expiresAt });
}
