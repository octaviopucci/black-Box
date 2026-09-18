import { PLAN_OPTIONS } from "@/lib/platform-plans";
import { signupRequiresInvite } from "@/lib/signup-invite";

export async function GET() {
  return Response.json({
    requiresInvite: signupRequiresInvite(),
    plans: PLAN_OPTIONS,
  });
}
