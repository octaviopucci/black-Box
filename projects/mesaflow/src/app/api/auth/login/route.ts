import { loginUser, publicUser } from "@/lib/store";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const result = loginUser(String(email), String(password));
  if (result.error) return Response.json({ error: result.error }, { status: 401 });
  return Response.json({
    token: result.session!.token,
    user: publicUser(result.user!),
    establishment: result.establishment,
  });
}
