import { parseBase64UploadBody, uploadProductImage } from "@/lib/media-upload";
import { readJson, requireAdmin } from "../../_shared";

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";
  let file: { bytes: Buffer | Uint8Array; contentType: string; filename: string } | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const entry = form.get("file");
    if (!(entry instanceof File)) {
      return Response.json({ error: "Campo file é obrigatório." }, { status: 400 });
    }
    const buffer = Buffer.from(await entry.arrayBuffer());
    file = {
      bytes: buffer,
      contentType: entry.type || "application/octet-stream",
      filename: entry.name || "upload.bin",
    };
  } else {
    const parsed = parseBase64UploadBody(await readJson(req));
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }
    file = parsed;
  }

  const result = await uploadProductImage(auth.establishment.id, file);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json(result, { status: 201 });
}
