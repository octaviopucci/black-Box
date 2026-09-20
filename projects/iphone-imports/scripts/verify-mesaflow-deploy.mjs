/**
 * Garante que o build MesaFlow tem assets e rotas necessários para o deploy Vercel.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const mesaflowOut = join(hostRoot, "out", "mesaflow");
const outRoot = join(hostRoot, "out");

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
  "/admin/dashboard",
  "/admin/menu",
  "/admin/orders",
  "/admin/password",
];

const requiredHandlerSnippets = [
  "getAdminDashboardPayload",
  "analyticsWeek",
  "import-catalog",
];

const requiredRootLanding = ["index.html", "favicon.ico", "apple-icon.png"];
const requiredIphoneStore = ["iphone-imports/index.html", "iphone-imports/gestor/index.html"];

let failed = false;

for (const rel of requiredRootLanding) {
  const path = join(outRoot, rel);
  if (!existsSync(path)) {
    console.error(`✗ ausente na raiz: out/${rel}`);
    failed = true;
  }
}

for (const rel of requiredIphoneStore) {
  const path = join(outRoot, rel);
  if (!existsSync(path)) {
    console.error(`✗ ausente: out/${rel}`);
    failed = true;
  }
}

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

const requiredHandlerPatches = [
  "allowUnconditionalOverwrite",
  "mergeOperationalBlobOnConflict",
  "requireOperationalPersist",
];

const handlerBundle = readFileSync(join(hostRoot, "api/mesaflow.js"), "utf8");
for (const route of requiredHandlerRoutes) {
  if (!handlerBundle.includes(route)) {
    console.error(`✗ api/mesaflow.js sem rota ${route}`);
    failed = true;
  }
}
for (const patch of requiredHandlerPatches) {
  if (!handlerBundle.includes(patch)) {
    console.error(`✗ api/mesaflow.js sem patch ${patch} (rebuild necessário)`);
    failed = true;
  }
}
for (const snippet of requiredHandlerSnippets) {
  if (!handlerBundle.includes(snippet)) {
    console.error(`✗ api/mesaflow.js sem ${snippet} (rebuild necessário)`);
    failed = true;
  }
}

const redirects = vercelJson.redirects ?? [];
const requiredRedirects = [
  { source: "/produto/:slug", destination: "/iphone-imports/produto/:slug" },
  { source: "/gestor", destination: "/iphone-imports/gestor" },
  { source: "/ofertas", destination: "/iphone-imports/ofertas" },
];
for (const { source, destination } of requiredRedirects) {
  const redirect = redirects.find((candidate) => candidate.source === source);
  if (!redirect || redirect.destination !== destination) {
    console.error(`✗ redirect ausente: ${source} → ${destination}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("✓ deploy artifacts OK (NA MESA root + mesaflow + iphone-imports + API)");
