"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { usePlatformAuth } from "@/contexts/platform-auth-context";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { PLAN_LABELS } from "@/lib/platform-plans";
import type { PlatformPlan, PlatformStatus } from "@/lib/types";

type MerchantDetail = {
  id: string;
  slug: string;
  name: string;
  businessType?: string;
  operationMode?: string;
  plan: PlatformPlan;
  platformStatus: PlatformStatus;
  suspendedReason?: string;
  createdAt: string;
  planStartedAt: string;
  tablesCount: number;
  ordersTotal: number;
  sessionsTotal: number;
  activeSessions: number;
  lastActivityAt: string | null;
  inactiveDays: number | null;
  revenue30d: number;
  orders30d: number;
  paymentsCollected30d: number;
  annualPlanValue: number;
  owner: { name: string; email: string; lastLoginAt?: string } | null;
  tables: Array<{ id: string; number: string; name: string; status: string; capacity: number }>;
  staff: Array<{ id: string; name: string; email: string; role: string; active: boolean; lastLoginAt?: string }>;
  analyticsToday: { sales: { revenue: number; ordersCount: number } };
  analytics7d: { sales: { revenue: number; ordersCount: number } };
  analytics30d: { sales: { revenue: number; ordersCount: number; paymentsCollected: number } };
};

const STATUS_OPTIONS: PlatformStatus[] = ["active", "inactive", "suspended"];

export default function PlatformMerchantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { authHeaders } = usePlatformAuth();
  const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiUrl(`/platform/merchants/${id}`), { headers: authHeaders() });
    const json = await res.json();
    if (res.ok) setMerchant(json.merchant);
    setLoading(false);
  }, [authHeaders, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(status: PlatformStatus) {
    if (!merchant) return;
    const reason =
      status === "suspended"
        ? window.prompt("Motivo da suspensão (opcional):") || undefined
        : undefined;
    setSaving(true);
    setError("");
    const res = await fetch(apiUrl(`/platform/merchants/${id}`), {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ platformStatus: status, reason }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao atualizar");
      setSaving(false);
      return;
    }
    setMerchant(json.merchant);
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-muted">Carregando lojista…</p>;
  if (!merchant) return <p className="text-sm text-danger">Lojista não encontrado.</p>;

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <Link
        href="/platform/merchants"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar à lista
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink">{merchant.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {merchant.slug} · {PLAN_LABELS[merchant.plan]} · cadastro{" "}
            {new Date(merchant.createdAt).toLocaleDateString("pt-BR")}
          </p>
          {merchant.owner && (
            <p className="mt-1 text-sm text-muted">
              Responsável: {merchant.owner.name} ({merchant.owner.email})
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/m/${merchant.slug}`} target="_blank">
            <Button variant="secondary" size="sm">
              Abrir vitrine
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="secondary" size="sm">
              Painel lojista
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-ink">Ações administrativas</h3>
        <p className="mt-1 text-xs text-muted">
          Status atual: <strong className="text-ink">{merchant.platformStatus}</strong>
          {merchant.suspendedReason ? ` — ${merchant.suspendedReason}` : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={merchant.platformStatus === status ? "primary" : "secondary"}
              disabled={saving || merchant.platformStatus === status}
              onClick={() => updateStatus(status)}
              className={cn(status === "active" && merchant.platformStatus !== status && "hover:bg-success/20")}
            >
              {status === "active" ? "Ativar" : status === "inactive" ? "Desativar" : "Suspender"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Mesas", value: merchant.tablesCount },
          { label: "Pedidos totais", value: merchant.ordersTotal },
          { label: "Sessões", value: `${merchant.activeSessions} ativas / ${merchant.sessionsTotal}` },
          {
            label: "Última atividade",
            value: merchant.lastActivityAt
              ? new Date(merchant.lastActivityAt).toLocaleString("pt-BR")
              : "—",
          },
        ].map((item) => (
          <div key={item.label} className="glass-panel p-4">
            <p className="text-xs uppercase tracking-wider text-muted">{item.label}</p>
            <p className="mt-2 text-lg font-bold text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { label: "Hoje", data: merchant.analyticsToday.sales },
          { label: "7 dias", data: merchant.analytics7d.sales },
          { label: "30 dias", data: merchant.analytics30d.sales },
        ].map(({ label, data }) => (
          <div key={label} className="glass-panel p-4">
            <p className="text-xs uppercase tracking-wider text-muted">Faturamento · {label}</p>
            <p className="mt-2 text-xl font-bold text-brand">{formatCurrency(data.revenue)}</p>
            <p className="mt-1 text-xs text-muted">{data.ordersCount} pedidos</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel p-5">
          <h3 className="font-semibold text-ink">Mesas ({merchant.tables.length})</h3>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
            {merchant.tables.map((t) => (
              <li key={t.id} className="flex justify-between rounded-lg bg-surface-2 px-3 py-2">
                <span>{t.name}</span>
                <span className="text-muted">{t.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-panel p-5">
          <h3 className="font-semibold text-ink">Equipe ({merchant.staff.length})</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {merchant.staff.map((u) => (
              <li key={u.id} className="rounded-lg bg-surface-2 px-3 py-2">
                <p className="font-medium text-ink">
                  {u.name} · {u.role}
                </p>
                <p className="text-xs text-muted">
                  {u.email}
                  {u.lastLoginAt
                    ? ` · login ${new Date(u.lastLoginAt).toLocaleDateString("pt-BR")}`
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass-panel p-5">
        <h3 className="font-semibold text-ink">Receita da plataforma</h3>
        <p className="mt-2 text-sm text-muted">
          Valor anual do plano:{" "}
          <strong className="text-ink">{formatCurrency(merchant.annualPlanValue)}</strong>
        </p>
        <p className="mt-1 text-sm text-muted">
          Faturamento gerado no app (30d):{" "}
          <strong className="text-ink">{formatCurrency(merchant.revenue30d)}</strong> · Pagamentos
          registrados: {formatCurrency(merchant.paymentsCollected30d)}
        </p>
      </section>
    </div>
  );
}
