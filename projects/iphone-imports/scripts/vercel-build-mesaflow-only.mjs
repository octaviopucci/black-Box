/**
 * Build Vercel enxuto — somente MesaFlow (NA MESA).
 * Não compila iphone-imports, w-tube, pucci-motors nem lojas irmãs.
 *
 * Uso: projeto Vercel NA MESA → Build Command = npm run vercel-build:mesaflow
 * Outros projetos (bedois, loja-iphoneimports) continuam com npm run vercel-build.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(scriptName) {
  const scriptPath = join(hostRoot, "scripts", scriptName);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: hostRoot,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\n→ vercel-build:mesaflow (NA MESA — somente MesaFlow)\n");
run("build-mesaflow.mjs");
run("verify-mesaflow-deploy-only.mjs");
console.log("\n✓ vercel-build:mesaflow concluído\n");
