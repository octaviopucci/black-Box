/**
 * Build MesaFlow para o deploy host (loja-iphoneimports).
 * Site estático em out/mesaflow/ + API em api/mesaflow.js
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(hostRoot, "..", "..");
const mesaflowRoot = join(repoRoot, "projects", "mesaflow");
const basePath = "/mesaflow";

const apiDir = join(mesaflowRoot, "src/app/api");
const legacyBackup = join(mesaflowRoot, "src/app/_api_backup");
const apiStash = join(mesaflowRoot, ".mesaflow-api-stash");

function run(cmd, opts = {}) {
  try {
    execSync(cmd, { stdio: "inherit", ...opts });
  } catch (error) {
    console.error(`\n✗ comando falhou: ${cmd}`);
    if (error instanceof Error && "status" in error) {
      process.exit(error.status ?? 1);
    }
    process.exit(1);
  }
}

function stashApiRoutes() {
  // Limpa resíduos de builds anteriores (cache Vercel / falha no finally).
  rmSync(legacyBackup, { recursive: true, force: true });
  rmSync(apiStash, { recursive: true, force: true });

  if (!existsSync(apiDir)) {
    if (existsSync(legacyBackup)) {
      renameSync(legacyBackup, apiDir);
      console.log("→ mesaflow: API restaurada de _api_backup legado");
    } else {
      console.warn("→ mesaflow: src/app/api ausente — seguindo sem stash");
      return false;
    }
  }

  mkdirSync(dirname(apiStash), { recursive: true });
  renameSync(apiDir, apiStash);
  console.log("→ mesaflow: API routes desabilitadas para export estático");
  return true;
}

function restoreApiRoutes(stashed) {
  if (!stashed) return;
  rmSync(apiDir, { recursive: true, force: true });
  rmSync(legacyBackup, { recursive: true, force: true });
  if (existsSync(apiStash)) {
    renameSync(apiStash, apiDir);
  }
}

/** Next export: `route.html` + pasta `route/` sem index — cleanUrls 404 sem rewrite. */
function ensureCleanUrlIndexes(deployRoot, routes) {
  for (const route of routes) {
    const htmlPath = join(deployRoot, `${route}.html`);
    if (!existsSync(htmlPath)) {
      console.error(`✗ cleanUrl: out/mesaflow/${route}.html ausente`);
      process.exit(1);
    }
    const indexPath = join(deployRoot, route, "index.html");
    mkdirSync(join(deployRoot, route), { recursive: true });
    cpSync(htmlPath, indexPath);
  }
}

function assertHandlerCriticalRoutes(handlerBundlePath) {
  const bundle = readFileSync(handlerBundlePath, "utf8");
  const required = [
    "/platform/auth/login",
    "/platform/auth/me",
    "/platform/dashboard",
    "/platform/merchants",
    "/admin/orders",
    "/admin/password",
    "/orders",
  ];
  for (const route of required) {
    if (!bundle.includes(route)) {
      console.error(`✗ api/mesaflow.js sem rota ${route}`);
      process.exit(1);
    }
  }
}

console.log("\n→ mesaflow: install + build site...");
run("npm ci --include=dev", { cwd: mesaflowRoot });

const stashed = stashApiRoutes();

try {
  run("npm run build", {
    cwd: mesaflowRoot,
    env: {
      ...process.env,
      MESAFLOW_STATIC_EXPORT: "1",
      NEXT_BASE_PATH: basePath,
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_PUBLIC_API_PREFIX: "mesaflow",
    },
  });
} finally {
  restoreApiRoutes(stashed);
}

const siteOut = join(mesaflowRoot, "out");
const deployTarget = join(hostRoot, "out", "mesaflow");
if (!existsSync(join(siteOut, "index.html"))) {
  console.error("✗ projects/mesaflow/out/index.html ausente");
  process.exit(1);
}

rmSync(deployTarget, { recursive: true, force: true });
mkdirSync(deployTarget, { recursive: true });
cpSync(siteOut, deployTarget, { recursive: true });
console.log("→ mesaflow: copiado para out/mesaflow/");

const requiredStaticPages = [
  "index.html",
  "admin/login.html",
  "admin/orders.html",
  "platform/login.html",
  "platform.html",
  "platform/merchants.html",
  "platform/merchants/detail.html",
  "privacidade.html",
];
for (const page of requiredStaticPages) {
  const file = join(deployTarget, page);
  if (!existsSync(file)) {
    console.error(`✗ artefato estático ausente: out/mesaflow/${page}`);
    process.exit(1);
  }
}
console.log("→ mesaflow: rotas estáticas críticas verificadas (admin + platform)");

ensureCleanUrlIndexes(deployTarget, [
  "admin/login",
  "admin/signup",
  "admin/orders",
  "platform",
  "platform/login",
  "platform/merchants",
  "platform/merchants/detail",
  "privacidade",
]);
console.log("→ mesaflow: index.html cleanUrl gerados (admin + platform)");

console.log("→ mesaflow: bundle API...");
const handlerOut = join(hostRoot, "api/mesaflow.js");
await esbuild.build({
  entryPoints: [join(hostRoot, "api/_mesaflow/handler.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: handlerOut,
  format: "cjs",
  sourcemap: true,
  external: ["@vercel/blob", "@vercel/node"],
  loader: { ".json": "json" },
});
assertHandlerCriticalRoutes(handlerOut);
console.log("→ mesaflow: rotas críticas verificadas no handler (admin + platform)");
console.log("✓ mesaflow pronto");
