"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { DEMO_ESTABLISHMENT_ID, DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";
import type { Table } from "@/lib/types";
import { cn } from "@/lib/cn";

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [commands, setCommands] = useState<Record<string, { total: number }>>({});

  const load = useCallback(async () => {
    const res = await fetch(apiUrl(`/admin/dashboard?slug=${DEMO_ESTABLISHMENT_SLUG}`));
    const json = await res.json();
    setTables(json.tables || []);
    const cmdMap: Record<string, { total: number }> = {};
    for (const c of json.commands || []) {
      const cmd = c as { id: string; total: number };
      cmdMap[cmd.id] = { total: cmd.total };
    }
    setCommands(cmdMap);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(DEMO_ESTABLISHMENT_ID, load);

  const statusColor: Record<string, string> = {
    LIVRE: "bg-success/20 text-success",
    OCUPADA: "bg-brand/20 text-brand",
    AGUARDANDO_PAGAMENTO: "bg-warning/20 text-warning",
    RESERVADA: "bg-purple-500/20 text-purple-300",
    INATIVA: "bg-muted/20 text-muted",
  };

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">Mesas</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((t) => (
          <div key={t.id} className="rounded-2xl border border-white/5 bg-surface-2 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-lg font-bold">Mesa {t.number}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColor[t.status])}>
                {t.status}
              </span>
            </div>
            <p className="text-sm text-muted">Capacidade: {t.capacity}</p>
            {t.commandId && commands[t.commandId] && (
              <p className="mt-2 font-semibold text-brand">{formatCurrency(commands[t.commandId].total)}</p>
            )}
            <Link
              href={`/m/${DEMO_ESTABLISHMENT_SLUG}/${t.qrToken}`}
              className="mt-3 inline-block text-xs text-brand hover:underline"
            >
              Abrir cardápio demo →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
