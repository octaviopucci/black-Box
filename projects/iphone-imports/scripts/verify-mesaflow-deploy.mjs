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
  "admin/orders.html",
  "admin/settings.html",
  "platform.html",
  "platform/login.html",
  "platform/merchants.html",
  "platform/merchants/detail.html",
  "privacidade.html",
  "brand/logo-icon.png",
  "brand/logo-vertical.png",
  "favicon.ico",
  "apple-icon.png",
  "manifest.webmanifest",
];

/** cleanUrl exige index.html quando Next exporta pasta RSC sem index. */
const requiredCleanUrlIndexes = [
  "platform/index.html",
  "platform/login/index.html",
  "platform/merchants/index.html",
  "platform/merchants/detail/index.html",
  "privacidade/index.html",
];

const requiredPlatformRewrites = [
  "/mesaflow/platform/login",
  "/mesaflow/platform/merchants/detail",
  "/mesaflow/platform/merchants",
  "/mesaflow/platform",
  "/mesaflow/privacidade",
];

const requiredHandlerRoutes = [
  "/platform/auth/login",
  "/platform/auth/me",
  "/platform/dashboard",
  "/platform/merchants",
  "/admin/orders",
  "/admin/password",
];

let failed = false;

for (const rel of requiredFiles) {
  const path = join(mesaflowOut, rel);
  if (!existsSync(path)) {
    console.error(`✗ ausente: out/mesaflow/${rel}`);
    failed = true;
  }
}

for (const rel of requiredCleanUrlIndexes) {
  const path = join(mesaflowOut, rel);
  if (!existsSync(path)) {
    console.error(`✗ cleanUrl index ausente: out/mesaflow/${rel}`);
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

for (const route of [
  "/mesaflow/admin/products",
  "/mesaflow/admin/orders",
  "/mesaflow/admin/settings",
  ...requiredPlatformRewrites,
]) {
  const rewrite = (vercelJson.rewrites ?? []).find((candidate) => candidate.source === route);
  if (!rewrite || rewrite.destination !== route) {
    console.error(`✗ rewrite ausente ou inválido: ${route}`);
    failed = true;
  }
}

const handlerBundle = readFileSync(join(hostRoot, "api/mesaflow.js"), "utf8");
for (const route of requiredHandlerRoutes) {
  if (!handlerBundle.includes(route)) {
    console.error(`✗ api/mesaflow.js sem rota ${route}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("✓ mesaflow deploy artifacts OK (admin + platform static, rewrites, API)");
