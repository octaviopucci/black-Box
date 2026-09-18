import { validatePlatformSession } from "@/lib/platform-store";
import { readPlatformSessionToken } from "@/lib/staff-auth-request";

export function requirePlatformOwner(req: Request) {
  return validatePlatformSession(readPlatformSessionToken(req));
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
