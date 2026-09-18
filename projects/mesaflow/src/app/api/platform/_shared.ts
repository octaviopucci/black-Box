import { validatePlatformSession } from "@/lib/platform-store";

export function requirePlatformOwner(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return validatePlatformSession(match?.[1]?.trim());
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
