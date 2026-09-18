"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { SoftSuggestion } from "@/lib/menu-intelligence";
import type { ClosingScope } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/cn";

type TableParticipant = {
  id: string;
  displayName: string;
  participantIndex: number;
};

type ClosingSheetProps = {
  suggestions: SoftSuggestion[];
  participantCount: number;
  participants: TableParticipant[];
  selfParticipationId?: string;
  onAddContinue: (suggestion: SoftSuggestion) => void;
  onRequestClosing: (scope: ClosingScope, targetIds?: string[]) => void;
  onDismiss: () => void;
};

export function ClosingSheet({
  suggestions,
  participantCount,
  participants,
  selfParticipationId,
  onAddContinue,
  onRequestClosing,
  onDismiss,
}: ClosingSheetProps) {
  const [scope, setScope] = useState<ClosingScope>(
    participantCount > 1 ? "SELF" : "TABLE",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const others = participants.filter((participant) => participant.id !== selfParticipationId);

  function toggleTarget(participantId: string) {
    setSelectedIds((current) =>
      current.includes(participantId)
        ? current.filter((id) => id !== participantId)
        : [...current, participantId],
    );
  }

  function submitClosing() {
    if (scope === "SELECTED") {
      onRequestClosing("SELECTED", selectedIds);
      return;
    }
    onRequestClosing(scope);
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-end bg-black/60 p-0 sm:items-center sm:justify-center sm:p-4">
      <div
        role="dialog"
        aria-labelledby="closing-sheet-title"
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface-2 p-5 shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 id="closing-sheet-title" className="text-lg font-bold">
              Antes de fechar…
            </h3>
            <p className="mt-1 text-sm text-muted">
              Algo leve pra acompanhar? Ou escolha como fechar a conta.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onDismiss}
            className="rounded-xl bg-surface-3/80 p-2 text-muted transition hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="mb-5 space-y-3">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.product.id}
                className="rounded-2xl border border-white/5 bg-surface/70 p-3"
              >
                <div className="flex items-center gap-3">
                  <ProductImage
                    src={suggestion.product.image}
                    alt={suggestion.product.name}
                    seed={suggestion.product.id}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{suggestion.product.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{suggestion.reason}</p>
                    <p className="mt-1 text-sm font-bold text-brand">
                      {formatCurrency(suggestion.product.price)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onAddContinue(suggestion)}
                  className="mt-3 w-full rounded-xl bg-brand/15 px-3 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/25"
                >
                  Adicionar e continuar pedindo
                </button>
              </li>
            ))}
          </ul>
        )}

        {participantCount > 1 && (
          <fieldset className="mb-5 space-y-2">
            <legend className="mb-2 text-sm font-semibold">Como fechar?</legend>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm",
                scope === "SELF" ? "border-brand/40 bg-brand/10" : "border-white/5",
              )}
            >
              <input
                type="radio"
                name="closing-scope"
                checked={scope === "SELF"}
                onChange={() => setScope("SELF")}
                className="accent-brand"
              />
              Só minha parte
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm",
                scope === "TABLE" ? "border-brand/40 bg-brand/10" : "border-white/5",
              )}
            >
              <input
                type="radio"
                name="closing-scope"
                checked={scope === "TABLE"}
                onChange={() => setScope("TABLE")}
                className="accent-brand"
              />
              Conta inteira da mesa ({participantCount} pessoas)
            </label>
            {others.length > 0 && (
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm",
                  scope === "SELECTED" ? "border-brand/40 bg-brand/10" : "border-white/5",
                )}
              >
                <input
                  type="radio"
                  name="closing-scope"
                  checked={scope === "SELECTED"}
                  onChange={() => setScope("SELECTED")}
                  className="accent-brand"
                />
                Dividir com pessoas selecionadas
              </label>
            )}
            {scope === "SELECTED" && (
              <div className="ml-1 space-y-2 rounded-xl bg-surface/60 p-3">
                {others.map((participant) => (
                  <label key={participant.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(participant.id)}
                      onChange={() => toggleTarget(participant.id)}
                      className="accent-brand"
                    />
                    {participant.displayName}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        )}

        <Button
          className="w-full"
          size="lg"
          variant="secondary"
          onClick={submitClosing}
          disabled={scope === "SELECTED" && selectedIds.length === 0}
        >
          {scope === "SELF" ? "Pedir fechamento da minha parte" : "Pedir a conta"}
        </Button>
      </div>
    </div>
  );
}
