"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Flame,
  Home,
  Minus,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useRealtime } from "@/hooks/use-realtime";
import { cn } from "@/lib/cn";
import { formatCurrency, formatTime, orderStatusLabel } from "@/lib/format";
import type { Category, Command, Establishment, Order, Product, Rodizio, Sector, Table } from "@/lib/types";
import { Button } from "@/components/ui/button";

type Tab = "menu" | "orders" | "comanda" | "rodizio";

type MenuData = {
  establishment: Establishment;
  table: Table;
  command: Command;
  categories: Category[];
  products: Product[];
  sectors: Sector[];
  orders: Order[];
  rodizio: Rodizio | null;
};

const STATUS_STEPS = ["NOVO", "ACEITO", "EM_PREPARO", "PRONTO", "ENTREGUE"] as const;

export function CustomerApp({ slug, tableToken }: { slug: string; tableToken: string }) {
  const cart = useCart();
  const [data, setData] = useState<MenuData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("menu");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [rodizioPick, setRodizioPick] = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/menu/${slug}/${tableToken}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao carregar");
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha de conexão");
    } finally {
      setLoading(false);
    }
  }, [slug, tableToken]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(data?.establishment.id, load);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.products.filter((p) => {
      if (categoryId !== "all" && p.categoryId !== categoryId) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, categoryId, search]);

  const featured = useMemo(() => data?.products.filter((p) => p.featured) || [], [data]);

  async function submitOrder() {
    if (!data || cart.lines.length === 0) return;
    setSubmitting(true);
    try {
      const sectors = Object.fromEntries(
        data.sectors.map((s) => [s.id, { name: s.name }]),
      );
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          tableToken,
          items: cart.toOrderItems(sectors),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      cart.clear();
      setCartOpen(false);
      setTab("orders");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao enviar pedido");
    } finally {
      setSubmitting(false);
    }
  }

  async function requestBill() {
    await fetch("/api/bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, tableToken }),
    });
    alert("Conta solicitada! Um atendente virá até sua mesa.");
    load();
  }

  async function sendRodizioRound() {
    if (!data?.rodizio) return;
    const items = Object.entries(rodizioPick)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => {
        const p = data.products.find((x) => x.id === productId)!;
        return {
          id: `oi_rod_${productId}`,
          productId: p.id,
          productName: p.name,
          sectorId: p.sectorId,
          sectorName: "Cozinha",
          qty,
          unitPrice: p.rodizioPremiumPrice || 0,
          variantDelta: 0,
          addons: [],
          status: "NOVO" as const,
        };
      });
    if (!items.length) return;
    const res = await fetch("/api/rodizio/round", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        tableToken,
        rodizioId: data.rodizio.id,
        items,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error);
      return;
    }
    setRodizioPick({});
    alert(json.message);
    setTab("orders");
    load();
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface text-muted">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p>Carregando cardápio…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-semibold text-danger">{error || "Mesa inválida"}</p>
        <Button onClick={load}>Tentar novamente</Button>
      </div>
    );
  }

  const { establishment, table, command, categories, orders, rodizio } = data;

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-surface pb-28">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-surface/95 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="text-3xl">{establishment.logo}</span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-[family-name:var(--font-display)] text-lg font-bold">{establishment.name}</h1>
            <p className="text-xs text-muted">Mesa {table.number} · Comanda aberta</p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3">
          {(
            [
              ["menu", "Cardápio", Home],
              ["orders", "Meu pedido", ShoppingBag],
              ["comanda", "Comanda", Receipt],
              ...(rodizio ? [["rodizio", "Rodízio", Flame] as const] : []),
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                tab === id ? "bg-brand text-white" : "bg-surface-3 text-muted",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {tab === "menu" && (
        <div className="px-4 pt-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="w-full rounded-xl border border-white/10 bg-surface-2 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand"
              placeholder="Buscar no cardápio…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {featured.length > 0 && categoryId === "all" && !search && (
            <section className="mb-6">
              <h2 className="mb-3 text-sm font-semibold text-muted">Destaques</h2>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {featured.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="w-36 shrink-0 overflow-hidden rounded-2xl bg-surface-2 text-left"
                  >
                    {p.image && (
                      <Image src={p.image} alt="" width={144} height={96} className="h-24 w-full object-cover" />
                    )}
                    <div className="p-2">
                      <p className="line-clamp-2 text-xs font-semibold">{p.name}</p>
                      <p className="text-xs text-brand">{formatCurrency(p.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="mb-4 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setCategoryId("all")}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                categoryId === "all" ? "bg-brand text-white" : "bg-surface-3",
              )}
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                  categoryId === c.id ? "bg-brand text-white" : "bg-surface-3",
                )}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="flex w-full gap-3 rounded-2xl bg-surface-2 p-3 text-left"
              >
                {p.image && (
                  <Image src={p.image} alt="" width={80} height={80} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="line-clamp-2 text-xs text-muted">{p.description}</p>
                  <p className="mt-1 text-sm font-bold text-brand">{formatCurrency(p.price)}</p>
                </div>
                <Plus className="mt-2 h-5 w-5 shrink-0 text-brand" />
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4 p-4">
          {orders.length === 0 ? (
            <p className="py-12 text-center text-muted">Nenhum pedido ainda. Explore o cardápio!</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-surface-2 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold">Pedido #{order.number}</span>
                  <span className="text-xs text-muted">{formatTime(order.createdAt)}</span>
                </div>
                <div className="mb-4 flex justify-between gap-1">
                  {STATUS_STEPS.map((s, i) => {
                    const idx = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);
                    const active = i <= idx;
                    return (
                      <div key={s} className="flex-1 text-center">
                        <div
                          className={cn(
                            "mx-auto mb-1 h-2 w-2 rounded-full",
                            active ? "bg-brand" : "bg-surface-3",
                          )}
                        />
                        <p className="text-[9px] leading-tight text-muted">{orderStatusLabel(s)}</p>
                      </div>
                    );
                  })}
                </div>
                <ul className="space-y-1 text-sm">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.qty}x {item.productName}
                      {item.notes && <span className="text-muted"> · {item.notes}</span>}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-right font-semibold text-brand">{formatCurrency(order.total)}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "comanda" && (
        <div className="p-4">
          <div className="rounded-2xl bg-surface-2 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Comanda · Mesa {table.number}</h2>
              <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs text-brand">{command.status}</span>
            </div>
            {orders.flatMap((o) =>
              o.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-white/5 py-2 text-sm">
                  <span>{item.qty}x {item.productName}</span>
                  <span>{formatCurrency(item.qty * (item.unitPrice + item.variantDelta))}</span>
                </div>
              )),
            )}
            <div className="mt-4 flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand">{formatCurrency(command.total)}</span>
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={requestBill}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Pedir a conta
            </Button>
          </div>
        </div>
      )}

      {tab === "rodizio" && rodizio && (
        <div className="p-4">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-brand/30 to-surface-2 p-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">{rodizio.name}</h2>
            <p className="text-sm text-muted">{formatCurrency(rodizio.pricePerPerson)} por pessoa</p>
            <p className="mt-1 text-xs text-muted">
              Até {rodizio.maxItemsPerRound} itens por rodada · mín. {rodizio.minIntervalSec / 60} min entre rodadas
            </p>
          </div>
          <div className="space-y-2">
            {data.products
              .filter((p) => rodizio.productIds.includes(p.id))
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-surface-2 p-3">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    {p.rodizioPremiumPrice && (
                      <p className="text-xs text-warning">Premium +{formatCurrency(p.rodizioPremiumPrice)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg bg-surface-3 p-2"
                      onClick={() =>
                        setRodizioPick((prev) => ({
                          ...prev,
                          [p.id]: Math.max(0, (prev[p.id] || 0) - 1),
                        }))
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{rodizioPick[p.id] || 0}</span>
                    <button
                      className="rounded-lg bg-brand p-2 text-white"
                      onClick={() =>
                        setRodizioPick((prev) => ({
                          ...prev,
                          [p.id]: Math.min(rodizio.maxItemsPerRound, (prev[p.id] || 0) + 1),
                        }))
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={sendRodizioRound}>
            Enviar rodada (
            {Object.values(rodizioPick).reduce((a, b) => a + b, 0)} itens)
          </Button>
        </div>
      )}

      {cart.count > 0 && tab === "menu" && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg safe-bottom">
          <button
            onClick={() => setCartOpen(true)}
            className="mx-4 mb-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-2xl bg-brand px-5 py-4 font-bold text-white shadow-lg"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Ver carrinho ({cart.count})
            </span>
            <span>{formatCurrency(cart.total)}</span>
          </button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/60 p-0 sm:items-center sm:justify-center sm:p-4">
          <div className="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-surface-2 p-5 sm:max-w-md sm:rounded-3xl">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold">{selected.name}</h3>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5" /></button>
            </div>
            {selected.image && (
              <Image src={selected.image} alt="" width={400} height={200} className="mb-4 h-40 w-full rounded-xl object-cover" />
            )}
            <p className="mb-4 text-sm text-muted">{selected.description}</p>
            <p className="mb-4 text-xl font-bold text-brand">{formatCurrency(selected.price)}</p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                cart.add(selected);
                setSelected(null);
              }}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60">
          <div className="max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl bg-surface p-5 safe-bottom">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Seu carrinho</h3>
              <button onClick={() => setCartOpen(false)}><X /></button>
            </div>
            {cart.lines.map((line) => (
              <div key={line.key} className="mb-3 flex items-center justify-between rounded-xl bg-surface-2 p-3">
                <div>
                  <p className="font-medium">{line.product.name}</p>
                  <p className="text-sm text-brand">{formatCurrency(line.product.price * line.qty)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => cart.updateQty(line.key, line.qty - 1)} className="rounded-lg bg-surface-3 p-2">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center">{line.qty}</span>
                  <button onClick={() => cart.updateQty(line.key, line.qty + 1)} className="rounded-lg bg-brand p-2 text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <Button className="mt-4 w-full" size="lg" loading={submitting} onClick={submitOrder} disabled={submitting}>
              Confirmar pedido · {formatCurrency(cart.total)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
