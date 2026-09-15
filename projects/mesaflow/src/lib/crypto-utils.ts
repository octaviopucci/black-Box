import { createHash, randomBytes } from "crypto";
import { compareSync, hashSync } from "bcryptjs";

export function hashPassword(password: string) {
  return hashSync(password, 12);
}

export function verifyPassword(password: string, passwordHash: string) {
  if (passwordHash.startsWith("$2")) return compareSync(password, passwordHash);
  const legacyHash = createHash("sha256").update(`mesaflow:${password}`).digest("hex");
  return passwordHash === legacyHash;
}

export function id(prefix = "") {
  return `${prefix}${randomBytes(8).toString("hex")}`;
}

export function sessionToken() {
  return randomBytes(32).toString("hex");
}
