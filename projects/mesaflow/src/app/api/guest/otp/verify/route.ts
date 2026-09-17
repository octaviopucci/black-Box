import { publicParticipation, verifyOtpChallenge } from "@/lib/guest";
import { jsonWithClientCookie } from "../../_shared";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as {
    challengeId?: string;
    code?: string;
    displayName?: string;
    slug?: string;
    tableToken?: string;
    phone?: string;
    comandaNumber?: string;
  };
  const result = verifyOtpChallenge({
    challengeId: String(body.challengeId || ""),
    code: String(body.code || ""),
    displayName: body.displayName,
    slug: body.slug,
    tableToken: body.tableToken,
    phoneRaw: body.phone,
    comandaNumber: body.comandaNumber,
  });
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return jsonWithClientCookie(
    {
      token: result.token,
      participation: publicParticipation(result.participation),
    },
    result.token,
  );
}
