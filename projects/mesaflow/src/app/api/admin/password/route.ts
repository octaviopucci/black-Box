import { changeUserPassword } from "@/lib/store";
import { mutationResponse, readJson, requireAdmin } from "../_shared";

export async function PATCH(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });

  const body = (await readJson(req)) as {
    currentPassword?: string;
    newPassword?: string;
  };
  const result = changeUserPassword(
    auth.user.id,
    auth.establishment.id,
    String(body.currentPassword ?? ""),
    String(body.newPassword ?? ""),
  );
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status ?? 400 });
  }
  return Response.json(result.value);
}
