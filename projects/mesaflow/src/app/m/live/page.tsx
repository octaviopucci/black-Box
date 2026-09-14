"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { CartProvider } from "@/contexts/cart-context";
import { CustomerApp } from "@/components/customer/customer-app";
import { parseMenuRoute } from "@/lib/parse-route";

function LiveMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const { slug, table } = useMemo(
    () => parseMenuRoute(pathname, search ? `?${search}` : ""),
    [pathname, search],
  );

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
