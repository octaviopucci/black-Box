import { findEstablishmentBySlug, findTableByQr } from "@/lib/store";
import { requestOtpChallenge } from "@/lib/guest";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as {
    slug?: string;
    tableToken?: string;
    phone?: string;
  };
  const est = findEstablishmentBySlug(String(body.slug || ""));
  if (!est) return Response.json({ error: "Estabelecimento não encontrado." }, { status: 404 });
  const tbl = findTableByQr(est.id, String(body.tableToken || ""));
  if (!tbl) return Response.json({ error: "Mesa inválida." }, { status: 404 });
  const result = requestOtpChallenge({
    establishment: est,
    table: tbl,
    phoneRaw: String(body.phone || ""),
    purpose: "JOIN",
  });
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({
    challengeId: result.challengeId,
    mockCode: result.mockCode,
    message: "Código enviado (mock em desenvolvimento).",
  });
}
