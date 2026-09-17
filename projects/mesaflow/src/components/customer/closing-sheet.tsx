"use client";

import { X } from "lucide-react";
import type { SoftSuggestion } from "@/lib/menu-intelligence";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";

type ClosingSheetProps = {
  suggestions: SoftSuggestion[];
  onAddContinue: (suggestion: SoftSuggestion) => void;
  onRequestBill: () => void;
  onDismiss: () => void;
};

export function ClosingSheet({
  suggestions,
  onAddContinue,
  onRequestBill,
  onDismiss,
}: ClosingSheetProps) {
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
              Algo leve pra acompanhar? Sem pressa — você escolhe.
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

        <Button className="w-full" size="lg" variant="secondary" onClick={onRequestBill}>
          Agora não, pedir a conta
        </Button>
      </div>
    </div>
  );
}
