"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { OPERATION_MODES } from "@/lib/operation-modes";
import type { Establishment, OperationMode } from "@/lib/types";

type SettingsDraft = {
  name: string;
  tagline: string;
  open: boolean;
  operationMode: OperationMode;
  rodizioEnabled: boolean;
  otpRequired: boolean;
};

function toDraft(establishment: Establishment): SettingsDraft {
  return {
    name: establishment.name,
    tagline: establishment.tagline || "",
    open: establishment.open,
    operationMode: establishment.operationMode || "a_la_carte",
    rodizioEnabled: establishment.rodizioEnabled,
    otpRequired: establishment.settings.otpRequired !== false,
  };
}

export default function AdminSettingsPage() {
  const { session, authHeaders, setSession } = useAuth();
  const [draft, setDraft] = useState<SettingsDraft | null>(session ? toDraft(session.establishment) : null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(apiUrl("/admin/settings"), { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar os ajustes.");
      setDraft(toDraft(json.establishment));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar os ajustes.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || !session) return;
    if (!draft.name.trim()) {
      setError("Informe o nome do estabelecimento.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const response = await fetch(apiUrl("/admin/settings"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          name: draft.name.trim(),
          tagline: draft.tagline.trim(),
          open: draft.open,
          operationMode: draft.operationMode,
          rodizioEnabled: draft.rodizioEnabled,
          settings: { otpRequired: draft.otpRequired },
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível salvar os ajustes.");
      setDraft(toDraft(json.establishment));
      setSession({ ...session, establishment: json.establishment });
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Falha ao salvar os ajustes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Administração</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">Ajustes</h1>
        <p className="mt-1 text-sm text-muted">Identidade e comportamento operacional do estabelecimento.</p>
      </header>

      {loading && !draft ? (
        <div className="space-y-4"><div className="skeleton h-56 rounded-2xl" /><div className="skeleton h-64 rounded-2xl" /></div>
      ) : (
        <form onSubmit={save} className="space-y-5">
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              <span>{error}</span>{!draft && <Button type="button" size="sm" variant="ghost" onClick={load}>Tentar novamente</Button>}
            </div>
          )}
          {saved && <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Ajustes salvos com sucesso.</div>}

          {draft && (
            <>
              <section className="glass-card p-5 sm:p-6">
                <h2 className="mb-4 font-bold">Estabelecimento</h2>
                <div className="grid gap-4">
                  <label><span className="mb-1.5 block text-xs font-medium text-muted">Nome</span><Input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
                  <label><span className="mb-1.5 block text-xs font-medium text-muted">Frase de apresentação</span><Input value={draft.tagline} onChange={(event) => setDraft({ ...draft, tagline: event.target.value })} placeholder="Comida boa, do seu jeito" /></label>
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-muted">Modo de operação</span>
                    <Select
                      value={draft.operationMode}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          operationMode: event.target.value as OperationMode,
                          rodizioEnabled:
                            event.target.value === "rodizio" ? true : draft.rodizioEnabled,
                        })
                      }
                    >
                      {OPERATION_MODES.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-surface/50 p-4">
                    <span><span className="block text-sm font-semibold">Aceitando pedidos</span><span className="mt-0.5 block text-xs text-muted">O cardápio informa se a casa está aberta.</span></span>
                    <input type="checkbox" checked={draft.open} onChange={(event) => setDraft({ ...draft, open: event.target.checked })} className="h-5 w-5 shrink-0 accent-brand" />
                  </label>
                  <label className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-surface/50 p-4">
                    <span><span className="block text-sm font-semibold">Rodízio ativo</span><span className="mt-0.5 block text-xs text-muted">Habilita rodadas e cardápio de rodízio.</span></span>
                    <input type="checkbox" checked={draft.rodizioEnabled} onChange={(event) => setDraft({ ...draft, rodizioEnabled: event.target.checked })} className="h-5 w-5 shrink-0 accent-brand" />
                  </label>
                  <label className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-surface/50 p-4">
                    <span><span className="block text-sm font-semibold">OTP no login do cliente</span><span className="mt-0.5 block text-xs text-muted">Exige verificação por WhatsApp/SMS ao entrar na mesa.</span></span>
                    <input type="checkbox" checked={draft.otpRequired} onChange={(event) => setDraft({ ...draft, otpRequired: event.target.checked })} className="h-5 w-5 shrink-0 accent-brand" />
                  </label>
                </div>
              </section>

              <div className="flex justify-end">
                <Button type="submit" loading={saving}><Save className="mr-2 h-4 w-4" /> Salvar ajustes</Button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
