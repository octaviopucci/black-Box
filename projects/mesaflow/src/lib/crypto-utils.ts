import { createHash, randomBytes } from "crypto";

export function hashPassword(password: string) {
  return createHash("sha256").update(`mesaflow:${password}`).digest("hex");
}

export function id(prefix = "") {
  return `${prefix}${randomBytes(8).toString("hex")}`;
}

export function sessionToken() {
  return randomBytes(32).toString("hex");
}
