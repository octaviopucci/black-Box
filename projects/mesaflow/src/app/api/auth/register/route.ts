import { publicUser, registerEstablishment } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const result = registerEstablishment({
    businessName: String(body.businessName || ""),
    ownerName: String(body.ownerName || ""),
    email: String(body.email || ""),
    password: String(body.password || ""),
    businessType: body.businessType || "restaurante",
    tableCount: Number(body.tableCount) || 5,
  });
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  return Response.json(
    {
      token: result.session!.token,
      user: publicUser(result.user!),
      establishment: result.establishment,
    },
    { status: 201 },
  );
}
