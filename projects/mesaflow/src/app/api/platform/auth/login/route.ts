import { loginPlatformUser } from "@/lib/platform-store";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; password?: string };
  const result = loginPlatformUser(String(body.email ?? ""), String(body.password ?? ""));
  if ("error" in result) return Response.json({ error: result.error }, { status: 401 });
  return Response.json(result);
}
