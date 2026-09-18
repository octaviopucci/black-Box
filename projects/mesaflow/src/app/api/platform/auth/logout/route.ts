import { jsonClearPlatformSession } from "@/lib/staff-auth-request";

export async function POST() {
  return jsonClearPlatformSession({ ok: true });
}
