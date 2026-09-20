import { createHash, randomBytes } from "crypto";
import { appendAuditEvent } from "./audit-log";
import { hashPassword, id, verifyPassword } from "./crypto-utils";
import { emit } from "./events";
import { canCreateWaiter, hasFeature } from "./platform-entitlements";
import { validatePasswordStrength } from "./password-policy";
import {
  createOrder,
  findUserByEmail,
  getActiveCommand,
  getOrOpenCommand,
  getStore,
  saveStore,
} from "./store";
import { migrateOperationalCollections, notifyStaff } from "./store-operations";
import {
  assertWaiterPermission,
  DEFAULT_WAITER_PERMISSIONS,
  publicWaiterPermissions,
  type WaiterPermissionKey,
} from "./waiter-permissions";
import type {
  Command,
  Establishment,
  MesaFlowStore,
  Order,
  OrderItem,
  OrderLineInput,
  OrderServiceType,
  Table,
  TableAssignment,
  User,
  WaiterActivationToken,
  WaiterPermissions,
} from "./types";

type MutationError = { error: string; status: number };
type MutationResult<T> = { value: T } | MutationError;

function invalid(error: string, status = 400): MutationError {
  return { error, status };
}

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function ensureWaiterCollections(store: MesaFlowStore) {
  store.waiterActivationTokens ||= {};
  store.tableAssignments ||= {};
}

export function publicWaiterUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    lastLoginAt: user.lastLoginAt,
    permissions: publicWaiterPermissions(user),
    assignedTableIds: user.assignedTableIds || [],
    createdAt: user.createdAt,
  };
}

export function listWaiters(establishmentId: string) {
  const store = getStore();
  return Object.values(store.users)
    .filter((user) => user.establishmentId === establishmentId && user.role === "WAITER")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(publicWaiterUser);
}

export function createWaiter(
  establishment: Establishment,
  actorUserId: string,
  input: { name: string; email: string; password?: string; permissions?: Partial<WaiterPermissions> },
): MutationResult<{ waiter: ReturnType<typeof publicWaiterUser> }> {
  const store = getStore();
  ensureWaiterCollections(store);

  const gate = canCreateWaiter(establishment, store);
  if (!gate.ok) return invalid(gate.error, 403);

  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  if (!name || !email) return invalid("Nome e e-mail são obrigatórios.");

  if (findUserByEmail(email)) return invalid("E-mail já cadastrado.", 409);

  const password = input.password || randomBytes(9).toString("base64url");
  const policy = validatePasswordStrength(password);
  if (policy) return invalid(policy);

  const now = new Date().toISOString();
  const user: User = {
    id: id("user_"),
    establishmentId: establishment.id,
    email,
    passwordHash: hashPassword(password),
    name,
    role: "WAITER",
    active: true,
    permissions: { ...DEFAULT_WAITER_PERMISSIONS, ...input.permissions },
    assignedTableIds: [],
    createdAt: now,
    updatedAt: now,
  };
  store.users[user.id] = user;

  appendAuditEvent(store, {
    establishmentId: establishment.id,
    type: "waiter.created",
    actorType: "STAFF",
    actorUserId,
    targetType: "user",
    targetId: user.id,
    metadata: { email: user.email },
  });

  saveStore(store);
  return { value: { waiter: publicWaiterUser(user) } };
}

export function updateWaiter(
  establishmentId: string,
  waiterId: string,
  actorUserId: string,
  input: {
    name?: string;
    email?: string;
    active?: boolean;
    permissions?: Partial<WaiterPermissions>;
    assignedTableIds?: string[];
  },
): MutationResult<{ waiter: ReturnType<typeof publicWaiterUser> }> {
  const store = getStore();
  ensureWaiterCollections(store);
  const user = store.users[waiterId];
  if (!user || user.establishmentId !== establishmentId || user.role !== "WAITER") {
    return invalid("Garçom não encontrado.", 404);
  }

  if (input.name !== undefined) {
    const name = String(input.name).trim();
    if (!name) return invalid("Nome inválido.");
    user.name = name;
  }
  if (input.email !== undefined) {
    const email = String(input.email).trim().toLowerCase();
    if (!email) return invalid("E-mail inválido.");
    const existing = findUserByEmail(email);
    if (existing && existing.id !== user.id) return invalid("E-mail já cadastrado.", 409);
    user.email = email;
  }
  if (input.permissions !== undefined) {
    user.permissions = { ...DEFAULT_WAITER_PERMISSIONS, ...user.permissions, ...input.permissions };
  }
  if (input.assignedTableIds !== undefined) {
    user.assignedTableIds = input.assignedTableIds;
  }
  if (input.active !== undefined) {
    user.active = Boolean(input.active);
    if (!user.active) {
      user.deactivatedAt = new Date().toISOString();
      user.deactivatedByUserId = actorUserId;
      revokeWaiterActivationTokens(store, user.id);
    } else {
      user.deactivatedAt = undefined;
      user.deactivatedByUserId = undefined;
    }
  }

  user.updatedAt = new Date().toISOString();
  store.users[user.id] = user;

  appendAuditEvent(store, {
    establishmentId,
    type: input.active === false ? "waiter.deactivated" : "waiter.updated",
    actorType: "STAFF",
    actorUserId,
    targetType: "user",
    targetId: user.id,
    metadata: { active: user.active },
  });

  saveStore(store);
  return { value: { waiter: publicWaiterUser(user) } };
}

export function resetWaiterPassword(
  establishmentId: string,
  waiterId: string,
  actorUserId: string,
  newPassword: string,
): MutationResult<{ changedAt: string }> {
  const store = getStore();
  const user = store.users[waiterId];
  if (!user || user.establishmentId !== establishmentId || user.role !== "WAITER") {
    return invalid("Garçom não encontrado.", 404);
  }
  const policy = validatePasswordStrength(newPassword);
  if (policy) return invalid(policy);

  user.passwordHash = hashPassword(newPassword);
  user.updatedAt = new Date().toISOString();
  user.failedLoginAttempts = 0;
  user.loginLockedUntil = undefined;
  store.users[user.id] = user;

  appendAuditEvent(store, {
    establishmentId,
    type: "waiter.password_reset",
    actorType: "STAFF",
    actorUserId,
    targetType: "user",
    targetId: user.id,
    metadata: {},
  });

  saveStore(store);
  return { value: { changedAt: user.updatedAt } };
}

function revokeWaiterActivationTokens(store: MesaFlowStore, userId: string) {
  ensureWaiterCollections(store);
  const now = new Date().toISOString();
  for (const token of Object.values(store.waiterActivationTokens!)) {
    if (token.userId === userId && !token.revokedAt && !token.usedAt) {
      token.revokedAt = now;
      store.waiterActivationTokens![token.id] = token;
    }
  }
}

export function generateWaiterActivationToken(
  establishmentId: string,
  waiterId: string,
  actorUserId: string,
): MutationResult<{ token: string; expiresAt: string; activationUrl: string }> {
  const store = getStore();
  ensureWaiterCollections(store);
  const user = store.users[waiterId];
  if (!user || user.establishmentId !== establishmentId || user.role !== "WAITER") {
    return invalid("Garçom não encontrado.", 404);
  }

  revokeWaiterActivationTokens(store, user.id);

  const raw = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const record: WaiterActivationToken = {
    id: id("wat_"),
    establishmentId,
    userId: waiterId,
    tokenHash: hashToken(raw),
    expiresAt,
    createdAt: new Date().toISOString(),
    createdByUserId: actorUserId,
  };
  store.waiterActivationTokens![record.id] = record;

  appendAuditEvent(store, {
    establishmentId,
    type: "waiter.activation_token",
    actorType: "STAFF",
    actorUserId,
    targetType: "user",
    targetId: waiterId,
    metadata: { tokenId: record.id },
  });

  saveStore(store);
  return {
    value: {
      token: raw,
      expiresAt,
      activationUrl: `/waiter/activate?token=${encodeURIComponent(raw)}`,
    },
  };
}

export function revokeWaiterActivationToken(
  establishmentId: string,
  waiterId: string,
  actorUserId: string,
): MutationResult<{ revoked: number }> {
  const store = getStore();
  ensureWaiterCollections(store);
  revokeWaiterActivationTokens(store, waiterId);
  appendAuditEvent(store, {
    establishmentId,
    type: "waiter.activation_token_revoked",
    actorType: "STAFF",
    actorUserId,
    targetType: "user",
    targetId: waiterId,
    metadata: {},
  });
  saveStore(store);
  return { value: { revoked: 1 } };
}

export function activateWaiterWithToken(
  rawToken: string,
  password: string,
  pin?: string,
): MutationResult<{ user: ReturnType<typeof publicWaiterUser>; establishmentId: string }> {
  const store = getStore();
  ensureWaiterCollections(store);
  const tokenHash = hashToken(rawToken);
  const record = Object.values(store.waiterActivationTokens!).find(
    (entry) => entry.tokenHash === tokenHash,
  );
  if (!record) return invalid("Token inválido.", 404);
  if (record.revokedAt) return invalid("Token revogado.", 410);
  if (record.usedAt) return invalid("Token já utilizado.", 410);
  if (new Date(record.expiresAt).getTime() <= Date.now()) {
    return invalid("Token expirado.", 410);
  }

  const user = store.users[record.userId];
  const establishment = store.establishments[record.establishmentId];
  if (!user || !establishment || user.role !== "WAITER") {
    return invalid("Garçom não encontrado.", 404);
  }
  if (!hasFeature(establishment, "waiter_access")) {
    return invalid("Plano não inclui acesso de garçons.", 403);
  }

  const policy = validatePasswordStrength(password);
  if (policy) return invalid(policy);

  user.passwordHash = hashPassword(password);
  if (pin && pin.length >= 4) {
    user.pinHash = hashPassword(pin);
  }
  user.active = true;
  user.updatedAt = new Date().toISOString();
  store.users[user.id] = user;

  record.usedAt = new Date().toISOString();
  store.waiterActivationTokens![record.id] = record;

  appendAuditEvent(store, {
    establishmentId: establishment.id,
    type: "waiter.activated",
    actorType: "STAFF",
    actorUserId: user.id,
    targetType: "user",
    targetId: user.id,
    metadata: { via: "activation_token" },
  });

  saveStore(store);
  return { value: { user: publicWaiterUser(user), establishmentId: establishment.id } };
}

function ensureServiceParticipation(
  store: MesaFlowStore,
  command: Command,
  table: Table,
  establishmentId: string,
): string {
  const guestOpen = Object.values(store.guestParticipations).find(
    (gp) =>
      gp.commandId === command.id &&
      gp.status === "OPEN" &&
      !gp.phoneLookupHash.startsWith("staff_service_"),
  );
  if (guestOpen) return guestOpen.id;

  const serviceId = `gp_service_${command.id}`;
  if (!store.guestParticipations[serviceId]) {
    const now = new Date().toISOString();
    store.guestParticipations[serviceId] = {
      id: serviceId,
      establishmentId,
      commandId: command.id,
      tableId: table.id,
      phoneLookupHash: `staff_service_${command.id}`,
      phoneDisplay: "",
      displayName: "Atendimento",
      participantIndex: 0,
      status: "OPEN",
      joinedAt: now,
      verifiedAt: now,
      orderCount: 0,
    };
  }
  return serviceId;
}

export function createStaffOrder(input: {
  establishmentId: string;
  tableId: string;
  items: OrderItem[];
  notes?: string;
  serviceType?: OrderServiceType;
  actor: User;
}): MutationResult<{ order: Order }> {
  const perm = assertWaiterPermission(input.actor, "order.create");
  if (!perm.ok) return invalid(perm.error, 403);
  if (input.actor.establishmentId !== input.establishmentId) {
    return invalid("Estabelecimento inválido.", 403);
  }

  const store = getStore();
  migrateOperationalCollections(store);
  const table = store.tables[input.tableId];
  if (!table || table.establishmentId !== input.establishmentId) {
    return invalid("Mesa não encontrada.", 404);
  }
  if (table.status === "INATIVA") return invalid("Mesa inativa.", 409);

  const establishment = store.establishments[input.establishmentId];
  if (!establishment?.open) return invalid("Estabelecimento indisponível.", 400);

  const command = getOrOpenCommand(table);
  const participationId = ensureServiceParticipation(store, command, table, input.establishmentId);
  saveStore(store);

  try {
    const order = createOrder({
      establishmentId: input.establishmentId,
      table,
      commandId: command.id,
      guestParticipationId: participationId,
      items: input.items,
      notes: input.notes,
      source: "MESA",
      serviceType: input.serviceType || "COMER_AQUI",
      orderOrigin: "WAITER",
      createdByUserId: input.actor.id,
      createdByRole: input.actor.role,
      waiterId: input.actor.id,
    });

    appendAuditEvent(store, {
      establishmentId: input.establishmentId,
      type: "order.created",
      actorType: "STAFF",
      actorUserId: input.actor.id,
      targetType: "order",
      targetId: order.id,
      metadata: { orderOrigin: "WAITER", tableId: table.id, commandId: command.id },
    });
    saveStore(store);

    return { value: { order } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar o pedido.";
    return invalid(message, 403);
  }
}

export function cancelStaffOrder(
  establishmentId: string,
  orderId: string,
  actor: User,
  reason?: string,
): MutationResult<{ order: Order }> {
  const perm = assertWaiterPermission(actor, "order.cancel");
  if (!perm.ok) return invalid(perm.error, 403);

  const store = getStore();
  const order = store.orders[orderId];
  if (!order || order.establishmentId !== establishmentId) {
    return invalid("Pedido não encontrado.", 404);
  }
  if (order.status === "CANCELADO") return invalid("Pedido já cancelado.", 409);
  if (["ENTREGUE", "PRONTO"].includes(order.status)) {
    return invalid("Pedido não pode ser cancelado neste status.", 409);
  }

  order.status = "CANCELADO";
  order.updatedAt = new Date().toISOString();
  order.cancelledByUserId = actor.id;
  order.cancelledAt = order.updatedAt;
  order.cancelReason = reason?.trim() || undefined;
  order.items = order.items.map((item) => ({ ...item, status: "CANCELADO" }));
  store.orders[orderId] = order;

  appendAuditEvent(store, {
    establishmentId,
    type: "order.cancelled",
    actorType: "STAFF",
    actorUserId: actor.id,
    targetType: "order",
    targetId: orderId,
    metadata: { reason: order.cancelReason },
  });

  saveStore(store);
  emit({ type: "order.updated", orderId, establishmentId });
  return { value: { order } };
}

export function requestAccountByStaff(
  establishmentId: string,
  tableId: string,
  actor: User,
  scope: "TABLE" | "SELF" = "TABLE",
): MutationResult<{ closingRequestId: string }> {
  const perm = assertWaiterPermission(actor, "account.request");
  if (!perm.ok) return invalid(perm.error, 403);

  const store = getStore();
  migrateOperationalCollections(store);
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa não encontrada.", 404);
  }
  const command = getActiveCommand(table);
  if (!command) return invalid("Mesa sem comanda aberta.", 409);

  const pending = Object.values(store.closingRequests).find(
    (request) => request.commandId === command.id && request.status === "PENDING",
  );
  if (pending) {
    return invalid("Já existe solicitação de conta pendente.", 409);
  }

  const participations = Object.values(store.guestParticipations).filter(
    (gp) => gp.commandId === command.id && gp.status !== "CLOSED",
  );
  const targetIds = participations.map((gp) => gp.id);

  const requestId = id("clr_");
  const now = new Date().toISOString();
  store.closingRequests[requestId] = {
    id: requestId,
    establishmentId,
    commandId: command.id,
    tableId: table.id,
    requestedByStaffUserId: actor.id,
    requestedByStaffRole: actor.role,
    scope,
    targetGuestParticipationIds: targetIds,
    status: "PENDING",
    createdAt: now,
  };

  command.status = "PAGAMENTO_SOLICITADO";
  command.closingRequestedAt = now;
  command.lastClosingScope = scope;
  table.status = "AGUARDANDO_PAGAMENTO";
  store.commands[command.id] = command;
  store.tables[table.id] = table;

  for (const gp of participations) {
    if (gp.status === "OPEN") {
      gp.status = "CLOSING_REQUESTED";
      gp.closingRequestedAt = now;
      store.guestParticipations[gp.id] = gp;
    }
  }

  notifyStaff(store, establishmentId, "closing.requested", "Conta solicitada", `Mesa ${table.number} · Garçom ${actor.name}`, {
    commandId: command.id,
    tableId: table.id,
    actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`,
    metadata: { requestedByStaffUserId: actor.id },
  });

  appendAuditEvent(store, {
    establishmentId,
    type: "account.requested",
    actorType: "STAFF",
    actorUserId: actor.id,
    targetType: "table",
    targetId: table.id,
    metadata: { commandId: command.id, scope },
  });

  saveStore(store);
  emit({ type: "command.updated", commandId: command.id, establishmentId });
  return { value: { closingRequestId: requestId } };
}

export type OperationalTable = Table & {
  commandId?: string;
  guestCount: number;
  orderCount: number;
  assignedToMe: boolean;
};

export function listOperationalTables(
  establishmentId: string,
  actor: User,
  filter: "all" | "mine" = "all",
): OperationalTable[] {
  if (actor.establishmentId !== establishmentId) return [];
  const store = getStore();
  migrateOperationalCollections(store);
  const assigned = new Set(actor.assignedTableIds || []);

  return Object.values(store.tables)
    .filter((table) => table.establishmentId === establishmentId && table.status !== "INATIVA")
    .filter((table) => filter !== "mine" || assigned.size === 0 || assigned.has(table.id))
    .sort((a, b) => Number(a.number) - Number(b.number) || a.name.localeCompare(b.name))
    .map((table) => {
      const command = getActiveCommand(table);
      const guestCount = command
        ? Object.values(store.guestParticipations).filter(
            (gp) =>
              gp.commandId === command.id &&
              gp.status !== "CLOSED" &&
              !gp.phoneLookupHash.startsWith("staff_service_"),
          ).length
        : 0;
      const orderCount = command
        ? Object.values(store.orders).filter(
            (o) => o.commandId === command.id && o.status !== "CANCELADO",
          ).length
        : 0;
      return {
        ...table,
        commandId: command?.id,
        guestCount,
        orderCount,
        assignedToMe: assigned.has(table.id),
      };
    });
}

export function assignTableToWaiter(
  establishmentId: string,
  tableId: string,
  waiterId: string,
  actorUserId: string,
): MutationResult<{ assignment: TableAssignment }> {
  const store = getStore();
  ensureWaiterCollections(store);
  const table = store.tables[tableId];
  const waiter = store.users[waiterId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa não encontrada.", 404);
  }
  if (!waiter || waiter.establishmentId !== establishmentId || waiter.role !== "WAITER") {
    return invalid("Garçom não encontrado.", 404);
  }

  const ids = new Set(waiter.assignedTableIds || []);
  ids.add(tableId);
  waiter.assignedTableIds = [...ids];
  waiter.updatedAt = new Date().toISOString();
  store.users[waiter.id] = waiter;

  const assignment: TableAssignment = {
    id: id("tas_"),
    establishmentId,
    tableId,
    waiterUserId: waiterId,
    assignedByUserId: actorUserId,
    assignedAt: new Date().toISOString(),
  };
  store.tableAssignments![assignment.id] = assignment;

  appendAuditEvent(store, {
    establishmentId,
    type: "waiter.table_assigned",
    actorType: "STAFF",
    actorUserId,
    targetType: "table",
    targetId: tableId,
    metadata: { waiterUserId: waiterId },
  });

  saveStore(store);
  return { value: { assignment } };
}

export function enrichOrderDisplay(order: Order, store: MesaFlowStore) {
  const origin = order.orderOrigin || "GUEST";
  let originLabel = "Cliente";
  if (origin === "WAITER" && order.waiterId) {
    const waiter = store.users[order.waiterId];
    originLabel = waiter ? `Garçom ${waiter.name}` : "Garçom";
  }
  return {
    ...order,
    orderOrigin: origin,
    originLabel,
  };
}

export function verifyWaiterPin(user: User, pin: string): boolean {
  if (!user.pinHash) return false;
  return verifyPassword(pin, user.pinHash);
}

export type { OrderLineInput, WaiterPermissionKey };
