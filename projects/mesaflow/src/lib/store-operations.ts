import { buildClosingSummary } from "@/lib/closing";
import { clearPaymentConfirmationIfUnsettled, getGuestPaymentStatus } from "@/lib/guest-payment";
import { validatePaymentAmount } from "@/lib/payments";
import { id } from "@/lib/crypto-utils";
import { emit } from "@/lib/events";
import { revokeSessionsForParticipation } from "@/lib/guest";
import { getStore, saveStore } from "@/lib/store";
import type {
  AuditEvent,
  ClosingRequest,
  Command,
  GuestParticipation,
  IntegrationConnection,
  IntegrationProvider,
  MesaFlowStore,
  Notification,
  OrderItemSplit,
  Payment,
  PaymentMethod,
  Table,
  User,
} from "@/lib/types";

type MutationError = { error: string; status: number };
type MutationResult<T> = { value: T } | MutationError;

const PAYMENT_METHODS = new Set<PaymentMethod>(["cash", "credit", "debit", "pix", "other"]);

function invalid(error: string, status = 400): MutationError {
  return { error, status };
}

function ensureOperationalCollections(store: MesaFlowStore) {
  store.closingRequests ||= {};
  store.orderItemSplits ||= {};
  store.payments ||= {};
  store.integrationConnections ||= {};
  store.auditEvents ||= {};
}

export function migrateOperationalCollections(store: MesaFlowStore) {
  ensureOperationalCollections(store);
}

function recordAudit(
  store: MesaFlowStore,
  input: Omit<AuditEvent, "id" | "createdAt">,
) {
  ensureOperationalCollections(store);
  const event: AuditEvent = {
    id: id("aud_"),
    createdAt: new Date().toISOString(),
    ...input,
  };
  store.auditEvents[event.id] = event;
}

function notifyStaff(
  store: MesaFlowStore,
  establishmentId: string,
  type: string,
  title: string,
  body: string,
  extra?: Pick<Notification, "commandId" | "tableId" | "actionUrl" | "metadata">,
) {
  const notification: Notification = {
    id: id("ntf_"),
    establishmentId,
    type,
    title,
    body,
    read: false,
    createdAt: new Date().toISOString(),
    ...extra,
  };
  store.notifications[notification.id] = notification;
  emit({ type: "notification", notificationId: notification.id, establishmentId });
}

function commandOrders(store: MesaFlowStore, commandId: string) {
  return Object.values(store.orders).filter((order) => order.commandId === commandId);
}

function commandParticipations(store: MesaFlowStore, commandId: string) {
  return Object.values(store.guestParticipations).filter(
    (participation) => participation.commandId === commandId && participation.status !== "CLOSED",
  );
}

function commandSplits(store: MesaFlowStore, commandId: string) {
  return Object.values(store.orderItemSplits).filter((split) => split.commandId === commandId);
}

function commandPayments(store: MesaFlowStore, commandId: string) {
  return Object.values(store.payments).filter((payment) => payment.commandId === commandId);
}

function commandClosingRequests(store: MesaFlowStore, commandId: string) {
  return Object.values(store.closingRequests).filter((request) => request.commandId === commandId);
}

function participationDisplayName(participation: GuestParticipation) {
  return participation.displayName?.trim() || `Participante ${participation.participantIndex}`;
}

export function getTableCockpit(establishmentId: string, tableId: string) {
  const store = getStore();
  ensureOperationalCollections(store);
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) return null;

  const command =
    (table.commandId ? store.commands[table.commandId] : null) ||
    Object.values(store.commands).find(
      (entry) =>
        entry.establishmentId === establishmentId &&
        entry.tableId === tableId &&
        entry.status !== "FECHADA",
    ) ||
    null;

  if (!command) {
    return { table, command: null, orders: [], participations: [], splits: [], payments: [], closingRequests: [], summary: null };
  }

  const orders = commandOrders(store, command.id);
  const participations = commandParticipations(store, command.id);
  const splits = commandSplits(store, command.id);
  const payments = commandPayments(store, command.id);
  const closingRequests = commandClosingRequests(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);

  return {
    table,
    command,
    orders,
    participations,
    splits,
    payments,
    closingRequests,
    summary,
  };
}

export function replaceOrderItemSplits(
  establishmentId: string,
  commandId: string,
  body: unknown,
  actorUserId: string,
): MutationResult<{ splits: OrderItemSplit[] }> {
  const store = getStore();
  ensureOperationalCollections(store);
  const command = store.commands[commandId];
  if (!command || command.establishmentId !== establishmentId) {
    return invalid("Comanda não encontrada.", 404);
  }
  if (command.status === "FECHADA") {
    return invalid("Comanda já encerrada.", 409);
  }
  if (!body || typeof body !== "object" || !Array.isArray((body as { splits?: unknown }).splits)) {
    return invalid("Informe a lista de divisões por item.");
  }

  const entries = (body as { splits: Array<{ orderItemId: string; guestParticipationId: string; quantity: number }> }).splits;
  const orders = commandOrders(store, command.id).filter((order) => order.status !== "CANCELADO");
  const participations = new Set(commandParticipations(store, command.id).map((entry) => entry.id));
  const itemMap = new Map<string, { orderId: string; qty: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      itemMap.set(item.id, { orderId: order.id, qty: item.qty });
    }
  }

  const grouped = new Map<string, number>();
  const nextSplits: OrderItemSplit[] = [];
  const now = new Date().toISOString();

  for (const entry of entries) {
    if (
      typeof entry.orderItemId !== "string" ||
      typeof entry.guestParticipationId !== "string" ||
      typeof entry.quantity !== "number" ||
      !Number.isFinite(entry.quantity) ||
      entry.quantity <= 0
    ) {
      return invalid("Divisão de item inválida.");
    }
    const item = itemMap.get(entry.orderItemId);
    if (!item) return invalid("Item de pedido não pertence à comanda.");
    if (!participations.has(entry.guestParticipationId)) {
      return invalid("Participante inválido para esta comanda.");
    }
    grouped.set(entry.orderItemId, (grouped.get(entry.orderItemId) || 0) + entry.quantity);
    nextSplits.push({
      id: id("ois_"),
      orderItemId: entry.orderItemId,
      orderId: item.orderId,
      commandId,
      guestParticipationId: entry.guestParticipationId,
      quantity: entry.quantity,
      createdAt: now,
    });
  }

  for (const [orderItemId, itemInfo] of itemMap.entries()) {
    const assigned = grouped.get(orderItemId) || 0;
    if (assigned > 0 && Math.abs(assigned - itemInfo.qty) > 0.0001) {
      return invalid("A soma das divisões deve corresponder à quantidade do item.");
    }
  }

  for (const [splitId, split] of Object.entries(store.orderItemSplits)) {
    if (split.commandId === commandId) delete store.orderItemSplits[splitId];
  }
  for (const split of nextSplits) {
    store.orderItemSplits[split.id] = split;
  }

  recordAudit(store, {
    establishmentId,
    type: "splits.updated",
    actorType: "STAFF",
    actorUserId,
    targetType: "command",
    targetId: commandId,
    metadata: { count: nextSplits.length },
  });
  saveStore(store);
  return { value: { splits: nextSplits } };
}

export function registerPayment(
  establishmentId: string,
  commandId: string,
  body: unknown,
  actorUser: User,
): MutationResult<{ payment: Payment; summary: ReturnType<typeof buildClosingSummary> }> {
  const store = getStore();
  ensureOperationalCollections(store);
  const command = store.commands[commandId];
  if (!command || command.establishmentId !== establishmentId) {
    return invalid("Comanda não encontrada.", 404);
  }
  if (command.status === "FECHADA") {
    return invalid("Comanda já encerrada.", 409);
  }
  if (!body || typeof body !== "object") return invalid("Corpo inválido.");

  const payload = body as {
    amount?: number;
    method?: PaymentMethod;
    guestParticipationId?: string;
    note?: string;
  };
  const amount = Number(payload.amount);
  const method = payload.method;
  if (!method || !PAYMENT_METHODS.has(method)) {
    return invalid("Forma de pagamento inválida.");
  }
  const amountError = validatePaymentAmount(amount);
  if (amountError) return invalid(amountError);

  const participations = commandParticipations(store, command.id);
  if (payload.guestParticipationId) {
    const participation = participations.find((entry) => entry.id === payload.guestParticipationId);
    if (!participation) return invalid("Participante inválido para esta comanda.");
  }

  const orders = commandOrders(store, command.id);
  const splits = commandSplits(store, command.id);
  const payments = commandPayments(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);
  const maxAmount = payload.guestParticipationId
    ? summary.participants.find((entry) => entry.guestParticipationId === payload.guestParticipationId)?.remainingTotal
    : summary.remainingTotal;
  const maxError = validatePaymentAmount(amount, maxAmount);
  if (maxError) return invalid(maxError);

  const payment: Payment = {
    id: id("pay_"),
    establishmentId,
    commandId,
    guestParticipationId: payload.guestParticipationId,
    amount,
    method,
    status: "registered",
    registeredByUserId: actorUser.id,
    registeredAt: new Date().toISOString(),
    note: typeof payload.note === "string" ? payload.note.trim() : undefined,
  };
  store.payments[payment.id] = payment;

  recordAudit(store, {
    establishmentId,
    type: "payment.registered",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "payment",
    targetId: payment.id,
    metadata: { commandId, amount, method },
  });

  const table = store.tables[command.tableId];
  notifyStaff(
    store,
    establishmentId,
    "payment.registered",
    "Pagamento registrado",
    `Mesa ${table?.number || "?"} · ${amount.toFixed(2)}`,
    {
      commandId,
      tableId: command.tableId,
      actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(command.tableId)}`,
    },
  );

  saveStore(store);
  const nextSummary = buildClosingSummary(
    orders,
    participations,
    splits,
    [...payments, payment],
  );
  return { value: { payment, summary: nextSummary } };
}

export function voidPayment(
  establishmentId: string,
  paymentId: string,
  actorUser: User,
): MutationResult<{ payment: Payment }> {
  const store = getStore();
  ensureOperationalCollections(store);
  const payment = store.payments[paymentId];
  if (!payment || payment.establishmentId !== establishmentId) {
    return invalid("Pagamento não encontrado.", 404);
  }
  if (payment.status === "voided") {
    return { value: { payment } };
  }
  const command = store.commands[payment.commandId];
  if (!command || command.status === "FECHADA") {
    return invalid("Não é possível estornar pagamento de comanda encerrada.", 409);
  }

  payment.status = "voided";
  payment.voidedAt = new Date().toISOString();
  payment.voidedByUserId = actorUser.id;
  store.payments[paymentId] = payment;

  if (payment.guestParticipationId) {
    clearPaymentConfirmationIfUnsettled(store, payment.guestParticipationId);
  }

  recordAudit(store, {
    establishmentId,
    type: "payment.voided",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "payment",
    targetId: payment.id,
    metadata: { commandId: payment.commandId },
  });
  saveStore(store);
  return { value: { payment } };
}

export function confirmGuestPayment(
  establishmentId: string,
  participationId: string,
  actorUser: User,
): MutationResult<{ participation: GuestParticipation }> {
  const store = getStore();
  ensureOperationalCollections(store);
  const participation = store.guestParticipations[participationId];
  if (!participation || participation.establishmentId !== establishmentId) {
    return invalid("Participação não encontrada.", 404);
  }
  if (participation.status === "CLOSED") {
    return invalid("Participante já saiu da mesa.", 409);
  }
  if (participation.paymentConfirmedAt) {
    return { value: { participation } };
  }

  const paymentStatus = getGuestPaymentStatus(participation);
  if (paymentStatus.itemTotal > 0.009 && !paymentStatus.isSettled) {
    return invalid("Registre o pagamento completo antes de confirmar.", 409);
  }

  const now = new Date().toISOString();
  participation.paymentConfirmedAt = now;
  participation.paymentConfirmedByUserId = actorUser.id;
  store.guestParticipations[participationId] = participation;

  const table = store.tables[participation.tableId];
  notifyStaff(
    store,
    establishmentId,
    "payment.confirmed",
    "Pagamento confirmado",
    `${participation.displayName || "Cliente"} · Mesa ${table?.number || "?"} — pode sair da mesa`,
    {
      commandId: participation.commandId,
      tableId: participation.tableId,
      actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(participation.tableId)}`,
      metadata: { guestParticipationId: participationId },
    },
  );

  recordAudit(store, {
    establishmentId,
    type: "payment.confirmed",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "guest_participation",
    targetId: participationId,
    metadata: { commandId: participation.commandId, tableId: participation.tableId },
  });

  saveStore(store);
  return { value: { participation } };
}

export function confirmClosingRequest(
  establishmentId: string,
  closingRequestId: string,
  actorUser: User,
): MutationResult<{ closingRequest: ClosingRequest }> {
  const store = getStore();
  ensureOperationalCollections(store);
  const request = store.closingRequests[closingRequestId];
  if (!request || request.establishmentId !== establishmentId) {
    return invalid("Solicitação de fechamento não encontrada.", 404);
  }
  if (request.status === "CONFIRMED" || request.status === "SETTLED") {
    return { value: { closingRequest: request } };
  }
  if (request.status !== "PENDING") {
    return invalid("Solicitação não está pendente.", 409);
  }

  const command = store.commands[request.commandId];
  if (!command) return invalid("Comanda não encontrada.", 404);

  const orders = commandOrders(store, command.id);
  const participations = commandParticipations(store, command.id);
  const splits = commandSplits(store, command.id);
  const payments = commandPayments(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);

  const targetIds =
    request.scope === "TABLE"
      ? participations.map((entry) => entry.id)
      : request.targetGuestParticipationIds;
  const targetsSettled = targetIds.every((targetId) => {
    const participant = summary.participants.find((entry) => entry.guestParticipationId === targetId);
    return participant?.isSettled ?? false;
  });
  if (!targetsSettled) {
    return invalid("Pagamentos pendentes para confirmar o fechamento.", 409);
  }

  const now = new Date().toISOString();
  request.status = "CONFIRMED";
  request.confirmedAt = now;
  request.confirmedByUserId = actorUser.id;
  store.closingRequests[closingRequestId] = request;

  for (const participationId of targetIds) {
    const participation = store.guestParticipations[participationId];
    if (!participation) continue;
    participation.status = "CLOSED";
    participation.closedAt = now;
    participation.closedByUserId = actorUser.id;
    store.guestParticipations[participationId] = participation;
  }

  recordAudit(store, {
    establishmentId,
    type: "closing.confirmed",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "closing_request",
    targetId: request.id,
    metadata: { commandId: request.commandId, scope: request.scope },
  });
  saveStore(store);
  return { value: { closingRequest: request } };
}

export function settleCommand(
  establishmentId: string,
  commandId: string,
  actorUser: User,
): MutationResult<{ command: Command; table: Table }> {
  const store = getStore();
  ensureOperationalCollections(store);
  const command = store.commands[commandId];
  if (!command || command.establishmentId !== establishmentId) {
    return invalid("Comanda não encontrada.", 404);
  }
  if (command.status === "FECHADA") {
    const table = store.tables[command.tableId];
    return { value: { command, table } };
  }

  const orders = commandOrders(store, command.id);
  const participations = commandParticipations(store, command.id);
  const splits = commandSplits(store, command.id);
  const payments = commandPayments(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);
  if (!summary.canSettle) {
    return invalid("Ainda há saldo pendente para encerrar a comanda.", 409);
  }

  const now = new Date().toISOString();
  command.status = "FECHADA";
  command.closedAt = now;
  store.commands[commandId] = command;

  const table = store.tables[command.tableId];
  if (table) {
    table.status = "LIVRE";
    table.commandId = undefined;
    store.tables[table.id] = table;
  }

  for (const participation of Object.values(store.guestParticipations)) {
    if (participation.commandId !== commandId || participation.status === "CLOSED") continue;
    participation.status = "CLOSED";
    participation.closedAt = now;
    participation.closedByUserId = actorUser.id;
    store.guestParticipations[participation.id] = participation;
  }

  for (const request of Object.values(store.closingRequests)) {
    if (request.commandId !== commandId || request.status === "SETTLED") continue;
    request.status = "SETTLED";
    request.settledAt = now;
    request.settledByUserId = actorUser.id;
    store.closingRequests[request.id] = request;
  }

  recordAudit(store, {
    establishmentId,
    type: "command.settled",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "command",
    targetId: commandId,
    metadata: { tableId: command.tableId },
  });

  saveStore(store);
  emit({ type: "command.updated", commandId, establishmentId });
  return { value: { command, table: table! } };
}

export function markNotificationRead(
  establishmentId: string,
  notificationId: string,
): MutationResult<{ notification: Notification }> {
  const store = getStore();
  const notification = store.notifications[notificationId];
  if (!notification || notification.establishmentId !== establishmentId) {
    return invalid("Notificação não encontrada.", 404);
  }
  notification.read = true;
  store.notifications[notificationId] = notification;
  saveStore(store);
  return { value: { notification } };
}

const INTEGRATION_CATALOG: Array<{ provider: IntegrationProvider; label: string; description: string }> = [
  { provider: "ifood", label: "iFood", description: "Receba pedidos do marketplace no painel." },
  { provider: "rappi", label: "Rappi", description: "Sincronize cardápio e pedidos delivery." },
  { provider: "whatsapp", label: "WhatsApp", description: "Atendimento e confirmações por mensagem." },
  { provider: "erp", label: "ERP / PDV", description: "Exporte vendas para seu sistema financeiro." },
  { provider: "webhook", label: "Webhook", description: "Envie eventos para sua própria API." },
];

export function listIntegrations(establishmentId: string) {
  const store = getStore();
  ensureOperationalCollections(store);
  const existing = Object.values(store.integrationConnections).filter(
    (entry) => entry.establishmentId === establishmentId,
  );
  const byProvider = new Map(existing.map((entry) => [entry.provider, entry]));

  const items = INTEGRATION_CATALOG.map((item) => {
    const connection = byProvider.get(item.provider);
    return {
      provider: item.provider,
      label: item.label,
      description: item.description,
      status: connection?.status || "available",
      connection,
      canConnect: !connection || connection.status === "available" || connection.status === "disabled",
    };
  });

  return { items };
}

export function ensureIntegrationCatalog(establishmentId: string) {
  const store = getStore();
  ensureOperationalCollections(store);
  for (const item of INTEGRATION_CATALOG) {
    const existing = Object.values(store.integrationConnections).find(
      (entry) => entry.establishmentId === establishmentId && entry.provider === item.provider,
    );
    if (existing) continue;
    const connection: IntegrationConnection = {
      id: id("int_"),
      establishmentId,
      provider: item.provider,
      status: "available",
      label: item.label,
      config: {},
    };
    store.integrationConnections[connection.id] = connection;
  }
  saveStore(store);
}

const STALE_PARTICIPATION_MS = 12 * 60 * 60 * 1000;

export function forceClearTable(
  establishmentId: string,
  tableId: string,
  actorUserId: string,
): MutationResult<{ table: Table; command: Command | null; closedParticipations: number }> {
  const store = getStore();
  ensureOperationalCollections(store);
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa não encontrada.", 404);
  }

  const command =
    (table.commandId ? store.commands[table.commandId] : null) ||
    Object.values(store.commands).find(
      (entry) =>
        entry.establishmentId === establishmentId &&
        entry.tableId === tableId &&
        entry.status !== "FECHADA",
    ) ||
    null;

  const now = new Date().toISOString();
  let closedParticipations = 0;

  const closeParticipation = (participation: GuestParticipation) => {
    if (participation.status === "CLOSED") return;
    participation.status = "CLOSED";
    participation.closedAt = now;
    participation.closedByUserId = actorUserId;
    store.guestParticipations[participation.id] = participation;
    revokeSessionsForParticipation(store, participation.id);
    closedParticipations += 1;
  };

  if (command) {
    for (const participation of Object.values(store.guestParticipations)) {
      if (participation.commandId !== command.id) continue;
      closeParticipation(participation);
    }

    command.status = "FECHADA";
    command.closedAt = now;
    store.commands[command.id] = command;

    for (const request of Object.values(store.closingRequests)) {
      if (request.commandId !== command.id || request.status === "SETTLED") continue;
      request.status = "SETTLED";
      request.settledAt = now;
      request.settledByUserId = actorUserId;
      store.closingRequests[request.id] = request;
    }

    emit({ type: "command.updated", commandId: command.id, establishmentId });
  } else {
    for (const participation of Object.values(store.guestParticipations)) {
      if (participation.tableId !== tableId || participation.establishmentId !== establishmentId) {
        continue;
      }
      closeParticipation(participation);
    }
  }

  table.status = "LIVRE";
  table.commandId = undefined;
  store.tables[table.id] = table;

  recordAudit(store, {
    establishmentId,
    type: "table.force_cleared",
    actorType: "STAFF",
    actorUserId,
    targetType: "table",
    targetId: tableId,
    metadata: {
      commandId: command?.id,
      closedParticipations,
    },
  });

  saveStore(store);
  return { value: { table, command, closedParticipations } };
}

export function listAdminOperations(establishmentId: string) {
  const store = getStore();
  ensureOperationalCollections(store);
  const now = Date.now();

  const activeTables = Object.values(store.tables)
    .filter(
      (table) =>
        table.establishmentId === establishmentId &&
        table.status !== "INATIVA" &&
        (table.status === "OCUPADA" ||
          table.status === "AGUARDANDO_PAGAMENTO" ||
          Boolean(table.commandId)),
    )
    .map((table) => {
      const command =
        (table.commandId ? store.commands[table.commandId] : null) ||
        Object.values(store.commands).find(
          (entry) =>
            entry.tableId === table.id &&
            entry.establishmentId === establishmentId &&
            entry.status !== "FECHADA",
        ) ||
        null;
      const participants = command
        ? Object.values(store.guestParticipations).filter(
            (gp) => gp.commandId === command.id && gp.status !== "CLOSED",
          )
        : [];
      return { table, command, participants };
    });

  const staleParticipations = Object.values(store.guestParticipations).filter((gp) => {
    if (gp.establishmentId !== establishmentId) return false;
    if (gp.status === "CLOSED") return false;
    const joinedAge = now - new Date(gp.joinedAt).getTime();
    if (joinedAge > STALE_PARTICIPATION_MS) return true;
    const command = store.commands[gp.commandId];
    if (command && command.status === "FECHADA") return true;
    return false;
  });

  return { activeTables, staleParticipations };
}
