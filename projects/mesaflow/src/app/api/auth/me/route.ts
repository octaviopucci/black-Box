import { publicUser, validateSession } from "@/lib/store";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const auth = validateSession(token);
  if (!auth) return Response.json({ error: "Sessão inválida." }, { status: 401 });
  return Response.json({
    user: publicUser(auth.user),
    establishment: auth.establishment,
  });
}
