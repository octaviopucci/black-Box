import { publicParticipation, verifyOtpChallenge } from "@/lib/guest";
import { jsonWithClientCookie } from "../../_shared";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as {
    challengeId?: string;
    code?: string;
    displayName?: string;
  };
  const result = verifyOtpChallenge({
    challengeId: String(body.challengeId || ""),
    code: String(body.code || ""),
    displayName: body.displayName,
  });
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return jsonWithClientCookie(
    { participation: publicParticipation(result.participation) },
    result.token,
  );
}
