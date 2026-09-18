import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-closing-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";

async function run() {
  const { getStore, findEstablishmentBySlug, createOrder } = await import("./store");
  const { joinGuestAtTable } = await import("./guest");
  const {
    requestGuestClosing,
    cancelGuestClosing,
    getGuestClosingStatus,
  } = await import("./guest-closing");

  const store = getStore();
  const establishment = findEstablishmentBySlug("ponto-do-sabor");
  assert.ok(establishment);
  const table = Object.values(store.tables).find((entry) => entry.establishmentId === establishment.id);
  assert.ok(table);

  const guest = joinGuestAtTable({
    establishment,
    table,
    phoneE164: "+5511998877665",
    displayName: "Carlos",
  });
  assert.ok(!("error" in guest));

  const selfClose = requestGuestClosing(guest.participation.id, "SELF");
  assert.ok(!("error" in selfClose));
  assert.equal(selfClose.value.participation.status, "CLOSING_REQUESTED");
  assert.equal(selfClose.value.closingRequest.scope, "SELF");

  const status = getGuestClosingStatus(guest.participation.id);
  assert.ok(status?.canCancel);
  assert.equal(status?.canOrder, false);

  const product = Object.values(store.products).find(
    (entry) => entry.establishmentId === establishment.id && entry.active,
  );
  assert.ok(product);

  assert.throws(
    () =>
      createOrder({
        establishmentId: establishment.id,
        table,
        commandId: guest.command.id,
        guestParticipationId: guest.participation.id,
        items: [
          {
            id: "line_close",
            productId: product.id,
            productName: product.name,
            sectorId: product.sectorId,
            sectorName: "Cozinha",
            qty: 1,
            unitPrice: product.price,
            status: "NOVO",
          },
        ],
        source: "MESA",
      }),
    /participação/i,
  );

  const cancelled = cancelGuestClosing(guest.participation.id);
  assert.ok(!("error" in cancelled));
  assert.equal(cancelled.value.participation.status, "OPEN");
  assert.ok(cancelled.value.cancelled);

  const tableClose = requestGuestClosing(guest.participation.id, "TABLE");
  assert.ok(!("error" in tableClose));
  assert.equal(store.commands[guest.command.id].status, "PAGAMENTO_SOLICITADO");
  assert.equal(store.tables[table.id].status, "AGUARDANDO_PAGAMENTO");

  console.log("guest-closing.test.ts — OK");
}

run()
  .then(() => rmSync(tempDir, { recursive: true, force: true }))
  .catch((error) => {
    console.error(error);
    rmSync(tempDir, { recursive: true, force: true });
    process.exit(1);
  });
