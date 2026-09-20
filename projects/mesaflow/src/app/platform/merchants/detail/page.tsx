"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { usePlatformAuth } from "@/contexts/platform-auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { catalogSeedMetaForEstablishment } from "@/lib/catalog-seed-registry";
import {
  FEATURE_LABELS,
  LIMIT_LABELS,
  type PlatformFeature,
  type PlatformLimit,
} from "@/lib/platform-entitlements";
import { PLAN_LABELS, PLAN_OPTIONS } from "@/lib/platform-plans";
import { PLATFORM_STATUS_LABELS } from "@/lib/platform-status";
import type { PlanOverrides, PlatformPlan, PlatformStatus } from "@/lib/types";

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
  entitlements?: {
    plan: PlatformPlan;
    features: Record<PlatformFeature, boolean>;
    limits: Record<PlatformLimit, number | null>;
    usage: { waiters: number; tables: number; staffUsers: number };
    waiterAccess: boolean;
    waitersLimit: number | null;
    waitersUsed: number;
    tablesLimit: number | null;
    tablesUsed: number;
    staffUsersLimit: number | null;
    staffUsersUsed: number;
  };
  planOverrides?: PlanOverrides;
  analyticsToday: { sales: { revenue: number; ordersCount: number } };
  analytics7d: { sales: { revenue: number; ordersCount: number } };
  analytics30d: { sales: { revenue: number; ordersCount: number; paymentsCollected: number } };
};

const STATUS_ACTIONS: { status: PlatformStatus; label: string; variant?: "primary" | "secondary" }[] = [
  { status: "active", label: "Aprovar / Ativar", variant: "primary" },
  { status: "pending", label: "Marcar pendente" },
  { status: "rejected", label: "Rejeitar" },
  { status: "inactive", label: "Desativar" },
  { status: "suspended", label: "Suspender" },
];

function PlatformMerchantDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { fetchApi } = usePlatformAuth();
  const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlatformPlan>("essencial");
  const [importingCatalog, setImportingCatalog] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [overrideDraft, setOverrideDraft] = useState<PlanOverrides>({});
  const [overridesDirty, setOverridesDirty] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setMerchant(null);
      return;
    }
    setLoading(true);
    const res = await fetchApi(`/platform/merchants/${id}`);
    const json = await res.json();
    if (res.ok) {
      setMerchant(json.merchant);
      setSelectedPlan(json.merchant.plan);
      setOverrideDraft(json.merchant.planOverrides || {});
      setOverridesDirty(false);
    } else {
      setMerchant(null);
    }
    setLoading(false);
  }, [fetchApi, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function patchMerchant(body: Record<string, unknown>) {
    if (!merchant || !id) return;
    setSaving(true);
    setError("");
    const res = await fetchApi(`/platform/merchants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao atualizar");
      setSaving(false);
      return;
    }
    setMerchant(json.merchant);
    setSelectedPlan(json.merchant.plan);
    setSaving(false);
  }

  async function updateStatus(status: PlatformStatus) {
    const needsReason = status === "suspended" || status === "rejected";
    const reason = needsReason
      ? window.prompt(
          status === "rejected" ? "Motivo da rejeição (opcional):" : "Motivo da suspensão (opcional):",
        ) || undefined
      : undefined;
    await patchMerchant({ platformStatus: status, reason });
  }

  async function savePlan() {
    if (!merchant || selectedPlan === merchant.plan) return;
    await patchMerchant({ plan: selectedPlan });
  }

  function setFeatureOverride(feature: PlatformFeature, value: boolean | undefined) {
    setOverrideDraft((prev) => {
      const features = { ...prev.features };
      if (value === undefined) delete features[feature];
      else features[feature] = value;
      return { ...prev, features: Object.keys(features).length ? features : undefined };
    });
    setOverridesDirty(true);
  }

  function setLimitOverride(limit: PlatformLimit, value: number | null | undefined) {
    setOverrideDraft((prev) => {
      const limits = { ...prev.limits };
      if (value === undefined) delete limits[limit];
      else limits[limit] = value;
      return { ...prev, limits: Object.keys(limits).length ? limits : undefined };
    });
    setOverridesDirty(true);
  }

  async function saveOverrides() {
    if (!merchant) return;
    const hasOverrides =
      (overrideDraft.features && Object.keys(overrideDraft.features).length > 0) ||
      (overrideDraft.limits && Object.keys(overrideDraft.limits).length > 0);
    await patchMerchant({ planOverrides: hasOverrides ? overrideDraft : null });
    setOverridesDirty(false);
  }

  async function importCatalogSeed() {
    if (!merchant || !id) return;
    const seed = catalogSeedMetaForEstablishment(merchant);
    if (!seed) return;
    if (
      !window.confirm(
        `Importar cardápio ${seed.label} neste lojista? Categorias e produtos atuais serão substituídos.`,
      )
    ) {
      return;
    }
    setImportingCatalog(true);
    setImportMessage("");
    setError("");
    const res = await fetchApi(`/platform/merchants/${id}/import-catalog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao importar cardápio.");
      setImportingCatalog(false);
      return;
    }
    setImportMessage(`Cardápio importado: ${json.categories} categorias, ${json.products} produtos.`);
    setImportingCatalog(false);
  }

  if (!id) {
    return (
      <p className="text-sm text-danger">
        ID do lojista ausente.{" "}
        <Link href="/platform/merchants" className="text-indigo-300 hover:underline">
          Voltar à lista
        </Link>
      </p>
    );
  }

  if (loading) return <p className="text-sm text-muted">Carregando lojista…</p>;
  if (!merchant) return <p className="text-sm text-danger">Lojista não encontrado.</p>;

  const catalogSeed = catalogSeedMetaForEstablishment(merchant);

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

      {importMessage && (
        <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {importMessage}
        </p>
      )}

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-ink">Importar cardápio</h3>
        {catalogSeed ? (
          <>
            <p className="mt-1 text-xs text-muted">{catalogSeed.description}</p>
            <p className="mt-2 text-xs text-muted">
              Seed disponível: <strong className="text-ink">{catalogSeed.label}</strong>
            </p>
            <Button
              className="mt-4"
              size="sm"
              variant="secondary"
              disabled={importingCatalog}
              onClick={importCatalogSeed}
            >
              {importingCatalog ? "Importando…" : `Importar cardápio ${catalogSeed.label}`}
            </Button>
          </>
        ) : (
          <p className="mt-1 text-xs text-muted">
            Nenhum cardápio seed registrado para este lojista. Quando houver um seed em código para
            este estabelecimento, o botão de importação aparecerá aqui.
          </p>
        )}
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-ink">Aprovação e status</h3>
        <p className="mt-1 text-xs text-muted">
          Status atual:{" "}
          <strong className="text-ink">{PLATFORM_STATUS_LABELS[merchant.platformStatus]}</strong>
          {merchant.suspendedReason ? ` — ${merchant.suspendedReason}` : ""}
        </p>
        {merchant.platformStatus === "pending" && (
          <p className="mt-2 text-sm text-warning">
            Este lojista concluiu o cadastro e aguarda aprovação para operar o painel admin.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {STATUS_ACTIONS.map(({ status, label, variant }) => (
            <Button
              key={status}
              size="sm"
              variant={merchant.platformStatus === status ? "primary" : variant ?? "secondary"}
              disabled={saving || merchant.platformStatus === status}
              onClick={() => updateStatus(status)}
              className={cn(
                status === "active" && merchant.platformStatus !== status && "hover:bg-success/20",
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {merchant.entitlements && (
        <div className="glass-panel p-5">
          <h3 className="font-semibold text-ink">Entitlements (plano + uso)</h3>
          <p className="mt-1 text-xs text-muted">
            Plano efetivo: <strong className="text-ink">{PLAN_LABELS[merchant.entitlements.plan]}</strong>
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Limites · uso</p>
              <ul className="mt-2 space-y-2 text-sm">
                {(["waiters", "tables", "staff_users"] as PlatformLimit[]).map((limit) => {
                  const max = merchant.entitlements!.limits[limit];
                  const used =
                    limit === "waiters"
                      ? merchant.entitlements!.usage.waiters
                      : limit === "tables"
                        ? merchant.entitlements!.usage.tables
                        : merchant.entitlements!.usage.staffUsers;
                  return (
                    <li key={limit} className="flex justify-between rounded-lg bg-surface-2 px-3 py-2">
                      <span>{LIMIT_LABELS[limit]}</span>
                      <span className="font-medium text-ink">
                        {used}/{max === null ? "∞" : max}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Features comerciais</p>
              <ul className="mt-2 space-y-1 text-sm">
                {(
                  ["waiter_access", "advanced_reports", "integrations", "multi_unit"] as PlatformFeature[]
                ).map((feature) => (
                  <li key={feature} className="flex justify-between rounded-lg bg-surface-2 px-3 py-2">
                    <span>{FEATURE_LABELS[feature]}</span>
                    <span className={merchant.entitlements!.features[feature] ? "text-success" : "text-muted"}>
                      {merchant.entitlements!.features[feature] ? "ligado" : "desligado"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-ink">Overrides de entitlement</h3>
        <p className="mt-1 text-xs text-muted">
          Ajustes manuais para piloto ou negociação comercial. Sobrescrevem o plano base.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Features</p>
            <div className="mt-2 space-y-2">
              {(["waiter_access", "integrations", "advanced_reports", "multi_unit"] as PlatformFeature[]).map(
                (feature) => (
                  <label key={feature} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm">
                    <span>{FEATURE_LABELS[feature]}</span>
                    <select
                      value={
                        overrideDraft.features?.[feature] === undefined
                          ? ""
                          : overrideDraft.features[feature]
                            ? "1"
                            : "0"
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        setFeatureOverride(
                          feature,
                          v === "" ? undefined : v === "1",
                        );
                      }}
                      className="rounded-lg border border-white/10 bg-surface px-2 py-1 text-xs"
                    >
                      <option value="">(plano)</option>
                      <option value="1">ligado</option>
                      <option value="0">desligado</option>
                    </select>
                  </label>
                ),
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Limites</p>
            <div className="mt-2 space-y-2">
              {(["waiters", "tables", "staff_users"] as PlatformLimit[]).map((limit) => (
                <label key={limit} className="block rounded-lg bg-surface-2 px-3 py-2 text-sm">
                  <span className="text-muted">{LIMIT_LABELS[limit]}</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="(plano / ∞ se vazio custom)"
                    value={overrideDraft.limits?.[limit] ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setLimitOverride(limit, raw === "" ? undefined : Number(raw));
                    }}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface px-2 py-1 text-sm"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
        <Button className="mt-4" size="sm" disabled={saving || !overridesDirty} onClick={() => void saveOverrides()}>
          Salvar overrides
        </Button>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-ink">Plano comercial</h3>
        <p className="mt-1 text-xs text-muted">
          Plano atual: <strong className="text-ink">{PLAN_LABELS[merchant.plan]}</strong>
          {merchant.planStartedAt
            ? ` · desde ${new Date(merchant.planStartedAt).toLocaleDateString("pt-BR")}`
            : ""}
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value as PlatformPlan)}
            className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-sm text-ink"
          >
            {PLAN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            disabled={saving || selectedPlan === merchant.plan}
            onClick={() => savePlan()}
          >
            Salvar plano
          </Button>
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

export default function PlatformMerchantDetailPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Carregando lojista…</p>}>
      <PlatformMerchantDetailContent />
    </Suspense>
  );
}
