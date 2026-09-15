/**
 * Garante que o build MesaFlow tem assets e rotas necessários para o deploy Vercel.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const mesaflowOut = join(hostRoot, "out", "mesaflow");

const requiredFiles = [
  "index.html",
  "m/live.html",
  "kds/live.html",
  "admin/login.html",
  "admin/signup.html",
  "admin/products.html",
  "admin/settings.html",
  "brand/logo-icon.png",
  "brand/logo-vertical.png",
  "favicon.ico",
  "apple-icon.png",
  "manifest.webmanifest",
];

let failed = false;
for (const rel of requiredFiles) {
  const path = join(mesaflowOut, rel);
  if (!existsSync(path)) {
    console.error(`✗ ausente: out/mesaflow/${rel}`);
    failed = true;
  }
}

const vercelJson = JSON.parse(readFileSync(join(hostRoot, "vercel.json"), "utf8"));
const badRewrites = (vercelJson.rewrites ?? []).filter(
  (r) =>
    typeof r.destination === "string" &&
    r.source.startsWith("/mesaflow") &&
    r.destination.endsWith(".html"),
);
if (badRewrites.length > 0) {
  console.error("✗ rewrites MesaFlow com .html (incompatível com cleanUrls):");
  for (const r of badRewrites) console.error(`  ${r.source} → ${r.destination}`);
  failed = true;
}

for (const route of ["/mesaflow/admin/products", "/mesaflow/admin/settings"]) {
  const rewrite = (vercelJson.rewrites ?? []).find((candidate) => candidate.source === route);
  if (!rewrite || rewrite.destination !== route) {
    console.error(`✗ rewrite ausente ou inválido: ${route}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("✓ mesaflow deploy artifacts OK");
