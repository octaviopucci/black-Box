import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "crypto";

const DEV_FALLBACK_SECRET = "mesaflow-dev-only-change-in-production";

function secret(name: string): string {
  return process.env[name] || process.env.MESAFLOW_IDENTITY_SECRET || DEV_FALLBACK_SECRET;
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function phoneLookupHash(establishmentId: string, phoneE164: string): string {
  return createHmac("sha256", secret("MESAFLOW_PHONE_LOOKUP_SECRET"))
    .update(`${establishmentId}:${phoneE164}`)
    .digest("hex");
}

export function encryptPhone(phoneE164: string): string {
  const key = createHash("sha256").update(secret("MESAFLOW_PHONE_CIPHER_SECRET")).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(phoneE164, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptPhone(ciphertext: string): string | null {
  try {
    const [ivB64, tagB64, dataB64] = ciphertext.split(".");
    if (!ivB64 || !tagB64 || !dataB64) return null;
    const key = createHash("sha256").update(secret("MESAFLOW_PHONE_CIPHER_SECRET")).digest();
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64url"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64url")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}

export function maskPhoneDisplay(phoneE164: string): string {
  const digits = phoneE164.replace(/\D/g, "");
  if (digits.length < 4) return "+** ****";
  const tail = digits.slice(-4);
  if (phoneE164.startsWith("+55") && digits.length >= 12) {
    return `+55 ** *****-${tail}`;
  }
  return `+** ***${tail}`;
}

export function normalizePhoneE164(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("55") && digits.length >= 12) return `+${digits}`;
  if (digits.length >= 10 && digits.length <= 11) return `+55${digits}`;
  if (input.startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

export function otpCodeHash(challengeId: string, code: string): string {
  return createHmac("sha256", secret("MESAFLOW_OTP_SECRET"))
    .update(`${challengeId}:${code}`)
    .digest("hex");
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateClientSessionToken(): string {
  return randomBytes(32).toString("base64url");
}
