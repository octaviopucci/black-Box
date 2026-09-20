"use client";

import { Minus, Plus } from "lucide-react";
import type { SoftSuggestion } from "@/lib/menu-intelligence";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";
import { hasProductImage, ProductVisual } from "@/components/ui/product-image";

type SoftSuggestionsProps = {
  suggestions: SoftSuggestion[];
  /** Modo carrinho/fechamento: botão Adicionar (pode abrir sheet ou nova linha). */
  onAdd?: (suggestion: SoftSuggestion) => void;
  /** Modo sheet do produto: +/- inline como adicionais — nunca abre outro sheet. */
  quantities?: Record<string, number>;
  onQtyChange?: (productId: string, qty: number) => void;
  categoryEmoji?: (product: Product) => string | undefined;
  title?: string;
  compact?: boolean;
  className?: string;
};

export function SoftSuggestions({
  suggestions,
  onAdd,
  quantities,
  onQtyChange,
  categoryEmoji,
  title,
  compact = false,
  className,
}: SoftSuggestionsProps) {
  const inlineQty = Boolean(quantities && onQtyChange);
  if (!suggestions.length) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-surface/60 p-3 transition-opacity duration-300",
        className,
      )}
    >
      {title ? (
        <p className="mb-2.5 text-xs font-semibold tracking-wide text-muted">{title}</p>
      ) : null}
      <ul className={cn("space-y-2", compact && "space-y-1.5")}>
        {suggestions.map((suggestion) => {
          const { product, reason } = suggestion;
          const emoji = categoryEmoji?.(product);
          return (
            <li
              key={product.id}
              className="flex items-center gap-2.5 rounded-xl bg-surface/80 px-2 py-2 transition-colors duration-200 hover:bg-surface-3/60"
            >
              {!compact && (
                <ProductVisual
                  src={product.image}
                  alt={product.name}
                  categoryEmoji={emoji}
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-lg object-cover"
                  emojiClassName="h-11 w-11 shrink-0 text-2xl"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {compact && emoji && !hasProductImage(product.image) ? (
                    <span className="mr-1" aria-hidden>
                      {emoji}
                    </span>
                  ) : null}
                  {product.name}
                </p>
                <p className="truncate text-[11px] text-muted">{reason}</p>
                <p className="text-xs font-semibold text-brand">{formatCurrency(product.price)}</p>
              </div>
              {inlineQty ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Remover ${product.name}`}
                    onClick={() => onQtyChange!(product.id, (quantities![product.id] || 0) - 1)}
                    className="rounded-lg bg-surface-3 p-2"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{quantities![product.id] || 0}</span>
                  <button
                    type="button"
                    aria-label={`Adicionar ${product.name}`}
                    onClick={() => onQtyChange!(product.id, (quantities![product.id] || 0) + 1)}
                    className="rounded-lg bg-brand p-2 text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onAdd?.(suggestion)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand/15 px-2.5 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/25"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
