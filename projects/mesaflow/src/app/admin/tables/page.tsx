"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Pencil, Plus, QrCode, RotateCw, Trash2, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl, parseApiJson, staffFetch } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { Table, TableStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

const STATUS: Record<TableStatus, { label: string; color: string }> = {
  LIVRE: { label: "Livre", color: "bg-success/15 text-success" },
  OCUPADA: { label: "Ocupada", color: "bg-brand/15 text-brand" },
  AGUARDANDO_PAGAMENTO: { label: "Aguardando pagamento", color: "bg-warning/15 text-warning" },
  RESERVADA: { label: "Reservada", color: "bg-brand-soft/15 text-brand-soft" },
  INATIVA: { label: "Inativa", color: "bg-white/5 text-muted" } };

type Draft = { number: string; name: string; capacity: string; status: TableStatus };
const EMPTY: Draft = { number: "", name: "", capacity: "4", status: "LIVRE" };

export default function AdminTablesPage() {
  const { session, fetchApi } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editing, setEditing] = useState<Table | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchApi("/admin/tables", { });
      const json = (await parseApiJson(response)) as { tables?: Table[]; error?: string };
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar as mesas.");
      setTables(json.tables || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar as mesas.");
    } finally {
      setLoading(false);
    }
  }, [fetchApi]);

  useEffect(() => {
    void load();
  }, [load]);

  const menuPath = (table: Table) =>
    `/m/${encodeURIComponent(session?.establishment.slug || "")}/${encodeURIComponent(table.qrToken)}`;

  function absoluteMenuUrl(table: Table) {
    const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return `${window.location.origin}${prefix}${menuPath(table)}`;
  }

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY);
    setError("");
    setFormOpen(true);
  }

  function openEdit(table: Table) {
    setEditing(table);
    setDraft({ number: table.number, name: table.name, capacity: String(table.capacity), status: table.status });
    setError("");
    setFormOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const capacity = Number(draft.capacity);
    if (!draft.number.trim() || !Number.isFinite(capacity) || capacity < 1) {
      setError("Informe o número da mesa e uma capacidade válida.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetchApi(editing ? `/admin/tables/${encodeURIComponent(editing.id)}` : "/admin/tables", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, number: draft.number.trim(), name: draft.name.trim(), capacity }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível salvar a mesa.");
      setFormOpen(false);
      setFeedback(editing ? "Mesa atualizada." : "Mesa criada com QR Code.");
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Falha ao salvar a mesa.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(table: Table) {
    if (!window.confirm(`Excluir a Mesa ${table.number}? Esta ação não pode ser desfeita.`)) return;
    setBusyId(table.id);
    setError("");
    try {
      const response = await fetchApi(`/admin/tables/${encodeURIComponent(table.id)}`, { method: "DELETE" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível excluir a mesa.");
      setFeedback("Mesa excluída.");
      await load();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Falha ao excluir a mesa.");
    } finally {
      setBusyId("");
    }
  }

  async function regenerate(table: Table) {
    if (!window.confirm(`Gerar um novo QR Code para a Mesa ${table.number}? O código anterior deixará de funcionar.`)) return;
    setBusyId(table.id);
    setError("");
    try {
      const response = await fetchApi(`/admin/tables/${encodeURIComponent(table.id)}/regenerate-qr`, { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível gerar um novo QR Code.");
      setTables((current) => current.map((item) => item.id === table.id ? json.table : item));
      setFeedback("QR Code renovado. Atualize os materiais impressos.");
    } catch (regenerateError) {
      setError(regenerateError instanceof Error ? regenerateError.message : "Falha ao renovar o QR Code.");
    } finally {
      setBusyId("");
    }
  }

  async function activate(table: Table) {
    setBusyId(table.id);
    setError("");
    try {
      const response = await fetchApi(`/admin/tables/${encodeURIComponent(table.id)}/activate`, { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível ativar a mesa.");
      setFeedback(`Mesa ${table.number} ativada — comanda aberta.`);
      await load();
    } catch (activateError) {
      setError(activateError instanceof Error ? activateError.message : "Falha ao ativar mesa.");
    } finally {
      setBusyId("");
    }
  }

  async function copyLink(table: Table) {
    try {
      await navigator.clipboard.writeText(absoluteMenuUrl(table));
      setFeedback(`Link da Mesa ${table.number} copiado.`);
    } catch {
      setError("O navegador não permitiu copiar o link.");
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Salão</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">Mesas</h1>
          <p className="mt-1 text-sm text-muted">Gerencie acesso, capacidade e QR Codes.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Nova mesa</Button>
      </header>

      {feedback && <div className="mb-4 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{feedback}</div>}
      {error && !formOpen && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          <span>{error}</span><Button variant="ghost" size="sm" onClick={load}>Tentar novamente</Button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : tables.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <QrCode className="mx-auto mb-3 h-9 w-9 text-muted" />
          <p className="font-semibold">Nenhuma mesa cadastrada</p>
          <p className="mt-1 text-sm text-muted">Crie uma mesa e o QR Code será gerado automaticamente.</p>
          <Button className="mt-5" onClick={openCreate}>Criar primeira mesa</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <article key={table.id} className="glass-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xl font-bold">Mesa {table.number}</p>{table.name && <p className="text-xs text-muted">{table.name}</p>}</div>
                  <span className={cn("rounded-full px-2 py-1 text-[10px] font-semibold", STATUS[table.status].color)}>{STATUS[table.status].label}</span>
                </div>
                <p className="mt-4 text-sm text-muted">{table.capacity} {table.capacity === 1 ? "lugar" : "lugares"}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => copyLink(table)} className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-3 px-2 py-2 text-xs text-muted hover:text-ink"><Copy className="h-3.5 w-3.5" /> Copiar link</button>
                  <Link href={menuPath(table)} target="_blank" className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-3 px-2 py-2 text-xs text-muted hover:text-ink"><ExternalLink className="h-3.5 w-3.5" /> Cardápio</Link>
                </div>
                {table.status === "LIVRE" || table.status === "RESERVADA" ? (
                  <button
                    type="button"
                    disabled={busyId === table.id}
                    onClick={() => void activate(table)}
                    className="mt-2 w-full rounded-lg bg-success/15 px-2 py-2 text-xs font-semibold text-success hover:bg-success/20 disabled:opacity-50"
                  >
                    Ativar mesa
                  </button>
                ) : null}
                {(table.status === "OCUPADA" || table.status === "AGUARDANDO_PAGAMENTO") && (
                  <Link
                    href={`/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`}
                    className="mt-2 flex items-center justify-center rounded-lg bg-brand/15 px-2 py-2 text-xs font-semibold text-brand hover:bg-brand/20"
                  >
                    Abrir cockpit
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-3 border-t border-white/5">
                <button disabled={busyId === table.id} onClick={() => openEdit(table)} className="flex justify-center p-3 text-muted hover:bg-white/5 hover:text-ink" aria-label={`Editar Mesa ${table.number}`}><Pencil className="h-4 w-4" /></button>
                <button disabled={busyId === table.id} onClick={() => regenerate(table)} className="flex justify-center border-x border-white/5 p-3 text-muted hover:bg-white/5 hover:text-brand" aria-label={`Renovar QR da Mesa ${table.number}`}><RotateCw className={cn("h-4 w-4", busyId === table.id && "animate-spin")} /></button>
                <button disabled={busyId === table.id} onClick={() => remove(table)} className="flex justify-center p-3 text-danger hover:bg-danger/5" aria-label={`Excluir Mesa ${table.number}`}><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 sm:items-center sm:justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="table-form-title">
          <form onSubmit={save} className="w-full rounded-t-3xl border border-white/10 bg-surface-2 p-5 sm:max-w-md sm:rounded-3xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="table-form-title" className="text-xl font-bold">{editing ? `Editar Mesa ${editing.number}` : "Nova mesa"}</h2>
              <button type="button" aria-label="Fechar" onClick={() => setFormOpen(false)} className="rounded-lg p-2 text-muted"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Número</span><Input required value={draft.number} onChange={(event) => setDraft({ ...draft, number: event.target.value })} placeholder="12" /></label>
              <label><span className="mb-1.5 block text-xs font-medium text-muted">Capacidade</span><Input required type="number" min="1" value={draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: event.target.value })} /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-muted">Nome opcional</span><Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Varanda" /></label>
              {editing && <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-muted">Status</span><Select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as TableStatus })}>{Object.entries(STATUS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</Select></label>}
            </div>
            {error && <p className="mt-4 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button>
              <Button type="submit" loading={saving}>{editing ? "Salvar" : "Criar mesa"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
