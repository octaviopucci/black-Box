/**
 * Capture real product UI screenshots for NA MESA landing mockups.
 * Usage: node scripts/capture-landing-mockups.mjs [--base=http://localhost:3010]
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/landing/mockups");

const argBase = process.argv.find((a) => a.startsWith("--base="));
const BASE = (argBase?.split("=")[1] || process.env.MESAFLOW_CAPTURE_BASE || "http://localhost:3010").replace(
  /\/$/,
  "",
);

const DEMO_OWNER = { email: "owner@pontodosabor.com", password: "demo123" };
const DEMO_WAITER = { email: "garcom@pontodosabor.com", password: "demo123" };

async function waitForMenuReady(page) {
  await page.waitForFunction(
    () =>
      !document.querySelector(".skeleton") &&
      (document.body.innerText.includes("X-Burger Artesanal") ||
        document.body.innerText.includes("Hambúrgueres")),
    { timeout: 60000 },
  );
}

async function joinGuestTable(page) {
  await page.goto(`${BASE}/m/ponto-do-sabor/mesa-8`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Ponto do Sabor", { timeout: 45000 });

  await page.locator('input[type="checkbox"]').first().check();
  const phoneInput = page.locator('input[placeholder*="99999"]');
  const phoneSuffix = String(Date.now()).slice(-7);
  if (await phoneInput.isVisible()) await phoneInput.fill(`1199${phoneSuffix}`);

  await page.getByRole("button", { name: /Entrar na mesa|Enviar código/i }).click();

  const otpInput = page.locator('input[placeholder="000000"]');
  try {
    await otpInput.waitFor({ state: "visible", timeout: 15000 });
    await otpInput.fill("010203");
    await page.getByRole("button", { name: /Confirmar e entrar/i }).click();
    await page.waitForLoadState("networkidle").catch(() => {});
  } catch {
    /* mock join without OTP */
  }

  await waitForMenuReady(page);
  await page.waitForTimeout(800);
}

async function loginStaff(page, { email, password }, redirectPattern) {
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await page.waitForSelector('input[type="email"]', { timeout: 20000 });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole("button", { name: /Entrar no painel/i }).click();
  await page.waitForURL(redirectPattern, { timeout: 30000 });
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function captureGuestMenu(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await joinGuestTable(page);
  await page.screenshot({ path: path.join(OUT_DIR, "guest-menu.png"), fullPage: false });
  console.log("✓ guest-menu.png");
}

async function captureClosing(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await joinGuestTable(page);
  await page.getByRole("button", { name: "Comanda" }).click();
  await page.waitForSelector("text=Pedir a conta", { timeout: 20000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT_DIR, "closing-conta.png"), fullPage: false });
  console.log("✓ closing-conta.png");
}

async function captureAdminOrders(page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await loginStaff(page, DEMO_OWNER, /\/admin/);
  await page.goto(`${BASE}/admin/orders`, { waitUntil: "networkidle" });
  await page.waitForSelector("h1:has-text('Pedidos')", { timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Novos") && /#\d+/.test(document.body.innerText),
    { timeout: 45000 },
  );
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "admin-orders.png"), fullPage: false });
  console.log("✓ admin-orders.png");
}

async function captureKds(page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/kds/sec_cozinha?slug=ponto-do-sabor`, { waitUntil: "networkidle" });
  await page.waitForSelector("h1:has-text('Cozinha')", { timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("tickets") && /#\d+/.test(document.body.innerText),
    { timeout: 45000 },
  );
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "kds-cozinha.png"), fullPage: false });
  console.log("✓ kds-cozinha.png");
}

async function captureWaiter(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/waiter/login`, { waitUntil: "networkidle" });
  await page.waitForSelector('input[type="email"]', { timeout: 20000 });
  await page.fill('input[type="email"]', DEMO_WAITER.email);
  await page.fill('input[type="password"]', DEMO_WAITER.password);
  await page.getByRole("button", { name: /Entrar/i }).click();
  await page.waitForURL(/\/waiter/, { timeout: 30000 });
  await page.waitForSelector("text=Mesas", { timeout: 30000 });
  await page.waitForFunction(
    () => /Mesa\s+\d+/i.test(document.body.innerText),
    { timeout: 45000 },
  );
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT_DIR, "waiter-mesas.png"), fullPage: false });
  console.log("✓ waiter-mesas.png");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Capturing mockups from ${BASE} → ${OUT_DIR}`);

  const browser = await chromium.launch({ headless: true });

  {
    const page = await browser.newPage();
    await captureGuestMenu(page);
    await page.close();
  }

  {
    const page = await browser.newPage();
    await captureClosing(page);
    await page.close();
  }

  {
    const page = await browser.newPage();
    await captureAdminOrders(page);
    await captureKds(page);
    await page.close();
  }

  {
    const page = await browser.newPage();
    await captureWaiter(page);
    await page.close();
  }

  await browser.close();
  await writeFile(
    path.join(OUT_DIR, "README.txt"),
    "Generated by scripts/capture-landing-mockups.mjs — real product UI captures for landing.\n",
  );
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
