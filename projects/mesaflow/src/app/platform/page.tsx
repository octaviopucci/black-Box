"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Clock,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react";
import { usePlatformAuth } from "@/contexts/platform-auth-context";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { PLAN_LABELS } from "@/lib/platform-plans";
import type { PlatformPlan } from "@/lib/types";

type Period = "today" | "7d" | "30d";

type Dashboard = {
  period: Period;
  totals: {
    merchants: number;
    active: number;
    inactive: number;
    suspended: number;
    dormant: number;
    newInPeriod: number;
    totalTables: number;
    totalOrdersPeriod: number;
    totalRevenuePeriod: number;
    totalSessionsPeriod: number;
    arrEstimate: number;
  };
  byPlan: Record<PlatformPlan, number>;
  recentSignups: Array<{
    id: string;
    name: string;
    slug: string;
    plan: PlatformPlan;
    createdAt: string;
    ownerEmail?: string;
  }>;
  dormantMerchants: Array<{
    id: string;
    name: string;
    slug: string;
    inactiveDays: number | null;
    lastActivityAt: string | null;
    plan: PlatformPlan;
  }>;
  topMerchantsByRevenue: Array<{
    id: string;
    name: string;
    slug: string;
    revenue30d: number;
    plan: PlatformPlan;
  }>;
};

const PERIOD_LABELS: Record<Period, string> = {
  today: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
};

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const tones = {
    default: "text-indigo-300 bg-indigo-500/10 ring-indigo-500/20",
    success: "text-success bg-success/10 ring-success/20",
    warning: "text-warning bg-warning/10 ring-warning/20",
    danger: "text-danger bg-danger/10 ring-danger/20",
  };
  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export default function PlatformDashboardPage() {
  const { authHeaders } = usePlatformAuth();
  const [period, setPeriod] = useState<Period>("30d");
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiUrl(`/platform/dashboard?period=${period}`), {
      headers: authHeaders(),
    });
    const json = await res.json();
    if (res.ok) setData(json);
    setLoading(false);
  }, [authHeaders, period]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return <p className="text-sm text-muted">Carregando métricas da plataforma…</p>;
  }

  if (!data) {
    return <p className="text-sm text-danger">Não foi possível carregar o dashboard.</p>;
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink">Visão geral da plataforma</h2>
          <p className="mt-1 text-sm text-muted">
            Lojistas, receita gerada nos apps e saúde operacional agregada.
          </p>
        </div>
        <div className="flex rounded-xl border border-white/5 bg-surface-2 p-1">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                period === p ? "bg-indigo-500/20 text-indigo-200" : "text-muted hover:text-ink",
              )}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Lojistas" value={data.totals.merchants} hint={`${data.totals.active} ativos`} icon={Building2} />
        <StatCard
          label="Novos no período"
          value={data.totals.newInPeriod}
          icon={UserPlus}
          tone="success"
        />
        <StatCard
          label="ARR estimado"
          value={formatCurrency(data.totals.arrEstimate)}
          hint="Planos ativos × preço anual"
          icon={Wallet}
        />
        <StatCard
          label="Sem atividade (14d+)"
          value={data.totals.dormant}
          hint="Lojistas em risco de churn"
          icon={AlertTriangle}
          tone={data.totals.dormant > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pedidos (período)" value={data.totals.totalOrdersPeriod} icon={TrendingUp} />
        <StatCard
          label="Faturamento nos apps"
          value={formatCurrency(data.totals.totalRevenuePeriod)}
          hint="Pedidos entregues agregados"
          icon={Wallet}
        />
        <StatCard label="Sessões (período)" value={data.totals.totalSessionsPeriod} icon={Clock} />
        <StatCard label="Mesas cadastradas" value={data.totals.totalTables} icon={Building2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel p-5">
          <h3 className="font-semibold text-ink">Distribuição por plano</h3>
          <div className="mt-4 space-y-3">
            {(Object.keys(PLAN_LABELS) as PlatformPlan[]).map((plan) => (
              <div key={plan} className="flex items-center justify-between text-sm">
                <span className="text-muted">{PLAN_LABELS[plan]}</span>
                <span className="font-medium text-ink">{data.byPlan[plan]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/5 pt-4 text-xs text-muted">
            Inativos: {data.totals.inactive} · Suspensos: {data.totals.suspended}
          </div>
        </section>

        <section className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ink">Top faturamento (30d)</h3>
            <Link href="/platform/merchants" className="text-xs text-indigo-300 hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {data.topMerchantsByRevenue.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/platform/merchants/detail?id=${encodeURIComponent(m.id)}`}
                  className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-muted">{PLAN_LABELS[m.plan]}</p>
                  </div>
                  <span className="text-sm font-semibold text-brand">{formatCurrency(m.revenue30d)}</span>
                </Link>
              </li>
            ))}
            {data.topMerchantsByRevenue.length === 0 && (
              <li className="text-sm text-muted">Nenhum pedido no período.</li>
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel p-5">
          <h3 className="font-semibold text-ink">Cadastros recentes</h3>
          <p className="mt-1 text-xs text-muted">Onboarding via /admin/signup</p>
          <ul className="mt-4 space-y-3">
            {data.recentSignups.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/platform/merchants/detail?id=${encodeURIComponent(s.id)}`}
                  className="block rounded-xl px-2 py-2 hover:bg-white/5"
                >
                  <p className="text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-muted">
                    {new Date(s.createdAt).toLocaleDateString("pt-BR")} · {PLAN_LABELS[s.plan]}
                    {s.ownerEmail ? ` · ${s.ownerEmail}` : ""}
                  </p>
                </Link>
              </li>
            ))}
            {data.recentSignups.length === 0 && (
              <li className="text-sm text-muted">Nenhum cadastro no período.</li>
            )}
          </ul>
        </section>

        <section className="glass-panel p-5">
          <h3 className="font-semibold text-ink">Engajamento em risco</h3>
          <p className="mt-1 text-xs text-muted">Sem atividade há 14+ dias</p>
          <ul className="mt-4 space-y-3">
            {data.dormantMerchants.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/platform/merchants/detail?id=${encodeURIComponent(m.id)}`}
                  className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-muted">{PLAN_LABELS[m.plan]}</p>
                  </div>
                  <span className="text-xs font-medium text-warning">
                    {m.inactiveDays ?? "?"}d inativo
                  </span>
                </Link>
              </li>
            ))}
            {data.dormantMerchants.length === 0 && (
              <li className="text-sm text-muted">Nenhum lojista inativo prolongado.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
