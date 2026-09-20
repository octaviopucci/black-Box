"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { WaiterTableStatus } from "@/components/waiter/waiter-shell";
import { cn } from "@/lib/cn";
import type { Table, TableStatus } from "@/lib/types";

type OperationalTable = Table & {
  commandId?: string;
  guestCount: number;
  orderCount: number;
  assignedToMe: boolean;
};

export default function WaiterTablesPage() {
  const { fetchApi } = useAuth();
  const [tables, setTables] = useState<OperationalTable[]>([]);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchApi(`/admin/tables?operational=1&filter=${filter}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Falha ao carregar mesas");
      setTables(json.tables || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, [fetchApi, filter]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), 8000);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Mesas</h1>
        <p className="text-sm text-muted">Toque na mesa para operar</p>
      </div>

      <div className="flex gap-2">
        {(["all", "mine"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "min-h-11 flex-1 rounded-xl border text-sm font-medium",
              filter === value ? "border-brand bg-brand/15 text-brand" : "border-white/10 text-muted",
            )}
          >
            {value === "all" ? "Todas" : "Minhas mesas"}
          </button>
        ))}
      </div>

      {error && <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

      {loading && !tables.length ? (
        <p className="text-center text-sm text-muted py-8">Carregando mesas…</p>
      ) : (
        <div className="grid gap-3">
          {tables.map((table) => (
            <Link
              key={table.id}
              href={`/waiter/table?id=${encodeURIComponent(table.id)}`}
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">Mesa {table.number}</p>
                  <p className="text-sm text-muted">{table.name}</p>
                </div>
                <WaiterTableStatus status={table.status} />
              </div>
              <div className="mt-3 flex gap-4 text-xs text-muted">
                <span>{table.guestCount} cliente(s)</span>
                <span>{table.orderCount} pedido(s)</span>
                {table.assignedToMe && <span className="text-brand">Atribuída a mim</span>}
              </div>
            </Link>
          ))}
          {!tables.length && !loading && (
            <p className="py-8 text-center text-sm text-muted">Nenhuma mesa encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
