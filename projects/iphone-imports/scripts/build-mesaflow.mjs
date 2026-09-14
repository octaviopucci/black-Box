/**
 * Build MesaFlow para o deploy host (loja-iphoneimports).
 * Site estático em out/mesaflow/ + API em api/mesaflow.js
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(hostRoot, "..", "..");
const mesaflowRoot = join(repoRoot, "projects", "mesaflow");
const basePath = "/mesaflow";

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: "inherit", ...opts });
}

const apiDir = join(mesaflowRoot, "src/app/api");
const apiBackup = join(mesaflowRoot, "src/app/_api_backup");

console.log("\n→ mesaflow: install + build site...");
run("npm ci --include=dev", { cwd: mesaflowRoot });

if (existsSync(apiDir)) {
  renameSync(apiDir, apiBackup);
  console.log("→ mesaflow: API routes desabilitadas para export estático");
}

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
  if (existsSync(apiBackup)) renameSync(apiBackup, apiDir);
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

console.log("→ mesaflow: bundle API...");
await esbuild.build({
  entryPoints: [join(hostRoot, "api/_mesaflow/handler.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: join(hostRoot, "api/mesaflow.js"),
  format: "cjs",
  sourcemap: true,
  loader: { ".json": "json" },
});
console.log("✓ mesaflow pronto");
