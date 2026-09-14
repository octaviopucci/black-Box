"use client";

import { useCallback, useEffect, useState } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { DEMO_ESTABLISHMENT_ID, DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";

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
  const [data, setData] = useState<Dash | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(apiUrl(`/admin/dashboard?slug=${DEMO_ESTABLISHMENT_SLUG}`));
    const json = await res.json();
    setData(json);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(DEMO_ESTABLISHMENT_ID, load);

  if (!data) return <p className="text-muted">Carregando dashboard…</p>;

  const s = data.stats;
  const cards = [
    { label: "Faturamento hoje", value: formatCurrency(s.revenue) },
    { label: "Pedidos hoje", value: String(s.ordersToday) },
    { label: "Ticket médio", value: formatCurrency(s.ticketAvg) },
    { label: "Mesas ocupadas", value: `${s.tablesOccupied}/${s.tablesTotal}` },
    { label: "Em preparo", value: String(s.inPrep) },
    { label: "Pendentes", value: String(s.pending) },
  ];

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/5 bg-surface-2 p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/5 bg-surface-2 p-5">
          <h2 className="mb-4 font-semibold">Mais vendidos hoje</h2>
          <ul className="space-y-2">
            {s.topProducts.map((p) => (
              <li key={p.name} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-muted">{p.qty} un.</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-white/5 bg-surface-2 p-5">
          <h2 className="mb-4 font-semibold">Notificações</h2>
          <ul className="max-h-64 space-y-3 overflow-y-auto">
            {data.notifications.map((n) => (
              <li key={n.id} className="rounded-xl bg-surface p-3 text-sm">
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
