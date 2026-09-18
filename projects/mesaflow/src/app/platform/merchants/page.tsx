"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { usePlatformAuth } from "@/contexts/platform-auth-context";
import { apiUrl, staffFetch } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { PLAN_LABELS } from "@/lib/platform-plans";
import type { PlatformPlan, PlatformStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";

type Merchant = {
  id: string;
  slug: string;
  name: string;
  plan: PlatformPlan;
  platformStatus: PlatformStatus;
  createdAt: string;
  tablesCount: number;
  ordersTotal: number;
  revenue30d: number;
  lastActivityAt: string | null;
  inactiveDays: number | null;
  isDormant: boolean;
  owner: { name: string; email: string; lastLoginAt?: string } | null;
};

const STATUS_LABELS: Record<PlatformStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
  suspended: "Suspenso" };

const STATUS_STYLES: Record<PlatformStatus, string> = {
  active: "bg-success/10 text-success ring-success/20",
  inactive: "bg-muted/10 text-muted ring-white/10",
  suspended: "bg-danger/10 text-danger ring-danger/20" };

export default function PlatformMerchantsPage() {
  const { fetchApi } = usePlatformAuth();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<PlatformStatus | "all">("all");
  const [plan, setPlan] = useState<PlatformPlan | "all">("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status !== "all") params.set("status", status);
    if (plan !== "all") params.set("plan", plan);
    const res = await fetchApi(`/platform/merchants?${params}`);
    const json = await res.json();
    if (res.ok) setMerchants(json.merchants);
    setLoading(false);
  }, [fetchApi, q, status, plan]);

  useEffect(() => {
    const timer = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, q]);

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h2 className="text-2xl font-bold text-ink">Lojistas</h2>
        <p className="mt-1 text-sm text-muted">
          Estabelecimentos clientes da plataforma NA MESA — dados reais do store.
        </p>
      </div>

      <div className="glass-panel flex flex-wrap gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nome, slug ou e-mail…"
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PlatformStatus | "all")}
          className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-sm text-ink"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="suspended">Suspensos</option>
        </select>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as PlatformPlan | "all")}
          className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-sm text-ink"
        >
          <option value="all">Todos os planos</option>
          <option value="essencial">Essencial</option>
          <option value="premium">Premium</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Carregando lojistas…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Estabelecimento</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Mesas</th>
                <th className="px-4 py-3">Fat. 30d</th>
                <th className="px-4 py-3">Última atividade</th>
                <th className="px-4 py-3">Cadastro</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/platform/merchants/detail?id=${encodeURIComponent(m.id)}`}
                      className="font-medium text-ink hover:text-indigo-300"
                    >
                      {m.name}
                    </Link>
                    <p className="text-xs text-muted">{m.slug}</p>
                    {m.owner && <p className="text-xs text-muted">{m.owner.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted">{PLAN_LABELS[m.plan]}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                        STATUS_STYLES[m.platformStatus],
                      )}
                    >
                      {STATUS_LABELS[m.platformStatus]}
                    </span>
                    {m.isDormant && m.platformStatus === "active" && (
                      <span className="ml-1 text-[10px] text-warning">· inativo {m.inactiveDays}d</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{m.tablesCount}</td>
                  <td className="px-4 py-3 font-medium text-ink">{formatCurrency(m.revenue30d)}</td>
                  <td className="px-4 py-3 text-muted">
                    {m.lastActivityAt
                      ? new Date(m.lastActivityAt).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(m.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/m/${m.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:underline"
                    >
                      Vitrine
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {merchants.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted">Nenhum lojista encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
