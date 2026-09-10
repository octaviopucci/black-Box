"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/formatCurrency";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const savings = useCartStore((s) => s.getSavings());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div className="absolute right-0 top-0 bottom-0 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-brand-border p-4">
          <h2 className="text-lg font-bold">Carrinho</h2>
          <button onClick={closeCart} aria-label="Fechar carrinho">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-brand-gray" />
            <p className="mb-2 font-semibold">Seu carrinho está vazio</p>
            <p className="mb-6 text-sm text-brand-gray">
              Encontre seu próximo smartphone ou acessório.
            </p>
            <Button href="/" onClick={closeCart}>
              Explorar produtos
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.color}-${item.storage}`}
                  item={item}
                />
              ))}
            </div>
            <div className="border-t border-brand-border p-4">
              {savings > 0 && (
                <p className="mb-1 text-sm text-green-600">
                  Você economiza {formatCurrency(savings)}
                </p>
              )}
              <div className="mb-4 flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button href="/checkout" onClick={closeCart} className="w-full">
                  Finalizar pedido
                </Button>
                <Button
                  href="/carrinho"
                  variant="outline"
                  onClick={closeCart}
                  className="w-full"
                >
                  Ver carrinho
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
