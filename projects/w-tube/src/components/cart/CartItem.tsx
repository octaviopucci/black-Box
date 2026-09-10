"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { useCartStore } from "@/store/cart";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 border-b border-brand-border py-4">
      <Link
        href={`/produto/${item.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-light"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-contain p-2"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/produto/${item.slug}`}
          className="truncate text-sm font-semibold hover:underline"
        >
          {item.name}
        </Link>
        {(item.color || item.storage) && (
          <p className="text-xs text-brand-gray">
            {[item.color, item.storage].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-1 text-sm font-bold">
          {formatCurrency(item.price)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.quantity - 1,
                  item.color,
                  item.storage
                )
              }
              className="rounded-lg border border-brand-border p-1 hover:bg-brand-light"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.quantity + 1,
                  item.color,
                  item.storage
                )
              }
              className="rounded-lg border border-brand-border p-1 hover:bg-brand-light"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() =>
              removeItem(item.productId, item.color, item.storage)
            }
            className="text-brand-gray hover:text-red-500"
            aria-label="Remover item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
