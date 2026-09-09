"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/formatCurrency";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const savings = useCartStore((s) => s.getSavings());
  const clearCart = useCartStore((s) => s.clearCart);

  if (items.length === 0) {
    return (
      <div className="container-store py-16">
        <div className="flex flex-col items-center text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-brand-gray" />
          <h1 className="mb-2 text-2xl font-bold">Seu carrinho está vazio</h1>
          <p className="mb-6 text-brand-gray">
            Encontre seu próximo smartphone ou acessório.
          </p>
          <Button href="/">Explorar produtos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Carrinho" },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Carrinho</h1>
        <button
          onClick={clearCart}
          className="text-sm text-brand-gray hover:text-red-500"
        >
          Limpar carrinho
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={`${item.productId}-${item.color}-${item.storage}`}
              item={item}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-light p-6">
          {savings > 0 && (
            <p className="mb-2 text-sm text-green-600">
              Você economiza {formatCurrency(savings)}
            </p>
          )}
          <div className="mb-6 flex justify-between text-xl font-bold">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button href="/checkout" className="w-full">
              Finalizar pedido
            </Button>
            <Button href="/" variant="outline" className="w-full">
              Continuar comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
