import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-payment-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";

async function run() {
  const { getStore, findEstablishmentBySlug, createOrder, saveStore } = await import("./store");
  const { joinGuestAtTable } = await import("./guest");
  const { canGuestLeave, getGuestPaymentStatus, leaveGuestTable } = await import("./guest-payment");
  const { confirmGuestPayment, registerPayment } = await import("./store-operations");
  const { loginUser } = await import("./store");

  const store = getStore();
  const establishment = findEstablishmentBySlug("ponto-do-sabor");
  assert.ok(establishment);
  const table = Object.values(store.tables).find((entry) => entry.establishmentId === establishment.id);
  assert.ok(table);

  const joined = joinGuestAtTable({
    establishment,
    table,
    phoneE164: "+5511911111111",
    displayName: "Teste Pagamento",
  });
  assert.ok(!("error" in joined));
  assert.ok(joined.token);

  const gp = store.guestParticipations[joined.participation.id];
  assert.ok(canGuestLeave(gp), "guest with no consumption can leave");

  const product = Object.values(store.products).find(
    (entry) => entry.establishmentId === establishment.id && entry.active,
  );
  assert.ok(product);

  createOrder({
    establishmentId: establishment.id,
    table,
    commandId: joined.command.id,
    guestParticipationId: gp.id,
    items: [
      {
        id: "line_pay_test",
        productId: product.id,
        productName: product.name,
        sectorId: product.sectorId,
        sectorName: "Cozinha",
        qty: 1,
        unitPrice: product.price,
        variantDelta: 0,
        addons: [],
        status: "NOVO",
      },
    ],
    source: "MESA",
  });

  const gpWithOrder = store.guestParticipations[gp.id];
  assert.equal(canGuestLeave(gpWithOrder), false, "guest with consumption cannot leave without OK");

  const logoutBlocked = leaveGuestTable(joined.token);
  assert.ok("error" in logoutBlocked);
  assert.equal(logoutBlocked.status, 403);

  const staff = loginUser("owner@pontodosabor.com", "demo123");
  assert.ok(staff && !("error" in staff));

  const payment = registerPayment(
    establishment.id,
    joined.command.id,
    { amount: product.price, method: "pix", guestParticipationId: gp.id },
    staff.user,
  );
  assert.ok(!("error" in payment));

  const statusBeforeConfirm = getGuestPaymentStatus(store.guestParticipations[gp.id]);
  assert.equal(statusBeforeConfirm.isSettled, true);
  assert.equal(canGuestLeave(store.guestParticipations[gp.id]), false);

  const confirmed = confirmGuestPayment(establishment.id, gp.id, staff.user);
  assert.ok(!("error" in confirmed));
  assert.ok(confirmed.value.participation.paymentConfirmedAt);

  const gpConfirmed = store.guestParticipations[gp.id];
  assert.equal(canGuestLeave(gpConfirmed), true);

  const left = leaveGuestTable(joined.token);
  assert.ok("ok" in left);
  assert.equal(store.guestParticipations[gp.id].status, "CLOSED");

  console.log("✓ MesaFlow guest-payment tests passed");
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
