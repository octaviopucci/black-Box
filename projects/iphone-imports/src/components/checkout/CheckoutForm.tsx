"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/formatCurrency";
import { buildOrderWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { CheckoutForm as CheckoutFormData } from "@/types";

const deliveryOptions = [
  "Retirada na loja",
  "Entrega — consultar região",
  "Envio por transportadora",
];

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const savings = useCartStore((s) => s.getSavings());

  const [form, setForm] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    city: "",
    state: "",
    delivery: deliveryOptions[0],
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = buildOrderWhatsAppMessage(items, subtotal, savings, form);
    window.open(getWhatsAppUrl(msg), "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="container-store py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Seu carrinho está vazio</h1>
        <p className="mb-6 text-brand-gray">
          Adicione produtos antes de finalizar o pedido.
        </p>
        <Button href="/">Explorar produtos</Button>
      </div>
    );
  }

  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Carrinho", href: "/carrinho" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mb-8 text-3xl font-bold">Finalizar pedido</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-3">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-semibold">
              Nome completo
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm focus:border-brand-black focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-semibold">
              Telefone / WhatsApp
            </label>
            <input
              id="phone"
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm focus:border-brand-black focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-semibold">
                Cidade
              </label>
              <input
                id="city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm focus:border-brand-black focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-semibold">
                Estado
              </label>
              <input
                id="state"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm focus:outline-none"
                placeholder="SP"
              />
            </div>
          </div>
          <div>
            <label htmlFor="delivery" className="mb-1 block text-sm font-semibold">
              Forma de entrega / retirada
            </label>
            <select
              id="delivery"
              value={form.delivery}
              onChange={(e) => setForm({ ...form, delivery: e.target.value })}
              className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm focus:outline-none"
            >
              {deliveryOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-semibold">
              Observações
            </label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm focus:outline-none"
              placeholder="Cor preferida, horário de entrega, etc."
            />
          </div>

          {/* Cupom demo — desativado por padrão */}
          <div className="rounded-xl border border-dashed border-brand-border p-4">
            <p className="text-xs text-brand-gray">
              Cupom de desconto disponível em versões futuras. Configure em{" "}
              <code className="text-brand-black">src/config/store.ts</code>
            </p>
          </div>

          <button type="submit" className="btn-primary w-full py-4">
            <MessageCircle className="h-5 w-5" />
            Finalizar pedido pelo WhatsApp
          </button>
        </form>

        <div className="rounded-2xl border border-brand-border bg-brand-light p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold">Resumo do pedido</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.storage}`} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-brand-gray">
                    {item.quantity}x · {[item.color, item.storage].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-brand-border pt-4">
            {savings > 0 && (
              <div className="mb-2 flex justify-between text-sm text-green-600">
                <span>Economia</span>
                <span>{formatCurrency(savings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total estimado</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <Link
            href="/carrinho"
            className="mt-4 block text-center text-sm text-brand-gray hover:text-brand-black"
          >
            Editar carrinho
          </Link>
        </div>
      </div>
    </div>
  );
}
