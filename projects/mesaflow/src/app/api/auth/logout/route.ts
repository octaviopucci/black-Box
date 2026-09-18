import { jsonClearAdminSession } from "@/lib/staff-auth-request";

export async function POST() {
  return jsonClearAdminSession({ ok: true });
}
