import { readAdminSessionToken } from "@/lib/staff-auth-request";
import { publicEstablishment, publicUser, validateSession } from "@/lib/store";

export async function GET(req: Request) {
  const auth = validateSession(readAdminSessionToken(req));
  if (!auth) return Response.json({ error: "Sessão inválida." }, { status: 401 });
  return Response.json({
    user: publicUser(auth.user),
    establishment: publicEstablishment(auth.establishment),
  });
}
