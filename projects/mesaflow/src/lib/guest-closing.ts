import { id } from "@/lib/crypto-utils";
import { emit } from "@/lib/events";
import { getStore, saveStore } from "@/lib/store";
import { migrateOperationalCollections, notifyStaff } from "@/lib/store-operations";
import type {
  ClosingRequest,
  ClosingScope,
  Command,
  GuestParticipation,
  MesaFlowStore,
  Table,
} from "@/lib/types";

type MutationError = { error: string; status: number };
type MutationResult<T> = { value: T } | MutationError;

function invalid(error: string, status = 400): MutationError {
  return { error, status };
}

function activeParticipations(store: MesaFlowStore, commandId: string) {
  return Object.values(store.guestParticipations).filter(
    (gp) => gp.commandId === commandId && gp.status !== "CLOSED",
  );
}

function pendingRequestForParticipation(
  store: MesaFlowStore,
  commandId: string,
  participationId: string,
): ClosingRequest | null {
  return (
    Object.values(store.closingRequests).find(
      (request) =>
        request.commandId === commandId &&
        request.status === "PENDING" &&
        (request.requestedByGuestParticipationId === participationId ||
          request.targetGuestParticipationIds.includes(participationId)),
    ) || null
  );
}

function markParticipationsClosing(
  store: MesaFlowStore,
  participationIds: string[],
  closing: boolean,
) {
  const now = new Date().toISOString();
  for (const participationId of participationIds) {
    const participation = store.guestParticipations[participationId];
    if (!participation || participation.status === "CLOSED") continue;
    if (closing) {
      participation.status = "CLOSING_REQUESTED";
      participation.closingRequestedAt = now;
    } else if (participation.status === "CLOSING_REQUESTED") {
      participation.status = "OPEN";
      participation.closingRequestedAt = undefined;
    }
    store.guestParticipations[participationId] = participation;
  }
}

function applyTableClosingState(
  store: MesaFlowStore,
  command: Command,
  table: Table,
  closing: boolean,
) {
  if (closing) {
    command.status = "PAGAMENTO_SOLICITADO";
    command.closingRequestedAt = command.closingRequestedAt || new Date().toISOString();
    command.lastClosingScope = "TABLE";
    table.status = "AGUARDANDO_PAGAMENTO";
  } else {
    const hasPending = Object.values(store.closingRequests).some(
      (request) => request.commandId === command.id && request.status === "PENDING",
    );
    const anyClosing = activeParticipations(store, command.id).some(
      (gp) => gp.status === "CLOSING_REQUESTED",
    );
    if (!hasPending && !anyClosing) {
      command.status = "ABERTA";
      command.closingRequestedAt = undefined;
      command.lastClosingScope = undefined;
      if (table.status === "AGUARDANDO_PAGAMENTO") {
        table.status = "OCUPADA";
      }
    }
  }
  store.commands[command.id] = command;
  store.tables[table.id] = table;
}

export function getGuestClosingStatus(participationId: string) {
  const store = getStore();
  migrateOperationalCollections(store);
  const participation = store.guestParticipations[participationId];
  if (!participation) return null;

  const pending = Object.values(store.closingRequests)
    .filter(
      (request) =>
        request.commandId === participation.commandId &&
        request.status === "PENDING",
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const ownRequest =
    pending.find((request) => request.requestedByGuestParticipationId === participationId) ||
    pending.find((request) => request.targetGuestParticipationIds.includes(participationId)) ||
    null;

  return {
    participationStatus: participation.status,
    pendingRequest: ownRequest,
    canCancel:
      participation.status === "CLOSING_REQUESTED" &&
      Boolean(
        ownRequest &&
          ownRequest.requestedByGuestParticipationId === participationId &&
          ownRequest.status === "PENDING",
      ),
    canOrder: participation.status === "OPEN",
  };
}

export function requestGuestClosing(
  participationId: string,
  scope: ClosingScope,
  targetGuestParticipationIds: string[] = [],
): MutationResult<{ closingRequest: ClosingRequest; participation: GuestParticipation }> {
  const store = getStore();
  migrateOperationalCollections(store);
  const participation = store.guestParticipations[participationId];
  if (!participation) return invalid("Participação não encontrada.", 404);
  if (participation.status === "CLOSED") {
    return invalid("Participação já encerrada.", 409);
  }
  if (participation.status === "CLOSING_REQUESTED") {
    const existing = pendingRequestForParticipation(
      store,
      participation.commandId,
      participationId,
    );
    if (existing) {
      return { value: { closingRequest: existing, participation } };
    }
    return invalid("Fechamento já solicitado.", 409);
  }
  if (participation.status !== "OPEN") {
    return invalid("Participação não permite solicitar fechamento.", 409);
  }

  const command = store.commands[participation.commandId];
  if (!command || command.status === "FECHADA") {
    return invalid("Comanda indisponível.", 409);
  }
  const table = store.tables[participation.tableId];
  if (!table) return invalid("Mesa não encontrada.", 404);

  const active = activeParticipations(store, command.id);
  let targetIds: string[] = [];

  if (scope === "SELF") {
    targetIds = [participationId];
  } else if (scope === "TABLE") {
    targetIds = active.map((gp) => gp.id);
    if (targetIds.length === 0) targetIds = [participationId];
  } else if (scope === "SELECTED") {
    const unique = [...new Set([participationId, ...targetGuestParticipationIds])];
    const invalidTarget = unique.find(
      (targetId) => !active.some((gp) => gp.id === targetId),
    );
    if (invalidTarget) return invalid("Participante selecionado inválido.", 400);
    if (unique.length < 2) {
      return invalid("Selecione ao menos um participante além de você.", 400);
    }
    targetIds = unique;
  } else {
    return invalid("Escopo de fechamento inválido.", 400);
  }

  const duplicate = Object.values(store.closingRequests).find(
    (request) =>
      request.commandId === command.id &&
      request.status === "PENDING" &&
      request.scope === scope &&
      request.requestedByGuestParticipationId === participationId &&
      request.targetGuestParticipationIds.length === targetIds.length &&
      request.targetGuestParticipationIds.every((id) => targetIds.includes(id)),
  );
  if (duplicate) {
    markParticipationsClosing(store, targetIds, true);
    saveStore(store);
    return { value: { closingRequest: duplicate, participation: store.guestParticipations[participationId] } };
  }

  const now = new Date().toISOString();
  const closingRequest: ClosingRequest = {
    id: id("clr_"),
    establishmentId: participation.establishmentId,
    commandId: command.id,
    tableId: table.id,
    requestedByGuestParticipationId: participationId,
    scope,
    targetGuestParticipationIds: targetIds,
    status: "PENDING",
    createdAt: now,
  };
  store.closingRequests[closingRequest.id] = closingRequest;

  markParticipationsClosing(store, targetIds, true);
  if (scope === "TABLE") {
    applyTableClosingState(store, command, table, true);
  }

  const displayName =
    participation.displayName?.trim() || `Participante ${participation.participantIndex}`;
  notifyStaff(
    store,
    participation.establishmentId,
    "closing.requested",
    scope === "TABLE" ? "Conta da mesa solicitada" : "Fechamento parcial solicitado",
    `${displayName} · Mesa ${table.number}`,
    {
      commandId: command.id,
      tableId: table.id,
      actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`,
      metadata: { scope, closingRequestId: closingRequest.id },
    },
  );

  saveStore(store);
  emit({
    type: "command.updated",
    commandId: command.id,
    establishmentId: participation.establishmentId,
  });

  return {
    value: {
      closingRequest,
      participation: store.guestParticipations[participationId],
    },
  };
}

export function cancelGuestClosing(
  participationId: string,
): MutationResult<{ participation: GuestParticipation; cancelled: boolean }> {
  const store = getStore();
  migrateOperationalCollections(store);
  const participation = store.guestParticipations[participationId];
  if (!participation) return invalid("Participação não encontrada.", 404);
  if (participation.status !== "CLOSING_REQUESTED") {
    return { value: { participation, cancelled: false } };
  }

  const request = Object.values(store.closingRequests).find(
    (entry) =>
      entry.commandId === participation.commandId &&
      entry.status === "PENDING" &&
      entry.requestedByGuestParticipationId === participationId,
  );
  if (!request) {
    return invalid("Somente quem solicitou pode cancelar o fechamento.", 403);
  }

  request.status = "CANCELLED";
  request.cancelledAt = new Date().toISOString();
  store.closingRequests[request.id] = request;

  markParticipationsClosing(store, request.targetGuestParticipationIds, false);

  const command = store.commands[participation.commandId];
  const table = store.tables[participation.tableId];
  if (command && table && request.scope === "TABLE") {
    applyTableClosingState(store, command, table, false);
  }

  saveStore(store);
  if (command) {
    emit({
      type: "command.updated",
      commandId: command.id,
      establishmentId: participation.establishmentId,
    });
  }

  return {
    value: {
      participation: store.guestParticipations[participationId],
      cancelled: true,
    },
  };
}
