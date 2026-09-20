"use client";

import { useCallback, useEffect, useState } from "react";
import { QrCode, RefreshCw, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PASSWORD_POLICY_HINT } from "@/lib/password-policy";
import type { WaiterPermissions } from "@/lib/types";
import { WAITER_PERMISSION_KEYS } from "@/lib/waiter-permissions";

type WaiterRow = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  lastLoginAt?: string;
  permissions: WaiterPermissions;
};

export default function AdminWaitersPage() {
  const { fetchApi, session, refreshSession } = useAuth();
  const [waiters, setWaiters] = useState<WaiterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busyId, setBusyId] = useState("");
  const [activationUrl, setActivationUrl] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetchApi("/admin/waiters");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao carregar garçons");
      setLoading(false);
      return;
    }
    setWaiters(json.waiters || []);
    setLoading(false);
  }, [fetchApi]);

  useEffect(() => {
    void refreshSession();
    void load();
  }, [load, refreshSession]);

  const entitlements = session?.entitlements;
  const waiterAccess = entitlements?.features.waiter_access ?? false;
  const waitersLimit = entitlements?.limits.waiters;
  const waitersUsed = entitlements?.usage.waiters ?? waiters.length;
  const atWaiterLimit = waitersLimit !== null && waitersLimit !== undefined && waitersUsed >= waitersLimit;

  async function createWaiter(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFeedback("");
    const res = await fetchApi("/admin/waiters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: password || undefined }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha ao criar garçom");
      return;
    }
    setFormOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setFeedback("Garçom criado");
    void load();
  }

  async function toggleActive(waiter: WaiterRow) {
    setBusyId(waiter.id);
    const res = await fetchApi(`/admin/waiters/${waiter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !waiter.active }),
    });
    setBusyId("");
    if (res.ok) void load();
  }

  async function generateQr(waiterId: string) {
    setBusyId(waiterId);
    setActivationUrl("");
    const res = await fetchApi(`/admin/waiters/${waiterId}/activation-token`, { method: "POST" });
    const json = await res.json();
    setBusyId("");
    if (res.ok) {
      const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
      setActivationUrl(`${window.location.origin}${prefix}${json.activationUrl}`);
      setFeedback("QR/código gerado — válido 24h, sem senha embutida");
    } else {
      setError(json.error || "Falha ao gerar token");
    }
  }

  if (session?.user.role !== "OWNER" && session?.user.role !== "MANAGER") {
    return <p className="text-muted">Acesso restrito a administradores.</p>;
  }

  if (!waiterAccess) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Garçons</h1>
        <p className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          Seu plano atual não inclui acesso de garçons. Faça upgrade para Premium ou fale com a equipe NA MESA.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Garçons</h1>
          <p className="text-sm text-muted">
            Identidade individual · permissões · ativação QR
            {waitersLimit !== null && waitersLimit !== undefined && (
              <> · {waitersUsed}/{waitersLimit} ativos</>
            )}
          </p>
        </div>
        {!atWaiterLimit && (
          <Button onClick={() => setFormOpen(true)}>
            <UserPlus className="h-4 w-4" /> Novo garçom
          </Button>
        )}
      </div>

      {atWaiterLimit && (
        <p className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          Limite de garçons atingido ({waitersUsed}/{waitersLimit}). Solicite add-ons na NA MESA ou desative um garçom existente.
        </p>
      )}

      {feedback && <p className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{feedback}</p>}
      {error && <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      {activationUrl && (
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm">
          <p className="font-medium text-brand">Link de ativação (copie para QR)</p>
          <p className="mt-2 break-all font-mono text-xs">{activationUrl}</p>
        </div>
      )}

      {formOpen && (
        <form onSubmit={createWaiter} className="rounded-2xl border border-white/10 p-4 space-y-3">
          <h2 className="font-semibold">Novo garçom</h2>
          <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="E-mail login" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Senha (opcional — gera automática)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="text-xs text-muted">{PASSWORD_POLICY_HINT}</p>
          <div className="flex gap-2">
            <Button type="submit">Salvar</Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted">Carregando…</p>
      ) : (
        <div className="space-y-3">
          {waiters.map((waiter) => (
            <div key={waiter.id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{waiter.name}</p>
                  <p className="text-sm text-muted">{waiter.email}</p>
                  <p className="text-xs text-muted mt-1">
                    {waiter.active ? "Ativo" : "Inativo"}
                    {waiter.lastLoginAt ? ` · Último acesso ${new Date(waiter.lastLoginAt).toLocaleString("pt-BR")}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" loading={busyId === waiter.id} onClick={() => void generateQr(waiter.id)}>
                    <QrCode className="h-4 w-4" /> QR ativação
                  </Button>
                  <Button size="sm" variant="secondary" loading={busyId === waiter.id} onClick={() => void toggleActive(waiter)}>
                    {waiter.active ? "Desativar" : "Ativar"}
                  </Button>
                </div>
              </div>
              <details className="mt-3 text-xs text-muted">
                <summary className="cursor-pointer">Permissões</summary>
                <ul className="mt-2 grid grid-cols-2 gap-1">
                  {WAITER_PERMISSION_KEYS.map((key) => (
                    <li key={key}>{key}: {waiter.permissions[key] ? "sim" : "não"}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
          {!waiters.length && <p className="text-muted">Nenhum garçom cadastrado.</p>}
        </div>
      )}

      <Button variant="secondary" onClick={() => void load()}>
        <RefreshCw className="h-4 w-4" /> Atualizar
      </Button>
    </div>
  );
}
