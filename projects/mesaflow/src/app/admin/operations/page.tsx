"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ShieldAlert, UserX } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { staffFetch } from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { Command, GuestParticipation, Table } from "@/lib/types";
import { Button } from "@/components/ui/button";

type ActiveTableRow = {
  table: Table;
  command: Command | null;
  participants: GuestParticipation[];
};

type OperationsData = {
  activeTables: ActiveTableRow[];
  staleParticipations: GuestParticipation[];
};

export default function AdminOperationsPage() {
  const { fetchApi } = useAuth();
  const [data, setData] = useState<OperationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchApi("/admin/operations", { });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar o controle operacional.");
      setData({
        activeTables: json.activeTables || [],
        staleParticipations: json.staleParticipations || [] });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar operações.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchApi]);

  useEffect(() => {
    void load();
  }, [load]);

  async function kick(participationId: string, label: string) {
    if (!window.confirm(`Remover ${label} da mesa?`)) return;
    setBusy(`kick:${participationId}`);
    setError("");
    setFeedback("");
    try {
      const response = await fetchApi(`/admin/guests/${encodeURIComponent(participationId)}/kick`, { method: "POST" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível remover o convidado.");
      setFeedback(`${label} removido(a) da mesa.`);
      await load();
    } catch (kickError) {
      setError(kickError instanceof Error ? kickError.message : "Falha ao remover convidado.");
    } finally {
      setBusy("");
    }
  }

  async function forceClear(table: Table) {
    if (
      !window.confirm(
        `Forçar liberar a Mesa ${table.number}? Sessões ativas serão encerradas e a mesa ficará livre.`,
      )
    ) {
      return;
    }
    setBusy(`clear:${table.id}`);
    setError("");
    setFeedback("");
    try {
      const response = await fetchApi(`/admin/tables/${encodeURIComponent(table.id)}/force-clear`, { method: "POST" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Não foi possível liberar a mesa.");
      setFeedback(`Mesa ${table.number} liberada.`);
      await load();
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : "Falha ao liberar mesa.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Operação</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">Controle operacional</h1>
          <p className="mt-1 text-sm text-muted">Mesas ativas, participantes e sessões órfãs.</p>
        </div>
        <Button variant="secondary" onClick={() => void load()} loading={loading && Boolean(data)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {feedback && (
        <div className="mb-4 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
          {feedback}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="skeleton h-64 rounded-2xl" />
      ) : (
        <div className="space-y-6">
          {data && data.staleParticipations.length > 0 && (
            <section className="glass-card border border-warning/25 p-6">
              <div className="mb-4 flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="font-semibold">Sessões potencialmente órfãs</h2>
              </div>
              <p className="mb-4 text-sm text-muted">
                Participações abertas há mais de 12h ou vinculadas a comandas já fechadas.
              </p>
              <ul className="space-y-2">
                {data.staleParticipations.map((gp) => {
                  const label = gp.displayName || `Participante ${gp.participantIndex}`;
                  return (
                    <li
                      key={gp.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-surface/50 px-3 py-2.5 text-sm"
                    >
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-muted">
                          Entrou {formatTime(gp.joinedAt)}
                          {gp.comandaNumber ? ` · Comanda ${gp.comandaNumber}` : ""}
                          {gp.phoneDisplay ? ` · ${gp.phoneDisplay}` : ""}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={busy === `kick:${gp.id}`}
                        onClick={() => void kick(gp.id, label)}
                      >
                        <UserX className="mr-1.5 h-3.5 w-3.5" />
                        Remover
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section>
            <div className="mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-brand" />
              <h2 className="font-semibold">Mesas ativas</h2>
            </div>

            {!data || data.activeTables.length === 0 ? (
              <div className="glass-card p-8 text-center text-sm text-muted">
                Nenhuma mesa ocupada no momento.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {data.activeTables.map(({ table, command, participants }) => (
                  <article key={table.id} className="glass-card p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">Mesa {table.number}</h3>
                        <p className="text-xs text-muted">
                          {table.status}
                          {command ? ` · Comanda ${command.status}` : " · Sem comanda"}
                          {participants.length > 0
                            ? ` · ${participants.length} participante${participants.length === 1 ? "" : "s"}`
                            : ""}
                        </p>
                      </div>
                      <Link
                        href={`/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`}
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        Cockpit
                      </Link>
                    </div>

                    {participants.length === 0 ? (
                      <p className="mb-4 text-sm text-muted">Sem participantes ativos nesta mesa.</p>
                    ) : (
                      <ul className="mb-4 space-y-2">
                        {participants.map((gp) => {
                          const label = gp.displayName || `Participante ${gp.participantIndex}`;
                          return (
                            <li
                              key={gp.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-surface/40 px-3 py-2 text-sm"
                            >
                              <div>
                                <p className="font-medium">{label}</p>
                                <p className="text-xs text-muted">
                                  {gp.phoneDisplay || "Sem telefone"}
                                  {gp.comandaNumber ? ` · Comanda ${gp.comandaNumber}` : ""}
                                  {" · "}
                                  {gp.orderCount} pedido{gp.orderCount === 1 ? "" : "s"}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="secondary"
                                loading={busy === `kick:${gp.id}`}
                                onClick={() => void kick(gp.id, label)}
                              >
                                <UserX className="mr-1.5 h-3.5 w-3.5" />
                                Kick
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <Button
                      className="w-full"
                      variant="secondary"
                      loading={busy === `clear:${table.id}`}
                      onClick={() => void forceClear(table)}
                    >
                      Forçar liberar mesa
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
