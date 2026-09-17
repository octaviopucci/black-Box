"use client";

import { Banknote, Clock, ShoppingBag, Users } from "lucide-react";
import { useAdminData } from "@/hooks/use-admin-data";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

type Dash = {
  stats: {
    revenue: number;
    ordersToday: number;
    ticketAvg: number;
    tablesOccupied: number;
    tablesTotal: number;
    inPrep: number;
    pending: number;
    topProducts: { name: string; qty: number }[];
  };
  notifications: { id: string; title: string; body: string; createdAt: string }[];
};

export default function AdminDashboardPage() {
  const { data, loading, establishment } = useAdminData<Dash>();

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data.stats) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted">Não foi possível carregar o dashboard. Faça login novamente.</p>
      </div>
    );
  }

  const s = data.stats;
  const cards = [
    { label: "Faturamento hoje", value: formatCurrency(s.revenue), icon: Banknote, accent: "text-success" },
    { label: "Pedidos hoje", value: String(s.ordersToday), icon: ShoppingBag, accent: "text-brand" },
    { label: "Ticket médio", value: formatCurrency(s.ticketAvg), icon: Banknote, accent: "text-brand-soft" },
    { label: "Mesas ocupadas", value: `${s.tablesOccupied}/${s.tablesTotal}`, icon: Users, accent: "text-warning" },
    { label: "Em preparo", value: String(s.inPrep), icon: Clock, accent: "text-brand" },
    { label: "Pendentes", value: String(s.pending), icon: Clock, accent: "text-danger" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">Visão geral</h1>
        <p className="mt-1 text-muted">{establishment?.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="glass-card p-5 transition hover:border-brand/15">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted">{label}</p>
              <Icon className={cn("h-4 w-4", accent)} />
            </div>
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Mais vendidos hoje</h2>
          <ul className="space-y-3">
            {s.topProducts.map((p, i) => (
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
            {s.topProducts.length === 0 && <p className="text-muted">Sem vendas hoje ainda.</p>}
          </ul>
        </section>
        <section className="glass-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] font-semibold">Notificações</h2>
          <ul className="max-h-64 space-y-3 overflow-y-auto">
            {data.notifications.map((n) => (
              <li key={n.id} className="rounded-xl border border-white/5 bg-surface/50 p-3 text-sm">
                <p className="font-medium">{n.title}</p>
                <p className="text-muted">{n.body}</p>
              </li>
            ))}
            {data.notifications.length === 0 && <p className="text-muted">Nenhuma notificação.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}
