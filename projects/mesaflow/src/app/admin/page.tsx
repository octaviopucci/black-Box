"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Clock,
  DoorOpen,
  ShoppingBag,
  Timer,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { parseApiJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { OPERATION_MODES } from "@/lib/operation-modes";

type Period = "today" | "7d" | "30d";

type Analytics = {
  period: Period;
  operationMode: string;
  sales: {
    revenue: number;
    ordersCount: number;
    deliveredCount: number;
    ticketAvg: number;
    paymentsCollected: number;
    byTable: Array<{ tableNumber: string; revenue: number; orders: number }>;
    byOperationMode: Array<{ mode: string; revenue: number }>;
  };
  sessions: {
    active: number;
    historical: number;
    abandoned: number;
    avgAbandonmentMinutes: number;
  };
  permanence: {
    avgMinutes: number;
    distribution: Array<{ label: string; count: number }>;
  };
  occupancy: {
    tablesTotal: number;
    occupied: number;
    awaitingPayment: number;
    free: number;
    openCommands: number;
    closedCommandsPeriod: number;
  };
  payments: { confirmed: number; pending: number };
  alerts: Array<{ level: "warning" | "danger" | "info"; title: string; body: string; href?: string }>;
  topProducts: Array<{ name: string; qty: number }>;
  inPrep: number;
  pendingOrders: number;
};

type Dash = {
  establishment?: { name?: string };
  stats: {
    revenue: number;
    ordersToday: number;
    ticketAvg: number;
    tablesOccupied: number;
    tablesTotal: number;
    inPrep: number;
    pending: number;
    topProducts: { name: string; qty: number }[];
    paymentsCollected?: number;
    activeSessions?: number;
    paymentsPending?: number;
    paymentsConfirmed?: number;
  };
  analytics: Analytics;
  analyticsWeek: Analytics;
  analyticsMonth: Analytics;
  notifications: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    read: boolean;
    actionUrl?: string;
    tableId?: string;
    metadata?: Record<string, unknown>;
  }[];
};

const PERIOD_LABELS: Record<Period, string> = {
  today: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
};

function modeLabel(mode: string) {
  return OPERATION_MODES.find((entry) => entry.value === mode)?.label || mode;
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { fetchApi, session } = useAuth();
  const [period, setPeriod] = useState<Period>("today");
  const [data, setData] = useState<Dash | null>(null);
  const dataRef = useRef<Dash | null>(null);
  dataRef.current = data;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const establishmentName =
    data?.establishment?.name ?? session?.establishment.name ?? null;

  const load = useCallback(async () => {
    const isInitial = dataRef.current === null;
    if (isInitial) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const res = await fetchApi(`/admin/dashboard?scope=overview&period=${period}`);
      const json = (await parseApiJson(res)) as Dash & { error?: string };
      if (!res.ok) throw new Error(json.error || "Falha ao carregar dashboard");
      if (!json.analytics) {
        throw new Error(
          "Resposta incompleta da API (analytics ausente). Redeploy ou contate o suporte.",
        );
      }
      setData(json);
    } catch (loadError) {
      if (isInitial) setData(null);
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchApi, period]);

  useEffect(() => {
    void load();
  }, [load]);

  async function openNotification(notification: Dash["notifications"][number]) {
    await fetchApi(`/admin/notifications/${encodeURIComponent(notification.id)}/read`, {
      method: "POST",
    }).catch(() => undefined);
    await load();
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      return;
    }
    const orderId = notification.metadata?.orderId;
    if (typeof orderId === "string" && orderId) {
      router.push(`/admin/orders?order=${encodeURIComponent(orderId)}`);
      return;
    }
    if (notification.tableId) {
      router.push(`/admin/tables/cockpit?table=${encodeURIComponent(notification.tableId)}`);
    }
  }

  if (loading && !data) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">Dashboard operacional</h1>
          {establishmentName ? <p className="mt-1 text-muted">{establishmentName}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if ((error && !data) || !data?.analytics) {
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger/10 px-6 py-8 text-center">
        <p className="font-semibold text-danger">{error || "Não foi possível carregar o dashboard."}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const a = data.analytics;
  const week = data.analyticsWeek;
  const month = data.analyticsMonth;

  const kpiCards = [
    { label: "Faturamento", value: formatCurrency(a.sales.revenue), sub: PERIOD_LABELS[period], icon: Banknote, accent: "text-success" },
    { label: "Ticket médio", value: formatCurrency(a.sales.ticketAvg), sub: `${a.sales.deliveredCount} entregues`, icon: TrendingUp, accent: "text-brand" },
    { label: "Pagamentos recebidos", value: formatCurrency(a.sales.paymentsCollected), sub: "registrados no caixa", icon: Wallet, accent: "text-brand-soft" },
    { label: "Sessões ativas", value: String(a.sessions.active), sub: `${a.payments.pending} aguardando OK`, icon: Users, accent: "text-warning" },
    { label: "Mesas ocupadas", value: `${a.occupancy.occupied}/${a.occupancy.tablesTotal}`, sub: `${a.occupancy.awaitingPayment} aguardando pagamento`, icon: DoorOpen, accent: "text-brand" },
    { label: "Comandas abertas", value: String(a.occupancy.openCommands), sub: `${a.occupancy.closedCommandsPeriod} fechadas no período`, icon: ShoppingBag, accent: "text-brand" },
    { label: "Permanência média", value: formatMinutes(a.permanence.avgMinutes), sub: "sessões encerradas", icon: Timer, accent: "text-muted" },
    { label: "Em preparo / pendentes", value: `${a.inPrep} / ${a.pendingOrders}`, sub: "pedidos agora", icon: Clock, accent: "text-danger" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">Dashboard operacional</h1>
          <p className="mt-1 text-muted">{establishmentName} · modo {modeLabel(a.operationMode)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/10 bg-surface-2/60 p-1">
            {(["today", "7d", "30d"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                disabled={refreshing && period === p}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition",
                  period === p ? "bg-brand text-white shadow-md shadow-brand/20" : "text-muted hover:text-ink",
                  refreshing && period === p && "opacity-80",
                )}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
          {refreshing ? <span className="text-xs text-muted">Atualizando…</span> : null}
        </div>
      </div>

      {a.alerts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] font-semibold">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Alertas operacionais
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {a.alerts.map((alert) => (
              <div
                key={`${alert.title}-${alert.body}`}
                className={cn(
                  "rounded-2xl border p-4 text-sm",
                  alert.level === "danger" && "border-danger/25 bg-danger/10",
                  alert.level === "warning" && "border-warning/25 bg-warning/10",
                  alert.level === "info" && "border-brand/20 bg-brand/5",
                )}
              >
                <p className="font-semibold">{alert.title}</p>
                <p className="mt-1 text-muted">{alert.body}</p>
                {alert.href && (
                  <Link href={alert.href} className="mt-2 inline-block text-xs font-semibold text-brand hover:underline">
                    Ver detalhes →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className="glass-card p-5 transition hover:border-brand/15">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted">{label}</p>
              <Icon className={cn("h-4 w-4", accent)} />
            </div>
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-muted">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="glass-card p-6 lg:col-span-2">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Comparativo de vendas</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Hoje", revenue: data.stats.revenue, orders: data.stats.ordersToday },
              { label: "7 dias", revenue: week.sales.revenue, orders: week.sales.ordersCount },
              { label: "30 dias", revenue: month.sales.revenue, orders: month.sales.ordersCount },
            ].map((row) => (
              <div key={row.label} className="rounded-xl bg-surface/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{row.label}</p>
                <p className="mt-2 text-xl font-bold">{formatCurrency(row.revenue)}</p>
                <p className="text-xs text-muted">{row.orders} pedidos</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Pagamentos (clientes na mesa)</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3">
              <span className="text-sm">Confirmados</span>
              <span className="text-lg font-bold text-success">{a.payments.confirmed}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-warning/10 px-4 py-3">
              <span className="text-sm">Pendentes de OK</span>
              <span className="text-lg font-bold text-warning">{a.payments.pending}</span>
            </div>
          </div>
          <Link href="/admin/operations" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
            Abrir Controle →
          </Link>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Vendas por mesa</h2>
          <ul className="space-y-3">
            {a.sales.byTable.map((row) => (
              <li key={row.tableNumber} className="flex items-center justify-between text-sm">
                <span>Mesa {row.tableNumber}</span>
                <span className="font-medium">{formatCurrency(row.revenue)}</span>
              </li>
            ))}
            {a.sales.byTable.length === 0 && <p className="text-muted">Sem vendas no período.</p>}
          </ul>
        </section>

        <section className="glass-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Sessões e abandono</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-surface/60 p-3">
              <dt className="text-muted">Ativas agora</dt>
              <dd className="text-xl font-bold">{a.sessions.active}</dd>
            </div>
            <div className="rounded-xl bg-surface/60 p-3">
              <dt className="text-muted">Encerradas no período</dt>
              <dd className="text-xl font-bold">{a.sessions.historical}</dd>
            </div>
            <div className="rounded-xl bg-surface/60 p-3">
              <dt className="text-muted">Abandonos (kick/force)</dt>
              <dd className="text-xl font-bold text-danger">{a.sessions.abandoned}</dd>
            </div>
            <div className="rounded-xl bg-surface/60 p-3">
              <dt className="text-muted">Tempo médio até abandono</dt>
              <dd className="text-lg font-bold">{formatMinutes(a.sessions.avgAbandonmentMinutes)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Permanência na mesa</h2>
          <p className="mb-4 text-sm text-muted">
            Média no período: <strong className="text-ink">{formatMinutes(a.permanence.avgMinutes)}</strong>
          </p>
          <ul className="space-y-2">
            {a.permanence.distribution.map((bucket) => (
              <li key={bucket.label} className="flex items-center gap-3 text-sm">
                <span className="w-20 shrink-0 text-muted">{bucket.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{
                      width: `${Math.min(100, (bucket.count / Math.max(1, a.sessions.historical)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-medium">{bucket.count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Mais vendidos</h2>
          <ul className="space-y-3">
            {a.topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-xs font-bold text-brand">
                    {i + 1}
                  </span>
                  {p.name}
                </span>
                <span className="text-muted">{p.qty} un.</span>
              </li>
            ))}
            {a.topProducts.length === 0 && <p className="text-muted">Sem vendas no período.</p>}
          </ul>
        </section>
      </div>

      <section className="mt-8 glass-card p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Notificações recentes</h2>
        <ul className="max-h-64 space-y-3 overflow-y-auto">
          {data.notifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => openNotification(n)}
                className={cn(
                  "w-full rounded-xl border p-3 text-left text-sm transition hover:border-brand/20",
                  n.read ? "border-white/5 bg-surface/30" : "border-brand/20 bg-brand/5",
                )}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-muted">{n.body}</p>
              </button>
            </li>
          ))}
          {data.notifications.length === 0 && <p className="text-muted">Nenhuma notificação.</p>}
        </ul>
      </section>
    </div>
  );
}
