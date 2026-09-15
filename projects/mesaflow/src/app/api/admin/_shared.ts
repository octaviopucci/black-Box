import { validateSession } from "@/lib/store";

export function requireAdmin(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const auth = validateSession(match?.[1]?.trim());
  return auth && (auth.user.role === "OWNER" || auth.user.role === "MANAGER")
    ? auth
    : null;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function mutationResponse<T>(
  result: { value: T } | { error: string; status: number },
  successStatus = 200,
) {
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json(result.value, { status: successStatus });
}
