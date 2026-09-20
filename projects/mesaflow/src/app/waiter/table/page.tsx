"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { WaiterActionButton, WaiterAccountIcon } from "@/components/waiter/waiter-shell";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Category, Order, Product } from "@/lib/types";

type CartLine = { product: Product; qty: number; notes?: string };

function WaiterTableContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("id") || "";
  const { fetchApi } = useAuth();
  const [tab, setTab] = useState<"order" | "orders" | "account">("order");
  const [table, setTable] = useState<{ id: string; number: string; name: string; status: string; commandId?: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!tableId) return;
    setLoading(true);
    try {
      const tablesRes = await fetchApi("/admin/tables?operational=1");
      const tablesJson = await tablesRes.json();
      const found = (tablesJson.tables || []).find((t: { id: string }) => t.id === tableId);
      setTable(found || null);

      if (found?.commandId) {
        const ordersResponse = await fetchApi(`/admin/orders?commandId=${encodeURIComponent(found.commandId)}`);
        const ordersJson = await ordersResponse.json();
        setOrders(ordersJson.orders || []);
      } else {
        setOrders([]);
      }

      const productsRes = await fetchApi("/admin/products");
      const productsJson = await productsRes.json();
      setProducts((productsJson.products || []).filter((p: Product) => p.active));
      setCategories(productsJson.categories || []);
    } catch {
      setError("Falha ao carregar mesa");
    } finally {
      setLoading(false);
    }
  }, [fetchApi, tableId]);

  useEffect(() => {
    void load();
  }, [load]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.price * line.qty, 0),
    [cart],
  );

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((line) => line.product.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.product.id === productId ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  }

  async function submitOrder() {
    if (!tableId || !cart.length) return;
    setBusy(true);
    setError("");
    setFeedback("");
    const items = cart.map((line) => ({ productId: line.product.id, qty: line.qty, notes: line.notes }));
    const res = await fetchApi("/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId, items, serviceType: "COMER_AQUI" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao enviar pedido");
      setBusy(false);
      return;
    }
    setCart([]);
    setFeedback(`Pedido #${json.order?.number} enviado`);
    setBusy(false);
    void load();
  }

  async function requestAccount() {
    if (!tableId) return;
    setBusy(true);
    setError("");
    const res = await fetchApi(`/admin/tables/${tableId}/request-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope: "TABLE" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao pedir conta");
    } else {
      setFeedback("Conta solicitada");
      void load();
    }
    setBusy(false);
  }

  if (!tableId) {
    return <p className="text-muted">Mesa inválida.</p>;
  }

  if (loading && !table) {
    return <p className="text-muted py-8 text-center">Carregando…</p>;
  }

  return (
    <div className="space-y-4">
      <Link href="/waiter" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div>
        <h1 className="text-xl font-bold">Mesa {table?.number}</h1>
        <p className="text-sm text-muted">{table?.name}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["order", "orders", "account"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "min-h-11 rounded-xl border text-sm font-medium",
              tab === value ? "border-brand bg-brand/15 text-brand" : "border-white/10 text-muted",
            )}
          >
            {value === "order" ? "Pedir" : value === "orders" ? "Pedidos" : "Conta"}
          </button>
        ))}
      </div>

      {feedback && <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{feedback}</p>}
      {error && <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

      {tab === "order" && (
        <div className="space-y-4">
          <div className="grid gap-2">
            {products.slice(0, 12).map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left active:bg-white/5"
              >
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-brand">{formatCurrency(product.price)}</span>
              </button>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="sticky bottom-20 space-y-3 rounded-2xl border border-brand/20 bg-background p-4 shadow-xl">
              <p className="font-semibold">Carrinho · {formatCurrency(cartTotal)}</p>
              {cart.map((line) => (
                <div key={line.product.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex-1 truncate">{line.product.name}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => changeQty(line.product.id, -1)} className="rounded-lg border border-white/10 p-1">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center">{line.qty}</span>
                    <button type="button" onClick={() => changeQty(line.product.id, 1)} className="rounded-lg border border-white/10 p-1">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <WaiterActionButton onClick={() => void submitOrder()} disabled={busy}>
                Enviar pedido
              </WaiterActionButton>
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">#{order.number}</p>
                <span className="text-xs text-muted">{(order as Order & { originLabel?: string }).originLabel || order.orderOrigin || "Cliente"}</span>
              </div>
              <p className="text-sm text-muted">{formatCurrency(order.total)}</p>
            </div>
          ))}
          {!orders.length && <p className="text-sm text-muted">Nenhum pedido nesta mesa.</p>}
        </div>
      )}

      {tab === "account" && (
        <div className="space-y-3">
          <p className="text-sm text-muted">Solicite a conta para o caixa. O histórico permanece na comanda.</p>
          <WaiterActionButton onClick={() => void requestAccount()} disabled={busy}>
            <WaiterAccountIcon /> Pedir conta
          </WaiterActionButton>
        </div>
      )}
    </div>
  );
}

export default function WaiterTablePage() {
  return (
    <Suspense fallback={<p className="text-muted py-8 text-center">Carregando…</p>}>
      <WaiterTableContent />
    </Suspense>
  );
}
