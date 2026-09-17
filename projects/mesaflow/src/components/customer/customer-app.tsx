"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Flame,
  Home,
  Minus,
  Phone,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { clearGuestToken, getStoredGuestToken, storeGuestToken } from "@/lib/guest-client-storage";
import {
  addCachedGuestOrder,
  consumptionTotalFor,
  mergeGuestOrders,
} from "@/lib/guest-orders-cache";
import { cn } from "@/lib/cn";
import { formatCurrency, formatTime, orderStatusLabel } from "@/lib/format";
import type { Category, Command, Establishment, Order, Product, Rodizio, Sector, Table } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import { BRAND_NAME } from "@/lib/brand";
import { lineTotal } from "@/lib/order-math";

type Tab = "menu" | "orders" | "comanda" | "rodizio";

type MenuData = {
  establishment: Establishment;
  table: Table;
  command: Command | null;
  categories: Category[];
  products: Product[];
  sectors: Sector[];
  rodizio: Rodizio | null;
  participantCount?: number;
  tableTotal?: number;
};

type TableContext = {
  establishment: Pick<Establishment, "id" | "slug" | "name" | "open" | "rodizioEnabled">;
  table: Pick<Table, "id" | "number" | "name" | "status">;
  command: Command | null;
  otpRequired: boolean;
  otpBypass?: { active: boolean; code?: string };
  hasSession: boolean;
  participantCount: number;
  tableTotal: number;
};

type GuestMe = {
  participation: {
    id: string;
    displayName: string;
    participantIndex: number;
    status: string;
    phoneDisplay: string;
    orderCount: number;
  };
  orders: Order[];
  consumptionTotal: number;
};

type GateStep = "intro" | "otp";

const STATUS_STEPS = ["NOVO", "ACEITO", "EM_PREPARO", "PRONTO", "ENTREGUE"] as const;

function apiFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const token = getStoredGuestToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(apiUrl(path), { ...init, headers, credentials: "include" });
}

export function CustomerApp({ slug, tableToken }: { slug: string; tableToken: string }) {
  const cart = useCart();
  const [context, setContext] = useState<TableContext | null>(null);
  const [data, setData] = useState<MenuData | null>(null);
  const [guestMe, setGuestMe] = useState<GuestMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [gateStep, setGateStep] = useState<GateStep>("intro");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpChallengeId, setOtpChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [availability, setAvailability] = useState<Product["availability"] | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const [itemNotes, setItemNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [rodizioPick, setRodizioPick] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    setSelectedVariantId(selected?.variants[0]?.id || "");
    setSelectedAddons({});
    setItemNotes("");
  }, [selected]);

  const loadGuest = useCallback(async () => {
    const res = await apiFetch("/guest/me");
    if (res.status === 401) {
      clearGuestToken();
      return null;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro ao carregar sessão");
    const orders = mergeGuestOrders(json.participation.id, json.orders || []);
    const next: GuestMe = {
      ...json,
      orders,
      consumptionTotal: consumptionTotalFor(orders),
    };
    setGuestMe(next);
    return next;
  }, []);

  const loadMenu = useCallback(async () => {
    const res = await apiFetch(`/menu/${slug}/${tableToken}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro ao carregar");
    setData(json);
    return json as MenuData;
  }, [slug, tableToken]);

  const loadContext = useCallback(async () => {
    const res = await apiFetch(
      `/guest/table-context?slug=${encodeURIComponent(slug)}&tableToken=${encodeURIComponent(tableToken)}`,
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro ao carregar mesa");
    setContext(json);
    return json as TableContext;
  }, [slug, tableToken]);

  const loadApp = useCallback(async () => {
    await loadMenu();
    const guest = await loadGuest();
    if (!guest) {
      setSessionReady(false);
      setGuestMe(null);
      return false;
    }
    setSessionReady(true);
    setError(null);
    return true;
  }, [loadMenu, loadGuest]);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    try {
      const ctx = await loadContext();
      const hasToken = Boolean(getStoredGuestToken());
      if (ctx.hasSession || hasToken) {
        const ok = await loadApp();
        if (!ok && hasToken) clearGuestToken();
      } else {
        setSessionReady(false);
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha de conexão");
    } finally {
      setLoading(false);
    }
  }, [loadContext, loadApp]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const refresh = useCallback(async () => {
    if (!sessionReady) return;
    try {
      const ok = await loadApp();
      if (!ok) notify("Sessão expirada. Entre novamente na mesa.", "error");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Falha ao atualizar", "error");
    }
  }, [sessionReady, loadApp, notify]);

  useRealtime(data?.establishment.id, refresh);

  async function joinMock() {
    setJoining(true);
    try {
      const res = await apiFetch("/guest/join/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, tableToken, displayName, phone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Não foi possível entrar na mesa");
      if (json.token) storeGuestToken(json.token);
      await loadApp();
      if (json.message) notify(json.message);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erro ao entrar na mesa", "error");
    } finally {
      setJoining(false);
    }
  }

  async function requestOtp() {
    setJoining(true);
    try {
      const res = await apiFetch("/guest/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, tableToken, phone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Não foi possível enviar o código");
      setOtpChallengeId(json.challengeId);
      if (json.mockCode) setOtpCode(json.mockCode);
      setGateStep("otp");
      notify("Código enviado. Verifique seu WhatsApp.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erro ao solicitar código", "error");
    } finally {
      setJoining(false);
    }
  }

  async function verifyOtp() {
    setJoining(true);
    try {
      const res = await apiFetch("/guest/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: otpChallengeId,
          code: otpCode,
          displayName,
          slug,
          tableToken,
          phone,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Código inválido");
      if (json.token) storeGuestToken(json.token);
      const ok = await loadApp();
      if (!ok) throw new Error("Sessão não iniciada. Tente entrar novamente.");
      notify(`Bem-vindo, ${json.participation.displayName}!`);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erro ao verificar código", "error");
    } finally {
      setJoining(false);
    }
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.products.filter((p) => {
      if (categoryId !== "all" && p.categoryId !== categoryId) return false;
      if (availability !== "all" && p.availability !== availability) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, categoryId, availability, search]);

  const featured = useMemo(() => data?.products.filter((p) => p.featured) || [], [data]);

  async function submitOrder() {
    if (!data || cart.lines.length === 0) return;
    for (const line of cart.lines) {
      if (line.product.variants.length > 0 && !line.variant?.id) {
        notify(`Selecione uma opção para ${line.product.name}.`, "error");
        return;
      }
    }
    setSubmitting(true);
    try {
      const res = await apiFetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.toOrderLines() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao enviar pedido");
      const order = json.order as Order;
      let participationId = guestMe?.participation.id;
      if (!participationId) {
        const guest = await loadGuest();
        participationId = guest?.participation.id;
      }
      if (participationId && order) {
        addCachedGuestOrder(participationId, order);
        setGuestMe((current) => {
          if (!current) return current;
          const orders = mergeGuestOrders(participationId, [order, ...current.orders]);
          return {
            ...current,
            orders,
            consumptionTotal: consumptionTotalFor(orders),
            participation: {
              ...current.participation,
              orderCount: Math.max(current.participation.orderCount, orders.length),
            },
          };
        });
      }
      cart.clear();
      setCartOpen(false);
      setTab("orders");
      notify(order ? `Pedido #${order.number} enviado com sucesso!` : "Pedido enviado!");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Erro ao enviar pedido", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function requestBill() {
    try {
      const response = await apiFetch("/bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, tableToken }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível solicitar a conta.");
      notify("Conta solicitada! Um atendente virá até sua mesa.");
      await refresh();
    } catch (billError) {
      notify(billError instanceof Error ? billError.message : "Erro ao solicitar a conta.", "error");
    }
  }

  async function sendRodizioRound() {
    if (!data?.rodizio) return;
    const items = Object.entries(rodizioPick)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => ({ productId, qty }));
    if (!items.length) return;
    const res = await apiFetch("/rodizio/round", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rodizioId: data.rodizio.id,
        items,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      notify(json.error || "Não foi possível enviar a rodada.", "error");
      return;
    }
    setRodizioPick({});
    notify(json.message || "Rodada enviada.");
    setTab("orders");
    refresh();
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-surface">
        <div className="mx-auto max-w-lg p-4">
          <div className="skeleton mb-4 h-20 rounded-2xl" />
          <div className="skeleton mb-6 h-11 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || (!context && !loading)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface p-6 text-center">
        <div className="glass-card max-w-sm p-8">
          <p className="text-lg font-semibold text-danger">{error || "Mesa inválida"}</p>
          <p className="mt-2 text-sm text-muted">Verifique o QR Code ou peça ajuda ao garçom.</p>
          <Button className="mt-6" onClick={bootstrap}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  if (!sessionReady && context) {
    const est = context.establishment;
    const tbl = context.table;
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-6">
        <div className="glass-card w-full max-w-sm p-8">
          <div className="mb-6 text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
              Bem-vindo ao {BRAND_NAME}
            </p>
            <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 text-3xl ring-1 ring-brand/20">
              🍽️
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-bold">{est.name}</h1>
            <p className="mt-1 text-sm text-muted">Mesa {tbl.number} · {context.participantCount} na mesa</p>
          </div>

          {gateStep === "intro" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
                  <User className="h-3.5 w-3.5" /> Seu nome (opcional)
                </span>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand/50"
                />
              </label>
              {context.otpRequired && (
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
                    <Phone className="h-3.5 w-3.5" /> WhatsApp
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand/50"
                  />
                </label>
              )}
              <Button
                className="w-full"
                size="lg"
                loading={joining}
                onClick={() => (context.otpRequired ? requestOtp() : joinMock())}
              >
                {context.otpRequired ? "Enviar código" : "Entrar na mesa"}
              </Button>
              <p className="text-center text-xs text-muted">
                {context.otpRequired
                  ? context.otpBypass?.active
                    ? `Demo: após enviar, use o código ${context.otpBypass.code} (WhatsApp real em breve).`
                    : "Enviaremos um código por WhatsApp para confirmar sua identidade."
                  : "Modo demo — sem verificação por WhatsApp."}
              </p>
            </div>
          )}

          {gateStep === "otp" && (
            <div className="space-y-4">
              {context.otpBypass?.active && (
                <p className="rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-center text-xs text-brand">
                  Demo: código <span className="font-bold tracking-widest">{context.otpBypass.code}</span>
                </p>
              )}
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted">Código de 6 dígitos</span>
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-center text-lg tracking-widest outline-none focus:border-brand/50"
                />
              </label>
              <Button className="w-full" size="lg" loading={joining} onClick={verifyOtp}>
                Confirmar e entrar
              </Button>
              <button
                type="button"
                onClick={() => setGateStep("intro")}
                className="w-full text-center text-xs font-medium text-brand"
              >
                Voltar
              </button>
            </div>
          )}
        </div>

        {toast && (
          <div className={cn("fixed left-1/2 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl", toast.tone === "success" ? "border-success/25 bg-surface-2/95 text-success" : "border-danger/25 bg-surface-2/95 text-danger")} role="status">
            {toast.tone === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
            <button aria-label="Fechar aviso" onClick={() => setToast(null)}><X className="h-4 w-4" /></button>
          </div>
        )}
      </div>
    );
  }

  if (!data) return null;

  const { establishment, table, command, categories, rodizio } = data;
  const orders = guestMe?.orders || [];
  const consumptionTotal = guestMe?.consumptionTotal || 0;

  return (
    <div className="relative mx-auto min-h-dvh max-w-lg bg-surface pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand/10 to-transparent" />
      <header className="sticky top-0 z-20 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-2xl ring-1 ring-brand/20">
            {establishment.logo}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-[family-name:var(--font-display)] text-lg font-bold">{establishment.name}</h1>
            <p className="text-xs text-muted">
              Mesa {table.number}
              {guestMe ? ` · ${guestMe.participation.displayName}` : ""}
            </p>
          </div>
        </div>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-3">
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
                tab === id ? "bg-brand text-white shadow-md shadow-brand/25" : "bg-surface-3/80 text-muted",
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
              className="w-full rounded-xl border border-white/10 bg-surface-2/80 py-3 pl-10 pr-4 text-sm outline-none backdrop-blur focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
              placeholder="Buscar no cardápio…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {featured.length > 0 && categoryId === "all" && !search && (
            <section className="mb-6">
              <h2 className="mb-3 text-sm font-semibold text-muted">Destaques</h2>
              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
                {featured.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="w-36 shrink-0 overflow-hidden rounded-2xl bg-surface-2 text-left ring-1 ring-white/5 transition active:scale-[0.98]"
                  >
                    <ProductImage
                      src={p.image}
                      alt={p.name}
                      seed={p.id}
                      width={144}
                      height={96}
                      className="h-24 w-full object-cover"
                    />
                    <div className="p-2">
                      <p className="line-clamp-2 text-xs font-semibold">{p.name}</p>
                      <p className="text-xs text-brand">{formatCurrency(p.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="scrollbar-hide mb-3 flex gap-2 overflow-x-auto">
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

          <div className="scrollbar-hide mb-4 flex gap-2 overflow-x-auto">
            {([
              ["all", "Tudo"],
              ["VITRINE", "Vitrine"],
              ["SOB_DEMANDA", "Feito na hora"],
              ["AMBOS", "Ambos"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setAvailability(value)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium",
                  availability === value ? "border-brand/40 bg-brand/10 text-brand" : "border-white/5 text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="glass-card flex w-full gap-3 p-3 text-left transition active:scale-[0.99]"
              >
                <ProductImage
                  src={p.image}
                  alt={p.name}
                  seed={p.id}
                  width={80}
                  height={80}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="line-clamp-2 text-xs text-muted">{p.description}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-medium text-muted">
                    {p.availability === "VITRINE" ? "Vitrine" : p.availability === "SOB_DEMANDA" ? "Feito na hora" : "Vitrine + cozinha"}
                  </span>
                  <p className="mt-1 text-sm font-bold text-brand">{formatCurrency(p.price)}</p>
                </div>
                <Plus className="mt-2 h-5 w-5 shrink-0 text-brand" />
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 px-5 py-12 text-center">
                <Search className="mx-auto mb-3 h-7 w-7 text-muted" />
                <p className="font-semibold">Nada encontrado</p>
                <p className="mt-1 text-xs text-muted">Tente outro nome, categoria ou disponibilidade.</p>
                <button onClick={() => { setSearch(""); setCategoryId("all"); setAvailability("all"); }} className="mt-4 text-xs font-semibold text-brand">Limpar filtros</button>
              </div>
            )}
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
              <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs text-brand">
                {command?.status || "Sem comanda"}
              </span>
            </div>
            {orders.flatMap((o) =>
              o.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-white/5 py-2 text-sm">
                  <span>{item.qty}x {item.productName}</span>
                  <span>{formatCurrency(lineTotal(item))}</span>
                </div>
              )),
            )}
            <div className="mt-4 flex items-center justify-between text-lg font-bold">
              <span>Seu total</span>
              <span className="text-brand">{formatCurrency(consumptionTotal)}</span>
            </div>
            {data.tableTotal !== undefined && data.tableTotal > consumptionTotal && (
              <p className="mt-2 text-center text-xs text-muted">
                Total da mesa: {formatCurrency(data.tableTotal)}
              </p>
            )}
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
            className="mx-4 mb-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-2xl bg-brand px-5 py-4 font-bold text-white shadow-xl shadow-brand/30"
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
          <div className="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface-2 p-5 sm:max-w-md sm:rounded-3xl">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold">{selected.name}</h3>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5" /></button>
            </div>
            <ProductImage
              src={selected.image}
              alt={selected.name}
              seed={selected.id}
              width={400}
              height={200}
              className="mb-4 h-40 w-full rounded-xl object-cover"
            />
            <p className="mb-4 text-sm text-muted">{selected.description}</p>
            {selected.variants.length > 0 && (
              <fieldset className="mb-4">
                <legend className="mb-2 text-sm font-semibold">Escolha uma opção</legend>
                <div className="grid gap-2">
                  {selected.variants.map((variant) => (
                    <label key={variant.id} className={cn("flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm", selectedVariantId === variant.id ? "border-brand/40 bg-brand/10" : "border-white/5 bg-surface")}>
                      <span className="flex items-center gap-2"><input type="radio" name="variant" value={variant.id} checked={selectedVariantId === variant.id} onChange={() => setSelectedVariantId(variant.id)} className="accent-brand" /> {variant.name}</span>
                      <span className="text-xs text-muted">{variant.priceDelta ? `${variant.priceDelta > 0 ? "+" : ""}${formatCurrency(variant.priceDelta)}` : "Incluso"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            {selected.addons.length > 0 && (
              <fieldset className="mb-4">
                <legend className="mb-2 text-sm font-semibold">Adicionais</legend>
                <div className="space-y-2">
                  {selected.addons.map((addon) => {
                    const quantity = selectedAddons[addon.id] || 0;
                    return (
                      <div key={addon.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
                        <div><p className="text-sm font-medium">{addon.name}</p><p className="text-xs text-brand">+{formatCurrency(addon.price)}</p></div>
                        <div className="flex items-center gap-2">
                          <button type="button" aria-label={`Remover ${addon.name}`} onClick={() => setSelectedAddons((current) => ({ ...current, [addon.id]: Math.max(0, quantity - 1) }))} className="rounded-lg bg-surface-3 p-2"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-5 text-center text-sm font-bold">{quantity}</span>
                          <button type="button" aria-label={`Adicionar ${addon.name}`} onClick={() => setSelectedAddons((current) => ({ ...current, [addon.id]: Math.min(addon.maxQty || 9, quantity + 1) }))} className="rounded-lg bg-brand p-2 text-white"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-medium text-muted">Observação (opcional)</span>
              <input value={itemNotes} onChange={(event) => setItemNotes(event.target.value)} maxLength={160} placeholder="Ex.: sem cebola" className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand/50" />
            </label>
            <p className="mb-4 text-xl font-bold text-brand">
              {formatCurrency(
                selected.price +
                (selected.variants.find((variant) => variant.id === selectedVariantId)?.priceDelta || 0) +
                selected.addons.reduce((total, addon) => total + addon.price * (selectedAddons[addon.id] || 0), 0),
              )}
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                if (selected.variants.length > 0 && !selectedVariantId) {
                  notify("Selecione uma opção antes de adicionar.", "error");
                  return;
                }
                const variant = selected.variants.find((item) => item.id === selectedVariantId);
                const addons = selected.addons
                  .filter((addon) => (selectedAddons[addon.id] || 0) > 0)
                  .map((addon) => ({ addonId: addon.id, name: addon.name, price: addon.price, qty: selectedAddons[addon.id] }));
                cart.add(selected, { variant, addons, notes: itemNotes.trim() || undefined });
                setSelected(null);
                notify(`${selected.name} adicionado ao carrinho.`);
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
                  {line.variant && <p className="text-xs text-muted">{line.variant.name}</p>}
                  {line.addons.length > 0 && <p className="text-xs text-muted">{line.addons.map((addon) => `${addon.qty}x ${addon.name}`).join(", ")}</p>}
                  <p className="text-sm text-brand">{formatCurrency(lineTotal({ qty: line.qty, unitPrice: line.product.price, variantDelta: line.variant?.priceDelta || 0, addons: line.addons }))}</p>
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

      {toast && (
        <div className={cn("fixed left-1/2 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl", toast.tone === "success" ? "border-success/25 bg-surface-2/95 text-success" : "border-danger/25 bg-surface-2/95 text-danger")} role="status">
          {toast.tone === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button aria-label="Fechar aviso" onClick={() => setToast(null)}><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
