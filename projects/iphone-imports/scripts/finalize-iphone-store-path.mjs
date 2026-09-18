/**
 * Next export com basePath=/iphone-imports ainda grava HTML em out/ na raiz.
 * Move a vitrine para out/iphone-imports/ (gestor já vive nesse subpath).
 */
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const hostRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = join(hostRoot, "out");
const storeDir = join(outRoot, "iphone-imports");

/** Pastas de outros produtos no deploy unificado — não mover. */
const PRESERVE_TOP = new Set(["iphone-imports", "mesaflow", "w-tube", "pucci-motors", "b2-gestor"]);

function main() {
  if (!existsSync(join(outRoot, "index.html"))) {
    console.error("✗ out/index.html ausente — rode next build antes");
    process.exit(1);
  }

  mkdirSync(storeDir, { recursive: true });

  for (const entry of readdirSync(outRoot)) {
    if (PRESERVE_TOP.has(entry)) continue;
    const src = join(outRoot, entry);
    const dst = join(storeDir, entry);
    if (existsSync(dst)) rmSync(dst, { recursive: true, force: true });
    renameSync(src, dst);
  }

  if (!existsSync(join(storeDir, "index.html"))) {
    console.error("✗ out/iphone-imports/index.html ausente após reorganização");
    process.exit(1);
  }

  console.log("→ iphone-imports: vitrine em out/iphone-imports/");
}

main();
