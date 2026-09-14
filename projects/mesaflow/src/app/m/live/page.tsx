"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CartProvider } from "@/contexts/cart-context";
import { CustomerApp } from "@/components/customer/customer-app";

function LiveMenu() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const table = params.get("table") || "";

  if (!slug || !table) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface p-6 text-center text-muted">
        <p>Link inválido. Escaneie o QR Code da mesa novamente.</p>
      </div>
    );
  }

  return (
    <CartProvider>
      <CustomerApp slug={slug} tableToken={table} />
    </CartProvider>
  );
}

export default function LiveMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-surface text-muted">Carregando cardápio…</div>
      }
    >
      <LiveMenu />
    </Suspense>
  );
}
