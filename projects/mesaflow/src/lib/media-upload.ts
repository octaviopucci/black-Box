import { put } from "@vercel/blob";
import { blobAuthOptions, blobConfigured } from "./blob-persistence";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type UploadProductImageInput = {
  bytes: Buffer | Uint8Array;
  contentType: string;
  filename: string;
};

export type UploadProductImageResult =
  | { url: string }
  | { error: string; status: number };

function safeFilename(filename: string) {
  const base = filename.split(/[/\\]/).pop() || "image";
  return base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "image";
}

export function isMediaUploadConfigured(runtimeOidcToken?: string) {
  return blobConfigured(runtimeOidcToken);
}

export async function uploadProductImage(
  establishmentId: string,
  file: UploadProductImageInput,
  runtimeOidcToken?: string,
): Promise<UploadProductImageResult> {
  if (!establishmentId.trim()) {
    return { error: "Estabelecimento inválido.", status: 400 };
  }
  const contentType = String(file.contentType || "").toLowerCase().split(";")[0].trim();
  if (!ALLOWED_TYPES.has(contentType)) {
    return { error: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.", status: 400 };
  }
  const bytes = file.bytes instanceof Buffer ? file.bytes : Buffer.from(file.bytes);
  if (!bytes.length) return { error: "Arquivo vazio.", status: 400 };
  if (bytes.length > MAX_BYTES) {
    return { error: "Arquivo excede o limite de 4MB.", status: 400 };
  }
  if (!blobConfigured(runtimeOidcToken)) {
    return { error: "Armazenamento de mídia não configurado.", status: 503 };
  }

  const pathname = `mesaflow/media/${establishmentId}/${Date.now()}-${safeFilename(file.filename)}`;
  try {
    const result = await put(pathname, bytes, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      ...blobAuthOptions(runtimeOidcToken),
    });
    return { url: result.url };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Falha no upload.",
      status: 502,
    };
  }
}

export function parseBase64UploadBody(body: unknown): UploadProductImageInput | { error: string } {
  if (!body || typeof body !== "object") return { error: "Corpo inválido." };
  const payload = body as {
    filename?: unknown;
    contentType?: unknown;
    dataBase64?: unknown;
  };
  if (typeof payload.filename !== "string" || !payload.filename.trim()) {
    return { error: "filename é obrigatório." };
  }
  if (typeof payload.contentType !== "string" || !payload.contentType.trim()) {
    return { error: "contentType é obrigatório." };
  }
  if (typeof payload.dataBase64 !== "string" || !payload.dataBase64.trim()) {
    return { error: "dataBase64 é obrigatório." };
  }
  try {
    const bytes = Buffer.from(payload.dataBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
    return {
      filename: payload.filename.trim(),
      contentType: payload.contentType.trim(),
      bytes,
    };
  } catch {
    return { error: "dataBase64 inválido." };
  }
}
