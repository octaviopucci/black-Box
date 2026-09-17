import type { OperationMode } from "./types";

export const OPERATION_MODES: {
  value: OperationMode;
  label: string;
  description: string;
}[] = [
  {
    value: "a_la_carte",
    label: "À la carte",
    description: "Pedidos por item no cardápio, cobrados na conta da mesa.",
  },
  {
    value: "rodizio",
    label: "Rodízio",
    description: "Rodadas de itens com preço por pessoa.",
  },
  {
    value: "buffet",
    label: "Buffet",
    description: "Buffet livre ou por valor fixo.",
  },
  {
    value: "self_service",
    label: "Self-service",
    description: "Cliente se serve e paga na saída.",
  },
  {
    value: "peso_kg",
    label: "Por quilo",
    description: "Cobrança por peso (kg).",
  },
  {
    value: "comanda",
    label: "Comanda",
    description: "Cada cliente identifica-se com número de comanda.",
  },
  {
    value: "personalizado",
    label: "Personalizado",
    description: "Fluxo sob medida do estabelecimento.",
  },
  {
    value: "outros",
    label: "Outros",
    description: "Outro modelo operacional.",
  },
];

export const OPERATION_MODE_VALUES = new Set<OperationMode>(
  OPERATION_MODES.map((mode) => mode.value),
);

export function isOperationMode(value: unknown): value is OperationMode {
  return typeof value === "string" && OPERATION_MODE_VALUES.has(value as OperationMode);
}

export function resolveOperationMode(
  establishment: { operationMode?: OperationMode } | null | undefined,
): OperationMode {
  return establishment?.operationMode || "a_la_carte";
}
